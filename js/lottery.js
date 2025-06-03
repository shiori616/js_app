// 配列：名前を保持
const a = ["A","B","C","D","E","F"];

    // 名前を表示
    const participant = document.getElementById('participants');

    // 配列の各要素をループ処理してリストアイテムを作成し、追加
    a.forEach( item => {
        const liElement = document.createElement('li');
        liElement.textContent = item;
        participant.appendChild(liElement);
    });

// 配列の長さ：何名？
const len = a.length;

const result = document.getElementById('result');
const atari = []

// 繰り返し（人数分回ってもらいましょう
for(let i=0; i<len; i++) {
    // 乱数:n番目の人を取り出せす
    const r = Math.floor(Math.random()*a.length);
    // splice
    const v = a.splice(r,1); 
    // 表示
    console.log(v);

    // resultに結果を加える
    atari.appendChild(v);
    console.log(atari);
    result.textContent = atari;

}