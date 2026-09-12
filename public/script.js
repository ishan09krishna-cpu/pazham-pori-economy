/**
 * KUNJIRAMAN AI (🤖 ഡാ AI) - Frontend Interactive Logic
 * Hackathon Project: Useless Project
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Application State
  // --------------------------------------------------------------------------
  const state = {
    conversationHistory: [],
    currentMode: 'chunk',
    soundEnabled: true,
    isProcessing: false,
    uselessnessCount: 87
  };

  // Mode Display Names
  const modeNames = {
    chunk: '😎 ചങ്ക് Mode',
    roast: '😂 കളിയാക്കൽ Mode',
    cinema: '🎬 Cinema Mode',
    teacher: '🧑‍🏫 Teacher Mode',
    brutal: '💀 Brutal Mode'
  };

  // --------------------------------------------------------------------------
  // 2. DOM Elements
  // --------------------------------------------------------------------------
  const chatContainer = document.getElementById('chatContainer');
  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const typingIndicator = document.getElementById('typingIndicator');
  const modeSelector = document.getElementById('modeSelector');
  const quickQuestions = document.getElementById('quickQuestions');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const currentModeBadge = document.getElementById('currentModeBadge');
  const totalUselessnessCounter = document.getElementById('totalUselessnessCounter');

  // --------------------------------------------------------------------------
  // 3. Synthesized Web Audio Sound Generator (No external MP3 files needed!)
  // --------------------------------------------------------------------------
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
    }
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'send') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'receive') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'clear') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch (e) {
      console.warn('Audio synthesis warning:', e);
    }
  }

  // --------------------------------------------------------------------------
  // 4. UI Helper Functions
  // --------------------------------------------------------------------------

  // Auto-scroll chat to bottom smoothly
  function scrollToBottom() {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  }

  // Auto-resize textarea according to text height
  function resizeTextarea() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
  }

  // Show / Hide Typing Indicator
  function setLoading(loading) {
    state.isProcessing = loading;
    sendBtn.disabled = loading;
    if (loading) {
      typingIndicator.classList.remove('hidden');
      scrollToBottom();
    } else {
      typingIndicator.classList.add('hidden');
    }
  }

  // Generate Believable Hackathon Uselessness Stats Card
  function generateUselessnessCard(aiReplyText, mode) {
    // Generate pseudorandom but sensible stats based on response length & mode
    const textLen = aiReplyText.length;
    let uselessnessPct = Math.min(99, Math.max(65, (textLen * 7) % 35 + 65));
    let helpfulnessPct = Math.min(60, Math.max(10, 100 - uselessnessPct - 15));

    if (mode === 'cinema') uselessnessPct = Math.min(99, uselessnessPct + 5);
    if (mode === 'roast') uselessnessPct = Math.min(99, uselessnessPct + 8);

    const levelTitles = [
      'Highly Unnecessary 💀',
      'Peak Campus Nonsense 🏆',
      'Certified Waste 🗑️',
      'Dangerously Useless ⚠️',
      'Dramatic Overkill 🎬',
      'Maximum Thallu Level 💯',
      'Zero Scene Value 🛑'
    ];

    const levelTitle = levelTitles[(textLen + uselessnessPct) % levelTitles.length];

    // Update global useless counter badge
    state.uselessnessCount = Math.min(99, (state.uselessnessCount + uselessnessPct) % 40 + 60);
    totalUselessnessCounter.textContent = `⚡ Useless Power: ${uselessnessPct}%`;

    // Build Card HTML
    const card = document.createElement('div');
    card.className = 'uselessness-card';
    card.innerHTML = `
      <div class="useless-header">
        <span class="useless-title">📊 USELESSNESS METER</span>
        <span class="useless-badge">${levelTitle}</span>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label-row">
            <span>Uselessness</span>
            <span>${uselessnessPct}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-fill useless-fill" style="width: 0%;"></div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-label-row">
            <span>Helpfulness</span>
            <span>${helpfulnessPct}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-fill help-fill" style="width: 0%;"></div>
          </div>
        </div>
      </div>
    `;

    // Trigger bar fill animation
    setTimeout(() => {
      const uselessFill = card.querySelector('.useless-fill');
      const helpFill = card.querySelector('.help-fill');
      if (uselessFill) uselessFill.style.width = uselessnessPct + '%';
      if (helpFill) helpFill.style.width = helpfulnessPct + '%';
    }, 100);

    return card;
  }

  // Render User Message Bubble
  function renderUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user-message';
    msgDiv.innerHTML = `
      <div class="message-avatar">🧑</div>
      <div class="message-body">
        <div class="message-sender">
          <span class="sender-name">You</span>
        </div>
        <div class="message-content">${escapeHTML(text)}</div>
      </div>
    `;
    chatContainer.insertBefore(msgDiv, typingIndicator);
    scrollToBottom();
  }

  // Render AI Message Bubble with TMDB Reaction Card support
  function renderAIMessage(text, mode, reactionImage = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai-message';

    const modeLabel = modeNames[mode] || modeNames.chunk;

    msgDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-body">
        <div class="message-sender">
          <span class="sender-name">KUNJIRAMAN AI</span>
          <span class="active-mode-badge">${modeLabel}</span>
        </div>
        <div class="message-content">${formatText(text)}</div>
        <div class="message-actions">
          <button class="copy-btn" title="Copy response">📋 Copy</button>
        </div>
      </div>
    `;

    const messageBody = msgDiv.querySelector('.message-body');

    // Attach TMDB Movie Reaction Card if available
    if (reactionImage && reactionImage.url) {
      const reactionCard = document.createElement('div');
      reactionCard.className = 'tmdb-reaction-card';
      reactionCard.innerHTML = `
        <div class="tmdb-header">
          <span class="tmdb-title-tag">🎬 MOVIE REACTION</span>
          <span class="tmdb-source-badge">${escapeHTML(reactionImage.source || 'TMDB API')}</span>
        </div>
        <div class="tmdb-img-box">
          <img src="${reactionImage.url}" alt="${escapeHTML(reactionImage.title || 'Movie Reaction')}" />
        </div>
        <div class="tmdb-caption-text">"${escapeHTML(reactionImage.caption)}"</div>
        <div class="tmdb-credit-info">
          <span>🎬 <span class="tmdb-actor-name">${escapeHTML(reactionImage.personName || 'Malayalam Cinema')}</span> in <em>${escapeHTML(reactionImage.title || 'Movie Scene')}</em></span>
        </div>
      `;
      messageBody.appendChild(reactionCard);
    }

    // Attach Uselessness Card
    const uselessCard = generateUselessnessCard(text, mode);
    messageBody.appendChild(uselessCard);

    // Attach Copy Button Listener
    const copyBtn = msgDiv.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
      });
    });

    chatContainer.insertBefore(msgDiv, typingIndicator);
    scrollToBottom();
  }

  // Escape HTML to prevent XSS
  function escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
  }

  // Format text (convert markdown bullets & line breaks gracefully)
  function formatText(text) {
    let safe = escapeHTML(text);
    // Convert bold text **text**
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert newlines to breaks
    safe = safe.replace(/\n/g, '<br>');
    return safe;
  }

  // --------------------------------------------------------------------------
  // 5. Backend Communication
  // --------------------------------------------------------------------------
  async function handleSendMessage(userText) {
    if (!userText || state.isProcessing) return;

    // 1. Update UI with user message
    renderUserMessage(userText);
    playSound('send');

    // 2. Clear input
    userInput.value = '';
    resizeTextarea();

    // 3. Add to history
    state.conversationHistory.push({ role: 'user', content: userText });

    // 4. Show typing state
    setLoading(true);

    try {
      // Send POST request to backend server
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: state.conversationHistory,
          mode: state.currentMode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server returned an error');
      }

      const aiReply = data.reply || 'അയ്യോ bro 😭 എന്റെ brain ഒന്ന് hang ആയി.';

      // Hide typing
      setLoading(false);

      // Render AI response with TMDB reaction image card
      renderAIMessage(aiReply, state.currentMode, data.reactionImage);
      playSound('receive');

      // Save to conversation history
      state.conversationHistory.push({ role: 'assistant', content: aiReply });

    } catch (err) {
      console.error('Chat API Error:', err);
      setLoading(false);

      const errorMessage = 'അയ്യോ bro 😭 എന്റെ brain ഒന്ന് hang ആയി. കുറച്ച് കഴിഞ്ഞ് വീണ്ടും ചോദിക്ക്.';
      renderAIMessage(errorMessage, state.currentMode);
    }
  }

  // --------------------------------------------------------------------------
  // 6. Event Handlers & Event Listeners
  // --------------------------------------------------------------------------

  // Form Submit Handler
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    handleSendMessage(text);
  });

  // Textarea Keydown (Enter to send, Shift+Enter for newline)
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = userInput.value.trim();
      handleSendMessage(text);
    }
  });

  // Auto-resize input
  userInput.addEventListener('input', resizeTextarea);

  // Personality Mode Selector Buttons
  modeSelector.addEventListener('click', (e) => {
    const btn = e.target.closest('.mode-btn');
    if (!btn) return;

    // Toggle active state
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    state.currentMode = btn.dataset.mode || 'chunk';
    currentModeBadge.textContent = modeNames[state.currentMode];
  });

  // Render AI Generated Meme Image Bubble
  function renderAIMemeImage(imageUrl, promptText, provider = 'TMDB API', caption = '', personName = '', movieTitle = '') {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai-message';

    const captionHtml = caption ? `<div class="meme-ai-caption">"${escapeHTML(caption)}"</div>` : '';

    msgDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-body">
        <div class="message-sender">
          <span class="sender-name">KUNJIRAMAN AI</span>
          <span class="active-mode-badge">🎬 ${escapeHTML(provider)}</span>
        </div>
        <div class="message-content">
          <p>ദാ നിന്റെ Meme Reaction! 🔥😂</p>
          <div class="meme-image-card">
            <div class="meme-img-wrapper">
              <img src="${imageUrl}" alt="${escapeHTML(promptText)}" class="meme-img" />
              ${caption ? `<div class="meme-overlay-text">${escapeHTML(caption)}</div>` : ''}
            </div>
            ${captionHtml}
            <div class="meme-info-bar">
              <span class="meme-prompt-tag">🎬 ${escapeHTML(personName || 'Malayalam Actor')} • <em>${escapeHTML(movieTitle || 'Malayalam Cinema')}</em></span>
              <a href="${imageUrl}" target="_blank" class="download-btn">📥 View HD</a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Uselessness Card
    const messageBody = msgDiv.querySelector('.message-body');
    const uselessCard = generateUselessnessCard(promptText, state.currentMode);
    messageBody.appendChild(uselessCard);

    chatContainer.insertBefore(msgDiv, typingIndicator);
    scrollToBottom();
  }

  // Handle Meme Generation Request
  async function handleGenerateMeme(promptText) {
    if (!promptText || state.isProcessing) return;

    renderUserMessage(`🎨 Generate Meme: "${promptText}"`);
    playSound('send');

    const typingTextEl = typingIndicator.querySelector('.typing-text');
    if (typingTextEl) typingTextEl.textContent = 'കുഞ്ചിരാമൻ Meme വരക്കുന്നു... 🎨🖌️';

    setLoading(true);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      const data = await res.json();
      setLoading(false);

      if (typingTextEl) typingTextEl.textContent = 'കുഞ്ചിരാമൻ ആലോചിക്കുന്നു... 🧠💭';

      if (data.imageUrl) {
        renderAIMemeImage(data.imageUrl, promptText, data.provider, data.caption || '', data.personName || '', data.movieTitle || '');
        playSound('receive');
      } else {
        renderAIMessage('അയ്യോ bro 😭 Meme ഉണ്ടാക്കാൻ പറ്റിയില്ല. ഒന്നൂടെ ശ്രമിക്കൂ!', state.currentMode);
      }
    } catch (e) {
      console.error('Meme generation error:', e);
      setLoading(false);
      if (typingTextEl) typingTextEl.textContent = 'കുഞ്ചിരാമൻ ആലോചിക്കുന്നു... 🧠💭';
      renderAIMessage('അയ്യോ bro 😭 Meme ഉണ്ടാക്കാൻ പറ്റിയില്ല. ഒന്നൂടെ ശ്രമിക്കൂ!', state.currentMode);
    }
  }

  // Quick Question Chip Buttons & Meme Button
  quickQuestions.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip-btn');
    if (!chip) return;

    if (chip.id === 'generateMemeBtn') {
      const customPrompt = prompt('എന്താണ് Meme visual ആകേണ്ടത്?\n(e.g. Exam hall panic Malayalam student style)', 'Exam hall panic Malayalam college student');
      if (customPrompt && customPrompt.trim()) {
        handleGenerateMeme(customPrompt.trim());
      }
      return;
    }

    const question = chip.dataset.question || chip.textContent.trim().replace(/^"|"$/g, '');
    userInput.value = question;
    resizeTextarea();
    handleSendMessage(question);
  });

  // Clear Chat Button
  clearChatBtn.addEventListener('click', () => {
    if (confirm('ബ്രോ, Chat ഫുൾ ക്ലിയർ ചെയ്യണോ?')) {
      playSound('clear');
      state.conversationHistory = [];

      // Clear message bubbles (except welcome card and typing indicator)
      const messages = chatContainer.querySelectorAll('.message:not(.welcome-card)');
      messages.forEach(m => m.remove());

      // Reset textarea
      userInput.value = '';
      resizeTextarea();
    }
  });

  // Sound Toggle Button
  soundToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    soundToggleBtn.querySelector('.btn-icon').textContent = state.soundEnabled ? '🔊' : '🔇';
    soundToggleBtn.querySelector('.btn-text').textContent = state.soundEnabled ? 'Sound ON' : 'Sound OFF';
  });

  // --------------------------------------------------------------------------
  // 7. MEME GENERATOR MODAL LOGIC & CANVAS EXPORT
  // --------------------------------------------------------------------------
  const openMemeModalBtn = document.getElementById('openMemeModalBtn');
  const memeModal = document.getElementById('memeModal');
  const closeMemeModalBtn = document.getElementById('closeMemeModalBtn');
  const memeIdeaInput = document.getElementById('memeIdeaInput');
  const submitMemeBtn = document.getElementById('submitMemeBtn');
  const memeFactoryLoading = document.getElementById('memeFactoryLoading');
  const memeResultContainer = document.getElementById('memeResultContainer');
  const memeDisplayImg = document.getElementById('memeDisplayImg');
  const memeOverlayCaption = document.getElementById('memeOverlayCaption');
  const memeAnotherBtn = document.getElementById('memeAnotherBtn');
  const memeCopyCaptionBtn = document.getElementById('memeCopyCaptionBtn');
  const memeSaveBtn = document.getElementById('memeSaveBtn');

  let currentGeneratedMeme = null;

  // Open / Close Modal
  function openMemeModal() {
    memeModal.classList.remove('hidden');
    memeIdeaInput.focus();
  }

  function closeMemeModal() {
    memeModal.classList.add('hidden');
  }

  if (openMemeModalBtn) openMemeModalBtn.addEventListener('click', openMemeModal);
  if (closeMemeModalBtn) closeMemeModalBtn.addEventListener('click', closeMemeModal);

  // Close modal when clicking backdrop
  memeModal.addEventListener('click', (e) => {
    if (e.target === memeModal) closeMemeModal();
  });

  // Submit Meme Generation
  async function executeMemeGeneration() {
    const promptText = memeIdeaInput.value.trim();
    if (!promptText || state.isProcessing) return;

    playSound('send');
    submitMemeBtn.disabled = true;
    memeResultContainer.classList.add('hidden');
    memeFactoryLoading.classList.remove('hidden');

    try {
      const res = await fetch('/api/generate-meme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      const data = await res.json();
      memeFactoryLoading.classList.add('hidden');
      submitMemeBtn.disabled = false;

      if (data.success && data.image) {
        currentGeneratedMeme = data;
        memeDisplayImg.src = data.image;
        memeOverlayCaption.textContent = data.caption || '';
        memeResultContainer.classList.remove('hidden');

        // Also add meme to main chat stream
        renderAIMemeImage(data.image, promptText, data.provider || 'TMDB API', data.caption, data.personName, data.movieTitle);
        playSound('receive');
      } else {
        const noImgMsg = data.message || 'Bro, reaction image kittiyilla 😭 Situation still serious aanu though. 💀';
        renderAIMessage(noImgMsg, state.currentMode);
        alert(noImgMsg);
      }
    } catch (err) {
      console.error('Meme generation error:', err);
      memeFactoryLoading.classList.add('hidden');
      submitMemeBtn.disabled = false;
      alert('അയ്യോ bro 😭 Network Error. കുറച്ച് കഴിഞ്ഞ് വീണ്ടും ചോദിക്ക്.');
    }
  }

  submitMemeBtn.addEventListener('click', executeMemeGeneration);

  // Keyboard shortcut in meme textarea (Enter to generate)
  memeIdeaInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeMemeGeneration();
    }
  });

  // Action Button: Generate Another
  memeAnotherBtn.addEventListener('click', () => {
    memeIdeaInput.value = '';
    memeResultContainer.classList.add('hidden');
    memeIdeaInput.focus();
  });

  // Action Button: Copy Caption
  memeCopyCaptionBtn.addEventListener('click', () => {
    if (currentGeneratedMeme && currentGeneratedMeme.caption) {
      navigator.clipboard.writeText(currentGeneratedMeme.caption).then(() => {
        memeCopyCaptionBtn.textContent = '✅ Copied!';
        setTimeout(() => { memeCopyCaptionBtn.textContent = '📋 Copy Caption'; }, 2000);
      });
    }
  });

  // Action Button: Save Meme (Export via HTML5 Canvas)
  memeSaveBtn.addEventListener('click', () => {
    if (!currentGeneratedMeme || !memeDisplayImg.src) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = memeDisplayImg.src;

      img.onload = () => {
        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 600;

        // 1. Draw Image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 2. Draw Bottom Dark Gradient Overlay
        const gradHeight = canvas.height * 0.28;
        const grad = ctx.createLinearGradient(0, canvas.height - gradHeight, 0, canvas.height);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.5, 'rgba(0,0,0,0.75)');
        grad.addColorStop(1, 'rgba(0,0,0,0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, canvas.height - gradHeight, canvas.width, gradHeight);

        // 3. Draw Overlay Caption Text
        const captionText = currentGeneratedMeme.caption || '';
        if (captionText) {
          const fontSize = Math.max(22, Math.floor(canvas.width / 24));
          ctx.font = `bold ${fontSize}px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Text Stroke
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 6;
          ctx.strokeText(captionText, canvas.width / 2, canvas.height - (gradHeight / 2));

          // Text Fill
          ctx.fillStyle = '#ffffff';
          ctx.fillText(captionText, canvas.width / 2, canvas.height - (gradHeight / 2));
        }

        // Trigger Download
        const link = document.createElement('a');
        link.download = `kunjiraman_meme_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        memeSaveBtn.textContent = '✅ Saved!';
        setTimeout(() => { memeSaveBtn.textContent = '⬇️ Save Meme'; }, 2000);
      };
    } catch (err) {
      console.error('Canvas meme save error:', err);
      // Fallback direct image save
      const link = document.createElement('a');
      link.download = `kunjiraman_meme_${Date.now()}.png`;
      link.href = memeDisplayImg.src;
      link.click();
    }
  });
});
