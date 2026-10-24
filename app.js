// ---------- ДАННЫЕ ----------
const VIDEOS = [
  { id: 1, title: 'Полночный бархат', cat: 'Романтика', studio: 'Velvet Studio', actors: ['Анна С.', 'Дмитрий К.'], desc: 'Изысканная история о тайной встрече.', date: '2026-10-25', views: 15000, likes: 1200, duration: '15:20', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, title: 'Красный шёлк', cat: 'Романтика', studio: 'Red Light Films', actors: ['Елена В.', 'Максим Р.'], desc: 'Страсть, которая вспыхивает с первого касания.', date: '2026-10-24', views: 25000, likes: 3400, duration: '22:15', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 3, title: 'Тайная встреча', cat: 'Драма', studio: 'Noir Pictures', actors: ['Ольга М.', 'Игорь Л.'], desc: 'За фасадом идеального мужа скрывается нечто большее.', date: '2026-10-20', views: 120000, likes: 8000, duration: '18:40', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 4, title: 'Ночной экспресс', cat: 'Драма', studio: 'Cinema Adult', actors: ['Светлана П.', 'Андрей Н.'], desc: 'Поезд мчится сквозь тьму, а в купе разгорается буря.', date: '2026-09-15', views: 340000, likes: 25000, duration: '35:10', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 5, title: 'Огни Парижа', cat: 'Классика', studio: 'Paris Nuit', actors: ['Софи Д.', 'Жан П.'], desc: 'Классическая французская эстетика.', date: '2026-08-10', views: 500000, likes: 45000, duration: '28:05', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 6, title: 'Искушение', cat: 'Классика', studio: 'Velvet Studio', actors: ['Мария Т.', 'Александр Б.'], desc: 'Искушение, которому так сложно сопротивляться.', date: '2026-07-01', views: 800000, likes: 67000, duration: '19:30', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 7, title: 'После полуночи', cat: 'Триллер', studio: 'Dark Frame', actors: ['Виктория С.', 'Павел Г.'], desc: 'Опасная игра начинается.', date: '2026-10-23', views: 5000, likes: 400, duration: '12:45', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 8, title: 'Тёмная сторона', cat: 'Триллер', studio: 'Noir Pictures', actors: ['Ксения А.', 'Роман Ф.'], desc: 'Некоторые секреты лучше оставить в темноте.', date: '2025-12-01', views: 1200000, likes: 110000, duration: '45:00', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 9, title: 'Бархатный сезон', cat: 'Романтика', studio: 'Velvet Studio', actors: ['Алиса Н.', 'Егор Д.'], desc: 'Солнце, море и бесконечное лето.', date: '2026-06-15', views: 45000, likes: 3200, duration: '21:10', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 10, title: 'Шёпот в темноте', cat: 'Триллер', studio: 'Dark Frame', actors: ['Татьяна Л.', 'Сергей В.'], desc: 'Она слышит его каждую ночь.', date: '2026-10-18', views: 18000, likes: 1500, duration: '16:50', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 11, title: 'Золотая клетка', cat: 'Драма', studio: 'Golden Films', actors: ['Наталья Р.', 'Владимир О.'], desc: 'История о выборе между комфортом и свободой.', date: '2026-02-20', views: 670000, likes: 55000, duration: '31:20', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 12, title: 'Взгляд', cat: 'Классика', studio: 'Paris Nuit', actors: ['Изабель К.', 'Луи М.'], desc: 'Встреча, которая меняет всё.', date: '2024-11-05', views: 2000000, likes: 180000, duration: '14:15', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

const CATEGORIES = ['Все', 'Романтика', 'Драма', 'Классика', 'Триллер'];

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem('velvet_' + key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, val) { localStorage.setItem('velvet_' + key, JSON.stringify(val)); }
};

let videoViews = store.get('videoViews', {});
let currentCat = 'Все';
let favorites   = store.get('favorites', []);
let profile     = store.get('profile', { name: '', actors: [] });
let ratings     = store.get('ratings', {});
let allComments = store.get('comments', {});
let currentVideoId = null;

let sortMode = 'all'; 
let timeFilter = 'all';

// ---------- ВРЕМЯ ВЫХОДА ----------
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'сегодня';
  if (diffDays === 1) return 'вчера';
  if (diffDays > 1 && diffDays < 5) return `${diffDays} дня назад`;
  if (diffDays >= 5 && diffDays < 21) return `${diffDays} дней назад`;
  
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('ru-RU', options);
}

// ---------- НАВИГАЦИЯ ----------
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  
  if (name === 'favorites') renderFavorites();
  if (name === 'profile')   renderProfile();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- МОДАЛЬНОЕ ОКНО КАТЕГОРИЙ ----------
function openCategoriesModal() {
  const grid = document.getElementById('catGridModal');
  const catsToShow = CATEGORIES.filter(c => c !== 'Все');
  
  grid.innerHTML = catsToShow.map(c => `
    <div class="cat-card cat-bg-${c}" onclick="selectCategoryFromModal('${c}')">
      <span>${c}</span>
    </div>
  `).join('');

  document.getElementById('categoriesModal').classList.add('active');
}

function closeCategoriesModal() {
  document.getElementById('categoriesModal').classList.remove('active');
}

function selectCategoryFromModal(cat) {
  currentCat = cat;
  closeCategoriesModal();
  setSortMode('all');
  renderCatalog();
}

window.addEventListener('click', function(e) {
  const modal = document.getElementById('categoriesModal');
  if (e.target === modal) closeCategoriesModal();
});

// ---------- ВЫПАДАЮЩЕЕ МЕНЮ ВРЕМЕНИ ----------
function toggleDropdown() {
  document.getElementById('timeDropdown').classList.toggle('open');
}

window.addEventListener('click', function(e) {
  const dropdown = document.getElementById('timeDropdown');
  if (dropdown && !dropdown.contains(e.target)) dropdown.classList.remove('open');
});

function setTimeFilter(time) {
  timeFilter = time;
  const labels = { 'all': 'За всё время', 'month': 'За месяц', 'week': 'За неделю', 'today': 'За сегодня' };
  document.getElementById('timeLabel').textContent = labels[time];
  document.getElementById('timeDropdown').classList.remove('open');
  renderCatalog();
}

// ---------- СОРТИРОВКА ----------
function setSortMode(mode) {
  sortMode = mode;
  document.querySelectorAll('.sort-tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById('tab-' + mode).classList.add('active');

  const dropdown = document.getElementById('timeDropdown');
  dropdown.style.display = (mode === 'all') ? 'none' : 'block';

  renderCatalog();
}

function isDateInPeriod(dateStr, period) {
  if (period === 'all') return true;
  const videoDate = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - videoDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (period === 'today') return diffDays <= 1;
  if (period === 'week') return diffDays <= 7;
  if (period === 'month') return diffDays <= 30;
  return true;
}

// ---------- РЕНДЕР КАТАЛОГА ----------
function renderCatalog() {
  const grid  = document.getElementById('grid');
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const empty = document.getElementById('emptyMsg');

  let list = VIDEOS;

  if (currentCat !== 'Все') list = list.filter(v => v.cat === currentCat);
  if (query) list = list.filter(v => v.title.toLowerCase().includes(query));

  if (sortMode === 'top' || sortMode === 'views') {
    list = list.filter(v => isDateInPeriod(v.date, timeFilter));
    
    if (sortMode === 'top') {
      list.sort((a, b) => b.likes - a.likes);
    } else if (sortMode === 'views') {
      list.sort((a, b) => (b.views + (videoViews[b.id] || 0)) - (a.views + (videoViews[a.id] || 0)));
    }
  }

  if (!list.length) { grid.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  grid.innerHTML = list.map(v => cardHTML(v)).join('');
}

// ---------- КАРТОЧКА ----------
function cardHTML(v) {
  const isFav = favorites.includes(v.id);
  const userRating = ratings[v.id] || null;
  const totalViews = v.views + (videoViews[v.id] || 0);
  
  return `
    <div class="card" onclick="openVideoPage(${v.id})">
      <div class="card-cover">
        <button class="fav-btn-float ${isFav ? 'active-fav' : ''}" onclick="event.stopPropagation(); toggleFav(${v.id})">
          ${isFav ? '❤️' : '🤍'}
        </button>
        Обложка
        <div class="duration-badge">${v.duration}</div>
      </div>
      <div class="card-body">
        <div class="card-title">${v.title}</div>
        <div class="card-cat">${v.cat}</div>
        <div class="card-meta">
          <span>${totalViews.toLocaleString('ru-RU')} просмотров</span>
          <span>${timeAgo(v.date)}</span>
        </div>
        <div class="card-actions" onclick="event.stopPropagation()">
          <button class="action-btn ${userRating === 'like' ? 'active-like' : ''}" onclick="toggleRating(${v.id}, 'like')">👍</button>
          <button class="action-btn ${userRating === 'dislike' ? 'active-dislike' : ''}" onclick="toggleRating(${v.id}, 'dislike')">👎</button>
        </div>
      </div>
    </div>
  `;
}

// ---------- СТРАНИЦА ВИДЕО ----------
function openVideoPage(id) {
  const v = VIDEOS.find(x => x.id === id);
  if (!v) return;

  currentVideoId = id;
  window.location.hash = 'video-' + id;

  videoViews[id] = (videoViews[id] || 0) + 1;
  store.set('videoViews', videoViews);

  // Устанавливаем видео в плеер
  const player = document.getElementById('videoPlayer');
  player.src = v.videoUrl; 
  player.poster = `https://via.placeholder.com/1280x720/1A1A1F/C8102E?text=${encodeURIComponent(v.title)}`;
  player.load(); // Сбрасываем плеер для нового видео
  
  // Сбрасываем состояние плеера
  document.getElementById('centerPlayBtn').classList.remove('hidden');
  document.getElementById('playPauseBtn').textContent = '▶';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('currentTime').textContent = '0:00';

  document.getElementById('videoTitle').textContent = v.title;
  document.getElementById('videoDesc').textContent = v.desc;
  document.getElementById('videoStudio').textContent = v.studio;
  document.getElementById('studioAvatar').textContent = v.studio.charAt(0).toUpperCase();
  
  const totalViews = v.views + (videoViews[id] || 0);
  document.getElementById('videoViewsText').textContent = `${totalViews.toLocaleString('ru-RU')} просмотров · ${timeAgo(v.date)}`;

  const actorsList = document.getElementById('videoActorsList');
  actorsList.innerHTML = v.actors.map(a => `<li>${a}</li>`).join('');

  renderComments();

  const similar = VIDEOS.filter(item => item.cat === v.cat && item.id !== v.id).slice(0, 4);
  document.getElementById('similarGrid').innerHTML = similar.length > 0 
    ? similar.map(item => cardHTML(item)).join('') 
    : '<p class="empty">Похожих видео пока нет</p>';

  updateVideoPageButtons();
  showPage('video');
}

function goBack() {
  window.history.pushState("", document.title, window.location.pathname + window.location.search);
  // Пауза видео при выходе
  const player = document.getElementById('videoPlayer');
  if (player) player.pause();
  showPage('home');
}

function checkHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#video-')) {
    const id = parseInt(hash.replace('#video-', ''));
    if (!isNaN(id)) openVideoPage(id);
  }
}
window.addEventListener('hashchange', checkHash);

// =========================================================
// ---------- ЛОГИКА КАСТОМНОГО ПЛЕЕРА ----------
// =========================================================

const video = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const centerPlayBtn = document.getElementById('centerPlayBtn');
const progressFill = document.getElementById('progressFill');
const progressBarWrap = document.querySelector('.progress-bar-wrap');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const playerContainer = document.getElementById('playerContainer');

// Форматирование времени (например, 125 сек -> 2:05)
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Play / Pause
function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

video.addEventListener('play', () => {
  playPauseBtn.textContent = '⏸';
  centerPlayBtn.classList.add('hidden');
});

video.addEventListener('pause', () => {
  playPauseBtn.textContent = '▶';
  centerPlayBtn.classList.remove('hidden');
});

// Обновление прогресс-бара и времени
video.addEventListener('timeupdate', () => {
  const percent = (video.currentTime / video.duration) * 100;
  progressFill.style.width = percent + '%';
  currentTimeEl.textContent = formatTime(video.currentTime);
});

video.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(video.duration);
});

// Клик по прогресс-бару
function seekVideo(e) {
  const rect = progressBarWrap.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  video.currentTime = pos * video.duration;
}

// Перемотка на 10 секунд
function skipTime(seconds) {
  video.currentTime += seconds;
}

// Громкость
function changeVolume(val) {
  video.volume = val;
  video.muted = (val == 0);
  updateMuteIcon();
}

function toggleMute() {
  video.muted = !video.muted;
  updateMuteIcon();
}

function updateMuteIcon() {
  if (video.muted || video.volume === 0) {
    muteBtn.textContent = '🔇';
    volumeSlider.value = 0;
  } else {
    muteBtn.textContent = '🔊';
    volumeSlider.value = video.volume;
  }
}

// Фуллскрин
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (playerContainer.requestFullscreen) {
      playerContainer.requestFullscreen();
    } else if (playerContainer.webkitRequestFullscreen) {
      playerContainer.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Показ контролов на мобилках при клике
playerContainer.addEventListener('click', (e) => {
  // Если кликнули не по кнопкам и не по прогресс-бару
  if (e.target === video || e.target === playerContainer) {
    playerContainer.classList.toggle('show-controls');
  }
});

// ---------- КОММЕНТАРИИ ----------
function renderComments() {
  const list = document.getElementById('commentsList');
  const title = document.getElementById('commentsTitle');
  const comments = allComments[currentVideoId] || [];
  title.textContent = `Комментарии (${comments.length})`;

  if (comments.length === 0) {
    list.innerHTML = '<p style="color: var(--muted); font-size: 14px;">Пока нет комментариев. Будь первым!</p>';
    return;
  }

  list.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-avatar">${c.author.charAt(0).toUpperCase()}</div>
      <div class="comment-body">
        <div class="comment-author">${c.author}</div>
        <div class="comment-text">${c.text}</div>
        <div class="comment-date">${timeAgo(c.date)}</div>
      </div>
    </div>
  `).join('');
}

function addComment() {
  const input = document.getElementById('commentInput');
  const text = input.value.trim();
  if (!text) return;

  const authorName = profile.name || 'Гость';
  if (!allComments[currentVideoId]) allComments[currentVideoId] = [];
  
  allComments[currentVideoId].unshift({
    author: authorName,
    text: text,
    date: new Date().toISOString().split('T')[0]
  });

  store.set('comments', allComments);
  input.value = '';
  renderComments();
}

// ---------- ОЦЕНКИ И ИЗБРАННОЕ ----------
function toggleRating(id, type) {
  if (ratings[id] === type) delete ratings[id];
  else ratings[id] = type;
  store.set('ratings', ratings);
  
  renderCatalog(); 
  if (currentVideoId === id) updateVideoPageButtons();
  if (document.getElementById('page-favorites').classList.contains('active')) renderFavorites();
}

function toggleFav(id) {
  const i = favorites.indexOf(id);
  if (i === -1) favorites.push(id);
  else favorites.splice(i, 1);
  store.set('favorites', favorites);
  
  updateFavCount();
  renderCatalog();
  if (currentVideoId === id) updateVideoPageButtons();
  if (document.getElementById('page-favorites').classList.contains('active')) renderFavorites();
}

function toggleRatingFromPage(type) { toggleRating(currentVideoId, type); }
function toggleFavFromPage() { toggleFav(currentVideoId); }

function updateVideoPageButtons() {
  if (!currentVideoId) return;
  const isFav = favorites.includes(currentVideoId);
  const userRating = ratings[currentVideoId] || null;

  document.getElementById('videoLikeBtn').className = 'action-btn ' + (userRating === 'like' ? 'active-like' : '');
  document.getElementById('videoDislikeBtn').className = 'action-btn ' + (userRating === 'dislike' ? 'active-dislike' : '');
  document.getElementById('videoFavBtn').className = 'action-btn ' + (isFav ? 'active-fav' : '');
  document.getElementById('videoFavBtn').textContent = isFav ? '❤️ В избранном' : '🤍 В избранное';
}

function updateFavCount() {
  document.getElementById('favCount').textContent = favorites.length;
}

function renderFavorites() {
  const grid  = document.getElementById('favGrid');
  const empty = document.getElementById('favEmpty');
  const list  = VIDEOS.filter(v => favorites.includes(v.id));
  if (!list.length) { grid.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  grid.innerHTML = list.map(v => cardHTML(v)).join('');
}

function playRandom() {
  const randomIndex = Math.floor(Math.random() * VIDEOS.length);
  openVideoPage(VIDEOS[randomIndex].id);
}

// ---------- ПРОФИЛЬ ----------
function renderProfile() {
  document.getElementById('username').value = profile.name || '';
  document.getElementById('avatar').textContent = (profile.name || '?').charAt(0).toUpperCase();

  const actorsList = document.getElementById('actorsList');
  actorsList.innerHTML = profile.actors.map((a, i) =>
    `<li>${a} <span onclick="removeActor(${i})">✕</span></li>`
  ).join('');

  const ratingsList = document.getElementById('ratingsList');
  const entries = Object.entries(ratings);
  if (!entries.length) { ratingsList.innerHTML = '<p class="empty">Пока нет оценок</p>'; return; }
  
  ratingsList.innerHTML = entries.map(([id, val]) => {
    const v = VIDEOS.find(x => x.id == id);
    if (!v) return '';
    const icon = val === 'like' ? '<span class="rating-like">👍 Нравится</span>' : '<span class="rating-dislike">👎 Не нравится</span>';
    return `<div class="rating-row"><span>${v.title}</span>${icon}</div>`;
  }).join('');
}

function saveProfile() {
  profile.name = document.getElementById('username').value.trim();
  store.set('profile', profile);
  renderProfile();
}

function addActor() {
  const input = document.getElementById('actorInput');
  const name = input.value.trim();
  if (!name || profile.actors.includes(name)) return;
  profile.actors.push(name);
  store.set('profile', profile);
  input.value = '';
  renderProfile();
}

function removeActor(i) {
  profile.actors.splice(i, 1);
  store.set('profile', profile);
  renderProfile();
}

// ---------- СТАРТ ----------
renderCatalog();
updateFavCount();
checkHash();
