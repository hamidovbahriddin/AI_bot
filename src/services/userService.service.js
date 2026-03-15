const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Cache uchun
let cachedUsers = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30 * 1000; // 30 soniya

// Data papkani yaratish
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Cache ni tozalash
function clearCache() {
  cachedUsers = null;
  cacheTimestamp = 0;
}

// Foydalanuvchilarni cache dan olish
function getCachedUsers() {
  const now = Date.now();
  if (cachedUsers && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedUsers;
  }
  
  // Cache ni yangilash
  ensureDataDir();
  
  if (!fs.existsSync(USERS_FILE)) {
    cachedUsers = [];
  } else {
    try {
      cachedUsers = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch (error) {
      console.error('Users faylini o\'qish xato:', error);
      cachedUsers = [];
    }
  }
  
  cacheTimestamp = now;
  return cachedUsers;
}

// Foydalanuvchilarni saqlash (optimallashtirilgan)
function saveUser(userData) {
  ensureDataDir();
  
  const users = getCachedUsers();
  const existingUserIndex = users.findIndex(u => u.id === userData.id);
  
  if (existingUserIndex >= 0) {
    // Mavjud foydalanuvchini yangilash
    users[existingUserIndex] = {
      ...users[existingUserIndex],
      ...userData,
      lastSeen: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } else {
    // Yangi foydalanuvchi qo'shish
    users.push({
      ...userData,
      joined: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  // Cache ni yangilash
  cachedUsers = users;
  
  // Asinxron yozish
  setImmediate(() => {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error('Users faylini yozish xato:', error);
    }
  });
  
  return true;
}

// Barcha foydalanuvchilarni olish (cache dan)
function getAllUsers() {
  return getCachedUsers().sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));
}

// Foydalanuvchini qidirish (optimallashtirilgan)
function searchUser(query) {
  const users = getCachedUsers();
  const searchStr = query.toLowerCase();
  
  return users.filter(user => {
    return (
      user.id.toString().includes(searchStr) ||
      (user.username && user.username.toLowerCase().includes(searchStr)) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchStr)) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchStr))
    );
  });
}

// Faol foydalanuvchilarni olish (optimallashtirilgan)
function getActiveUsers() {
  const users = getCachedUsers();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return users.filter(user => {
    const lastSeen = new Date(user.lastSeen);
    return lastSeen >= sevenDaysAgo;
  });
}

// Yangi foydalanuvchilarni olish (optimallashtirilgan)
function getNewUsers() {
  const users = getCachedUsers();
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  return users.filter(user => {
    const joined = new Date(user.joined);
    return joined >= oneDayAgo;
  });
}

// Statistikani olish (optimallashtirilgan)
function getStats() {
  const users = getCachedUsers();
  const activeUsers = getActiveUsers();
  const newUsers = getNewUsers();
  
  return {
    totalUsers: users.length,
    activeUsers: activeUsers.length,
    newUsers: newUsers.length,
    premiumUsers: users.filter(u => u.isPremium).length,
    blockedUsers: users.filter(u => u.isBlocked).length
  };
}

// Foydalanuvchini bloklash (optimallashtirilgan)
function blockUser(userId) {
  const users = getCachedUsers();
  const userIndex = users.findIndex(u => u.id.toString() === userId.toString());
  
  if (userIndex >= 0) {
    users[userIndex].isBlocked = true;
    users[userIndex].blockedAt = new Date().toISOString();
    users[userIndex].updatedAt = new Date().toISOString();
    
    // Asinxron yozish
    setImmediate(() => {
      try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      } catch (error) {
        console.error('Block user xato:', error);
      }
    });
    
    return true;
  }
  
  return false;
}

// Foydalanuvchini blokdan chiqarish (optimallashtirilgan)
function unblockUser(userId) {
  const users = getCachedUsers();
  const userIndex = users.findIndex(u => u.id.toString() === userId.toString());
  
  if (userIndex >= 0) {
    delete users[userIndex].isBlocked;
    delete users[userIndex].blockedAt;
    users[userIndex].updatedAt = new Date().toISOString();
    
    // Asinxron yozish
    setImmediate(() => {
      try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      } catch (error) {
        console.error('Unblock user xato:', error);
      }
    });
    
    return true;
  }
  
  return false;
}

module.exports = {
  saveUser,
  getAllUsers,
  searchUser,
  getActiveUsers,
  getNewUsers,
  getStats,
  blockUser,
  unblockUser,
  clearCache
};
