// script.js

// DOM要素の取得
const itemInput = document.getElementById('itemInput');
const placeSelect = document.getElementById('placeSelect');
const addButton = document.getElementById('addButton');
const shoppingList = document.getElementById('shoppingList');

// 買い物場所の選択肢リスト
const shoppingPlaces = [
    { value: "未選択", text: "場所を選択" },
    { value: "スーパー", text: "スーパー" },
    { value: "コンビニ", text: "コンビニ" },
    { value: "ドラッグストア", text: "ドラッグストア" },
    { value: "その他", text: "その他" }
];

/**
 * 買い物場所のプルダウンを生成する
 */
function populatePlaceSelect() {
    placeSelect.innerHTML = ''; // 既存のオプションをクリア
    shoppingPlaces.forEach(place => {
        const option = document.createElement('option');
        option.value = place.value;
        option.textContent = place.text;
        placeSelect.appendChild(option);
    });
}

/**
 * LocalStorageから買い物リストを読み込む
 * @returns {Array} 買い物アイテムの配列
 */
function loadShoppingList() {
    const storedList = localStorage.getItem('shoppingList');
    return storedList ? JSON.parse(storedList) : [];
}

/**
 * 買い物リストをLocalStorageに保存する
 * @param {Array} list - 保存する買い物アイテムの配列
 */
function saveShoppingList(list) {
    localStorage.setItem('shoppingList', JSON.stringify(list));
}

/**
 * 買い物リストをDOMに表示する
 * @param {Array} list - 表示する買い物アイテムの配列
 */
function renderShoppingList(list) {
    shoppingList.innerHTML = ''; // 現在のリストをクリア

    if (list.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'text-center text-gray-500 py-4';
        emptyMessage.textContent = 'リストは空です。新しいアイテムを追加しましょう！';
        shoppingList.appendChild(emptyMessage);
        return;
    }

    list.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'shopping-item flex items-center justify-between p-4 mb-3 bg-white rounded-lg shadow-md';

        const itemInfoDiv = document.createElement('div');
        itemInfoDiv.className = 'item-info';

        const itemNameSpan = document.createElement('span');
        itemNameSpan.textContent = item.name;
        itemNameSpan.className = 'item-name';

        const itemPlaceSpan = document.createElement('span');
        itemPlaceSpan.textContent = `場所: ${item.place}`;
        itemPlaceSpan.className = 'item-place';

        itemInfoDiv.appendChild(itemNameSpan);
        itemInfoDiv.appendChild(itemPlaceSpan);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'item-actions';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.className = 'action-button delete-item bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg';
        deleteButton.addEventListener('click', () => deleteItem(index));

        actionsDiv.appendChild(deleteButton);

        listItem.appendChild(itemInfoDiv);
        listItem.appendChild(actionsDiv);

        shoppingList.appendChild(listItem);
    });
}

/**
 * 新しいアイテムをリストに追加する
 */
function addItem() {
    const itemName = itemInput.value.trim();
    const itemPlace = placeSelect.value;

    if (itemName === '') {
        // alert('買うものを入力してください！'); // alert() の代わりにカスタムモーダルを使用
        showCustomAlert('買うものを入力してください！');
        return;
    }
    if (itemPlace === '未選択') {
        // alert('買う場所を選択してください！'); // alert() の代わりにカスタムモーダルを使用
        showCustomAlert('買う場所を選択してください！');
        return;
    }

    const currentList = loadShoppingList();
    currentList.push({ name: itemName, place: itemPlace });
    saveShoppingList(currentList);
    renderShoppingList(currentList);

    itemInput.value = ''; // 入力フィールドをクリア
    placeSelect.value = '未選択'; // プルダウンをリセット
}

/**
 * 指定されたインデックスのアイテムをリストから削除する
 * @param {number} index - 削除するアイテムのインデックス
 */
function deleteItem(index) {
    // confirm() の代わりにカスタムモーダルを使用
    showCustomConfirm('このアイテムをリストから削除してもよろしいですか？', () => {
        const currentList = loadShoppingList();
        currentList.splice(index, 1); // 該当アイテムを削除
        saveShoppingList(currentList);
        renderShoppingList(currentList); // リストを再描画
    });
}

/**
 * カスタムアラートモーダルを表示する
 * @param {string} message - 表示するメッセージ
 */
function showCustomAlert(message) {
    const modalId = 'customAlertDialog';
    let modal = document.getElementById(modalId);

    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ease-out opacity-0';
        modal.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full transform scale-95 transition-transform duration-300 ease-out">
                <p class="text-lg font-semibold text-gray-800 mb-6 text-center">${message}</p>
                <div class="flex justify-center">
                    <button id="alertOk" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('div').classList.remove('scale-95');
        }, 10);
    } else {
        modal.querySelector('p').textContent = message;
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
    }

    const alertOk = modal.querySelector('#alertOk');
    const closeAndCleanup = () => {
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
        alertOk.removeEventListener('click', closeAndCleanup);
    };
    alertOk.addEventListener('click', closeAndCleanup);
}

/**
 * カスタム確認モーダルを表示する
 * @param {string} message - 表示するメッセージ
 * @param {Function} onConfirm - 「はい」がクリックされたときに実行するコールバック関数
 */
function showCustomConfirm(message, onConfirm) {
    const modalId = 'customConfirmModal';
    let modal = document.getElementById(modalId);

    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ease-out opacity-0';
        modal.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full transform scale-95 transition-transform duration-300 ease-out">
                <p class="text-lg font-semibold text-gray-800 mb-6 text-center">${message}</p>
                <div class="flex justify-center space-x-4">
                    <button id="confirmYes" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">はい</button>
                    <button id="confirmNo" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">いいえ</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('div').classList.remove('scale-95');
        }, 10);
    } else {
        modal.querySelector('p').textContent = message;
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
    }

    const confirmYes = modal.querySelector('#confirmYes');
    const confirmNo = modal.querySelector('#confirmNo');

    const closeAndCleanup = () => {
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
        confirmYes.removeEventListener('click', handleYes);
        confirmNo.removeEventListener('click', handleNo);
    };

    const handleYes = () => {
        onConfirm();
        closeAndCleanup();
    };

    const handleNo = () => {
        closeAndCleanup();
    };

    confirmYes.addEventListener('click', handleYes);
    confirmNo.addEventListener('click', handleNo);
}


// アプリの初期化
document.addEventListener('DOMContentLoaded', () => {
    populatePlaceSelect(); // プルダウンオプションを生成
    const initialList = loadShoppingList(); // LocalStorageからリストを読み込む
    renderShoppingList(initialList); // リストをDOMに表示
});

// イベントリスナーの設定
addButton.addEventListener('click', addItem); // 追加ボタンクリック時
itemInput.addEventListener('keypress', (e) => { // 入力フィールドでEnterキー押下時
    if (e.key === 'Enter') {
        addItem();
    }
});
