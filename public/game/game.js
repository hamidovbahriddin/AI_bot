class FlappyBirdGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.highScore = localStorage.getItem('flappyHighScore') || 0;
        this.gameRunning = false;
        this.gameStarted = false;
        
        // Qush xususiyatlari
        this.bird = {
            x: 100,
            y: 300,
            width: 34,
            height: 24,
            velocity: 0,
            gravity: 0.5,
            jump: -8,
            rotation: 0
        };
        
        // Quvurlar
        this.pipes = [];
        this.pipeWidth = 60;
        this.pipeGap = 150;
        this.pipeSpeed = 2;
        this.pipeInterval = 1500; // millisekund
        this.lastPipeTime = 0;
        
        // Orqa fon
        this.background = {
            x: 0,
            speed: 1
        };
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.setupEventListeners();
        
        // High score ni ko'rsatish
        document.getElementById('highScore').textContent = this.highScore;
        
        // Start screen ni ko'rsatish
        this.showStartScreen();
        
        // Telegram WebApp ni tekshirish
        if (window.Telegram && window.Telegram.WebApp) {
            console.log('Telegram WebApp detected');
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    }
    
    setupEventListeners() {
        // Desktop
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (!this.gameStarted) {
                    this.startGame();
                } else {
                    this.jump();
                }
            }
        });
        
        // Mobil
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.gameStarted) {
                this.startGame();
            } else {
                this.jump();
            }
        });
        
        this.canvas.addEventListener('click', () => {
            if (!this.gameStarted) {
                this.startGame();
            } else {
                this.jump();
            }
        });
        
        // Play button
        const playButton = document.getElementById('playButton');
        if (playButton) {
            playButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.startGame();
            });
        }
        
        // Restart button
        const restartButton = document.getElementById('restartButton');
        if (restartButton) {
            restartButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.restart();
            });
        }
    }
    
    showStartScreen() {
        document.getElementById('startScreen').style.display = 'flex';
        document.getElementById('gameOver').style.display = 'none';
        this.gameStarted = false;
        this.gameRunning = false;
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameStarted = true;
        this.score = 0;
        this.bird.y = 300;
        this.bird.velocity = 0;
        this.bird.rotation = 0;
        this.pipes = [];
        this.lastPipeTime = Date.now();
        
        // Start screen ni yashirish
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
        
        document.getElementById('score').textContent = this.score;
        
        this.gameLoop();
    }
    
    jump() {
        if (this.gameRunning && this.gameStarted) {
            this.bird.velocity = this.bird.jump;
        }
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Qushni yangilash
        this.bird.velocity += this.bird.gravity;
        this.bird.y += this.bird.velocity;
        
        // Qushning burchagini yangilash
        this.bird.rotation = Math.min(Math.max(this.bird.velocity * 3, -30), 90);
        
        // Orqa fonni siljitish
        this.background.x -= this.background.speed;
        if (this.background.x <= -this.canvas.width) {
            this.background.x = 0;
        }
        
        // Quvurlarni yangilash
        this.updatePipes();
        
        // To'qnashlarni tekshirish
        this.checkCollisions();
    }
    
    updatePipes() {
        const currentTime = Date.now();
        
        // Yangi quvurlarni qo'shish
        if (currentTime - this.lastPipeTime > this.pipeInterval) {
            const pipeY = Math.random() * (this.canvas.height - this.pipeGap - 100) + 50;
            
            this.pipes.push({
                x: this.canvas.width,
                y: pipeY,
                width: this.pipeWidth,
                height: pipeY,
                passed: false
            });
            
            this.lastPipeTime = currentTime;
        }
        
        // Quvurlarni siljitish
        this.pipes.forEach(pipe => {
            pipe.x -= this.pipeSpeed;
            
            // Score ni oshirish
            if (!pipe.passed && pipe.x + pipe.width < this.bird.x) {
                pipe.passed = true;
                this.score++;
                document.getElementById('score').textContent = this.score;
                
                // Score oshganda tovush
                this.playScoreSound();
            }
        });
        
        // O'tib ketgan quvurlarni o'chirish
        this.pipes = this.pipes.filter(pipe => pipe.x + pipe.width > 0);
    }
    
    checkCollisions() {
        // Yerga tegish
        if (this.bird.y + this.bird.height > this.canvas.height - 50) {
            this.gameOver();
            return;
        }
        
        // Tomonga tegish
        if (this.bird.y < 0) {
            this.bird.y = 0;
            this.bird.velocity = 0;
        }
        
        // Quvurlarga tegish
        this.pipes.forEach(pipe => {
            if (this.bird.x < pipe.x + pipe.width &&
                this.bird.x + this.bird.width > pipe.x &&
                this.bird.y < pipe.y + pipe.height &&
                this.bird.y + this.bird.height > pipe.y) {
                this.gameOver();
            }
            
            // Pastki quvurga tegish
            if (this.bird.x < pipe.x + pipe.width &&
                this.bird.x + this.bird.width > pipe.x &&
                this.bird.y + this.bird.height > pipe.y + pipe.height + this.pipeGap) {
                this.gameOver();
            }
        });
    }
    
    draw() {
        // Orqa fon
        this.drawBackground();
        
        // Quvurlar
        this.drawPipes();
        
        // Qush
        this.drawBird();
    }
    
    drawBackground() {
        // Osmon
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Bulutlar
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 3; i++) {
            const x = (this.background.x + i * 200) % (this.canvas.width + 100);
            const y = 50 + i * 30;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Yer
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
        
        // O't
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, this.canvas.height - 45, this.canvas.width, 5);
    }
    
    drawBird() {
        this.ctx.save();
        this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2);
        this.ctx.rotate(this.bird.rotation * Math.PI / 180);
        
        // Qush tanasi
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Qush tanasi
        this.ctx.fillStyle = '#FFA500';
        this.ctx.beginPath();
        this.ctx.arc(0, -5, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ko'z
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(-3, -2, 2, 0, Math.PI * 2);
        this.ctx.arc(3, -2, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Qanot
        this.ctx.fillStyle = '#FF6347';
        this.ctx.beginPath();
        this.ctx.moveTo(-10, 0);
        this.ctx.lineTo(-20, -5);
        this.ctx.lineTo(-15, 5);
        this.ctx.lineTo(-5, 3);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(10, 0);
        this.ctx.lineTo(20, -5);
        this.ctx.lineTo(15, 5);
        this.ctx.lineTo(5, 3);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawPipes() {
        this.pipes.forEach(pipe => {
            // Yuqori quvur
            const topGradient = this.ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
            topGradient.addColorStop(0, '#228B22');
            topGradient.addColorStop(1, '#32CD32');
            this.ctx.fillStyle = topGradient;
            this.ctx.fillRect(pipe.x, 0, pipe.width, pipe.height);
            
            // Pastki quvur
            const bottomGradient = this.ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
            bottomGradient.addColorStop(0, '#228B22');
            bottomGradient.addColorStop(1, '#32CD32');
            this.ctx.fillStyle = bottomGradient;
            this.ctx.fillRect(pipe.x, pipe.y + pipe.height + this.pipeGap, pipe.width, this.canvas.height - pipe.y - pipe.height - this.pipeGap - 50);
            
            // Quvur chetlari
            this.ctx.strokeStyle = '#1B5E20';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pipe.x, 0, pipe.width, pipe.height);
            this.ctx.strokeRect(pipe.x, pipe.y + pipe.height + this.pipeGap, pipe.width, this.canvas.height - pipe.y - pipe.height - this.pipeGap - 50);
        });
    }
    
    playScoreSound() {
        // Simple tovush effekti (Web Audio API)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Tovush xato:', error);
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        
        // High score ni yangilash
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('flappyHighScore', this.highScore);
            document.getElementById('highScore').textContent = this.highScore;
        }
        
        // Telegramga score yuborish
        if (window.telegramGame) {
            window.telegramGame.sendScore(this.score);
        }
        
        // Game over ekranini ko'rsatish
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'flex';
        
        // Game over tovushi
        this.playGameOverSound();
    }
    
    playGameOverSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 200;
            oscillator.type = 'sawtooth';
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Game over tovush xato:', error);
        }
    }
    
    restart() {
        this.startGame();
    }
}

// O'yinni ishga tushirish
window.addEventListener('DOMContentLoaded', () => {
    // Telegram WebApp yuklangandan keyin o'yinni ishga tushirish
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready(() => {
            window.game = new FlappyBirdGame();
        });
    } else {
        window.game = new FlappyBirdGame();
    }
});
