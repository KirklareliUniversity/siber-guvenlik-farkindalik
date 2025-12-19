# Cybersecurity Game Server - Java Spring Boot

Bu proje, siber güvenlik farkındalık oyunu için Java Spring Boot ile yazılmış REST API sunucusudur.

## Özellikler

- **Spring Boot 3.2.0** ile modern Java web uygulaması
- **State Pattern** ile oyun durumu yönetimi
- **RESTful API** endpoints
- **CORS** desteği
- **JSON** veri formatı
- **Maven** dependency management

## Teknolojiler

- Java 17
- Spring Boot 3.2.0
- Spring Web
- Jackson (JSON processing)
- Lombok
- Maven

## Kurulum

### Gereksinimler
- Java 17 veya üzeri
- Maven 3.6+

### Çalıştırma

1. Proje dizinine gidin:
```bash
cd java
```

2. Maven ile bağımlılıkları yükleyin:
```bash
mvn clean install
```

3. Uygulamayı çalıştırın:
```bash
mvn spring-boot:run
```

Veya JAR dosyası oluşturup çalıştırın:
```bash
mvn clean package
java -jar target/cybersecurity-game-server-1.0.0.jar
```

## API Endpoints

### 1. Oyun Başlatma
```
POST /api/game/start
Content-Type: application/json

{
  "userName": "Kullanıcı Adı",
  "sessionId": "unique-session-id"
}
```

### 2. Aksiyon Gönderme
```
POST /api/game/submit
Content-Type: application/json

{
  "sessionId": "unique-session-id",
  "actionType": "SUBMIT_ANSWER",
  "payload": {
    "answer": "Seçilen Cevap"
  }
}
```

### 3. Sonuçları Getirme
```
GET /api/game/results/{sessionId}
```

### 4. Oyunu Sıfırlama
```
POST /api/game/restart
Content-Type: application/json

{
  "sessionId": "unique-session-id"
}
```

### 5. Sağlık Kontrolü
```
GET /api/game/health
```

## Oyun Durumları

1. **Welcome State**: Oyun başlangıcı
2. **Phishing State**: Phishing e-posta soruları
3. **Password State**: Şifre güvenliği analizi
4. **Results State**: Oyun sonuçları

## Proje Yapısı

```
src/
├── main/
│   ├── java/
│   │   └── com/gameserver/
│   │       ├── controller/          # REST Controllers
│   │       ├── model/              # Data Models
│   │       ├── state/              # State Pattern Implementation
│   │       └── CybersecurityGameApplication.java
│   └── resources/
│       ├── application.properties  # Configuration
│       └── questions.json         # Game Questions Data
└── test/
    └── java/                      # Test Classes
```

## Port

Sunucu varsayılan olarak **3001** portunda çalışır.

## CORS

Tüm origin'lerden gelen isteklere izin verilir (geliştirme için).
