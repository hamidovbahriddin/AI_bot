// Telegram Game API integration
class TelegramGame {
    constructor() {
        this.gameUrl = window.location.href;
        this.init();
    }
    
    init() {
        // Telegram WebApp ni initializatsiya qilish
        if (window.Telegram && window.Telegram.WebApp) {
            this.telegram = window.Telegram.WebApp;
            this.telegram.ready();
            this.telegram.expand();
            
            // Telegram WebApp sozlamalari
            this.telegram.setHeaderColor('#667eea');
            this.telegram.setBackgroundColor('#667eea');
            
            console.log('Telegram WebApp initialized');
        }
        
        // O'yinni yuklash
        this.loadGame();
    }
    
    loadGame() {
        // Flappy Bird o'yinini yuklash
        const script = document.createElement('script');
        script.src = 'game.js';
        script.onload = () => {
            console.log('Game loaded successfully');
        };
        script.onerror = () => {
            console.error('Failed to load game');
        };
        document.head.appendChild(script);
    }
    
    // Game natijasini Telegramga yuborish
    sendScore(score) {
        if (this.telegram) {
            this.telegram.sendData(JSON.stringify({
                type: 'game_score',
                score: score,
                timestamp: Date.now()
            }));
        }
    }
    
    // Game holatini yangilash
    updateGameState(state) {
        if (this.telegram) {
            this.telegram.sendData(JSON.stringify({
                type: 'game_state',
                state: state,
                timestamp: Date.now()
            }));
        }
    }
}

// Telegram Game initialization
window.TelegramGame = TelegramGame;

// Global game instance
window.telegramGame = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.telegramGame = new TelegramGame();
});
