const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// ユーザー情報を保存するファイルのパス
const userFilePath = './users.json';

// ユーザー情報を読み込む関数
const loadUsers = () => {
    if (fs.existsSync(userFilePath)) {
        const data = fs.readFileSync(userFilePath);
        return JSON.parse(data);
    }
    return [];
};

// ユーザー情報を保存する関数
const saveUsers = (users) => {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
};

// 新規登録のエンドポイント
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    if (users.find(user => user.username === username)) {
        return res.send('ユーザー名は既に存在します。');
    }

    users.push({ username, password });
    saveUsers(users);
    res.send('登録が完了しました。');
});

// ログインのエンドポイント
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.send('ログインに成功しました。');
    } else {
        res.send('ユーザー名またはパスワードが間違っています。');
    }
});

// 静的ファイルを提供
app.use(express.static(__dirname));

// サーバーを起動
app.listen(port, () => {
    console.log(`サーバーがポート${port}で起動しました`);
});
