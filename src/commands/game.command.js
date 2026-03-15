const { Markup } = require('telegraf');
const env = require('../config/env');

module.exports = (bot) => {
  bot.command('game', async (ctx) => {
    try {
      const gameUrl = `${env.RENDER_EXTERNAL_URL}/game/`;
      
      await ctx.reply(
        '🎮 **QUSH O\'YINI**\n\n' +
        '📱 **O\'yin xususiyatlari:**\n' +
        '• 🐦 Qushni boshqarish - space yoki ↑ tugmasi\n' +
        '• 🚧 Quvurlardan o\'tish - ular orasidan o\'tish\n' +
        '• 📊 Har quvurdan ball olish\n' +
        '• 🏆 High score saqlanadi\n' +
        '• 🎨 Chiroyli dizayn va animatsiyalar\n\n' +
        '🎮 **Boshqarish:**\n' +
        '• 📱 Mobil: Ekranga bosing\n' +
        '• ⌨️ Kompyuter: Space yoki ↑ tugmasini bosing\n\n' +
        '🌐 **O\'yinni ochish:**\n\n' +
        `🔗 [O\'yni boshlash](${gameUrl})\n\n` +
        '🎯 Omad!',
        Markup.inlineKeyboard([
          [Markup.button.url('🎮 O\'yni boshlash', gameUrl)],
          [Markup.button.callbackQuery('📊 Statistika', 'game_stats')]
        ])
      );
    } catch (error) {
      console.error('Game command xato:', error);
      await ctx.reply('❌ O\'yinni ochishda xatolik yuz berdi.');
    }
  });
  
  // Statistika callback
  bot.action('game_stats', async (ctx) => {
    await ctx.answerCbQuery();
    
    // Bu yerda o'yin statistikasini olish kerak
    await ctx.reply(
      '📊 **O\'YIN STATISTIKASI**\n\n' +
      '🏆 **Yuqori natijalar:**\n' +
      '• 🥇 1-o\'rin: 125 ball\n' +
      '• 🥈 2-o\'rin: 98 ball\n' +
      '• 🥉 3-o\'rin: 76 ball\n\n' +
      '📈 **Oxirgi o\'yinlar:**\n' +
      '• Bugun: 15 ta o\'yin\n' +
      '• Jami o\'yinchilar: 234 ta\n' +
      '• O\'rtacha ball: 45.6\n\n' +
      '🎯 **Qayta o\'ynash uchun:**\n' +
      '/game - o\'yinni qayta ochish',
      Markup.keyboard([['/game', '/start']]).resize()
    );
  });
};
