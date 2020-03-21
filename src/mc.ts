import * as Discord from "discord.js"
import { readFileSync, promises, readFile } from "fs";

import * as utils from "./utils";
import { exec } from "child_process";

let mcModos = []

let modosFile = readFileSync("mcModos", "utf-8")
mcModos = modosFile.split("\n")

export function mc(msg: Discord.Message) {
    let args = utils.parse(msg).slice(1)
    if (args.length == 0) {
        msg.reply("Minecraft module, see help for more info")
    }
    else {
        switch (args[0]) {
            case "start":
                msg.reply("starting server")
                exec("ssh 10.188.27.48 tmux new-session -d -s pixel '/home/sautax/startPixelmon.sh'")
                break
        }
    }


}