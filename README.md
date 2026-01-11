# Study Log (Vanilla JS CRUD) / 学習ログCRUD

**HTML + Vanilla JavaScript** だけで作った最小CRUDプロジェクトです。  
フレームワークに依存せず、**フロントエンドの基礎（データの流れ / 描画 / 検索 / フィルタ / イベント処理）**を理解・説明できる状態を作ることを目的に作成しました。

**Languages:** 日本語 | [한국어](README.ko.md) | [English](README.en.md)

---

## ✅ 機能一覧
- ✅ CRUD（追加 / 表示 / 編集 / 削除）
- ✅ カテゴリ（タグ）フィルタ
- ✅ 検索（部分一致）
- ✅ Event Delegation（`closest()`）
- ✅ XSS対策（escapeHTML）
- ✅ LocalStorageによる永続化（ブラウザ保存）

---

## 🎯 このプロジェクトを作った理由
React / Next.js に入る前に、Vanilla JS で下記を“理解した上で説明できる状態”にしたかったためです。

- DOM描画の更新パターン
- 「状態（source of truth）」の設計
- フィルタ/検索ロジックを描画から分離する重要性
- 仕様追加でコードが長くなっても壊れないイベント設計

※ この構造は後に Next.js + MongoDB 版へ移行する際の基盤にもなりました。

---

## 🧩 設計（Architecture）
### ✅ Source of truth
```js
let items = []; // source of truth
🔍 検索/フィルタ処理（visibleItems）
表示するべきデータを先に計算し、その結果だけを描画する方針です。

visibleItems()：表示対象を計算

render()：画面描画
```

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
🖱️ Event Delegation（拡張しやすいクリック処理）
各ボタンにイベントを付けるのではなく、リスト全体に 1 つだけイベントを付与しています。

```js
list.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
});
```
✅ メリット
renderでDOMが再生成されても動作する

リスナー増殖を防げる

Action追加（edit/delete以外）が容易

🔐 XSS対策（escapeHTML）
ユーザー入力を innerHTML に入れるため、必ずエスケープ処理を行っています。

```js
const escapeHtml = (s) =>
  s.replaceAll("&", "&amp;")
   .replaceAll("<", "&lt;")
   .replaceAll(">", "&gt;");
💾 LocalStorage（永続化）
```
LocalStorageを簡易DBとして使用しています。

✅ 採用理由
学習用プロジェクトに最適（簡単・高速）

DBなしで CRUD の基本構造を固められる

⚠️ 制限
端末依存（別デバイスでは見れない）

ユーザー管理不可

➡️ この制限を解決するため、後に Next.js + MongoDB 版へ移行しました。

🚀 Demo
（ここにURLを追加）

📸 スクリーンショット
（ここに画像を追加）

✅ 学んだこと
フレームワークなしで CRUD 基礎実装

状態 → 計算 → 描画 の流れ

保守しやすいイベント処理

初歩的ミスを減らすための設計・習慣

📌 Next Step（移行）
この原型をベースに、以下を実装した Next.js 版も作成しました。

Next.js Route Handler API

MongoDB（永続化）

JSON export/import

Vercel deploy

（Next.js版のRepoリンクを追加）

Author
GitHub: https://github.com/kieeler123