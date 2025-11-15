// study.js

const STORAGE_KEY = "studyLogs";

// DOM 요소
const logForm = document.getElementById("log-form");
const categorySelect = document.getElementById("category");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const filterSelect = document.getElementById("filter");
const searchInput = document.getElementById("search");
const logList = document.getElementById("log-list");

// 현재 편집 중인 로그 ID (없으면 null)
let editingId = null;

// ===== 데이터 관련 유틸 =====

function loadLogs() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse logs:", e);
    return [];
  }
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getCategoryLabel(category) {
  if (category === "japanese") return "日本語";
  if (category === "coding") return "コーディング";
  return "その他";
}

// ===== 렌더링 =====

function renderLogs() {
  const logs = loadLogs();
  const filter = filterSelect.value;
  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = logs
    .filter((log) => (filter === "all" ? true : log.category === filter))
    .filter((log) => {
      if (!keyword) return true;
      const text = `${log.title} ${log.content}`.toLowerCase();
      return text.includes(keyword);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순

  logList.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "条件に合うログがありません。";
    empty.className = "log-empty";
    logList.appendChild(empty);
    return;
  }

  filtered.forEach((log) => {
    const item = document.createElement("article");
    item.className = "log-item";

    const header = document.createElement("div");
    header.className = "log-header";

    const left = document.createElement("div");
    const badge = document.createElement("span");
    badge.className = "log-badge";
    badge.textContent = getCategoryLabel(log.category);

    const date = document.createElement("span");
    date.className = "log-date";
    date.textContent = formatDate(log.date);

    left.appendChild(badge);

    header.appendChild(left);
    header.appendChild(date);

    const title = document.createElement("h4");
    title.className = "log-title";
    title.textContent = log.title;

    const content = document.createElement("p");
    content.className = "log-content";
    content.textContent = log.content;

    // 버튼 영역 (편집/삭제)
    const actions = document.createElement("div");
    actions.className = "log-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn small-btn";
    editBtn.textContent = "編集";
    editBtn.addEventListener("click", () => startEdit(log.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn small-btn danger-btn";
    deleteBtn.textContent = "削除";
    deleteBtn.addEventListener("click", () => deleteLog(log.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(header);
    item.appendChild(title);
    item.appendChild(content);
    item.appendChild(actions);

    logList.appendChild(item);
  });
}

// ===== CRUD 동작 =====

// 새 로그 or 수정 저장
logForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const category = categorySelect.value;
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("タイトルと内容を入力してください。");
    return;
  }

  const logs = loadLogs();

  if (editingId !== null) {
    // 수정 모드
    const updated = logs.map((log) =>
      log.id === editingId
        ? {
            ...log,
            category,
            title,
            content,
            // 수정해도 날짜 그대로 둘 수도 있고, 아래처럼 갱신할 수도 있음
            date: log.date,
          }
        : log
    );
    saveLogs(updated);
    editingId = null;
    logForm.querySelector('button[type="submit"]').textContent = "保存する";
  } else {
    // 새로 추가
    const newLog = {
      id: Date.now(),
      category,
      title,
      content,
      date: new Date().toISOString(),
    };
    logs.push(newLog);
    saveLogs(logs);
  }

  // 폼 초기화
  titleInput.value = "";
  contentInput.value = "";
  categorySelect.value = "japanese";

  renderLogs();
});

// 편집 시작
function startEdit(id) {
  const logs = loadLogs();
  const target = logs.find((log) => log.id === id);
  if (!target) return;

  editingId = id;
  categorySelect.value = target.category;
  titleInput.value = target.title;
  contentInput.value = target.content;

  logForm.querySelector('button[type="submit"]').textContent = "更新する";
  titleInput.focus();
}

// 삭제
function deleteLog(id) {
  if (!confirm("このログを削除しますか？")) return;

  const logs = loadLogs();
  const filtered = logs.filter((log) => log.id !== id);
  saveLogs(filtered);

  // 혹시 편집 중이던 항목을 지웠다면 편집 상태 해제
  if (editingId === id) {
    editingId = null;
    logForm.querySelector('button[type="submit"]').textContent = "保存する";
    titleInput.value = "";
    contentInput.value = "";
    categorySelect.value = "japanese";
  }

  renderLogs();
}

// 필터, 검색 이벤트
filterSelect.addEventListener("change", () => {
  renderLogs();
});

searchInput.addEventListener("input", () => {
  renderLogs();
});

// 초기 렌더링
document.addEventListener("DOMContentLoaded", () => {
  renderLogs();
});
