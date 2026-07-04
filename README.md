# Aki AI - Gelişmiş Yapay Zeka Asistanı

Aki AI, kodlama, içerik üretimi, veri analizi ve planlama görevlerinde yardımcı olabilecek gelişmiş bir yapay zeka asistanıdır.


## Özellikler

- **Sohbet Arayüzü**: Kullanıcı dostu, modern bir sohbet arayüzü
- **Resim İşleme**: Resim analizi ve görsel içerik oluşturma (yakında)
- **Video Analizi**: Video içeriği analizi ve işleme (yakında)
- **Kod Asistanı**: Programlama yardımı ve kod optimizasyonu
- **Veri Analizi**: Veri setlerini analiz etme ve raporlama
- **Duyarlı Tasarım**: Mobil ve masaüstü cihazlara uyumlu arayüz
- **Sohbet Yönetimi**: Sohbetleri düzenleme ve silme özellikleri

## Kurulum

1. Repo'yu klonlayın:
    git clone https://github.com/akiracik/aki-ai.git

2. Proje dizinine gidin:
    cd aki-ai

3. Bir web sunucusu kullanarak projeyi çalıştırın. Örneğin:
    python -m http.server


4. Tarayıcınızda `http://localhost:8000` adresine gidin.

## Yapay Zeka Entegrasyonu

Gerçek bir yapay zeka entegrasyonu için `js/api.js` dosyasını güncelleyin:

1. `apiUrl` değişkenini gerçek API URL'niz ile değiştirin
2. API anahtarınızı ekleyin
3. `makeRequest` metodunu gerçek API çağrıları yapacak şekilde düzenleyin
4. `handleMessageRequest` metodunu gerçek yapay zeka yanıtları alacak şekilde güncelleyin

## Kullanım

1. Ana ekranda yapay zeka ile konuşmaya başlayın
2. Mesaj gönderdiğinizde otomatik olarak yeni bir sohbet oluşturulacaktır
3. Sohbetlerinizi sol panelden görüntüleyebilirsiniz
4. Sohbet başlıklarını düzenlemek için sohbet öğesinin yanındaki düzenleme simgesine tıklayın
5. Sohbeti silmek için sohbet öğesinin yanındaki silme simgesine tıklayın
6. Farklı yapay zeka modelleri arasında geçiş yapmak için üst menüdeki model seçicisini kullanın
7. Ayarlar menüsünden tema ve yazı boyutu gibi görünüm ayarlarını değiştirebilirsiniz


## Geliştirme

### Yeni Özellikler Ekleme

Yeni özellikler eklemek için:

1. İlgili JavaScript dosyasını bulun (ui.js, chat.js veya api.js)
2. Yeni fonksiyonları ekleyin
3. Gerekirse HTML ve CSS dosyalarını güncelleyin

### Yapay Zeka Modellerini Güncelleme

Yeni yapay zeka modelleri eklemek için:

1. `index.html` dosyasındaki model seçim modalını güncelleyin
2. `api.js` dosyasında yeni model için destek ekleyin

## Demo

Link: https://aki-ai.vercel.app/

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
