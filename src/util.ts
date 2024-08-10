import { Config } from "./config";
import { logger } from "./logger";
import * as path from "path";
import { client as gradio_client } from "@gradio/client";


export function generateDiscordInviteLink(application_id: string): string {
    return `https://discord.com/api/oauth2/authorize?client_id=${application_id}&permissions=3148864&scope=bot%20applications.commands`
}
export async function VoiceVoxTextToSpeech(text: string): Promise<string> {
    let host = Config.getInstance().voicevox.host;
    let audio_query = await fetch(`http://${host}/audio_query?text=${encodeURI(text)}&speaker=1`, {
        method: "POST",
        headers: {
            "accept": "audio/wav",
            "Content-Type": "application/json"
        },
    });
    if (!audio_query.ok) throw new Error(`Failed to get audio query: ${audio_query.statusText}`);
    let audio_query_json = await audio_query.json();



    const synthesis = await fetch(`http://${host}/synthesis?speaker=1`, {
        method: "POST",
        headers: {
            "accept": "audio/wav",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(audio_query_json)
    });
    if (!synthesis.ok) throw new Error(`Failed to get synthesis : ${audio_query.statusText}`);
    let synthesis_data = await synthesis.arrayBuffer();


    const audio_path = path.join(__dirname, "../temp/" + crypto.randomUUID() + ".wav");
    Bun.write(audio_path, synthesis_data);
    return audio_path;
}
export async function initRVC() {
    logger.info("initializing rvc");
    const rvc_client = await gradio_client(`http://${Config.getInstance().rvc.host}`)
    let result = await rvc_client.predict("/infer_change_voice", [
        "ayaka-jp.pth", // string 音源推論
        0, // number  0 - 0.5
        0, // number  0 - 0.5
    ])
    result = await rvc_client.predict("/infer_refresh", [
    ]);

}
export async function applyRVC(audio_path: string): Promise<string> {
    logger.debug(`http://${Config.getInstance().rvc.host}\nApplying RVC ${audio_path}`);

    try {
        const rvc_client = await gradio_client(`http://${Config.getInstance().rvc.host}`)
        let result = await rvc_client.predict("/infer_convert", [
            0, // number 話者ID
            audio_path, // string  処理対象音声ファイルのパス	
            0, // number ピッチ変更
            null, 	// blob  F0(最低共振周波数)カーブファイル
            "pm", // string  ピッチ抽出アルゴリズムの選択
            "", // string   特徴検索ライブラリへのパス
            "null", // string インデックスパスの自動検出	
            0, // number 0~1 検索特徴率
            0, // number 0~7 harvestピッチの認識結果に対してメディアンフィルタ	
            0, // number 0 ~ 48000 最終的なサンプリングレートへのポストプロセッシングのリサンプリング	
            0, // number 0~1 入力ソースの音量エンベロープと出力音量エンベロープの融合率 
            0, // number 0~0.5 明確な子音と呼吸音を保護し、電子音の途切れやその他のアーティファクトを防止します。
        ]);
        logger.debug((result.data as any))

        logger.debug((result.data as any)[1].name)
        return (result.data as any)[1].name;

    } catch (error) {
        logger.error(error);
        return audio_path;
    }

}

await initRVC();