const form = document.getElementById('winForm');
const input = document.getElementById('winInput');
const imageInput = document.getElementById('imageInput');
const list = document.getElementById('winsList');

let wins = JSON.parse(localStorage.getItem('wins')) || [];
let likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];

function renderWins() {
  list.innerHTML = '';
  wins.slice().reverse().forEach((win, index) => {
    const card = document.createElement('div');
    card.className = 'win-card';

    if (win.image) {
      const img = document.createElement('img');
      img.src = win.image;
      img.alt = "User image";
      card.appendChild(img);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'win-content';

    const message = document.createElement('p');
    message.textContent = win.text;
    contentWrapper.appendChild(message);

    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';

    const postId = win.id || (wins.length - 1 - index);
const hasLiked = likedPosts.includes(postId);

likeBtn.innerHTML = `<i data-lucide="thumbs-up"></i> ${hasLiked ? 'Liked' : 'Like'} (${win.likes || 0})`;
likeBtn.disabled = hasLiked;

likeBtn.addEventListener('click', () => {
  // Recheck dynamically whether this post has been liked
  if (!likedPosts.includes(postId)) {
    // Use the reverse order index mapping to update the correct win
    wins[wins.length - 1 - index].likes = (win.likes || 0) + 1;
    likedPosts.push(postId);
    localStorage.setItem('wins', JSON.stringify(wins));
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    renderWins();
  }
});


    contentWrapper.appendChild(likeBtn);
    card.appendChild(contentWrapper);
    list.appendChild(card);
  });

  lucide.createIcons();
}

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const text = input.value.trim();
    const file = imageInput.files[0]; // Image input
  
    // If there's no text and no file, don't submit
    if (!text && !file) return;
  
    const saveWin = (imageData) => {
      const newWin = {
        id: Date.now(),
        text,
        image: imageData, // Store image as base64 string or null
        likes: 0
      };
      wins.push(newWin);
      try {
        localStorage.setItem('wins', JSON.stringify(wins));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      input.value = '';
      imageInput.value = '';
      renderWins();
    };
  
    if (file) {
      console.log("File selected:", file);
      const reader = new FileReader();
      reader.onload = function (event) {
        console.log("File loaded successfully");
        saveWin(event.target.result);
      };
      reader.onerror = function (error) {
        console.error("Error reading file:", error);
      };
      reader.readAsDataURL(file);
    } else {
      saveWin(null);
    }
  });
  

renderWins(); // Initial render

// Drawer + Tab Logic
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
