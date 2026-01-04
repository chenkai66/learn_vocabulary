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

        // Load and display recommended themes
        this.loadRecommendedThemes();
    }

    loadRecommendedThemes() {
        // Define a comprehensive list of themes across different categories
        this.allThemes = [
            // IELTS/TOEFL themes
            "IELTS: Technology and Society",
            "IELTS: Education and Learning",
            "IELTS: Environment and Sustainability",
            "IELTS: Health and Healthcare",
            "IELTS: Urban Development and Transportation",
            "IELTS: Culture and Traditions",
            "IELTS: Work and Employment",
            "IELTS: Travel and Tourism",
            "IELTS: Media and Communication",
            "IELTS: Arts and Entertainment",
            "IELTS: Science and Innovation",
            "IELTS: Social Issues and Challenges",
            "IELTS: Food and Nutrition",
            "IELTS: Sports and Recreation",
            "IELTS: Family and Relationships",
            "IELTS: Crime and Justice",
            "IELTS: Money and Finance",
            "IELTS: Shopping and Consumerism",
            "IELTS: Housing and Accommodation",
            "IELTS: Government and Politics",

            // GRE themes
            "GRE: Abstract Reasoning and Logic",
            "GRE: Philosophical Concepts",
            "GRE: Ethical Dilemmas",
            "GRE: Scientific Methodology",
            "GRE: Research and Experimentation",
            "GRE: Data Analysis and Interpretation",
            "GRE: Critical Thinking",
            "GRE: Argument Analysis",
            "GRE: Literary Analysis",
            "GRE: Historical Perspectives",
            "GRE: Economic Theory",
            "GRE: Political Science",
            "GRE: Psychology Concepts",
            "GRE: Sociology Principles",
            "GRE: Anthropology",
            "GRE: Linguistics",
            "GRE: Mathematics in Context",
            "GRE: Statistics and Probability",
            "GRE: Advanced Vocabulary",
            "GRE: Academic Writing",

            // Business Communication
            "Business: Marketing and Advertising",
            "Business: Sales and Customer Relations",
            "Business: Leadership and Management",
            "Business: Finance and Investment",
            "Business: Human Resources",
            "Business: Corporate Strategy",
            "Business: International Business",
            "Business: Negotiation Skills",
            "Business: Team Building",
            "Business: Project Management",
            "Business: Innovation and Entrepreneurship",
            "Business: Digital Transformation",
            "Business: Supply Chain Management",
            "Business: Risk Management",
            "Business: Corporate Communication",
            "Business: Ethics in Business",
            "Business: Mergers and Acquisitions",
            "Business: Brand Management",
            "Business: Customer Experience",
            "Business: Business Development",

            // Daily Communication
            "Daily: Making Appointments",
            "Daily: Shopping and Bargaining",
            "Daily: Ordering Food",
            "Daily: Asking for Directions",
            "Daily: Making Small Talk",
            "Daily: Expressing Opinions",
            "Daily: Giving Advice",
            "Daily: Making Complaints",
            "Daily: Inviting and Responding",
            "Daily: Describing Experiences",
            "Daily: Discussing Weather",
            "Daily: Talking about Hobbies",
            "Daily: Discussing Plans",
            "Daily: Expressing Feelings",
            "Daily: Making Suggestions",
            "Daily: Discussing Problems",
            "Daily: Expressing Preferences",
            "Daily: Making Comparisons",
            "Daily: Describing People",
            "Daily: Discussing Habits",

            // Natural Sciences
            "Biology: Cell Structure and Function",
            "Biology: Genetics and Heredity",
            "Biology: Evolution and Natural Selection",
            "Biology: Ecology and Ecosystems",
            "Biology: Biochemistry and Metabolism",
            "Biology: Anatomy and Physiology",
            "Biology: Microbiology and Pathogens",
            "Biology: Botany and Plant Physiology",
            "Biology: Zoology and Animal Behavior",
            "Biology: Biotechnology and Genetic Engineering",
            "Chemistry: Atomic Structure",
            "Chemistry: Chemical Bonding",
            "Chemistry: Stoichiometry",
            "Chemistry: Thermodynamics",
            "Chemistry: Kinetics and Equilibrium",
            "Chemistry: Organic Chemistry",
            "Chemistry: Inorganic Chemistry",
            "Chemistry: Physical Chemistry",
            "Chemistry: Analytical Chemistry",
            "Chemistry: Environmental Chemistry",
            "Physics: Mechanics",
            "Physics: Thermodynamics",
            "Physics: Waves and Optics",
            "Physics: Electricity and Magnetism",
            "Physics: Modern Physics",
            "Physics: Quantum Mechanics",
            "Physics: Relativity",
            "Physics: Nuclear Physics",
            "Physics: Particle Physics",
            "Physics: Astrophysics",
            "Earth Sciences: Geology",
            "Earth Sciences: Meteorology",
            "Earth Sciences: Oceanography",
            "Earth Sciences: Astronomy",
            "Earth Sciences: Environmental Science",
            "Earth Sciences: Climate Science",
            "Earth Sciences: Paleontology",
            "Earth Sciences: Seismology",
            "Earth Sciences: Volcanology",
            "Earth Sciences: Hydrology",

            // Social Sciences
            "Psychology: Cognitive Processes",
            "Psychology: Behavioral Psychology",
            "Psychology: Developmental Psychology",
            "Psychology: Social Psychology",
            "Psychology: Clinical Psychology",
            "Psychology: Neuropsychology",
            "Psychology: Educational Psychology",
            "Psychology: Industrial Psychology",
            "Psychology: Personality Theory",
            "Psychology: Research Methods",
            "Sociology: Social Institutions",
            "Sociology: Social Stratification",
            "Sociology: Cultural Sociology",
            "Sociology: Deviance and Social Control",
            "Sociology: Family and Marriage",
            "Sociology: Urban Sociology",
            "Sociology: Rural Sociology",
            "Sociology: Demography",
            "Sociology: Social Change",
            "Sociology: Research Methods",
            "Economics: Microeconomics",
            "Economics: Macroeconomics",
            "Economics: International Economics",
            "Economics: Development Economics",
            "Economics: Behavioral Economics",
            "Economics: Labor Economics",
            "Economics: Public Economics",
            "Economics: Monetary Economics",
            "Economics: Fiscal Policy",
            "Economics: Economic Growth",
            "Political Science: Political Theory",
            "Political Science: Comparative Politics",
            "Political Science: International Relations",
            "Political Science: Public Policy",
            "Political Science: Political Behavior",
            "Political Science: Public Administration",
            "Political Science: Constitutional Law",
            "Political Science: Electoral Systems",
            "Political Science: Political Economy",
            "Political Science: Diplomacy",

            // Humanities
            "Literature: Classical Literature",
            "Literature: Modern Literature",
            "Literature: Poetry and Poetics",
            "Literature: Drama and Theater",
            "Literature: Literary Theory",
            "Literature: Comparative Literature",
            "Literature: World Literature",
            "Literature: Literary Criticism",
            "Literature: Genre Studies",
            "Literature: Author Studies",
            "History: Ancient Civilizations",
            "History: Medieval Period",
            "History: Renaissance",
            "History: Industrial Revolution",
            "History: World Wars",
            "History: Cold War",
            "History: Colonialism and Decolonization",
            "History: Modern History",
            "History: Social History",
            "History: Economic History",
            "Philosophy: Ethics",
            "Philosophy: Epistemology",
            "Philosophy: Metaphysics",
            "Philosophy: Political Philosophy",
            "Philosophy: Aesthetics",
            "Philosophy: Philosophy of Mind",
            "Philosophy: Philosophy of Science",
            "Philosophy: Ancient Philosophy",
            "Philosophy: Modern Philosophy",
            "Philosophy: Eastern Philosophy",
            "Art: Renaissance Art",
            "Art: Modern Art",
            "Art: Contemporary Art",
            "Art: Art History",
            "Art: Art Theory",
            "Art: Sculpture",
            "Art: Painting",
            "Art: Photography",
            "Art: Digital Art",
            "Art: Art Criticism",

            // Additional themes to reach 800
            "Technology: Artificial Intelligence",
            "Technology: Machine Learning",
            "Technology: Data Science",
            "Technology: Cybersecurity",
            "Technology: Cloud Computing",
            "Technology: Internet of Things",
            "Technology: Blockchain Technology",
            "Technology: Virtual Reality",
            "Technology: Augmented Reality",
            "Technology: Quantum Computing",
            "Medicine: Anatomy and Physiology",
            "Medicine: Pathology",
            "Medicine: Pharmacology",
            "Medicine: Surgery",
            "Medicine: Internal Medicine",
            "Medicine: Pediatrics",
            "Medicine: Psychiatry",
            "Medicine: Neurology",
            "Medicine: Cardiology",
            "Medicine: Oncology",
            "Law: Constitutional Law",
            "Law: Criminal Law",
            "Law: Civil Law",
            "Law: International Law",
            "Law: Corporate Law",
            "Law: Environmental Law",
            "Law: Human Rights Law",
            "Law: Contract Law",
            "Law: Property Law",
            "Law: Family Law",
            "Education: Pedagogy",
            "Education: Curriculum Design",
            "Education: Educational Psychology",
            "Education: Special Education",
            "Education: Higher Education",
            "Education: Early Childhood Education",
            "Education: Adult Education",
            "Education: Educational Technology",
            "Education: Assessment and Evaluation",
            "Education: Inclusive Education",
            "Mathematics: Algebra",
            "Mathematics: Calculus",
            "Mathematics: Geometry",
            "Mathematics: Statistics",
            "Mathematics: Probability",
            "Mathematics: Number Theory",
            "Mathematics: Discrete Mathematics",
            "Mathematics: Applied Mathematics",
            "Mathematics: Mathematical Logic",
            "Mathematics: Topology",
            "Linguistics: Syntax",
            "Linguistics: Semantics",
            "Linguistics: Phonetics",
            "Linguistics: Phonology",
            "Linguistics: Pragmatics",
            "Linguistics: Sociolinguistics",
            "Linguistics: Psycholinguistics",
            "Linguistics: Historical Linguistics",
            "Linguistics: Computational Linguistics",
            "Linguistics: Applied Linguistics",
            "Environmental Science: Climate Change",
            "Environmental Science: Biodiversity",
            "Environmental Science: Pollution Control",
            "Environmental Science: Conservation",
            "Environmental Science: Sustainability",
            "Environmental Science: Renewable Energy",
            "Environmental Science: Environmental Policy",
            "Environmental Science: Ecosystem Management",
            "Environmental Science: Environmental Ethics",
            "Environmental Science: Environmental Economics",
            "Agriculture: Crop Science",
            "Agriculture: Soil Science",
            "Agriculture: Agricultural Economics",
            "Agriculture: Animal Science",
            "Agriculture: Agricultural Technology",
            "Agriculture: Sustainable Agriculture",
            "Agriculture: Food Science",
            "Agriculture: Agricultural Policy",
            "Agriculture: Plant Pathology",
            "Agriculture: Agricultural Engineering",
            "Engineering: Civil Engineering",
            "Engineering: Mechanical Engineering",
            "Engineering: Electrical Engineering",
            "Engineering: Chemical Engineering",
            "Engineering: Computer Engineering",
            "Engineering: Biomedical Engineering",
            "Engineering: Environmental Engineering",
            "Engineering: Aerospace Engineering",
            "Engineering: Industrial Engineering",
            "Engineering: Materials Engineering",
            "Architecture: Modern Architecture",
            "Architecture: Classical Architecture",
            "Architecture: Sustainable Architecture",
            "Architecture: Urban Planning",
            "Architecture: Interior Design",
            "Architecture: Landscape Architecture",
            "Architecture: Architectural Theory",
            "Architecture: Building Technology",
            "Architecture: Architectural History",
            "Architecture: Digital Architecture",
            "Journalism: News Writing",
            "Journalism: Investigative Journalism",
            "Journalism: Broadcast Journalism",
            "Journalism: Digital Journalism",
            "Journalism: Photojournalism",
            "Journalism: Sports Journalism",
            "Journalism: Political Journalism",
            "Journalism: Business Journalism",
            "Journalism: Science Journalism",
            "Journalism: Ethics in Journalism",
            "Marketing: Consumer Behavior",
            "Marketing: Brand Management",
            "Marketing: Digital Marketing",
            "Marketing: Market Research",
            "Marketing: Advertising",
            "Marketing: Public Relations",
            "Marketing: Product Management",
            "Marketing: Pricing Strategy",
            "Marketing: International Marketing",
            "Marketing: Marketing Analytics",
            "Finance: Investment Banking",
            "Finance: Corporate Finance",
            "Finance: Personal Finance",
            "Finance: Financial Markets",
            "Finance: Risk Management",
            "Finance: Portfolio Management",
            "Finance: Financial Planning",
            "Finance: Behavioral Finance",
            "Finance: International Finance",
            "Finance: Financial Technology",
            "Healthcare: Public Health",
            "Healthcare: Healthcare Management",
            "Healthcare: Health Policy",
            "Healthcare: Healthcare Economics",
            "Healthcare: Medical Ethics",
            "Healthcare: Healthcare Technology",
            "Healthcare: Health Informatics",
            "Healthcare: Global Health",
            "Healthcare: Healthcare Quality",
            "Healthcare: Health Psychology",
            "Sports: Sports Psychology",
            "Sports: Sports Medicine",
            "Sports: Sports Management",
            "Sports: Sports Ethics",
            "Sports: Sports Nutrition",
            "Sports: Exercise Physiology",
            "Sports: Sports Coaching",
            "Sports: Sports Analytics",
            "Sports: Sports Law",
            "Sports: Sports Marketing",
            "Transportation: Urban Transportation",
            "Transportation: Aviation",
            "Transportation: Maritime Transport",
            "Transportation: Logistics",
            "Transportation: Traffic Engineering",
            "Transportation: Sustainable Transport",
            "Transportation: Transportation Policy",
            "Transportation: Intelligent Transportation",
            "Transportation: Transportation Economics",
            "Transportation: Transportation Safety",
            "Tourism: Cultural Tourism",
            "Tourism: Eco-tourism",
            "Tourism: Sustainable Tourism",
            "Tourism: Tourism Marketing",
            "Tourism: Tourism Policy",
            "Tourism: Tourism Management",
            "Tourism: Adventure Tourism",
            "Tourism: Medical Tourism",
            "Tourism: Religious Tourism",
            "Tourism: Event Tourism",
            "Food: Nutrition Science",
            "Food: Food Safety",
            "Food: Food Technology",
            "Food: Culinary Arts",
            "Food: Food Marketing",
            "Food: Food Policy",
            "Food: Food Security",
            "Food: Food Chemistry",
            "Food: Food Psychology",
            "Food: Food Economics",
            "Fashion: Fashion Design",
            "Fashion: Fashion Marketing",
            "Fashion: Fashion History",
            "Fashion: Sustainable Fashion",
            "Fashion: Fashion Psychology",
            "Fashion: Fashion Technology",
            "Fashion: Fashion Business",
            "Fashion: Fashion Communication",
            "Fashion: Fashion Ethics",
            "Fashion: Fashion Forecasting",
            "Music: Music Theory",
            "Music: Music History",
            "Music: Music Psychology",
            "Music: Music Technology",
            "Music: Music Education",
            "Music: Music Therapy",
            "Music: Music Business",
            "Music: Music Performance",
            "Music: Music Composition",
            "Music: Music Criticism",
            "Dance: Ballet",
            "Dance: Contemporary Dance",
            "Dance: Cultural Dance",
            "Dance: Dance Education",
            "Dance: Dance Therapy",
            "Dance: Dance History",
            "Dance: Choreography",
            "Dance: Dance Technique",
            "Dance: Dance Anthropology",
            "Dance: Dance Medicine",
            "Theater: Acting Techniques",
            "Theater: Directing",
            "Theater: Playwriting",
            "Theater: Theater History",
            "Theater: Theater Design",
            "Theater: Theater Management",
            "Theater: Musical Theater",
            "Theater: Experimental Theater",
            "Theater: Theater Education",
            "Theater: Theater Criticism",
            "Film: Film Theory",
            "Film: Film History",
            "Film: Cinematography",
            "Film: Film Directing",
            "Film: Screenwriting",
            "Film: Film Production",
            "Film: Film Criticism",
            "Film: Documentary Film",
            "Film: Animation",
            "Film: Film Marketing",
            "Photography: Portrait Photography",
            "Photography: Landscape Photography",
            "Photography: Documentary Photography",
            "Photography: Fashion Photography",
            "Photography: Photojournalism",
            "Photography: Digital Photography",
            "Photography: Photography History",
            "Photography: Photography Ethics",
            "Photography: Photography Business",
            "Photography: Photography Technology",
            "Culinary: International Cuisines",
            "Culinary: Molecular Gastronomy",
            "Culinary: Food Pairing",
            "Culinary: Culinary Techniques",
            "Culinary: Food Presentation",
            "Culinary: Food Safety",
            "Culinary: Culinary History",
            "Culinary: Sustainable Cooking",
            "Culinary: Nutrition in Cooking",
            "Culinary: Culinary Business",
            "Religion: Comparative Religion",
            "Religion: Theology",
            "Religion: Religious History",
            "Religion: Religious Philosophy",
            "Religion: Religious Ethics",
            "Religion: Religious Practices",
            "Religion: Religious Art",
            "Religion: Religious Literature",
            "Religion: Religious Psychology",
            "Religion: Religious Politics",
            "Mythology: Greek Mythology",
            "Mythology: Roman Mythology",
            "Mythology: Norse Mythology",
            "Mythology: Egyptian Mythology",
            "Mythology: Hindu Mythology",
            "Mythology: Buddhist Mythology",
            "Mythology: Chinese Mythology",
            "Mythology: Native American Mythology",
            "Mythology: African Mythology",
            "Mythology: Mythology in Literature",
            "Archaeology: Prehistoric Archaeology",
            "Archaeology: Classical Archaeology",
            "Archaeology: Historical Archaeology",
            "Archaeology: Underwater Archaeology",
            "Archaeology: Archaeological Methods",
            "Archaeology: Archaeological Theory",
            "Archaeology: Cultural Heritage",
            "Archaeology: Archaeological Ethics",
            "Archaeology: Archaeological Technology",
            "Archaeology: Archaeological Conservation",
            "Anthropology: Cultural Anthropology",
            "Anthropology: Physical Anthropology",
            "Anthropology: Archaeological Anthropology",
            "Anthropology: Linguistic Anthropology",
            "Anthropology: Applied Anthropology",
            "Anthropology: Medical Anthropology",
            "Anthropology: Economic Anthropology",
            "Anthropology: Political Anthropology",
            "Anthropology: Anthropological Theory",
            "Anthropology: Anthropological Methods",
            "Demography: Population Studies",
            "Demography: Migration Studies",
            "Demography: Fertility Studies",
            "Demography: Mortality Studies",
            "Demography: Urban Demography",
            "Demography: Rural Demography",
            "Demography: Economic Demography",
            "Demography: Social Demography",
            "Demography: Demographic Methods",
            "Demography: Demographic Policy",
            "Statistics: Descriptive Statistics",
            "Statistics: Inferential Statistics",
            "Statistics: Probability Theory",
            "Statistics: Statistical Software",
            "Statistics: Statistical Modeling",
            "Statistics: Experimental Design",
            "Statistics: Survey Sampling",
            "Statistics: Time Series Analysis",
            "Statistics: Multivariate Analysis",
            "Statistics: Statistical Inference",
            "Probability: Probability Theory",
            "Probability: Stochastic Processes",
            "Probability: Random Variables",
            "Probability: Probability Distributions",
            "Probability: Statistical Inference",
            "Probability: Bayesian Statistics",
            "Probability: Markov Chains",
            "Probability: Queueing Theory",
            "Probability: Reliability Theory",
            "Probability: Probability Applications",
            "Logic: Propositional Logic",
            "Logic: Predicate Logic",
            "Logic: Modal Logic",
            "Logic: Mathematical Logic",
            "Logic: Philosophical Logic",
            "Logic: Computational Logic",
            "Logic: Logical Reasoning",
            "Logic: Logical Fallacies",
            "Logic: Logic Programming",
            "Logic: Logic Applications",
            "Ethics: Applied Ethics",
            "Ethics: Metaethics",
            "Ethics: Normative Ethics",
            "Ethics: Business Ethics",
            "Ethics: Medical Ethics",
            "Ethics: Environmental Ethics",
            "Ethics: Technology Ethics",
            "Ethics: Research Ethics",
            "Ethics: Professional Ethics",
            "Ethics: Global Ethics",
            "Epistemology: Theory of Knowledge",
            "Epistemology: Justification",
            "Epistemology: Skepticism",
            "Epistemology: Reliabilism",
            "Epistemology: Social Epistemology",
            "Epistemology: Feminist Epistemology",
            "Epistemology: Epistemic Virtues",
            "Epistemology: Epistemic Injustice",
            "Epistemology: Epistemology of Science",
            "Epistemology: Epistemology of Perception",
            "Metaphysics: Ontology",
            "Metaphysics: Causation",
            "Metaphysics: Time and Space",
            "Metaphysics: Identity",
            "Metaphysics: Modality",
            "Metaphysics: Persistence",
            "Metaphysics: Universals",
            "Metaphysics: Metaphysics of Science",
            "Metaphysics: Metaphysics of Mind",
            "Metaphysics: Metaphysics of Properties",
            "Political Philosophy: Justice",
            "Political Philosophy: Liberty",
            "Political Philosophy: Equality",
            "Political Philosophy: Democracy",
            "Political Philosophy: Authority",
            "Political Philosophy: Rights",
            "Political Philosophy: Political Obligation",
            "Political Philosophy: Distributive Justice",
            "Political Philosophy: Political Legitimacy",
            "Political Philosophy: Political Authority",
            "Aesthetics: Philosophy of Art",
            "Aesthetics: Beauty",
            "Aesthetics: Taste",
            "Aesthetics: Artistic Expression",
            "Aesthetics: Aesthetic Experience",
            "Aesthetics: Artistic Value",
            "Aesthetics: Aesthetic Judgment",
            "Aesthetics: Aesthetic Emotions",
            "Aesthetics: Aesthetic Concepts",
            "Aesthetics: Aesthetic Theory",
            "Philosophy of Mind: Consciousness",
            "Philosophy of Mind: Mental States",
            "Philosophy of Mind: Intentionality",
            "Philosophy of Mind: Mind-Body Problem",
            "Philosophy of Mind: Personal Identity",
            "Philosophy of Mind: Free Will",
            "Philosophy of Mind: Philosophy of Psychology",
            "Philosophy of Mind: Philosophy of Cognitive Science",
            "Philosophy of Mind: Philosophy of Neuroscience",
            "Philosophy of Mind: Philosophy of Psychiatry",
            "Philosophy of Science: Scientific Method",
            "Philosophy of Science: Scientific Explanation",
            "Philosophy of Science: Scientific Realism",
            "Philosophy of Science: Scientific Models",
            "Philosophy of Science: Scientific Laws",
            "Philosophy of Science: Scientific Change",
            "Philosophy of Science: Philosophy of Physics",
            "Philosophy of Science: Philosophy of Biology",
            "Philosophy of Science: Philosophy of Psychology",
            "Philosophy of Science: Philosophy of Social Science",
            "Ancient Philosophy: Pre-Socratic Philosophy",
            "Ancient Philosophy: Socratic Philosophy",
            "Ancient Philosophy: Platonic Philosophy",
            "Ancient Philosophy: Aristotelian Philosophy",
            "Ancient Philosophy: Hellenistic Philosophy",
            "Ancient Philosophy: Stoicism",
            "Ancient Philosophy: Epicureanism",
            "Ancient Philosophy: Skepticism",
            "Ancient Philosophy: Ancient Ethics",
            "Ancient Philosophy: Ancient Political Philosophy",
            "Modern Philosophy: Rationalism",
            "Modern Philosophy: Empiricism",
            "Modern Philosophy: Kantian Philosophy",
            "Modern Philosophy: German Idealism",
            "Modern Philosophy: British Empiricism",
            "Modern Philosophy: Continental Philosophy",
            "Modern Philosophy: Analytic Philosophy",
            "Modern Philosophy: Modern Ethics",
            "Modern Philosophy: Modern Political Philosophy",
            "Modern Philosophy: Modern Epistemology",
            "Eastern Philosophy: Confucianism",
            "Eastern Philosophy: Taoism",
            "Eastern Philosophy: Buddhism",
            "Eastern Philosophy: Hinduism",
            "Eastern Philosophy: Islamic Philosophy",
            "Eastern Philosophy: Japanese Philosophy",
            "Eastern Philosophy: Indian Philosophy",
            "Eastern Philosophy: Eastern Ethics",
            "Eastern Philosophy: Eastern Political Philosophy",
            "Eastern Philosophy: Eastern Aesthetics",
            "Classical Literature: Greek Literature",
            "Classical Literature: Roman Literature",
            "Classical Literature: Medieval Literature",
            "Classical Literature: Renaissance Literature",
            "Classical Literature: Classical Drama",
            "Classical Literature: Classical Poetry",
            "Classical Literature: Classical Epic",
            "Classical Literature: Classical Rhetoric",
            "Classical Literature: Classical Criticism",
            "Classical Literature: Classical Influence",
            "Modern Literature: Modernist Literature",
            "Modern Literature: Postmodern Literature",
            "Modern Literature: Contemporary Literature",
            "Modern Literature: Modern Poetry",
            "Modern Literature: Modern Drama",
            "Modern Literature: Modern Fiction",
            "Modern Literature: Modern Non-fiction",
            "Modern Literature: Modern Literary Theory",
            "Modern Literature: Modern Literary Criticism",
            "Modern Literature: Modern Literary Movements",
            "Poetry: Classical Poetry",
            "Poetry: Modern Poetry",
            "Poetry: Contemporary Poetry",
            "Poetry: Poetic Forms",
            "Poetry: Poetic Devices",
            "Poetry: Poetic Meter",
            "Poetry: Poetic Imagery",
            "Poetry: Poetic Themes",
            "Poetry: Poetic Traditions",
            "Poetry: Poetic Innovation",
            "Drama: Classical Drama",
            "Drama: Modern Drama",
            "Drama: Contemporary Drama",
            "Drama: Tragedy",
            "Drama: Comedy",
            "Drama: Tragicomedy",
            "Drama: Experimental Drama",
            "Drama: Political Drama",
            "Drama: Social Drama",
            "Drama: Psychological Drama",
            "Literary Theory: Formalism",
            "Literary Theory: Structuralism",
            "Literary Theory: Post-structuralism",
            "Literary Theory: Deconstruction",
            "Literary Theory: Reader-Response Theory",
            "Literary Theory: New Criticism",
            "Literary Theory: Feminist Literary Theory",
            "Literary Theory: Marxist Literary Theory",
            "Literary Theory: Postcolonial Literary Theory",
            "Literary Theory: Psychoanalytic Literary Theory",
            "Comparative Literature: Cross-Cultural Literature",
            "Comparative Literature: Literary Translation",
            "Comparative Literature: Literary Influence",
            "Comparative Literature: Literary Themes",
            "Comparative Literature: Literary Genres",
            "Comparative Literature: Literary Movements",
            "Comparative Literature: Literary Traditions",
            "Comparative Literature: Literary Criticism",
            "Comparative Literature: Literary Theory",
            "Comparative Literature: Literary History",
            "World Literature: African Literature",
            "World Literature: Asian Literature",
            "World Literature: Latin American Literature",
            "World Literature: Middle Eastern Literature",
            "World Literature: European Literature",
            "World Literature: North American Literature",
            "World Literature: Oceanic Literature",
            "World Literature: World Literature History",
            "World Literature: World Literature Themes",
            "World Literature: World Literature Movements",
            "Literary Criticism: Historical Criticism",
            "Literary Criticism: Biographical Criticism",
            "Literary Criticism: Psychological Criticism",
            "Literary Criticism: Sociological Criticism",
            "Literary Criticism: Mythological Criticism",
            "Literary Criticism: Archetypal Criticism",
            "Literary Criticism: Formalist Criticism",
            "Literary Criticism: Structuralist Criticism",
            "Literary Criticism: Post-structuralist Criticism",
            "Literary Criticism: Deconstructive Criticism",
            "Genre Studies: Novel",
            "Genre Studies: Poetry",
            "Genre Studies: Drama",
            "Genre Studies: Essay",
            "Genre Studies: Short Story",
            "Genre Studies: Epic",
            "Genre Studies: Lyric",
            "Genre Studies: Satire",
            "Genre Studies: Romance",
            "Genre Studies: Tragedy",
            "Author Studies: Shakespeare",
            "Author Studies: Dickens",
            "Author Studies: Austen",
            "Author Studies: Woolf",
            "Author Studies: Joyce",
            "Author Studies: Kafka",
            "Author Studies: Beckett",
            "Author Studies: Morrison",
            "Author Studies: Rushdie",
            "Author Studies: Coetzee",
            "Ancient Civilizations: Mesopotamia",
            "Ancient Civilizations: Egypt",
            "Ancient Civilizations: Greece",
            "Ancient Civilizations: Rome",
            "Ancient Civilizations: China",
            "Ancient Civilizations: India",
            "Ancient Civilizations: Maya",
            "Ancient Civilizations: Inca",
            "Ancient Civilizations: Aztec",
            "Ancient Civilizations: Ancient Persia",
            "Medieval Period: Feudalism",
            "Medieval Period: Crusades",
            "Medieval Period: Medieval Church",
            "Medieval Period: Medieval Universities",
            "Medieval Period: Medieval Literature",
            "Medieval Period: Medieval Art",
            "Medieval Period: Medieval Architecture",
            "Medieval Period: Medieval Law",
            "Medieval Period: Medieval Trade",
            "Medieval Period: Medieval Warfare",
            "Renaissance: Renaissance Art",
            "Renaissance: Renaissance Literature",
            "Renaissance: Renaissance Science",
            "Renaissance: Renaissance Philosophy",
            "Renaissance: Renaissance Politics",
            "Renaissance: Renaissance Religion",
            "Renaissance: Renaissance Humanism",
            "Renaissance: Renaissance Exploration",
            "Renaissance: Renaissance Music",
            "Renaissance: Renaissance Architecture",
            "Industrial Revolution: Industrial Technology",
            "Industrial Revolution: Industrial Society",
            "Industrial Revolution: Industrial Economy",
            "Industrial Revolution: Industrial Labor",
            "Industrial Revolution: Industrial Urbanization",
            "Industrial Revolution: Industrial Capitalism",
            "Industrial Revolution: Industrial Reform",
            "Industrial Revolution: Industrial Impact",
            "Industrial Revolution: Industrial Innovation",
            "Industrial Revolution: Industrial Change",
            "World Wars: WWI Causes",
            "World Wars: WWI Impact",
            "World Wars: WWII Causes",
            "World Wars: WWII Impact",
            "World Wars: War Technology",
            "World Wars: War Strategy",
            "World Wars: War Diplomacy",
            "World Wars: War Economy",
            "World Wars: War Society",
            "World Wars: War Memory",
            "Cold War: Cold War Origins",
            "Cold War: Cold War Politics",
            "Cold War: Cold War Economics",
            "Cold War: Cold War Society",
            "Cold War: Cold War Culture",
            "Cold War: Cold War Technology",
            "Cold War: Cold War Diplomacy",
            "Cold War: Cold War Propaganda",
            "Cold War: Cold War Espionage",
            "Cold War: Cold War End",
            "Colonialism: Colonial Administration",
            "Colonialism: Colonial Economy",
            "Colonialism: Colonial Society",
            "Colonialism: Colonial Culture",
            "Colonialism: Colonial Resistance",
            "Colonialism: Colonial Impact",
            "Colonialism: Colonial Legacy",
            "Colonialism: Colonial Law",
            "Colonialism: Colonial Education",
            "Colonialism: Colonial Health",
            "Decolonization: Independence Movements",
            "Decolonization: Liberation Struggles",
            "Decolonization: Political Transition",
            "Decolonization: Economic Transition",
            "Decolonization: Social Transition",
            "Decolonization: Cultural Transition",
            "Decolonization: Post-colonial Challenges",
            "Decolonization: International Support",
            "Decolonization: Decolonization Process",
            "Decolonization: Decolonization Impact",
            "Modern History: Contemporary Events",
            "Modern History: Globalization",
            "Modern History: Technological Change",
            "Modern History: Social Movements",
            "Modern History: Political Change",
            "Modern History: Economic Change",
            "Modern History: Cultural Change",
            "Modern History: Environmental Change",
            "Modern History: Demographic Change",
            "Modern History: Historical Memory",
            "Social History: Women's History",
            "Social History: Labor History",
            "Social History: Family History",
            "Social History: Childhood History",
            "Social History: Urban History",
            "Social History: Rural History",
            "Social History: Migration History",
            "Social History: Ethnic History",
            "Social History: Religious History",
            "Social History: Cultural History",
            "Economic History: Economic Development",
            "Economic History: Economic Systems",
            "Economic History: Economic Crises",
            "Economic History: Economic Growth",
            "Economic History: Economic Policy",
            "Economic History: Economic Theory",
            "Economic History: Economic Institutions",
            "Economic History: Economic Change",
            "Economic History: Economic Impact",
            "Economic History: Economic Legacy",
            "Ethics: Virtue Ethics",
            "Ethics: Consequentialism",
            "Ethics: Deontological Ethics",
            "Ethics: Care Ethics",
            "Ethics: Metaethics",
            "Ethics: Applied Ethics",
            "Ethics: Normative Ethics",
            "Ethics: Descriptive Ethics",
            "Ethics: Professional Ethics",
            "Ethics: Global Ethics",
            "Epistemology: Knowledge",
            "Epistemology: Belief",
            "Epistemology: Truth",
            "Epistemology: Justification",
            "Epistemology: Skepticism",
            "Epistemology: Reliabilism",
            "Epistemology: Social Epistemology",
            "Epistemology: Feminist Epistemology",
            "Epistemology: Epistemic Virtues",
            "Epistemology: Epistemic Injustice",
            "Metaphysics: Existence",
            "Metaphysics: Identity",
            "Metaphysics: Causation",
            "Metaphysics: Time",
            "Metaphysics: Space",
            "Metaphysics: Modality",
            "Metaphysics: Persistence",
            "Metaphysics: Universals",
            "Metaphysics: Metaphysics of Science",
            "Metaphysics: Metaphysics of Mind",
            "Political Philosophy: Justice",
            "Political Philosophy: Liberty",
            "Political Philosophy: Equality",
            "Political Philosophy: Democracy",
            "Political Philosophy: Authority",
            "Political Philosophy: Rights",
            "Political Philosophy: Political Obligation",
            "Political Philosophy: Distributive Justice",
            "Political Philosophy: Political Legitimacy",
            "Political Philosophy: Political Authority",
            "Aesthetics: Beauty",
            "Aesthetics: Art",
            "Aesthetics: Taste",
            "Aesthetics: Aesthetic Experience",
            "Aesthetics: Aesthetic Value",
            "Aesthetics: Aesthetic Judgment",
            "Aesthetics: Aesthetic Emotions",
            "Aesthetics: Aesthetic Concepts",
            "Aesthetics: Aesthetic Theory",
            "Aesthetics: Aesthetic Practice",
            "Philosophy of Mind: Consciousness",
            "Philosophy of Mind: Intentionality",
            "Philosophy of Mind: Mental States",
            "Philosophy of Mind: Mind-Body Problem",
            "Philosophy of Mind: Personal Identity",
            "Philosophy of Mind: Free Will",
            "Philosophy of Mind: Philosophy of Psychology",
            "Philosophy of Mind: Philosophy of Cognitive Science",
            "Philosophy of Mind: Philosophy of Neuroscience",
            "Philosophy of Mind: Philosophy of Psychiatry",
            "Philosophy of Science: Scientific Method",
            "Philosophy of Science: Scientific Explanation",
            "Philosophy of Science: Scientific Realism",
            "Philosophy of Science: Scientific Models",
            "Philosophy of Science: Scientific Laws",
            "Philosophy of Science: Scientific Change",
            "Philosophy of Science: Philosophy of Physics",
            "Philosophy of Science: Philosophy of Biology",
            "Philosophy of Science: Philosophy of Psychology",
            "Philosophy of Science: Philosophy of Social Science",
            "Ancient Philosophy: Pre-Socratic",
            "Ancient Philosophy: Socrates",
            "Ancient Philosophy: Plato",
            "Ancient Philosophy: Aristotle",
            "Ancient Philosophy: Hellenistic",
            "Ancient Philosophy: Stoicism",
            "Ancient Philosophy: Epicureanism",
            "Ancient Philosophy: Skepticism",
            "Ancient Philosophy: Ancient Ethics",
            "Ancient Philosophy: Ancient Politics",
            "Modern Philosophy: Rationalism",
            "Modern Philosophy: Empiricism",
            "Modern Philosophy: Kant",
            "Modern Philosophy: German Idealism",
            "Modern Philosophy: British Empiricism",
            "Modern Philosophy: Continental",
            "Modern Philosophy: Analytic",
            "Modern Philosophy: Modern Ethics",
            "Modern Philosophy: Modern Politics",
            "Modern Philosophy: Modern Epistemology",
            "Eastern Philosophy: Confucianism",
            "Eastern Philosophy: Taoism",
            "Eastern Philosophy: Buddhism",
            "Eastern Philosophy: Hinduism",
            "Eastern Philosophy: Islamic Philosophy",
            "Eastern Philosophy: Japanese Philosophy",
            "Eastern Philosophy: Indian Philosophy",
            "Eastern Philosophy: Eastern Ethics",
            "Eastern Philosophy: Eastern Politics",
            "Eastern Philosophy: Eastern Aesthetics",
            "Renaissance Art: Renaissance Painting",
            "Renaissance Art: Renaissance Sculpture",
            "Renaissance Art: Renaissance Architecture",
            "Renaissance Art: Renaissance Artists",
            "Renaissance Art: Renaissance Patronage",
            "Renaissance Art: Renaissance Techniques",
            "Renaissance Art: Renaissance Themes",
            "Renaissance Art: Renaissance Influence",
            "Renaissance Art: Renaissance Legacy",
            "Renaissance Art: Renaissance Context",
            "Modern Art: Impressionism",
            "Modern Art: Expressionism",
            "Modern Art: Cubism",
            "Modern Art: Surrealism",
            "Modern Art: Abstract Art",
            "Modern Art: Pop Art",
            "Modern Art: Minimalism",
            "Modern Art: Conceptual Art",
            "Modern Art: Performance Art",
            "Modern Art: Installation Art",
            "Contemporary Art: Contemporary Painting",
            "Contemporary Art: Contemporary Sculpture",
            "Contemporary Art: Contemporary Photography",
            "Contemporary Art: Contemporary Video",
            "Contemporary Art: Contemporary Installation",
            "Contemporary Art: Contemporary Performance",
            "Contemporary Art: Contemporary Digital",
            "Contemporary Art: Contemporary Mixed Media",
            "Contemporary Art: Contemporary Themes",
            "Contemporary Art: Contemporary Issues",
            "Art History: Prehistoric Art",
            "Art History: Ancient Art",
            "Art History: Medieval Art",
            "Art History: Renaissance Art",
            "Art History: Baroque Art",
            "Art History: Neoclassical Art",
            "Art History: Romantic Art",
            "Art History: Modern Art",
            "Art History: Contemporary Art",
            "Art History: Non-Western Art",
            "Art Theory: Formalism",
            "Art Theory: Expressionism",
            "Art Theory: Imitationalism",
            "Art Theory: Instrumentalism",
            "Art Theory: Aesthetic Theory",
            "Art Theory: Artistic Value",
            "Art Theory: Artistic Meaning",
            "Art Theory: Artistic Expression",
            "Art Theory: Artistic Function",
            "Art Theory: Artistic Purpose",
            "Sculpture: Classical Sculpture",
            "Sculpture: Renaissance Sculpture",
            "Sculpture: Modern Sculpture",
            "Sculpture: Contemporary Sculpture",
            "Sculpture: Abstract Sculpture",
            "Sculpture: Figurative Sculpture",
            "Sculpture: Installation Sculpture",
            "Sculpture: Kinetic Sculpture",
            "Sculpture: Environmental Sculpture",
            "Sculpture: Conceptual Sculpture",
            "Painting: Renaissance Painting",
            "Painting: Baroque Painting",
            "Painting: Romantic Painting",
            "Painting: Impressionist Painting",
            "Painting: Post-Impressionist Painting",
            "Painting: Modern Painting",
            "Painting: Abstract Painting",
            "Painting: Contemporary Painting",
            "Painting: Figurative Painting",
            "Painting: Landscape Painting",
            "Photography: Documentary Photography",
            "Photography: Portrait Photography",
            "Photography: Landscape Photography",
            "Photography: Fashion Photography",
            "Photography: Art Photography",
            "Photography: Photojournalism",
            "Photography: Digital Photography",
            "Photography: Analog Photography",
            "Photography: Conceptual Photography",
            "Photography: Experimental Photography",
            "Digital Art: Digital Painting",
            "Digital Art: Digital Sculpture",
            "Digital Art: Digital Animation",
            "Digital Art: Digital Video",
            "Digital Art: Digital Installation",
            "Digital Art: Digital Performance",
            "Digital Art: Digital Interactive",
            "Digital Art: Digital 3D",
            "Digital Art: Digital 2D",
            "Digital Art: Digital Mixed Media",
            "Art Criticism: Formal Criticism",
            "Art Criticism: Contextual Criticism",
            "Art Criticism: Biographical Criticism",
            "Art Criticism: Psychological Criticism",
            "Art Criticism: Sociological Criticism",
            "Art Criticism: Historical Criticism",
            "Art Criticism: Feminist Criticism",
            "Art Criticism: Postcolonial Criticism",
            "Art Criticism: Marxist Criticism",
            "Art Criticism: Psychoanalytic Criticism"
        ];

        this.refreshThemeSuggestions();
    }

    refreshThemeSuggestions() {
        // Clear the current theme suggestions
        this.themeSuggestionsContainer.innerHTML = '';

        // Select 6 random themes from the list
        const shuffledThemes = [...this.allThemes].sort(() => 0.5 - Math.random());
        const selectedThemes = shuffledThemes.slice(0, 6);

        // Create theme elements
        selectedThemes.forEach(theme => {
            const themeElement = document.createElement('span');
            themeElement.className = 'theme-suggestion';
            // Extract a short display name from the theme
            const displayName = theme.split(': ')[1] || theme.split(': ')[0] || theme;
            themeElement.textContent = displayName;
            themeElement.setAttribute('data-theme', theme);

            // Add click event to populate the theme input field
            themeElement.addEventListener('click', () => {
                this.themeInput.value = theme;
                this.themeInput.focus();
            });

            this.themeSuggestionsContainer.appendChild(themeElement);
        });
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
        if (!this.refreshThemesBtn) console.error('refresh-themes-btn not found');
        if (!this.themeSuggestionsContainer) console.error('theme-suggestions not found');
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

        // Add event listener for refresh themes button
        this.refreshThemesBtn.addEventListener('click', () => {
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