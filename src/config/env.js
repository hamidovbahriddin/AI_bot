require('dotenv').config();

module.exports = {
  // Bot sozlamlari
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_USERNAME: process.env.BOT_USERNAME,
  DEFAULT_CHANNEL_USERNAME: process.env.DEFAULT_CHANNEL_USERNAME || '@backend_dev1',
  NEWS_CRON: process.env.NEWS_CRON || '0 10 */2 * *',
  NEWS_ADMIN_IDS: process.env.NEWS_ADMIN_IDS ? process.env.NEWS_ADMIN_IDS.split(',').map(id => id.trim()) : [],
  
  // Super Admin
  SUPER_ADMIN_ID: process.env.SUPER_ADMIN_ID || '',
  
  // Admin panel
  BROADCAST_ENABLED: process.env.BROADCAST_ENABLED === 'true',
  USER_BLOCKING_ENABLED: process.env.USER_BLOCKING_ENABLED === 'true',
  PREMIUM_ENABLED: process.env.PREMIUM_ENABLED === 'true',
  STATS_ENABLED: process.env.STATS_ENABLED === 'true',
  AUTOPOST_ENABLED: process.env.AUTOPOST_ENABLED === 'true',
  
  // Server
  RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL,
  PORT: process.env.PORT || 10000,
  
  // AI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  
  // Telegram Game API
  GAME_SHORT_NAME: process.env.GAME_SHORT_NAME || 'birds_game',
  GAME_URL: process.env.GAME_URL || 'https://one-tgbot.onrender.com/game/',
  
  // Creator
  CREATOR_NAME: process.env.CREATOR_NAME || 'Bahriddin',
  CREATOR_USERNAME: process.env.CREATOR_USERNAME || '@bakhridd1n_dev',
  CREATOR_BIO: process.env.CREATOR_BIO || 'Backend developer',
  CREATOR_STACK: process.env.CREATOR_STACK || 'Node.js Backend Developer',
  CREATOR_CHANNEL: process.env.CREATOR_CHANNEL || '@backend_dev1'
};
