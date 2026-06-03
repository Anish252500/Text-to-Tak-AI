import { useState } from 'react';
import Groq from 'groq-sdk';

function App() {
  const [inputText, setInputText] = useState('');
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [loading, setLoading] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState('');

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true 
  });

  // 1. Dictionary of Category-Specific Rules (Token Saver)
  const categoryRules = {
    Politics: `
- Always append respectful but authoritative suffixes to top leaders (e.g., 'पीएम मोदी').
- Detail physical interactions, closed-door huddles, and high-level strategy sessions.
- Frame electoral contests as all-out tactical battles.
- Capture local physical security risks or street blockades with vivid gravity.`,
    Crime: `
- Treat police interventions as swift, definitive, and highly operational.
- Connect local crimes to broader intelligence networks if applicable.
- Emphasize the frantic nature of a search or the desperation of a victim's family.
- Keep a running track of the current legal status or custody windows.
- End by showing the state apparatus is fully mobilized for justice.`,
    Entertainment: `
- Frame relationship moments as sweeping, highly cinematic milestones.
- Track viral social media posts and internet comment section storms.
- Dive into a star's personal confessions or industry warnings with exclusive flair.
- Contrast glamorous on-screen personas with raw, real-life challenges.
- Focus heavily on the immediate fan hype surrounding visual content.`,
    Sports: `
- Zoom in on family dynamics and emotional backstories of key players.
- Frame the rise of young domestic talents as inspirational journeys.
- Track off-field disruptions or dramatic post-game chaos.
- Detail the technical brilliance of a play alongside the emotional crowd reaction.
- Frame tactical selection decisions as high-stakes management chess moves.`,
    Business: `
- Convert market drops into real-time wealth alarms for retail investors.
- Present regulatory changes as critical deadlines consumers must act on.
- Detail commodity price shifts by explicitly highlighting direct savings/losses.
- Break down startup models into inspirational success stories.
- Connect global supply chain issues directly to everyday household inflation.`,
    General: `
- Always highlight the neighborhood or public reaction to anchor the scale of any event.
- Frame technological updates around their real-world disruptive impact.
- Ensure the tone balances sensational delivery with factual reporting.
- Treat state machinery with deep institutional respect.
- Evoke immediate emotional empathy when discussing victims or tragedies.`
  };

  const generateNews = async () => {
    if (!inputText) return;
    setLoading(true);
    setGeneratedArticle('');
    setDetectedCategory('Detecting Context...');
    
    try {
      // ==========================================
      // PASS 1: CLASSIFICATION (Fast & Cheap)
      // ==========================================
      const classPrompt = `Analyze the following facts and classify them into exactly ONE of these categories: Politics, Crime, Entertainment, Sports, Business, General. 
      Respond with ONLY the category word. No other text.
      Facts: ${inputText}`;

      const classCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: classPrompt }],
        model: "llama-3.1-8b-instant", // Using a smaller, faster model just for classification
        temperature: 0.1,
      });

      let category = classCompletion.choices[0]?.message?.content?.trim() || "General";
      
      // Safety fallback if AI hallucinates the category name
      if (!categoryRules[category]) category = "General";
      
      setDetectedCategory(`Category: ${category}`);

      // ==========================================
      // PASS 2: GENERATION (Heavy Lifting)
      // ==========================================
      const systemPrompt = `
You are the elite AI Core Editor for the Hindi News Channel "Aaj Tak". Your sole objective is to take raw facts and write a highly natural, conversational, and engaging digital news article that perfectly mimics a human Aaj Tak journalist. 

CRITICAL OVERRIDE: YOU MUST NEVER USE BULLET POINTS FOR THE MAIN STORY. WRITE IN FLOWING, NARRATIVE PROSE ONLY.

---
Headline Engineering & Mechanics (STRICT RULES)
- Use a compound headline structure separated by exactly ONE colon (:) OR use a question mark (?) if posing a suspenseful question. 
- CRITICAL: NEVER use more than one colon (:) in a headline.
- Use single quotes ('') strategically within the headline to highlight a controversial word or statement (e.g., TMC में 'महाखेला').
- Place the most recognizable entity, location, or celebrity name at the absolute beginning.
- Never end a headline with a full stop (।) or any terminal punctuation.
- Integrate high-stakes action verbs directly into the title.
- Keep the headline length between 12 to 18 words.

The "Aaj Tak" Vocabulary Core
- Use words indicating systemic panic (e.g., 'हड़कंप', 'खलबली', 'दहशत').
- Describe police or administrative operations with military-style gravity (e.g., 'क्रैकडाउन', 'ऑपरेशन', 'शिकंजा').
- Keep essential tech terms in English but written in Devanagari (e.g., 'स्मार्टफोन', 'सोशल मीडिया').
- Use colloquial Hindi phrases that resonate with street-level conversations.

Structural Flow and Paragraphing
- Absolutely no bullet points or numbered lists in the final article body.
- Write the entire article in flowing, continuous narrative prose.
- The opening paragraph must directly address the climax or biggest shock of the headline.
- Provide necessary background context naturally in the second paragraph.
- Conclude the narrative with current ongoing actions (e.g., 'माना जा रहा है कि...', 'पुलिस जांच कर रही है').

Punctuation and Visual Formatting
- Use ### strictly for generating subheadings within the text.
- Include exactly 2 to 3 subheadings per article to break up the text blocks.
- Integrate quotes directly into the flowing paragraphs.
- Use proper Hindi punctuation for quotes.

---
Category-Specific Rules applied for [${category}]:
${categoryRules[category]}

Raw Information:
${inputText}
`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }],
        model: "llama-3.3-70b-versatile", 
        temperature: 0.7,
      });

      setGeneratedArticle(chatCompletion.choices[0]?.message?.content || "No content generated.");
    } catch (error) {
      console.error("Error:", error);
      setGeneratedArticle("Error generating news. Please check your console and API key.");
      setDetectedCategory("Error");
    }
    setLoading(false);
  };

  // Custom Formatter function
  const renderArticle = (text) => {
    let lines = text.split('\n');
    let isFirstLine = true;

    return lines.map((line, index) => {
      let cleanLine = line.trim();
      if (!cleanLine) return <div key={index} style={{ height: '12px' }}></div>;

      const hasHeadingMarker = cleanLine.startsWith('###');
      cleanLine = cleanLine.replace(/###|---|\*\*/g, '').trim();

      if (isFirstLine && !cleanLine.startsWith('-')) {
        isFirstLine = false;
        return (
          <h1 key={index} style={{ fontSize: '32px', fontWeight: '800', color: '#000000', lineHeight: '1.3', marginBottom: '24px' }}>
            {cleanLine}
          </h1>
        );
      }

      if (hasHeadingMarker || (cleanLine.startsWith('-') && cleanLine.includes(':') && cleanLine.length < 60)) {
        if (cleanLine.startsWith('-')) cleanLine = cleanLine.substring(1).trim();
        return (
          <h2 key={index} style={{ fontSize: '22px', fontWeight: '700', color: '#222222', marginTop: '28px', marginBottom: '12px' }}>
            {cleanLine}
          </h2>
        );
      }

      const isBullet = line.trim().startsWith('-');
      if (isBullet && cleanLine.startsWith('-')) cleanLine = cleanLine.substring(1).trim();

      return (
        <p key={index} style={{ fontSize: '18px', lineHeight: '1.8', color: '#333333', marginBottom: '18px', paddingLeft: isBullet ? '20px' : '0', textIndent: isBullet ? '-15px' : '0' }}>
          {isBullet ? `• ${cleanLine}` : cleanLine}
        </p>
      );
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6', padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
        
        <div style={{ backgroundColor: '#d32f2f', padding: '24px', borderBottom: '4px solid #ffcc00', textAlign: 'center' }}>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px', fontWeight: '800', textTransform: 'uppercase' }}>
            🔴 Text-to-Tak AI
          </h1>
        </div>
        
        <div style={{ padding: '32px' }}>
          <label style={{ display: 'block', fontWeight: '600', fontSize: '16px', marginBottom: '10px', color: '#444' }}>
            Drop Raw News Facts Here:
          </label>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste bullet points here..."
            style={{ width: '100%', boxSizing: 'border-box', height: '140px', padding: '16px', fontSize: '15px', borderRadius: '8px', border: '2px solid #e0e0e0', outline: 'none', resize: 'vertical', marginBottom: '20px', backgroundColor: '#fafafa' }}
          />
          
          <button 
            onClick={generateNews} 
            disabled={loading}
            style={{ backgroundColor: loading ? '#e0e0e0' : '#ffcc00', color: loading ? '#888' : '#111', padding: '16px 24px', fontSize: '18px', fontWeight: '700', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', textTransform: 'uppercase' }}
          >
            {loading ? 'Processing Article...' : '⚡ Generate Aaj Tak Style Article'}
          </button>

          {/* New UI Element to show the detected category */}
          {detectedCategory && (
            <div style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold', color: '#d32f2f' }}>
              {detectedCategory}
            </div>
          )}
        </div>

        {generatedArticle && (
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderTop: '1px solid #eee' }}>
            {renderArticle(generatedArticle)}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;