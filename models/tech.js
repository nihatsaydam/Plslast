const mongoose = require('mongoose');

/**
 * Otel bazında Tech model oluşturma fonksiyonu
 * @param {mongoose.Connection} connection - Otel veritabanı bağlantısı
 * @param {string} collectionName - Koleksiyon adı
 * @returns {mongoose.Model} - Tech modeli
 */
module.exports = function createModel(connection, collectionName = 'Tech') {
  const schema = new mongoose.Schema({
    roomNumber: { type: String, required: true },
    username: { type: String, required: true, default: 'Unknown' },
    message: { type: String, required: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    language: { type: String, default: 'unknown' },
    timestamp: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['waiting', 'active', 'completed'], 
      default: 'waiting' 
    }
  });

  return connection.model('Tech', schema, collectionName);
}; 