const image = "assets/web-learning.svg";

const sections = {
  home: {
    title: "Course Operations",
    articles: [
      {
        id: "opening",
        title: "Opening Information",
        text: "IT4409 introduces the foundations of HTML, CSS, JavaScript, React, Web APIs, backend development, web security, and deployment. Students practice through mini projects with gradually increasing complexity.",
        img: image,
        ad: ["Course resources", "https://sis.hust.edu.vn", "assets/ad-docs.svg"]
      },
      {
        id: "seminar",
        title: "Seminars and Major Assignments",
        text: "Seminars focus on backend development, deployment, and online service integration. Students should prepare browser-based demos and be ready to explain their technical decisions.",
        img: "assets/seminar.svg",
        ad: ["View deployment slides", "../docs/lec_10-deployment_3.4m.pdf", "assets/ad-docs.svg"]
      }
    ]
  },
  course: {
    title: "Course Information",
    articles: [
      {
        id: "overview",
        title: "Course Description",
        text: "IT4409 - Web Technologies and e-Services provides knowledge about interface design, client-side programming, Web API communication, backend development, basic security, and online service integration.",
        img: "assets/course.svg",
        ad: ["HUST academic portal", "https://ctt.hust.edu.vn", "assets/ad-docs.svg"]
      },
      {
        id: "outcomes",
        title: "Learning Outcomes",
        text: "After the course, students can build responsive websites, manipulate the DOM with JavaScript, call APIs with AJAX/fetch, organize dynamic content, and deploy web applications with service integrations.",
        img: "assets/web-learning.svg",
        ad: ["W3Schools Web Tutorials", "https://www.w3schools.com", "assets/ad-docs.svg"]
      }
    ]
  },
  tech: {
    title: "Web Technologies",
    articles: [
      {
        id: "frontend",
        title: "Frontend",
        text: "Frontend development uses HTML for structure, CSS for responsive presentation, and JavaScript for dynamic experiences. Frameworks such as React help split interfaces into reusable components.",
        img: "assets/frontend.svg",
        ad: ["React documentation", "https://react.dev", "assets/ad-tech.svg"]
      },
      {
        id: "backend",
        title: "Backend va Web API",
        text: "Backend systems handle business logic, data storage, and API endpoints. REST/JSON APIs allow frontends, mobile apps, and third-party services to communicate over HTTP.",
        img: "assets/backend.svg",
        ad: ["MDN Web APIs", "https://developer.mozilla.org/en-US/docs/Web/API", "assets/ad-tech.svg"]
      }
    ]
  },
  student: {
    title: "Student Profile",
    articles: [
      {
        id: "cv",
        title: "Personal Profile",
        custom: `
          <div class="student-card">
            <img class="avatar" src="assets/student.svg" alt="Student portrait">
            <div>
              <p><strong>Full name:</strong> Nguyen Tuan Dat</p>
              <p><strong>Student ID:</strong> 20235907</p>
              <p><strong>Email:</strong> Dat.NT235907@sis.hust.edu.vn</p>
              <p><strong>Web experience:</strong> HTML, CSS, JavaScript, basic React, and API calls with fetch.</p>
              <p><strong>Interests:</strong> Clean interface design, technology documentation, and building small products to learn quickly.</p>
            </div>
          </div>`,
        ad: ["View student profile", "#cv", "assets/ad-profile.svg"]
      },
      {
        id: "projects",
        title: "Projects",
        text: "A course introduction website, a personal task management app, a public API search page, and the lab exercises for the Web Technologies course.",
        img: "assets/web-learning.svg",
        ad: ["Personal GitHub", "https://github.com", "assets/ad-profile.svg"]
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
      <a class="ad" href="${article.ad[1]}" target="_blank" rel="noopener">
        <img src="${article.ad[2]}" alt="${article.ad[0]}">
        <span>${article.ad[0]}</span>
      </a>
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
