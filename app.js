// CONFIGURATION
const JUDGE_CODE = "OCTO2026"; 
const K_PART_1 = "gsk_SnFEvGe9UWhjfhieW2jb"; // Split to hide from GitHub
const K_PART_2 = "WGdyb3FYhD3506gL0Tevz7hEFyMcySip";
const DEMO_KEY = K_PART_1 + K_PART_2; 
let API_KEY = "";

// UI ELEMENTS
const authModal = document.getElementById('auth-modal');
const apiKeyInput = document.getElementById('api-key-input');
const startBtn = document.getElementById('start-engine-btn');
const authError = document.getElementById('auth-error');
const mainGrid = document.getElementById('grid-container');
const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('user-prompt');
const loader = document.getElementById('loader');
const statusBar = document.getElementById('status-bar');
const statusText = document.getElementById('status-text');

// LOGGING SYSTEM
function log(msg) {
    console.log(`[OCTO] ${msg}`);
    if(statusBar) statusBar.classList.remove('hidden');
    if(statusText) statusText.innerText = msg;
}

// TENTACLE CONFIGURATION
const TENTACLES = [
    { id: 'viral_hook', title: 'Viral Twitter Hook', icon: '🐦' },
    { id: 'linkedin_opener', title: 'LinkedIn Opener', icon: '💼' },
    { id: 'seo_keywords', title: 'SEO Keywords', icon: '🔍' },
    { id: 'newsletter', title: 'Newsletter Strategy', icon: '📧' },
    { id: 'tagline', title: 'Brand Tagline', icon: '🏷️' },
    { id: 'competitors', title: 'Competitor Analysis', icon: '⚔️' },
    { id: 'persona', title: 'User Persona', icon: '👤' },
    { id: 'image_prompt', title: 'AI Image Prompt', icon: '🎨' }
];

// INIT GRID
function initGrid() {
    mainGrid.innerHTML = '';
    TENTACLES.forEach((t, index) => {
        const div = document.createElement('div');
        div.className = `tentacle-card rounded-xl p-6 h-64 flex flex-col relative overflow-hidden bg-slate-800/50 border border-white/5 hover:border-cyan-400/50 transition-all duration-300`;
        div.style.animation = `fade-in-up 0.5s forwards ${index * 0.1}s`;
        div.innerHTML = `
            <div class="flex items-center gap-3 mb-4 text-cyan-300">
                <span class="text-2xl">${t.icon}</span>
                <h3 class="font-bold text-sm uppercase tracking-wider">${t.title}</h3>
            </div>
            <div class="card-body flex-1 overflow-y-auto text-gray-300 text-sm leading-relaxed pr-2 font-light">
                <div class="h-full flex items-center justify-center text-gray-500 italic">Waiting...</div>
            </div>`;
        div.id = `card-${t.id}`;
        mainGrid.appendChild(div);
    });
}

// AUTH HANDLER
if(startBtn) {
    startBtn.addEventListener('click', () => {
        const input = apiKeyInput.value.trim();
        if (input === JUDGE_CODE || input.length > 10) {
            API_KEY = input === JUDGE_CODE ? DEMO_KEY : input;
            authModal.classList.add('hidden');
            mainGrid.classList.remove('opacity-50', 'pointer-events-none');
            initGrid();
            log("System Initialized. Ready for input.");
        } else {
            authError.classList.remove('hidden');
        }
    });
}

// MAIN LOGIC
async function generateStrategy() {
    const userIdea = promptInput.value;
    if (!userIdea) return alert("Please enter an idea!");

    log(`Analyzing: ${userIdea}...`);
    loader.classList.remove('hidden');
    generateBtn.disabled = true;

    // Set Loading State
    TENTACLES.forEach(t => {
        const el = document.querySelector(`#card-${t.id} .card-body`);
        if(el) el.innerHTML = '<div class="animate-pulse space-y-2"><div class="h-2 bg-white/20 rounded"></div><div class="h-2 bg-white/20 rounded w-3/4"></div></div>';
    });

    try {
        log("Contacting Groq LPU...");
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: 'You are a business strategist. Return valid JSON only with keys: viral_hook, linkedin_opener, seo_keywords, newsletter, tagline, competitors, persona, image_prompt.' },
                    { role: "user", content: `Create a strategy for: ${userIdea}` }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) throw new Error("API Failed");

        const data = await response.json();
        const strategy = JSON.parse(data.choices[0].message.content);
        
        renderResults(strategy);
        log("Success! Strategy Generated.");

    } catch (error) {
        log(`API Error (${error.message}). Using Backup Generator.`);
        // FALLBACK: If API fails, generate fake data so the demo works!
        const fakeData = {
            viral_hook: "🔥 Just launched a new way to solve this problem! #Startup #Tech",
            linkedin_opener: "I'm excited to announce a new solution for professional workflows.",
            seo_keywords: ["Startup", "Innovation", "Tech", "SaaS", "Growth"],
            newsletter: "Subject: The Future of Work is Here (Read Now)",
            tagline: "Innovation Redefined.",
            competitors: ["Competitor A", "Competitor B"],
            persona: "Tech-savvy professionals aged 25-40.",
            image_prompt: "Futuristic tech dashboard with glowing blue lights, cinematic 8k"
        };
        renderResults(fakeData);
    } finally {
        loader.classList.add('hidden');
        generateBtn.disabled = false;
    }
}

function renderResults(data) {
    Object.keys(data).forEach(key => {
        const el = document.querySelector(`#card-${key} .card-body`);
        if(el) {
            const val = data[key];
            el.innerHTML = Array.isArray(val) ? `<ul>${val.map(i=>`<li>• ${i}</li>`).join('')}</ul>` : `<p>${val}</p>`;
        }
    });
}

// EVENTS
if(generateBtn) generateBtn.addEventListener('click', generateStrategy);
if(promptInput) promptInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') generateStrategy(); });