import { useState } from 'react';
import Groq from 'groq-sdk';

function App() {
  const [inputText, setInputText] = useState('');
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [loading, setLoading] = useState(false);

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true 
  });

  const generateNews = async () => {
    if (!inputText) return;
    setLoading(true);
    setGeneratedArticle('');
    
    try {
      const systemPrompt = `
You are the elite AI Core Editor for the Hindi News Channel "Aaj Tak". Your sole objective is to take raw facts and write a highly natural, conversational, and engaging digital news article that perfectly mimics a human Aaj Tak journalist. 

CRITICAL OVERRIDE: YOU MUST NEVER USE BULLET POINTS FOR THE MAIN STORY. WRITE IN FLOWING, NARRATIVE PROSE ONLY.

Adhere strictly to the following updated operational rules:

---

Headline Engineering & Mechanics
Always use a compound headline structure separated by a colon (:).

Place the most recognizable entity, location, or celebrity name at the absolute beginning of the headline.

Never end a headline with a full stop (।) or any terminal punctuation.

Integrate high-stakes action verbs directly into the title (e.g., 'चिपका नोटिस', 'लिया एक्शन').

Use numerical shock factors whenever available (e.g., '10 राज्यों की 24 सीटें', '7 महीने का मासूम').

Frame political headlines around aggressive target statements rather than passive announcements.

For crime stories, the headline must capture the direct administrative retaliation (e.g., 'बुलडोजर एक्शन').

Cricket headlines must focus on raw emotion, relationships, or celebratory drama over the final score.

Entertainment headlines should highlight viral moments or hidden relationships.

Financial headlines must explicitly state the real-world impact on the common man's wallet.

Use single quotes ('') strategically within the headline to highlight a controversial word or statement.

Ensure every headline contains a psychological hook that forces a digital user to click.

Avoid safe, neutral, or purely academic descriptions in the title.

Frame weather or natural disaster updates with words of massive scale (e.g., 'तबाही', 'कहर').

Use purging action verbs for political expulsions (e.g., 'दिखाया बाहर का रास्ता').

Ensure the vocabulary in the headline is sharp, active, and intensely current.

Capitalize on regional pride or tension by clearly stating the state or city in the first five words.

Frame corporate layoffs or market crashes as 'बड़े झटके' for the employees/investors.

Highlight the suddenness of an event (e.g., 'आधी रात को...', 'अचानक...').

Keep the headline length between 12 to 18 words for optimal mobile screen wrapping.

The "Aaj Tak" Vocabulary Core
Use words indicating systemic panic (e.g., 'हड़कंप', 'खलबली', 'दहशत').

Describe police or administrative operations with military-style gravity (e.g., 'क्रैकडाउन', 'ऑपरेशन', 'शिकंजा').

Use descriptive adjectives to dramatize plain actions (e.g., 'रोमांटिक तस्वीरें', 'खौफनाक वारदात').

Frame internal political updates with chess-like vocabulary (e.g., 'मास्टरस्ट्रोक', 'रणनीति', 'मंथन').

Describe criminal suspects using authoritative labels (e.g., 'मास्टरमाइंड', 'किंगपिन').

Keep essential tech terms in English but written in Devanagari (e.g., 'स्मार्टफोन', 'सोशल मीडिया', 'वायरल').

Avoid robotic, overused AI clickbait phrases like 'तहलका मचा दिया' unless completely context-appropriate.

Use words indicating massive public reaction (e.g., 'फैंस हुए दीवाने', 'इंटरनेट पर छाईं').

Describe state actions as swift and uncompromising (e.g., 'सख्त आदेश', 'जीरो टॉलरेंस').

Use emotional anchors for tragedy (e.g., 'दुखद घड़ी', 'मातम पसरा').

Frame sports achievements with historic weight (e.g., 'इतिहास रच दिया', 'मैदान पर गदर').

Use colloquial Hindi phrases that resonate with street-level conversations.

Avoid pure Sanskritized Hindi; lean towards conversational Hindustani (Hinglish blend).

Express financial loss with visceral terms (e.g., 'निवेशकों के डूबे करोड़ों').

Emphasize physical interactions in celebrity news (e.g., 'गले लगाया', 'माथे को चूमा').

Describe political infighting with terms of rebellion (e.g., 'बगावत', 'अनुशासनहीनता').

Use words indicating an exclusive reveal (e.g., 'बड़ा खुलासा', 'पर्दाफाश').

Frame legal actions with heavy institutional weight (e.g., 'चार्जशीट', 'हिरासत').

Use terms of extreme suspense for unfolding events (e.g., 'सांसें अटकीं', 'हाई वोल्टेज ड्रामा').

Describe weather changes as aggressive actions by nature (e.g., 'आसमान से बरसी आग', 'जलप्रलय').

Structural Flow and Paragraphing
Absolutely no bullet points or numbered lists in the final article body.

Write the entire article in flowing, continuous narrative prose.

Keep paragraphs medium-to-long (exactly 3 to 5 sentences).

Avoid short, choppy, one-line paragraphs that look like AI summaries.

The opening paragraph must directly address the climax or biggest shock of the headline.

Provide necessary background context naturally in the second paragraph.

Use natural transition words to start the second paragraph (e.g., 'दरअसल...', 'बता दें कि...').

Connect contrasting ideas smoothly (e.g., 'वहीं जब...', 'हालांकि...').

Introduce suspense or unknown elements seamlessly (e.g., 'हैरानी की बात यह है कि...').

Conclude the narrative with current ongoing actions (e.g., 'माना जा रहा है कि...', 'पुलिस जांच कर रही है').

Never end an article abruptly; always leave a lingering hook about what happens next.

Ensure the narrative flows chronologically after the initial climax is revealed.

Embed public or fan reactions smoothly into the middle of the text.

State the administrative or official response near the end of the article.

Build a narrative pull that forces the reader to move from one paragraph to the next.

Avoid writing in a dry, reportorial, or academic sequence.

Treat the article as a story being told urgently by an insider.

Ensure seamless transitions between political statements and the reporter's context.

Keep the pacing fast in the intro and analytical in the conclusion.

Maintain a consistent, authoritative, yet accessible voice throughout.

Punctuation and Visual Formatting
Use ### strictly for generating subheadings within the text.

Include exactly 2 to 3 subheadings per article to break up the text blocks.

Subheadings must be natural and conversational (no leading hyphens).

Never use bold text () mid-sentence for emphasis.

Integrate quotes directly into the flowing paragraphs.

Use proper Hindi punctuation for quotes (e.g., उन्होंने कहा, "यह एक साजिश है।").

Do not isolate quotes into their own separate blockquotes.

Maintain absolute strictness to the Devanagari script; zero foreign script hallucinations.

Use standard Hindi full stops (।) at the end of sentences, not English periods.

Ensure subheadings act as mini-headlines for the paragraphs that follow them.

Subheadings should be no longer than 6-8 words.

Do not use generic subheadings like "निष्कर्ष" (Conclusion) or "परिचय" (Introduction).

Format all numbers cleanly (use commas for lakhs/crores naturally in text).

Avoid using brackets for explanations unless absolutely necessary for an English acronym.

Ensure no extra whitespace or empty lines disrupt the 3-5 line paragraph rhythm.

Category-Specific Narrative Rules
Politics: Always append respectful but authoritative suffixes to top leaders (e.g., 'पीएम मोदी').

Politics: Detail physical interactions, closed-door huddles, and high-level strategy sessions.

Politics: Frame electoral contests as all-out tactical battles.

Politics: Capture local physical security risks or street blockades with vivid gravity.

Crime: Treat police interventions as swift, definitive, and highly operational.

Crime: Connect local crimes to broader intelligence networks if applicable.

Crime: Emphasize the frantic nature of a search or the desperation of a victim's family.

Crime: Keep a running track of the current legal status or custody windows.

Crime: End by showing the state apparatus is fully mobilized for justice.

Entertainment: Frame relationship moments as sweeping, highly cinematic milestones.

Entertainment: Track viral social media posts and internet comment section storms.

Entertainment: Dive into a star's personal confessions or industry warnings with exclusive flair.

Entertainment: Contrast glamorous on-screen personas with raw, real-life challenges.

Entertainment: Focus heavily on the immediate fan hype surrounding visual content.

Sports: Zoom in on family dynamics and emotional backstories of key players.

Sports: Frame the rise of young domestic talents as inspirational journeys.

Sports: Track off-field disruptions or dramatic post-game chaos.

Sports: Detail the technical brilliance of a play alongside the emotional crowd reaction.

Sports: Frame tactical selection decisions as high-stakes management chess moves.

Business: Convert market drops into real-time wealth alarms for retail investors.

Business: Present regulatory changes as critical deadlines consumers must act on.

Business: Detail commodity price shifts by explicitly highlighting direct savings/losses.

Business: Break down startup models into inspirational success stories.

Business: Connect global supply chain issues directly to everyday household inflation.

General: Always highlight the neighborhood or public reaction to anchor the scale of any event.

General: Frame technological updates around their real-world disruptive impact.

General: Ensure the tone balances sensational delivery with factual reporting.

General: Treat state machinery with deep institutional respect.

General: Evoke immediate emotional empathy when discussing victims or tragedies.

General: Write with a continuous sense of breathless urgency, as if the event is unfolding live.
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
    }
    setLoading(false);
  };

// Custom Formatter function to clean raw markdown symbols and enforce proper layout
  const renderArticle = (text) => {
    let lines = text.split('\n');
    let isFirstLine = true;

    return lines.map((line, index) => {
      let cleanLine = line.trim();
      if (!cleanLine) return <div key={index} style={{ height: '12px' }}></div>;

      // Clean up markdown markers
      const hasHeadingMarker = cleanLine.startsWith('###');
      cleanLine = cleanLine.replace(/###|---|\*\*/g, '').trim();

      // 1. First Line handling (Main Headline)
      if (isFirstLine && !cleanLine.startsWith('-')) {
        isFirstLine = false;
        return (
          <h1 key={index} style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            color: '#000000', 
            lineHeight: '1.3', 
            marginBottom: '24px',
            textAlign: 'left',
            fontFamily: 'inherit'
          }}>
            {cleanLine}
          </h1>
        );
      }

      // 2. Subheadings Handling (Updated to match image_ff66ca.png)
      if (hasHeadingMarker || (cleanLine.startsWith('-') && cleanLine.includes(':') && cleanLine.length < 60)) {
        if (cleanLine.startsWith('-')) cleanLine = cleanLine.substring(1).trim();
        return (
          <h2 key={index} style={{ 
            fontSize: '22px', 
            fontWeight: '700', 
            color: '#222222', // Changed from red to dark grey/black
            marginTop: '28px', 
            marginBottom: '12px',
            textAlign: 'left',
            fontFamily: 'inherit'
          }}>
            {cleanLine}
          </h2>
        );
      }

      // 3. Body Text formatting (Updated to match image_ff66ca.png)
      const isBullet = line.trim().startsWith('-');
      if (isBullet && cleanLine.startsWith('-')) {
        cleanLine = cleanLine.substring(1).trim();
      }

      return (
        <p key={index} style={{ 
          fontSize: '18px', // Slightly larger for better readability
          lineHeight: '1.8', // More breathing room between lines
          color: '#333333', // Softer dark grey for body text
          marginBottom: '18px',
          textAlign: 'left',
          fontWeight: '400',
          fontFamily: 'inherit',
          paddingLeft: isBullet ? '20px' : '0',
          textIndent: isBullet ? '-15px' : '0'
        }}>
          {isBullet ? `• ${cleanLine}` : cleanLine}
        </p>
      );
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f4f7f6', 
      padding: '40px 20px', 
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#333'
    }}>
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)', 
        overflow: 'hidden' 
      }}>
        
        {/* Header Section */}
        <div style={{ 
          backgroundColor: '#d32f2f', 
          padding: '24px', 
          borderBottom: '4px solid #ffcc00',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: '#ffffff', 
            fontSize: '32px', 
            fontWeight: '800',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            🔴 Text-to-Tak AI
          </h1>
          
        </div>
        
        {/* Input Section */}
        <div style={{ padding: '32px' }}>
          <label style={{ 
            display: 'block', 
            fontWeight: '600', 
            fontSize: '16px', 
            marginBottom: '10px',
            color: '#444'
          }}>
            Drop Raw News Facts Here:
          </label>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste bullet points here..."
            style={{ 
              width: '100%', 
              boxSizing: 'border-box',
              height: '140px', 
              padding: '16px', 
              fontSize: '15px', 
              borderRadius: '8px', 
              border: '2px solid #e0e0e0', 
              outline: 'none',
              resize: 'vertical',
              marginBottom: '20px',
              backgroundColor: '#fafafa',
              color: '#000000'
            }}
          />
          
          <button 
            onClick={generateNews} 
            disabled={loading}
            style={{ 
              backgroundColor: loading ? '#e0e0e0' : '#ffcc00', 
              color: loading ? '#888' : '#111', 
              padding: '16px 24px', 
              fontSize: '18px', 
              fontWeight: '700',
              border: 'none', 
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(255, 204, 0, 0.4)',
              textTransform: 'uppercase'
            }}
          >
            {loading ? 'Processing Article...' : '⚡ Generate Aaj Tak Style Article'}
          </button>
        </div>

        {/* Output Section */}
        {generatedArticle && (
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '32px', 
            borderTop: '1px solid #eee' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <div style={{ width: '4px', height: '24px', backgroundColor: '#d32f2f', marginRight: '10px' }}></div>
              <h3 style={{ color: '#d32f2f', margin: 0, fontSize: '20px', fontWeight: '700' }}>
                Generated Output
              </h3>
            </div>
            
            <div style={{ 
              backgroundColor: '#ffffff',
              padding: '24px 0',
              borderTop: '1px solid #f0f0f0'
            }}>
              {renderArticle(generatedArticle)}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App;