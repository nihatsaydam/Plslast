const hotelConfig = require('../config/hotelConfig');
const modelCreators = require('../models');

// Yeni sepet siparişi oluşturma
exports.saveCart = async (req, res) => {
  try {
    const { hotel } = req;
    const { username, roomNumber, cartItems } = req.body;
    
    if (!username || !roomNumber || !cartItems) {
      return res.status(400).json({ message: 'Eksik alanlar var.' });
    }

    // Otel bağlantısını al ve modeli oluştur
    const connection = await hotelConfig.getConnection(hotel.id);
    const CartOrder = modelCreators.CartOrder(connection, hotel.collections.cartOrders);

    // Yeni sipariş oluştur (status otomatik olarak waiting olacak)
    const newCartOrder = new CartOrder({ username, roomNumber, cartItems });
    const savedOrder = await newCartOrder.save();

    // Sepet ürünlerini string haline getir
    const itemsString = cartItems
      .map(item => `${item.name} (Miktar: ${item.quantity}, Fiyat: ${item.price})`)
      .join(', ');

    // E-posta içeriğini oluşturma ve gönderme
    const transporter = hotelConfig.createTransporter(hotel.id);
    const mailOptions = {
      from: hotel.emailConfig.from,
      to: hotel.emailConfig.to,
      subject: `[${hotel.name}] Yeni Sepet Siparişi Geldi`,
      text: `Yeni bir sepet siparişi alındı.
      
Otel: ${hotel.name}
Oda: ${roomNumber}
Kullanıcı: ${username}
Ürünler: ${itemsString}
Tarih: ${new Date().toLocaleString()}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('E-posta gönderim hatası:', error);
      } else {
        console.log('E-posta gönderildi:', info.response);
      }
    });

    res.status(201).json({ message: "Cart saved", result: savedOrder });
  } catch (error) {
    console.error("Error saving cart:", error);
    res.status(500).json({ message: "Error saving cart", error });
  }
};

// Sepet siparişi durumunu güncelleme
exports.updateCartStatus = async (req, res) => {
  try {
    const { hotel } = req;
    const { id } = req.params;
    
    const connection = await hotelConfig.getConnection(hotel.id);
    const CartOrder = modelCreators.CartOrder(connection, hotel.collections.cartOrders);
    
    const order = await CartOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Mevcut duruma göre sıradaki durumu belirle
    let nextStatus;
    if (order.status === 'waiting') {
      nextStatus = 'active';
    } else if (order.status === 'active') {
      nextStatus = 'completed';
    } else if (order.status === 'completed') {
      return res.status(400).json({ message: "Order is already completed" });
    }

    order.status = nextStatus;
    const updatedOrder = await order.save();
    res.json({ message: "Status updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating cart status:", error);
    res.status(500).json({ message: "Error updating cart status", error });
  }
};

// Sepet siparişlerini getirme
exports.getCartOrders = async (req, res) => {
  try {
    const { hotel } = req;
    const { roomNumber, status } = req.query;
    
    const connection = await hotelConfig.getConnection(hotel.id);
    const CartOrder = modelCreators.CartOrder(connection, hotel.collections.cartOrders);
    
    let query = {};
    if (roomNumber) {
      query.roomNumber = roomNumber;
    }
    if (status) {
      query.status = status;
    }
    
    const orders = await CartOrder.find(query);
    res.json({ success: true, cartOrders: orders });
  } catch (error) {
    console.error("Cart orders getirme hatası:", error);
    res.status(500).json({ message: "Cart orders getirilemedi", error });
  }
}; 