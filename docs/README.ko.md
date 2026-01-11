# Study Log (Vanilla JS CRUD) / 학습 기록 CRUD

이 프로젝트는 **HTML + Vanilla JavaScript**만으로 만든 최소 CRUD 프로젝트입니다.  
프레임워크(React/Next.js)에 의존하지 않고도, **프론트엔드 기본기(데이터 흐름 / 렌더링 / 검색 / 필터 / 이벤트 처리)**를 이해하고 설명할 수 있는 상태를 만들기 위해 제작했습니다.

**Languages:** [日本語](README.md) | 한국어 | [English](README.en.md)

---

## ✅ 기능 목록
- ✅ CRUD (추가 / 조회 / 수정 / 삭제)
- ✅ 카테고리(tag) 필터
- ✅ 검색(부분 일치)
- ✅ 이벤트 위임(Event Delegation, `closest()`)
- ✅ XSS 방지(escapeHTML)
- ✅ LocalStorage 기반 데이터 저장(브라우저 저장)

---

## 🎯 이 프로젝트를 만든 이유
React / Next.js 같은 프레임워크를 사용하기 전에,  
Vanilla JS로 아래 내용을 **“이해하고 설명할 수 있는 상태”**로 만들기 위해 시작했습니다.

- DOM 렌더링 및 업데이트 패턴 이해
- 상태(source of truth) 설계 감각 기르기
- 필터/검색 로직을 렌더링(render)에서 분리하는 이유 체감
- 코드가 길어져도 깨지지 않는 이벤트 처리 패턴 연습

※ 이 구조는 이후 Next.js + MongoDB 버전으로 확장할 때도 기반이 되었습니다.

---

## 🧩 설계 (Architecture)
### ✅ Source of truth
```js
let items = []; // source of truth
```
🔍 검색/필터 처리 (visibleItems)
이 프로젝트의 핵심 원칙은:

✅ 먼저 계산 → 그 결과를 렌더링

visibleItems() : 현재 UI에서 보여줄 데이터를 계산

render() : 계산된 결과만 화면에 출력

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
🖱️ 이벤트 위임(Event Delegation)
각 항목마다 이벤트를 붙이는 대신, 리스트 컨테이너에 클릭 이벤트 하나만 두고 처리합니다.

```js
list.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
});
```
✅ 장점
렌더링으로 DOM이 재생성되어도 동작 유지

이벤트 리스너가 불필요하게 늘어나는 문제 방지

액션(edit/delete 등) 추가가 쉬움

🔐 보안: XSS 방지(escapeHTML)
사용자 입력이 innerHTML에 들어가므로 XSS 위험이 있습니다.
따라서 출력 시 escape 처리를 수행합니다.

```js
const escapeHtml = (s) =>
  s.replaceAll("&", "&amp;")
   .replaceAll("<", "&lt;")
   .replaceAll(">", "&gt;");
```
💾 LocalStorage 저장
LocalStorage를 간단한 저장소(DB)처럼 사용했습니다.

✅ 채택 이유
학습 프로젝트에 적합(간단, 빠름)

DB 없이 CRUD 구조를 먼저 잡기 좋음

⚠️ 한계
기기 종속(다른 기기에서는 데이터 확인 불가)

사용자별 데이터 분리 불가

➡️ 이 문제를 해결하기 위해 이후 Next.js + MongoDB 버전으로 확장했습니다.

🚀 데모
(여기에 URL 추가)

📸 스크린샷
(여기에 이미지 추가)

✅ 이 프로젝트로 얻은 것
프레임워크 없이 CRUD를 직접 구현해본 경험

상태 → 계산 → 렌더링 구조 이해

유지보수에 강한 이벤트 처리 습관

코드가 길어졌을 때 발생하는 초보 실수 예방

📌 Next Step (확장)
원본 구조를 기반으로 아래 기능을 갖춘 Next.js 버전도 제작했습니다.

Next.js Route Handler 기반 API

MongoDB(영속 저장)

JSON export/import

Vercel 배포

(Next.js 버전 Repo 링크 추가)

Author
GitHub: https://github.com/kieeler123