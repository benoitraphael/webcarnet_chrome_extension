// Fonction de debug globale
function showDebug(message) {
    const debugDiv = document.getElementById('debug');
    if (debugDiv) {
        debugDiv.textContent = message;
    }
    console.log(message);
}

// Définition des prompts
const PROMPTS = {
    keypoints: {
        system: 'Tu es un assistant spécialisé dans l\'analyse d\'articles. Ta tâche est de résumer UNIQUEMENT le contenu de l\'article fourni, sans ajouter d\'informations externes. Si l\'article parle de X, ton résumé doit parler de X, pas d\'un autre sujet. Organise ta réponse avec des puces pour les points clés. Réponds toujours en français',
        user: content => `Voici l'article à analyser. IMPORTANT : Résume UNIQUEMENT cet article, ne parle pas d'autres sujets :\n\n${content}`
    },
    explain: {
        system: 'Tu es un expert en vulgarisation. Ta tâche est d\'expliquer le contenu fourni de façon claire et fluide, sans perdre en précision, comme tu le ferais pour un profane éduqué.',
        user: content => `Peux-tu m'expliquer ce texte de façon claire et fluide, sans perdre en précision, comme tu le ferais pour un profane éduqué ? Donne des exemples concrets s'il y en a. Ne laisse aucune zone d'ombre. Pas plus de 1000 signes. Réponds en français.\n\nTexte à expliquer :\n${content}`
    },
    note: {
        system: `Tu es NoteBuddy, un assistant spécialisé dans la création de Notes de Réflexion Condensée (NRC) pour un système de deuxième cerveau. Une NRC est une note concise qui capture l'essence d'une idée, d'un concept clé, d'une citation, d'une observation ou d'une expérience. Elle présente l'information de manière directe, intègre des citations pertinentes, et inclut une brève réflexion ou question ouverte.

Si des notes personnelles sont fournies, utilise-les en priorité pour enrichir ton analyse et personnaliser la note en fonction des réflexions précédentes de l'utilisateur.

Principes à suivre :
- Concision : 150-250 mots maximum
- Impact immédiat : Aller droit au but
- Clarté : Langage simple et direct
- Modularité : Chaque élément doit être utilisable indépendamment
- Neutralité : Présentation objective
- Pertinence : Focus sur l'essentiel
- Illustration : Utiliser des citations directes
- Réutilisabilité : Optimiser pour différents formats

Le format de sortie doit suivre exactement cette structure :
---
title: [Titre accrocheur capturant l'essence du sujet]
tags: [3-5 tags pertinents]
date: [Date du jour]
source: [URL exact de l'articleou référence de l'article]
---

# [Titre principal]

[Introduction directe présentant l'idée centrale, 2-3 phrases maximum]

## Citations clés en français
> [Citation 1 - la plus percutante, en français]

> [Citation 2 - si pertinent]

## Analyse
[Développement de l'idée en 2-3 paragraphes courts, incluant :
- Explications ou contexte nécessaire
- Liens avec d'autres concepts si pertinent
- Applications pratiques ou implications]

## Réflexion
[Question ouverte ou piste de réflexion pour conclure]`,
        user: content => `Crée une Note de Réflexion Condensée (NRC) à partir de ce contenu en suivant strictement le format spécifié dans les instructions système. Si des notes personnelles sont présentes, intègre-les dans ton analyse pour créer une note plus personnalisée et contextuelle.

Contenu à analyser :
${content}`
    },
    ideas: {
        system: 'Tu es un assistant créatif. Ta tâche est de générer 10 idées stimulantes, des angles inexploités, des applications pratiques, des connexions interdisciplinaires et des idées de contenu à partir du texte fourni.',
        user: content => `Vous recevrez un texte et votre tâche consistera à générer 10 idées de contenu pour les médias sociaux, newsletter  sur la base de cet article. Chaque idée doit être adaptée à un public professionnel. 

Votre tâche consiste à :
1. Générer 10 idées uniques de contenu pour les médias sociaux ou newsletter sur la base des points principaux, des idées ou des données de l'article.
2. Pour chaque idée, expliquez pourquoi elle pourrait susciter l'engagement d'un public professionnel.

Suivez les lignes directrices suivantes :
- Assurez-vous que chaque idée est distincte et qu'elle offre une valeur ajoutée aux professionnels.
- Envisagez différents formats de contenu tels que des articles textuels, des infographies, de courtes vidéos, des sondages ou des questions.
- Concentrez-vous sur les aspects les plus pertinents ou les plus intrigants pour un public de professionnels.
- Réfléchissez à la manière dont chaque idée pourrait susciter une discussion, un partage ou une interaction.

Veillez à ce que vos  10 idées soient créatives, variées et spécifiquement adaptées au contenu de l'article et à un public professionnel.

Rédigez en français.

Contenu à analyser :
${content}`
    },
    journal: {
        system: `Tu es un assistant spécialisé dans l'analyse et la réécriture de notes mentales personnelles. Tu as une sensibilité particulière aux nuances émotionnelles et une capacité à percevoir la personnalité derrière les mots. Tu comprends que chaque hésitation, chaque doute et chaque digression peut avoir une signification importante dans le processus de pensée.

Si des notes personnelles précédentes sont fournies, utilise-les en priorité pour :
- Maintenir la continuité de la réflexion
- Faire des liens avec les pensées précédentes
- Approfondir les questionnements existants
- Identifier les évolutions de la pensée

[TÂCHE]
Tu dois transformer des notes mentales en un journal de réflexion structuré qui :

Préserve l'authenticité et la profondeur de la pensée originale
Maintient les nuances, les doutes et les questionnements personnels
Reflète fidèlement la personnalité et le style de l'auteur
Apporte de la clarté et de la structure sans perdre en spontanéité

[MÉTHODE ET FORMAT]
ÉTAPE 1 - Analyse Initiale

Avant toute réécriture, pose-toi ces questions essentielles :

Quel est l'état d'esprit qui transparaît de ces notes ?
Quelles sont les incertitudes et les questionnements clés ?
Quelle est la voix unique de l'auteur (expressions, tournures, style) ?
Quelles connexions implicites existent entre les idées ?

ÉTAPE 2 - Structure de Réécriture
Format : Journal de réflexion personnel
Style : Authentique et fluide, alternant entre :

Passages descriptifs
Moments d'introspection
Questions ouvertes
Observations personnelles

Règles de réécriture :

Maintenir les marqueurs d'incertitude quand ils sont significatifs
Créer des transitions naturelles entre les idées
Préserver les expressions caractéristiques de l'auteur
Éviter tout langage standardisé ou cliché
Privilégier un ton informel comme pour un journal intime de réflexion
Éviter les hyperboles et les adverbes
Éviter le mot "crucial" et "fascinant"

ÉTAPE 3 - Format de Sortie
Structure le texte final dans Artifact comme suit :

Format : markdown
*[Date/Moment de réflexion si pertinent]*
[Corps du texte]

RAPPELS IMPORTANTS :

Ne jamais "lisser" les ambiguïtés significatives
Conserver les digressions qui enrichissent la réflexion
Maintenir le niveau de certitude/incertitude original
Laisser transparaître la personnalité à travers le style`,
        user: content => `Voici le texte à transformer en journal de réflexion personnel. Si des notes personnelles précédentes sont présentes, utilise-les pour créer une continuité dans la réflexion et approfondir les thèmes récurrents. Applique la méthode décrite dans les instructions système :

${content}`
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const analysisType = document.getElementById('analysisType');
    const analyzeButton = document.getElementById('analyzeButton');
    const keyPointsDiv = document.getElementById('keyPoints');
    const resultTitle = document.getElementById('resultTitle');
    const personalNotes = document.getElementById('personalNotes');
    const notesInput = document.getElementById('notesInput');
    const saveNotesBtn = document.getElementById('saveNotes');
    const apiMissingDiv = document.getElementById('apiMissing');
    const mainContentDiv = document.getElementById('mainContent');
    const openOptionsBtn = document.getElementById('openOptions');

    // Ajouter l'event listener pour le bouton Options avant la vérification
    if (openOptionsBtn) {
        openOptionsBtn.addEventListener('click', () => {
            console.log("Ouverture de la page d'options...");
            chrome.runtime.openOptionsPage();
        });
    }

    // Vérifier la clé API au chargement
    try {
        const apiKey = await ConfigManager.getApiKey();
        if (!apiKey) {
            showDebug("Clé API non configurée");
            apiMissingDiv.style.display = 'block';
            mainContentDiv.style.display = 'none';
            return;
        } else {
            apiMissingDiv.style.display = 'none';
            mainContentDiv.style.display = 'block';
        }
    } catch (error) {
        showDebug("Erreur lors de la vérification de la clé API: " + error.message);
        apiMissingDiv.style.display = 'block';
        mainContentDiv.style.display = 'none';
        return;
    }

    // Mettre à jour le titre lors du changement de type d'analyse
    analysisType.addEventListener('change', async () => {
        const type = analysisType.value;
        console.log("Type d'analyse sélectionné:", type);
        updateResultTitle(type);

        // Afficher la zone de notes pour tous les types d'analyse
        console.log("Affichage de la zone de notes");
        personalNotes.classList.add('visible');
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const savedNotes = await loadSavedNotes(tab.url, type);
        notesInput.value = savedNotes;
    });

    // Event listener pour le bouton de sauvegarde
    saveNotesBtn.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const type = analysisType.value;
        await saveNotes(tab.url, type, notesInput.value);
        showDebug('Notes sauvegardées');
    });

    // Initialiser le titre et la zone de notes
    const initialType = analysisType.value;
    console.log("Type initial:", initialType);
    updateResultTitle(initialType);

    console.log("Affichage initial de la zone de notes");
    personalNotes.classList.add('visible');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const savedNotes = await loadSavedNotes(tab.url, initialType);
    notesInput.value = savedNotes;

    // Gestionnaire de clic pour le bouton d'analyse
    analyzeButton.addEventListener('click', async () => {
        try {
            showDebug("Clic détecté");
            analyzeButton.textContent = 'Analyse en cours...';

            // Vérifier la clé API avant de continuer
            const apiKey = await ConfigManager.getApiKey();
            if (!apiKey) {
                showDebug("Veuillez configurer votre clé API dans les options");
                analyzeButton.textContent = 'Analyser';
                return;
            }

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // Exécuter le script dans la page
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: getPageContent,
            });

            const content = result[0].result;

            if (!content) {
                showDebug("Impossible de récupérer le contenu de la page");
                analyzeButton.textContent = 'Analyser';
                return;
            }

            const type = analysisType.value;

            // Récupérer les notes personnelles existantes si disponibles
            let existingNotes = '';
            existingNotes = notesInput.value || await loadSavedNotes(tab.url, type);
            console.log("Notes personnelles à analyser:", existingNotes);

            // Créer le contenu à analyser avec les notes personnelles
            const contentToAnalyze = existingNotes
                ? `[NOTES PERSONNELLES]\n${existingNotes}\n\n[CONTENU DE LA PAGE]\n${content}`
                : content;

            console.log("Contenu envoyé à l'API:", contentToAnalyze);

            const analysis = await analyzeWithGPT4o(contentToAnalyze, type);

            if (analysis) {
                const formattedAnalysis = formatAnalysis(analysis, type);
                keyPointsDiv.innerHTML = formattedAnalysis;
                updateResultTitle(type);
            }
        } catch (error) {
            showDebug(error.message);
        } finally {
            analyzeButton.textContent = 'Analyser';
        }
    });
});

// Fonctions utilitaires
function updateResultTitle(type) {
    const titles = {
        keypoints: 'Points clés',
        journal: 'Carnet de bord',
        explain: 'Explication détaillée',
        note: 'Note structurée',
        ideas: 'Idées générées'
    };
    const resultTitle = document.getElementById('resultTitle');
    resultTitle.textContent = titles[type] || '';
}

async function analyzeWithGPT4o(content, type) {
    try {
        showDebug("Récupération de la clé API...");
        const prompt = PROMPTS[type];
        const apiKey = await ConfigManager.getApiKey();

        if (!apiKey) {
            throw new Error("Clé API non trouvée");
        }

        showDebug("Appel de l'API OpenAI...");
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{
                    role: 'system',
                    content: prompt.system
                }, {
                    role: 'user',
                    content: prompt.user(content)
                }],
                max_tokens: 16384,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur API OpenAI: ${errorData.error?.message || 'Erreur inconnue'}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        showDebug(`Erreur: ${error.message}`);
        throw error;
    }
}

function formatAnalysis(analysis, type) {
    if (!analysis) return '';

    // Supprimer les marqueurs ```markdown au début et à la fin
    analysis = analysis.replace(/^```markdown\n/, '').replace(/\n```$/, '');

    // Fonction utilitaire pour formater le Markdown de base
    function formatMarkdown(line) {
        // Gestion du gras
        line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        // Gestion de l'italique
        line = line.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        // Gestion des citations
        line = line.replace(/^>\s*(.+)$/g, '<blockquote>$1</blockquote>');
        return line;
    }

    // Formatter chaque ligne avec le Markdown de base puis appliquer les règles spécifiques
    const lines = analysis.split('\n').map(line => {
        line = formatMarkdown(line);

        // Gestion des titres avec #
        if (line.match(/^#+\s/)) {
            const level = line.match(/^#+/)[0].length;
            const text = line.replace(/^#+\s*/, '');
            return `<h${level}>${text}</h${level}>`;
        }

        // Gestion des listes numérotées
        if (line.match(/^\d+\.\s/)) {
            const text = line.replace(/^\d+\.\s/, '');
            if (type === 'ideas') {
                return `<div class="idea-item">${text}</div>`;
            } else {
                return `<div class="numbered-item">${line}</div>`;
            }
        }

        // Gestion des puces
        if (line.match(/^[-*]\s/)) {
            return `<li>${line.substring(2)}</li>`;
        }

        // Gestion des sous-puces (indentées)
        if (line.match(/^\s+[-*]\s/)) {
            return `<li class="sub-item">${line.trim().substring(2)}</li>`;
        }

        // Gestion des séparateurs
        if (line.match(/^-{3,}$/)) {
            return '<hr>';
        }

        // Gestion des paragraphes non vides
        if (line.trim().length > 0) {
            if (type === 'ideas') {
                return `<p class="idea-explanation">${line}</p>`;
            } else {
                return `<p>${line}</p>`;
            }
        }

        return line;
    });

    // Grouper les éléments de liste
    let html = '';
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('<li>')) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            html += line;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += line;
        }
    }

    if (inList) {
        html += '</ul>';
    }

    return html;
}

function getPageContent() {
    // Liste des sélecteurs communs pour les articles principaux
    const articleSelectors = [
        'article.main-article',
        'article.post-content',
        'div.article-content',
        'div.post-content',
        'main article',
        '.article-body',
        '.story-body',
        '.main-content article',
        '[role="article"]',
        'article'  // En dernier recours
    ];

    let content = '';

    // Essayer chaque sélecteur jusqu'à trouver du contenu
    for (const selector of articleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            // Exclure les éléments non pertinents de l'article
            const excludeSelectors = [
                '.related-articles',
                '.recommended',
                '.advertisement',
                '.ads',
                '.comments',
                '.social-share',
                'nav',
                'header',
                'footer',
                '.sidebar'
            ];

            // Cloner l'élément pour ne pas modifier la page
            const clone = element.cloneNode(true);

            // Supprimer les éléments non désirés
            excludeSelectors.forEach(sel => {
                const elements = clone.querySelectorAll(sel);
                elements.forEach(el => el.remove());
            });

            content = clone.innerText;
            if (content.trim().length > 100) { // S'assurer qu'on a un contenu significatif
                break;
            }
        }
    }

    // Si aucun contenu n'est trouvé, essayer le contenu principal
    if (!content) {
        const main = document.querySelector('main');
        if (main) {
            content = main.innerText;
        }
    }

    // Nettoyer le contenu
    content = content
        .replace(/\s+/g, ' ')  // Remplacer les espaces multiples par un seul
        .replace(/\n\s*\n/g, '\n')  // Remplacer les lignes vides multiples par une seule
        .trim();

    return content;
}

// Fonction pour charger les notes sauvegardées
async function loadSavedNotes(url, type) {
    const key = `notes_${type}_${url}`;
    const result = await chrome.storage.local.get(key);
    return result[key] || '';
}

// Fonction pour sauvegarder les notes
async function saveNotes(url, type, notes) {
    const key = `notes_${type}_${url}`;
    await chrome.storage.local.set({ [key]: notes });

    // Afficher l'animation de confirmation
    const confirmation = document.getElementById('saveConfirmation');
    confirmation.classList.add('show');

    // Retirer la classe après l'animation
    setTimeout(() => {
        confirmation.classList.remove('show');
    }, 2000);
    showDebug('Notes sauvegardées');
}
