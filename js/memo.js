const inputDate = document.getElementById('input-date');
const memoText = document.getElementById('memo-text');
const saveButton = document.getElementById('save-button');
const clearButton = document.getElementById('clear-button');
const memoList = document.getElementById('memo-list');

// 今日の日付をデフォルトで設定
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1
    const day = String(today.getDate()).padStart(2, '0');
    inputDate.value = `<span class="math-inline">\{year\}\-</span>{month}-${day}`; // YYYY-MM-DD 形式で設定

    displayMemos(); // ページ読み込み時に保存済みのメモを表示
});

// メモを保存する関数
saveButton.addEventListener('click', () => {
    const date = inputDate.value; // YYYY-MM-DD 形式
    const text = memoText.value.trim(); // 前後の空白を削除

    if (!date || !text) {
        // alert("日付とメモ内容を入力してください。"); // アラートの代わりにカスタムモーダルを推奨
        // カスタムモーダルの例 (簡略化のためコンソールログを使用)
        console.log("Please enter both date and memo content.");
        return;
    }

    // ローカルストレージから既存のメモを取得
    let memos = JSON.parse(localStorage.getItem('memos')) || [];

    // 新しいメモオブジェクトを作成
    const newMemo = {
        id: Date.now(), // ユニークなIDとしてタイムスタンプを使用
        date: date, // YYYY-MM-DD 形式で保存
        text: text
    };

    // メモを追加
    memos.push(newMemo);

    // ローカルストレージに保存
    localStorage.setItem('memos', JSON.stringify(memos));

    // 入力欄をクリア
    memoText.value = '';

    // メモリストを再表示
    displayMemos();
});

// 保存されたメモを表示する関数
function displayMemos() {
    memoList.innerHTML = ''; // リストをクリア

    let memos = JSON.parse(localStorage.getItem('memos')) || [];

    if (memos.length === 0) {
        memoList.innerHTML = '<p style="text-align: center; color: #888;">No memos saved yet.</p>';
        return;
    }

    // メモを日付の新しい順にソート
    memos.sort((a, b) => new Date(b.date) - new Date(a.date));

    memos.forEach(memo => {
        const memoItem = document.createElement('div');
        memoItem.classList.add('memo-item');
        memoItem.dataset.id = memo.id; // 削除用にIDをデータ属性に保存

        // 日付を英語の形式にフォーマット
        const formattedDate = new Date(memo.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        memoItem.innerHTML = `
            <div class="memo-date"><span class="math-inline">\{formattedDate\}</div\>
<div class\="memo\-text"\></span>{memo.text}</div>
            <button class="delete-button">X</button>
        `;

        // 削除ボタンのイベントリスナーを追加
        const deleteButton = memoItem.querySelector('.delete-button');
        deleteButton.addEventListener('click