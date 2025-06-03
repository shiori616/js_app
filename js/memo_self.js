// 入力項目の定義
const inputDate = document.getElementById('input-date');
const memoText = document.getElementById('memo-text');
const saveButton = document.getElementById('save-button');
const clearButton = document.getElementById('clear-button');
const memoList = document.getElementById('memo-list');

// 今日の日付をデフォルトで設定
    // document: WebページのHTMLドキュメント全体を指す
    // addEventLIster(): 特定のイベントが発生したときに実行する関数を登録するためのメソッド
    // 'DOMcContentLoaded': イベントの名前。HTMLドキュメントが完全に読み込まれ、解析されたときに発生
    // () => アロー関数, イベントが発生したときに実行される処理ブロック


//HTMLドキュメントが読み込まれた時の関数
document.addEventListener('DOMContentLoaded', () => { // DOMContentLoaded = HTMLドキュメントが読み込まれたときに ()=>のアロー関数を実行する
    const today = new Date(); // today定数にDateオブジェクトとして取得
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // monthは0から始まるため、+1、Stringで文字列化、padStartは一桁の場合2桁相当になるよう前に0を挿入（ex. 8 -> 08）
    const day = String(today.getDate()).padStart(2,'0');
// 質問
// ``って何でですか？下記、``も設定できないと反映されなかった
    inputDate.value = `${year}-${month}-${day}`;

    displayMemos();  // ページ読み込み時にdisplayMemos関数を実行（displayMemos関数は後ほど定義）
});

// メモを保存する関数
saveButton.addEventListener('click', () => {
    const date = inputDate.value;
    const text = memoText.value.trim(); // 前後の空白を削除

    if(!date) {
        alert("日付が未入力です");
        return;
    }
    if(!text) {
        alert("テキストが未入力です");
        return;
    }

    // ローカルストレージから既存のメモを取得
    let memos =JSON.parse(localStorage.getItem('memos')) || [];

    // 新しいメモオブジェクトを作成
    const newMemo = {
        id: Date.now(),
        date: date,
        text: text
    };

    // メモを追加
    memos.push(newMemo);

    localStorage.setItem('memos', JSON.stringify(memos));

    // 入力欄をクリア
    memoText.value = '';

    // メモリストを再表示
    displayMemos(); // displayMemosは未定義
});

// 保存されたメモを表示する関数
function displayMemos() {
    //memoList.innerHTML= '';　// クリア

    let memos = JSON.parse(localStorage.getItem('memos')) || [];

    if (memos.length === 0) {
        memoList.innerHTML = '<p class="">メモなし</p>'
        return;
    }

    // メモを日付の新しい順にソート
    memos.sort((a,b) => new Date(b.date) - new Date(a.date));

    memos.forEach(memo =>{ // memosの要素をmemoとして一つ一つ書き出し
        const memoItem = document.createElement('div'); // memo事に一つ一つdivを作成
        // memoItem.classList.add('memo-item'); // divについて、cssClass作成
        memoItem.dataset.id = memo.id; // 削除用にIDをデータ属性に保存

        // 日付をyyyy/mm/dd形式にフォーマット
        const dateObj = new Date(memo.date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2,'0');
        const day = String(dateObj.getDate()).padStart(2,'0');
        const formattedDate = `${year}/${month}/${day}`;

        // 各メモ表示追加
        memoItem.innerHTML =`
            <div class="relative flex flex-col items-center justify-center w-full border border-blue-300 rounded-xl">
                <div class="memo-date flex justify-center border-b border-gray-300">${formattedDate}</div>
                <div class="memo-text">${memo.text}</div>
                <button class="delete-button absolute top-[-8px] right-[-8px] bg-red-200 rounded-full px-2">✗</button>
            </div>
            `;

        // 削除ボタンのイベントリスナーを追加
        const deleteButton = memoItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', ()=> {
            deleteMemo(memo.id);
        });
        
        memoList.appendChild(memoItem);
    });
}

// メモを削除する関数
function deleteMemo(idToDelete) {
    let memos = JSON.parse(localStorage.getItem('memos')) || [];
    memos = memos.filter(memo => memo.id !== idToDelete);
    localStorage.setItem('memos',JSON.stringify(memos));
    displayMemos();
}