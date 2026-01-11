# Original Version Notes (HTML/JS) / 원본 버전 기록

## 0) 목적
이 문서는 Next.js 버전으로 확장하기 전,
**원본 HTML + Vanilla JS(LocalStorage 기반) 버전**을 기록하기 위한 문서다.

- 면접 어필용 문서가 아니라 **개인 유지보수/회고용 문서**
- 시간이 지나도 “왜 이렇게 만들었는지”를 다시 이해할 수 있게 남긴다.

---

## 1) 왜 원본 버전을 만들었는가? (Reason)
### 1.1 실무/면접용이 아니라 “기본기 검증용”
원본 프로젝트는 다음을 목적으로 만든 최소 구현(MVP)이었다.

- CRUD(추가/조회/수정/삭제) 흐름 이해
- filter/search 같은 UI 상태 변화 경험
- **render 함수 중심 설계** 연습
- LocalStorage 기반 상태 저장 흐름 이해

즉, “화려한 기능”이 아니라  
**구조와 사고 과정을 만들기 위해** 시작했다.

### 1.2 Next.js/DB를 바로 쓰지 않은 이유
처음부터 DB(MongoDB)와 서버를 붙이면:

- 학습 대상이 너무 많아짐
- CRUD 기본구조(데이터 흐름)가 흐려짐
- 에러 원인을 못 찾을 위험이 증가

그래서 원본 버전은 “DB 없이 UI/상태 흐름만”으로 완성했다.

---

## 2) 데이터 구조 (Data Model)
원본 버전에서 사용한 데이터 구조는 아래와 같다.

```js
{
  id: string,      // crypto.randomUUID()
  title: string,   // 입력값
  content: string, // 입력값
  tag: string,     // category
  date: string     // new Date().toISOString()
}
원본에 따라 필드명은 다를 수 있으나 핵심은 동일:
id + user text + category + timestamp

3) 핵심 설계 철학
원본 버전에서 가장 중요하게 지킨 원칙:

3.1 Source of truth는 items 배열
items가 항상 원본 데이터(source of truth)

화면은 items를 그대로 뿌리는 것이 아니라,
필터/검색 결과만 선별한 배열을 기반으로 render한다.

js
コードをコピーする
let items = []; // source of truth
3.2 계산과 표현을 분리한다
“보여줄 데이터 계산” → visibleItems()

“DOM에 표시(render)” → render()

즉,

visibleItems = 계산

render = 표현

4) visibleItems()의 역할
4.1 함수 목적
검색(query) + 필터(tag/filter) 조건을 적용하여
현재 UI에서 실제로 보여야 하는 항목만 반환한다.

js
コードをコピーする
const visibleItems = () => {
  const query = q.value.trim().toLowerCase();
  const f = filter.value;

  return items.filter((it) => {
    const byFilter = f === "all" || it.tag === f;
    const bySearch = query === "" || it.text.toLowerCase().includes(query);
    return byFilter && bySearch;
  });
};
4.2 왜 query/filter를 const로 새로 뽑았나?
다음과 같은 장점이 있다.

DOM에서 value를 여러 번 읽는 것보다, 한 번 읽고 변수로 고정

“이번 렌더에서의 조건 값”이 명확해짐

디버깅이 쉬움 (console.log로 query/filter 확인 가능)

5) render()의 역할
5.1 함수 목적
visibleItems()를 호출해서 받은 목록만 DOM에 출력한다.

DOM 리스트는 render 때마다 초기화 후 재구성한다.

js
コードをコピーする
const render = () => {
  list.innerHTML = "";
  for (const it of visibleItems()) {
    // create li, attach dataset, append
  }
};
5.2 render를 “통제 지점”으로 두는 이유
원본 버전은 상태가 변경될 때마다 항상 render()만 호출하면 되도록 설계했다.

add → items 변경 → render()

edit → items 변경 → render()

delete → items 변경 → render()

search/filter → UI 변경 → render()

=> 최종적으로 UI는 항상 render에 의해 재생성되므로
상태와 화면이 불일치할 가능성이 줄어든다.

6) 이벤트 처리 구조
6.1 submit = Create
js
コードをコピーする
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // input 읽기
  // items.unshift(...)
  // render()
});
6.2 Event Delegation
삭제/수정 버튼은 각 항목마다 이벤트를 붙이지 않고,
부모(list)에 click 이벤트를 1개만 붙여 처리했다.

js
コードをコピーする
list.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
});
장점:

렌더링으로 DOM이 계속 재생성되어도 이벤트 유지됨

코드가 단순해짐

실무에서도 자주 쓰는 패턴

7) edit / delete의 return 처리 기록
원본 코드에서는 delete 처리 후 return이 있는 경우가 있었다.

js
コードをコピーする
if (btn.dataset.act === "del") {
  items = items.filter((x) => x.id !== id);
  render();
  return;
}
edit 쪽은 마지막 블록이면 return이 없어도 동작한다.
하지만 조건이 늘어나면(액션이 많아지면) 의도치 않은 동작을 막기 위해
액션 처리 후 return으로 빠져나오는 패턴을 통일하는 것이 안전하다.

8) 보안 관련 (escapeHTML)
사용자 입력을 그대로 innerHTML에 넣으면 XSS 위험이 있으므로
텍스트 출력 시 escape 처리함.

js
コードをコピーする
const escapeHtml = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
9) 원본 버전의 한계 (Limitations)
이 버전은 “기초 구조 학습”을 목표로 했기 때문에 아래는 의도적으로 생략했다.

DB 저장 / 사용자별 데이터 분리

로그인 / 권한 처리

서버 API 분리

페이지네이션 / 무한스크롤

반응형 완성도

테스트 코드