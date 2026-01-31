// Configuration
const JUDGE_CODE = "OCTO2026"; // Code for Hackathon Judges
// This is a placeholder. In a real backend, we'd hide the real key. 
// For this Hackathon demo, if they use the code, we use a hardcoded (demo) key or rely on user key.
// IMPORTANT: For the demo to work without user keys, you (the dev) need to put YOUR key in the logic below temporarily,
// or strictly require users to bring their own keys. 
// For safety, this code assumes USER provides key OR uses the Judge Code bypass (which you can map to a specific key if you host it).

let API_KEY = "";

// DOM Elements
const authModal = document.getElementById('auth-modal');
const apiKeyInput = document.getElementById('api-key-input');
const startBtn = document.getElementById('start-engine-btn');
const authError = document.getElementById('auth-error');
const mainGrid = document.getElementById('grid-container');
const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('user-prompt');
const loader = document.getElementById('loader');

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

// Initialize UI
function initGrid() {
    mainGrid.innerHTML = '';
    TENTACLES.forEach((t, index) => {
        const div = document.createElement('div');
        div.className = `tentacle-card rounded-xl p-6 h-64 flex flex-col relative overflow-hidden group opacity-0 animate-fade-in-up`;
        div.style.animationDelay = `${index * 100}ms`;
        div.style.animationFillMode = 'forwards';
        
        div.innerHTML = `
            <div class="flex items-center gap-3 mb-4 text-cyan-300">
                <span class="text-2xl">${t.icon}</span>
                <h3 class="font-bold text-sm uppercase tracking-wider">${t.title}</h3>
            </div>
            <div class="card-body flex-1 overflow-y-auto text-gray-300 text-sm leading-relaxed pr-2 font-light">
                <div class="h-full flex items-center justify-center text-gray-600 italic">
                    Waiting for input...
                </div>
            </div>
            <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        `;
        div.id = `card-${t.id}`;
        mainGrid.appendChild(div);
    });
}

// Authentication Logic
startBtn.addEventListener('click', () => {
    const input = apiKeyInput.value.trim();
    if (input.length > 10 || input === JUDGE_CODE) {
        API_KEY = input === JUDGE_CODE ? "YOUR_FALLBACK_DEMO_KEY_HERE" : input; // Replace YOUR_FALLBACK... if you want to pay for judges
        authModal.classList.add('hidden');
        mainGrid.classList.remove('opacity-50', 'pointer-events-none');
        initGrid();
    } else {
        authError.classList.remove('hidden');
    }
});

// The Brain: Gemini API Call
async function generateStrategy() {
    const userIdea = promptInput.value;
    if (!userIdea) return;

    // UI Updates
    loader.classList.remove('hidden');
    generateBtn.disabled = true;
    generateBtn.innerHTML = `Processing...`;
    
    // Clear previous results
    TENTACLES.forEach(t => {
        document.querySelector(`#card-${t.id} .card-body`).innerHTML = '<div class="animate-pulse flex space-x-4"><div class="flex-1 space-y-4 py-1"><div class="h-4 bg-white/10 rounded w-3/4"></div><div class="space-y-2"><div class="h-4 bg-white/10 rounded"></div><div class="h-4 bg-white/10 rounded w-5/6"></div></div></div></div>';
    });

    const prompt = `
        You are Octo-Flow, a strategic AI engine. 
        Analyze this product idea: "${userIdea}".
        
        Generate 8 distinct outputs in STRICT JSON format. Do not use Markdown formatting. Return ONLY raw JSON.
        The JSON keys must be:
        "viral_hook" (A punchy twitter thread starter),
        "linkedin_opener" (Professional hook),
        "seo_keywords" (5 high volume keywords),
        "newsletter" (A subject line and 1-sentence synopsis),
        "tagline" (Catchy slogan),
        "competitors" (2 potential rivals),
        "persona" (Brief profile of ideal user),
        "image_prompt" (A prompt for Midjourney/DALL-E to generate a hero image).
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        
        // Clean markdown if Gemini adds it accidentally
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '');
        const strategy = JSON.parse(cleanJson);

        // Populate Grid
        Object.keys(strategy).forEach(key => {
            const cardBody = document.querySelector(`#card-${key} .card-body`);
            if (cardBody) {
                // Typewriter effect or simple fade in could go here. For speed, we just inject.
                cardBody.innerHTML = formatOutput(key, strategy[key]);
            }
        });

    } catch (error) {
        console.error(error);
        alert("The Octopus is confused. Please check your API key or try again.");
    } finally {
        loader.classList.add('hidden');
        generateBtn.disabled = false;
        generateBtn.innerHTML = `<span>Release the Kraken</span><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
    }
}

// Helper to make the text look nice
function formatOutput(key, text) {
    if (Array.isArray(text)) return `<ul class="list-disc pl-4 space-y-1">${text.map(i => `<li>${i}</li>`).join('')}</ul>`;
    return `<p>${text}</p>`;
}

generateBtn.addEventListener('click', generateStrategy);

// Add Enter key support
promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateStrategy();
});