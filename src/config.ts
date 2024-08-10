import * as fs from "fs";
import * as path from "path";
import { logger } from "./logger";

interface RVCConfig {
    host: string;
    default_model_name: string;
}
interface VoiceVoxConfig {
    host: string;
}
interface DiscordConfig {
    token: string;
    application_id: string;
}
export interface AppConfig {
    rvc: RVCConfig;
    voicevox: VoiceVoxConfig;
    discord: DiscordConfig;
}

export class Config {
    private static instance: AppConfig;

    constructor() { };
    public static getInstance(): AppConfig {
        if (!Config.instance) {
            logger.info("Loading config file")
            try {
                const configPath = path.resolve(__dirname, "../config.json");
                const rawData = fs.readFileSync(configPath, "utf-8");
                const jsonData: AppConfig = JSON.parse(rawData);
                Config.instance = jsonData;
            } catch (err) {
                throw err;
            }
        }

        return Config.instance;
    }

}