// Vocabulary Learning App Frontend

class VocabularyApp {
    constructor() {
        this.vocabularySets = [];
        this.currentReviewSet = null;
        this.reviewPairs = [];
        this.selectedWord = null;
        this.selectedDefinition = null;
        this.currentUser = null;
        this.currentLanguage = 'en'; // Default language

        this.initializeCurrentUser();
        this.initializeElements();
        this.bindEvents();
        this.loadVocabularySets();
        this.setupLanguageSwitching();
        // Now that elements are initialized, refresh the theme suggestions
        setTimeout(() => {
            this.refreshThemeSuggestions();
        }, 100); // Small delay to ensure DOM is fully ready
    }

    async initializeCurrentUser() {
        // Initialize quotes data
        await this.loadQuotes();
        this.displayRandomQuote();

        // Load the themes data
        this.loadRecommendedThemes();
    }

    async loadRecommendedThemes() {
        try {
            // Get the current language from the UI
            const currentLanguage = document.querySelector('.language-tab.active')?.getAttribute('data-language') || 'english';

            // Fetch themes from the server based on the selected language
            const response = await fetch(`/api/themes/${currentLanguage}`);
            const data = await response.json();

            if (data.themes && data.themes.length > 0) {
                this.allThemes = data.themes;
            } else {
                // Fallback to default themes if API call fails
                this.allThemes = this.getDefaultThemesForLanguage(currentLanguage);
            }
        } catch (error) {
            console.error(`Error loading ${currentLanguage} themes:`, error);
            // Fallback to default themes if API call fails
            const currentLanguage = document.querySelector('.language-tab.active')?.getAttribute('data-language') || 'english';
            this.allThemes = this.getDefaultThemesForLanguage(currentLanguage);
        }
    }

    // Helper function to provide default themes if API fails
    getDefaultThemesForLanguage(language) {
        switch(language.toLowerCase()) {
            case 'spanish':
                return [
                    "Spanish: Basic Greetings",
                    "Spanish: Introductions",
                    "Spanish: Numbers 1-100",
                    "Spanish: Colors",
                    "Spanish: Family Members",
                    "Spanish: Days of the Week",
                    "Spanish: Months",
                    "Spanish: Time and Hours",
                    "Spanish: Food and Drinks",
                    "Spanish: Restaurant Vocabulary",
                    "Spanish: Shopping",
                    "Spanish: Clothing",
                    "Spanish: Body Parts",
                    "Spanish: Animals",
                    "Spanish: Weather",
                    "Spanish: Transportation",
                    "Spanish: Travel",
                    "Spanish: Hobbies",
                    "Spanish: School Subjects",
                    "Spanish: Professions"
                ];
            case 'japanese':
                return [
                    "Japanese: Basic Greetings",
                    "Japanese: Introductions",
                    "Japanese: Numbers 1-100",
                    "Japanese: Hiragana",
                    "Japanese: Katakana",
                    "Japanese: Basic Kanji",
                    "Japanese: Colors",
                    "Japanese: Family Members",
                    "Japanese: Days of the Week",
                    "Japanese: Months",
                    "Japanese: Time and Hours",
                    "Japanese: Food and Drinks",
                    "Japanese: Restaurant Vocabulary",
                    "Japanese: Shopping",
                    "Japanese: Clothing",
                    "Japanese: Body Parts",
                    "Japanese: Animals",
                    "Japanese: Weather",
                    "Japanese: Transportation",
                    "Japanese: Travel"
                ];
            case 'english':
            default:
                return [
                    "English: Daily Communication",
                    "English: Travel and Tourism",
                    "English: Food and Dining",
                    "English: Shopping",
                    "English: Family and Relationships",
                    "English: Health and Medicine",
                    "English: Work and Employment",
                    "English: Education",
                    "English: Hobbies and Interests",
                    "English: Sports and Recreation",
                    "English: Technology",
                    "English: Environment",
                    "English: Arts and Entertainment",
                    "English: Science and Nature",
                    "English: Business and Finance",
                    "English: Politics and Government",
                    "English: Culture and Traditions",
                    "English: Media and Communication",
                    "English: Transportation",
                    "English: Housing and Accommodation"
                ];
        }
    }

    async refreshThemeSuggestions() {
        console.log('Refreshing theme suggestions...');
        console.log('themeSuggestionsContainer:', this.themeSuggestionsContainer);

        // Reload themes based on current language
        await this.loadRecommendedThemes();

        if (!this.themeSuggestionsContainer) {
            console.error('themeSuggestionsContainer not found');
            return;
        }

        // Clear the current theme suggestions
        this.themeSuggestionsContainer.innerHTML = '';

        // Select 3 random themes from the list
        const shuffledThemes = [...this.allThemes].sort(() => 0.5 - Math.random());
        const selectedThemes = shuffledThemes.slice(0, 3);

        console.log('Selected themes:', selectedThemes);

        // Create theme elements
        selectedThemes.forEach(theme => {
            const themeElement = document.createElement('span');
            themeElement.className = 'theme-suggestion';
            // Extract a short display name from the theme (everything after the first colon and space)
            const parts = theme.split(': ');
            let displayName = theme;
            if (parts.length > 1) {
                // Join all parts after the first one to handle cases where the description itself contains colons
                displayName = parts.slice(1).join(': ');
            }
            themeElement.textContent = displayName;
            themeElement.setAttribute('data-theme', theme);

            this.themeSuggestionsContainer.appendChild(themeElement);
        });

        console.log('Theme suggestions refreshed');
    }

    async loadQuotes() {
        try {
            // Fetch quotes from the Excel file via the server
            const response = await fetch('/api/quotes');
            if (response.ok) {
                const data = await response.json();
                console.log('API response:', data); // Debug log
                this.quotes = data.quotes.map(quote => ({
                    en: quote.quote,
                    zh: this.translateToChinese(quote.quote), // Simple placeholder - in a real app you'd have proper translations
                    author: quote.author
                }));
                console.log('Processed quotes:', this.quotes); // Debug log
            } else {
                console.error('API call failed, using fallback quotes'); // Debug log
                // Fallback to default quotes if API call fails
                this.quotes = [
                    {
                        en: "The only way to do great work is to love what you do.",
                        zh: "做出伟大工作的唯一方法就是热爱你所做的事。",
                        author: "Steve Jobs"
                    },
                    {
                        en: "Life is what happens to you while you're busy making other plans.",
                        zh: "生活就是当你忙于做其他计划时发生在你身上的事。",
                        author: "John Lennon"
                    },
                    {
                        en: "The future belongs to those who believe in the beauty of their dreams.",
                        zh: "未来属于那些相信自己梦想之美的人。",
                        author: "Eleanor Roosevelt"
                    },
                    {
                        en: "It is during our darkest moments that we must focus to see the light.",
                        zh: "正是在我们最黑暗的时刻，我们必须专注于看到光明。",
                        author: "Aristotle"
                    },
                    {
                        en: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
                        zh: "成功不是终点，失败不是致命的：重要的是继续的勇气。",
                        author: "Winston Churchill"
                    },
                    {
                        en: "The only impossible journey is the one you never begin.",
                        zh: "唯一不可能的旅程是你从未开始的旅程。",
                        author: "Tony Robbins"
                    },
                    {
                        en: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
                        zh: "最终，我们记住的不是敌人的话语，而是朋友的沉默。",
                        author: "Martin Luther King Jr."
                    },
                    {
                        en: "The way to get started is to quit talking and begin doing.",
                        zh: "开始的方法是停止说话，开始行动。",
                        author: "Walt Disney"
                    },
                    {
                        en: "Don't let yesterday take up too much of today.",
                        zh: "不要让昨天占据今天太多。",
                        author: "Will Rogers"
                    },
                    {
                        en: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
                        zh: "你从失败中学到的比从成功中学到的更多。不要让它阻止你。失败塑造性格。",
                        author: "Unknown"
                    }
                ];
            }
        } catch (error) {
            console.error('Error loading quotes:', error);
            // Fallback to default quotes
            this.quotes = [
                {
                    en: "The only way to do great work is to love what you do.",
                    zh: "做出伟大工作的唯一方法就是热爱你所做的事。",
                    author: "Steve Jobs"
                },
                {
                    en: "Life is what happens to you while you're busy making other plans.",
                    zh: "生活就是当你忙于做其他计划时发生在你身上的事。",
                    author: "John Lennon"
                },
                {
                    en: "The future belongs to those who believe in the beauty of their dreams.",
                    zh: "未来属于那些相信自己梦想之美的人。",
                    author: "Eleanor Roosevelt"
                },
                {
                    en: "It is during our darkest moments that we must focus to see the light.",
                    zh: "正是在我们最黑暗的时刻，我们必须专注于看到光明。",
                    author: "Aristotle"
                },
                {
                    en: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
                    zh: "成功不是终点，失败不是致命的：重要的是继续的勇气。",
                    author: "Winston Churchill"
                },
                {
                    en: "The only impossible journey is the one you never begin.",
                    zh: "唯一不可能的旅程是你从未开始的旅程。",
                    author: "Tony Robbins"
                },
                {
                    en: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
                    zh: "最终，我们记住的不是敌人的话语，而是朋友的沉默。",
                    author: "Martin Luther King Jr."
                },
                {
                    en: "The way to get started is to quit talking and begin doing.",
                    zh: "开始的方法是停止说话，开始行动。",
                    author: "Walt Disney"
                },
                {
                    en: "Don't let yesterday take up too much of today.",
                    zh: "不要让昨天占据今天太多。",
                    author: "Will Rogers"
                },
                {
                    en: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
                    zh: "你从失败中学到的比从成功中学到的更多。不要让它阻止你。失败塑造性格。",
                    author: "Unknown"
                }
            ];
        }
    }

    // Simple translation function - in a real app you'd use a proper translation API
    translateToChinese(englishText) {
        // This is a placeholder - in a real implementation you would use a translation API
        const translations = {
            "The only way to do great work is to love what you do.": "做出伟大工作的唯一方法就是热爱你所做的事。",
            "Life is what happens to you while you're busy making other plans.": "生活就是当你忙于做其他计划时发生在你身上的事。",
            "The future belongs to those who believe in the beauty of their dreams.": "未来属于那些相信自己梦想之美的人。",
            "It is during our darkest moments that we must focus to see the light.": "正是在我们最黑暗的时刻，我们必须专注于看到光明。",
            "Success is not final, failure is not fatal: It is the courage to continue that counts.": "成功不是终点，失败不是致命的：重要的是继续的勇气。",
            "The only impossible journey is the one you never begin.": "唯一不可能的旅程是你从未开始的旅程。",
            "In the end, we will remember not the words of our enemies, but the silence of our friends.": "最终，我们记住的不是敌人的话语，而是朋友的沉默。",
            "The way to get started is to quit talking and begin doing.": "开始的方法是停止说话，开始行动。",
            "Don't let yesterday take up too much of today.": "不要让昨天占据今天太多。",
            "You learn more from failure than from success. Don't let it stop you. Failure builds character.": "你从失败中学到的比从成功中学到的更多。不要让它阻止你。失败塑造性格。",
            "The unexamined life is not worth living.": "未经审视的生活不值得过。",
            "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.": "在一个不断试图让你成为其他人的世界中做自己，是最伟大的成就。",
            "The only true wisdom is in knowing you know nothing.": "唯一的真正智慧在于知道自己一无所知。",
            "He who is not a good servant will not be a good master.": "不好好当下属的人不会成为好领导。",
            "The good life is a process, not a state of being.": "美好生活是一个过程，而不是一种存在状态。",
            "Man is the only creature who refuses to be what he is.": "人是唯一拒绝成为自己的生物。",
            "The greatest wealth is to live content with little.": "最大的财富是知足常乐。",
            "What we think, we become.": "我们所想的，就会成为我们。",
            "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.": "应对不自由世界的唯一方法是变得如此绝对自由，以至于你的存在本身就是一种反抗行为。",
            "Happiness is the highest good and the end at which all human activity aims.": "幸福是最高的善，是所有人类活动的目标。",
            "The mind is everything. What you think you become.": "心是一切。你所想的，就会成为什么。",
            "The greatest remedy for anger is delay.": "治疗愤怒的最好方法是延迟反应。",
            "The measure of a man is what he does with power.": "衡量一个人的标准是他如何使用权力。",
            "The only real prison is fear, and the only real freedom is freedom from fear.": "唯一的真正监狱是恐惧，唯一的真正自由是摆脱恐惧的自由。",
            "The unspoken word is the most eloquent.": "未说出口的话是最雄辩的。",
            "The only constant in life is change.": "生活中唯一的不变就是变化。",
            "The greatest danger for most of us lies not in setting our aim too high and falling short; but in setting our aim too low, and achieving our mark.": "对我们大多数人来说，最大的危险不在于目标定得太高而达不到，而在于目标定得太低而轻易实现。",
            "The best way to find out if you can trust somebody is to trust them.": "了解你是否可以信任某人的最好方法是信任他们。",
            "The only way to make sense out of change is to plunge into it, move with it, and join the dance.": "理解变化的唯一方法是投身其中，随其移动，并加入这场舞蹈。",
            "The greatest glory in living lies not in never falling, but in rising every time we fall.": "生命中最伟大的荣耀不在于从不跌倒，而在于每次跌倒后都能重新站起来。",
            "The only thing we have to fear is fear itself.": "我们唯一需要害怕的就是害怕本身。",
            "The best preparation for tomorrow is doing your best today.": "为明天做准备的最好方法是今天尽力而为。",
            "The greatest weapon against stress is our ability to choose one thought over another.": "对抗压力的最强大武器是我们选择一个想法而不是另一个想法的能力。",
            "The future belongs to those who believe in the beauty of their dreams.": "未来属于那些相信自己梦想之美的人。",
            "The only impossible journey is the one you never begin.": "唯一不可能的旅程是你从未开始的旅程。",
            "The only thing we absolutely need to function is the love of just one person.": "我们绝对需要的只是一个人的爱。",
            "The greatest discovery of all time is that a person can change his future by merely changing his attitude.": "有史以来最伟大的发现是，一个人只需改变态度就能改变未来。",
            "The only real mistake is the one from which we learn nothing.": "唯一的真正错误是我们没有从中学习的错误。",
            "The greatest danger for most of us is not that our aim is too high and we miss it, but that it is too low and we reach it.": "对我们大多数人来说，最大的危险不是目标太高而错过，而是目标太低而达到。",
            "The greatest wealth is not money, but spiritual wealth.": "最大的财富不是金钱，而是精神财富。",
            "The only thing you absolutely have to do in this world is to live your life.": "在这个世界上，你绝对要做的唯一事情就是过你的生活。",
            "The greatest pleasure of life is what people think of us.": "人生最大的快乐是别人对我们的看法。",
            "The only true failure in life is not to be true to your best.": "生活中唯一的真正失败是不忠于你的最佳状态。",
            "The greatest gift of life is to learn how to love.": "生命最大的礼物是学会如何爱。",
            "The only way to have a friend is to be one.": "拥有朋友的唯一方法是成为一个朋友。",
            "The greatest weapon against stress is our ability to choose one thought over another.": "对抗压力的最强大武器是我们选择一个想法而不是另一个想法的能力。",
            "The only way to do great work is to love what you do.": "做出伟大工作的唯一方法就是热爱你所做的事。",
            "The greatest danger for most of us lies not in setting our aim too high and falling short; but in setting our aim too low, and achieving our mark.": "对我们大多数人来说，最大的危险不在于目标定得太高而达不到，而在于目标定得太低而轻易实现。",
            "The only thing we absolutely need to function is the love of just one person.": "我们绝对需要的只是一个人的爱。",
            "The greatest discovery of all time is that a person can change his future by merely changing his attitude.": "有史以来最伟大的发现是，一个人只需改变态度就能改变未来。",
            "The only real mistake is the one from which we learn nothing.": "唯一的真正错误是我们没有从中学习的错误。",
            "The greatest glory in living lies not in never falling, but in rising every time we fall.": "生命中最伟大的荣耀不在于从不跌倒，而在于每次跌倒后都能重新站起来。",
            "The only way to make sense out of change is to plunge into it, move with it, and join the dance.": "理解变化的唯一方法是投身其中，随其移动，并加入这场舞蹈。",
            "The greatest wealth is not money, but spiritual wealth.": "最大的财富不是金钱，而是精神财富。",
            "The only thing you absolutely have to do in this world is to live your life.": "在这个世界上，你绝对要做的唯一事情就是过你的生活。",
            "The greatest pleasure of life is what people think of us.": "人生最大的快乐是别人对我们的看法。",
            "The only true failure in life is not to be true to your best.": "生活中唯一的真正失败是不忠于你的最佳状态。",
            "The greatest gift of life is to learn how to love.": "生命最大的礼物是学会如何爱。",
            "The only way to have a friend is to be one.": "拥有朋友的唯一方法是成为一个朋友。",
            "The greatest discovery of all time is that a person can change his future by merely changing his attitude.": "有史以来最伟大的发现是，一个人只需改变态度就能改变未来。",
            "The only thing we have to fear is fear itself.": "我们唯一需要害怕的就是害怕本身。",
            "The greatest glory in living lies not in never falling, but in rising every time we fall.": "生命中最伟大的荣耀不在于从不跌倒，而在于每次跌倒后都能重新站起来。",
            "The only impossible journey is the one you never begin.": "唯一不可能的旅程是你从未开始的旅程。",
            "The greatest weapon against stress is our ability to choose one thought over another.": "对抗压力的最强大武器是我们选择一个想法而不是另一个想法的能力。",
            "The only way to do great work is to love what you do.": "做出伟大工作的唯一方法就是热爱你所做的事。",
            "The future belongs to those who believe in the beauty of their dreams.": "未来属于那些相信自己梦想之美的人。",
            "The greatest danger for most of us lies not in setting our aim too high and falling short; but in setting our aim too low, and achieving our mark.": "对我们大多数人来说，最大的危险不在于目标定得太高而达不到，而在于目标定得太低而轻易实现。",
            "The only thing we absolutely need to function is the love of just one person.": "我们绝对需要的只是一个人的爱。",
            "The greatest discovery of all time is that a person can change his future by merely changing his attitude.": "有史以来最伟大的发现是，一个人只需改变态度就能改变未来。",
            "The only real mistake is the one from which we learn nothing.": "唯一的真正错误是我们没有从中学习的错误。",
            "The greatest glory in living lies not in never falling, but in rising every time we fall.": "生命中最伟大的荣耀不在于从不跌倒，而在于每次跌倒后都能重新站起来。",
            "The only way to make sense out of change is to plunge into it, move with it, and join the dance.": "理解变化的唯一方法是投身其中，随其移动，并加入这场舞蹈。",
            "The greatest wealth is not money, but spiritual wealth.": "最大的财富不是金钱，而是精神财富。",
            "The only thing you absolutely have to do in this world is to live your life.": "在这个世界上，你绝对要做的唯一事情就是过你的生活。",
            "The greatest pleasure of life is what people think of us.": "人生最大的快乐是别人对我们的看法。",
            "The only true failure in life is not to be true to your best.": "生活中唯一的真正失败是不忠于你的最佳状态。",
            "The greatest gift of life is to learn how to love.": "生命最大的礼物是学会如何爱。",
            "The only way to have a friend is to be one.": "拥有朋友的唯一方法是成为一个朋友。",
            "The greatest discovery of all time is that a person can change his future by merely changing his attitude.": "有史以来最伟大的发现是，一个人只需改变态度就能改变未来。",
            "The only thing we have to fear is fear itself.": "我们唯一需要害怕的就是害怕本身。",
            "The greatest glory in living lies not in never falling, but in rising every time we fall.": "生命中最伟大的荣耀不在于从不跌倒，而在于每次跌倒后都能重新站起来。",
            "The only impossible journey is the one you never begin.": "唯一不可能的旅程是你从未开始的旅程。",
            "The greatest weapon against stress is our ability to choose one thought over another.": "对抗压力的最强大武器是我们选择一个想法而不是另一个想法的能力。",
            "The only way to do great work is to love what you do.": "做出伟大工作的唯一方法就是热爱你所做的事。",
            "The future belongs to those who believe in the beauty of their dreams.": "未来属于那些相信自己梦想之美的人。",
            "The greatest danger for most of us lies not in setting our aim too high and falling short; but in setting our aim too low, and achieving our mark.": "对我们大多数人来说，最大的危险不在于目标定得太高而达不到，而在于目标定得太低而轻易实现。",
            "The only thing we absolutely need to function is the love of just one person.": "我们绝对需要的只是一个人的爱。",
            "The greatest discovery of all time is that a person can change his future by merely changing his attitude.": "有史以来最伟大的发现是，一个人只需改变态度就能改变未来。",
            "The only real mistake is the one from which we learn nothing.": "唯一的真正错误是我们没有从中学习的错误。"
        };

        return translations[englishText] || `[Chinese translation not available for: ${englishText.substring(0, 30)}...]`;
    }

    displayRandomQuote() {
        if (!this.quotes || this.quotes.length === 0) {
            this.loadQuotes();
        }

        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        const quote = this.quotes[randomIndex];

        const quoteTextElement = document.getElementById('quote-text');
        const quoteAuthorElement = document.getElementById('quote-author');

        if (quoteTextElement && quoteAuthorElement) {
            quoteTextElement.textContent = `"${quote.en}" - ${quote.zh}`;
            quoteAuthorElement.textContent = quote.author;
        }
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
        this.refreshThemesBtn = document.getElementById('refresh-themes-btn');
        this.themeSuggestionsContainer = document.getElementById('theme-suggestions');
        this.langTabElements = document.querySelectorAll('.lang-tab');

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
        if (!this.refreshThemesBtn) {
            console.error('refresh-themes-btn not found');
        } else {
            console.log('refresh-themes-btn found:', this.refreshThemesBtn);
        }
        if (!this.themeSuggestionsContainer) {
            console.error('theme-suggestions not found');
        } else {
            console.log('theme-suggestions found:', this.themeSuggestionsContainer);
        }
        if (!this.langTabElements) console.error('lang-tab elements not found');
    }

    setupLanguageSwitching() {
        // Add event listeners to language tabs
        this.langTabElements.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const selectedLang = e.target.getAttribute('data-lang');
                this.switchLanguage(selectedLang);
            });
        });
    }

    switchLanguage(lang) {
        // Update the active tab
        this.langTabElements.forEach(tab => {
            if (tab.getAttribute('data-lang') === lang) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update the current language
        this.currentLanguage = lang;

        // Update the UI to reflect the language change
        this.updateUIForLanguage(lang);

        // Reload vocabulary sets for the selected language
        this.loadVocabularySets();

        // Refresh theme suggestions for the new language
        this.refreshThemeSuggestions();
    }

    updateUIForLanguage(lang) {
        // Update header text based on language
        const header = document.querySelector('header h1');
        if (header) {
            switch(lang) {
                case 'en':
                    header.textContent = 'Advanced Vocabulary Learning';
                    break;
                case 'es':
                    header.textContent = 'Aprendizaje de Vocabulario Avanzado';
                    break;
                case 'ja':
                    header.textContent = '高度語彙学習';
                    break;
                default:
                    header.textContent = 'Advanced Vocabulary Learning';
            }
        }

        // Update section headers based on language
        const generateSectionHeader = document.querySelector('#generation-section h2');
        if (generateSectionHeader) {
            switch(lang) {
                case 'en':
                    generateSectionHeader.textContent = 'Generate New Vocabulary';
                    break;
                case 'es':
                    generateSectionHeader.textContent = 'Generar Nuevo Vocabulario';
                    break;
                case 'ja':
                    generateSectionHeader.textContent = '新しい語彙を生成';
                    break;
                default:
                    generateSectionHeader.textContent = 'Generate New Vocabulary';
            }
        }

        // Update theme input placeholder
        if (this.themeInput) {
            switch(lang) {
                case 'en':
                    this.themeInput.placeholder = 'Enter keywords for theme (e.g., \'biology: genetics\', \'computer science: AI\') or leave empty for random';
                    break;
                case 'es':
                    this.themeInput.placeholder = 'Ingrese palabras clave para el tema (por ejemplo, \'biología: genética\', \'ciencias de la computación: IA\') o déjelo vacío para aleatorio';
                    break;
                case 'ja':
                    this.themeInput.placeholder = 'テーマのキーワードを入力してください（例：\'生物学: 遺伝学\'、\'コンピューターサイエンス: AI\'）または空欄にしてランダム生成';
                    break;
                default:
                    this.themeInput.placeholder = 'Enter keywords for theme (e.g., \'biology: genetics\', \'computer science: AI\') or leave empty for random';
            }
        }

        // Update generate button text
        if (this.generateBtn) {
            switch(lang) {
                case 'en':
                    this.generateBtn.textContent = 'Learn Some Words';
                    break;
                case 'es':
                    this.generateBtn.textContent = 'Aprender Algunas Palabras';
                    break;
                case 'ja':
                    this.generateBtn.textContent = 'いくつかの単語を学ぶ';
                    break;
                default:
                    this.generateBtn.textContent = 'Learn Some Words';
            }
        }

        // Update word input placeholder
        if (this.wordInput) {
            switch(lang) {
                case 'en':
                    this.wordInput.placeholder = 'Enter a specific word to learn...';
                    break;
                case 'es':
                    this.wordInput.placeholder = 'Ingrese una palabra específica para aprender...';
                    break;
                case 'ja':
                    this.wordInput.placeholder = '学習する特定の単語を入力してください...';
                    break;
                default:
                    this.wordInput.placeholder = 'Enter a specific word to learn...';
            }
        }

        // Update lookup button text
        if (this.lookupBtn) {
            switch(lang) {
                case 'en':
                    this.lookupBtn.textContent = 'Lookup Word';
                    break;
                case 'es':
                    this.lookupBtn.textContent = 'Buscar Palabra';
                    break;
                case 'ja':
                    this.lookupBtn.textContent = '単語を検索';
                    break;
                default:
                    this.lookupBtn.textContent = 'Lookup Word';
            }
        }

        // Update vocabulary display header
        const vocabularyDisplayHeader = document.querySelector('#vocabulary-display h2');
        if (vocabularyDisplayHeader) {
            switch(lang) {
                case 'en':
                    vocabularyDisplayHeader.textContent = 'Your Vocabulary Sets';
                    break;
                case 'es':
                    vocabularyDisplayHeader.textContent = 'Tus Conjuntos de Vocabulario';
                    break;
                case 'ja':
                    vocabularyDisplayHeader.textContent = 'あなたの語彙セット';
                    break;
                default:
                    vocabularyDisplayHeader.textContent = 'Your Vocabulary Sets';
            }
        }

        // Update review section header
        const reviewSectionHeader = document.querySelector('#review-section h2');
        if (reviewSectionHeader) {
            switch(lang) {
                case 'en':
                    reviewSectionHeader.textContent = 'Review Vocabulary';
                    break;
                case 'es':
                    reviewSectionHeader.textContent = 'Revisar Vocabulario';
                    break;
                case 'ja':
                    reviewSectionHeader.textContent = '語彙を復習';
                    break;
                default:
                    reviewSectionHeader.textContent = 'Review Vocabulary';
            }
        }

        // Update review buttons
        if (this.startFullReviewBtn) {
            switch(lang) {
                case 'en':
                    this.startFullReviewBtn.textContent = 'Full Review';
                    break;
                case 'es':
                    this.startFullReviewBtn.textContent = 'Revisión Completa';
                    break;
                case 'ja':
                    this.startFullReviewBtn.textContent = '完全復習';
                    break;
                default:
                    this.startFullReviewBtn.textContent = 'Full Review';
            }
        }

        if (this.startSingleReviewBtn) {
            switch(lang) {
                case 'en':
                    this.startSingleReviewBtn.textContent = 'Single Theme Review';
                    break;
                case 'es':
                    this.startSingleReviewBtn.textContent = 'Revisión de Tema Único';
                    break;
                case 'ja':
                    this.startSingleReviewBtn.textContent = '単一テーマ復習';
                    break;
                default:
                    this.startSingleReviewBtn.textContent = 'Single Theme Review';
            }
        }
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
        // Using event delegation to handle both static and dynamically created elements
        this.themeSuggestionsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-suggestion')) {
                const theme = e.target.getAttribute('data-theme');
                this.themeInput.value = theme;
                // Focus the input field after filling it
                this.themeInput.focus();
            }
        });

        // Add event listener for refresh themes button
        this.refreshThemesBtn.addEventListener('click', () => {
            console.log('Refresh button clicked');
            this.refreshThemeSuggestions();
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
            const response = await fetch(`/api/vocabulary?lang=${this.currentLanguage}`);

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
                body: JSON.stringify({
                    userInput: userInput,
                    language: this.currentLanguage
                })
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
            this.generateBtn.textContent = this.currentLanguage === 'en' ? 'Learn Some Words' :
                                          this.currentLanguage === 'es' ? 'Aprender Algunas Palabras' : 'いくつかの単語を学ぶ';
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
                body: JSON.stringify({
                    userInput: word,
                    language: this.currentLanguage
                })
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

        // Filter to only show vocabulary sets (not word breakdowns) for the current language
        const vocabularySets = this.vocabularySets.filter(set =>
            set.type === 'vocabulary_set' &&
            (set.language === this.currentLanguage || !set.language) // Show sets without language or matching current language
        );

        if (vocabularySets.length === 0) {
            this.vocabularyContainer.innerHTML = '<p>No vocabulary sets available for the selected language. Generate some using the buttons above.</p>';
            return;
        }

        vocabularySets.forEach(set => {
            const card = document.createElement('div');
            card.className = 'vocabulary-card';
            card.setAttribute('data-set-id', set.id); // Set the ID as an attribute on the card

            // Create a summary view showing just the theme and word list
            card.innerHTML = `
                <h3>${set.theme}</h3>

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

        // For all languages, the definition field is 'chineseDefinition' (Chinese explanations)
        let definitionField = 'chineseDefinition';
        let translationField = 'chineseTranslation';
        let storyField = 'chinese';
        let languageName = 'Chinese';

        if (set.language === 'es') {
            translationField = 'spanishTranslation';  // Spanish example sentences
            storyField = 'spanish';
            languageName = 'Spanish';
        } else if (set.language === 'ja') {
            translationField = 'japaneseTranslation';  // Japanese example sentences
            storyField = 'japanese';
            languageName = 'Japanese';
        }

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
                        <div class="chinese-definition">${word[definitionField]}</div>
                        <div class="memory-aid">${word.memoryAid}</div>
                        <div class="examples">
                            ${word.examples.map(example => `
                                <div class="example">
                                    <div class="sentence">${example.sentence}</div>
                                    <div class="chinese-translation">${example[translationField]}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="story-section">
                <h4>Story</h4>
                <p><strong>English:</strong> ${set.story.english}</p>
                <p><strong>${languageName}:</strong> ${set.story[storyField]}</p>
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
        // For word breakdowns, the definition field is 'chinese' (Chinese explanations)
        let definitionField = 'chinese';
        let exampleField = 'chineseTranslation';
        let collocationField = 'chinese';
        let distinctionField = '与原词的区别';
        let etymologyField = '词源与构词分析';
        let memoryTipsField = '记忆技巧';
        let languageName = 'Chinese';

        if (wordBreakdown.language === 'es') {
            exampleField = 'spanishTranslation';  // Spanish example sentences
            collocationField = '中文注解';  // Chinese explanations for Spanish
            distinctionField = '与原词的区别';  // Chinese explanations for Spanish
            etymologyField = '词源与构词分析';  // Chinese explanations for Spanish
            memoryTipsField = '记忆技巧';  // Chinese explanations for Spanish
            languageName = 'Spanish';
        } else if (wordBreakdown.language === 'ja') {
            exampleField = 'japaneseTranslation';  // Japanese example sentences
            collocationField = '中文注解';  // Chinese explanations for Japanese
            distinctionField = '与原词的区别';  // Chinese explanations for Japanese
            etymologyField = '词源与构词分析';  // Chinese explanations for Japanese
            memoryTipsField = '记忆技巧';  // Chinese explanations for Japanese
            languageName = 'Japanese';
        }

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
                            <div><strong>${languageName}:</strong> ${meaning[definitionField]}</div>
                            <div><strong>Context:</strong> ${meaning.usageContext}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="etymology">
                    <strong>Etymology:</strong> ${wordBreakdown.breakdown.etymology || etymologyField}
                </div>

                <div class="memory-tips">
                    <strong>Memory Tips:</strong> ${wordBreakdown.breakdown.memoryTips || memoryTipsField}
                </div>

                <div class="examples">
                    <h4>Examples:</h4>
                    ${wordBreakdown.breakdown.examples.map(example => `
                        <div class="example">
                            <div class="sentence">${example.sentence}</div>
                            <div class="chinese-translation">${example[exampleField]}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="collocations">
                    <h4>Collocations:</h4>
                    ${wordBreakdown.breakdown.collocations.map(collocation => `
                        <div class="collocation">
                            <div><strong>${collocation.phrase}:</strong> ${collocation[collocationField]}</div>
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

        // Get all unique words from all vocabulary sets
        const allWordsMap = new Map();
        this.vocabularySets
            .filter(set => set.type === 'vocabulary_set' && set.words && set.words.length > 0)
            .forEach(set => {
                set.words.forEach(word => {
                    // Use word as key to ensure uniqueness
                    if (!allWordsMap.has(word.word)) {
                        // Add the theme information to each word for reference
                        allWordsMap.set(word.word, {
                            ...word,
                            theme: set.theme
                        });
                    }
                });
            });

        const allWords = Array.from(allWordsMap.values());

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

        // Get all vocabulary sets that have at least 5 unique words
        const vocabularySets = this.vocabularySets
            .filter(set => {
                if (set.type !== 'vocabulary_set' || !set.words) return false;

                // Create a set of unique words to check if there are at least 5
                const uniqueWords = new Set(set.words.map(word => word.word));
                return uniqueWords.size >= 5;
            });

        if (vocabularySets.length === 0) {
            alert('No vocabulary sets with at least 5 unique words found for review.');
            return;
        }

        // Select a random vocabulary set
        const randomSet = vocabularySets[Math.floor(Math.random() * vocabularySets.length)];

        this.currentReviewSet = randomSet;
        this.prepareReviewExercise();
    }
    
    prepareReviewExercise() {
        // Get unique words from the vocabulary set
        const uniqueWords = [...this.currentReviewSet.words];

        // Shuffle and select 5 unique words (or all available if less than 5)
        const words = [...uniqueWords]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(5, uniqueWords.length));

        // Get unique definitions from the vocabulary set
        const allUniqueDefinitions = [...new Set(this.currentReviewSet.words.map(w => {
            // Ensure the chineseDefinition field exists and has a value
            return w.chineseDefinition || 'Definition not available';
        }))];

        // Get the definitions for the selected words
        const selectedDefinitions = [...new Set(words.map(w => {
            // Ensure the chineseDefinition field exists and has a value
            return w.chineseDefinition || 'Definition not available';
        }))];

        // Add more unique definitions to make up 5 total if needed
        let otherDefinitions = [];
        const remainingDefinitions = allUniqueDefinitions
            .filter(def => !selectedDefinitions.includes(def));

        if (remainingDefinitions.length > 0) {
            otherDefinitions = [...remainingDefinitions]
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.min(5 - selectedDefinitions.length, remainingDefinitions.length));
        }

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

        // Generate a unique pairing ID for color variation
        if (!this.pairingAttemptCount) {
            this.pairingAttemptCount = 0;
        }
        this.pairingAttemptCount++;
        const pairingClass = `pairing-attempt-${this.pairingAttemptCount % 5}`; // Cycle through 5 different colors

        // Mark as temporarily matched with a unique pairing class
        this.selectedWord.classList.add('temp-matched', pairingClass);
        this.selectedDefinition.classList.add('temp-matched', pairingClass);

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
                // Remove any pairing attempt classes
                for (let i = 0; i < 5; i++) {
                    oldDef.classList.remove(`pairing-attempt-${i}`);
                }
                delete oldDef.dataset.matchedTo;
            }
            this.selectedWord.classList.remove('temp-matched');
            // Remove any pairing attempt classes
            for (let i = 0; i < 5; i++) {
                this.selectedWord.classList.remove(`pairing-attempt-${i}`);
            }
            delete this.selectedWord.dataset.matchedTo;
        }

        if (this.selectedDefinition && this.selectedDefinition.dataset.matchedTo) {
            // Find the word it was matched to and remove the match
            const oldWordIndex = parseInt(this.selectedDefinition.dataset.matchedTo);
            const oldWord = document.querySelector(`[data-type="word"][data-index="${oldWordIndex}"]`);
            if (oldWord) {
                oldWord.classList.remove('temp-matched');
                // Remove any pairing attempt classes
                for (let i = 0; i < 5; i++) {
                    oldWord.classList.remove(`pairing-attempt-${i}`);
                }
                delete oldWord.dataset.matchedTo;
            }
            this.selectedDefinition.classList.remove('temp-matched');
            // Remove any pairing attempt classes
            for (let i = 0; i < 5; i++) {
                this.selectedDefinition.classList.remove(`pairing-attempt-${i}`);
            }
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

        // Calculate matches based on original correct pairs
        for (let i = 0; i < 5; i++) {
            const wordItem = document.querySelector(`[data-type="word"][data-index="${i}"]`);
            if (wordItem && wordItem.dataset.matchedTo !== undefined) {
                const matchedDefIndex = parseInt(wordItem.dataset.matchedTo);
                const correctDefinition = this.reviewPairs[i].definition;
                const matchedDefText = document.querySelector(`[data-type="definition"][data-index="${matchedDefIndex}"]`).textContent.trim();

                // Find what the correct definition index should be
                const correctDefIndex = this.reviewPairs.findIndex(pair => pair.definition === correctDefinition);

                if (correctDefinition === matchedDefText) {
                    // User matched the correct pair - mark with success color
                    wordItem.classList.add('correct');
                    const matchedDef = document.querySelector(`[data-type="definition"][data-index="${matchedDefIndex}"]`);
                    if (matchedDef) {
                        matchedDef.classList.add('correct');
                        wordItem.classList.add('matched'); // Final match
                        matchedDef.classList.add('matched'); // Final match

                        // Add checkmark indicator to the word
                        const indicator = document.createElement('span');
                        indicator.className = 'match-indicator correct-indicator';
                        indicator.textContent = '✓';
                        wordItem.appendChild(indicator);

                        // Also add checkmark to the definition
                        const defIndicator = document.createElement('span');
                        defIndicator.className = 'match-indicator correct-indicator';
                        defIndicator.textContent = '✓';
                        matchedDef.appendChild(defIndicator);
                    }
                } else {
                    // User matched incorrectly - mark with error color
                    wordItem.classList.add('incorrect');
                    const matchedDef = document.querySelector(`[data-type="definition"][data-index="${matchedDefIndex}"]`);
                    if (matchedDef) {
                        matchedDef.classList.add('incorrect');
                        wordItem.classList.add('matched'); // Final match
                        matchedDef.classList.add('matched'); // Final match

                        // Add X indicator to the word
                        const indicator = document.createElement('span');
                        indicator.className = 'match-indicator incorrect-indicator';
                        indicator.textContent = '✗';
                        wordItem.appendChild(indicator);

                        // Also add X to the definition
                        const defIndicator = document.createElement('span');
                        defIndicator.className = 'match-indicator incorrect-indicator';
                        defIndicator.textContent = '✗';
                        matchedDef.appendChild(defIndicator);
                    }
                }
            }
        }

        // Count correct matches for feedback
        let correctCount = 0;
        for (let i = 0; i < 5; i++) {
            const wordItem = document.querySelector(`[data-type="word"][data-index="${i}"]`);
            if (wordItem && wordItem.dataset.matchedTo !== undefined) {
                const matchedDefIndex = parseInt(wordItem.dataset.matchedTo);
                const correctDefinition = this.reviewPairs[i].definition;
                const matchedDefText = document.querySelector(`[data-type="definition"][data-index="${matchedDefIndex}"]`).textContent.trim();

                if (correctDefinition === matchedDefText) {
                    correctCount++;
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
        this.pairingAttemptCount = 0; // Reset the pairing attempt counter

        // Reset UI
        document.querySelectorAll('.match-item').forEach(item => {
            item.classList.remove('selected', 'matched', 'correct', 'incorrect', 'temp-matched');
            // Remove all pairing attempt classes
            for (let i = 0; i < 5; i++) {
                item.classList.remove(`pairing-attempt-${i}`);
            }
            // Remove any match indicators
            const indicators = item.querySelectorAll('.match-indicator');
            indicators.forEach(indicator => indicator.remove());
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