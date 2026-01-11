# CRUD Notes (Vanilla JS) / CRUD 기록

> 목적: CRUD를 반복해서 만들면서 “구조 이해 + 실수 패턴 제거 + 설명력 강화”

---

## 1) includes() 역할
### KR
- `string.includes(substring)`는 문자열 안에 부분 문자열이 포함되어 있는지 확인한다.
- 반환값: `true / false`
- 검색 기능에서 핵심: `it.text.toLowerCase().includes(query)`

### JP（要点）
- `includes()` は文字列に部分一致するかを判定（true/false）

---

## 2) visibleItems()의 의미
### KR
- source of truth: `items` (원본 배열)
- `visibleItems()`는 “화면에 보여줄 목록”만 따로 계산한다.
- 이유: 렌더링 함수가 단순해지고, 필터/검색 로직이 한곳에 모인다.

### JP（要点）
- 表示用データを計算して `render()` をシンプルにする

---

## 3) return을 어디에 써야 하는가
### KR
- 같은 이벤트 핸들러 내부에서 액션이 여러 개일 때:
- 처리 후 `return`으로 함수 종료하면 실수 방지됨
- 마지막 if 블록이면 return 생략해도 동작은 하지만,
“실무에서는 일관성/안전성” 때문에 return 쓰는 게 좋다.

### JP（要点）
- 処理後に `return` するとミス防止・可読性UP

---

## 4) 이벤트 위임(event delegation)
### KR
- 리스트 항목마다 addEventListener를 달지 않고,
부모(list)에 1개만 달고 이벤트를 위임한다.
- `e.target.closest("button")` 사용 이유:
- 버튼 안에 아이콘/텍스트 클릭해도 버튼을 찾을 수 있음

### JP（要点）
- 親要素に1つだけイベントを付ける（delegation）

---

## 5) dataset 사용 이유
### KR
- DOM 요소에 `data-id`, `data-act` 등을 붙여서 상태/액션을 구분
- React의 props처럼 DOM에서 “행동/식별”을 전달하는 느낌

### JP（要点）
- `data-*` でID/アクションを管理

---

## 6) 내가 자주 하는 실수
### KR
- `items.filter(...)`만 호출하고 결과를 다시 할당 안 함
- ❌ `items.filter(...)`
- ✅ `items = items.filter(...)`
- `includes()`에 인자를 빼먹음
- ❌ `.includes()`
- ✅ `.includes(query)`