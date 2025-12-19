# 🛡️ Siber Güvenlik Farkındalık Oyunu (Cybersecurity Awareness Game)

Bu proje, son kullanıcıların siber güvenlik konusundaki farkındalığını artırmak amacıyla geliştirilmiş modern, interaktif ve eğitici bir web uygulamasıdır. Kullanıcıları gerçek dünya senaryolarıyla test ederek, phishing (oltalama) saldırılarını tespit etme yeteneklerini geliştirir ve güçlü şifre oluşturma prensiplerini öğretir.

![Project Status](https://img.shields.io/badge/status-active-success.svg)


## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknoloji Yığını (Tech Stack)](#-teknoloji-yığını-tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Gereksinimler](#-gereksinimler)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
  - [Backend Kurulumu (Java Spring Boot)](#1-backend-kurulumu-java-spring-boot)
  - [Frontend Kurulumu (React + Vite)](#2-frontend-kurulumu-react--vite)
- [Yapılandırma](#-yapılandırma)
- [Kullanım](#-kullanım)
- [Proje Mimarisi](#-proje-mimarisi)
- [API Dokümantasyonu](#-api-dokümantasyonu)

---

## 📖 Proje Hakkında

Siber saldırıların büyük bir kısmı insan hatasından kaynaklanmaktadır. Bu uygulama, teorik eğitimden ziyade pratik, oyunlaştırılmış bir deneyim sunarak kullanıcıların reflekslerini güçlendirir. Kullanıcılar, kendilerine gelen sahte e-postaları analiz eder, hangilerinin güvenli hangilerinin tehdit içerdiğine karar verir ve anlık geri bildirimler alır. Ayrıca, interaktif bir şifre oluşturma modülü ile şifrelerinin ne kadar güvenli olduğunu test edebilirler.

## ✨ Özellikler

*   **🎣 İnteraktif Phishing Testi**: 8 farklı, gerçek hayattan alınmış e-posta senaryosu ile kullanıcıların dikkatini test eder.
*   **🔐 Canlı Şifre Analizi**: Kullanıcı şifre yazarken anlık olarak gücünü (zayıf, orta, güçlü) ve eksiklerini (uzunluk, özel karakter vb.) gösterir.
*   **📊 Detaylı Raporlama**: Oyun sonunda kullanıcının başarısı, doğruları, yanlışları ve gelişim alanları hakkında kapsamlı bir karne sunar.
*   **⚡ Modern ve Hızlı Arayüz**: React ve Vite ile geliştirilmiş, anında tepki veren kullanıcı dostu arayüz.
*   **🧠 State Design Pattern**: Backend mantığı, oyunun farklı aşamalarını yönetmek için State tasarım desenini kullanır.
*   **📱 Responsive Tasarım**: Mobil ve masaüstü cihazlarla tam uyumlu.

## 🛠 Teknoloji Yığını (Tech Stack)

Proje, modern web geliştirme standartlarına uygun olarak **Hybrid** bir yapıda geliştirilmiştir.

### Frontend
*   **Framework**: React 18
*   **Build Tool**: Vite (Hızlı geliştirme ve derleme için)
*   **Dil**: TypeScript (Tip güvenliği için)
*   **Stil**: Tailwind CSS (Utility-first CSS framework)
*   **İkonlar**: Lucide React
*   **State Yönetimi**: React Context API

### Backend
*   **Framework**: Java Spring Boot 3.2.0
*   **Dil**: Java 17
*   **Veritabanı**: H2 Database (In-Memory, hızlı test ve kurulum için)
*   **Yapı**: RESTful API
*   **Tasarım Deseni**: State Pattern (Oyun durumlarını yönetmek için), MVC
*   **Araçlar**: Lombok (Boilerplate kod azaltmak için), Maven (Bağımlılık yönetimi)

## 📋 Gereksinimler

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki araçların yüklü olması gerekir:

*   **Node.js**: v18 veya üzeri
*   **npm**: (Node.js ile birlikte gelir)
*   **Java Development Kit (JDK)**: v17 veya üzeri
*   **Maven**: v3.6 veya üzeri (IDE'niz içinde de gelebilir)

## 🚀 Kurulum ve Çalıştırma

Projeyi çalıştırmak için hem Backend hem de Frontend servislerini ayağa kaldırmanız gerekmektedir.

### 1. Backend Kurulumu (Java Spring Boot)

Backend servisi `java` klasörü altında bulunmaktadır.

1.  Proje dizininde `java` klasörüne gidin:
    ```bash
    cd "Java Proje/java"
    ```
2.  Maven ile projeyi derleyin ve bağımlılıkları indirin:
    ```bash
    mvn clean install
    ```
3.  Uygulamayı başlatın:
    ```bash
    mvn spring-boot:run
    ```
    Alternatively, IDE (IntelliJ IDEA, Eclipse) üzerinden `CybersecurityGameApplication.java` dosyasını çalıştırabilirsiniz.

    *Backend varsayılan olarak `http://localhost:8080` adresinde çalışacaktır.*

### 2. Frontend Kurulumu (React + Vite)

Frontend servisi proje kök dizininde bulunmaktadır.

1.  Yeni bir terminal açın ve proje kök dizinine gidin.
2.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
3.  Geliştirme sunucusunu başlatın:
    ```bash
    npm run dev
    ```
4.  Terminalde gösterilen adrese (genellikle `http://localhost:5173`) tarayıcınızdan gidin.

## ⚙ Yapılandırma

Frontend uygulaması varsayılan olarak canlı sunucuya (`backend.test.com`) bağlanacak şekilde yapılandırılmış olabilir. Yerel geliştirme (Localhost) için API adresini değiştirmeniz gerekebilir.

Dosya: `src/context/GameContext.tsx`

```typescript
// Yerel geliştirme için bu satırı aktif edin:
export const API_URL = 'http://localhost:8080/api/game';
export const USER_API_URL = 'http://localhost:8080/api/user';

// Canlı sunucu (Varsayılan):
// export const API_URL = 'https://backend.test.com/api/game';
```

## 🎮 Kullanım

1.  Uygulama açıldığında **"Oyuna Başla"** ekranı sizi karşılar. İsminizi girerek oyunu başlatın.
2.  **Phishing Testi**: Ekrana gelen e-postaları inceleyin. Gönderen adresi, konu başlığı, linkler ve içerikteki aciliyet ifadelerine dikkat ederek "Güvenli" veya "Phishing" olarak işaretleyin.
3.  **Şifre Oluşturma**: Sizden güvenli bir şifre oluşturmanız istenecektir. İpuçlarını takip ederek güçlü bir kombinasyon oluşturun.
4.  **Sonuç Ekranı**: Oyun sonunda performansınızı, aldığınız puanı ve detaylı geri bildirimleri inceleyin.

## 🏗 Proje Mimarisi

Proje iki ana klasörden oluşur:

```
project-root/
├── java/                 # Backend Kaynak Kodları (Spring Boot)
│   ├── src/main/java/com/gameserver/
│   │   ├── controller/   # API Endpoint'leri (GameController, UserController)
│   │   ├── model/        # Veri Modelleri
│   │   ├── service/      # İş Mantığı
│   │   ├── state/        # State Pattern Uygulaması
│   │   └── entity/       # Veritabanı Varlıkları
│   └── pom.xml           # Maven Yapılandırması
│
├── src/                  # Frontend Kaynak Kodları (React)
│   ├── components/       # Yeniden kullanılabilir UI bileşenleri
│   ├── context/          # Global State (GameContext)
│   ├── App.tsx           # Ana Uygulama Bileşeni
│   └── main.tsx          # Giriş Noktası
├── public/               # Statik Dosyalar
├── index.html            # HTML Şablonu
├── package.json          # Node.js Bağımlılıkları
└── vite.config.ts        # Vite Ayarları
```

## 📡 API Dokümantasyonu

Backend aşağıdaki temel REST endpoint'lerini sunar:

### Oyun Yönetimi (/api/game)
*   `POST /start`: Yeni bir oyun oturumu başlatır.
*   `POST /submit`: Bir soru cevabı veya şifre gönderir. Oyunun durumunu günceller.
*   `GET /results/{sessionId}`: Belirtilen oturumun sonuçlarını getirir.
*   `POST /restart`: Oyunu sıfırlar.

### Kullanıcı İşlemleri (/api/user)
*   `POST /register`: Yeni kullanıcı kaydı oluşturur.
*   `POST /save-result`: Oyun sonucunu veritabanına kaydeder.



- Muhammed Aybars ÇELİK  
- Ayberk İlcan ÇIRASUN  
- Eren AKSOY

