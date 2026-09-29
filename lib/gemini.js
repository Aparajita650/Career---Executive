import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ordered by preference. Google periodically retires dated model names, so
// these are the "-latest" aliases plus a couple of fallbacks; if one is
// retired or temporarily overloaded, the next is tried automatically.
const MODEL_FALLBACKS = [
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-3.1-flash-lite",
];

function isRetriable(error) {
  return /\[(429|500|503)/.test(error?.message || "");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateGeminiText(prompt, { retriesPerModel = 2 } = {}) {
  let lastError;

  for (const modelName of MODEL_FALLBACKS) {
    const model = genAI.getGenerativeModel({ model: modelName });

    for (let attempt = 0; attempt <= retriesPerModel; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        lastError = error;
        if (!isRetriable(error) || attempt === retriesPerModel) break;
        await wait(1000 * (attempt + 1));
      }
    }
  }

  throw lastError;
}
