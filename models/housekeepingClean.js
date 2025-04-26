const mongoose = require('mongoose');

/**
 * Otel bazında model oluşturma fonksiyonu
 * @param {mongoose.Connection} connection - Otel veritabanı bağlantısı
 * @param {string} collectionName - Koleksiyon adı
 * @returns {mongoose.Model} - Housekeeping Clean modeli
 */
module.exports = function createModel(connection, collectionName = 'housekeepingclean') {
  const schema = new mongoose.Schema({
    cleaningOption: { type: String, required: true },
    username: { type: String, required: true },
    roomNumber: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['waiting', 'active', 'completed'], 
      default: 'waiting' 
    }
  });

  return connection.model('HousekeepingClean', schema, collectionName);
}; 