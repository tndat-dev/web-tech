const CONFIG_KEY = "mygmail-config-v1";
const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send"
].join(" ");

const configInputs = {
  googleClientId: document.querySelector("#google-client-id"),
  geminiApiKey: document.querySelector("#gemini-api-key"),
  nganluongMerchantId: document.querySelector("#nganluong-merchant-id"),
  nganluongReceiver: document.querySelector("#nganluong-receiver")
};

const authStatus = document.querySelector("#auth-status");
const mailList = document.querySelector("#mail-list");
const sendStatus = document.querySelector("#send-status");
const chatLog = document.querySelector("#chat-log");
const paymentOutput = document.querySelector("#payment-output");

let accessToken = "";
let tokenClient = null;

function loadConfig() {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (!saved) return;
  const config = JSON.parse(saved);
  Object.entries(configInputs).forEach(([key, input]) => {
    input.value = config[key] || "";
  });
}

function getConfig() {
  return Object.fromEntries(
    Object.entries(configInputs).map(([key, input]) => [key, input.value.trim()])
  );
}

function saveConfig() {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(getConfig()));
  setStatus(authStatus, "Configuration saved. Sign in with Google to use Gmail.", "warning");
}

function clearConfig() {
  localStorage.removeItem(CONFIG_KEY);
  Object.values(configInputs).forEach(input => {
    input.value = "";
  });
  accessToken = "";
  tokenClient = null;
  setStatus(authStatus, "Configuration cleared.", "warning");
}

function setStatus(element, message, type = "ok") {
  element.className = `status ${type}`;
  element.textContent = message;
}

function ensureGoogleClient() {
  const { googleClientId } = getConfig();
  if (!googleClientId) {
    throw new Error("Enter a Google OAuth Client ID first.");
  }
  if (!window.google?.accounts?.oauth2) {
    throw new Error("Google Identity Services has not loaded yet. Check your Internet connection.");
  }
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: googleClientId,
    scope: GMAIL_SCOPES,
    callback: tokenResponse => {
      if (tokenResponse.error) {
        setStatus(authStatus, tokenResponse.error, "error");
        return;
      }
      accessToken = tokenResponse.access_token;
      setStatus(authStatus, "Signed in. Gmail API is ready.", "ok");
    }
  });
}

function loginGoogle() {
  try {
    ensureGoogleClient();
    tokenClient.requestAccessToken({ prompt: "consent" });
  } catch (error) {
    setStatus(authStatus, error.message, "error");
  }
}

function logoutGoogle() {
  if (accessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(accessToken);
  }
  accessToken = "";
  setStatus(authStatus, "Signed out.", "warning");
}

function requireAccessToken() {
  if (!accessToken) {
    throw new Error("Sign in with Google first.");
  }
}

async function gmailFetch(path, options = {}) {
  requireAccessToken();
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Gmail API request failed.");
  }
  return data;
}

async function loadMessages(query = "") {
  try {
    mailList.className = "mail-list empty";
    mailList.textContent = "Loading Gmail messages...";
    const list = await gmailFetch(`messages?maxResults=10${query ? `&q=${encodeURIComponent(query)}` : ""}`);
    if (!list.messages?.length) {
      mailList.textContent = "No messages found.";
      return;
    }

    const messages = await Promise.all(
      list.messages.map(message => gmailFetch(`messages/${message.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`))
    );
    mailList.className = "mail-list";
    mailList.innerHTML = messages.map(renderMailItem).join("");
  } catch (error) {
    mailList.className = "mail-list empty";
    mailList.textContent = error.message;
  }
}

function headerValue(message, name) {
  return message.payload.headers.find(header => header.name.toLowerCase() === name.toLowerCase())?.value || "";
}

function renderMailItem(message) {
  const from = escapeHtml(headerValue(message, "From") || "Unknown sender");
  const subject = escapeHtml(headerValue(message, "Subject") || "(no subject)");
  const date = escapeHtml(headerValue(message, "Date"));
  const snippet = escapeHtml(message.snippet || "");
  return `
    <div class="mail-item">
      <strong>${subject}</strong>
      <span>${from}</span>
      <span>${date}</span>
      <p>${snippet}</p>
    </div>`;
}

function buildRawEmail({ to, subject, body }) {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    body
  ].join("\r\n");
  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sendMail() {
  const to = document.querySelector("#mail-to").value.trim();
  const subject = document.querySelector("#mail-subject").value.trim();
  const body = document.querySelector("#mail-body").value.trim();
  if (!to || !subject || !body) {
    setStatus(sendStatus, "Fill in To, Subject, and Message before sending.", "warning");
    return;
  }
  try {
    setStatus(sendStatus, "Sending email...", "warning");
    await gmailFetch("messages/send", {
      method: "POST",
      body: JSON.stringify({ raw: buildRawEmail({ to, subject, body }) })
    });
    setStatus(sendStatus, "Email sent successfully.", "ok");
  } catch (error) {
    setStatus(sendStatus, error.message, "error");
  }
}

function appendChat(role, text) {
  if (chatLog.classList.contains("empty")) {
    chatLog.className = "chat-log";
    chatLog.innerHTML = "";
  }
  const div = document.createElement("div");
  div.className = `chat-message ${role}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function sendChat() {
  const { geminiApiKey } = getConfig();
  const input = document.querySelector("#chat-message");
  const message = input.value.trim();
  if (!geminiApiKey) {
    appendChat("bot", "Enter and save a Gemini API key first.");
    return;
  }
  if (!message) return;
  input.value = "";
  appendChat("user", message);
  appendChat("bot", "Thinking...");

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API request failed.");
    }
    const text = data.candidates?.[0]?.content?.parts?.map(part => part.text).join("\n") || "No response text.";
    chatLog.lastElementChild.textContent = text;
  } catch (error) {
    chatLog.lastElementChild.textContent = error.message;
  }
}

function buildPaymentPayload() {
  const config = getConfig();
  const payload = {
    provider: "NganLuong",
    note: "This browser-only demo prepares the payment data. A production integration must sign and submit this request on a backend server.",
    merchantId: config.nganluongMerchantId,
    receiverEmail: config.nganluongReceiver,
    orderId: document.querySelector("#order-id").value.trim(),
    amount: Number(document.querySelector("#payment-amount").value),
    currency: "VND",
    description: document.querySelector("#payment-description").value.trim(),
    returnUrl: document.querySelector("#return-url").value.trim(),
    student: {
      fullName: "Nguyen Tuan Dat",
      studentId: "20235907",
      email: "Dat.NT235907@sis.hust.edu.vn"
    }
  };
  paymentOutput.textContent = JSON.stringify(payload, null, 2);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

document.querySelector("#save-config").addEventListener("click", saveConfig);
document.querySelector("#clear-config").addEventListener("click", clearConfig);
document.querySelector("#google-login").addEventListener("click", loginGoogle);
document.querySelector("#google-logout").addEventListener("click", logoutGoogle);
document.querySelector("#load-inbox").addEventListener("click", () => loadMessages(""));
document.querySelector("#load-unread").addEventListener("click", () => loadMessages("is:unread"));
document.querySelector("#send-mail").addEventListener("click", sendMail);
document.querySelector("#send-chat").addEventListener("click", sendChat);
document.querySelector("#chat-message").addEventListener("keydown", event => {
  if (event.key === "Enter") sendChat();
});
document.querySelector("#build-payment").addEventListener("click", buildPaymentPayload);

loadConfig();
