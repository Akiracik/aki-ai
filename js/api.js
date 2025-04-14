/**
 * API İşlemleri
 * Bu dosya, Aki AI API'si ile iletişim kurmak için gerekli fonksiyonları içerir.
 */

class AkiAPI {
    constructor() {
        // API yapılandırması
        this.apiUrl = 'https://api.aki-ai.com/v1';
        this.apiKey = localStorage.getItem('aki_api_key') || 'sk_aki_demo_key';
        this.currentModel = localStorage.getItem('aki_model') || 'aki-v1';
        this.userId = localStorage.getItem('aki_user_id') || 'user_demo';
        this.sessionToken = localStorage.getItem('aki_session_token') || 'session_demo_token';
        
        // API istek sayacı ve hız sınırlaması
        this.requestCount = 0;
        this.requestLimit = 100; // Saatlik istek limiti
        this.requestResetTime = Date.now() + 3600000; // 1 saat sonra sıfırla
        
        // Hata yönetimi
        this.retryCount = 0;
        this.maxRetries = 3;
        this.retryDelay = 1000; // ms
        
        // Oturum kontrolü
        this.checkSession();
        
        // Simüle edilmiş veritabanı
        this.simulatedDB = {
            conversations: [],
            messages: []
        };
    }
    
    /**
     * Oturum durumunu kontrol eder
     * @returns {Promise<boolean>} - Oturum geçerli mi
     */
    async checkSession() {
        if (!this.sessionToken) return false;
        
        try {
            // Gerçek API'de oturum kontrolü yapılacak
            // Şimdilik simüle ediyoruz
            return true;
        } catch (error) {
            console.warn('Oturum geçersiz:', error);
            this.clearSession();
            return false;
        }
    }
    
    /**
     * Oturum bilgilerini temizler
     */
    clearSession() {
        this.sessionToken = null;
        localStorage.removeItem('aki_session_token');
        localStorage.removeItem('aki_user_id');
    }
    
    /**
     * API anahtarını ayarlar
     * @param {string} apiKey - API anahtarı
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('aki_api_key', apiKey);
    }
    
    /**
     * Kullanılacak modeli ayarlar
     * @param {string} model - Model kimliği
     */
    setModel(model) {
        this.currentModel = model;
        localStorage.setItem('aki_model', model);
    }
    
    /**
     * API isteği yapar
     * @param {string} endpoint - API endpoint'i
     * @param {string} method - HTTP metodu
     * @param {Object} data - İstek verisi
     * @returns {Promise} - API yanıtı
     */
    async makeRequest(endpoint, method = 'GET', data = null) {
        // İstek limiti kontrolü
        if (Date.now() > this.requestResetTime) {
            this.requestCount = 0;
            this.requestResetTime = Date.now() + 3600000;
        }
        
        if (this.requestCount >= this.requestLimit) {
            throw new Error('API istek limiti aşıldı. Lütfen daha sonra tekrar deneyin.');
        }
        
        this.requestCount++;
        
        // Gerçek bir API isteği yapılacak
        // Şimdilik simüle ediyoruz
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simüle edilmiş hata (% 10 ihtimalle)
                if (Math.random() < 0.1 && endpoint !== '/auth/login') {
                    if (this.retryCount < this.maxRetries) {
                        this.retryCount++;
                        setTimeout(() => {
                            this.makeRequest(endpoint, method, data)
                                .then(resolve)
                                .catch(reject);
                        }, this.retryDelay * this.retryCount);
                        return;
                    }
                    
                    this.retryCount = 0;
                    reject(new Error('API isteği başarısız oldu. Lütfen tekrar deneyin.'));
                    return;
                }
                
                this.retryCount = 0;
                
                // Endpoint'e göre simüle edilmiş yanıtlar
                if (endpoint.startsWith('/conversations') && method === 'POST') {
                    // Yeni sohbet oluşturma
                    const conversation = {
                        id: data.id || 'conv_' + Date.now(),
                        title: data.title || 'Yeni Sohbet',
                        created: new Date().toISOString(),
                        lastUpdated: new Date().toISOString(),
                        userId: this.userId
                    };
                    
                    this.simulatedDB.conversations.push(conversation);
                    resolve(conversation);
                } 
                else if (endpoint.startsWith('/conversations') && method === 'GET') {
                    // Sohbet listesi veya belirli bir sohbet
                    const conversationId = endpoint.split('/').pop();
                    
                    if (conversationId && conversationId !== 'conversations') {
                        const conversation = this.simulatedDB.conversations.find(c => c.id === conversationId);
                        if (conversation) {
                            resolve(conversation);
                        } else {
                            reject(new Error('Sohbet bulunamadı.'));
                        }
                    } else {
                        resolve({
                            conversations: this.simulatedDB.conversations.filter(c => c.userId === this.userId)
                        });
                    }
                }
                else if (endpoint.includes('/messages') && method === 'GET') {
                    // Sohbet mesajları
                    const conversationId = endpoint.split('/')[2];
                    const messages = this.simulatedDB.messages.filter(m => m.conversationId === conversationId);
                    resolve({ messages });
                }
                else if (endpoint.includes('/messages') && method === 'POST') {
                    // Mesaj gönderme
                    this.handleMessageRequest(data).then(resolve).catch(reject);
                }
                else if (endpoint.startsWith('/conversations') && method === 'DELETE') {
                    // Sohbet silme
                    const conversationId = endpoint.split('/').pop();
                    this.simulatedDB.conversations = this.simulatedDB.conversations.filter(c => c.id !== conversationId);
                    this.simulatedDB.messages = this.simulatedDB.messages.filter(m => m.conversationId !== conversationId);
                    resolve({ success: true });
                }
                else if (endpoint.startsWith('/conversations') && method === 'PATCH') {
                    // Sohbet güncelleme
                    const conversationId = endpoint.split('/').pop();
                    const conversation = this.simulatedDB.conversations.find(c => c.id === conversationId);
                    
                    if (conversation) {
                        Object.assign(conversation, data);
                        conversation.lastUpdated = new Date().toISOString();
                        resolve(conversation);
                    } else {
                        reject(new Error('Sohbet bulunamadı.'));
                    }
                }
                else if (endpoint.includes('/rate') && method === 'POST') {
                    // Mesaj derecelendirme
                    resolve({ success: true });
                }
                else if (endpoint.startsWith('/auth/login') && method === 'POST') {
                    // Giriş
                    if (data.email && data.password) {
                        const token = 'token_' + Date.now();
                        const userId = 'user_' + Date.now();
                        
                        resolve({
                            success: true,
                            token,
                            userId,
                            user: {
                                id: userId,
                                email: data.email,
                                name: 'Kullanıcı',
                                plan: 'pro'
                            }
                        });
                    } else {
                        reject(new Error('Geçersiz kimlik bilgileri.'));
                    }
                }
                else if (endpoint.startsWith('/auth/session') && method === 'GET') {
                    // Oturum kontrolü
                    resolve({ valid: true });
                }
                else if (endpoint.includes('/image/analyze') && method === 'POST') {
                    // Resim analizi
                    resolve({
                        id: 'img_' + Date.now(),
                        description: "Bu resmi analiz ettim. Resimde [resim içeriği] görünüyor. Bu tür görseller genellikle [konu] ile ilgilidir.",
                        created: new Date().toISOString()
                    });
                }
                else if (endpoint.includes('/video/analyze') && method === 'POST') {
                    // Video analizi
                    resolve({
                        id: 'vid_' + Date.now(),
                        description: "Bu videoyu analiz ettim. Video [video içeriği] gösteriyor ve yaklaşık [süre] uzunluğunda.",
                        created: new Date().toISOString()
                    });
                }
                else {
                    reject(new Error('Geçersiz API endpoint\'i.'));
                }
            }, 500 + Math.random() * 1000); // 500-1500ms gecikme
        });
    }
    
    /**
     * Mesaj isteğini işler ve yapay zeka yanıtı oluşturur
     * @param {Object} data - Mesaj verisi
     * @returns {Promise} - API yanıtı
     */
    async handleMessageRequest(data) {
        const { conversationId, messages } = data;
        
        // Son kullanıcı mesajını al
        const lastUserMessage = messages[messages.length - 1];
        
        // Kullanıcı mesajını veritabanına ekle
        const userMessageObj = {
            id: 'msg_user_' + Date.now(),
            conversationId,
            role: 'user',
            content: lastUserMessage.content,
            timestamp: new Date().toISOString()
        };
        
        this.simulatedDB.messages.push(userMessageObj);
        
        // Yapay zeka yanıtı oluştur
        let response = '';
        const query = lastUserMessage.content.toLowerCase();
        
        if (query.includes('merhaba') || query.includes('selam')) {
            response = "Merhaba! Ben Aki AI. Size nasıl yardımcı olabilirim?";
        } 
        else if (query.includes('yardım')) {
            response = "Size nasıl yardımcı olabilirim? Kodlama, içerik üretimi, veri analizi veya başka bir konuda destek isteyebilirsiniz.";
        } 
        else if (query.includes('özellik') || query.includes('yapabilir')) {
            response = "Aki AI olarak şunları yapabilirim:\n\n- Kodlama ve programlama yardımı\n- Metin içeriği oluşturma ve düzenleme\n- Veri analizi ve raporlama\n- Görsel içerik analizi\n- Video içeriği analizi\n- Araştırma ve bilgi sağlama\n\nBaşka nasıl yardımcı olabilirim?";
        } 
        else if (query.includes('kod') || query.includes('program')) {
            response = "İşte basit bir JavaScript örneği:\n\n```javascript\n// Bir dizi içindeki sayıları toplayan fonksiyon\nfunction toplamHesapla(sayilar) {\n  return sayilar.reduce((toplam, sayi) => toplam + sayi, 0);\n}\n\nconst sayilar = [1, 2, 3, 4, 5];\nconst sonuc = toplamHesapla(sayilar);\nconsole.log('Toplam:', sonuc); // Çıktı: Toplam: 15\n```\n\nBu kodu nasıl geliştirmek istersiniz?";
        } 
        else if (query.includes('python')) {
            response = "İşte bir Python örneği:\n\n```python\n# Bir liste içindeki sayıları toplayan fonksiyon\ndef toplam_hesapla(sayilar):\n    return sum(sayilar)\n\nsayilar = [1, 2, 3, 4, 5]\nsonuc = toplam_hesapla(sayilar)\nprint(f'Toplam: {sonuc}')  # Çıktı: Toplam: 15\n```\n\nPython hakkında başka sorularınız var mı?";
        }
        else if (query.includes('html') || query.includes('css')) {
            response = "İşte basit bir HTML ve CSS örneği:\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        .container {\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            height: 100vh;\n            background-color: #f0f0f0;\n        }\n        .card {\n            padding: 20px;\n            background-color: white;\n            border-radius: 8px;\n            box-shadow: 0 4px 8px rgba(0,0,0,0.1);\n        }\n    </style>\n</head>\n<body>\n    <div class=\"container\">\n        <div class=\"card\">\n            <h1>Merhaba Dünya!</h1>\n            <p>Bu basit bir HTML ve CSS örneğidir.</p>\n        </div>\n    </div>\n</body>\n</html>\n```\n\nWeb geliştirme hakkında başka sorularınız var mı?";
        }
        else if (query.includes('resim') || query.includes('görsel')) {
            response = "Resim analizi ve oluşturma özelliklerimiz şu anda geliştirme aşamasındadır. Yakında bu özelliği kullanabileceksiniz. Şimdilik size metin tabanlı içerikler konusunda yardımcı olabilirim.";
        } 
        else if (query.includes('video')) {
            response = "Video analizi özelliklerimiz şu anda geliştirme aşamasındadır. Yakında bu özelliği kullanabileceksiniz. Şimdilik size metin tabanlı içerikler konusunda yardımcı olabilirim.";
        }
        else if (query.includes('teşekkür')) {
            response = "Rica ederim! Başka bir konuda yardıma ihtiyacınız olursa bana sormaktan çekinmeyin.";
        }
        else if (query.includes('hava') || query.includes('hava durumu')) {
            response = "Üzgünüm, şu anda gerçek zamanlı hava durumu verilerine erişemiyorum. Ancak size hava durumu API'leri hakkında bilgi verebilir veya hava durumu uygulaması geliştirmenize yardımcı olabilirim.";
        }
        else if (query.includes('saat') || query.includes('tarih')) {
            const now = new Date();
            response = `Şu anki tarih ve saat: ${now.toLocaleString('tr-TR')}`;
        }
        else {
            response = "Mesajınızı aldım. Aki AI olarak size en iyi şekilde yardımcı olmaya çalışıyorum. Daha spesifik bir soru sorarsanız, daha detaylı bir yanıt verebilirim.";
        }
        
        // AI yanıtını veritabanına ekle
        const aiMessageObj = {
            id: 'msg_ai_' + Date.now(),
            conversationId,
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString()
        };
        
        this.simulatedDB.messages.push(aiMessageObj);
        
        // Sohbetin son güncelleme zamanını güncelle
        const conversation = this.simulatedDB.conversations.find(c => c.id === conversationId);
        if (conversation) {
            conversation.lastUpdated = new Date().toISOString();
        }
        
        return aiMessageObj;
    }
    
    /**
     * Kullanıcı kimlik doğrulaması yapar
     * @param {string} email - Kullanıcı e-posta adresi
     * @param {string} password - Kullanıcı şifresi
     * @returns {Promise} - API yanıtı
     */
    async login(email, password) {
        try {
            const response = await this.makeRequest('/auth/login', 'POST', { email, password });
            
            if (response.success) {
                this.sessionToken = response.token;
                this.userId = response.userId;
                
                localStorage.setItem('aki_session_token', response.token);
                localStorage.setItem('aki_user_id', response.userId);
            }
            
            return response;
        } catch (error) {
            console.error('Giriş hatası:', error);
            throw error;
        }
    }
    
    /**
     * Kullanıcı oturumunu kapatır
     * @returns {Promise} - API yanıtı
     */
    async logout() {
        try {
            await this.makeRequest('/auth/logout', 'POST');
            this.clearSession();
            return { success: true };
        } catch (error) {
            console.error('Çıkış hatası:', error);
            this.clearSession();
            throw error;
        }
    }
    
    /**
     * Sohbet listesini getirir
     * @returns {Promise} - API yanıtı
     */
    async getConversations() {
        try {
            return await this.makeRequest('/conversations', 'GET');
        } catch (error) {
            console.error('Sohbet listesi getirme hatası:', error);
            throw error;
        }
    }
    
    /**
     * Belirli bir sohbetin mesajlarını getirir
     * @param {string} conversationId - Sohbet kimliği
     * @returns {Promise} - API yanıtı
     */
    async getConversationMessages(conversationId) {
        try {
            return await this.makeRequest(`/conversations/${conversationId}/messages`, 'GET');
        } catch (error) {
            console.error('Sohbet mesajları getirme hatası:', error);
            throw error;
        }
    }
    
    /**
     * Yeni bir sohbet oluşturur
     * @param {Object} data - Sohbet verisi
     * @returns {Promise} - API yanıtı
     */
    async createConversation(data) {
        try {
            return await this.makeRequest('/conversations', 'POST', data);
        } catch (error) {
            console.error('Sohbet oluşturma hatası:', error);
            throw error;
        }
    }
    
    /**
     * Sohbeti günceller
     * @param {string} conversationId - Sohbet kimliği
     * @param {Object} data - Güncellenecek veriler
     * @returns {Promise} - API yanıtı
     */
    async updateConversation(conversationId, data) {
        try {
            return await this.makeRequest(`/conversations/${conversationId}`, 'PATCH', data);
        } catch (error) {
            console.error('Sohbet güncelleme hatası:', error);
            throw error;
        }
    }
    
    /**
     * Sohbeti siler
     * @param {string} conversationId - Silinecek sohbet kimliği
     * @returns {Promise} - API yanıtı
     */
    async deleteConversation(conversationId) {
        try {
            return await this.makeRequest(`/conversations/${conversationId}`, 'DELETE');
        } catch (error) {
            console.error('Sohbet silme hatası:', error);
            throw error;
        }
    }
    
    /**
     * Yapay zeka API'sine mesaj gönderir ve yanıt alır
     * @param {string} conversationId - Sohbet kimliği
     * @param {Array} messages - Sohbet mesajları dizisi
     * @returns {Promise} - API yanıtı
     */
    async sendMessage(conversationId, messages) {
        try {
            return await this.makeRequest(`/conversations/${conversationId}/messages`, 'POST', {
                conversationId,
                messages,
                model: this.currentModel
            });
        } catch (error) {
            console.error('Mesaj gönderme hatası:', error);
            throw error;
        }
    }
    
    /**
     * Mesajı derecelendirir (beğeni/beğenmeme)
     * @param {string} messageId - Mesaj kimliği
     * @param {string} rating - Derecelendirme (positive/negative)
     * @returns {Promise} - API yanıtı
     */
    async rateMessage(messageId, rating) {
        try {
            return await this.makeRequest(`/messages/${messageId}/rate`, 'POST', { rating });
        } catch (error) {
            console.error('Mesaj derecelendirme hatası:', error);
            throw error;
        }
    }
    
    /**
     * Resim analizi yapar
     * @param {string} conversationId - Sohbet kimliği
     * @param {File} imageFile - Analiz edilecek resim dosyası
     * @returns {Promise} - API yanıtı
     */
    async analyzeImage(conversationId, imageFile) {
        try {
            // Gerçek uygulamada, resim dosyası FormData ile gönderilecek
            // Şimdilik simüle ediyoruz
            return await this.makeRequest(`/conversations/${conversationId}/image/analyze`, 'POST', {
                filename: imageFile.name,
                filesize: imageFile.size,
                filetype: imageFile.type
            });
        } catch (error) {
            console.error('Resim analizi hatası:', error);
            throw error;
        }
    }
    
    /**
     * Video analizi yapar
     * @param {string} conversationId - Sohbet kimliği
     * @param {File} videoFile - Analiz edilecek video dosyası
     * @returns {Promise} - API yanıtı
     */
    async analyzeVideo(conversationId, videoFile) {
        try {
            // Gerçek uygulamada, video dosyası FormData ile gönderilecek
            // Şimdilik simüle ediyoruz
            return await this.makeRequest(`/conversations/${conversationId}/video/analyze`, 'POST', {
                filename: videoFile.name,
                filesize: videoFile.size,
                filetype: videoFile.type
            });
        } catch (error) {
            console.error('Video analizi hatası:', error);
            throw error;
        }
    }
}

// API sınıfının bir örneğini oluştur ve dışa aktar
const akiAPI = new akiAPI();