const STORAGE_KEY = "it4409-mini2-state-v2";
const defaultState = {
  activeTopId: "home",
  activeLeftId: "home-news",
  activeContentId: "home-news-main",
  mode: "site",
  topMenus: [
    { id: "home", title: "Trang chu", locked: true, leftMenus: [
      { id: "home-news", title: "Thong tin khai giang", contents: [
        { id: "home-news-main", title: "Thong bao mon hoc", span: 8, rows: 1, style: "", html: "<h3>Thong bao mon hoc</h3><p>Cap nhat lich khai giang, seminar, bai tap va cac moc nop mini project.</p>" },
        { id: "home-news-ad", title: "Lien ket SIS", span: 4, rows: 1, style: "background:#fff7ed;", html: "<h3>SIS HUST</h3><p>Truy cap cong thong tin dao tao de doi chieu thong tin hoc phan.</p>" }
      ] }
    ] },
    { id: "course", title: "Thong tin mon hoc", leftMenus: [
      { id: "course-overview", title: "Mo ta hoc phan", contents: [
        { id: "course-overview-main", title: "IT4409", span: 12, rows: 1, style: "", html: "<h3>IT4409</h3><p>Cong nghe Web va dich vu truc tuyen: HTML, CSS, JavaScript, API, backend, security va deployment.</p>" }
      ] }
    ] },
    { id: "tech", title: "Cac cong nghe Web", leftMenus: [
      { id: "tech-front", title: "Frontend", contents: [
        { id: "tech-front-main", title: "HTML CSS JavaScript", span: 6, rows: 1, style: "", html: "<h3>Frontend</h3><p>Xay dung giao dien responsive va trai nghiem tuong tac tren browser.</p>" },
        { id: "tech-api-main", title: "Web API", span: 6, rows: 1, style: "", html: "<h3>Web API</h3><p>Su dung fetch/AJAX de ket noi voi cac dich vu du lieu.</p>" }
      ] }
    ] },
    { id: "student", title: "Thong tin sinh vien", leftMenus: [
      { id: "student-cv", title: "CV", contents: [
        { id: "student-cv-main", title: "So yeu ly lich", span: 12, rows: 1, style: "", html: "<h3>Nguyễn Tuấn Đạt</h3><p><strong>MSSV:</strong> 20235907</p><p><strong>Email:</strong> Dat.NT235907@sis.hust.edu.vn</p><p><img src='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80' alt='Anh sinh vien' style='max-width:180px;border-radius:8px'></p>" }
      ] },
      { id: "student-projects", title: "Cac du an da tham gia", contents: [
        { id: "student-projects-main", title: "Du an", span: 12, rows: 1, style: "", html: "<h3>Du an da tham gia</h3><ul><li>Website gioi thieu mon hoc IT4409.</li><li>Ung dung quan ly cong viec ca nhan bang JavaScript.</li></ul>" }
      ] },
      { id: "student-community", title: "Sinh hoat cong dong", contents: [
        { id: "student-community-main", title: "Hoat dong", span: 12, rows: 1, style: "", html: "<h3>Sinh hoat cong dong</h3><ul><li>Tham gia sinh hoat cong dan dau khoa.</li><li>Ho tro ngay hoi tu van tuyen sinh cua lop/vien.</li></ul>" }
      ] }
    ] }
  ]
};

let state = loadState();
const topMenuEl = document.querySelector("#top-menu");
const leftMenuEl = document.querySelector("#left-menu");
const leftTitleEl = document.querySelector("#left-title");
const adminArea = document.querySelector("#admin-area");
const previewArea = document.querySelector("#preview-area");
const homeLogo = document.querySelector("#home-logo");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : clone(defaultState);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 7)}`;
}

function currentTop() {
  return state.topMenus.find(menu => menu.id === state.activeTopId) || state.topMenus[0];
}

function currentLeft() {
  const top = currentTop();
  return top.leftMenus.find(menu => menu.id === state.activeLeftId) || top.leftMenus[0];
}

function currentContent() {
  const left = currentLeft();
  return left?.contents.find(item => item.id === state.activeContentId) || left?.contents[0];
}

function setMode(mode) {
  state.mode = mode;
  saveState();
  render();
}

function selectTop(id, mode = "site") {
  state.activeTopId = id;
  const top = currentTop();
  state.activeLeftId = top.leftMenus[0]?.id || "";
  state.activeContentId = top.leftMenus[0]?.contents[0]?.id || "";
  state.mode = mode;
  saveState();
  render();
}

function selectLeft(id, mode = "site") {
  state.activeLeftId = id;
  const left = currentLeft();
  state.activeContentId = left?.contents[0]?.id || "";
  state.mode = mode;
  saveState();
  render();
}

function renderChrome() {
  topMenuEl.innerHTML = state.topMenus
    .filter(menu => menu.id !== "home")
    .map(menu => `<button class="${menu.id === state.activeTopId ? "active" : ""}" data-top="${menu.id}">${menu.title}</button>`)
    .join("") + `<button class="${state.mode === "adminTop" ? "active" : ""}" data-admin-top>Admin page</button>`;
  homeLogo.classList.toggle("active", state.activeTopId === "home" && state.mode !== "adminTop");

  const top = currentTop();
  leftTitleEl.textContent = top.title;
  leftMenuEl.innerHTML = top.leftMenus.length
    ? top.leftMenus.map(menu => `<button class="${menu.id === state.activeLeftId ? "active" : ""}" data-left="${menu.id}">${menu.title}</button>`).join("")
    : `<p class="empty">Menu left dang trong.</p>`;
}

function render() {
  renderChrome();
  if (state.mode === "adminTop") renderAdminTop();
  else if (state.mode === "adminLeft") renderAdminLeft();
  else if (state.mode === "adminLayout") renderAdminLayout();
  else if (state.mode === "adminContent") renderAdminContent();
  else renderSite();
}

function renderSite() {
  const left = currentLeft();
  adminArea.innerHTML = `<section class="card"><h1>${currentTop().title}</h1><p>Chon "Admin page" tren menu top de quan tri noi dung dong.</p></section>`;
  previewArea.innerHTML = renderPreview(left, true);
}

function renderAdminTop() {
  adminArea.innerHTML = `
    <section class="card">
      <h1>Admin page - Menu top</h1>
      <div class="toolbar"><button class="btn" data-add-top>+ Them menu top</button></div>
      ${state.topMenus.filter(menu => menu.id !== "admin").map(menu => `
        <div class="item-row">
          <div class="item-title"><strong>${menu.title}</strong><span>${menu.locked ? "Trang chu/logo khong duoc sua, xoa" : "Menu top"}</span></div>
          <div class="actions">
            <button class="btn secondary" data-view-top="${menu.id}">View</button>
            ${menu.locked ? "" : `<button class="btn secondary" data-edit-top="${menu.id}">Edit</button><button class="btn danger" data-delete-top="${menu.id}">Delete</button>`}
          </div>
        </div>`).join("")}
    </section>`;
  previewArea.innerHTML = "";
}

function renderAdminLeft() {
  const top = currentTop();
  adminArea.innerHTML = `
    <section class="card">
      <h1>Admin menu left - ${top.title}</h1>
      <div class="toolbar">
        <button class="btn" data-add-left>+ Them menu left</button>
        ${top.id === "student" ? `<button class="btn secondary" data-reset-student>Reset Thong tin sinh vien</button>` : ""}
      </div>
      ${top.leftMenus.length ? top.leftMenus.map(menu => `
        <div class="item-row">
          <div class="item-title"><strong>${menu.title}</strong><span>${menu.contents.length} contents item</span></div>
          <div class="actions">
            <button class="btn secondary" data-view-left="${menu.id}">View</button>
            <button class="btn secondary" data-edit-left="${menu.id}">Edit</button>
            <button class="btn danger" data-delete-left="${menu.id}">Delete</button>
          </div>
        </div>`).join("") : `<p class="empty">Chua co menu left. Bam + de them muc dau tien.</p>`}
    </section>`;
  previewArea.innerHTML = "";
}

function renderAdminLayout() {
  const left = currentLeft();
  adminArea.innerHTML = `
    <section class="card">
      <h1>Admin contents layout - ${left ? left.title : "Chua co menu left"}</h1>
      <div class="toolbar">
        <button class="btn" data-add-content>+ Them contents</button>
        <button class="btn secondary" data-open-help>i Huong dan layout</button>
      </div>
      ${left?.contents.length ? left.contents.map(item => `
        <div class="item-row">
          <div class="item-title"><strong>${item.title}</strong><span>span ${item.span}/12, rows ${item.rows}</span></div>
          <div class="actions">
            <button class="btn secondary" data-view-content="${item.id}">View</button>
            <button class="btn secondary" data-edit-content="${item.id}">Edit</button>
            <button class="btn danger" data-delete-content="${item.id}">Delete</button>
          </div>
        </div>`).join("") : `<p class="empty">Chua co contents. Bam + de tao muc dau tien.</p>`}
    </section>`;
  previewArea.innerHTML = renderPreview(left, false);
}

function renderAdminContent() {
  const item = currentContent();
  const left = currentLeft();
  if (!item) {
    adminArea.innerHTML = `<section class="card"><h1>Admin contents</h1><p class="empty">Chua co contents item.</p></section>`;
    previewArea.innerHTML = "";
    return;
  }
  adminArea.innerHTML = `
    <section class="card">
      <h1>Admin contents - ${item.title}</h1>
      <label class="wide">Ma HTML noi dung
        <textarea id="content-editor">${escapeHtml(item.html)}</textarea>
      </label>
    </section>`;
  previewArea.innerHTML = renderPreview(left, true);
  document.querySelector("#content-editor").addEventListener("input", event => {
    item.html = event.target.value;
    saveState();
    previewArea.innerHTML = renderPreview(left, true);
  });
}

function renderPreview(left, renderHtml) {
  if (!left) return `<section class="card"><p class="empty">Chua co menu left de preview.</p></section>`;
  if (!left.contents.length) return `<section class="card"><p class="empty">Trang contents dang trong.</p></section>`;
  return `<section class="card"><h2>Preview layout</h2><div class="preview-grid">${left.contents.map(item => `
    <div class="content-box" style="grid-column:span ${Number(item.span) || 12}; grid-row:span ${Number(item.rows) || 1}; min-height:${120 * (Number(item.rows) || 1)}px; ${item.style || ""}">
      ${renderHtml ? item.html : `<h3>${item.title}</h3>`}
    </div>`).join("")}</div></section>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function promptText(label, current = "") {
  const value = prompt(label, current);
  return value === null ? null : value.trim();
}

topMenuEl.addEventListener("click", event => {
  const topButton = event.target.closest("[data-top]");
  if (topButton) selectTop(topButton.dataset.top, "site");
  if (event.target.closest("[data-admin-top]")) setMode("adminTop");
});

homeLogo.addEventListener("click", () => selectTop("home", "site"));

leftMenuEl.addEventListener("click", event => {
  const button = event.target.closest("[data-left]");
  if (button) selectLeft(button.dataset.left, "site");
});

document.addEventListener("click", event => {
  const target = event.target;
  if (target.matches("[data-add-top]")) {
    const title = promptText("Ten menu top moi");
    if (!title) return;
    const id = uid("top");
    state.topMenus.push({ id, title, leftMenus: [] });
    state.activeTopId = id;
    state.activeLeftId = "";
    state.activeContentId = "";
    saveState();
    render();
  }
  if (target.matches("[data-edit-top]")) {
    const menu = state.topMenus.find(item => item.id === target.dataset.editTop);
    const title = promptText("Sua ten menu top", menu.title);
    if (!title) return;
    menu.title = title;
    saveState();
    render();
  }
  if (target.matches("[data-delete-top]")) {
    state.topMenus = state.topMenus.filter(item => item.id !== target.dataset.deleteTop);
    state.activeTopId = "home";
    saveState();
    render();
  }
  if (target.matches("[data-view-top]")) selectTop(target.dataset.viewTop, "adminLeft");
  if (target.matches("[data-add-left]")) {
    const top = currentTop();
    const title = promptText("Ten menu left moi");
    if (!title) return;
    const id = uid("left");
    top.leftMenus.push({ id, title, contents: [] });
    state.activeLeftId = id;
    state.activeContentId = "";
    saveState();
    render();
  }
  if (target.matches("[data-edit-left]")) {
    const menu = currentTop().leftMenus.find(item => item.id === target.dataset.editLeft);
    const title = promptText("Sua ten menu left", menu.title);
    if (!title) return;
    menu.title = title;
    saveState();
    render();
  }
  if (target.matches("[data-delete-left]")) {
    const top = currentTop();
    top.leftMenus = top.leftMenus.filter(item => item.id !== target.dataset.deleteLeft);
    state.activeLeftId = top.leftMenus[0]?.id || "";
    state.activeContentId = top.leftMenus[0]?.contents[0]?.id || "";
    saveState();
    render();
  }
  if (target.matches("[data-view-left]")) selectLeft(target.dataset.viewLeft, "adminLayout");
  if (target.matches("[data-open-help]")) window.open("help.html", "_blank");
  if (target.matches("[data-add-content]")) editContent();
  if (target.matches("[data-edit-content]")) editContent(target.dataset.editContent);
  if (target.matches("[data-delete-content]")) {
    const left = currentLeft();
    left.contents = left.contents.filter(item => item.id !== target.dataset.deleteContent);
    state.activeContentId = left.contents[0]?.id || "";
    saveState();
    render();
  }
  if (target.matches("[data-view-content]")) {
    state.activeContentId = target.dataset.viewContent;
    setMode("adminContent");
  }
  if (target.matches("[data-reset-student]")) resetStudent();
});

function editContent(id) {
  const left = currentLeft();
  if (!left) return;
  const item = id ? left.contents.find(content => content.id === id) : { id: uid("content"), title: "", span: 12, rows: 1, style: "", html: "<h3>Noi dung moi</h3><p>Nhap noi dung HTML tai Admin contents.</p>" };
  const title = promptText("Ten contents", item.title);
  if (!title) return;
  const span = Number(promptText("Grid column span (1-12)", item.span));
  const rows = Number(promptText("Grid row span (1-4)", item.rows));
  const style = prompt("CSS bo sung cho div contents", item.style || "");
  item.title = title;
  item.span = Math.max(1, Math.min(12, span || 12));
  item.rows = Math.max(1, Math.min(4, rows || 1));
  item.style = style === null ? item.style : style;
  if (!id) left.contents.push(item);
  state.activeContentId = item.id;
  saveState();
  render();
}

function resetStudent() {
  const top = state.topMenus.find(menu => menu.id === "student");
  top.leftMenus = clone(defaultState.topMenus.find(menu => menu.id === "student").leftMenus);
  state.activeTopId = "student";
  state.activeLeftId = top.leftMenus[0].id;
  state.activeContentId = top.leftMenus[0].contents[0].id;
  state.mode = "adminLeft";
  saveState();
  render();
}

render();
