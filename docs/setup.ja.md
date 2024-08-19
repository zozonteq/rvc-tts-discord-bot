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