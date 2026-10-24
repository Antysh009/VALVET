// ---------- ДАННЫЕ (Обновленные: добавлены студии и актёры) ----------
const VIDEOS = [
  { id: 1, title: 'Полночный бархат', cat: 'Романтика', studio: 'Velvet Studio', actors: ['Анна С.', 'Дмитрий К.'], desc: 'Изысканная история о тайной встрече в самом сердце ночного города. Бархат, свечи и недолгие взгляды.' },
  { id: 2, title: 'Красный шёлк', cat: 'Романтика', studio: 'Red Light Films', actors: ['Елена В.', 'Максим Р.'], desc: 'Страсть, которая вспыхивает с первого касания шёлковой ткани. История о запретном влечении.' },
  { id: 3, title: 'Тайная встреча', cat: 'Драма', studio: 'Noir Pictures', actors: ['Ольга М.', 'Игорь Л.'], desc: 'Она думала, что знает его. Но за фасадом идеального мужа скрывается нечто большее.' },
  { id: 4, title: 'Ночной экспресс', cat: 'Драма', studio: 'Cinema Adult', actors: ['Светлана П.', 'Андрей Н.'], desc: 'Поезд мчится сквозь тьму, а в купе разгорается настоящая буря эмоций. Одна ночь, которая изменит всё.' },
  { id: 5, title: 'Огни Парижа', cat: 'Классика', studio: 'Paris Nuit', actors: ['Софи Д.', 'Жан П.'], desc: 'Классическая французская эстетика. Город любви, кафе на Монмартре и встреча, которую невозможно забыть.' },
  { id: 6, title: 'Искушение', cat: 'Классика', studio: 'Velvet Studio', actors: ['Мария Т.', 'Александр Б.'], desc: 'Когда разум говорит одно, а сердце требует другого. Искушение, которому так сложно сопротивляться.' },
  { id: 7, title: 'После полуночи', cat: 'Триллер', studio: 'Dark Frame', actors: ['Виктория С.', 'Павел Г.'], desc: 'В городе орудует маньяк, но она ищет не спасения, а острых ощущений. Опасная игра начинается.' },
  { id: 8, title: 'Тёмная сторона', cat: 'Триллер', studio: 'Noir Pictures', actors: ['Ксения А.', 'Роман Ф.'], desc: 'Каждый скрывает свои секреты. Но некоторые из них лучше оставить в темноте.' },
  { id: 9, title: 'Бархатный сезон', cat: 'Романтика', studio: 'Velvet Studio', actors: ['Алиса Н.', 'Егор Д.'], desc: 'Курортный роман, который перерастает во что-то большее. Солнце, море и бесконечное лето.' },
  { id: 10, title: 'Шёпот в темноте', cat: 'Триллер', studio: 'Dark Frame', actors: ['Татьяна Л.', 'Сергей В.'], desc: 'Она слышит его каждую ночь. Но когда оборачивается — никого нет. Или есть?' },
  { id: 11, title: 'Золотая клетка', cat: 'Драма', studio: 'Golden Films', actors: ['Наталья Р.', 'Владимир О.'], desc: 'Она живёт в роскоши, но платит за это свободой. История о выборе между комфортом и свободой.' },
  { id: 12, title: 'Взгляд', cat: 'Классика', studio: 'Paris Nuit', actors: ['Изабель К.', 'Луи М.'], desc: 'Иногда достаточно одного взгляда, чтобы понять — это судьба. Встреча, которая меняет всё.' },
];

const CATEGORIES = ['Все', 'Романтика', 'Драма', 'Классика', 'Триллер'];

// ---------- ХРАНИЛИЩЕ ----------
const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem('velvet_' + key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, val) { localStorage.setItem('velvet_' + key, JSON.stringify(val)); }
};

let currentCat = 'Все';
let favorites   = store.get('favorites', []);
let profile     = store.get('profile', { name: '', actors: [] });
let ratings     = store.get('ratings', {});
let currentVideoId = null;

// ---------- НАВИГАЦИЯ ----------
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  
  if (name === 'favorites') renderFavorites();
  if (name === 'profile')   renderProfile();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- СИСТЕМА ССЫЛОК (#video-3) ----------
function openVideoPage(id) {
  const v = VIDEOS.find(x => x.id === id);
  if (!v) return;

  currentVideoId = id;
  
  // Меняем URL в браузере (добавляем #video-3)
  window.location.hash = 'video-' + id;

  // Заполняем страницу данными
  document.getElementById('videoTitle').textContent = v.title;
  document.getElementById('videoDesc').textContent = v.desc;
  document.getElementById('videoStudio').textContent = v.studio;
  document.getElementById('studioAvatar').textContent = v.studio.charAt(0).toUpperCase();

  // Рендерим актёров
  const actorsList = document.getElementById('videoActorsList');
  actorsList.innerHTML = v.actors.map(a => `<li>${a}</li>`).join('');

  // Обновляем кнопки лайков/избранного
  updateVideoPageButtons();

  // Переключаем вкладку на видео
  showPage('video');
}

function goBack() {
  // Очищаем ссылку и возвращаемся на главную
  window.history.pushState("", document.title, window.location.pathname + window.location.search);
  showPage('home');
}

// Проверяем ссылку при загрузке страницы
function checkHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#video-')) {
    const id = parseInt(hash.replace('#video-', ''));
    if (!isNaN(id)) openVideoPage(id);
  }
}
window.addEventListener('hashchange', checkHash);

// ---------- КАТЕГОРИИ И КАТАЛОГ ----------
function renderCategories() {
  const box = document.getElementById('categories');
  box.innerHTML = CATEGORIES.map(c =>
    `<button class="cat-btn ${c === currentCat ? 'active' : ''}" onclick="setCategory('${c}')">${c}</button>`
  ).join('');
}

function setCategory(cat) {
  currentCat = cat;
  renderCategories();
  renderCatalog();
}

function cardHTML(v) {
  const isFav = favorites.includes(v.id);
  const userRating = ratings[v.id] || null;
  return `
    <div class="card" onclick="openVideoPage(${v.id})">
      <div class="card-cover">
        <button class="fav-btn-float ${isFav ? 'active-fav' : ''}" onclick="event.stopPropagation(); toggleFav(${v.id})">
          ${isFav ? '❤️' : '🤍'}
        </button>
        Обложка
      </div>
      <div class="card-body">
        <div class="card-title">${v.title}</div>
        <div class="card-cat">${v.cat}</div>
        <div class="card-actions" onclick="event.stopPropagation()">
          <button class="action-btn ${userRating === 'like' ? 'active-like' : ''}" onclick="toggleRating(${v.id}, 'like')">👍</button>
          <button class="action-btn ${userRating === 'dislike' ? 'active-dislike' : ''}" onclick="toggleRating(${v.id}, 'dislike')">👎</button>
        </div>
      </div>
    </div>
  `;
}

function renderCatalog() {
  const grid  = document.getElementById('grid');
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const title = document.getElementById('catalogTitle');
  const empty = document.getElementById('emptyMsg');

  let list = VIDEOS;
  if (currentCat !== 'Все') list = list.filter(v => v.cat === currentCat);
  if (query) list = list.filter(v => v.title.toLowerCase().includes(query));

  title.textContent = currentCat === 'Все' ? 'Все видео' : currentCat;

  if (!list.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = list.map(v => cardHTML(v)).join('');
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
renderCategories();
renderCatalog();
updateFavCount();
checkHash(); // Проверяем, есть ли ссылка на видео в URL при загрузке
