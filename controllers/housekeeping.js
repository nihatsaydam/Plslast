const hotelConfig = require('../config/hotelConfig');
const modelCreators = require('../models');

// Housekeeping temizlik kaydı oluşturma
exports.saveCleaningOption = async (req, res) => {
  try {
    const { hotel } = req;
    const { cleaningOption, username, roomNumber, timestamp, status } = req.body;

    // Otel bağlantısını al
    const connection = await hotelConfig.getConnection(hotel.id);
    const HousekeepingClean = modelCreators.HousekeepingClean(connection, hotel.collections.housekeeping);

    const newRecord = new HousekeepingClean({
      cleaningOption,
      username,
      roomNumber,
      timestamp: timestamp || new Date(),
      status: status || 'waiting'
    });

    const savedRecord = await newRecord.save();

    // E-posta içeriğini oluşturma ve gönderme
    const transporter = hotelConfig.createTransporter(hotel.id);
    const mailOptions = {
      from: hotel.emailConfig.from,
      to: hotel.emailConfig.to,
      subject: `[${hotel.name}] Yeni Temizlik Kaydı Oluşturuldu`,
      text: `Yeni bir temizlik kaydı oluşturuldu.
      
Otel: ${hotel.name}
Kullanıcı: ${username}
Oda: ${roomNumber}
Temizlik Seçeneği: ${cleaningOption}
Durum: ${status || 'waiting'}
Tarih: ${new Date(timestamp || Date.now()).toLocaleString()}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('E-posta gönderim hatası:', error);
      } else {
        console.log('E-posta gönderildi:', info.response);
      }
    });

    res.status(201).json(savedRecord);
  } catch (error) {
    console.error("Kayıt oluşturma hatası:", error);
    res.status(500).json({ message: 'Temizlik kaydı oluşturulamadı', error });
  }
};

// Tüm temizlik kayıtlarını getirme
exports.getCleaningRecords = async (req, res) => {
  try {
    const { hotel } = req;
    const connection = await hotelConfig.getConnection(hotel.id);
    const HousekeepingClean = modelCreators.HousekeepingClean(connection, hotel.collections.housekeeping);

    const records = await HousekeepingClean.find();
    res.json(records);
  } catch (error) {
    console.error("Kayıt getirme hatası:", error);
    res.status(500).json({ message: 'Kayıtlar getirilemedi', error });
  }
};

// Temizlik kaydı durumunu güncelleme
exports.updateCleaningStatus = async (req, res) => {
  try {
    const { hotel } = req;
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['waiting', 'active', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Geçersiz durum değeri' });
    }
    
    const connection = await hotelConfig.getConnection(hotel.id);
    const HousekeepingClean = modelCreators.HousekeepingClean(connection, hotel.collections.housekeeping);

    const updatedRecord = await HousekeepingClean.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Kayıt bulunamadı' });
    }
    res.json(updatedRecord);
  } catch (error) {
    console.error("Kayıt güncelleme hatası:", error);
    res.status(500).json({ message: 'Kayıt güncellenemedi', error });
  }
}; 