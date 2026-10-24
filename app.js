// ---------- ДАННЫЕ (12 видео с описаниями) ----------
const VIDEOS = [
  { id: 1, title: 'Полночный бархат', cat: 'Романтика', desc: 'Изысканная история о тайной встрече в самом сердце ночного города. Бархат, свечи и недолгие взгляды.' },
  { id: 2, title: 'Красный шёлк', cat: 'Романтика', desc: 'Страсть, которая вспыхивает с первого касания шёлковой ткани. История о запретном влечении.' },
  { id: 3, title: 'Тайная встреча', cat: 'Драма', desc: 'Она думала, что знает его. Но за фасадом идеального мужа скрывается нечто большее.' },
  { id: 4, title: 'Ночной экспресс', cat: 'Драма', desc: 'Поезд мчится сквозь тьму, а в купе разгорается настоящая буря эмоций. Одна ночь, которая изменит всё.' },
  { id: 5, title: 'Огни Парижа', cat: 'Классика', desc: 'Классическая французская эстетика. Город любви, кафе на Монмартре и встреча, которую невозможно забыть.' },
  { id: 6, title: 'Искушение', cat: 'Классика', desc: 'Когда разум говорит одно, а сердце требует другого. Искушение, которому так сложно сопротивляться.' },
  { id: 7, title: 'После полуночи', cat: 'Триллер', desc: 'В городе орудует маньяк, но она ищет не спасения, а острых ощущений. Опасная игра начинается.' },
  { id: 8, title: 'Тёмная сторона', cat: 'Триллер', desc: 'Каждый скрывает свои секреты. Но некоторые из них лучше оставить в темноте.' },
  { id: 9, title: 'Бархатный сезон', cat: 'Романтика', desc: 'Курортный роман, который перерастает во что-то большее. Солнце, море и бесконечное лето.' },
  { id: 10, title: 'Шёпот в темноте', cat: 'Триллер', desc: 'Она слышит его каждую ночь. Но когда оборачивается — никого нет. Или есть?' },
  { id: 11, title: 'Золотая клетка', cat: 'Драма', desc: 'Она живёт в роскоши, но платит за это свободой. История о выборе между комфортом и свободой.' },
  { id: 12, title: 'Взгляд', cat: 'Классика', desc: 'Иногда достаточно одного взгляда, чтобы понять — это судьба. Встреча, которая меняет всё.' },
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
let currentModalId = null;

// ---------- НАВИГАЦИЯ ----------
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  if (name === 'favorites') renderFavorites();
  if (name === 'profile')   renderProfile();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- КАТЕГОРИИ ----------
function renderCategories() {
  const box = document.getElementById('categories');
  box.innerHTML = CATEGORIES.map(c =>
    `<button class="cat-btn ${c === currentCat ? 'active' : ''}"
             onclick="setCategory('${c}')">${c}</button>`
  ).join('');
}

function setCategory(cat) {
  currentCat = cat;
  renderCategories();
  renderCatalog();
}

// ---------- ОТРИСОВКА КАРТОЧКИ ----------
function cardHTML(v) {
  const isFav = favorites.includes(v.id);
  const userRating = ratings[v.id] || null;

  const likeClass = userRating === 'like' ? 'active-like' : '';
  const dislikeClass = userRating === 'dislike' ? 'active-dislike' : '';
  const favClass = isFav ? 'active-fav' : '';

  return `
    <div class="card" onclick="openModal(${v.id})">
      <div class="card-cover">
        <button class="fav-btn-float ${favClass}" onclick="event.stopPropagation(); toggleFav(${v.id})">
          ${isFav ? '❤️' : '🤍'}
        </button>
        Обложка
      </div>
      <div class="card-body">
        <div class="card-title">${v.title}</div>
        <div class="card-cat">${v.cat}</div>
        <div class="card-actions" onclick="event.stopPropagation()">
          <button class="action-btn ${likeClass}" onclick="toggleRating(${v.id}, 'like')">👍 Нравится</button>
          <button class="action-btn ${dislikeClass}" onclick="toggleRating(${v.id}, 'dislike')">👎 Не нравится</button>
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

// ---------- МОДАЛЬНОЕ ОКНО ----------
function openModal(id) {
  const v = VIDEOS.find(x => x.id === id);
  if (!v) return;
  currentModalId = id;

  document.getElementById('modalTitle').textContent = v.title;
  document.getElementById('modalCat').textContent = v.cat;
  document.getElementById('modalDesc').textContent = v.desc;
  
  updateModalButtons();
  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
  currentModalId = null;
}

function updateModalButtons() {
  if (!currentModalId) return;
  const isFav = favorites.includes(currentModalId);
  const userRating = ratings[currentModalId] || null;

  const likeBtn = document.getElementById('modalLikeBtn');
  const dislikeBtn = document.getElementById('modalDislikeBtn');
  const favBtn = document.getElementById('modalFavBtn');

  likeBtn.className = 'action-btn ' + (userRating === 'like' ? 'active-like' : '');
  dislikeBtn.className = 'action-btn ' + (userRating === 'dislike' ? 'active-dislike' : '');
  favBtn.className = 'action-btn fav-modal-btn ' + (isFav ? 'active-fav' : '');
  favBtn.textContent = isFav ? '❤️ В избранном' : '🤍 В избранное';
}

// ---------- ОЦЕНКИ ----------
function toggleRating(id, type) {
  if (ratings[id] === type) {
    delete ratings[id]; // если нажал повторно, отменяем
  } else {
    ratings[id] = type; // ставим лайк или дизлайк
  }
  store.set('ratings', ratings);
  
  // Обновляем интерфейс
  renderCatalog(); 
  if (currentModalId === id) updateModalButtons();
  if (document.getElementById('page-favorites').classList.contains('active')) renderFavorites();
}

function rateFromModal(type) {
  toggleRating(currentModalId, type);
}

// ---------- ИЗБРАННОЕ ----------
function toggleFav(id) {
  const i = favorites.indexOf(id);
  if (i === -1) favorites.push(id);
  else favorites.splice(i, 1);
  store.set('favorites', favorites);
  
  updateFavCount();
  renderCatalog();
  if (currentModalId === id) updateModalButtons();
  if (document.getElementById('page-favorites').classList.contains('active')) renderFavorites();
}

function favFromModal() {
  toggleFav(currentModalId);
}

function updateFavCount() {
  document.getElementById('favCount').textContent = favorites.length;
}

function renderFavorites() {
  const grid  = document.getElementById('favGrid');
  const empty = document.getElementById('favEmpty');
  const list  = VIDEOS.filter(v => favorites.includes(v.id));

  if (!list.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = list.map(v => cardHTML(v)).join('');
}

// ---------- СЛУЧАЙНОЕ ВИДЕО ----------
function playRandom() {
  const randomIndex = Math.floor(Math.random() * VIDEOS.length);
  const randomVideo = VIDEOS[randomIndex];
  openModal(randomVideo.id);
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
  if (!entries.length) {
    ratingsList.innerHTML = '<p class="empty">Пока нет оценок</p>';
    return;
  }
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
