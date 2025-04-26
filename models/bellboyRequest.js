const mongoose = require('mongoose');

/**
 * Otel bazında BellboyRequest model oluşturma fonksiyonu
 * @param {mongoose.Connection} connection - Otel veritabanı bağlantısı
 * @param {string} collectionName - Koleksiyon adı
 * @returns {mongoose.Model} - BellboyRequest modeli
 */
module.exports = function createModel(connection, collectionName = 'BellboyRequest') {
  const schema = new mongoose.Schema({
    roomNumber: { type: String, required: true },
    username: { type: String, required: true },
    clickType: { type: String, required: true },
    details: { type: String },
    selectedTime: { type: Date },
    status: { type: String, default: 'waiting' }
  }, { timestamps: true });

  return connection.model('BellboyRequest', schema, collectionName);
}; 