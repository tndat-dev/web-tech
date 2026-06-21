const image = "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80";

const sections = {
  home: {
    title: "Van hanh mon hoc",
    articles: [
      {
        id: "opening",
        title: "Thong tin khai giang",
        text: "Mon hoc IT4409 gioi thieu cac nen tang cua HTML, CSS, JavaScript, React, Web API, backend, bao mat va trien khai ung dung web. Sinh vien thuc hanh thong qua cac mini project tang dan ve do phuc tap.",
        img: image,
        ad: ["Tai lieu mon hoc", "https://sis.hust.edu.vn"]
      },
      {
        id: "seminar",
        title: "Seminar va bai tap lon",
        text: "Cac buoi seminar tap trung vao backend, deployment va tich hop dich vu truc tuyen. Sinh vien can chuan bi demo chay truc tiep tren browser va giai thich duoc cac quyet dinh ky thuat.",
        img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
        ad: ["Xem slide deployment", "../docs/lec_10-deployment_3.4m.pdf"]
      }
    ]
  },
  course: {
    title: "Thong tin mon hoc",
    articles: [
      {
        id: "overview",
        title: "Mo ta hoc phan",
        text: "IT4409 - Cong nghe Web va dich vu truc tuyen cung cap kien thuc ve thiet ke giao dien, lap trinh phia client, giao tiep voi Web API, xay dung backend, bao mat co ban va tich hop cac dich vu online.",
        img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
        ad: ["Cong thong tin dao tao HUST", "https://ctt.hust.edu.vn"]
      },
      {
        id: "outcomes",
        title: "Chuan dau ra",
        text: "Sau mon hoc, sinh vien co the xay dung website responsive, thao tac DOM bang JavaScript, goi API bang AJAX/fetch, to chuc noi dung dong va trien khai ung dung web co tich hop dich vu.",
        img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        ad: ["W3Schools Web Tutorials", "https://www.w3schools.com"]
      }
    ]
  },
  tech: {
    title: "Cac cong nghe Web",
    articles: [
      {
        id: "frontend",
        title: "Frontend",
        text: "Frontend gom HTML de mo ta cau truc, CSS de thiet ke giao dien responsive va JavaScript de tao trai nghiem dong. Cac framework nhu React giup chia giao dien thanh component de tai su dung.",
        img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
        ad: ["React documentation", "https://react.dev"]
      },
      {
        id: "backend",
        title: "Backend va Web API",
        text: "Backend xu ly nghiep vu, luu tru du lieu va cung cap API. Cac API REST/JSON cho phep frontend, mobile app va dich vu ben thu ba giao tiep voi nhau thong qua HTTP.",
        img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
        ad: ["MDN Web APIs", "https://developer.mozilla.org/en-US/docs/Web/API"]
      }
    ]
  },
  student: {
    title: "Thong tin sinh vien",
    articles: [
      {
        id: "cv",
        title: "Ho so ca nhan",
        custom: `
          <div class="student-card">
            <img class="avatar" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80" alt="Anh sinh vien">
            <div>
              <p><strong>Ho ten:</strong> Nguyễn Tuấn Đạt</p>
              <p><strong>Ma so SV:</strong> 20235907</p>
              <p><strong>Email:</strong> Dat.NT235907@sis.hust.edu.vn</p>
              <p><strong>Kinh nghiem Web:</strong> HTML, CSS, JavaScript, React co ban, goi API bang fetch.</p>
              <p><strong>So thich:</strong> Thiet ke giao dien gon gang, doc tai lieu cong nghe va xay dung san pham nho de hoc nhanh.</p>
            </div>
          </div>`,
        ad: ["Cap nhat CV ca nhan", "#cv"]
      },
      {
        id: "projects",
        title: "Du an da tham gia",
        text: "Website gioi thieu mon hoc, ung dung quan ly cong viec ca nhan, trang tim kiem du lieu tu API cong khai va cac bai lab trong mon Cong nghe Web.",
        img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
        ad: ["GitHub ca nhan", "https://github.com"]
      }
    ]
  }
};

const sideTitle = document.querySelector("#side-title");
const sideMenu = document.querySelector("#side-menu");
const content = document.querySelector("#content");
const buttons = document.querySelectorAll(".nav-button");

function render(sectionKey) {
  const section = sections[sectionKey];
  sideTitle.textContent = section.title;
  sideMenu.innerHTML = section.articles.map(article => (
    `<button class="side-link" data-target="${article.id}">${article.title}</button>`
  )).join("");

  content.innerHTML = section.articles.map(article => `
    <article class="article" id="${article.id}">
      <h2>${article.title}</h2>
      ${article.custom || `
        <div class="article-grid">
          <div><p>${article.text}</p></div>
          <img src="${article.img}" alt="${article.title}">
        </div>`}
      <a class="ad" href="${article.ad[1]}" target="_blank" rel="noopener">${article.ad[0]}</a>
    </article>
  `).join("");

  buttons.forEach(button => button.classList.toggle("active", button.dataset.section === sectionKey));
}

buttons.forEach(button => {
  button.addEventListener("click", () => render(button.dataset.section));
});

sideMenu.addEventListener("click", event => {
  const button = event.target.closest(".side-link");
  if (!button) return;
  document.getElementById(button.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
});

render("home");
