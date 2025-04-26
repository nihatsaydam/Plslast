FROM node:16-alpine

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install --production

# Uygulama kodunu kopyala
COPY . .

# Ortam değişkenini ayarla
ENV NODE_ENV=production
ENV PORT=8080

# Uygulamayı çalıştır
EXPOSE 8080
CMD ["node", "server.js"] 