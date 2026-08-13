const AUTH_USER_HASH = "0cb89110978ae58d934adac55e243bcaa05ed57b67beb8dac270f6e807242022";
const AUTH_PASSWORD_HASH = "ddd35325925a90ebce0a66e51a7c6f7540c9c2be359d28ec4f77ead25560f613";
const AUTH_STORAGE_KEY = "vibe-authenticated";

const authForm = document.querySelector("#authForm");
const authUser = document.querySelector("#authUser");
const authPassword = document.querySelector("#authPassword");
const authError = document.querySelector("#authError");
const logoutButton = document.querySelector("#logoutButton");

async function hashText(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function setAuthenticated(isAuthenticated) {
  document.body.classList.toggle("auth-locked", !isAuthenticated);
  document.body.classList.toggle("auth-ready", isAuthenticated);

  if (isAuthenticated) {
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    authPassword.value = "";
    authUser.focus();
  }
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authError.hidden = true;

  const [userHash, passwordHash] = await Promise.all([
    hashText(authUser.value.trim()),
    hashText(authPassword.value)
  ]);

  if (userHash === AUTH_USER_HASH && passwordHash === AUTH_PASSWORD_HASH) {
    setAuthenticated(true);
    return;
  }

  authError.hidden = false;
  authPassword.value = "";
  authPassword.focus();
});

logoutButton.addEventListener("click", () => setAuthenticated(false));

if (localStorage.getItem(AUTH_STORAGE_KEY) === "true") {
  setAuthenticated(true);
} else {
  setAuthenticated(false);
}

const steps = [
  {
    title: "下提示詞",
    body: "要求 AI 製作精美靜態網站，並指定使用繁體中文回覆。提示詞要說清楚，避免產出需要伺服器或資料庫才能運作的方案。",
    output: "明確提示詞"
  },
  {
    title: "產出檔案",
    body: "取得 index.html、CSS、JavaScript 等前端檔案，並先在本機瀏覽器開啟確認。",
    output: "可直接開啟的前端檔案"
  },
  {
    title: "建立 Repository",
    body: "在 GitHub 建立公開 repo。若是個人首頁，名稱可用 username.github.io；一般專案也可以用自己的 repo 名稱。",
    output: "公開 GitHub repository"
  },
  {
    title: "啟用 Pages",
    body: "到 Settings > Pages，選擇 Deploy from a branch，分支選 main，等待 GitHub 完成部署。",
    output: "可分享的公開 URL"
  }
];

const stepPanel = document.querySelector("#stepPanel");
const stepTabs = [...document.querySelectorAll(".stepper__tab")];

function renderStep(index) {
  const item = steps[index];
  stepPanel.innerHTML = `
    <span class="step-panel__number">${index + 1}</span>
    <h3>${item.title}</h3>
    <p>${item.body}</p>
    <strong>產物：${item.output}</strong>
  `;

  stepTabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === index;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

stepTabs.forEach((tab) => {
  tab.addEventListener("click", () => renderStep(Number(tab.dataset.step)));
});

document.querySelectorAll(".qa__button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".qa");
    const collapsed = item.classList.toggle("is-collapsed");
    button.setAttribute("aria-expanded", String(!collapsed));
  });
});

const checks = [...document.querySelectorAll(".interactive-check input")];
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");

function updateProgress() {
  const done = checks.filter((input) => input.checked).length;
  const total = checks.length;
  progressText.textContent = `完成 ${done} / ${total}`;
  progressBar.style.width = `${(done / total) * 100}%`;
}

checks.forEach((input) => input.addEventListener("change", updateProgress));
renderStep(0);
updateProgress();
