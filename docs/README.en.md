# Study Log (Vanilla JS CRUD) / 학습 기록 CRUD

A minimal CRUD project built with **HTML + Vanilla JavaScript**.  
This project focuses on fundamentals: **data flow, rendering, filtering/search, and clean event handling**.

> ✅ Purpose: Learn & prove core frontend fundamentals (not framework-dependent)

---

## 🔥 Key Features
- ✅ Create / Read / Update / Delete (CRUD)
- ✅ Category(tag) filter
- ✅ Search (partial match)
- ✅ Event Delegation (`closest`)
- ✅ Safe rendering (escapeHTML / XSS prevention)
- ✅ LocalStorage persistence (browser-based DB)

---

## 🧩 Why this project?
Most developers start from frameworks (React/Next.js).  
I built this project first in **pure JS** to fully understand:

- DOM rendering & update patterns
- state(source of truth) management without libraries
- why `filter/search` logic should be separated from `render()`
- how to avoid beginner mistakes when code gets longer

This project became the base architecture for my Next.js + MongoDB version later.

---

## 🏗️ Architecture (Simple & Clean)
### Source of truth
```js
let items = []; // source of truth
Key Design Rule
✅ Calculate first, render later

visibleItems() → decides what should be shown

render() → rebuilds UI based on the result
```

This separation keeps code readable and maintainable even when features expand.

🔍 Filtering & Search Logic
```js
const visibleItems = () => {
  const query = q.value.trim().toLowerCase();
  const f = filter.value;

  return items.filter((it) => {
    const byFilter = f === "all" || it.tag === f;
    const bySearch = query === "" || it.text.toLowerCase().includes(query);
    return byFilter && bySearch;
  });
};
```
✅ I used includes() for simple substring matching.
This pattern is easily expandable (e.g. multi-keyword search, regex, tag multi-select, etc.)

🖱️ Event Delegation (Scalable Click Handling)
Instead of adding listeners to every button,
I use event delegation on the list container:

```js
list.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
});
```
Benefits:

works even after UI rerender

avoids duplicated listeners

scalable when new actions are added

🔐 Security: escapeHTML (XSS prevention)
This project renders user input safely:

```js
const escapeHtml = (s) =>
  s.replaceAll("&", "&amp;")
   .replaceAll("<", "&lt;")
   .replaceAll(">", "&gt;");
```
💾 Persistence: LocalStorage
This version uses LocalStorage as a lightweight DB:

fast

simple

perfect for small learning projects

Limitations:

device-dependent

not suitable for multi-device usage

➡️ This is why I later migrated to a DB-based Next.js version.

🚀 Live Demo
(Add URL here)

📸 Screenshot
(Add screenshots here)

✅ What I learned
CRUD fundamentals without frameworks

rendering patterns

separating logic from UI

debugging & preventing beginner mistakes

writing scalable event handling code

📌 Next Step (Migration)
This project was later migrated to:

Next.js

MongoDB

Vercel Deployment

JSON export/import

(Repo link here)

Author
GitHub: [(your profile)](https://github.com/kieeler123/JP-Dev-Study-Log)