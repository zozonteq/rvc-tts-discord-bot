# セットアップ手順
DiscordのBotを動作させるまでのセットアップ手順
## 推奨スペック
```
GPU : RTX 2060 以上
Ram : 16GB以上
CPU : i7 8世代以上
OS : MacOS Linux Windows
```
## 必要なもの
 - Bun
 - VoiceVox
 - Retrieval-based-Voice-Conversion-WebUI
## 1.Bun
Bun公式サイトの手順に従ってください。
https://bun.sh/docs/installation

### 確認
下記のコマンドを実行して、バージョンが出力されれば問題ないです。
```powershell
bun --version
```
## 2.VoiceVox
下記のサイトからインストールを行ってください。<br>
https://voicevox.hiroshiba.jp/
## 3.Retrieval-based-Voice-Conversion-WebUI
リポジトリ<br>
https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI

日本語のインストール解説ページがあります。下記のURLを参考にインストールしてください。<br>
https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/docs/jp/README.ja.md

## 4.rvc-tts-discord-bot
### リポジトリをクローン
```
git clone https://github.com/zozonteq/rvc-tts-discord-bot
```
### 

## 5. config.json
ボットを動作させるためにDiscordのトークンなどの認証情報やrvcのサーバーのホストなどをあらかじめ設定しておく必要があります。
1. まずプロジェクトファイル直下に`config.json`を配置します。
2. 以下のように記述します。
```json
{
    "rvc": {
        "host": "localhost:7865",
        "default_model_name":  "default_model_name.pth"
    },
    "voicevox" : {
        "host": "localhost:50021"
    },
    "discord" : {
        "token": "paste_your_discord_bot_token",
        "application_id": "paste_your_discord_bot_application_id"
    }
}
```
