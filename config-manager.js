// Gestionnaire de configuration pour WebCarnet
const ConfigManager = {
    // Clé pour stocker l'API key dans le stockage local
    API_KEY_STORAGE_KEY: 'GPT4O_API_KEY',

    // Récupérer la clé API
    async getApiKey() {
        try {
            const result = await chrome.storage.local.get(this.API_KEY_STORAGE_KEY);
            return result[this.API_KEY_STORAGE_KEY];
        } catch (error) {
            console.error('Erreur lors de la récupération de la clé API:', error);
            throw error;
        }
    },

    // Sauvegarder la clé API
    async setApiKey(apiKey) {
        try {
            await chrome.storage.local.set({ [this.API_KEY_STORAGE_KEY]: apiKey });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la clé API:', error);
            throw error;
        }
    }
};

// Initialiser la configuration au démarrage
ConfigManager.getApiKey();
