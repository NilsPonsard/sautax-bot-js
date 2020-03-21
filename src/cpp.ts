import * as Discord from "discord.js"
import { readFileSync, promises } from "fs";

import * as utils from "./utils";
import { join } from "path";



function cppRef(recherche: string, msg: Discord.Message): void {
    msg.channel.send(`https://en.cppreference.com/mwiki/index.php?search=${recherche}`)
}

export function cpp(msg: Discord.Message): void {
    let args = utils.parse(msg).slice(1)

    if (args.length == 0) {
        msg.channel.send("cpp module, for more info go to the help page : https://nilsponsard.software/bot-discord-js.html")
    }
    else {
        switch (args[0]) {
            case "ref":
                //process.nextTick(mandelbrot, msg)
                cppRef(args.slice(1).join(), msg)
                break
            case "reference":
                cppRef(args.slice(1).join(), msg)
                break

        }
    }
}