const express = require("express");
const app = express();
const port = 3000;
const { engine } = require("express-handlebars");
const urls = require("./public/jsons/url.json");
const fs = require("fs");

app.use(express.static("public"));
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/shorten", (req, res) => {
  // 取得 input 值
  const inputValue = req.query.url;
  // 檢查 input 值是否空白
  if (inputValue && inputValue.length > 0) {
    const shortUrl = shorten(inputValue);
    res.render("short", { shortUrl });
  }
});

// 寫一個函式：產生大寫字母 + 小寫字母 + 數字的 collection
function generateCollection() {
  const digits = [...Array(10)].map((_, i) => i);
  const lowerCaseLetters = [...Array(26)].map((_, i) =>
    String.fromCharCode(i + 97)
  );
  const upperCaseLetters = [...Array(26)].map((_, i) =>
    String.fromCharCode(i + 65)
  );
  return digits.concat(lowerCaseLetters, upperCaseLetters);
}

// 寫一個函式：隨機產生短網址，格式為 5 碼英數組合
function generateShortUrl() {
  let shortUrl = "";
  const collection = generateCollection();

  for (let i = 0; i < 5; i++) {
    shortUrl += collection[Math.floor(Math.random() * collection.length)];
  }

  // 檢查產生出來的短網址，是否已經存在了
  if (urls.some((url) => url.id === shortUrl)) {
    return generateShortUrl();
  }

  return shortUrl;
}

// 寫一個函式：比對 input 值是否已經產生過短網址
function shorten(originalUrl) {
  let shortUrl = "";

  // 檢查這組原始網址是否使用過，用過的話就回傳 json 檔的 url id
  if (urls.some((url) => url.origin === originalUrl)) {
    shortUrl = urls.find((url) => url.origin === originalUrl).id;
  } else {
    shortUrl = generateShortUrl();
    // 將新產生的短網址存進 urls 陣列
    urls.push({
      id: shortUrl,
      origin: originalUrl,
    });
    // 將更新後的 urls 陣列重新存回 json 檔
    fs.writeFile("./public/jsons/url.json", JSON.stringify(urls), (error) => {
      if (error) {
        console.log("Data written failed!!" + error);
      }
      console.log("Data written success!!");
    });
  }

  return `http://localhost:3000/${shortUrl}`;
}

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
