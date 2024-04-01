const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// Access the API key from the environment
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Function to convert an image file into a GoogleGenerativeAI.Part Object
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}

async function askGemini(question, imagePaths = []) {
    let modelName = "gemini-pro"; // Default for text-only
    let parts = [question];

    // If images are provided, adjust model and input parts
    if (imagePaths.length > 0) {
        modelName = "gemini-pro-vision";
        parts = [...parts, ...imagePaths.map((path) => fileToGenerativePart(path, "image/jpeg"))];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-latest"});
    const result = await model.generateContent(parts);
    const response = await result.response;
    return response.text();
}

module.exports = { askGemini };