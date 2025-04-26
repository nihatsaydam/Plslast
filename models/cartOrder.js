const mongoose = require('mongoose');

/**
 * Otel bazında CartOrder model oluşturma fonksiyonu
 * @param {mongoose.Connection} connection - Otel veritabanı bağlantısı
 * @param {string} collectionName - Koleksiyon adı
 * @returns {mongoose.Model} - CartOrder modeli
 */
module.exports = function createModel(connection, collectionName = 'cartOrders') {
  const schema = new mongoose.Schema({
    username: { type: String, required: true },
    roomNumber: { type: String, required: true },
    cartItems: { type: Array, required: true },
    status: { 
      type: String, 
      enum: ['waiting', 'active', 'completed'], 
      default: 'waiting' 
    },
    timestamp: { type: Date, default: Date.now }
  });

  return connection.model('CartOrder', schema, collectionName);
}; 