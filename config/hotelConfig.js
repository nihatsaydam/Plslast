const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Otel konfigürasyonlarını saklayacak obje
const hotels = {
  "hotel54": {
    id: "hotel54",
    name: "Hotel 54",
    dbConfig: {
      uri: process.env.MONGODB_URI_HOTEL54 || "mongodb+srv://nihatsaydam13131:nihat1234@keepsty.hrq40.mongodb.net/Hotel54?retryWrites=true&w=majority&appName=Keepsty",
      dbName: "Hotel54"
    },
    emailConfig: {
      from: '"Hotel 54 App" <nihatsaydam13131@gmail.com>',
      to: ['info@hotel54.com.tr', 'canberkugurlu@gmail.com'],
      transporterOptions: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER || 'nihatsaydam13131@gmail.com',
          pass: process.env.EMAIL_PASS || 'jgmp pons oxpc saxl'
        }
      }
    },
    apiPath: '/hotel54',
    collections: {
      housekeeping: 'housekeepingclean',
      cartOrders: 'cartOrders',
      tech: 'Tech',
      concierge: 'Concierge',
      bellboy: 'BellboyRequest',
      laundry: 'Laundry',
      roomService: 'RoomService',
      complain: 'Complain',
      ask: 'Ask'
    }
  },
  
  // Örnek yeni otel konfigürasyonu
  "hotelgrand": {
    id: "hotelgrand",
    name: "Hotel Grand",
    dbConfig: {
      uri: process.env.MONGODB_URI_HOTELGRAND || "mongodb+srv://hotelgrand:password@cluster.mongodb.net/HotelGrand?retryWrites=true&w=majority",
      dbName: "HotelGrand"
    },
    emailConfig: {
      from: '"Hotel Grand App" <info@hotelgrand.com>',
      to: ['manager@hotelgrand.com', 'reception@hotelgrand.com'],
      transporterOptions: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER || 'nihatsaydam13131@gmail.com',
          pass: process.env.EMAIL_PASS || 'jgmp pons oxpc saxl'
        }
      }
    },
    apiPath: '/hotelgrand',
    collections: {
      housekeeping: 'housekeepingclean',
      cartOrders: 'cartOrders',
      tech: 'Tech',
      concierge: 'Concierge',
      bellboy: 'BellboyRequest',
      laundry: 'Laundry',
      roomService: 'RoomService',
      complain: 'Complain',
      ask: 'Ask'
    }
  }
};

// Mongoose bağlantılarını saklayacağımız obje
const connections = {};

// Otel ID'si ile konfigürasyon bilgilerini döndüren fonksiyon
function getHotelById(hotelId) {
  return hotels[hotelId] || null;
}

// Belirli bir otel için MongoDB bağlantısını getiren veya oluşturan fonksiyon
async function getConnection(hotelId) {
  // Eğer bağlantı daha önce oluşturulduysa, onu döndür
  if (connections[hotelId]) {
    return connections[hotelId];
  }

  const hotel = getHotelById(hotelId);
  if (!hotel) {
    throw new Error(`Hotel with ID '${hotelId}' not found`);
  }

  try {
    // Otel için MongoDB bağlantısını oluştur
    const connection = await mongoose.createConnection(hotel.dbConfig.uri);
    connections[hotelId] = connection;
    console.log(`Connected to MongoDB for hotel: ${hotel.name}`);
    return connection;
  } catch (err) {
    console.error(`Error connecting to MongoDB for hotel ${hotel.name}:`, err);
    throw err;
  }
}

// E-posta gönderici oluşturma
function createTransporter(hotelId) {
  const hotel = getHotelById(hotelId);
  if (!hotel) {
    throw new Error(`Hotel with ID '${hotelId}' not found`);
  }
  
  return nodemailer.createTransport(hotel.emailConfig.transporterOptions);
}

module.exports = {
  getHotelById,
  getConnection,
  createTransporter,
  hotels
}; 