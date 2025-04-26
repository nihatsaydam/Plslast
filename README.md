# Keepsty Multi-Hotel Backend API

Bu proje, birden fazla otelin yönetimi için tasarlanmış bir backend API'dir. Her otel için ayrı bir veritabanı ve e-posta yapılandırması kullanır.

## Özellikler

- Birden fazla otel desteği
- Otel bazında veritabanı bağlantısı
- Otel bazında e-posta bildirimleri
- Modüler ve ölçeklenebilir yapı
- RESTful API

## Kurulum

```bash
# Depoyu klonlama
git clone https://github.com/yourusername/keepsty-multi-hotel.git
cd keepsty-multi-hotel

# Bağımlılıkları yükleme
npm install

# .env dosyasını oluşturma
cp .env.example .env
# .env dosyasını düzenleyin ve gerekli bilgileri girin
```

## Çevre Değişkenleri

`.env` dosyasında aşağıdaki değişkenleri yapılandırın:

```
# Ana MongoDB Bağlantısı (Yönetim amaçlı)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/MainDB?retryWrites=true&w=majority

# Otel MongoDB Bağlantıları
MONGODB_URI_HOTEL54=mongodb+srv://username:password@cluster.mongodb.net/Hotel54?retryWrites=true&w=majority
MONGODB_URI_HOTELGRAND=mongodb+srv://username:password@cluster.mongodb.net/HotelGrand?retryWrites=true&w=majority

# E-posta Ayarları
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Sunucu Ayarları
PORT=3000
NODE_ENV=production
```

## Çalıştırma

Geliştirme modu için:

```bash
npm run dev
```

Üretim modu için:

```bash
npm start
```

## API Kullanımı

API'ye erişmek için, isteğin `hotelId` parametresini içermesi gereklidir. Bu, URL sorgu parametresi veya `x-hotel-id` başlığı olarak sağlanabilir.

Örnek:

```bash
# URL parametresi kullanarak
curl http://localhost:3000/api/housekeeping/cleaning-records?hotelId=hotel54

# Header kullanarak
curl -H "x-hotel-id: hotel54" http://localhost:3000/api/housekeeping/cleaning-records
```

## Google Cloud Deployment

Google Cloud Run ile deployment yapmak için:

1. Google Cloud SDK'yı yükleyin
2. Projeyi Docker ile paketleyin
3. Google Container Registry'ye push edin
4. Google Cloud Run ile deploy edin

Adım adım talimatlar:

```bash
# Google Cloud SDK kurulumu
# https://cloud.google.com/sdk/docs/install adresindeki talimatları izleyin

# Google Cloud projenizi ayarlayın
gcloud config set project YOUR_PROJECT_ID

# Docker imajı oluşturun
docker build -t gcr.io/YOUR_PROJECT_ID/keepsty-multi-hotel .

# Container Registry'ye push edin
gcloud auth configure-docker
docker push gcr.io/YOUR_PROJECT_ID/keepsty-multi-hotel

# Cloud Run ile deploy edin
gcloud run deploy keepsty-multi-hotel \
  --image gcr.io/YOUR_PROJECT_ID/keepsty-multi-hotel \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## GitHub Entegrasyonu

1. GitHub'da yeni bir repo oluşturun
2. Yerel repo'nuzu GitHub'a bağlayın
3. GitHub Actions ile otomatik deployment yapılandırın

Adım adım talimatlar:

```bash
# GitHub reposunu bağlayın
git remote add origin https://github.com/yourusername/keepsty-multi-hotel.git
git branch -M main
git push -u origin main
```

GitHub Actions için `.github/workflows/deploy.yml` dosyasını oluşturun:

```yaml
name: Deploy to Google Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@master
      with:
        project_id: ${{ secrets.GCP_PROJECT_ID }}
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        export_default_credentials: true

    - name: Build and push Docker image
      run: |
        gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/keepsty-multi-hotel

    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy keepsty-multi-hotel \
          --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/keepsty-multi-hotel \
          --platform managed \
          --region us-central1 \
          --allow-unauthenticated
```

GitHub secrets olarak aşağıdakileri ekleyin:
- `GCP_PROJECT_ID`: Google Cloud Project ID'niz
- `GCP_SA_KEY`: Base64 ile kodlanmış Google Cloud servis hesabı anahtarınız

## Yeni Otel Ekleme

Yeni bir otel eklemek için `config/hotelConfig.js` dosyasını düzenleyin:

```javascript
const hotels = {
  // Mevcut oteller...
  
  "newhotel": {
    id: "newhotel",
    name: "New Hotel",
    dbConfig: {
      uri: process.env.MONGODB_URI_NEWHOTEL || "mongodb://...",
      dbName: "NewHotel"
    },
    emailConfig: {
      from: '"New Hotel App" <info@newhotel.com>',
      to: ['manager@newhotel.com'],
      transporterOptions: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }
    },
    apiPath: '/newhotel',
    collections: {
      housekeeping: 'housekeepingclean',
      // Diğer koleksiyonlar...
    }
  }
};
```

## Lisans

ISC 