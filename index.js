// Firebaseの初期化
const firebaseConfig = {
  apiKey: "AIzaSyBBRpIYCCCQ6eMDgs2PBIypHRR83fTeCIY",
  authDomain: "csd-c2p41027.firebaseapp.com",
  projectId: "csd-c2p41027",
  storageBucket: "csd-c2p41027.firebasestorage.app",
  messagingSenderId: "866391731545",
  appId: "1:866391731545:web:bea9ca36865978216eb048"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

// 送信ボタンがクリックされたときの処理
const sendData = () => {
  // テキストボックスのテキストを取得
  var message = document.getElementById("message").value;
  // DBへのデータの追加（メッセージ+タイムスタンプ保存）
  db.collection("csd")
  .add({
    message: message,
    timestamp: firebase.firestore.Timestamp.fromDate(new Date())
  })
  .then((docRef) => {
    // 処理が成功したときの処理
    readData();
    // 送信後入力欄を空にする
    document.getElementById("message").value = "";
  })
  .catch((error) => {
    // 処理が失敗したときの処理
    console.error("送信失敗：", error);
  });
};

// データを表示する処理
const readData = () => {
  // timestampを基準に新しい順（降順）で取得
  db.collection('csd')
  .orderBy('timestamp', 'desc')
  .get()
  .then((data) => {
    // olタグを取得
    var ol = document.getElementById("list");
    // liタグを一度すべて削除
    ol.innerHTML = "";
    // 取得したデータの繰り返し文
    for(var i = 0; i < data.docs.length; i++){
      // ドキュメントID（削除処理に使用）
      var docId = data.docs[i].id;
      // メッセージ本文
      var message = data.docs[i].data().message;
      // タイムスタンプを日時文字列に整形
      var time = data.docs[i].data().timestamp.toDate().toLocaleString();

      // 追加するliタグを作成
      var li = document.createElement('li');
      // メッセージ+日時を表示
      li.innerHTML = message + " (" + time + ")";

      // 削除ボタン作成
      var delBtn = document.createElement("button");
      delBtn.textContent = "削除";
      // 削除ボタンクリック処理
      delBtn.onclick = function() {
        db.collection("csd").doc(docId).delete()
        .then(() => {
          readData();
        })
        .catch((err) => {
          console.error("削除失敗：", err);
        });
      };
      li.appendChild(delBtn);

      // olタグにliタグを追加
      ol.appendChild(li);
    }
  })
};

// ページ読み込み時に実行する処理
window.onload = function(){
  readData();
};