document.addEventListener('DOMContentLoaded', async () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('save');
    const statusDiv = document.getElementById('status');

    // Charger la clé API existante
    try {
        const apiKey = await ConfigManager.getApiKey();
        if (apiKey) {
            apiKeyInput.value = apiKey;
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la clé API:', error);
    }

    // Sauvegarder la nouvelle clé API
    saveButton.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showStatus('Veuillez entrer une clé API', 'error');
            return;
        }

        try {
            await ConfigManager.setApiKey(apiKey);
            showStatus('Configuration sauvegardée !', 'success');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            showStatus('Erreur lors de la sauvegarde', 'error');
        }
    });

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = type;
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = '';
        }, 3000);
    }
});
