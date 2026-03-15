const env = require('../config/env');

module.exports = (bot) => {
  // /game komandasi - Telegram Game API orqali
  bot.command('game', async (ctx) => {
    try {
      console.log('Game command called by:', ctx.from.id);
      
      const gameShortName = env.GAME_SHORT_NAME;
      const gameUrl = env.GAME_URL;
      
      console.log('Game short name:', gameShortName);
      console.log('Game URL:', gameUrl);
      
      // Agar game short name bo'lmasa, WebApp yuboramiz
      if (!gameShortName || gameShortName === 'birds_game') {
        console.log('Using WebApp fallback - no proper game short name');
        await ctx.reply(
          '🎮 **FLAPPY BIRD**\n\n' +
          '🐦 **O\'yin haqida:**\n' +
          '• Quvurlardan o\'tib ball yig\'ing\n' +
          '• Qushni pastga tushirmang\n' +
          '• High score yig\'ing\n\n' +
          '🎮 **Boshqarish:**\n' +
          '• 📱 Mobil: Ekranga bosing\n' +
          '• ⌨️ Kompyuter: Space yoki ↑\n\n' +
          '🎯 **O\'yni boshlash uchun PLAY tugmasini bosing!**',
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🎮 PLAY', web_app: { url: gameUrl } }
                ]
              ]
            }
          }
        );
        console.log('WebApp sent successfully');
        return;
      }
      
      // Telegram Game API orqali game yuborish
      await ctx.sendGame(gameShortName, {
        disable_notification: false,
        reply_to_message_id: ctx.message.message_id
      });
      
      console.log('Game sent successfully via Telegram Game API');
    } catch (error) {
      console.error('Game command xato:', error);
      
      // Fallback sifatida WebApp yuboramiz
      try {
        const gameUrl = env.GAME_URL;
        await ctx.reply(
          '🎮 **FLAPPY BIRD**\n\n' +
          '🐦 **O\'yin haqida:**\n' +
          '• Quvurlardan o\'tib ball yig\'ing\n' +
          '• Qushni pastga tushirmang\n' +
          '• High score yig\'ing\n\n' +
          '🎮 **Boshqarish:**\n' +
          '• 📱 Mobil: Ekranga bosing\n' +
          '• ⌨️ Kompyuter: Space yoki ↑\n\n' +
          '🎯 **O\'yni boshlash uchun PLAY tugmasini bosing!**',
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🎮 PLAY', web_app: { url: gameUrl } }
                ]
              ]
            }
          }
        );
        console.log('Fallback WebApp sent successfully');
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        await ctx.reply('❌ O\'yinni ochishda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.');
      }
    }
  });
  
  // Game callback query - o'yin natijalari
  bot.on('callback_query', async (ctx) => {
    try {
      // Game callback querylarini qayta ishlash
      if (ctx.callbackQuery.game_short_name) {
        console.log('Game callback received:', ctx.callbackQuery.game_short_name);
        await ctx.answerCbQuery();
      }
    } catch (error) {
      console.error('Game callback error:', error);
    }
  });
  
  // Game message handler
  bot.on('game', async (ctx) => {
    try {
      console.log('Game message received');
      // Game message uchun maxsus logika
    } catch (error) {
      console.error('Game message error:', error);
    }
  });
};
