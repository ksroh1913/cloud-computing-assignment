const statusDot = document.querySelector("#status-dot");
const statusText = document.querySelector("#status-text");
const apiMessage = document.querySelector("#api-message");
const apiStatus = document.querySelector("#api-status");
const serverTime = document.querySelector("#server-time");
const retryButton = document.querySelector("#retry-button");
const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector(".theme-label");

const API_BASE_URL = (window.APP_CONFIG?.API_BASE_URL || "http://127.0.0.1:8000").replace(
  /\/$/,
  "",
);

function setConnectionState(state, message) {
  statusDot.className = `status-dot is-${state}`;
  statusText.textContent = message;
}

function formatServerTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Seoul",
  }).format(date);
}

async function connectToBackend() {
  setConnectionState("loading", "FastAPI 서버에 연결하는 중입니다.");
  apiMessage.textContent = "Vercel의 이 페이지가 Render의 API에 요청을 보내고 있습니다.";
  apiStatus.textContent = "확인 중";
  serverTime.textContent = "—";
  retryButton.disabled = true;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    setConnectionState("success", "프론트엔드와 백엔드가 연결되었습니다.");
    apiMessage.textContent = data.message;
    apiStatus.textContent = data.status.toUpperCase();
    serverTime.textContent = formatServerTime(data.server_time);
  } catch (error) {
    const detail = error.name === "AbortError" ? "응답 시간이 초과되었습니다." : "API 응답을 받지 못했습니다.";
    setConnectionState("error", "백엔드 연결을 확인해 주세요.");
    apiMessage.textContent = `${detail} Render 무료 서버가 잠든 경우 잠시 뒤 다시 연결해 주세요.`;
    apiStatus.textContent = "연결 실패";
  } finally {
    window.clearTimeout(timeoutId);
    retryButton.disabled = false;
  }
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "밝은 화면으로 전환" : "어두운 화면으로 전환",
  );
  themeLabel.textContent = isDark ? "Light" : "Dark";
}

function initializeTheme() {
  const storedTheme = localStorage.getItem("theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  applyTheme(storedTheme || preferredTheme);
}

function initializeRevealAnimation() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  elements.forEach((element) => observer.observe(element));
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", nextTheme);
  applyTheme(nextTheme);
});

retryButton.addEventListener("click", connectToBackend);

initializeTheme();
initializeRevealAnimation();
connectToBackend();
