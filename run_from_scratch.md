# Run From Scratch

This repository does not require dependency installation. All mini projects are static HTML/CSS/JavaScript pages and can be opened directly in a browser.

## 1. Check The Structure

```bash
ls
```

Project folders:

- `mini-project-1/`
- `mini-project-2/`
- `mini-project-3/`
- `mini-project-4/`

## 2. Run Mini Project #1

Open this file:

```text
mini-project-1/index.html
```

This is a responsive HTML/CSS page for IT4409. It includes a top navigator, left navigator, article/main content, advertisements, and footer.

## 3. Run Mini Project #2

Open this file:

```text
mini-project-2/index.html
```

This project uses DOM JavaScript and `localStorage` to manage menus and content. Quick test steps:

1. Click `Admin page` in the top menu.
2. Use the shortcut cards for `2.4 Admin contents layout`, `2.5 Admin contents`, and `2.6 Reset Student Profile`.
3. Test `Open Left Menu`, `+ Add top menu`, `Edit`, and `Delete`.
4. Test adding, editing, and deleting left menu items.
5. Click `View` on a left menu item to open `Admin contents layout`.
6. Test adding, editing, and deleting content items, then click `i Layout guide`.
7. Click `View` on a content item to open `Admin contents`, edit HTML in the textarea, and check that the preview updates immediately.
8. Open `Student Profile`, click `Admin page` -> `Open Left Menu` on `Student Profile`, then click `Reset Student Profile`.

If the browser has old data in `localStorage`, reset to the default data from DevTools Console:

```js
localStorage.removeItem("it4409-mini2-state-v5");
location.reload();
```

## 4. Run Mini Project #3

Open this file:

```text
mini-project-3/index.html
```

This project continues the My Wiki idea and calls the Wikipedia API with `fetch`, so it requires Internet access. Built-in sections:

- `Wikipedia Search`: search by keyword.
- `Featured topics`: load Wikipedia page summaries.
- `Random discovery`: load a random article.

You can add/delete content items and change the content type in `My Wiki Admin`: `HTML`, `Wikipedia Search`, `Wikipedia Page Summary`, or `Wikipedia Random Article`, then click `Update preview`.

If the browser has old data in `localStorage`, reset to the default data from DevTools Console:

```js
localStorage.removeItem("it4409-mini3-state-v4");
location.reload();
```

## 5. Run Mini Project #4 - MyGmail

Open this file:

```text
mini-project-4/index.html
```

This project implements the MyGmail workflow:

- Google login with Google Identity Services.
- Check and receive Gmail messages through Gmail API.
- Send email through Gmail API.
- Gemini chatbot through Gemini API.
- NganLuong payment payload preparation.

Required credentials:

- Google OAuth Client ID with Gmail API enabled and OAuth consent configured.
- Gemini API key.
- NganLuong merchant information for real payment integration.

Important: Gmail and Gemini calls require Internet access. Real NganLuong payment requires server-side request signing, so the browser app prepares the payload and links to the official integration document.

## 6. Student Information

- Full name: Nguyen Tuan Dat
- Student ID: 20235907
- Email: Dat.NT235907@sis.hust.edu.vn
