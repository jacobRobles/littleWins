const form = document.getElementById('winForm');
const imageInput = document.getElementById('imageInput');
const list = document.getElementById('winsList');

let wins = JSON.parse(localStorage.getItem('wins')) || [];
let likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
let dailyUploads = JSON.parse(localStorage.getItem('dailyUploads')) || [];

const today = new Date().toISOString().split('T')[0];
dailyUploads = dailyUploads.filter(entry => entry.date === today);

function saveDailyUpload() {
  dailyUploads.push({ date: today });
  localStorage.setItem('dailyUploads', JSON.stringify(dailyUploads));
}

function renderWins() {
  list.innerHTML = '';
  const shuffled = wins.slice().sort(() => Math.random() - 0.5);
  shuffled.forEach((win, index) => {
    const card = document.createElement('div');
    card.className = 'win-card';

    if (win.image) {
      const img = document.createElement('img');
      img.src = win.image;
      img.alt = "User image";
      card.appendChild(img);
    }

    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';

    const postId = win.id;
    const hasLiked = likedPosts.includes(postId);

    likeBtn.innerHTML = `<i data-lucide="thumbs-up"></i> ${hasLiked ? 'Liked' : 'Like'} (${win.likes || 0})`;
    likeBtn.disabled = hasLiked;

    likeBtn.addEventListener('click', () => {
      if (!likedPosts.includes(postId)) {
        const targetIndex = wins.findIndex(w => w.id === postId);
        wins[targetIndex].likes = (wins[targetIndex].likes || 0) + 1;
        likedPosts.push(postId);
        localStorage.setItem('wins', JSON.stringify(wins));
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        renderWins();
      }
    });

    card.appendChild(likeBtn);
    list.appendChild(card);
  });

  lucide.createIcons();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const file = imageInput.files[0];

  if (!file) return;

  if (dailyUploads.length >= 2) {
    alert("You can only upload 2 photos per day!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const newWin = {
      id: Date.now(),
      image: event.target.result,
      likes: 0,
      date: today
    };
    wins.push(newWin);
    saveDailyUpload();
    try {
      localStorage.setItem('wins', JSON.stringify(wins));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    imageInput.value = '';
    renderWins();
  };
  reader.onerror = function (error) {
    console.error("Error reading file:", error);
  };
  reader.readAsDataURL(file);
});

renderWins();

// Auto-open camera on "Post"
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });

    if (id === 'winForm') {
      const fileInput = section.querySelector('input[type="file"]');
      if (fileInput) {
        setTimeout(() => {
          fileInput.click(); // 🚀 triggers camera
        }, 400);
      }
    }
  }
}

// Drawer + Tabs
function openDrawer() {
  document.getElementById('drawerOverlay').style.display = 'block';
  document.getElementById('aboutDrawer').style.bottom = '0';
}

function closeDrawer() {
  document.getElementById('drawerOverlay').style.display = 'none';
  document.getElementById('aboutDrawer').style.bottom = '-100%';
}

function showTab(id) {
  const tabs = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.tab-button');
  tabs.forEach(tab => tab.style.display = 'none');
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(id).style.display = 'block';
  const activeBtn = Array.from(buttons).find(btn => btn.textContent.toLowerCase().includes(id.replace('Tab', '').toLowerCase()));
  if (activeBtn) activeBtn.classList.add('active');
}

lucide.createIcons();

