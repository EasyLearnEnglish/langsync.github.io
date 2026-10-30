<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-900 text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LingoSync - Interactive Language Learning Hub</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- FontAwesome Icons CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Custom Styles for Scrollbars & Transitions -->
  <style>
    /* Custom Scrollbar for Smooth Subtitle Tracking */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.6);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(51, 65, 85, 0.8);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(71, 85, 105, 1);
    }
    .token-word {
      cursor: pointer;
      display: inline-block;
      padding: 0px 2px;
      border-radius: 3px;
      transition: all 0.15s ease;
    }
    .token-word:hover {
      background-color: rgba(59, 130, 246, 0.3);
      color: #60a5fa;
      text-decoration: underline;
    }
    .active-subtitle {
      background-color: rgba(59, 130, 246, 0.15);
      border-left: 4px solid #3b82f6;
      font-weight: 500;
    }
  </style>
</head>
<body class="h-full flex flex-col font-sans antialiased bg-slate-900 text-slate-100">

  <!-- TOP NAVBAR -->
  <header class="bg-slate-800/90 backdrop-blur border-b border-slate-700/60 sticky top-0 z-30 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
    <div class="flex items-center space-x-3">
      <div class="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
        <i class="fa-solid font-bold fa-language text-xl text-white"></i>
      </div>
      <div>
        <h1 class="font-bold text-lg leading-none text-white tracking-wide">LingoSync</h1>
        <p class="text-xs text-slate-400 mt-1">Interactive Video & Article Reader</p>
      </div>
    </div>

    <!-- MAIN NAVIGATION TABS -->
    <nav class="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700/50">
      <button id="nav-reader-btn" onclick="switchTab('reader')" class="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all bg-blue-600 text-white shadow-md">
        <i class="fa-solid fa-play"></i> <span>Reader & Player</span>
      </button>
      <button id="nav-saved-btn" onclick="switchTab('saved')" class="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all">
        <i class="fa-solid fa-bookmark"></i> <span>Saved Media</span>
        <span id="saved-media-count" class="ml-1 bg-slate-800 text-xs px-2 py-0.5 rounded-full border border-slate-700">0</span>
      </button>
      <button id="nav-vocab-btn" onclick="switchTab('vocab')" class="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all">
        <i class="fa-solid fa-book-bookmark"></i> <span>Saved Vocab</span>
        <span id="saved-vocab-count" class="ml-1 bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full border border-blue-500/30">0</span>
      </button>
    </nav>

    <!-- ACTION CONTROLS -->
    <div class="flex items-center gap-2">
      <button onclick="openImportModal()" class="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium px-3.5 py-1.5 rounded-lg border border-slate-600 transition-all shadow-sm">
        <i class="fa-solid fa-plus text-blue-400"></i> Import Content
      </button>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="flex-1 overflow-hidden relative">

    <!-- 1. READER & PLAYER TAB -->
    <section id="tab-reader" class="h-full flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
      
      <!-- LEFT COLUMN: Media Player / Article Content -->
      <div class="lg:w-7/12 flex flex-col h-full bg-slate-950/40 overflow-y-auto">
        <!-- Media Controls / Header -->
        <div class="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div class="flex items-center gap-2 overflow-hidden">
            <span id="media-type-badge" class="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">YouTube</span>
            <h2 id="current-content-title" class="text-sm font-semibold text-slate-200 truncate">Spanish Listening Practice - Dialogue</h2>
          </div>
          <button id="save-current-media-btn" onclick="toggleSaveCurrentMedia()" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-md border border-slate-700 flex items-center gap-1.5 transition-all">
            <i class="fa-regular fa-bookmark" id="save-media-icon"></i> <span id="save-media-text">Save Media</span>
          </button>
        </div>

        <!-- Media Display Canvas -->
        <div class="flex-1 p-4 flex flex-col justify-center items-center relative">
          
          <!-- YouTube Video Container -->
          <div id="yt-player-container" class="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-slate-800">
            <div id="yt-player"></div>
          </div>

          <!-- HTML5 Video Player Container -->
          <div id="html5-player-container" class="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative border border-slate-800 hidden">
            <video id="html5-player" class="w-full h-full" controls></video>
          </div>

          <!-- Article Viewer Container -->
          <div id="article-viewer-container" class="w-full h-full bg-slate-900/80 border border-slate-800 rounded-xl p-6 overflow-y-auto hidden text-slate-200 leading-relaxed space-y-4">
            <div id="article-content" class="text-base sm:text-lg"></div>
          </div>
        </div>

        <!-- Dictionary Query Selector Controls -->
        <div class="px-4 py-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-globe text-blue-400"></i>
            <span>WordReference Dictionary:</span>
            <select id="wr-dict-select" class="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500">
              <option value="enes">Spanish -> English</option>
              <option value="fren">French -> English</option>
              <option value="iten">Italian -> English</option>
              <option value="deen">German -> English</option>
              <option value="pten">Portuguese -> English</option>
              <option value="definition">English Definition</option>
            </select>
          </div>
          <span class="text-slate-500 hidden sm:inline"><i class="fa-solid fa-mouse-pointer"></i> Click any word to lookup</span>
        </div>
      </div>

      <!-- RIGHT COLUMN: Subtitle Sync & Transcript Column -->
      <div class="lg:w-5/12 flex flex-col h-full bg-slate-900">
        <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-closed-captioning text-blue-400"></i>
            <h3 class="font-semibold text-sm text-slate-200">Interactive Subtitles / Transcript</h3>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="toggleAutoScroll()" id="autoscroll-toggle" class="text-xs px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
              <i class="fa-solid fa-arrows-up-down"></i> Auto-Scroll: On
            </button>
          </div>
        </div>

        <!-- SUBTITLE CONTAINER -->
        <div id="subtitles-list" class="flex-1 overflow-y-auto p-4 space-y-2 relative">
          <!-- Subtitle lines populated dynamically -->
        </div>

        <!-- VIDEO TIME TRACKER FOOTER -->
        <div class="p-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span id="player-time-display">00:00 / 00:00</span>
          <span class="text-slate-500"><i class="fa-solid fa-bolt text-amber-400"></i> Click text to paused menu</span>
        </div>
      </div>
    </section>

    <!-- 2. SAVED MEDIA TAB -->
    <section id="tab-saved" class="h-full p-6 overflow-y-auto hidden">
      <div class="max-w-6xl mx-auto space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 class="text-xl font-bold text-white">Saved Videos & Articles</h2>
            <p class="text-sm text-slate-400">Manage your stored media imports for offline practice</p>
          </div>
        </div>
        <div id="saved-media-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Saved items rendered here -->
        </div>
      </div>
    </section>

    <!-- 3. SAVED VOCABULARY TAB -->
    <section id="tab-vocab" class="h-full p-6 overflow-y-auto hidden">
      <div class="max-w-6xl mx-auto space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <h2 class="text-xl font-bold text-white">Saved Vocabulary List</h2>
            <p class="text-sm text-slate-400">Export as CSV or practice your saved terms and definitions</p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="exportVocabCSV()" class="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all">
              <i class="fa-solid fa-file-csv"></i> Export CSV (.csv)
            </button>
          </div>
        </div>

        <div class="bg-slate-800/50 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-800 border-b border-slate-700 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <th class="p-4 w-1/3">Vocabulary Term</th>
                <th class="p-4 w-1/2">Definition / Note</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="vocab-table-body" class="divide-y divide-slate-700/50 text-sm">
              <!-- Vocab list items -->
            </tbody>
          </table>
          <div id="vocab-empty-msg" class="p-8 text-center text-slate-500 hidden">
            <i class="fa-solid fa-book-open text-3xl mb-2 block"></i>
            No saved vocabulary terms yet. Click any word while watching or reading to save it!
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- POPUP CONTEXTUAL MENU FOR INTERACTIVE TOKENS -->
  <div id="context-menu" class="fixed z-50 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl shadow-2xl p-3 w-72 hidden transform transition-all duration-150">
    <div class="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
      <span id="selected-word-title" class="font-bold text-blue-400 truncate max-w-[180px]">Word</span>
      <button onclick="closeContextMenu()" class="text-slate-400 hover:text-slate-200 text-xs p-1">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="space-y-1 text-xs">
      <a id="btn-search-google" target="_blank" class="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-700/70 rounded-lg text-slate-200 transition-colors">
        <i class="fa-brands fa-google text-red-400 w-4"></i> Search Google Browser
      </a>
      <a id="btn-search-images" target="_blank" class="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-700/70 rounded-lg text-slate-200 transition-colors">
        <i class="fa-solid fa-image text-green-400 w-4"></i> Google Image Search
      </a>
      <a id="btn-search-wr" target="_blank" class="flex items-center gap-2 px-2.5 py-2 hover:bg-slate-700/70 rounded-lg text-slate-200 transition-colors">
        <i class="fa-solid fa-book text-amber-400 w-4"></i> Open in WordReference
      </a>
      <button onclick="openAddVocabModal()" class="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-blue-600 bg-blue-600/80 text-white rounded-lg transition-colors font-medium mt-1">
        <i class="fa-solid fa-plus-circle w-4"></i> Add to Vocab List
      </button>
    </div>
  </div>

  <!-- MODAL: ADD VOCABULARY -->
  <div id="vocab-modal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
      <h3 class="text-lg font-bold text-white flex items-center gap-2">
        <i class="fa-solid fa-bookmark text-blue-400"></i> Save New Vocabulary
      </h3>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Vocabulary Term</label>
          <input id="modal-vocab-term" type="text" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Definition / Translation</label>
          <textarea id="modal-vocab-def" rows="3" placeholder="Enter or edit WordReference definition..." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"></textarea>
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button onclick="closeVocabModal()" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium">Cancel</button>
        <button onclick="confirmSaveVocab()" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium">Save Term</button>
      </div>
    </div>
  </div>

  <!-- MODAL: IMPORT CONTENT -->
  <div id="import-modal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
      <div class="flex justify-between items-center border-b border-slate-700 pb-3">
        <h3 class="text-lg font-bold text-white">Import Video or Article</h3>
        <button onclick="closeImportModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Type Selector -->
      <div class="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
        <button id="import-type-yt" onclick="setImportType('yt')" class="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white">YouTube Video</button>
        <button id="import-type-article" onclick="setImportType('article')" class="flex-1 py-1.5 text-xs font-semibold text-slate-400 rounded-lg">Article Text</button>
      </div>

      <!-- YouTube Import Form -->
      <div id="import-form-yt" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">YouTube Video URL / ID</label>
          <input id="import-yt-url" type="text" placeholder="https://www.youtube.com/watch?v=..." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Subtitles (SRT / WebVTT / Timed Format or JSON)</label>
          <textarea id="import-yt-subs" rows="4" placeholder="00:00:01 --> 00:00:04&#10;Hola y bienvenidos a la clase de español." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-100 focus:border-blue-500 focus:outline-none"></textarea>
          <p class="text-[10px] text-slate-500 mt-1">If blank, auto-generated timed placeholders will be synthesized for learning demo.</p>
        </div>
      </div>

      <!-- Article Import Form -->
      <div id="import-form-article" class="space-y-3 hidden">
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Article Title</label>
          <input id="import-article-title" type="text" placeholder="e.g. Noticia de Hoy" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Article Body Text</label>
          <textarea id="import-article-body" rows="5" placeholder="Paste full article text here..." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"></textarea>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-slate-700">
        <button onclick="closeImportModal()" class="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium">Cancel</button>
        <button onclick="processImportContent()" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium">Import Content</button>
      </div>
    </div>
  </div>

  <!-- YOUTUBE IFRAME API -->
  <script src="https://www.youtube.com/iframe_api"></script>

  <!-- MAIN APPLICATION JAVASCRIPT -->
  <script>
    /* ==========================================
       1. DEMO DATA & INITIALIZATION
       ========================================== */
    const SAMPLE_CONTENT = {
      id: 'demo-yt-1',
      type: 'youtube',
      title: 'Spanish Conversation - En el Restaurante',
      youtubeId: 'b8K1o_y8y5w', // Placeholder public YouTube ID
      subtitles: [
        { start: 0, end: 4, text: "Camarero: ¡Buenas tardes! Bienvenidos al restaurante El Sol." },
        { start: 4, end: 8, text: "Cliente: Hola, buenas tardes. Queremos una mesa para dos personas, por favor." },
        { start: 8, end: 12, text: "Camarero: Muy bien. Síganme por aquí. Aquí tienen la carta del menú." },
        { start: 12, end: 17, text: "Cliente: Muchas gracias. ¿Qué nos recomienda para empezar?" },
        { start: 17, end: 22, text: "Camarero: La sopa de marisco y la paella valenciana son los platos principales hoy." },
        { start: 22, end: 28, text: "Cliente: Perfecto. Para beber, queremos una botella de agua mineral y dos copas de vino tinto." },
        { start: 28, end: 35, text: "Camarero: Excelente elección. En un momento les traigo las bebidas." }
      ]
    };

    let activeContent = { ...SAMPLE_CONTENT };
    let savedMediaList = JSON.parse(localStorage.getItem('lingosync_media')) || [SAMPLE_CONTENT];
    let savedVocabList = JSON.parse(localStorage.getItem('lingosync_vocab')) || [
      { id: 'v1', term: 'camarero', definition: 'waiter, server (restaurant staff)' },
      { id: 'v2', term: 'paella', definition: 'traditional Spanish rice dish with seafood or meat' }
    ];

    let player = null;
    let isYtReady = false;
    let syncTimer = null;
    let autoScrollEnabled = true;
    let selectedWord = '';
    let currentImportType = 'yt';

    // On Page Load
    window.onload = function() {
      updateSavedCounts();
      renderSavedMediaGrid();
      renderVocabTable();
      loadActiveContent(activeContent);
    };

    /* ==========================================
       2. TAB NAVIGATION
       ========================================== */
    function switchTab(tab) {
      document.getElementById('tab-reader').classList.add('hidden');
      document.getElementById('tab-saved').classList.add('hidden');
      document.getElementById('tab-vocab').classList.add('hidden');

      document.getElementById('nav-reader-btn').className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all";
      document.getElementById('nav-saved-btn').className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all";
      document.getElementById('nav-vocab-btn').className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all";

      if (tab === 'reader') {
        document.getElementById('tab-reader').classList.remove('hidden');
        document.getElementById('nav-reader-btn').className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white shadow-md";
      } else if (tab === 'saved') {
        document.getElementById('tab-saved').classList.remove('hidden');
        document.getElementById('nav-saved-btn').className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white shadow-md";
        renderSavedMediaGrid();
      } else if (tab === 'vocab') {
        document.getElementById('tab-vocab').classList.remove('hidden');
        document.getElementById('nav-vocab-btn').className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white shadow-md";
        renderVocabTable();
      }
    }

    /* ==========================================
       3. PLAYER & CONTENT LOADER
       ========================================== */
    function loadActiveContent(content) {
      activeContent = content;
      document.getElementById('current-content-title').innerText = content.title;
      document.getElementById('media-type-badge').innerText = content.type.toUpperCase();
      
      updateSaveMediaBtnState();

      const ytContainer = document.getElementById('yt-player-container');
      const html5Container = document.getElementById('html5-player-container');
      const articleContainer = document.getElementById('article-viewer-container');

      ytContainer.classList.add('hidden');
      html5Container.classList.add('hidden');
      articleContainer.classList.add('hidden');

      if (content.type === 'youtube') {
        ytContainer.classList.remove('hidden');
        initYouTubePlayer(content.youtubeId);
        renderSubtitles(content.subtitles);
        startSubSyncLoop();
      } else if (content.type === 'article') {
        articleContainer.classList.remove('hidden');
        renderArticleContent(content.body);
        renderSubtitles([]); // Empty or summary transcript
        stopSubSyncLoop();
      }
    }

    function onYouTubeIframeAPIReady() {
      isYtReady = true;
      if (activeContent.type === 'youtube') {
        initYouTubePlayer(activeContent.youtubeId);
      }
    }

    function initYouTubePlayer(videoId) {
      if (!isYtReady) return;
      if (player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(videoId);
      } else {
        player = new YT.Player('yt-player', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: { 'autoplay': 0, 'modestbranding': 1, 'rel': 0 },
          events: {
            'onStateChange': onPlayerStateChange
          }
        });
      }
    }

    function onPlayerStateChange(event) {
      if (event.data === YT.PlayerState.PLAYING) {
        startSubSyncLoop();
      } else {
        stopSubSyncLoop();
      }
    }

    /* ==========================================
       4. INTERACTIVE TOKENIZATION & SUBTITLES
       ========================================== */
    function renderSubtitles(subtitles) {
      const container = document.getElementById('subtitles-list');
      container.innerHTML = '';

      if (!subtitles || subtitles.length === 0) {
        container.innerHTML = `<div class="text-center text-slate-500 py-10 text-xs">No timed subtitles loaded for this item.</div>`;
        return;
      }

      subtitles.forEach((sub, index) => {
        const div = document.createElement('div');
        div.id = `sub-line-${index}`;
        div.className = "p-3 rounded-xl border border-slate-800 bg-slate-850/50 hover:bg-slate-800/80 transition-all text-sm leading-relaxed text-slate-300";
        
        // Tokenize text into clickable words
        const tokenizedHTML = tokenizeText(sub.text);
        div.innerHTML = `
          <div class="text-[10px] text-slate-500 font-mono mb-1">${formatTime(sub.start)} - ${formatTime(sub.end)}</div>
          <div>${tokenizedHTML}</div>
        `;

        div.onclick = (e) => {
          if (!e.target.classList.contains('token-word')) {
            seekVideoTo(sub.start);
          }
        };

        container.appendChild(div);
      });
    }

    function renderArticleContent(text) {
      const container = document.getElementById('article-content');
      const paragraphs = text.split('\n').filter(p => p.trim() !== '');
      container.innerHTML = paragraphs.map(p => `<p class="mb-4">${tokenizeText(p)}</p>`).join('');
    }

    // Tokenize text into interactive click-words
    function tokenizeText(text) {
      const words = text.split(/(\s+|[.,!?;:()"])/);
      return words.map(w => {
        if (w.trim().length > 0 && !/^[.,!?;:()"]+$/.test(w)) {
          const cleanWord = w.replace(/['"]/g, '');
          return `<span class="token-word" onclick="handleWordClick(event, '${cleanWord.replace(/'/g, "\\'")}')">${w}</span>`;
        }
        return w;
      }).join('');
    }

    /* Synchronize Active Subtitle Highlight with Video playback */
    function startSubSyncLoop() {
      stopSubSyncLoop();
      syncTimer = setInterval(() => {
        if (player && typeof player.getCurrentTime === 'function' && activeContent.type === 'youtube') {
          const currentTime = player.getCurrentTime();
          const duration = player.getDuration() || 0;
          document.getElementById('player-time-display').innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;

          highlightActiveSubtitle(currentTime);
        }
      }, 250);
    }

    function stopSubSyncLoop() {
      if (syncTimer) clearInterval(syncTimer);
    }

    function highlightActiveSubtitle(currentTime) {
      if (!activeContent.subtitles) return;
      activeContent.subtitles.forEach((sub, i) => {
        const el = document.getElementById(`sub-line-${i}`);
        if (el) {
          if (currentTime >= sub.start && currentTime <= sub.end) {
            if (!el.classList.contains('active-subtitle')) {
              // Remove active from others
              document.querySelectorAll('.active-subtitle').forEach(item => item.classList.remove('active-subtitle'));
              el.classList.add('active-subtitle');

              // Auto-scroll subtitle container
              if (autoScrollEnabled) {
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
          }
        }
      });
    }

    function seekVideoTo(seconds) {
      if (player && typeof player.seekTo === 'function') {
        player.seekTo(seconds, true);
        player.playVideo();
      }
    }

    function toggleAutoScroll() {
      autoScrollEnabled = !autoScrollEnabled;
      const btn = document.getElementById('autoscroll-toggle');
      btn.innerHTML = `<i class="fa-solid fa-arrows-up-down"></i> Auto-Scroll: ${autoScrollEnabled ? 'On' : 'Off'}`;
      btn.className = autoScrollEnabled 
        ? "text-xs px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center gap-1"
        : "text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1";
    }

    /* ==========================================
       5. POPUP DICTIONARY & CONTEXT MENU
       ========================================== */
    function handleWordClick(event, word) {
      event.stopPropagation();
      selectedWord = word;
      const dictLang = document.getElementById('wr-dict-select').value;

      document.getElementById('selected-word-title').innerText = word;
      
      // Update Context Links
      document.getElementById('btn-search-google').href = `https://www.google.com/search?q=${encodeURIComponent(word)}`;
      document.getElementById('btn-search-images').href = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(word)}`;
      document.getElementById('btn-search-wr').href = `https://www.wordreference.com/${dictLang}/${encodeURIComponent(word)}`;

      // Position Context Menu
      const menu = document.getElementById('context-menu');
      menu.classList.remove('hidden');

      let x = event.clientX;
      let y = event.clientY + 10;
      if (x + 280 > window.innerWidth) x = window.innerWidth - 290;
      if (y + 200 > window.innerHeight) y = event.clientY - 190;

      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
    }

    function closeContextMenu() {
      document.getElementById('context-menu').classList.add('hidden');
    }

    document.addEventListener('click', (e) => {
      const menu = document.getElementById('context-menu');
      if (!menu.contains(e.target)) {
        closeContextMenu();
      }
    });

    /* ==========================================
       6. VOCABULARY SAVING & CSV EXPORT
       ========================================== */
    function openAddVocabModal() {
      closeContextMenu();
      document.getElementById('modal-vocab-term').value = selectedWord;
      document.getElementById('modal-vocab-def').value = '';
      document.getElementById('vocab-modal').classList.remove('hidden');
    }

    function closeVocabModal() {
      document.getElementById('vocab-modal').classList.add('hidden');
    }

    function confirmSaveVocab() {
      const term = document.getElementById('modal-vocab-term').value.trim();
      const def = document.getElementById('modal-vocab-def').value.trim();

      if (!term) return;

      savedVocabList.push({
        id: 'v_' + Date.now(),
        term: term,
        definition: def || 'Definition requested on WordReference'
      });

      localStorage.setItem('lingosync_vocab', JSON.stringify(savedVocabList));
      updateSavedCounts();
      renderVocabTable();
      closeVocabModal();
    }

    function deleteVocabItem(id) {
      savedVocabList = savedVocabList.filter(item => item.id !== id);
      localStorage.setItem('lingosync_vocab', JSON.stringify(savedVocabList));
      updateSavedCounts();
      renderVocabTable();
    }

    function renderVocabTable() {
      const tbody = document.getElementById('vocab-table-body');
      const emptyMsg = document.getElementById('vocab-empty-msg');
      tbody.innerHTML = '';

      if (savedVocabList.length === 0) {
        emptyMsg.classList.remove('hidden');
        return;
      }
      emptyMsg.classList.add('hidden');

      savedVocabList.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-800/40 transition-colors";
        tr.innerHTML = `
          <td class="p-4 font-semibold text-blue-400">${escapeHTML(item.term)}</td>
          <td class="p-4 text-slate-300">${escapeHTML(item.definition)}</td>
          <td class="p-4 text-right">
            <button onclick="deleteVocabItem('${item.id}')" class="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 rounded border border-red-500/20">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function exportVocabCSV() {
      if (savedVocabList.length === 0) {
        alert('Vocabulary list is empty. Add terms before exporting!');
        return;
      }

      let csvContent = "data:text/csv;charset=utf-8,Vocabulary,Definition\n";
      savedVocabList.forEach(item => {
        const termClean = `"${item.term.replace(/"/g, '""')}"`;
        const defClean = `"${item.definition.replace(/"/g, '""')}"`;
        csvContent += `${termClean},${defClean}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `LingoSync_Vocabulary_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    /* ==========================================
       7. SAVED MEDIA MANAGEMENT
       ========================================== */
    function toggleSaveCurrentMedia() {
      const exists = savedMediaList.some(m => m.id === activeContent.id);
      if (exists) {
        savedMediaList = savedMediaList.filter(m => m.id !== activeContent.id);
      } else {
        savedMediaList.push(activeContent);
      }
      localStorage.setItem('lingosync_media', JSON.stringify(savedMediaList));
      updateSavedCounts();
      updateSaveMediaBtnState();
      renderSavedMediaGrid();
    }

    function updateSaveMediaBtnState() {
      const exists = savedMediaList.some(m => m.id === activeContent.id);
      const icon = document.getElementById('save-media-icon');
      const text = document.getElementById('save-media-text');

      if (exists) {
        icon.className = "fa-solid fa-bookmark text-blue-400";
        text.innerText = "Saved";
      } else {
        icon.className = "fa-regular fa-bookmark";
        text.innerText = "Save Media";
      }
    }

    function renderSavedMediaGrid() {
      const grid = document.getElementById('saved-media-grid');
      grid.innerHTML = '';

      if (savedMediaList.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center text-slate-500 py-12">No saved media. Import a video or article to save it for later viewing!</div>`;
        return;
      }

      savedMediaList.forEach(item => {
        const div = document.createElement('div');
        div.className = "bg-slate-800/80 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-600 transition-all shadow-lg";
        div.innerHTML = `
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">${item.type}</span>
            </div>
            <h4 class="font-semibold text-sm text-slate-200 line-clamp-2">${escapeHTML(item.title)}</h4>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <button onclick="loadAndPlaySavedItem('${item.id}')" class="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
              <i class="fa-solid fa-play"></i> Open Viewer
            </button>
            <button onclick="deleteSavedMedia('${item.id}')" class="text-xs text-red-400 hover:text-red-300 p-1.5">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        `;
        grid.appendChild(div);
      });
    }

    function loadAndPlaySavedItem(id) {
      const item = savedMediaList.find(m => m.id === id);
      if (item) {
        switchTab('reader');
        loadActiveContent(item);
      }
    }

    function deleteSavedMedia(id) {
      savedMediaList = savedMediaList.filter(m => m.id !== id);
      localStorage.setItem('lingosync_media', JSON.stringify(savedMediaList));
      updateSavedCounts();
      renderSavedMediaGrid();
      updateSaveMediaBtnState();
    }

    function updateSavedCounts() {
      document.getElementById('saved-media-count').innerText = savedMediaList.length;
      document.getElementById('saved-vocab-count').innerText = savedVocabList.length;
    }

    /* ==========================================
       8. IMPORT CONTENT MODAL & PROCESSING
       ========================================== */
    function openImportModal() {
      document.getElementById('import-modal').classList.remove('hidden');
    }

    function closeImportModal() {
      document.getElementById('import-modal').classList.add('hidden');
    }

    function setImportType(type) {
      currentImportType = type;
      if (type === 'yt') {
        document.getElementById('import-type-yt').className = "flex-1 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white";
        document.getElementById('import-type-article').className = "flex-1 py-1.5 text-xs font-semibold text-slate-400 rounded-lg";
        document.getElementById('import-form-yt').classList.remove('hidden');
        document.getElementById('import-form-article').classList.add('hidden');
      } else {
        document.getElementById('import-type-yt').className = "flex-1 py-1.5 text-xs font-semibold text-slate-400 rounded-lg";
        document.getElementById('import-type-article').className = "flex-1 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg";
        document.getElementById('import-form-yt').classList.add('hidden');
        document.getElementById('import-form-article').classList.remove('hidden');
      }
    }

    function processImportContent() {
      if (currentImportType === 'yt') {
        const urlInput = document.getElementById('import-yt-url').value.trim();
        const subsRaw = document.getElementById('import-yt-subs').value.trim();

        if (!urlInput) {
          alert('Please enter a valid YouTube URL or Video ID');
          return;
        }

        const ytId = extractYouTubeId(urlInput);
        if (!ytId) {
          alert('Invalid YouTube URL or Video ID format');
          return;
        }

        const parsedSubs = parseSubtitlesText(subsRaw);

        const newMedia = {
          id: 'yt_' + Date.now(),
          type: 'youtube',
          title: `YouTube Video (${ytId})`,
          youtubeId: ytId,
          subtitles: parsedSubs
        };

        savedMediaList.push(newMedia);
        localStorage.setItem('lingosync_media', JSON.stringify(savedMediaList));
        updateSavedCounts();
        closeImportModal();
        switchTab('reader');
        loadActiveContent(newMedia);

      } else {
        const title = document.getElementById('import-article-title').value.trim() || 'Untitled Article';
        const body = document.getElementById('import-article-body').value.trim();

        if (!body) {
          alert('Please paste or type article text');
          return;
        }

        const newArticle = {
          id: 'art_' + Date.now(),
          type: 'article',
          title: title,
          body: body,
          subtitles: []
        };

        savedMediaList.push(newArticle);
        localStorage.setItem('lingosync_media', JSON.stringify(savedMediaList));
        updateSavedCounts();
        closeImportModal();
        switchTab('reader');
        loadActiveContent(newArticle);
      }
    }

    function extractYouTubeId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : url;
    }

    /* Simple Subtitle Parser (SRT or Fallback Synthetic Timings) */
    function parseSubtitlesText(rawText) {
      if (!rawText) {
        // Fallback placeholder timed subtitles for demonstration
        return [
          { start: 0, end: 5, text: "Automated subtitle timestamp generated for imported video." },
          { start: 5, end: 10, text: "Click any word to view definitions on WordReference." }
        ];
      }

      const lines = rawText.split('\n');
      const subs = [];
      let currentSub = null;

      lines.forEach(line => {
        const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}|\d{2}:\d{2}).*?-->.*?(\d{2}:\d{2}:\d{2}|\d{2}:\d{2})/);
        if (timeMatch) {
          if (currentSub && currentSub.text) subs.push(currentSub);
          currentSub = {
            start: parseTimeToSeconds(timeMatch[1]),
            end: parseTimeToSeconds(timeMatch[2]),
            text: ''
          };
        } else if (currentSub && line.trim() !== '' && !/^\d+$/.test(line.trim())) {
          currentSub.text += (currentSub.text ? ' ' : '') + line.trim();
        }
      });

      if (currentSub && currentSub.text) subs.push(currentSub);

      return subs.length > 0 ? subs : [
        { start: 0, end: 10, text: rawText.slice(0, 150) }
      ];
    }

    /* ==========================================
       9. UTILITY FUNCTIONS
       ========================================== */
    function parseTimeToSeconds(timeStr) {
      const parts = timeStr.split(':').map(parseFloat);
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      if (parts.length === 2) return parts[0] * 60 + parts[1];
      return 0;
    }

    function formatTime(seconds) {
      const sec = Math.floor(seconds || 0);
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    }
  </script>
</body>
</html>
