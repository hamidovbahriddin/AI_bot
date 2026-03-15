const userService = require('../services/userService.service');

// Cache uchun
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 daqiqa

module.exports = (bot) => {
  // Har bir xabarda foydalanuvchini kuzatish (optimallashtirilgan)
  bot.use(async (ctx, next) => {
    try {
      // Foydalanuvchi ma'lumotlarini olish
      const user = ctx.from;
      
      if (user) {
        const userId = user.id;
        const now = Date.now();
        
        // Cache tekshirish
        const cached = userCache.get(userId);
        if (cached && (now - cached.timestamp) < CACHE_TTL) {
          // Faqat xabar sonini oshirish
          cached.messageCount++;
          if (ctx.message?.voice || ctx.message?.audio) {
            cached.audioCount++;
          }
          return next();
        }
        
        // Yangi ma'lumotlar tayyorlash
        const userData = {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          languageCode: user.language_code,
          isBot: user.is_bot,
          messageCount: 1,
          audioCount: ctx.message?.voice || ctx.message?.audio ? 1 : 0
        };
        
        // Avvalgi ma'lumotlarni olish
        const existingUsers = userService.getAllUsers();
        const existingUser = existingUsers.find(u => u.id === user.id);
        
        if (existingUser) {
          // Mavjud foydalanuvchini yangilash
          userData.messageCount = (existingUser.messageCount || 0) + 1;
          userData.audioCount = (existingUser.audioCount || 0) + (ctx.message?.voice || ctx.message?.audio ? 1 : 0);
          userData.isPremium = existingUser.isPremium;
          userData.isBlocked = existingUser.isBlocked;
        }
        
        // Cache ga saqlash
        userCache.set(userId, {
          ...userData,
          timestamp: now
        });
        
        // Asinxron saqlash (botni to'xtatmaslik uchun)
        setImmediate(() => {
          userService.saveUser(userData);
        });
      }
    } catch (error) {
      console.error('User tracker xato:', error);
    }
    
    return next();
  });
};
