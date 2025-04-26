const mongoose = require('mongoose');

/**
 * Otel bazında RoomService model oluşturma fonksiyonu
 * @param {mongoose.Connection} connection - Otel veritabanı bağlantısı
 * @param {string} collectionName - Koleksiyon adı
 * @returns {mongoose.Model} - RoomService modeli
 */
module.exports = function createModel(connection, collectionName = 'RoomService') {
  const schema = new mongoose.Schema({
    roomNumber: { type: String, required: true },
    username: { type: String, required: true, default: "Unknown" },
    items: [{
      name: { type: String, required: true },
      price: { type: String, required: true },
      quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    serviceTime: { type: Number, required: true },
    serviceTimeLabel: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['waiting', 'active', 'completed'], 
      default: 'waiting' 
    },
    createdAt: { type: Date, default: Date.now }
  });

  return connection.model('RoomService', schema, collectionName);
}; 