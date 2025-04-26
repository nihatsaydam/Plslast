const mongoose = require('mongoose');

/**
 * Otel bazında Chat (Concierge) model oluşturma fonksiyonu
 * @param {mongoose.Connection} connection - Otel veritabanı bağlantısı
 * @param {string} collectionName - Koleksiyon adı
 * @returns {mongoose.Model} - Chat modeli
 */
module.exports = function createModel(connection, collectionName = 'Concierge') {
  const schema = new mongoose.Schema({
    roomNumber: { type: String, required: true },
    username: { type: String, required: true, default: 'Unknown' },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['waiting', 'active', 'resolved'], 
      default: 'waiting' 
    },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    timestamp: { type: Date, default: Date.now }
  });

  return connection.model('Chat', schema, collectionName);
}; 