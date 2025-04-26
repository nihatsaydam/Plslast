// models/index.js
const HousekeepingClean = require('./housekeepingClean');
const CartOrder = require('./cartOrder');
const Tech = require('./tech');
const Chat = require('./chat');
const BellboyRequest = require('./bellboyRequest');
const Laundry = require('./laundry');
const RoomService = require('./roomService');
const Complain = require('./complain');
const Ask = require('./ask');
const Cart = require('./cart');
const HousekeepingRequest = require('./housekeepingRequest');

// Tüm modelleri dışa aktarıyoruz
module.exports = {
  HousekeepingClean,
  CartOrder,
  Tech,
  Chat,
  BellboyRequest,
  Laundry,
  RoomService,
  Complain,
  Ask,
  Cart,
  HousekeepingRequest
}; 