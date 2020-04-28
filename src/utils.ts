import * as Discord from "discord.js"
import { readFileSync } from "fs"
import * as main from "./server"

interface botTokens {
    "discord": string,
    "riot": string
}


let tokensFile = readFileSync("tokens.json")
let tokensParsed = JSON.parse(tokensFile.toString())

export let tokens: botTokens = tokensParsed


export function parse(msg: Discord.Message): Array<string> {
    return msg.content.replace(main.prefix, "").replace("\n", "").split(" ")
}