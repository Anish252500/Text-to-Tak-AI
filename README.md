# 🔴 Text-to-Tak AI

An AI-powered React micro-service that converts raw, unstructured facts into highly engaging, editorial-grade Hindi news articles, perfectly mimicking the narrative style of top-tier Indian journalism.

## 🚀 The Problem & Solution
Standard LLMs output dry, heavily bulleted, and robotic summaries. This project solves that by utilizing strict prompt-engineering constraints (a 105-point editorial DNA rulebook) to force the AI into generating flowing, suspenseful, and conversational Devanagari prose with automated frontend styling.

## ✨ Key Features
*   **Zero-Bullet Narrative Engine:** Automatically strips out AI-style lists and forces flowing 3-5 line paragraph structures.
*   **Dynamic Markdown Rendering:** Intercepts `###` markers from the LLM and converts them into production-ready red subheadings.
*   **Strict Script Lockdown:** Enforces pure Devanagari output, completely eliminating multi-lingual "token bleeding" hallucinations.
*   **Responsive UI:** Clean, centralized dashboard design optimized for readability and instant generation.

## 🛠️ Tech Stack
*   **Frontend:** React (Vite)
*   **AI Engine:** Groq API
*   **Model:** Llama 3.3 (70B)
*   **Styling:** CSS3 (Custom Typography & Layouting)

## ⚙️ How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Anish252500/Text-to-Tak-AI.git
   ```

2. Navigate into the project directory:
   ```bash
   cd Text-to-Tak-AI
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your Groq API key:
   ```env
   VITE_GROQ_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 📚 Data & References
The 105-point editorial DNA rulebook driving this engine was reverse-engineered by analyzing a comprehensive dataset. Below is a curated sample of the attached articles used for reference to map narrative flow, quote syntax, and vocabulary registers:

*   **Sports:** [पंड्या ब्रदर्स में खटपट? क्रुणाल के IPL...](https://www.aajtak.in/sports/cricket/story/hardik-pandya-no-post-for-brother-krunal-after-rcb-ipl-2026-title-win-tspok-dskc-2567307-2026-06-01) 
- *Tuned for emotional, relationship-driven sports narratives.*

*   **Crime:** [6 आपराधिक मामले, दबंग अंदाज...](https://www.aajtak.in/crime/news/story/muzzaffarpur-govind-sharma-shot-dead-bihar-crime-news-pvzs-dskc-2567361-2026-06-01) 
- *Tuned for authoritative formatting and quote integration.*

*   **Entertainment:** ['अल्फा' के सेट पर आलिया भट्ट से हुई बहस? झगड़े पर...](https://www.aajtak.in/entertainment/bollywood-news/story/bobby-deol-slams-rift-reports-with-alia-bhatt-on-alpha-sets-praised-actress-tmovh-dskc-2567189-2026-06-01)
- *Tuned for viral internet reactions and suspenseful pacing.*