import * as Discord from "discord.js"
import { readFileSync, promises, readFile } from "fs";

import * as utils from "./utils";
import { exec } from "child_process";

let mcModos: Array<string> = []

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
                if (mcModos.lastIndexOf(msg.author.id) !== -1) {

                    msg.reply("starting server")

                    exec("ssh 10.188.27.48 tmux new-session -d -s pixel '/home/sautax/startPixelmon.sh'", (err, stdout, stderr) => {
                        console.log(err, stdout, stderr)
                    })
                }
                else {
                    msg.reply("vous n'avez pas la permission")
                }
                break
            case "stop":
                if (mcModos.lastIndexOf(msg.author.id) !== -1) {
                    msg.reply("stopping server")
                    exec("ssh 10.188.27.48 screen -S pixel -p 0 -X stuff 'stop^M'", (err, stdout, stderr) => {
                        console.log(err, stdout, stderr)
                    })
                } else {
                    msg.reply("vous n'avez pas la permission")
                }
                break
            case "say":
                if (mcModos.lastIndexOf(msg.author.id) !== -1) {
                    msg.reply(`saying \`${args.slice(1).join(" ")}\` in server chat`)
                    exec(`ssh 10.188.27.48 screen -S pixel -p 0 -X stuff 'say ${args.slice(1).join(" ")} ^M'`, (err, stdout, stderr) => {
                        console.log(err, stdout, stderr)
                    })
                } else {
                    msg.reply("vous n'avez pas la permission")
                }
                break
        }
    }


}