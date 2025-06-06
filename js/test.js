// pc手決め
// ランダムに手を決める
let pc_num = Math.floor(Math.random()*3);

if(pc_num == 0) {
    const pc_hand = "グー";
    console.log("PCの手は" + pc_hand + "です。");
}
if(pc_num == 1) {
    const pc_hand = "チョキ";
    console.log("PCの手は" + pc_hand + "です。");
}
if(pc_num == 2) {
    const pc_hand = "パー";
    console.log("PCの手は" + pc_hand + "です。");
}


// DOM <= HTMLの要素を取得する
const a1 = document.querySelector("#a1"); //HTMLの要素を取得するときに、随時"document.~"を記載すると、とても大尉編なので、変数に格納しておくと便利

console.log(a1.innerHTML);　//a1.で、a1という定義した項目の、その後に何が格納されているかを確認できる
console.log(a1.class);

a1.innerHTML = "カキクケコ"
a1.style.color = "red";
a1.style.backgroundColor = "yellow";

const btn = document.querySelector("#btn");
btn.onclick = function() {
    alert("ボタンがクリックされました");
}