// ---------- ДАННЫЕ (добавлено поле duration) ----------
const VIDEOS = [
  { id: 1, title: 'Полночный бархат', cat: 'Романтика', studio: 'Velvet Studio', actors: ['Анна С.', 'Дмитрий К.'], desc: 'Изысканная история о тайной встрече.', date: '2026-10-25', views: 15000, likes: 1200, duration: '15:20' },
  { id: 2, title: 'Красный шёлк', cat: 'Романтика', studio: 'Red Light Films', actors: ['Елена В.', 'Максим Р.'], desc: 'Страсть, которая вспыхивает с первого касания.', date: '2026-10-24', views: 25000, likes: 3400, duration: '22:15' },
  { id: 3, title: 'Тайная встреча', cat: 'Драма', studio: 'Noir Pictures', actors: ['Ольга М.', 'Игорь Л.'], desc: 'За фасадом идеального мужа скрывается нечто большее.', date: '2026-10-20', views: 120000, likes: 8000, duration: '18:40' },
  { id: 4, title: 'Ночной экспресс', cat: 'Драма', studio: 'Cinema Adult', actors: ['Светлана П.', 'Андрей Н.'], desc: 'Поезд мчится сквозь тьму, а в купе разгорается буря.', date: '2026-09-15', views: 340000, likes: 25000, duration: '35:10' },
  { id: 5, title: 'Огни Парижа', cat: 'Классика', studio: 'Paris Nuit', actors: ['Софи Д.', 'Жан П.'], desc: 'Классическая французская эстетика.', date: '2026-08-10', views: 500000, likes: 45000, duration: '28:05' },
  { id: 6, title: 'Искушение', cat: 'Классика', studio: 'Velvet Studio', actors: ['Мария Т.', 'Александр Б.'], desc: 'Искушение, которому так сложно сопротивляться.', date: '2026-07-01', views: 800000, likes: 67000, duration: '19:30' },
  { id: 7, title: 'После полуночи', cat: 'Триллер', studio: 'Dark Frame', actors: ['Виктория С.', 'Павел Г.'], desc: 'Опасная игра начинается.', date: '2026-10-23', views: 5000, likes: 400, duration: '12:45' },
  { id: 8, title: 'Тёмная сторона', cat: 'Триллер', studio: 'Noir Pictures', actors: ['Ксения А.', 'Роман Ф.'], desc: 'Некоторые секреты лучше оставить в темноте.', date: '2025-12-01', views: 1200000, likes: 110000, duration: '45:00' },
  { id: 9, title: 'Бархатный сезон', cat: 'Романтика', studio: 'Velvet Studio', actors: ['Алиса Н.', 'Егор Д.'], desc: 'Солнце, море и бесконечное лето.', date: '2026-06-15', views: 45000, likes: 3200, duration: '21:10' },
  { id: 10, title: 'Шёпот в темноте', cat: 'Триллер', studio: 'Dark Frame', actors: ['Татьяна Л.', 'Сергей В.'], desc: 'Она слышит его каждую ночь.', date: '2026-10-18', views: 18000, likes: 1500, duration: '16:50' },
  { id: 11, title: 'Золотая клетка', cat: 'Драма', studio: 'Golden Films', actors: ['Наталья Р.', 'Владимир О.'], desc: 'История о выборе между комфортом и свободой.', date: '2026-02-20', views: 670000, likes: 55000, duration: '31:20' },
  { id: 12, title: 'Взгляд', cat: 'Классика', studio: 'Paris Nuit', actors: ['Изабель К.', 'Луи М.'], desc: 'Встреча, которая меняет всё.', date: '2024-11-05', views: 2000000, likes: 180000, duration: '14:15' },
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
let allComments = store.get('comments', {}); // { videoId: [ {author, text, date} ] }
let currentVideoId = null;

let topTime = 'all';
let viewsTime = 'all';

// ---------- ВРЕМЯ ВЫХОДА (относительное) ----------
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'сегодня';
  if (diffDays === 1) return 'вчера';
  
  // Правильное склонение для дней
  if (diffDays > 1 && diffDays < 5) return `${diffDays} дня назад`;
  if (diffDays >= 5 && diffDays < 21) return `${diffDays} дней назад`;
  
  // Если больше 21 дня, показываем точную дату
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('ru-RU', options);
}

// ---------- НАВИГАЦИЯ ----------
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  
  if (name === 'favorites') renderFavorites();
  if (name === 'profile')   renderProfile();
  if (name === 'top')       renderTop();
  if (name === 'views')     renderViews();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- ССЫЛКИ И ОТКРЫТИЕ ВИДЕО ----------
function openVideoPage(id) {
  const v = VIDEOS.find(x => x.id === id);
  if (!v) return;

  currentVideoId = id;
  window.location.hash = 'video-' + id;

  videoViews[id] = (videoViews[id] || 0) + 1;
  store.set('videoViews', videoViews);

  // Заполняем данные
  document.getElementById('videoTitle').textContent = v.title;
  document.getElementById('videoDesc').textContent = v.desc;
  document.getElementById('videoStudio').textContent = v.studio;
  document.getElementById('studioAvatar').textContent = v.studio.charAt(0).toUpperCase();
  document.getElementById('videoDuration').textContent = v.duration;
  
  const totalViews = v.views + (videoViews[id] || 0);
  document.getElementById('videoViewsText').textContent = `${totalViews.toLocaleString('ru-RU')} просмотров · ${timeAgo(v.date)}`;

  const actorsList = document.getElementById('videoActorsList');
  actorsList.innerHTML = v.actors.map(a => `<li>${a}</li>`).join('');

  // Рендерим комментарии
  renderComments();

  // Рендерим похожие видео (по категории)
  const similar = VIDEOS.filter(item => item.cat === v.cat && item.id !== v.id).slice(0, 4);
  document.getElementById('similarGrid').innerHTML = similar.length > 0 
    ? similar.map(item => cardHTML(item)).join('') 
    : '<p class="empty">Похожих видео пока нет</p>';

  updateVideoPageButtons();
  showPage('video');
}

function goBack() {
  window.history.pushState("", document.title, window.location.pathname + window.location.search);
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

// ---------- КОММЕНТАРИИ ----------
function renderComments() {
  const list = document.getElementById('commentsList');
  const title =
