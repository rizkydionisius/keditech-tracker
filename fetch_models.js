const { GoogleGenerativeAI } = require("@google/generative-ai");

// Mock env var if needed or just use process.env
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API KEY found in env");
    process.exit(1);
}

async function listModels() {
    try {
        // We can't easily list models via SDK in older versions, but check if we can do a simple fetch
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (e) {
        console.error(e);
    }
}

listModels();
