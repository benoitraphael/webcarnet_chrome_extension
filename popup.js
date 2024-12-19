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
        user: content => `Crée une Note de Réflexion Condensée (NRC) à partir de ce contenu en suivant strictement le format spécifié dans les instructions système. Le contenu doit être modulaire et facilement réutilisable pour différents formats (newsletter, posts sociaux, etc.).

Contenu à analyser :
${content}`
    },
    ideas: {
        system: 'Tu es un assistant créatif. Ta tâche est de générer des idées stimulantes, des angles inexploités, des applications pratiques, des connexions interdisciplinaires et des idées de contenu à partir du texte fourni.',
        user: content => `Analyse cette page et génère :

1. Questions Stimulantes
- [3 questions provocantes ou réflexions qui émergent du contenu]

2. Angles Inexploités
- [2-3 perspectives ou angles qui n'ont pas été abordés]

3. Applications Pratiques
- [2-3 façons d'appliquer ces informations concrètement]

4. Connexions Interdisciplinaires
- [2-3 liens avec d'autres domaines ou concepts]

5. Idées de Contenu
- [2-3 idées d'articles ou de contenus qui pourraient découler de ce sujet]

Contenu à analyser :
${content}`
    },
    journal: {
        system: `Tu es un assistant spécialisé dans l'analyse et la réécriture de notes mentales personnelles. Tu as une sensibilité particulière aux nuances émotionnelles et une capacité à percevoir la personnalité derrière les mots. Tu comprends que chaque hésitation, chaque doute et chaque digression peut avoir une signification importante dans le processus de pensée.

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
        user: content => `Voici le texte à transformer en journal de réflexion personnel. Applique la méthode décrite dans les instructions système :\n\n${content}`
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const analysisType = document.getElementById('analysisType');
    const analyzeButton = document.getElementById('analyzeButton');
    const keyPointsDiv = document.getElementById('keyPoints');
    const resultTitle = document.getElementById('resultTitle');
    
    if (!analysisType || !analyzeButton || !keyPointsDiv) {
        showDebug("Erreur: Éléments d'interface non trouvés");
        return;
    }

    // Vérifier que la clé API est disponible
    try {
        const apiKey = await ConfigManager.getApiKey();
        if (!apiKey) {
            showDebug("Erreur: Clé API non trouvée");
            return;
        }
        showDebug("Extension chargée");
    } catch (error) {
        showDebug("Erreur lors de la vérification de la clé API: " + error.message);
        return;
    }

    // Mettre à jour le titre lors du changement de type d'analyse
    analysisType.addEventListener('change', () => {
        updateResultTitle(analysisType.value);
    });
    
    // Initialiser le titre
    updateResultTitle(analysisType.value);

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

            const type = document.getElementById('analysisType').value;
            const analysis = await analyzeWithGPT4o(content, type);
            
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
        explain: 'Explication détaillée',
        note: 'Note structurée',
        ideas: 'Génération d\'idées',
        journal: 'Journal de réflexion'
    };
    const resultTitle = document.getElementById('resultTitle');
    if (resultTitle) {
        resultTitle.textContent = titles[type] || '';
    }
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
    if (type === 'note') {
        // Pour les NRC, conserver le formatage Markdown
        return analysis.split('\n').map(line => {
            // Gestion des titres avec #
            if (line.startsWith('#')) {
                // Enlever tous les # au début
                const titleText = line.replace(/^#+\s*/, '');
                return `<h2>${titleText}</h2>`;
            } else if (line.startsWith('>')) {
                return `<blockquote>${line.substring(1).trim()}</blockquote>`;
            } else if (line.match(/^---/)) {
                return '<hr>';
            } else {
                return `<p>${line}</p>`;
            }
        }).join('');
    } else if (type === 'ideas') {
        // Pour les idées, conserver le formatage Markdown avec support pour la numérotation et le gras
        return analysis.split('\n').map(line => {
            // Gestion du gras d'abord
            line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            
            // Gestion des titres numériques (1., 2., etc.)
            if (line.match(/^\d+\.\s/)) {
                return `<h2>${line}</h2>`;
            }
            // Gestion des titres avec #
            else if (line.startsWith('#')) {
                return `<h2>${line.substring(1).trim()}</h2>`;
            }
            // Gestion des citations
            else if (line.startsWith('>')) {
                return `<blockquote>${line.substring(1).trim()}</blockquote>`;
            }
            // Gestion des séparateurs
            else if (line.match(/^---/)) {
                return '<hr>';
            }
            // Gestion des puces
            else if (line.startsWith('-')) {
                return `<p>${line}</p>`;
            }
            else {
                return `<p>${line}</p>`;
            }
        }).join('');
    } else if (type === 'journal') {
        // Pour le journal, conserver le formatage Markdown avec support italique
        return analysis.split('\n').map(line => {
            // Gestion de l'italique d'abord
            line = line.replace(/\*([^*]+)\*/g, '<em>$1</em>');
            
            // Gestion des titres avec #
            if (line.startsWith('#')) {
                const titleText = line.replace(/^#+\s*/, '');
                return `<h2>${titleText}</h2>`;
            } else if (line.startsWith('>')) {
                return `<blockquote>${line.substring(1).trim()}</blockquote>`;
            } else if (line.match(/^---/)) {
                return '<hr>';
            } else {
                return `<p>${line}</p>`;
            }
        }).join('');
    } else {
        // Pour les autres types (keypoints et explain), formater avec des puces et supporter le gras
        return analysis.split('\n').map(line => {
            // Gestion du gras d'abord
            line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            // Puis gestion des puces
            line = line.replace(/^\s*[-*]\s+/, '• ');
            return `<p>${line}</p>`;
        }).join('');
    }
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
