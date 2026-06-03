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

  const categoryRules = {
    Politics: `
- Always append respectful but authoritative suffixes to top leaders if they are mentioned in the facts.
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
      // PASS 1: CLASSIFICATION
      const classPrompt = `Analyze the following facts and classify them into exactly ONE of these categories: Politics, Crime, Entertainment, Sports, Business, General. 
      Respond with ONLY the category word. No other text.
      Facts: ${inputText}`;

      const classCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: classPrompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.1,
      });

      let category = classCompletion.choices[0]?.message?.content?.trim() || "General";
      if (!categoryRules[category]) category = "General";
      setDetectedCategory(`Category: ${category}`);

      // PASS 2: GENERATION (Hyperlink rules removed)
      const systemPrompt = `
You are the elite AI Core Editor for the Hindi News Channel "Aaj Tak". Your sole objective is to take raw facts and write a highly natural, conversational, and engaging digital news article that perfectly mimics a human Aaj Tak journalist. 

CRITICAL OVERRIDE: YOU MUST NEVER USE BULLET POINTS FOR THE MAIN STORY. WRITE IN FLOWING, NARRATIVE PROSE ONLY.

ANTI-HALLUCINATION PROTOCOL: You are strictly forbidden from inventing, fabricating, or adding names, political schemes, or celebrities that are not explicitly present in the raw facts. Stick ONLY to the entities provided.

---
Headline Engineering & Mechanics (STRICT RULES)
- Use a compound headline structure separated by exactly ONE colon (:) OR use a question mark (?) if posing a suspenseful question. NEVER use more than one colon.
- CONDITIONAL HOOK: IF a celebrity, personality, or high-authority name is present in the raw facts, place it directly in the headline. IF NO name is present, focus the headline heavily on the location or the main action (e.g., 'प्रशासन का एक्शन'). DO NOT invent names.
- Use single quotes ('') strategically within the headline to highlight a controversial word.
- Integrate high-stakes action verbs directly into the title.

Language, Tone & Suspense (MAXIMUM DRAMA)
- DO NOT write stiff, factual sentences. Use long, flowing narrative sentences.
- You MUST use high-drama transition phrases at the start of paragraphs such as 'दरअसल...', 'वहीं जब...', 'हैरानी की बात यह है कि...'.
- Liberally use high-impact Aaj Tak signature words like 'ताबड़तोड़', 'हड़कंप मच गया', 'खलबली', 'मास्टरस्ट्रोक'.
- Build emotional tension paragraph by paragraph. Do not just report facts. Use emotional hooks like 'सभी इस बारे में चर्चा करने लग गए' or 'हर कोई यह जानने को बेताब है'.
- The tone should not be flat; pull the reader forward emotionally.

Quotes & Reactions (MANDATORY & SPECIFIC)
- CRITICAL: You MUST include at least one DIRECT QUOTE wrapped in proper Hindi quotation marks ("...") near the end of the article.
- STRICTLY PROHIBITED: NEVER use generic, vague attributions like 'आला अधिकारियों का कहना है', 'पुलिस ने बताया', or 'सूत्रों के अनुसार'.
- ALWAYS attribute the quote to a specific, high-ranking designation appropriate to the context (e.g., 'DM', 'SP', 'DCP', 'कमिश्नर', 'SHO').
- If a name is provided in the raw facts, use it (e.g., 'SP रमेश सिंह ने कहा...'). If NO name is provided, you must combine the local area with the designation to make it sound authentic (e.g., 'ग्रेटर नोएडा वेस्ट के DCP ने सख्त लहजे में स्पष्ट किया कि...', 'जिले के DM ने चेतावनी देते हुए कहा...').

Formatting & Structure (STRICT)
- CRITICAL: You MUST use ### to generate EXACTLY 2 or 3 subheadings within the article. Writing an article with only 0 or 1 subheading is STRICTLY PROHIBITED.
- Distribute the subheadings evenly to break up the paragraphs.
- Subheadings must be written as a clean, direct question or statement without leading hyphens or special formatting characters.
- DO NOT use any markdown for links or bold text. Keep the text pure.

---
Category-Specific Rules applied for [${category}]:
${categoryRules[category]}

Raw Information:
${inputText}
`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }],
        model: "llama-3.3-70b-versatile", 
        temperature: 0.8,
      });

      setGeneratedArticle(chatCompletion.choices[0]?.message?.content || "No content generated.");
    } catch (error) {
      console.error("Error:", error);
      setGeneratedArticle("Error generating news. Please check your console and API key.");
      setDetectedCategory("Error");
    }
    setLoading(false);
  };

  // Custom Formatter function (Cleaned of all hyperlink logic)
  const renderArticle = (text) => {
    let lines = text.split('\n');
    let isFirstLine = true;

    return lines.map((line, index) => {
      let cleanLine = line.trim();
      if (!cleanLine) return <div key={index} style={{ height: '16px' }}></div>;

      const hasHeadingMarker = cleanLine.startsWith('###');
      // Added safety cleanup for [[ ]] just in case the AI still hallucinates them
      cleanLine = cleanLine.replace(/###|---|\*\*|\[\[|\]\]/g, '').trim();

      // 1. Main Headline Styling 
      if (isFirstLine && !cleanLine.startsWith('-')) {
        isFirstLine = false;
        return (
          <h1 key={index} style={{ fontSize: '30px', fontWeight: '800', color: '#000000', lineHeight: '1.4', marginBottom: '28px', fontFamily: 'inherit', letterSpacing: '-0.3px' }}>
            {cleanLine}
          </h1>
        );
      }

      // 2. Subheading Styling 
      if (hasHeadingMarker || (cleanLine.startsWith('-') && cleanLine.includes(':') && cleanLine.length < 60)) {
        if (cleanLine.startsWith('-')) cleanLine = cleanLine.substring(1).trim();
        return (
          <h2 key={index} style={{ fontSize: '22px', fontWeight: '700', color: '#000000', marginTop: '32px', marginBottom: '16px', lineHeight: '1.3', fontFamily: 'inherit' }}>
            {cleanLine}
          </h2>
        );
      }

      // 3. Body Paragraph Styling 
      const isBullet = line.trim().startsWith('-');
      if (isBullet && cleanLine.startsWith('-')) cleanLine = cleanLine.substring(1).trim();

      return (
        <p key={index} style={{ fontSize: '17px', lineHeight: '1.85', color: '#222222', marginBottom: '20px', textAlign: 'left', fontWeight: '400', fontFamily: 'inherit' }}>
          {isBullet ? <>&bull; {cleanLine}</> : cleanLine}
        </p>
      );
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        <div style={{ backgroundColor: '#d32f2f', padding: '20px', borderBottom: '4px solid #ffcc00', textAlign: 'center' }}>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '28px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🔴 Text-to-Tak AI
          </h1>
        </div>
        
        <div style={{ padding: '32px' }}>
          <label style={{ display: 'block', fontWeight: '600', fontSize: '15px', marginBottom: '10px', color: '#333' }}>
            Drop Raw News Facts Here:
          </label>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste bullet points here..."
            style={{ width: '100%', boxSizing: 'border-box', height: '130px', padding: '16px', fontSize: '15px', borderRadius: '6px', border: '2px solid #e9ecef', outline: 'none', resize: 'vertical', marginBottom: '20px', backgroundColor: '#fafafa' }}
          />
          
          <button 
            onClick={generateNews} 
            disabled={loading}
            style={{ backgroundColor: loading ? '#e9ecef' : '#ffcc00', color: loading ? '#6c757d' : '#111', padding: '15px 24px', fontSize: '17px', fontWeight: '700', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', textTransform: 'uppercase', transition: 'all 0.2s' }}
          >
            {loading ? 'Processing Article...' : '⚡ Generate Aaj Tak Style Article'}
          </button>

          {detectedCategory && (
            <div style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold', color: '#d32f2f', fontSize: '14px' }}>
              {detectedCategory}
            </div>
          )}
        </div>

        {generatedArticle && (
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderTop: '1px solid #f1f3f5' }}>
            {renderArticle(generatedArticle)}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;