import { AudioPlayer, AudioResource, createAudioPlayer, createAudioResource, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { logger } from "./logger";
import {type VoiceBasedChannel } from "discord.js";
import {VoiceVoxTextToSpeech,applyRVC} from "./util";
export class VoiceConnectionManager{

}

export class VoiceConnectionWrapper{
    // メッセージの監視、自動切断などを管理します。
    checker: Timer;
    audio_player:AudioPlayer;
    constructor(public voiceConnection:VoiceConnection,private channel:VoiceBasedChannel){
        // AudioPlayer の設定
        this.audio_player = createAudioPlayer(
            {
                behaviors:{
                    noSubscriber: NoSubscriberBehavior.Pause, // 登録がないときは停止する
                }
            }
        ); 
        this.voiceConnection.on(VoiceConnectionStatus.Disconnected, () => { 
            this.cleanup();
        })
        this.checker = setInterval(()=>{ // 自動切断チェッカ
            (async () => {
                channel = await this.channel.guild.channels.fetch(this.channel.id) as VoiceBasedChannel;
                if(channel){
                    if(channel.members.size === 1 ){
                        logger.info(`There are no member. disconnecting...`);
                        this.voiceConnection.destroy();
                        this.cleanup();
                    }
                }else{
                    logger.info(`VoiceChannel ${this.channel.id} not found. disconnecting...`);
                    this.voiceConnection.destroy();
                    this.cleanup();
                }            
            })();

        },1000 * 10);
    }
    public async Speech(txt:string){

        logger.info("Speech called");
        let audio_path:string = await VoiceVoxTextToSpeech(txt);
        audio_path = await applyRVC(audio_path);
        const audio_resource:AudioResource = createAudioResource(audio_path);

        this.audio_player.play(audio_resource);
        this.voiceConnection.subscribe(this.audio_player);

    }
    private cleanup() {
        if(this.checker){
            clearInterval(this.checker);
            logger.info("Interval cleared");
            this.checker = null!;
        }
    }
}