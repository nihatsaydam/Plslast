const housekeepingController = require('./housekeeping');
const cartOrderController = require('./cartOrder');

// Tüm controllerları dışa aktarıyoruz
module.exports = {
  housekeeping: housekeepingController,
  cartOrder: cartOrderController
}; 