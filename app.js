const STORAGE_KEY = 'vexture.command.center.v2';
const PASSCODE_KEY = 'vexture.command.center.passcode';

const state = {
  accounts: [],
  posts: [],
  growth: {}
};

const authPanel = document.getElementById('authPanel');
const appMain = document.getElementById('appMain');
const authForm = document.getElementById('authForm');
const authPasscode = document.getElementById('authPasscode');
const authSubmit = document.getElementById('authSubmit');
const logoutBtn = document.getElementById('logoutBtn');

const accountForm = document.getElementById('accountForm');
const postForm = document.getElementById('postForm');
const growthForm = document.getElementById('growthForm');
const accountsList = document.getElementById('accountsList');
const postsList = document.getElementById('postsList');
const growthCards = document.getElementById('growthCards');
const accountCount = document.getElementById('accountCount');
const postAccount = document.getElementById('postAccount');
const growthAccount = document.getElementById('growthAccount');
const addAccountBtn = document.getElementById('addAccountBtn');
const statusMessage = document.getElementById('statusMessage');
const exportBtn = document.getElementById('exportBtn');
const importInput = document.getElementById('importInput');

let isAuthenticated = false;

addAccountBtn.addEventListener('click', () => {
  const accountName = document.getElementById('accountName');
  if (!appMain.hidden) accountName.focus();
});

logoutBtn.addEventListener('click', () => {
  isAuthenticated = false;
  renderAuthState();
});

authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const typedPasscode = authPasscode.value.trim();
  if (!typedPasscode) return;

  const existingPasscode = localStorage.getItem(PASSCODE_KEY);
  if (!existingPasscode) {
    localStorage.setItem(PASSCODE_KEY, typedPasscode);
    showStatus('Passcode created. You are now logged in.');
    isAuthenticated = true;
  } else if (typedPasscode === existingPasscode) {
    showStatus('Welcome back.');
    isAuthenticated = true;
  } else {
    showStatus('Wrong passcode. Try again.');
    return;
  }

  authForm.reset();
  renderAuthState();
});

accountForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const accountName = document.getElementById('accountName').value.trim();
  const niche = document.getElementById('niche').value.trim();

  if (!accountName || !niche) return;

  const id = `${accountName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  state.accounts.push({ id, accountName, niche });
  accountForm.reset();
  persistState();
  rerender();
});

postForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const accountId = postAccount.value;
  const postIdea = document.getElementById('postIdea').value.trim();
  const postDate = document.getElementById('postDate').value;

  if (!accountId || !postIdea || !postDate) return;

  state.posts.push({ accountId, postIdea, postDate });
  postForm.reset();
  persistState();
  rerenderPosts();
});

growthForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const accountId = growthAccount.value;
  const followers = Number(document.getElementById('followers').value);
  const avgViews = Number(document.getElementById('avgViews').value);

  if (!accountId || Number.isNaN(followers) || Number.isNaN(avgViews)) return;

  state.growth[accountId] = { followers, avgViews };
  growthForm.reset();
  persistState();
  rerenderGrowth();
});

exportBtn.addEventListener('click', () => {
  const payload = JSON.stringify(state, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `vexture-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showStatus('Backup exported.');
});

importInput.addEventListener('change', async () => {
  const file = importInput.files?.[0];
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.accounts) || !Array.isArray(data.posts) || typeof data.growth !== 'object') {
      showStatus('Invalid backup format.');
      return;
    }

    state.accounts = data.accounts;
    state.posts = data.posts;
    state.growth = data.growth;
    persistState();
    rerender();
    showStatus('Backup imported.');
  } catch {
    showStatus('Could not read backup JSON.');
  } finally {
    importInput.value = '';
  }
});

function showStatus(message) {
  statusMessage.textContent = message;
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed.accounts) && Array.isArray(parsed.posts) && typeof parsed.growth === 'object') {
      state.accounts = parsed.accounts;
      state.posts = parsed.posts;
      state.growth = parsed.growth;
    }
  } catch {
    showStatus('Saved data is corrupted, starting fresh.');
  }
}

function renderAuthState() {
  appMain.hidden = !isAuthenticated;
  authPanel.hidden = isAuthenticated;
  logoutBtn.hidden = !isAuthenticated;
  authSubmit.textContent = localStorage.getItem(PASSCODE_KEY) ? 'Unlock' : 'Create passcode';
}

function rerender() {
  rerenderAccounts();
  rerenderSelectors();
  rerenderPosts();
  rerenderGrowth();
}

function rerenderAccounts() {
  accountsList.innerHTML = '';
  const template = document.getElementById('accountTemplate');

  for (const account of state.accounts) {
    const li = template.content.firstElementChild.cloneNode(true);
    li.querySelector('.name').textContent = account.accountName;
    li.querySelector('.meta').textContent = `Niche: ${account.niche}`;
    accountsList.appendChild(li);
  }

  accountCount.textContent = `${state.accounts.length} account${state.accounts.length === 1 ? '' : 's'}`;
}

function rerenderSelectors() {
  const options = ['<option value="">Choose account</option>'];
  for (const account of state.accounts) {
    options.push(`<option value="${account.id}">${account.accountName}</option>`);
  }

  postAccount.innerHTML = options.join('');
  growthAccount.innerHTML = options.join('');
}

function rerenderPosts() {
  postsList.innerHTML = '';
  const template = document.getElementById('postTemplate');

  for (const post of state.posts) {
    const account = state.accounts.find((item) => item.id === post.accountId);
    if (!account) continue;
    const li = template.content.firstElementChild.cloneNode(true);
    li.querySelector('.name').textContent = post.postIdea;
    li.querySelector('.meta').textContent = `${account.accountName} • ${post.postDate}`;
    postsList.appendChild(li);
  }
}

function rerenderGrowth() {
  growthCards.innerHTML = '';

  for (const account of state.accounts) {
    const metrics = state.growth[account.id];
    const card = document.createElement('article');
    card.className = 'card';

    if (!metrics) {
      card.innerHTML = `<strong>${account.accountName}</strong><p class="meta">No metrics yet.</p>`;
    } else {
      const viewRate = metrics.avgViews > 0 ? ((metrics.avgViews / Math.max(metrics.followers, 1)) * 100).toFixed(1) : '0.0';
      card.innerHTML = `<strong>${account.accountName}</strong><p class="meta">Followers: ${metrics.followers.toLocaleString()} • Avg views: ${metrics.avgViews.toLocaleString()} • View-rate: ${viewRate}%</p>`;
    }

    growthCards.appendChild(card);
  }
}

loadState();
renderAuthState();
rerender();
