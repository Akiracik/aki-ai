/**
 * Sohbet İşlemleri
 * Bu dosya, sohbet işlevselliği için gerekli fonksiyonları içerir.
 */

class ChatManager {
    constructor() {
        this.conversations = [];
        this.currentConversationId = null;
        this.messages = [];
        this.isTyping = false;
        
        // DOM elementleri
        this.chatArea = document.getElementById('chatArea');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        
        // Event listeners
        this.setupEventListeners();
        
        // Hoş geldiniz ekranını göster
        this.showWelcomeScreen();
    }
    
    /**
     * Event listener'ları ayarlar
     */
    setupEventListeners() {
        // Mesaj gönderme
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
            
            // Textarea'yı otomatik boyutlandır
            this.autoResizeTextarea();
        });
        
        this.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });
        
        // Dosya ekleme butonu
        document.getElementById('attachBtn').addEventListener('click', () => {
            // Dosya seçme dialogunu aç
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*,.pdf,.doc,.docx,.txt';
            fileInput.click();
            
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    // Dosya işleme fonksiyonunu çağır
                    this.handleFileUpload(file);
                }
            });
        });
        
        // Mikrofon butonu
        document.getElementById('micBtn').addEventListener('click', () => {
            // Ses tanıma özelliği (tarayıcı desteği varsa)
            if ('webkitSpeechRecognition' in window) {
                alert('Ses tanıma özelliği şu anda geliştirme aşamasındadır.');
            } else {
                alert('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
            }
        });
    }
    
    /**
     * Textarea'yı içeriğine göre otomatik boyutlandırır
     */
    autoResizeTextarea() {
        const textarea = this.messageInput;
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
        
        // Maksimum yükseklik kontrolü
        if (textarea.scrollHeight > 150) {
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.overflowY = 'hidden';
        }
    }
    
    /**
     * Hoş geldiniz ekranını gösterir
     */
    showWelcomeScreen() {
        this.chatArea.innerHTML = `
            <div class="welcome-screen">
                <div class="ai-logo">A</div>
                <h1 class="ai-title">Aki AI</h1>
                <p class="ai-description">Aki AI, gelişmiş yapay zeka teknolojisiyle donatılmış, kodlama, içerik üretimi, veri analizi ve planlama görevlerinde size yardımcı olabilecek güçlü bir asistanıdır. Sorularınızı sorun, projelerinizi paylaşın ve Aki AI'nin yeteneklerini keşfedin.</p>
                
                <div class="feature-grid">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-image"></i>
                        </div>
                        <div class="feature-content">
                            <h3>Görsel İşleme</h3>
                            <p>Resimlerinizi analiz edin, düzenleyin ve görsel içerikler oluşturun.</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-video"></i>
                        </div>
                        <div class="feature-content">
                            <h3>Video Analizi</h3>
                            <p>Videolarınızı işleyin, özetleyin ve içeriklerini analiz edin.</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-code"></i>
                        </div>
                        <div class="feature-content">
                            <h3>Kod Asistanı</h3>
                            <p>Programlama dillerinde kod yazma, hata ayıklama ve optimizasyon desteği.</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="feature-content">
                            <h3>Veri Analizi</h3>
                            <p>Verilerinizi analiz edin, raporlar oluşturun ve içgörüler elde edin.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Yeni bir sohbet başlatır ve mesaj içeriğine göre başlık oluşturur
     * @param {string} messageText - İlk mesaj içeriği
     * @returns {string} - Oluşturulan sohbet ID'si
     */
    startNewConversation(messageText) {
        const conversationId = 'conv_' + Date.now();
        
        // Mesaj içeriğinden başlık oluştur
        let title = messageText.substring(0, 30);
        if (messageText.length > 30) {
            title += '...';
        }
        
        this.conversations.push({
            id: conversationId,
            title: title,
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        });
        
        this.currentConversationId = conversationId;
        this.messages = [];
        
        // Sohbet alanını temizle
        this.chatArea.innerHTML = `<div class="chat-messages"></div>`;
        
        // Sohbet listesini güncelle
        this.updateConversationsList();
        
        return conversationId;
    }
    
    /**
     * Sohbet listesini günceller
     */
    updateConversationsList() {
        const chatsList = document.getElementById('chatsList');
        if (!chatsList) return;
        
        // Başlığı ekle
        let html = `<div class="section-title">Son Sohbetler</div>`;
        
        // Sohbetleri ekle
        if (this.conversations.length === 0) {
            html += `<div class="empty-list">Henüz sohbet yok</div>`;
        } else {
            // Sohbetleri tarihe göre sırala (en yeni en üstte)
            const sortedConversations = [...this.conversations].sort((a, b) => {
                return new Date(b.lastUpdated) - new Date(a.lastUpdated);
            });
            
            sortedConversations.forEach(conv => {
                const isActive = conv.id === this.currentConversationId;
                html += `
                    <div class="chat-item ${isActive ? 'active' : ''}" data-id="${conv.id}">
                        <i class="fas fa-comment chat-icon"></i>
                        <div class="chat-title">${this.escapeHtml(conv.title)}</div>
                        <div class="chat-actions">
                            <button class="chat-action-btn edit-chat-btn" data-id="${conv.id}" title="Düzenle">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="chat-action-btn delete-chat-btn" data-id="${conv.id}" title="Sil">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        
        chatsList.innerHTML = html;
        
        // Event listener'ları ekle
        document.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Eğer düzenle veya sil butonlarına tıklanmadıysa sohbeti yükle
                if (!e.target.closest('.chat-action-btn')) {
                    const conversationId = item.getAttribute('data-id');
                    this.loadConversation(conversationId);
                }
            });
        });
        
        // Düzenleme butonları için event listener
        document.querySelectorAll('.edit-chat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const chatId = btn.getAttribute('data-id');
                const conversation = this.conversations.find(c => c.id === chatId);
                if (conversation) {
                    uiManager.showEditChatModal(chatId, conversation.title);
                }
            });
        });
        
        // Silme butonları için event listener
        document.querySelectorAll('.delete-chat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const chatId = btn.getAttribute('data-id');
                const conversation = this.conversations.find(c => c.id === chatId);
                if (conversation) {
                    uiManager.showDeleteConfirmation(chatId, conversation.title);
                }
            });
        });
    }
    
    /**
     * Belirli bir sohbeti yükler
     * @param {string} conversationId - Sohbet kimliği
     */
    loadConversation(conversationId) {
        // Gerçek uygulamada, bu fonksiyon veritabanından veya API'den sohbeti yükleyecektir
        this.currentConversationId = conversationId;
        
        // API'den sohbet mesajlarını yükle
        akiAPI.getConversationMessages(conversationId)
            .then(response => {
                if (response.messages && response.messages.length > 0) {
                    this.messages = response.messages;
                    this.renderMessages();
                } else {
                    // Boş sohbet
                    this.messages = [];
                    this.chatArea.innerHTML = `<div class="chat-messages"></div>`;
                }
            })
            .catch(error => {
                console.error('Sohbet mesajları yüklenirken hata:', error);
                this.messages = [];
                this.chatArea.innerHTML = `<div class="chat-messages"></div>`;
                this.showErrorMessage('Sohbet mesajları yüklenemedi. Lütfen tekrar deneyin.');
            });
        
        // Sohbet listesini güncelle
        this.updateConversationsList();
        
        // Mesaj giriş alanına odaklan
        setTimeout(() => {
            this.messageInput.focus();
        }, 100);
    }
    
    /**
     * Sohbet başlığını günceller
     * @param {string} conversationId - Sohbet kimliği
     * @param {string} newTitle - Yeni başlık
     */
    updateConversationTitle(conversationId, newTitle) {
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
            conversation.title = newTitle;
            conversation.lastUpdated = new Date().toISOString();
            
            // Sohbet listesini güncelle
            this.updateConversationsList();
            
            // API'ye bildir
            akiAPI.updateConversation(conversationId, { title: newTitle })
                .then(response => {
                    console.log('Sohbet başlığı güncellendi:', response);
                })
                .catch(error => {
                    console.error('Sohbet başlığı güncelleme hatası:', error);
                });
        }
    }
    
    /**
     * Sohbeti siler
     * @param {string} conversationId - Silinecek sohbet kimliği
     */
    deleteConversation(conversationId) {
        // Sohbeti diziden kaldır
        this.conversations = this.conversations.filter(c => c.id !== conversationId);
        
        // Eğer aktif sohbet silindiyse, hoş geldiniz ekranını göster
        if (this.currentConversationId === conversationId) {
            this.currentConversationId = null;
            this.messages = [];
            this.showWelcomeScreen();
        }
        
        // Sohbet listesini güncelle
        this.updateConversationsList();
        
        // API'ye bildir
        akiAPI.deleteConversation(conversationId)
            .then(response => {
                console.log('Sohbet silindi:', response);
            })
            .catch(error => {
                console.error('Sohbet silme hatası:', error);
            });
    }
    
    /**
     * Mesaj gönderir
     */
    async sendMessage() {
        const messageText = this.messageInput.value.trim();
        if (!messageText) return;
        
        // Eğer aktif bir sohbet yoksa, yeni bir sohbet başlat
        if (!this.currentConversationId) {
            this.startNewConversation(messageText);
        }
        
        // Kullanıcı mesajını ekle
        const userMessage = {
            id: 'msg_user_' + Date.now(),
            role: 'user',
            content: messageText,
            timestamp: new Date().toISOString()
        };
        
        this.messages.push(userMessage);
        this.renderMessages();
        
        // Input alanını temizle
        this.messageInput.value = '';
        this.autoResizeTextarea();
        
        // Yazıyor göstergesini göster
        this.showTypingIndicator();
        
        try {
            // API'ye mesajı gönder
            const response = await akiAPI.sendMessage(
                this.currentConversationId,
                this.messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            );
            
            // Yazıyor göstergesini kaldır
            this.hideTypingIndicator();
            
            // AI yanıtını ekle
            const aiMessage = {
                id: response.id || 'msg_ai_' + Date.now(),
                role: 'assistant',
                content: response.content,
                timestamp: new Date().toISOString()
            };
            
            this.messages.push(aiMessage);
            this.renderMessages();
            
            // Sohbet son güncelleme zamanını güncelle
            const conversation = this.conversations.find(c => c.id === this.currentConversationId);
            if (conversation) {
                conversation.lastUpdated = new Date().toISOString();
            }
            
            // Sohbet listesini güncelle
            this.updateConversationsList();
        } catch (error) {
            console.error('Mesaj gönderme hatası:', error);
            
            // Yazıyor göstergesini kaldır
            this.hideTypingIndicator();
            
            // Hata mesajı göster
            this.showErrorMessage('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }
    
    /**
     * Mesajları ekranda gösterir
     */
    renderMessages() {
        const chatMessagesEl = this.chatArea.querySelector('.chat-messages');
        if (!chatMessagesEl) {
            this.chatArea.innerHTML = `<div class="chat-messages"></div>`;
        }
        
        const chatMessages = this.chatArea.querySelector('.chat-messages');
        chatMessages.innerHTML = '';
        
        this.messages.forEach(message => {
            const isAI = message.role === 'assistant';
            const messageEl = document.createElement('div');
            messageEl.className = 'message';
            messageEl.innerHTML = `
                <div class="message-avatar ${isAI ? 'ai' : 'user'}">
                    ${isAI ? 'A' : 'K'}
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <div class="message-author">${isAI ? 'Aki AI' : 'Kullanıcı'}</div>
                        <div class="message-time">${this.formatTime(message.timestamp)}</div>
                    </div>
                    <div class="message-text">${this.formatMessageContent(message.content)}</div>
                    <div class="message-actions">
                        <button class="message-action-btn copy-btn" data-id="${message.id}">
                            <i class="fas fa-copy"></i> Kopyala
                        </button>
                        ${isAI ? `
                            <button class="message-action-btn thumbs-up-btn" data-id="${message.id}">
                                <i class="fas fa-thumbs-up"></i> Beğen
                            </button>
                            <button class="message-action-btn thumbs-down-btn" data-id="${message.id}">
                                <i class="fas fa-thumbs-down"></i> Beğenme
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
            
            chatMessages.appendChild(messageEl);
            
            // Kod bloklarını işle
            this.processCodeBlocks(messageEl);
        });
        
        // Mesaj aksiyonları için event listener'ları ekle
        this.addMessageActionListeners();
        
        // Sohbet alanını en alta kaydır
        this.scrollToBottom();
    }
    
    /**
     * Mesaj içeriğini formatlar (markdown benzeri)
     * @param {string} content - Mesaj içeriği
     * @returns {string} - Formatlanmış içerik
     */
    formatMessageContent(content) {
        // Kod bloklarını işle
        content = content.replace(/```([\s\S]*?)```/g, (match, code) => {
            // Dil belirtilmiş mi kontrol et
            const languageMatch = code.match(/^([a-zA-Z0-9]+)\n/);
            let language = '';
            let formattedCode = code;
            
            if (languageMatch) {
                language = languageMatch[1];
                formattedCode = code.substring(languageMatch[0].length);
            }
            
            return `<div class="code-block" data-language="${language}"><pre><code>${this.escapeHtml(formattedCode)}</code></pre></div>`;
        });
        
        // Satır içi kod bloklarını işle
        content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Başlıkları işle
        content = content.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        content = content.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        content = content.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        
        // Kalın metinleri işle
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // İtalik metinleri işle
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Listeleri işle
        content = content.replace(/^\s*[\-\*]\s+(.*$)/gm, '<li>$1</li>');
        content = content.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        
        // Numaralı listeleri işle
        content = content.replace(/^\s*\d+\.\s+(.*$)/gm, '<li>$1</li>');
        content = content.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');
        
        // Bağlantıları işle
        content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Paragrafları işle
        content = content.replace(/\n\n/g, '</p><p>');
        content = `<p>${content}</p>`;
        
        // Fazladan oluşan boş paragrafları temizle
        content = content.replace(/<p><\/p>/g, '');
        
        return content;
    }
    
    /**
     * HTML özel karakterlerini escape eder
     * @param {string} html - HTML içeriği
     * @returns {string} - Escape edilmiş içerik
     */
    escapeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
    
    /**
     * Kod bloklarını işler ve araç çubuğu ekler
     * @param {HTMLElement} messageEl - Mesaj elementi
     */
    processCodeBlocks(messageEl) {
        const codeBlocks = messageEl.querySelectorAll('.code-block');
        
        codeBlocks.forEach(block => {
            const language = block.getAttribute('data-language') || 'kod';
            const codeContent = block.querySelector('code').textContent;
            
            // Kod bloğuna araç çubuğu ekle
            const toolbar = document.createElement('div');
            toolbar.className = 'code-toolbar';
            toolbar.innerHTML = `
                <div class="code-language">${language}</div>
                <div class="code-actions">
                    <button class="code-action-btn copy-code-btn" title="Kodu Kopyala">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            `;
            
            block.insertBefore(toolbar, block.firstChild);
            
            // Kopyalama butonu için event listener
            const copyBtn = block.querySelector('.copy-code-btn');
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(codeContent)
                    .then(() => {
                        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Kopyalama hatası:', err);
                        copyBtn.innerHTML = '<i class="fas fa-times"></i>';
                        setTimeout(() => {
                            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                        }, 2000);
                    });
            });
        });
    }
    
    /**
     * Mesaj aksiyonları için event listener'ları ekler
     */
    addMessageActionListeners() {
        // Kopyalama butonları
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const messageId = btn.getAttribute('data-id');
                const message = this.messages.find(msg => msg.id === messageId);
                
                if (message) {
                    navigator.clipboard.writeText(message.content)
                        .then(() => {
                            btn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı';
                            setTimeout(() => {
                                btn.innerHTML = '<i class="fas fa-copy"></i> Kopyala';
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Kopyalama hatası:', err);
                        });
                }
            });
        });
        
        // Beğen butonları
        document.querySelectorAll('.thumbs-up-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const messageId = btn.getAttribute('data-id');
                // Beğeni işlemini gerçekleştir
                btn.classList.toggle('active');
                
                // API'ye bildir
                if (btn.classList.contains('active')) {
                    akiAPI.rateMessage(messageId, 'positive');
                }
                
                // Beğenme butonunu deaktif et
                const thumbsDownBtn = btn.parentElement.querySelector('.thumbs-down-btn');
                if (thumbsDownBtn.classList.contains('active')) {
                    thumbsDownBtn.classList.remove('active');
                }
            });
        });
        
        // Beğenme butonları
        document.querySelectorAll('.thumbs-down-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const messageId = btn.getAttribute('data-id');
                // Beğenmeme işlemini gerçekleştir
                btn.classList.toggle('active');
                
                // API'ye bildir
                if (btn.classList.contains('active')) {
                    akiAPI.rateMessage(messageId, 'negative');
                }
                
                // Beğen butonunu deaktif et
                const thumbsUpBtn = btn.parentElement.querySelector('.thumbs-up-btn');
                if (thumbsUpBtn.classList.contains('active')) {
                    thumbsUpBtn.classList.remove('active');
                }
            });
        });
    }
    
    /**
     * Yazıyor göstergesini gösterir
     */
    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        
        const chatMessages = this.chatArea.querySelector('.chat-messages');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-avatar ai">A</div>
            <div class="typing-content">
                <div class="typing-text">Aki AI yazıyor</div>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingIndicator);
        this.scrollToBottom();
    }
    
    /**
     * Yazıyor göstergesini gizler
     */
    hideTypingIndicator() {
        this.isTyping = false;
        
        const typingIndicator = this.chatArea.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    /**
     * Hata mesajı gösterir
     * @param {string} message - Hata mesajı
     */
    showErrorMessage(message) {
        const chatMessages = this.chatArea.querySelector('.chat-messages');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        chatMessages.appendChild(errorMessage);
        this.scrollToBottom();
        
        // 5 saniye sonra hata mesajını kaldır
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
    
    /**
     * Sohbet alanını en alta kaydırır
     */
    scrollToBottom() {
        this.chatArea.scrollTop = this.chatArea.scrollHeight;
    }
    
    /**
     * Zaman damgasını formatlar
     * @param {string} timestamp - ISO formatında zaman damgası
     * @returns {string} - Formatlanmış zaman
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        
        // Bugün ise saat:dakika formatında göster
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // Dün ise "Dün" olarak göster
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Dün ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // Diğer durumlar için tarih ve saat göster
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    /**
     * Dosya yükleme işlemini gerçekleştirir
     * @param {File} file - Yüklenen dosya
     */
    handleFileUpload(file) {
        // Dosya türüne göre işlem yap
        if (file.type.startsWith('image/')) {
            // Resim dosyası
            this.processImageFile(file);
        } else {
            // Diğer dosya türleri
            alert(`${file.name} dosyası yüklendi. Bu dosya türü için işlem henüz eklenmedi.`);
        }
    }
    
    /**
     * Resim dosyasını işler
     * @param {File} imageFile - Resim dosyası
     */
    processImageFile(imageFile) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            
            // Eğer aktif bir sohbet yoksa, yeni bir sohbet başlat
            if (!this.currentConversationId) {
                this.startNewConversation(`Resim: ${imageFile.name}`);
            }
            
            // Kullanıcı mesajını ekle (resim içeren)
            const userMessage = {
                id: 'msg_user_' + Date.now(),
                role: 'user',
                content: `![${imageFile.name}](${imageUrl})`,
                timestamp: new Date().toISOString()
            };
            
            this.messages.push(userMessage);
            this.renderMessages();
            
            // Yazıyor göstergesini göster
            this.showTypingIndicator();
            
            // Resim analizi için API'yi çağır
            akiAPI.analyzeImage(this.currentConversationId, imageFile)
                .then(response => {
                    // Yazıyor göstergesini kaldır
                    this.hideTypingIndicator();
                    
                    // AI yanıtını ekle
                    const aiMessage = {
                        id: response.id || 'msg_ai_' + Date.now(),
                        role: 'assistant',
                        content: response.description,
                        timestamp: new Date().toISOString()
                    };
                    
                    this.messages.push(aiMessage);
                    this.renderMessages();
                    
                    // Sohbet son güncelleme zamanını güncelle
                    const conversation = this.conversations.find(c => c.id === this.currentConversationId);
                    if (conversation) {
                        conversation.lastUpdated = new Date().toISOString();
                    }
                    
                    // Sohbet listesini güncelle
                    this.updateConversationsList();
                })
                .catch(error => {
                    console.error('Resim analizi hatası:', error);
                    
                    // Yazıyor göstergesini kaldır
                    this.hideTypingIndicator();
                    
                    // Hata mesajı göster
                    this.showErrorMessage('Resim analiz edilirken bir hata oluştu. Lütfen tekrar deneyin.');
                });
        };
        
        reader.readAsDataURL(imageFile);
    }
}