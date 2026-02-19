const state = {
  accounts: [],
  posts: [],
  growth: {}
};

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

addAccountBtn.addEventListener('click', () => {
  document.getElementById('accountName').focus();
});

accountForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const accountName = document.getElementById('accountName').value.trim();
  const niche = document.getElementById('niche').value.trim();

  if (!accountName || !niche) return;

  const id = `${accountName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  state.accounts.push({ id, accountName, niche });
  accountForm.reset();
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
  rerenderGrowth();
});

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
    li.querySelector('.name').textContent = `${post.postIdea}`;
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
      const engagementHint = metrics.avgViews > 0 ? ((metrics.avgViews / Math.max(metrics.followers, 1)) * 100).toFixed(1) : '0.0';
      card.innerHTML = `<strong>${account.accountName}</strong><p class="meta">Followers: ${metrics.followers.toLocaleString()} • Avg views: ${metrics.avgViews.toLocaleString()} • View-rate: ${engagementHint}%</p>`;
    }

    growthCards.appendChild(card);
  }
}

rerender();
