document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page options chargée');
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveButton');
    const messageDiv = document.getElementById('message');

    if (!apiKeyInput || !saveButton || !messageDiv) {
        console.error('Éléments manquants dans la page options');
        return;
    }

    // Charger la clé API existante
    try {
        const result = await chrome.storage.local.get('GPT4O_API_KEY');
        if (result.GPT4O_API_KEY) {
            apiKeyInput.value = result.GPT4O_API_KEY;
            console.log('Clé API existante chargée');
        }
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        showMessage('Erreur lors du chargement de la clé API', false);
    }

    // Sauvegarder la nouvelle clé API
    saveButton.addEventListener('click', async () => {
        console.log('Bouton de sauvegarde cliqué');
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showMessage('Pour utiliser l\'extension, veuillez entrer une clé API (Allez sur https://platform.openai.com/)', false);
            return;
        }

        try {
            console.log('Tentative de sauvegarde de la clé API...');
            await chrome.storage.local.set({ GPT4O_API_KEY: apiKey });
            console.log('Clé API sauvegardée avec succès');
            showMessage('Clé API sauvegardée avec succès ! Vous pouvez maintenant revenir sur votre page web et relancer l\'extension.', true);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            showMessage('Erreur lors de la sauvegarde de la clé API: ' + error.message, false);
        }
    });

    function showMessage(text, isSuccess) {
        console.log('Affichage du message:', text);
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + (isSuccess ? 'success' : 'error');
    }
});
