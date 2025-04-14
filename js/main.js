/**
 * Ana JavaScript Dosyası
 * Bu dosya, uygulamanın başlatılması ve diğer modüllerin koordinasyonu için kullanılır.
 */

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', function() {
    // Kullanıcı arayüzü yöneticisini başlat
    window.uiManager = new UIManager();
    
    // Sohbet yöneticisini başlat
    window.chatManager = new ChatManager();
    
    // Konsola hoş geldin mesajı
    console.log('Aki AI başlatıldı!');
    console.log('Yapay zeka entegrasyonu için api.js dosyasını güncelleyin.');
    
    // Örnek sohbet geçmişi oluştur (geliştirme amaçlı)
    createSampleConversations();
});

/**
 * Örnek sohbet geçmişi oluşturur (geliştirme amaçlı)
 */
function createSampleConversations() {
    // Gerçek uygulamada bu fonksiyon kaldırılacak
    // ve sohbet geçmişi veritabanından veya API'den yüklenecek
    
    // Örnek sohbetler
    const sampleConversations = [
        {
            id: 'conv_1',
            title: 'Web Tasarımı Yardımcısı',
            created: new Date(Date.now() - 86400000).toISOString(), // 1 gün önce
            lastUpdated: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 'conv_2',
            title: 'Veri Analizi Raporu',
            created: new Date(Date.now() - 172800000).toISOString(), // 2 gün önce
            lastUpdated: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: 'conv_3',
            title: 'Python Programlama',
            created: new Date(Date.now() - 259200000).toISOString(), // 3 gün önce
            lastUpdated: new Date(Date.now() - 259200000).toISOString()
        }
    ];
    
    // Örnek sohbetleri ekle
    chatManager.conversations = sampleConversations;
    
    // Sohbet listesini güncelle
    chatManager.updateConversationsList();
}