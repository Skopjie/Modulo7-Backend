const redisClient = require('../config/redisClient');

async function checkCache(req, res, next) {
  const cacheKey = req.cacheKey;
  if (!cacheKey) {
    return next();
  }

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }
    next();
  } catch (error) {
    console.error('Redis error in checkCache:', error);
    next(); 
  }
}

async function clearCache(keys) {
  if (!keys) return;
  const arr = Array.isArray(keys) ? keys : [keys];
  for (const key of arr) {
    try {
      await redisClient.del(key);
    } catch (err) {
      console.error(`Failed to clear Redis key "${key}":`, err);
    }
  }
}

module.exports = { checkCache, clearCache };
