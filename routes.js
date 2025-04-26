// routes.js
const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

// Housekeeping rotaları
router.post('/housekeeping/save-cleaning-option', controllers.housekeeping.saveCleaningOption);
router.get('/housekeeping/cleaning-records', controllers.housekeeping.getCleaningRecords);
router.patch('/housekeeping/cleaning-records/:id', controllers.housekeeping.updateCleaningStatus);

// CartOrder rotaları
router.post('/cart/save', controllers.cartOrder.saveCart);
router.put('/cart/update-status/:id', controllers.cartOrder.updateCartStatus);
router.get('/cart/orders', controllers.cartOrder.getCartOrders);

// Diğer modüller için rotaları buraya ekleyin
// ...

module.exports = router; 