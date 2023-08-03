import { Game } from "https://esm.sh/@gathertown/gather-game-client@42.0.0";

// 設定情報
const API_KEY = Deno.env.get("GATHER_API") || "";
const SPACE_ID = Deno.env.get("GATHER_SPACE_ID") || "";
const SPACE_NAME = Deno.env.get("GATHER_SPACE_NAME") || "";
const SPACE = `${SPACE_ID}\\${SPACE_NAME}`;

// 初期化
const game = new Game(SPACE, () => Promise.resolve({ apiKey: API_KEY }));
// 接続
game.connect();
// ボット参加
game.enter({
  name: "TOD_BOT",
  isNpc: true,
});

// 接続時の処理
game.subscribeToConnection((connected) => {
  console.log(`接続可否: ${connected}`);
});

// スペースキー押下時に発火する処理
let isSend = false;
game.subscribeToEvent("playerChats", (data) => {
  // 「/todbot」で発火
  const contents = data.playerChats.contents;
  if (!contents.startsWith("/todbot ")) {
    isSend = false;
    return;
  }

  if (isSend === true) return;
  const text = contents.replace(/\S+\s+/, "");
  console.log(text);

  game.chat(
    data.playerChats.recipient,
    [],
    data.playerChats.roomId || "",
    {
      contents: text,
    },
  );

  isSend = true;
});
