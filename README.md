# Helper Functions - Insider

Bu Chrome Extension, **Insider** platformu initialize olduktan sonra tarayıcı penceresine (`window`) çeşitli yardımcı fonksiyonlar ekler.  
Amaç, e-ticaret sitelerinde sepet işlemlerini, fiyat parse etme işlemlerini ve ürün bilgisi elde etmeyi kolaylaştırmaktır.

## 🚀 Özellikler

- **Insider initialize kontrolü**: Insider global objesi (`window.Insider`) yüklenene kadar bekler.
- **Sepet izleme & güncelleme**:
  - Ürün ekleme/çıkarma tespiti
  - Sepet toplam miktar & tutar güncelleme
  - `cart:amount:update` ve `cart:count:update` event dispatch
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

## 📂 Proje Yapısı

