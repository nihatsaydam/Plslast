const mongoose = require('mongoose');

/**
 * Otel bazında HousekeepingRequest model oluşturma fonksiyonu
 * @param {mongoose.Connection} connection - Otel veritabanı bağlantısı
 * @param {string} collectionName - Koleksiyon adı
 * @returns {mongoose.Model} - HousekeepingRequest modeli
 */
module.exports = function createModel(connection, collectionName = 'housekeepingRequest') {
  const schema = new mongoose.Schema({
    roomNumber: { type: Number, required: true },
    requestType: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'pending' },
    requestedAt: { type: Date, default: Date.now }
  });

  return connection.model('HousekeepingRequest', schema, collectionName);
}; 