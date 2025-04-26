const mongoose = require('mongoose');

/**
 * Otel bazında Cart model oluşturma fonksiyonu
 * @param {mongoose.Connection} connection - Otel veritabanı bağlantısı
 * @param {string} collectionName - Koleksiyon adı
 * @returns {mongoose.Model} - Cart modeli
 */
module.exports = function createModel(connection, collectionName = 'Cart') {
  const schema = new mongoose.Schema({
    items: [{
      productName: String,
      quantity: Number,
      price: Number
    }],
    totalPrice: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  });

  return connection.model('Cart', schema, collectionName);
}; 