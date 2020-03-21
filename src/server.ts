import * as Discord from "discord.js"
import { readFileSync } from "fs";
import * as lol from "./lol"
import * as image from "./image"
import * as cpp from "./cpp"
import * as child_process from "child_process"
import { userInfo } from "os";
const client = new Discord.Client()

let token_file = readFileSync("token")

const token = token_file.toString().replace("\n", "")

export const prefix = "$"

function help(msg: Discord.Message) {
    let embed = new Discord.RichEmbed()
    embed.setTitle("Aide")
    embed.addField("Aide en ligne ici : ", "http://nilsponsard.software/bot-discord-js.html")
    msg.channel.send("", embed)


}
function google(recherche: string, msg: Discord.Message): void {
    msg.channel.send(`https://www.google.com/search?q=${recherche}`)
}

function rtfm(msg: Discord.Message): void {
    msg.channel.send({ files: ['https://binuxlubuntu.files.wordpress.com/2009/10/mao_rtfm_vectorize_by_cmenghi.png'] })
}


function system(msg: Discord.Message) {
    let platform = process.platform
    let usage = process.resourceUsage()
    let cpu = usage.systemCPUTime
    let arch = process.arch
    let uptime = process.uptime()
    let ram = process.memoryUsage().rss
    let embed = new Discord.RichEmbed()
    embed.setTitle("System")
    embed.addField("Utilisation du CPU", `${cpu / 10000} %`)
    embed.addField("Utilisation de la RAM", `${ram / 1000000} MB`)
    embed.addField("Arch", arch)
    embed.addField("Platform", platform)
    embed.addField("Uptime", `${uptime} S`)
    msg.channel.send("", embed)


}

function say(msg: Discord.Message) {
    let message = msg.content
    msg.channel.send(msg.content.slice(5))
    msg.delete()
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);

})
client.on('message', msg => {
    if (msg.content.startsWith(prefix) && msg.author.bot == false) {
        let args = msg.content.replace(prefix, "").split(" ")
        switch (args[0]) {
            case "ping":
                msg.channel.send("Pong !")
                break
            case "lol":
                lol.lol(msg)
                break
            case "image":
                image.image(msg)
                break
            case "system":
                system(msg)
                break
            case "say":
                say(msg)
                break
            case "help":
                help(msg)
                break
            case "cpp":
                cpp.cpp(msg)
                break
            case "?":
                google(args.slice(1).join(), msg)
                break
            case "rtfm":
                rtfm(msg)
                break
        }

        console.log(`${msg.author.tag} issued ${args[0]}`)
    }

})





client.login(token)

