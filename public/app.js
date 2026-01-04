// Vocabulary Learning App Frontend

class VocabularyApp {
    constructor() {
        this.vocabularySets = [];
        this.currentReviewSet = null;
        this.reviewPairs = [];
        this.selectedWord = null;
        this.selectedDefinition = null;
        this.currentUser = null;

        this.initializeCurrentUser();
        this.initializeElements();
        this.bindEvents();
        this.loadVocabularySets();
    }

    initializeCurrentUser() {
        // Initialize a default user since we removed authentication
        this.currentUser = { username: 'default_user' };
        document.getElementById('username-display').textContent = this.currentUser.username;
    }

    initializeElements() {
        this.generateBtn = document.getElementById('generate-btn');
        this.themeInput = document.getElementById('theme-input');
        this.wordInput = document.getElementById('word-input');
        this.lookupBtn = document.getElementById('lookup-btn');
        this.vocabularyContainer = document.getElementById('vocabulary-container');
        this.startFullReviewBtn = document.getElementById('start-full-review-btn');
        this.startSingleReviewBtn = document.getElementById('start-single-review-btn');
        this.reviewContainer = document.getElementById('review-container');
        this.usernameDisplay = document.getElementById('username-display');

        // Check if elements were found
        if (!this.generateBtn) console.error('generate-btn not found');
        if (!this.themeInput) console.error('theme-input not found');
        if (!this.wordInput) console.error('word-input not found');
        if (!this.lookupBtn) console.error('lookup-btn not found');
        if (!this.vocabularyContainer) console.error('vocabulary-container not found');
        if (!this.startFullReviewBtn) console.error('start-full-review-btn not found');
        if (!this.startSingleReviewBtn) console.error('start-single-review-btn not found');
        if (!this.reviewContainer) console.error('review-container not found');
        if (!this.usernameDisplay) console.error('username-display not found');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateNewVocabulary());
        this.lookupBtn.addEventListener('click', () => this.lookupWord());
        this.startFullReviewBtn.addEventListener('click', () => this.startFullReview());
        this.startSingleReviewBtn.addEventListener('click', () => this.startSingleThemeReview());

        // Allow Enter key for word lookup
        this.wordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.lookupWord();
            }
        });

        // Allow Enter key for theme input - now triggers the same function
        this.themeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateNewVocabulary();
            }
        });

        // Add event listeners for theme suggestions - only fill the input field
        document.getElementById('theme-suggestions').addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-suggestion')) {
                const theme = e.target.getAttribute('data-theme');
                this.themeInput.value = theme;
                // Focus the input field after filling it
                this.themeInput.focus();
            }
        });
    }

    logout() {
        // Since we removed authentication, we just clear the local storage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedRememberMe');

        // Refresh the page to reset the app state
        window.location.reload();
    }
    
    async loadVocabularySets() {
        try {
            this.showLoading(this.vocabularyContainer, 'Loading vocabulary sets...');
            const response = await fetch('/api/vocabulary');

            const vocabularySets = await response.json();
            this.vocabularySets = vocabularySets;
            this.renderVocabularySets();
        } catch (error) {
            this.showError('Failed to load vocabulary sets', this.vocabularyContainer);
            console.error('Error loading vocabulary sets:', error);
        }
    }
    
    async generateNewVocabulary() {
        const theme = this.themeInput.value.trim();
        let userInput;

        // Prevent multiple clicks by disabling the button temporarily
        this.generateBtn.disabled = true;
        this.generateBtn.textContent = 'Generating...';

        if (theme) {
            // If there's a theme, use it
            userInput = `Learn Some Words: ${theme}`;
        } else {
            // If no theme, use the default random generation
            userInput = 'Learn Some Words';
        }

        try {
            const loadingMessage = theme ? `Generating vocabulary for theme: ${theme}...` : 'Generating new vocabulary set...';
            this.showLoading(this.vocabularyContainer, loadingMessage);

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userInput: userInput })
            });

            if (!response.ok) {
                throw new Error('Failed to generate vocabulary');
            }

            const result = await response.json();
            this.vocabularySets.unshift(result.data); // Add to the beginning
            this.renderVocabularySets();

            // Clear the theme input after successful generation
            if (theme) {
                this.themeInput.value = '';
            }
        } catch (error) {
            const errorMessage = theme ? `Failed to generate vocabulary for theme: ${theme}` : 'Failed to generate vocabulary';
            this.showError(errorMessage, this.vocabularyContainer);
            console.error('Error generating vocabulary:', error);
        } finally {
            // Re-enable the button after completion (success or failure)
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = 'Learn Some Words';
        }
    }
    
    async lookupWord() {
        const word = this.wordInput.value.trim();
        if (!word) {
            alert('Please enter a word to look up');
            return;
        }

        try {
            // Check if the word already exists in history as a word breakdown
            const existingWord = this.vocabularySets.find(set =>
                set.type === 'word_breakdown' &&
                set.word.toLowerCase() === word.toLowerCase()
            );

            if (existingWord) {
                // Word already exists in history, just show it
                this.showWordBreakdownDetails(existingWord);
                this.wordInput.value = '';
                return;
            }

            this.showLoading(this.vocabularyContainer, `Looking up word: ${word}...`);

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userInput: word })
            });

            if (!response.ok) {
                throw new Error('Failed to look up word');
            }

            const result = await response.json();

            // Add the word breakdown to the vocabulary sets (but don't show in main list)
            this.vocabularySets.unshift(result.data);

            // Show the word breakdown details directly
            this.showWordBreakdownDetails(result.data);

            // Clear the input
            this.wordInput.value = '';
        } catch (error) {
            this.showError(`Failed to look up word: ${word}`, this.vocabularyContainer);
            console.error('Error looking up word:', error);
        }
    }
    
    renderVocabularySets() {
        if (this.vocabularySets.length === 0) {
            this.vocabularyContainer.innerHTML = '<p>No vocabulary sets available. Generate some using the buttons above.</p>';
            return;
        }

        this.vocabularyContainer.innerHTML = '';

        // Filter to only show vocabulary sets (not word breakdowns)
        const vocabularySets = this.vocabularySets.filter(set => set.type === 'vocabulary_set');

        if (vocabularySets.length === 0) {
            this.vocabularyContainer.innerHTML = '<p>No vocabulary sets available. Generate some using the buttons above.</p>';
            return;
        }

        vocabularySets.forEach(set => {
            const card = document.createElement('div');
            card.className = 'vocabulary-card';
            card.setAttribute('data-set-id', set.id); // Set the ID as an attribute on the card

            // Create a summary view showing just the theme and word list
            card.innerHTML = `
                <h3>${set.theme}</h3>
                <div class="theme">Theme: ${set.theme}</div>

                <div class="word-list">
                    <h4>Words in this set:</h4>
                    <div class="words-summary">
                        ${set.words.map(word => `
                            <span class="word-tag">${word.word}</span>
                        `).join('')}
                    </div>
                </div>
            `;

            this.vocabularyContainer.appendChild(card);
        });

        // Add event listeners to the vocabulary cards to show details when clicked
        document.querySelectorAll('.vocabulary-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Prevent triggering when clicking on input fields or other interactive elements inside the card
                if (e.target.tagName.toLowerCase() !== 'input' && !e.target.closest('button')) {
                    const setId = card.getAttribute('data-set-id');
                    this.showVocabularySetDetails(setId);
                }
            });
        });
    }

    showVocabularySetDetails(setId) {
        const set = this.vocabularySets.find(s => s.id === setId);
        if (!set || set.type !== 'vocabulary_set') return;

        // Create a modal or expandable detail view
        const detailView = document.createElement('div');
        detailView.className = 'vocabulary-detail-view';
        detailView.innerHTML = `
            <div class="detail-header">
                <h3>${set.theme}</h3>
                <button class="close-details-btn">Close</button>
            </div>

            <div class="words-grid">
                ${set.words.map(word => `
                    <div class="word-card">
                        <div class="word">${word.word}</div>
                        <div class="part-of-speech">${word.partOfSpeech}</div>
                        <div class="chinese-definition">${word.chineseDefinition}</div>
                        <div class="memory-aid">${word.memoryAid}</div>
                        <div class="examples">
                            ${word.examples.map(example => `
                                <div class="example">
                                    <div class="sentence">${example.sentence}</div>
                                    <div class="chinese-translation">${example.chineseTranslation}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="story-section">
                <h4>Story</h4>
                <p><strong>English:</strong> ${set.story.english}</p>
                <p><strong>Chinese:</strong> ${set.story.chinese}</p>
            </div>
        `;

        // Replace the vocabulary container with the detail view temporarily
        this.vocabularyContainer.innerHTML = '';
        this.vocabularyContainer.appendChild(detailView);

        // Add event listener to close button
        document.querySelector('.close-details-btn').addEventListener('click', () => {
            this.renderVocabularySets(); // Go back to list view
        });
    }


    showWordBreakdownDetails(wordBreakdown) {
        // Create a detail view for a single word breakdown
        const detailView = document.createElement('div');
        detailView.className = 'vocabulary-detail-view';
        detailView.innerHTML = `
            <div class="detail-header">
                <h3>Word Breakdown: ${wordBreakdown.word}</h3>
                <button class="close-details-btn">Close</button>
            </div>

            <div class="word-card">
                <div class="word">${wordBreakdown.word}</div>
                <div class="pronunciation">${wordBreakdown.breakdown.pronunciation}</div>
                <div class="part-of-speech">${wordBreakdown.breakdown.partOfSpeech}</div>

                <div class="meanings">
                    <h4>Meanings:</h4>
                    ${wordBreakdown.breakdown.meanings.map(meaning => `
                        <div class="meaning">
                            <div><strong>Definition:</strong> ${meaning.definition}</div>
                            <div><strong>Chinese:</strong> ${meaning.chinese}</div>
                            <div><strong>Context:</strong> ${meaning.usageContext}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="etymology">
                    <strong>Etymology:</strong> ${wordBreakdown.breakdown.etymology}
                </div>

                <div class="memory-tips">
                    <strong>Memory Tips:</strong> ${wordBreakdown.breakdown.memoryTips}
                </div>

                <div class="examples">
                    <h4>Examples:</h4>
                    ${wordBreakdown.breakdown.examples.map(example => `
                        <div class="example">
                            <div class="sentence">${example.sentence}</div>
                            <div class="chinese-translation">${example.chineseTranslation}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="collocations">
                    <h4>Collocations:</h4>
                    ${wordBreakdown.breakdown.collocations.map(collocation => `
                        <div class="collocation">
                            <div><strong>${collocation.phrase}:</strong> ${collocation.chinese}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="nearby-words">
                    <h4>Nearby Words:</h4>
                    ${wordBreakdown.breakdown.nearbyWords.map(nearby => `
                        <div class="nearby-word">
                            <div><strong>${nearby.word}:</strong> ${nearby.distinction}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Replace the vocabulary container with the detail view temporarily
        this.vocabularyContainer.innerHTML = '';
        this.vocabularyContainer.appendChild(detailView);

        // Add event listener to close button
        document.querySelector('.close-details-btn').addEventListener('click', () => {
            this.renderVocabularySets(); // Go back to list view
        });
    }
    
    startFullReview() {
        if (this.vocabularySets.length === 0) {
            alert('No vocabulary sets available for review. Generate some first.');
            return;
        }

        // Get all words from all vocabulary sets
        const allWords = [];
        this.vocabularySets
            .filter(set => set.type === 'vocabulary_set' && set.words && set.words.length > 0)
            .forEach(set => {
                set.words.forEach(word => {
                    // Add the theme information to each word for reference
                    allWords.push({
                        ...word,
                        theme: set.theme
                    });
                });
            });

        if (allWords.length < 5) {
            alert('Not enough words available for review. Generate more vocabulary sets.');
            return;
        }

        // Select 5 random words from all available words
        const selectedWords = [...allWords]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        this.currentReviewSet = {
            theme: "Mixed Review",
            words: selectedWords
        };
        this.prepareReviewExercise();
    }

    startSingleThemeReview() {
        if (this.vocabularySets.length === 0) {
            alert('No vocabulary sets available for review. Generate some first.');
            return;
        }

        // Get all vocabulary sets that have words
        const vocabularySets = this.vocabularySets
            .filter(set => set.type === 'vocabulary_set' && set.words && set.words.length >= 5);

        if (vocabularySets.length === 0) {
            alert('No vocabulary sets with words found for review.');
            return;
        }

        // Select a random vocabulary set
        const randomSet = vocabularySets[Math.floor(Math.random() * vocabularySets.length)];

        this.currentReviewSet = randomSet;
        this.prepareReviewExercise();
    }
    
    prepareReviewExercise() {
        // Get 5 random words from the vocabulary set
        const words = [...this.currentReviewSet.words]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        // Get 5 random definitions from the same set (including the selected words' definitions)
        const allDefinitions = this.currentReviewSet.words.map(w => {
            // Ensure the chineseDefinition field exists and has a value
            return w.chineseDefinition || 'Definition not available';
        });

        const selectedDefinitions = [...words.map(w => {
            // Ensure the chineseDefinition field exists and has a value
            return w.chineseDefinition || 'Definition not available';
        })];

        // Add more definitions to make 5 total if needed
        const otherDefinitions = allDefinitions
            .filter(def => !selectedDefinitions.includes(def))
            .sort(() => 0.5 - Math.random())
            .slice(0, 5 - selectedDefinitions.length);

        const definitions = [...selectedDefinitions, ...otherDefinitions]
            .sort(() => 0.5 - Math.random()); // Shuffle definitions

        // Create pairs for review
        this.reviewPairs = words.map((word, index) => ({
            word: word.word,
            definition: word.chineseDefinition || 'Definition not available',
            matched: false,
            correct: false
        }));

        this.renderReviewExercise(words, definitions);
    }
    
    renderReviewExercise(words, definitions) {
        this.reviewContainer.innerHTML = `
            <div class="matching-exercise">
                <div class="words-column">
                    <h3>Words</h3>
                    ${words.map((word, index) => `
                        <div class="match-item" data-type="word" data-index="${index}">
                            ${word.word}
                        </div>
                    `).join('')}
                </div>
                
                <div class="definitions-column">
                    <h3>Definitions/Contexts</h3>
                    ${definitions.map((def, index) => `
                        <div class="match-item" data-type="definition" data-index="${index}">
                            ${def}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="feedback" id="review-feedback"></div>
            
            <div class="review-stats">
                <button id="check-answers-btn">Check Answers</button>
                <button id="reset-review-btn">Reset</button>
            </div>
        `;
        
        // Show the review container
        this.reviewContainer.style.display = 'block';
        
        // Bind events for the new elements
        document.querySelectorAll('.match-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleMatchItemClick(e));
        });
        
        document.getElementById('check-answers-btn').addEventListener('click', () => this.checkAnswers());
        document.getElementById('reset-review-btn').addEventListener('click', () => this.resetReview());
    }
    
    handleMatchItemClick(event) {
        const item = event.target;
        const type = item.dataset.type;
        const index = parseInt(item.dataset.index);

        // Only allow selection if item is not already matched
        if (item.classList.contains('matched')) {
            return;
        }

        if (type === 'word') {
            // Deselect previous word if different
            if (this.selectedWord && this.selectedWord !== item) {
                this.selectedWord.classList.remove('selected');
            }

            // Toggle selection for clicked word
            if (this.selectedWord === item) {
                this.selectedWord = null;
                item.classList.remove('selected');
            } else {
                this.selectedWord = item;
                item.classList.add('selected');
            }
        } else if (type === 'definition') {
            // Deselect previous definition if different
            if (this.selectedDefinition && this.selectedDefinition !== item) {
                this.selectedDefinition.classList.remove('selected');
            }

            // Toggle selection for clicked definition
            if (this.selectedDefinition === item) {
                this.selectedDefinition = null;
                item.classList.remove('selected');
            } else {
                this.selectedDefinition = item;
                item.classList.add('selected');
            }
        }

        // If both are selected, make a match
        if (this.selectedWord && this.selectedDefinition) {
            this.makeMatch();
        }
    }

    makeMatch() {
        // Remove any existing matches for these items
        this.removeExistingMatches();

        const wordIndex = parseInt(this.selectedWord.dataset.index);
        const defIndex = parseInt(this.selectedDefinition.dataset.index);

        // Store the match temporarily (not final until check)
        this.selectedWord.dataset.matchedTo = defIndex;
        this.selectedDefinition.dataset.matchedTo = wordIndex;

        // Mark as temporarily matched
        this.selectedWord.classList.add('temp-matched');
        this.selectedDefinition.classList.add('temp-matched');

        // Clear selections
        this.selectedWord.classList.remove('selected');
        this.selectedDefinition.classList.remove('selected');
        this.selectedWord = null;
        this.selectedDefinition = null;
    }

    removeExistingMatches() {
        // Remove temporary matches for the currently selected items
        if (this.selectedWord && this.selectedWord.dataset.matchedTo) {
            // Find the definition it was matched to and remove the match
            const oldDefIndex = parseInt(this.selectedWord.dataset.matchedTo);
            const oldDef = document.querySelector(`[data-type="definition"][data-index="${oldDefIndex}"]`);
            if (oldDef) {
                oldDef.classList.remove('temp-matched');
                delete oldDef.dataset.matchedTo;
            }
            this.selectedWord.classList.remove('temp-matched');
            delete this.selectedWord.dataset.matchedTo;
        }

        if (this.selectedDefinition && this.selectedDefinition.dataset.matchedTo) {
            // Find the word it was matched to and remove the match
            const oldWordIndex = parseInt(this.selectedDefinition.dataset.matchedTo);
            const oldWord = document.querySelector(`[data-type="word"][data-index="${oldWordIndex}"]`);
            if (oldWord) {
                oldWord.classList.remove('temp-matched');
                delete oldWord.dataset.matchedTo;
            }
            this.selectedDefinition.classList.remove('temp-matched');
            delete this.selectedDefinition.dataset.matchedTo;
        }
    }
    
    checkAnswers() {
        // Get all temporary matches
        const tempMatches = document.querySelectorAll('.temp-matched');

        if (tempMatches.length === 0) {
            this.showFeedback('Please make some matches first.', 'error');
            return;
        }

        // Check if all 5 words have been matched
        const tempWords = document.querySelectorAll('.temp-matched[data-type="word"]');
        if (tempWords.length !== 5) {
            this.showFeedback('Please match all 5 words with their definitions.', 'error');
            return;
        }

        // Calculate correct matches
        let correctCount = 0;
        for (let i = 0; i < 5; i++) {
            const wordItem = document.querySelector(`[data-type="word"][data-index="${i}"]`);
            if (wordItem && wordItem.dataset.matchedTo !== undefined) {
                const matchedDefIndex = parseInt(wordItem.dataset.matchedTo);
                const correctDefinition = this.reviewPairs[i].definition;
                const matchedDefText = document.querySelector(`[data-type="definition"][data-index="${matchedDefIndex}"]`).textContent.trim();

                if (correctDefinition === matchedDefText) {
                    correctCount++;
                    // Mark as correct
                    wordItem.classList.add('correct');
                    wordItem.classList.remove('temp-matched');
                    const matchedDef = document.querySelector(`[data-type="definition"][data-index="${matchedDefIndex}"]`);
                    matchedDef.classList.add('correct');
                    matchedDef.classList.remove('temp-matched');
                    wordItem.classList.add('matched'); // Final match
                    matchedDef.classList.add('matched'); // Final match
                } else {
                    // Mark as incorrect
                    wordItem.classList.add('incorrect');
                    wordItem.classList.remove('temp-matched');
                    const matchedDef = document.querySelector(`[data-type="definition"][data-index="${matchedDefIndex}"]`);
                    matchedDef.classList.add('incorrect');
                    matchedDef.classList.remove('temp-matched');
                    wordItem.classList.add('matched'); // Final match
                    matchedDef.classList.add('matched'); // Final match
                }
            }
        }

        const totalCount = 5;

        if (correctCount === totalCount) {
            this.showFeedback(`Perfect! You matched all ${totalCount} words correctly.`, 'success');
        } else {
            this.showFeedback(`You matched ${correctCount} out of ${totalCount} words correctly.`, 'error');
        }
    }

    resetReview() {
        this.selectedWord = null;
        this.selectedDefinition = null;

        // Reset UI
        document.querySelectorAll('.match-item').forEach(item => {
            item.classList.remove('selected', 'matched', 'correct', 'incorrect', 'temp-matched');
            delete item.dataset.matchedTo;
        });

        document.getElementById('review-feedback').className = 'feedback';
    }
    
    showFeedback(message, type) {
        const feedbackEl = document.getElementById('review-feedback');
        feedbackEl.textContent = message;
        feedbackEl.className = `feedback ${type}`;
    }
    
    showLoading(container, message) {
        container.innerHTML = `<div class="loading">${message}</div>`;
    }
    
    showError(message, container) {
        container.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VocabularyApp();
});