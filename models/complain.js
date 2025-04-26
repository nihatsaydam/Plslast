const mongoose = require('mongoose');

/**
 * Otel bazında Complain model oluşturma fonksiyonu
 * @param {mongoose.Connection} connection - Otel veritabanı bağlantısı
 * @param {string} collectionName - Koleksiyon adı
 * @returns {mongoose.Model} - Complain modeli
 */
module.exports = function createModel(connection, collectionName = 'Complain') {
  const schema = new mongoose.Schema({
    roomNumber: { type: String, required: true },
    username: { type: String, required: true, default: 'Unknown' },
    message: { type: String, required: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    status: { 
      type: String, 
      enum: ['waiting', 'active', 'completed'], 
      default: 'waiting' 
    },
    timestamp: { type: Date, default: Date.now }
  });

  return connection.model('Complain', schema, collectionName);
}; 