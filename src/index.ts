import { Config, type AppConfig } from "./config"
import { logger } from "./logger";
import { Client, GatewayIntentBits, Message, REST, Routes, SlashCommandBuilder, } from 'discord.js';
import { joinVoiceChannel } from "@discordjs/voice"
import { generateDiscordInviteLink } from "./util";
import commands from "./commands.json"
import { VoiceConnectionWrapper } from "./voice_connection_manager";


logger.info("Application is starting...");


class App {
    private config: AppConfig;
    private discordClient: Client;
    private voiceChannels:{[key:string] : VoiceConnectionWrapper};
    constructor() {
        this.config = Config.getInstance();
        this.discordClient = new Client({ intents: [
            GatewayIntentBits.Guilds, // ギルドへのアクセス
            GatewayIntentBits.GuildVoiceStates, // ボイスチャンネルの状態を監視するためのintent
            GatewayIntentBits.GuildMessages, // メッセージ確認
            GatewayIntentBits.MessageContent // 読み上げるメッセージ内容を確認するため
        ] });
        this.voiceChannels = {};
    }
    public RegisterDiscordSlashCommands(): App {
        // スラッシュコマンドの登録メソッド
        const rest = new REST({ version: "10" }).setToken(this.config.discord.token);
        (async () => {
            try {
                await rest.put(
                    Routes.applicationCommands(this.config.discord.application_id),
                    { body: commands }
                )
            } catch (error) {
                logger.error(error);
            }
        })();
        return this;
    }
    public RegisterDiscordSlashCommandsToDebugServer(): App {
        // デバッグ用スラッシュコマンド登録
        const rest = new REST({ version: "10" }).setToken(this.config.discord.token);
        (async () => {
            try {
                await rest.put(
                    Routes.applicationGuildCommands(this.config.discord.application_id, "718695228520792124"),
                    { body: commands }
                )
            } catch (error) {
                logger.error(error);
            }
        })();
        return this;
    } 
    public DiscordBotLogic(): App {
        this.discordClient.on("ready", () => {
            logger.info(`Logged in as ${this.discordClient.user?.tag}`);
            logger.info(`🔗 Invite url : ${generateDiscordInviteLink(this.config.discord.application_id)}`);
        });
        this.discordClient.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === 'join') { // Join command
                logger.debug("/join command executed")
                await interaction.reply({content:"Connecting...",ephemeral:true});

                if(!interaction.channel?.isVoiceBased()){// A channel is joinable?
                    await interaction.editReply("Please use this command on voice channel chat.")
                    return;
                }

                if(interaction.channel.members.size === 0){
                    await interaction.editReply("There are no members. try again after join voice channel.")
                    return;
                }

                const connection = new VoiceConnectionWrapper(
                    joinVoiceChannel({
                        channelId: interaction.channelId,
                        guildId: String(interaction.guildId),
                        adapterCreator: interaction.guild!.voiceAdapterCreator,
                    }),
                    interaction.channel
                );
                let key:string = `${interaction.guildId}-${interaction.channelId}`;
                this.voiceChannels[key] = connection;

                
                await interaction.editReply(`VoiceChannel connected\n ${this.voiceChannels}`)
                
                logger.info(this.voiceChannels);
            }
            else if(interaction.commandName == "leave" ){
                await interaction.reply({content:"Disconnecting...", ephemeral:true});
                let key:string = `${interaction.guildId}-${interaction.channelId}`;
                this.voiceChannels[key].disconnect();
            }
        });

        this.discordClient.on("messageCreate" , async (message:Message)=> {
            if(message.author.bot) return;// bot は無視

            let key:string = `${message.guildId}-${message.channelId}`;
            if(key in this.voiceChannels){
                this.voiceChannels[key].Speech(message.content);
            }
        })

        return this;
    }
    public LoginDiscord():App{
        this.discordClient.login(this.config.discord.token) 
        return this;
    }


}




process.stdin.resume(); // so the program will not close instantly

function exitHandler(options:any, exitCode:any) {
    if (options.cleanup) logger.info("Cleanup");
    if (exitCode || exitCode === 0) logger.info(`Process received exit code : ${exitCode}`);
    if (options.exit) process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

let app: App = new App()
    .RegisterDiscordSlashCommandsToDebugServer()
    .RegisterDiscordSlashCommands()
    .DiscordBotLogic()
    .LoginDiscord();