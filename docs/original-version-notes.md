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
