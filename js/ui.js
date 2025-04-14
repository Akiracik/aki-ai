/**
 * Kullanıcı Arayüzü İşlemleri
 * Bu dosya, kullanıcı arayüzü etkileşimleri için gerekli fonksiyonları içerir.
 */

class UIManager {
    constructor() {
        // DOM elementleri
        this.sidebar = document.querySelector('.sidebar');
        this.overlay = document.getElementById('overlay');
        this.modelModal = document.getElementById('modelModal');
        this.settingsModal = document.getElementById('settingsModal');
        this.profileModal = document.getElementById('profileModal');
        this.deleteConfirmModal = document.getElementById('deleteConfirmModal');
        this.editChatModal = document.getElementById('editChatModal');
        
        // Tema ayarı
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme(this.currentTheme);
        
        // Aktif araç
        this.activeTool = 'chat';
        
        // Event listener'ları ayarla
        this.setupEventListeners();
    }
    
    /**
     * Event listener'ları ayarlar
     */
    setupEventListeners() {
        // Sidebar araçları
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => {
                const tool = option.getAttribute('data-tool');
                
                // Eğer chat dışında bir araç seçilirse uyarı göster
                if (tool !== 'chat') {
                    this.showToolUnavailableWarning(tool);
                    return;
                }
                
                document.querySelectorAll('.option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.activeTool = tool;
                this.handleToolChange(tool);
            });
        });
        
        // Yeni sohbet butonu
        document.getElementById('newChatBtn').addEventListener('click', () => {
            chatManager.startNewConversation();
        });
        
        // Model seçici
        document.getElementById('modelSelector').addEventListener('click', () => {
            this.openModal(this.modelModal);
        });
        
        // Ayarlar butonu
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openModal(this.settingsModal);
        });
        
        // Geçmiş butonu
        document.getElementById('historyBtn').addEventListener('click', () => {
            alert('Geçmiş özelliği yakında eklenecektir.');
        });
        
        // Kullanıcı profili
        document.getElementById('userProfile').addEventListener('click', () => {
            this.openModal(this.profileModal);
        });
        
        // Modal kapatma butonları
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                this.closeModal(modal);
            });
        });
        
        // Overlay tıklama ile modalları kapat
        this.overlay.addEventListener('click', () => {
            this.closeAllModals();
        });
        
        // Model seçenekleri
        document.querySelectorAll('.model-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.model-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                
                const model = option.getAttribute('data-model');
                this.handleModelChange(model);
            });
        });
        
        // Tema değiştirme
        document.getElementById('themeSelector').addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });
        
        // Yazı boyutu değiştirme
        document.getElementById('fontSizeSelector').addEventListener('change', (e) => {
            this.applyFontSize(e.target.value);
        });
        
        // Profil butonları
        document.getElementById('editProfileBtn').addEventListener('click', () => {
            alert('Profil düzenleme özelliği yakında eklenecektir.');
        });
        
        document.getElementById('subscriptionBtn').addEventListener('click', () => {
            alert('Üyelik bilgileri özelliği yakında eklenecektir.');
        });
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
                alert('Çıkış yapıldı.');
                // Gerçek uygulamada oturum kapatma işlemi yapılacak
            }
        });
        
        // Sohbet silme onay butonları
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            const chatId = this.deleteConfirmModal.getAttribute('data-chat-id');
            chatManager.deleteConversation(chatId);
            this.closeModal(this.deleteConfirmModal);
        });
        
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.closeModal(this.deleteConfirmModal);
        });
        
        // Sohbet düzenleme butonları
        document.getElementById('saveChatTitleBtn').addEventListener('click', () => {
            const chatId = this.editChatModal.getAttribute('data-chat-id');
            const newTitle = document.getElementById('chatTitleInput').value.trim();
            
            if (newTitle) {
                chatManager.updateConversationTitle(chatId, newTitle);
                this.closeModal(this.editChatModal);
            }
        });
        
        // Responsive sidebar toggle
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // İlk yükleme için boyut kontrolü
        this.handleResize();
    }
    
    /**
     * Pencere boyutu değiştiğinde sidebar'ı ayarlar
     */
    handleResize() {
        if (window.innerWidth <= 768) {
            this.sidebar.classList.add('collapsed');
        } else {
            this.sidebar.classList.remove('collapsed');
        }
    }
    
    /**
     * Modalı açar
     * @param {HTMLElement} modal - Açılacak modal
     */
    openModal(modal) {
        this.overlay.classList.add('active');
        modal.classList.add('active');
    }
    
    /**
     * Modalı kapatır
     * @param {HTMLElement} modal - Kapatılacak modal
     */
    closeModal(modal) {
        this.overlay.classList.remove('active');
        modal.classList.remove('active');
    }
    
    /**
     * Tüm modalları kapatır
     */
    closeAllModals() {
        this.overlay.classList.remove('active');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    /**
     * Sohbet silme onay modalını gösterir
     * @param {string} chatId - Silinecek sohbet ID'si
     * @param {string} chatTitle - Silinecek sohbet başlığı
     */
    showDeleteConfirmation(chatId, chatTitle) {
        const confirmText = document.getElementById('deleteConfirmText');
        confirmText.textContent = `"${chatTitle}" sohbetini silmek istediğinize emin misiniz?`;
        
        this.deleteConfirmModal.setAttribute('data-chat-id', chatId);
        this.openModal(this.deleteConfirmModal);
    }
    
    /**
     * Sohbet düzenleme modalını gösterir
     * @param {string} chatId - Düzenlenecek sohbet ID'si
     * @param {string} chatTitle - Düzenlenecek sohbet başlığı
     */
    showEditChatModal(chatId, chatTitle) {
        const titleInput = document.getElementById('chatTitleInput');
        titleInput.value = chatTitle;
        
        this.editChatModal.setAttribute('data-chat-id', chatId);
        this.openModal(this.editChatModal);
        
        // Input'a odaklan
        setTimeout(() => {
            titleInput.focus();
            titleInput.select();
        }, 100);
    }
    
    /**
     * Kullanılamayan araç için uyarı gösterir
     * @param {string} tool - Seçilen araç
     */
    showToolUnavailableWarning(tool) {
        let toolName = '';
        
        switch (tool) {
            case 'image':
                toolName = 'Resim işleme';
                break;
            case 'video':
                toolName = 'Video analizi';
                break;
            default:
                toolName = 'Bu özellik';
                break;
        }
        
        const warningEl = document.createElement('div');
        warningEl.className = 'tool-warning';
        warningEl.innerHTML = `
            <div class="tool-warning-content">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="tool-warning-text">
                    <h3>${toolName} şu anda kullanılamıyor</h3>
                    <p>Bu özellik geliştirme aşamasındadır ve yakında kullanıma sunulacaktır.</p>
                </div>
                <button class="tool-warning-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        document.body.appendChild(warningEl);
        
        // Animasyon ekle
        setTimeout(() => {
            warningEl.classList.add('active');
        }, 10);
        
        // Kapatma butonu
        const closeBtn = warningEl.querySelector('.tool-warning-close');
        closeBtn.addEventListener('click', () => {
            warningEl.classList.remove('active');
            setTimeout(() => {
                warningEl.remove();
            }, 300);
        });
        
        // 5 saniye sonra otomatik kapat
        setTimeout(() => {
            if (document.body.contains(warningEl)) {
                warningEl.classList.remove('active');
                setTimeout(() => {
                    if (document.body.contains(warningEl)) {
                        warningEl.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    /**
     * Araç değişikliğini işler
     * @param {string} tool - Seçilen araç
     */
    handleToolChange(tool) {
        // Sadece sohbet aracı aktif
        if (tool === 'chat') {
            // Sohbet aracı seçildi
            console.log('Sohbet aracı aktif');
        }
    }
    
    /**
     * Model değişikliğini işler
     * @param {string} model - Seçilen model
     */
    handleModelChange(model) {
        // Model değişikliğini API'ye bildir
        akiAPI.setModel(model);
        
        // Model adını güncelle
        const modelName = document.querySelector('.model-name');
        switch (model) {
            case 'aki-v1':
                modelName.textContent = 'Aki AI v1.0';
                break;
            case 'aki-pro':
                modelName.textContent = 'Aki AI Pro';
                break;
            case 'aki-creative':
                modelName.textContent = 'Aki Creative';
                break;
        }
        
        // Modalı kapat
        this.closeModal(this.modelModal);
    }
    
    /**
     * Temayı uygular
     * @param {string} theme - Tema adı
     */
    applyTheme(theme) {
        this.currentTheme = theme;
        
        // Tema seçicisini güncelle
        const themeSelector = document.getElementById('themeSelector');
        if (themeSelector) {
            themeSelector.value = theme;
        }
        
        // Temayı kaydet
        localStorage.setItem('theme', theme);
        
        // Temayı uygula
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (theme === 'system') {
            // Sistem temasını kontrol et
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light');
            
            // Sistem teması değişikliğini dinle
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (this.currentTheme === 'system') {
                    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    /**
     * Yazı boyutunu uygular
     * @param {string} size - Yazı boyutu
     */
    applyFontSize(size) {
        // Yazı boyutunu kaydet
        localStorage.setItem('fontSize', size);
        
        // Yazı boyutunu uygula
        const body = document.body;
        body.classList.remove('font-small', 'font-medium', 'font-large');
        body.classList.add(`font-${size}`);
    }
}