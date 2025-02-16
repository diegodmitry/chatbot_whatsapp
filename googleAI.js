import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

// Configuração do ambiente
const ENVIRONMENT_CONFIG = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  modelName: "gemini-2.0-flash"
};

if (!ENVIRONMENT_CONFIG.geminiApiKey) {
  throw new Error('API key is missing. Please set the GOOGLE_API_KEY environment variable.');
}

// Configuração do modelo
const MODEL_CONFIG = {
  language: "Portuguese",
  generationConfig: {
    temperature: 0.7,     // Mantém um bom equilíbrio entre criatividade e consistência. 0: Respostas mais previsíveis e conservadoras. 1: Respostas mais criativas e variadas.
    topP: 0.8,           // Controla quão diversificado será o vocabulário. Recomendado: 0.8 a 0.95
    topK: 40,            // Define quantas palavras diferentes a IA pode escolher. Recomendado: 40 a 50
    maxOutputTokens: 2000 // Limita respostas a aproximadamente 4000 caracteres. Número máximo de tokens 8192
  },
  systemInstruction: `Você é ALMA(Assistente de Lógica e Memória Avançada), a assistente virtual de Diego Dmitry. Sigas estritamente estas regras:
  1. Responda sempre em Português de forma clara e concisa.
  `
}; // adicionar regras de acordo com o meu cv.

// Exemplo de prompt do comportamento da IA para colocar na propriedade systemInstruction
// Você é ALMA(Assistente de Lógica e Memória Avançada), a assistente virtual de Diego Dmitry. Siga estritamente estas regras:

//   1. Responda sempre em Português de forma clara e concisa
//   2. Limite suas respostas a no máximo 3 parágrafos
//   3. Não discuta tópicos sensíveis como política, religião ou conteúdo adulto
//   4. Se não souber algo, admita diretamente
//   5. Mantenha um tom profissional e amigável
//   6. Não forneça informações pessoais sobre Diego Dmitry
//   7. Foque em responder apenas perguntas sobre: [LISTA DE TÓPICOS PERMITIDOS]
//   8. Se a pergunta estiver fora dos tópicos permitidos, responda: "Desculpe, não posso ajudar com esse tipo de pergunta."



function initializeAIModel() {
  const genAI = new GoogleGenerativeAI(ENVIRONMENT_CONFIG.geminiApiKey);
  return genAI.getGenerativeModel({
    model: ENVIRONMENT_CONFIG.modelName,
    generationConfig: MODEL_CONFIG.generationConfig,
    systemInstruction: MODEL_CONFIG.systemInstruction
  });
}

// Geração de conteúdo pela IA
async function generateAIResponse(prompt, model) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    throw new Error('Falha ao gerar resposta da IA');
  }
}

// Formatação do prompt
function formatPrompt(userInput, targetLanguage = MODEL_CONFIG.language) {
  return `Responda em ${targetLanguage}: ${userInput}`;
}

// Função principal de uso
async function getAIResponse(userInput) {
  const model = initializeAIModel();
  const formattedPrompt = formatPrompt(userInput);
  return await generateAIResponse(formattedPrompt, model);
}

async function countTokens(text) {
  const genAI = new GoogleGenerativeAI(ENVIRONMENT_CONFIG.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: ENVIRONMENT_CONFIG.modelName });
  const { totalTokens } = await model.countTokens(text);
  return totalTokens;
}

// Exportação das funções
export {
  getAIResponse,
  formatPrompt,
  generateAIResponse,
  initializeAIModel,
  MODEL_CONFIG,
  countTokens
};

