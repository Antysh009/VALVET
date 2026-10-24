// ---------- ДАННЫЕ (демо, замени своими) ----------
const VIDEOS = [
  { id: 1, title: 'Полночный бархат',   cat: 'Романтика',    cover: '' },
  { id: 2, title: 'Красный шёлк',       cat: 'Романтика',    cover: '' },
  { id: 3, title: 'Тайная встреча',     cat: 'Драма',        cover: '' },
  { id: 4, title: 'Ночной экспресс',    cat: 'Драма',        cover: '' },
  { id: 5, title: 'Огни Парижа',        cat: 'Классика',     cover: '' },
  { id: 6, title: 'Искушение',          cat: 'Классика',     cover: '' },
  { id: 7, title: 'После полуночи',     cat: 'Триллер',      cover: '' },
  { id: 8, title: 'Тёмная сторона',     cat: 'Триллер',      cover: '' },
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
let ratings     = store.get('ratings', {});   // { videoId: 'like' | 'dislike' }

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

// ---------- КАТАЛОГ ----------
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

function cardHTML(v) {
  const isFav = favorites.includes(v.id);
  return `
    <div class="card">
      <button class="fav-btn ${isFav ? 'active' : ''}"
              onclick="event.stopPropagation(); toggleFav(${v.id})">
        ${isFav ? '❤️' : '🤍'}
      </button>
      <div class="card-cover">${v.cover ? `<img src="${v.cover}" style="width:100%;height:100%;object-fit:cover">` : 'Обложка'}</div>
      <div class="card-body">
        <div class="card-title">${v.title}</div>
        <div class="card-cat">${v.cat}</div>
      </div>
    </div>
  `;
}

// ---------- ИЗБРАННОЕ ----------
function toggleFav(id) {
  const i = favorites.indexOf(id);
  if (i === -1) favorites.push(id);
  else favorites.splice(i, 1);
  store.set('favorites', favorites);
  updateFavCount();
  renderCatalog();
  if (document.getElementById('page-favorites').classList.contains('active'))
    renderFavorites();
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

// ---------- ПРОФИЛЬ ----------
function renderProfile() {
  document.getElementById('username').value = profile.name || '';
  document.getElementById('avatar').textContent =
    (profile.name || '?').charAt(0).toUpperCase();

  // актёры
  const actorsList = document.getElementById('actorsList');
  actorsList.innerHTML = profile.actors.map((a, i) =>
    `<li>${a} <span onclick="removeActor(${i})">✕</span></li>`
  ).join('');

  // оценки
  const ratingsList = document.getElementById('ratingsList');
  const entries = Object.entries(ratings);
  if (!entries.length) {
    ratingsList.innerHTML = '<p class="empty">Пока нет оценок</p>';
    return;
  }
  ratingsList.innerHTML = entries.map(([id, val]) => {
    const v = VIDEOS.find(x => x.id == id);
    if (!v) return '';
    const icon = val === 'like'
      ? '<span class="rating-like">👍 Нравится</span>'
      : '<span class="rating-dislike">👎 Не нравится</span>';
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
