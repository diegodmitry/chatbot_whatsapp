# Chatbot WhatsApp Integration

This project integrates a chatbot with WhatsApp using Google Generative AI.


## Setup

1. Clone the repository.
2. Install dependencies:
    ```sh
    npm install @google/generative-ai dotenv qrcode-terminal whatsapp-web
    ```
3. Create a `.env` file in the root directory and add your Google API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

## Running the Project

1. Run the following command to start the chatbot:
    ```sh
    node index.js
    ```