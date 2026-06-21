const STORAGE_KEY = "it4409-mini3-state-v2";
const defaults = {
  activeTop: "wiki",
  activeLeft: "wiki-search",
  selectedItem: "wiki-search-main",
  topMenus: [
    { id: "home", title: "Trang chu", leftMenus: [
      { id: "home-intro", title: "Gioi thieu", items: [
        { id: "home-html", title: "Mini Project #3", type: "html", span: 12, keyword: "", page: "", html: "<h2>AJAX with Wikipedia API</h2><p>Menu My Wiki ben canh su dung fetch de lay du lieu truc tiep tu Wikipedia.</p>" }
      ] }
    ] },
    { id: "wiki", title: "My Wiki", leftMenus: [
      { id: "wiki-search", title: "Wikipedia Search", items: [
        { id: "wiki-search-main", title: "Search Wikipedia", type: "search", span: 12, keyword: "Web technology", page: "", html: "" }
      ] },
      { id: "wiki-topics", title: "Featured topics", items: [
        { id: "wiki-summary-web", title: "World Wide Web", type: "summary", span: 6, keyword: "", page: "World Wide Web", html: "" },
        { id: "wiki-summary-js", title: "JavaScript", type: "summary", span: 6, keyword: "", page: "JavaScript", html: "" }
      ] },
      { id: "wiki-random", title: "Random discovery", items: [
        { id: "wiki-random-main", title: "Random article", type: "random", span: 12, keyword: "", page: "", html: "" }
      ] }
    ] }
  ]
};

let state = load();
const topMenu = document.querySelector("#top-menu");
const leftMenu = document.querySelector("#left-menu");
const sideTitle = document.querySelector("#side-title");
const editor = document.querySelector("#editor");
const contentGrid = document.querySelector("#content-grid");

function load() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaults));
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 7)}`;
}

function currentTop() {
  return state.topMenus.find(top => top.id === state.activeTop) || state.topMenus[0];
}

function currentLeft() {
  const top = currentTop();
  return top.leftMenus.find(left => left.id === state.activeLeft) || top.leftMenus[0];
}

function currentItem() {
  const left = currentLeft();
  return left.items.find(item => item.id === state.selectedItem) || left.items[0];
}

function render() {
  const top = currentTop();
  const left = currentLeft();
  document.querySelector(".logo").classList.toggle("active", state.activeTop === "home");
  topMenu.innerHTML = state.topMenus
    .filter(menu => menu.id !== "home")
    .map(menu => `<button class="${menu.id === state.activeTop ? "active" : ""}" data-top="${menu.id}">${menu.title}</button>`)
    .join("");
  sideTitle.textContent = top.title;
  leftMenu.innerHTML = top.leftMenus.map(menu => `<button class="${menu.id === state.activeLeft ? "active" : ""}" data-left="${menu.id}">${menu.title}</button>`).join("");
  renderEditor(left);
  renderItems(left);
}

function renderEditor(left) {
  const item = currentItem();
  editor.innerHTML = `
    <div class="editor-grid">
      <label>Content item
        <select id="item-select">
          ${left.items.map(entry => `<option value="${entry.id}" ${entry.id === item.id ? "selected" : ""}>${entry.title}</option>`).join("")}
        </select>
      </label>
      <label>Loai content
        <select id="type-select">
          ${["html", "search", "summary", "random"].map(type => `<option value="${type}" ${type === item.type ? "selected" : ""}>${typeLabel(type)}</option>`).join("")}
        </select>
      </label>
      <label>Do rong
        <select id="span-select">
          <option value="12" ${item.span === 12 ? "selected" : ""}>12 cot</option>
          <option value="6" ${item.span === 6 ? "selected" : ""}>6 cot</option>
          <option value="4" ${item.span === 4 ? "selected" : ""}>4 cot</option>
        </select>
      </label>
      <label>Tieu de
        <input id="title-input" value="${escapeAttr(item.title)}">
      </label>
      <label>Search keyword
        <input id="keyword-input" value="${escapeAttr(item.keyword)}" placeholder="Vi du: Web technology">
      </label>
      <label>Wikipedia page title
        <input id="page-input" value="${escapeAttr(item.page)}" placeholder="Vi du: JavaScript">
      </label>
      <label class="wide">HTML content
        <textarea id="html-input">${escapeHtml(item.html)}</textarea>
      </label>
      <div class="wide editor-actions">
        <button class="btn" id="save-editor">Cap nhat preview</button>
        <button class="btn secondary" id="add-item">+ Them content item</button>
        <button class="btn danger" id="delete-item">Xoa item dang chon</button>
      </div>
    </div>`;
}

function renderItems(left) {
  contentGrid.innerHTML = left.items.map(item => `
    <article class="wiki-card" data-span="${item.span}" id="${item.id}">
      <h2>${item.title}</h2>
      <div class="wiki-body" data-render="${item.id}"><p class="muted">Dang tai noi dung...</p></div>
    </article>
  `).join("");
  left.items.forEach(renderItemBody);
}

async function renderItemBody(item) {
  const target = document.querySelector(`[data-render="${item.id}"]`);
  if (!target) return;
  try {
    if (item.type === "html") {
      target.innerHTML = item.html || "<p class='muted'>Chua co noi dung HTML.</p>";
    } else if (item.type === "search") {
      renderSearchItem(target, item);
    } else if (item.type === "summary") {
      await renderSummaryItem(target, item);
    } else if (item.type === "random") {
      await renderRandomItem(target);
    }
  } catch (error) {
    target.innerHTML = `<p class="error">Khong tai duoc du lieu Wikipedia: ${escapeHtml(error.message)}</p>`;
  }
}

function renderSearchItem(target, item) {
  target.innerHTML = `
    <div class="search-box">
      <input value="${escapeAttr(item.keyword || "")}" placeholder="Enter a search term..." data-search-input="${item.id}">
      <button class="btn" data-run-search="${item.id}">Search</button>
    </div>
    <div class="result-list" data-search-results="${item.id}"><p class="muted">Nhap tu khoa de tim tren Wikipedia.</p></div>`;
  runSearch(item.id, item.keyword);
}

async function runSearch(itemId, keyword) {
  const resultBox = document.querySelector(`[data-search-results="${itemId}"]`);
  if (!resultBox || !keyword) return;
  resultBox.innerHTML = "<p class='muted'>Dang tim kiem...</p>";
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=8&srsearch=${encodeURIComponent(keyword)}`;
  const response = await fetch(url);
  const data = await response.json();
  resultBox.innerHTML = data.query.search.map(result => `
    <div class="result-item">
      <a href="https://en.wikipedia.org/?curid=${result.pageid}" target="_blank" rel="noopener">${escapeHtml(result.title)}</a>
      <p>${escapeHtml(stripHtml(result.snippet))}...</p>
    </div>`).join("");
}

async function renderSummaryItem(target, item) {
  const page = item.page || item.title;
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("summary API error");
  const data = await response.json();
  target.innerHTML = `
    ${data.thumbnail ? `<img src="${data.thumbnail.source}" alt="${escapeAttr(data.title)}" style="max-width:180px;border-radius:8px;float:right;margin:0 0 10px 12px">` : ""}
    <h3>${escapeHtml(data.title)}</h3>
    <p>${escapeHtml(data.extract || "Khong co tom tat.")}</p>
    <p><a href="${data.content_urls.desktop.page}" target="_blank" rel="noopener">Doc tren Wikipedia</a></p>`;
}

async function renderRandomItem(target) {
  const url = "https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts|info&exintro=1&explaintext=1&inprop=url&format=json&origin=*";
  const response = await fetch(url);
  const data = await response.json();
  const page = Object.values(data.query.pages)[0];
  target.innerHTML = `
    <h3>${escapeHtml(page.title)}</h3>
    <p>${escapeHtml((page.extract || "").slice(0, 700))}${page.extract?.length > 700 ? "..." : ""}</p>
    <p><a href="${page.fullurl}" target="_blank" rel="noopener">Mo bai viet ngau nhien</a></p>
    <button class="btn" data-refresh-random>Lay bai khac</button>`;
}

function typeLabel(type) {
  return {
    html: "Loai HTML",
    search: "Wikipedia Search",
    summary: "Wikipedia Page Summary",
    random: "Wikipedia Random Article"
  }[type];
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

document.addEventListener("click", event => {
  const topButton = event.target.closest("[data-top]");
  if (topButton) {
    state.activeTop = topButton.dataset.top;
    state.activeLeft = currentTop().leftMenus[0].id;
    state.selectedItem = currentLeft().items[0].id;
    save();
    render();
  }
  if (event.target.closest(".logo")) {
    state.activeTop = "home";
    state.activeLeft = "home-intro";
    state.selectedItem = "home-html";
    save();
    render();
  }
  const leftButton = event.target.closest("[data-left]");
  if (leftButton) {
    state.activeLeft = leftButton.dataset.left;
    state.selectedItem = currentLeft().items[0].id;
    save();
    render();
  }
  const searchButton = event.target.closest("[data-run-search]");
  if (searchButton) {
    const item = currentLeft().items.find(entry => entry.id === searchButton.dataset.runSearch);
    const input = document.querySelector(`[data-search-input="${item.id}"]`);
    item.keyword = input.value.trim();
    save();
    runSearch(item.id, item.keyword);
  }
  if (event.target.closest("[data-refresh-random]")) {
    render();
  }
  if (event.target.id === "save-editor") {
    const item = currentItem();
    item.title = document.querySelector("#title-input").value.trim() || item.title;
    item.type = document.querySelector("#type-select").value;
    item.span = Number(document.querySelector("#span-select").value);
    item.keyword = document.querySelector("#keyword-input").value.trim();
    item.page = document.querySelector("#page-input").value.trim();
    item.html = document.querySelector("#html-input").value;
    save();
    render();
  }
  if (event.target.id === "add-item") {
    const left = currentLeft();
    const item = {
      id: uid("wiki-item"),
      title: "Content item moi",
      type: "search",
      span: 12,
      keyword: "Web service",
      page: "",
      html: "<h2>Content item moi</h2><p>Doi loai content va du lieu trong My Wiki Admin.</p>"
    };
    left.items.push(item);
    state.selectedItem = item.id;
    save();
    render();
  }
  if (event.target.id === "delete-item") {
    const left = currentLeft();
    if (left.items.length <= 1) return alert("Can giu lai toi thieu mot content item trong menu left nay.");
    left.items = left.items.filter(item => item.id !== state.selectedItem);
    state.selectedItem = left.items[0].id;
    save();
    render();
  }
});

document.addEventListener("change", event => {
  if (event.target.id === "item-select") {
    state.selectedItem = event.target.value;
    save();
    render();
  }
});

document.addEventListener("input", debounce(event => {
  const input = event.target.closest("[data-search-input]");
  if (!input) return;
  const itemId = input.dataset.searchInput;
  const item = currentLeft().items.find(entry => entry.id === itemId);
  item.keyword = input.value.trim();
  save();
  runSearch(itemId, item.keyword);
}, 500));

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

render();
