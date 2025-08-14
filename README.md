# Helper Functions

Bu Chrome Extension, **ins.js/API** initialize olduktan sonra tarayıcı penceresine (`window`) çeşitli yardımcı fonksiyonlar ekler.  
Amaç, e-ticaret sitelerinde sepet işlemlerini, fiyat parse etme işlemlerini ve ürün bilgisi elde etmeyi kolaylaştırmaktır.

## 🚀 Özellikler

- **API initialize kontrolü**: (`ins.js`) scripti sayfaya yüklenene kadar bekler.
- **Sepet izleme & güncelleme**:
  - Ürün ekleme/çıkarma tespiti
  - Sepet toplam miktar & tutar güncelleme
- **Fiyat parse etme**:
  - `window.parsePrice(stringPrice)` → Para değerlerini string ifadelerden sayıya çevirir.
- **Metin formatlama**:
  - `window.firstLettersUpper(string)` → İlk harfleri büyük yapar, `-` karakterlerini boşluğa çevirir.
- **Kategori & ürün bilgisi alma**:
  - `window.getCategories()` → Insider'dan kategori listesi çeker.
  - `window.getCurrentProduct()` → Mevcut ürünü döndürür.
  - `window.getPaidProducts()` → Ödenmiş ürünleri döndürür.
- **Konsol bildirimi**:
  - Fonksiyonlar yüklendiğinde konsolda dikkat çekici bir mesaj gösterilir.

## ⚙️ Kurulum

1. **Projeyi indir** veya kopyala.
2. Google Chrome'da `chrome://extensions/` sayfasını aç.
3. **Geliştirici Modu**'nu aktif et.
4. **Load unpacked** (Paketlenmemiş yükle) butonuna tıkla.
5. Bu projenin klasörünü seç.

## 🔑 Kullanım

Uzantı aktifken, Insider initialize olduğu anda `window` objesine şu fonksiyonlar eklenir:

```js
parsePrice("₺1.299,99"); // 1299.99
firstLettersUpper("macbook-pro"); // "Macbook Pro"
getCategories(); // Kategori listesi döner
getCurrentProduct(); // Ürün sayfasındaki ürün bilgisini döner
getPaidProducts(); // Sepet sayfasındaki ürünlerin listesini döner
setStorage(0,0,[]); // Storage günceller
updateFromIO(); // Basket IO entegrasyonu var ise basket IO'dan storage günceller
