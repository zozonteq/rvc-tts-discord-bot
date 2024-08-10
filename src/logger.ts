import * as log4js from "log4js";

// log4js の設定
log4js.configure({
  appenders: {
    console: { type: "console" },
    logfile: { type: "file", filename: "log.txt" }
  },
  categories: { default: { appenders: ["console", "logfile"], level: "error" } },
});

export let logger: log4js.Logger = log4js.getLogger();
logger = log4js.getLogger();
logger.level = "debug";