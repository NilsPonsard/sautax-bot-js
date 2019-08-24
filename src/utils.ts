import * as Discord from "discord.js"
import { readFileSync } from "fs"
import * as main from "./server"

export function parse(msg: Discord.Message): Array<string> {
    return msg.content.replace(main.prefix, "").replace("\n", "").split(" ")
}