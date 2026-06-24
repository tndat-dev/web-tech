const STORAGE_KEY = "it4409-mini2-state-v5";
const defaultState = {
  activeTopId: "home",
  activeLeftId: "home-news",
  activeContentId: "home-news-main",
  mode: "site",
  topMenus: [
    { id: "home", title: "Home", locked: true, leftMenus: [
      { id: "home-news", title: "Opening Information", contents: [
        { id: "home-news-main", title: "Course Announcements", span: 8, rows: 1, style: "", html: "<h3>Course Announcements</h3><p>Updates for the opening session, seminars, assignments, and mini project deadlines.</p>" },
        { id: "home-news-ad", title: "SIS Link", span: 4, rows: 1, style: "background:#fff7ed;", html: "<h3>SIS HUST</h3><p>Use the academic portal to check official course information.</p>" }
      ] }
    ] },
    { id: "course", title: "Course Information", leftMenus: [
      { id: "course-overview", title: "Course Description", contents: [
        { id: "course-overview-main", title: "IT4409", span: 12, rows: 1, style: "", html: "<h3>IT4409</h3><p>Web Technologies and e-Services: HTML, CSS, JavaScript, APIs, backend development, security, and deployment.</p>" }
      ] }
    ] },
    { id: "tech", title: "Web Technologies", leftMenus: [
      { id: "tech-front", title: "Frontend", contents: [
        { id: "tech-front-main", title: "HTML CSS JavaScript", span: 6, rows: 1, style: "", html: "<h3>Frontend</h3><p>Build responsive interfaces and interactive browser experiences.</p>" },
        { id: "tech-api-main", title: "Web API", span: 6, rows: 1, style: "", html: "<h3>Web API</h3><p>Use fetch/AJAX to connect to data services.</p>" }
      ] }
    ] },
    { id: "student", title: "Student Profile", leftMenus: [
      { id: "student-cv", title: "CV", contents: [
        { id: "student-cv-main", title: "Student CV", span: 12, rows: 1, style: "", html: "<h3>Nguyen Tuan Dat</h3><p><strong>Student ID:</strong> 20235907</p><p><strong>Email:</strong> Dat.NT235907@sis.hust.edu.vn</p><p><img src='assets/student.svg' alt='Student portrait' style='max-width:180px;border-radius:8px'></p>" }
      ] },
      { id: "student-projects", title: "Completed Projects", contents: [
        { id: "student-projects-main", title: "Projects", span: 12, rows: 1, style: "", html: "<h3>Completed Projects</h3><ul><li>IT4409 course introduction website.</li><li>Personal task management app built with JavaScript.</li></ul>" }
      ] },
      { id: "student-community", title: "Community Activities", contents: [
        { id: "student-community-main", title: "Activities", span: 12, rows: 1, style: "", html: "<h3>Community Activities</h3><ul><li>Joined student orientation activities.</li><li>Supported admission consultation events for the class/school.</li></ul>" }
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

function openAdminPath(topId, leftId, contentId, mode) {
  state.activeTopId = topId;
  state.activeLeftId = leftId;
  state.activeContentId = contentId;
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
    : `<p class="empty">The left menu is empty.</p>`;
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
  adminArea.innerHTML = `<section class="card"><h1>${currentTop().title}</h1><p>Select "Admin page" in the top menu to manage dynamic content.</p></section>`;
  previewArea.innerHTML = renderPreview(left, true);
}

function renderAdminTop() {
  adminArea.innerHTML = `
    <section class="card">
      <h1>Admin page - Menu top</h1>
      <p class="hint">Quick access for assignment requirements 2.4, 2.5, and 2.6:</p>
      <div class="shortcut-grid">
        <button class="shortcut" data-shortcut-layout>
          <strong>2.4 Admin contents layout</strong>
          <span>Manage content items and responsive layout.</span>
        </button>
        <button class="shortcut" data-shortcut-content>
          <strong>2.5 Admin contents</strong>
          <span>Edit HTML content and see live preview.</span>
        </button>
        <button class="shortcut" data-shortcut-reset>
          <strong>2.6 Reset Student Profile</strong>
          <span>Open Student Profile left-menu admin.</span>
        </button>
      </div>
      <div class="toolbar"><button class="btn" data-add-top>+ Add top menu</button></div>
      ${state.topMenus.filter(menu => menu.id !== "admin").map(menu => `
        <div class="item-row">
          <div class="item-title"><strong>${menu.title}</strong><span>${menu.locked ? "Home/logo cannot be edited or deleted" : "Top menu"}</span></div>
          <div class="actions">
            <button class="btn secondary" data-view-top="${menu.id}">Open Left Menu</button>
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
      <p class="hint">Click <strong>Open Layout</strong> to go to requirement 2.4. For Student Profile, the reset button for requirement 2.6 is shown below.</p>
      <div class="toolbar">
        <button class="btn" data-add-left>+ Add left menu</button>
        ${top.id === "student" ? `<button class="btn secondary" data-reset-student>Reset Student Profile</button>` : ""}
      </div>
      ${top.leftMenus.length ? top.leftMenus.map(menu => `
        <div class="item-row">
          <div class="item-title"><strong>${menu.title}</strong><span>${menu.contents.length} contents item</span></div>
          <div class="actions">
            <button class="btn secondary" data-view-left="${menu.id}">Open Layout</button>
            <button class="btn secondary" data-edit-left="${menu.id}">Edit</button>
            <button class="btn danger" data-delete-left="${menu.id}">Delete</button>
          </div>
        </div>`).join("") : `<p class="empty">No left menu yet. Click + to add the first item.</p>`}
    </section>`;
  previewArea.innerHTML = "";
}

function renderAdminLayout() {
  const left = currentLeft();
  adminArea.innerHTML = `
    <section class="card">
      <h1>2.4 Admin contents layout - ${left ? left.title : "No left menu"}</h1>
      <p class="hint">Add, edit, delete, and arrange content items. The preview below shows the responsive grid boxes.</p>
      <div class="toolbar">
        <button class="btn" data-add-content>+ Add content</button>
        <button class="btn secondary" data-open-help>i Layout guide</button>
      </div>
      ${left?.contents.length ? left.contents.map(item => `
        <div class="item-row">
          <div class="item-title"><strong>${item.title}</strong><span>span ${item.span}/12, rows ${item.rows}</span></div>
          <div class="actions">
            <button class="btn secondary" data-view-content="${item.id}">Edit Content</button>
            <button class="btn secondary" data-edit-content="${item.id}">Edit Layout</button>
            <button class="btn danger" data-delete-content="${item.id}">Delete</button>
          </div>
        </div>`).join("") : `<p class="empty">No content items yet. Click + to create the first one.</p>`}
    </section>`;
  previewArea.innerHTML = renderPreview(left, false);
}

function renderAdminContent() {
  const item = currentContent();
  const left = currentLeft();
  if (!item) {
    adminArea.innerHTML = `<section class="card"><h1>Admin contents</h1><p class="empty">No content item is available.</p></section>`;
    previewArea.innerHTML = "";
    return;
  }
  adminArea.innerHTML = `
    <section class="card">
      <h1>2.5 Admin contents - ${item.title}</h1>
      <p class="hint">Edit this content item's HTML. The preview below updates immediately and keeps the layout configured in 2.4.</p>
      <label class="wide">Content HTML
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
  if (!left) return `<section class="card"><p class="empty">No left menu is available for preview.</p></section>`;
  if (!left.contents.length) return `<section class="card"><p class="empty">The content page is empty.</p></section>`;
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
    const title = promptText("New top menu name");
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
    const title = promptText("Edit top menu name", menu.title);
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
  if (target.matches("[data-shortcut-layout]")) {
    openAdminPath("course", "course-overview", "course-overview-main", "adminLayout");
  }
  if (target.matches("[data-shortcut-content]")) {
    openAdminPath("student", "student-cv", "student-cv-main", "adminContent");
  }
  if (target.matches("[data-shortcut-reset]")) {
    openAdminPath("student", "student-cv", "student-cv-main", "adminLeft");
  }
  if (target.matches("[data-add-left]")) {
    const top = currentTop();
    const title = promptText("New left menu name");
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
    const title = promptText("Edit left menu name", menu.title);
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
  const item = id ? left.contents.find(content => content.id === id) : { id: uid("content"), title: "", span: 12, rows: 1, style: "", html: "<h3>New content</h3><p>Enter HTML content in Admin contents.</p>" };
  const title = promptText("Content title", item.title);
  if (!title) return;
  const span = Number(promptText("Grid column span (1-12)", item.span));
  const rows = Number(promptText("Grid row span (1-4)", item.rows));
  const style = prompt("Extra CSS for the content div", item.style || "");
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
