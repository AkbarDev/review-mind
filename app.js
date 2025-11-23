document.addEventListener('DOMContentLoaded', () => {
    const reviewInput = document.getElementById('review-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultsSection = document.getElementById('results-section');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModal = document.getElementById('close-modal');
    const saveSettingsBtn = document.getElementById('save-settings');
    const apiKeyInput = document.getElementById('api-key');

    // Load API Key from localStorage
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }

    // Settings Modal Logic
    function openModal() {
        settingsModal.classList.remove('hidden');
        settingsModal.style.display = 'flex';
    }

    function closeModalFunc() {
        settingsModal.classList.add('hidden');
        settingsModal.style.display = 'none';
    }

    settingsBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalFunc);

    // Close when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeModalFunc();
        }
    });

    saveSettingsBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            alert('API Key saved securely in your browser!');
            closeModalFunc();
        } else {
            alert('Please enter a valid API Key.');
        }
    });

    // Clear Logic
    clearBtn.addEventListener('click', () => {
        reviewInput.value = '';
        resultsSection.classList.add('hidden');
    });

    // Analyze Logic
    analyzeBtn.addEventListener('click', async () => {
        const text = reviewInput.value.trim();
        if (!text) {
            alert('Please enter some reviews to analyze.');
            return;
        }

        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            alert('Please set your Gemini API Key in settings first.');
            settingsModal.classList.remove('hidden');
            return;
        }

        // Show loading state
        analyzeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
        analyzeBtn.disabled = true;

        try {
            const analysis = await analyzeWithGemini(text, apiKey);
            displayResults(analysis);
        } catch (error) {
            console.error('Analysis failed:', error);
            alert(`Analysis failed: ${error.message}`);
        } finally {
            analyzeBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Analyze Reviews';
            analyzeBtn.disabled = false;
        }
    });

    async function analyzeWithGemini(reviews, apiKey) {
        const prompt = `
        You are an expert product analyst. Analyze the following product reviews and provide a JSON response with the following fields:
        - sentiment_score: A number from 0 to 100 (0=negative, 100=positive).
        - strengths: An array of 3-5 key strengths mentioned.
        - weaknesses: An array of 3-5 key weaknesses mentioned.
        - recommendation: A strategic recommendation summary (2-3 sentences) for the product team.
        
        Reviews:
        "${reviews}"
        
        Return ONLY raw JSON, no markdown formatting.
        `;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API Error:', errorData);
            const errorMessage = errorData.error?.message || `API Error: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;

        // Clean up markdown if present
        const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    }

    function displayResults(data) {
        // Update Sentiment
        const sentimentEl = document.getElementById('sentiment-score');
        sentimentEl.textContent = data.sentiment_score + '/100';
        sentimentEl.style.color = data.sentiment_score > 70 ? '#10b981' : (data.sentiment_score < 40 ? '#ef4444' : '#f59e0b');

        // Update Count (Mock for now, or count lines)
        const count = reviewInput.value.split('\n').filter(line => line.trim().length > 0).length;
        document.getElementById('review-count').textContent = count;

        // Update Lists
        const strengthsList = document.getElementById('strengths-list');
        strengthsList.innerHTML = data.strengths.map(s => `<li>${s}</li>`).join('');

        const weaknessesList = document.getElementById('weaknesses-list');
        weaknessesList.innerHTML = data.weaknesses.map(w => `<li>${w}</li>`).join('');

        // Update Recommendation
        document.getElementById('recommendation-text').textContent = data.recommendation;

        // Show Section
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
});
