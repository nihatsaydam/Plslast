const mongoose = require('mongoose');

/**
 * Otel bazında Ask model oluşturma fonksiyonu
 * @param {mongoose.Connection} connection - Otel veritabanı bağlantısı
 * @param {string} collectionName - Koleksiyon adı
 * @returns {mongoose.Model} - Ask modeli
 */
module.exports = function createModel(connection, collectionName = 'Ask') {
  const schema = new mongoose.Schema({
    roomNumber: { type: String, required: true },
    message: { type: String, required: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    status: { 
      type: String, 
      enum: ['waiting', 'Active', 'complate'], 
      default: 'waiting' 
    },
    createdAt: { type: Date, default: Date.now }
  });

  return connection.model('Ask', schema, collectionName);
}; 