// Gestionnaire de configuration sécurisé
const ConfigManager = {
    // Initialise la configuration lors de la première installation
    async init() {
        try {
            const config = await chrome.storage.local.get('GPT4O_API_KEY');
            if (!config.GPT4O_API_KEY) {
                // Rediriger vers la page d'options si la clé n'est pas configurée
                chrome.runtime.openOptionsPage();
            }
            return config.GPT4O_API_KEY;
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la configuration:', error);
            return null;
        }
    },

    // Récupère la clé API de manière sécurisée
    async getApiKey() {
        try {
            const config = await chrome.storage.local.get('GPT4O_API_KEY');
            if (!config.GPT4O_API_KEY) {
                // Au lieu de lancer une erreur, on redirige simplement vers la page d'options
                chrome.runtime.openOptionsPage();
                return null;
            }
            return config.GPT4O_API_KEY;
        } catch (error) {
            console.error('Erreur lors de la récupération de la clé API:', error);
            return null;
        }
    }
};

// Initialiser la configuration au démarrage
ConfigManager.init();
