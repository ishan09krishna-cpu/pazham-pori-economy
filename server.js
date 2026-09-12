/**
 * KUNJIRAMAN AI (🤖 ഡാ AI) - Backend Express Server
 * Hackathon Project for "Useless Project"
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Import Engines
const { getMemeImage, detectEmotion } = require('./server/memeImageEngine');

// Initialize AI client (Supports Groq API, OpenAI API, or Fallback)
let aiClient = null;
let aiProvider = 'none';
let defaultModel = 'gpt-4o-mini';

if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
  aiClient = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  aiProvider = 'Groq Cloud';
  // Use active supported Groq model string
  defaultModel = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
} else if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  aiProvider = 'OpenAI';
  defaultModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
}

/**
 * Dynamic System Prompt Generator based on Personality Mode
 */
function getSystemPrompt(mode = 'chunk') {
  const baseRules = `
You are "KUNJIRAMAN AI" (also known as "ഡാ AI"), a funny, witty, sarcastic AI chatbot designed as a college hackathon project for an event called "Useless Project".
Your tagline is "ചോദ്യം എന്തായാലും, കളിയാക്കൽ ഉറപ്പ് 😎".

Core Behavior Guidelines:
1. LANGUAGE: Seamlessly understand Malayalam, Manglish (Malayalam in English script), and English. Respond in the same language or Manglish blend as the user.
2. PERSONALITY: Act like an authentic, funny Kerala college friend / batchmate. Use natural college slang (bro, da, machane, scene, zero scene, set, poyine, load, mass, vibe, thallu, arrears, attendance, internal, etc.).
3. HUMOR & TEASING: Tease the user playfully about lazy habits, exam panic, sleeping in class, mass entries, late assignments, and college drama.
4. HELPFULNESS UNDERNEATH: Always provide genuine, practical advice underneath the jokes.
5. CONCISE: Keep answers relatively short, punchy, and readable (2 to 4 small paragraphs maximum, formatted with bullet points or emojis).
6. SAFETY & BOUNDARIES: Never be hateful, discriminatory, abusive, or genuinely cruel. If the user asks about serious, critical, or sensitive topics (e.g., self-harm, depression, severe panic), drop the humor completely and give a compassionate, sensible response. Never claim to predict the future with absolute certainty.
`;

  const modePrompts = {
    chunk: `${baseRules}
ACTIVE MODE: 😎 Chunk Mode (ചങ്ക് Mode - Default Friend)
Tone: Friendly, sarcastic, supportive college bestie.
Style: Light teasing, super chill, relatable campus banter, funny step-by-step solutions.`,

    roast: `${baseRules}
ACTIVE MODE: 😂 Kaliyaakkal Mode (കളിയാക്കൽ Mode - Roast Master)
Tone: High-intensity playful roasting and teasing.
Style: Roast their laziness or silly question hard, but immediately follow up with the actual answer. Use emojis like 😭💀😂.`,

    cinema: `${baseRules}
ACTIVE MODE: 🎬 Cinema Mode (സിനിമ Mode - Dramatic Hero/Villain)
Tone: Epic, dramatic, cinematic Malayalam film style!
Style: Build dramatic tension, slow-motion references, imaginary background score descriptions (e.g. *background score intensifies*, *interval scene twist*, *slow motion entry*). Treat ordinary college questions like a blockbuster climax. Do NOT use copyrighted dialogues; use 100% original cinematic storytelling!`,

    teacher: `${baseRules}
ACTIVE MODE: 🧑‍🏫 Teacher Mode (ടീച്ചർ Mode - Strict Professor/HOD)
Tone: Hilarious strict college professor / department head.
Style: Lecture them about attendance percentage, incomplete lab records, internal marks, and calling parents, but end up explaining the actual topic clearly.`,

    brutal: `${baseRules}
ACTIVE MODE: 💀 Brutal Mode (ബ്രൂറ്റൽ Mode - Unfiltered Truth)
Tone: Brutally honest savage truth-teller.
Style: Give them zero sugarcoating. Tell them directly why procrastination hurts, but wrap it in hilarious savage campus humor.`
  };

  return modePrompts[mode] || modePrompts.chunk;
}

/**
 * Intelligent Fallback Generator for Offline / No-Key Demos
 */
function generateFallbackResponse(userMessage, mode = 'chunk') {
  const msg = userMessage.toLowerCase();

  // Helper for responses per mode
  if (msg.includes('exam') || msg.includes('pass') || msg.includes('പഠിക്ക')) {
    if (mode === 'cinema') {
      return `Bro... Situation super serious aanu. 🎬\n\nExam nale aanu, nee textbook thurannittilla. Background-il suspense BGM thudangi... *dhum dhum dhum* 🥁\n\nBut don't worry! Second half-il nammal mass comeback nadathum! 😎\n\n1. Important topics aadyam nokku.\n2. Previous year questions skim cheyyu.\n3. Phone maatti vechu 2 hours concentrate cheythaal pass mark ഉറപ്പ്! 📚`;
    }
    if (mode === 'teacher') {
      return `എന്താടാ ഇത്? Exam-nte തലേന്ന് മാത്രം പഠിക്കാൻ ഓർമ്മ വന്നോ? 🧑‍🏫\n\nAt least 75% attendance ഉണ്ടോ തനിക്ക്? ഇന്റേണൽ മാർക്ക് കണ്ടാൽ കരച്ചിൽ വരും!\n\nഎന്തായാലും ഇനി സമയമില്ല. Syllabus എടുത്തു 3 important modules എങ്കിലും ഇരുന്ന് പഠിക്ക്! പോയി പഠിക്കെടാ! 📖`;
    }
    return `Bro, athu depend cheyyum nee ippo padichittundo ennathil! 😂\n\nIppo vare padichittillenkilum panic aavenda...\n\nPhone side-il vechu 2-3 hours concentrate cheythal pass aavan chance und 📚😭\n\nStep 1: Syllabus thurakkuka.\nStep 2: Important topics aadyam padikkuka.\nStep 3: All the best, machane! 🚀`;
  }

  if (msg.includes('assignment') || msg.includes('project')) {
    return `Simple aanu bro! 😂\n\n1. Phone maattivekkuka 📱\n2. Laptop thurakkuka 💻\n3. Copy-paste cheyyathirikkaan sradhikkuka (or change words) 🤫\n4. Actually start cheyyuka! 😭\n\nTopic paranjaal njan outline undakki tharam!`;
  }

  if (msg.includes('college') || msg.includes('bunk') || msg.includes('പോണോ')) {
    return `Attendance status nokki decision edukkaam bro! 😂\n\n- Attendance < 75%: ഉടൻ ബാഗും എടുത്ത് പോയി ഇരിക്ക്! 🫡\n- Attendance > 85%: പോയില്ലെങ്കിലും college നഷ്ടപ്പെടില്ല, ഇന്ന് വീട്ടിലിരുന്ന് വിശ്രമിക്ക് 💀\n\nDecision ninne ഏൽപ്പിക്കുന്നു!`;
  }

  if (mode === 'cinema') {
    return `Bro... Scene മാറിയിരിക്കുകയാണ്! 🎬\n\nChodyam kettappo njan aalochichu: "Ithu yadhaartha chodyam aano atho villainte chalano?" *cue dramatic music* 🎻\n\nUttaram simple aanu: Sincere aayi work cheythaal ellaam set aakum, machane! 🔥`;
  }

  if (mode === 'teacher') {
    return `താൻ ചോദിച്ച ചോദ്യം കേട്ടാൽ തോന്നും തനിക്ക് ഇതല്ലാതെ വേറെ പണിയില്ലെന്ന്! 🧑‍🏫\n\nഎന്നാലും കാര്യമായി പറയാം, മര്യാദയ്ക്ക് കാര്യം മനസ്സിലാക്കി മുന്നോട്ട് പോയാൽ വിജയിക്കാം. കേട്ടല്ലോ?`;
  }

  // Default fallback answer
  return `Bro, kelkkaan rasamulla chodyam aanu! 😂\n\nChodhicha sthithikku njan parayaam: Zero scene, sradhichu handle cheythaal ellaam set aakum ✨\n\nIthil ethilum help venamenkil clear aayi chodhichoo, njan koode und! 😎`;
}

// ============================================================================
// AI-POWERED MEME CAPTION GENERATOR (Using Groq Llama)
// ============================================================================

/**
 * Generate a fresh, unique, sarcastic Malayalam/Manglish meme caption using Groq Llama.
 * Every call produces a DIFFERENT caption — no hardcoded templates.
 */
async function generateAIMemeCaption(userPrompt, emotion = 'shock') {
  if (!aiClient) {
    // Fallback if no AI client configured
    return getRandomFallbackCaption(emotion);
  }

  const systemPrompt = `You are a hilarious Malayalam meme caption writer. You specialize in creating VIRAL meme captions for Malayalam movie reaction images used in Kerala college meme culture.

RULES:
1. Write EXACTLY ONE short, punchy meme caption (1-2 lines maximum)
2. Use a MIX of Malayalam script, Manglish (Malayalam written in English), and emojis
3. The caption MUST be SARCASTIC, RELATABLE, and FUNNY — like something shared on Kerala college WhatsApp groups
4. Reference college life: exams, assignments, attendance, bunking, viva, canteen, hostel, lab records, internal marks, semester results
5. Use Kerala college slang: bro, da, machane, scene, zero scene, load, mass, thallu, arrears, KT, backpaper
6. Add 1-2 relevant emojis at the end
7. Make it sound like a REAL meme that would go VIRAL in Kerala college groups
8. DO NOT repeat yourself. Every response must be COMPLETELY DIFFERENT and FRESH
9. DO NOT add quotes around the caption
10. DO NOT explain the caption or add any other text
11. The response should contain ONLY the meme caption text — nothing else

EMOTION/VIBE: ${emotion}

Examples of the STYLE (but never repeat these exact captions):
- Nale EXAM aanennu innanu arinjath 💀
- Assignment deadline kazhinjittu 3 divasam aayi... ini sir enne thallikolum 😭
- Attendance 74.9% aayappol thoora sthalam maarunna feeling 🛑
- Lab record complete aayittilla but viva nale aanu 🤡
- Semester exam pass aayennu arinjappol ulla oru vibe ✨
- Internal marks kandu karachilum chiriyum oru same time 😂💀`;

  try {
    // Use qwen/qwen3.8-27b specifically for meme captions (no thinking overhead, fast output)
    const memeCaptionModel = 'qwen/qwen3.8-27b';
    const completion = await aiClient.chat.completions.create({
      model: memeCaptionModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create a funny Malayalam/Manglish meme caption for this context: "${userPrompt}". Make it sarcastic and relatable for Kerala college students. Output ONLY the caption.` }
      ],
      temperature: 0.95,
      max_tokens: 150,
      top_p: 0.95,
    });

    let caption = completion.choices[0]?.message?.content?.trim() || '';
    
    // Strip <think>...</think> reasoning tags (closed)
    caption = caption.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    // Strip unclosed <think> tags (if model runs out of tokens during thinking)
    caption = caption.replace(/<think>[\s\S]*/gi, '').trim();
    
    // Remove any leading/trailing quotes
    caption = caption.replace(/^["']+|["']+$/g, '').trim();
    
    // Remove any leading "Caption:" or similar prefixes
    caption = caption.replace(/^(caption|meme caption|here'?s?\s*(the|a|your)?\s*(caption)?)\s*:?\s*/i, '').trim();
    
    // Take only the first line if multiple lines returned
    const firstLine = caption.split('\n').filter(l => l.trim().length > 3)[0] || caption;
    caption = firstLine.trim();
    
    if (caption && caption.length > 3 && caption.length < 300) {
      return caption;
    }
  } catch (err) {
    console.error('AI Meme caption generation error:', err.message);
  }

  // Fallback if AI fails
  return getRandomFallbackCaption(emotion);
}

/**
 * Diverse fallback captions (only used when AI is unavailable)
 * Much larger pool than before for variety even in fallback mode
 */
function getRandomFallbackCaption(emotion) {
  const captions = {
    exam: [
      'Nale EXAM aanennu innanu arinjath... 💀',
      'Syllabus open cheythappol kanunu: "Ithu njan ippol vare padichittilla" 😭',
      'Textbook kayyil eduthappol dust pidichath kandu manasilaayi 📚💀',
      'One night padippu kondu semester jayikkaan pattuo? Scene illa bro 🛑',
      'Study leave muzhuvan Netflix kandu... ippo pani kitti 😂',
      'Mark list vannappol amma vilichath imagine cheyth nokku 📞💀',
    ],
    panic: [
      'Sir viva-ykk villichappol ulla oru panic 🤐💀',
      'Lab external-nu question kettappol ulla blank face 😶',
      'Attendance shortage message vannappol veedu vittodiyath 🏃💨',
      'Internal mark karumbol oxygen kuttirunna ninnu 😱',
      'Teacher ente peru vilikkumbo ulla heart attack moment 💀',
    ],
    confusion: [
      'Enthu nadakkunnu ennu enikku thanne ariyilla bro 🤷😂',
      'Class-il irunnath kondalone attendance kittollu... padichittilla 🤡',
      'Notes aarum eduthittilla but exam nale aanu... entha plan? 🙃',
      'Assignment topic kandu brain automatic aayi shutdown aayi 🧠⛔',
    ],
    mass: [
      'Mass entry koduthu class-il keriyappol teacher-nte mukham 😎🔥',
      'Last bench-il ninnu answer paranjappol class shocked 🎯',
      'Arrears ellaam clear aayappol ulla mass feeling ✨💪',
      'College fest-il stage-il kerubol ulla vibe 🎬🔥',
    ],
    shock: [
      'Ithu kandu ente kannille oru thallal! 😱',
      'Bro ith kandittu njaan aake thakarnnu poyi 💀😂',
      'Scene vere level aanallo machane! 🤯',
      'Ithokke nadakkumo ee lokathil?! 😭💀',
    ],
    awkward: [
      'Teacher ente nokki chirikunnu... njaan enthu cheythu? 😬',
      'Wrong class-il poyi irunnu oru 10 minute 🤡',
      'Crush-nte munnil veezhumpol ulla dignity loss 😭',
    ],
    sadness: [
      'Result vannappol KT kandu karachil vannu 😢',
      'Friends ellaarum pass aayi njaan maathram irikkunnu 💔',
      'Semester results kandu amma karayunna face 😭',
    ],
    celebration: [
      'Ellaa subjects-um pass aayappol ulla vibe ✨🎉',
      'Last arrears clear aayappol oru adi mass 🥳💪',
      'Campus placement kittiyappol ulla celebration 🎊😎',
    ],
    college: [
      'College-il poi irunnal maathram aanu life ennu thonnunnu 😂',
      'Canteen-il ninnu class-ilekku nadan ulla scene 🚶☕',
      'Hostel life-il food kandu ulla oru feeling 🍛💀',
    ],
    thinking: [
      'Brain-il kurachu overload aayi ippo 🧠💥',
      'Entha cheyyendathennu aarum parayanilla bro 🤔',
      'Deep thought-il irikkuvayirunnu... oru 5 sec 💭',
    ],
    villain: [
      'Class topper-ne thottikkan ulla plan nadakkunnund 😈',
      'Teacher paranja deadline njaan thalliyittanu bro 💀🔥',
    ],
  };

  const pool = captions[emotion] || captions['shock'];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * POST /api/chat
 * Handles chat requests and communicates with OpenAI API
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, mode = 'chunk' } = req.body;

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required.'
      });
    }

    const systemPrompt = getSystemPrompt(mode);

    // Limit context history to recent 10 messages for efficiency
    const recentMessages = messages.slice(-10).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: String(m.content || '')
    }));

    // Form payload with system prompt
    const fullConversation = [
      { role: 'system', content: systemPrompt },
      ...recentMessages
    ];

    let replyContent = '';

    // If AI API key is set and valid (Groq or OpenAI), call AI provider
    if (aiClient) {
      try {
        const completion = await aiClient.chat.completions.create({
          model: defaultModel,
          messages: fullConversation,
          temperature: 0.8,
          max_tokens: 500,
        });

        replyContent = completion.choices[0]?.message?.content || '';
      } catch (apiError) {
        console.error(`${aiProvider} API call failed, using intelligent fallback mode:`, apiError.message);
        const lastUserMsg = recentMessages.filter(m => m.role === 'user').pop()?.content || '';
        replyContent = generateFallbackResponse(lastUserMsg, mode);
      }
    } else {
      const lastUserMsg = recentMessages.filter(m => m.role === 'user').pop()?.content || '';
      replyContent = generateFallbackResponse(lastUserMsg, mode);
    }

    // Detect emotion for Movie Reaction Image
    const lastUserMsg = recentMessages.filter(m => m.role === 'user').pop()?.content || '';
    const emotion = detectEmotion(lastUserMsg, mode);

    // Fetch TMDB reaction image with AI-generated caption
    let reactionImage = null;
    try {
      const [imageResult, aiCaption] = await Promise.all([
        getMemeImage(lastUserMsg, emotion),
        generateAIMemeCaption(lastUserMsg, emotion)
      ]);

      if (imageResult && imageResult.url) {
        reactionImage = {
          ...imageResult,
          caption: aiCaption,
        };
      }
    } catch (rErr) {
      console.warn('Movie reaction fetch warning:', rErr.message);
    }

    if (!replyContent) {
      replyContent = 'അയ്യോ bro 😭 എന്റെ brain ഒന്ന് hang ആയി. കുറച്ച് കഴിഞ്ഞ് വീണ്ടും ചോദിക്ക്.';
    }

    return res.json({
      reply: replyContent,
      mode: mode,
      provider: aiProvider,
      reactionImage: reactionImage,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Server error in /api/chat:', err);
    return res.status(500).json({
      error: 'അയ്യോ bro 😭 എന്റെ brain ഒന്ന് hang ആയി. കുറച്ച് കഴിഞ്ഞ് വീണ്ടും ചോദിക്ക്.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * POST /api/generate-meme
 * Generates original meme photo using real TMDB Malayalam Movie/Actor images
 * with AI-generated sarcastic Malayalam/Manglish captions via Groq Llama
 */
app.post(['/api/generate-meme', '/api/generate-image'], async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Valid meme prompt is required.' });
    }

    const cleanPrompt = prompt.trim();
    const emotion = detectEmotion(cleanPrompt);

    // Run image search and AI caption generation in parallel for speed
    const [imageResult, aiCaption] = await Promise.all([
      getMemeImage(cleanPrompt, emotion),
      generateAIMemeCaption(cleanPrompt, emotion)
    ]);

    // If real TMDB image found, return with AI-generated caption
    if (imageResult && imageResult.url) {
      return res.json({
        success: true,
        image: imageResult.url,
        imageUrl: imageResult.url,
        caption: aiCaption,
        personName: imageResult.personName || 'Malayalam Cinema',
        movieTitle: imageResult.title || 'Malayalam Movie',
        prompt: cleanPrompt,
        provider: imageResult.source || 'TMDB API',
        timestamp: new Date().toISOString()
      });
    }

    // If no image found, return failure with the AI caption as a consolation
    return res.json({
      success: false,
      message: `${aiCaption}\n\n😭 Bro, reaction image kittiyilla. TMDB API-yil ninnu image onnum vannilla. 💀`,
      prompt: cleanPrompt
    });

  } catch (err) {
    console.error('Error in /api/generate-meme:', err);
    return res.json({
      success: false,
      message: 'Bro, reaction image kittiyilla 😭 Situation still serious aanu though. 💀',
      error: err.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'KUNJIRAMAN AI',
    aiProvider: aiProvider,
    aiConfigured: Boolean(aiClient),
    tmdbConfigured: Boolean(process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== 'your_tmdb_api_key_here'),
    features: {
      chat: Boolean(aiClient),
      memeCaption: Boolean(aiClient),
      memeImage: Boolean(process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== 'your_tmdb_api_key_here'),
    }
  });
});

// Start Server with port fallback on EADDRINUSE
const server = app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🤖 KUNJIRAMAN AI (ഡാ AI) Server Running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🔑 AI Provider Status: ${aiClient ? `${aiProvider} Active (${defaultModel}) ✅` : 'NOT CONFIGURED (Fallback Demo Engine Active) ⚠️'}`);
  console.log(`🎬 TMDB API: ${process.env.TMDB_API_KEY ? 'Active ✅' : 'NOT CONFIGURED ⚠️'}`);
  console.log(`🧠 AI Meme Captions: ${aiClient ? 'Active (Groq Llama) ✅' : 'Fallback Pool ⚠️'}`);
  console.log(`===================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = Number(PORT) + 1;
    console.warn(`⚠️ Port ${PORT} is currently in use. Trying port ${nextPort}...`);
    app.listen(nextPort, () => {
      console.log(`===================================================`);
      console.log(`🤖 KUNJIRAMAN AI (ഡാ AI) Server Running!`);
      console.log(`🌐 Local URL: http://localhost:${nextPort}`);
      console.log(`🔑 AI Provider Status: ${aiClient ? `${aiProvider} Active (${defaultModel}) ✅` : 'NOT CONFIGURED (Fallback Demo Engine Active) ⚠️'}`);
      console.log(`===================================================`);
    });
  } else {
    console.error('Server error:', err);
  }
});
