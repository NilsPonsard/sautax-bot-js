import * as Discord from "discord.js"
import { readFileSync } from "fs";
import * as utils from "./utils"

import * as http from "http"
import * as https from "https"
import * as difflib from "difflib"

let items = {}
let champions = {}
let version = ""




https.get('https://ddragon.leagueoflegends.com/api/versions.json', (res: http.IncomingMessage) => {
    let data = ""
    res.on("data", (chunck) => {
        data = data + chunck
    })
    res.on("end", () => {
        version = JSON.parse(data)[0]
        console.log(`latest lol patch : ${version}`)
        http.get(`http://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/item.json`, (res: http.IncomingMessage) => {
            let data = ""
            res.on("data", (chunck) => {
                data = data + chunck
            })
            res.on("end", () => {
                items = JSON.parse(data).data

            })
        })
        http.get(`http://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion.json`, (res: http.IncomingMessage) => {
            let data = ""
            res.on("data", (chunck) => {
                data = data + chunck
            })
            res.on("end", () => {
                champions = JSON.parse(data)
            })
        })
    })
})

function item_search(msg: Discord.Message) {
    const args = utils.parse(msg).slice(3)
    if (args.length == 0) {
        msg.channel.send("Please provide a name")
    }
    else {
        const name = args.toString()
        let embed = new Discord.RichEmbed()
        embed.title = `Résultat de la recherche : ${name}`
        for (let item in items) {

            // @ts-ignore
            if (items[item].colloq.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
                // @ts-ignore
                embed.addField(items[item].name, `${items[item].gold.total} PO`)
            }
        }
        msg.channel.send("", embed)


    }
}
function item_stat(msg: Discord.Message) {
    const args = utils.parse(msg).slice(3)
    if (args.length == 0) {
        msg.channel.send("Please provide a name")
    } else {
        const nom = args.toString()
        let max_ratio = 0
        let max_ratio_key = ""
        for (let item in items) {
            //@ts-ignore
            let colloq = items[item].colloq.split(";")
            let len = colloq.length
            for (let i = 0; i < len; i++) {
                let s = new difflib.SequenceMatcher(null, colloq[i].toLowerCase(), nom.toLowerCase())
                // @ts-ignore
                let ratio = s.ratio()
                if (ratio > max_ratio) {
                    max_ratio = ratio
                    max_ratio_key = item
                }
            }
        }
        if (max_ratio == 0) {
            msg.channel.send("Impossible de trouver l'item")
        } else {
            let embed = new Discord.RichEmbed()
            // @ts-ignore
            embed.title = items[max_ratio_key].name
            // @ts-ignore
            embed.setThumbnail(`http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${max_ratio_key}.png`)
            // @ts-ignore
            let description = items[max_ratio_key].description
            description = description.replace(/<br>/g, "\n")
            description = description.replace(/<groupLimit>/g, "__")
            description = description.replace(/<\/groupLimit>/g, "__")
            description = description.replace(/<unique>/g, "**")
            description = description.replace(/<\/unique>/g, "**")
            description = description.replace(/<active>/g, "__**")
            description = description.replace(/<\/active>/g, "**__")
            description = description.replace(/<stats>/g, "```")
            description = description.replace(/<\/stats>/g, "```")
            description = description.replace(/<rules>/g, "__")
            description = description.replace(/<\/rules>/g, "__")
            description = description.replace(/<passive>/g, "**")
            description = description.replace(/<\/passive>/g, "**")
            description = description.replace(/<consumable>/g, "**")
            description = description.replace(/<\/consumable>/g, "**")
            description = description.replace(/<u>/g, "__")
            description = description.replace(/<\/u>/g, "__")
            embed.addField("Description", description)
            msg.channel.send("", embed)
        }
    }

}


function item(msg: Discord.Message): void {
    let args = utils.parse(msg).slice(2)
    if (args.length == 0) {
        msg.channel.send("Usage : item search <item> | item stat <item> ")

    } else {
        const sous_commande = args[0]
        switch (sous_commande) {
            case "search":
                item_search(msg)
                break
            case "stat":
                item_stat(msg)
                break
            case "stats":
                item_stat(msg)
                break
        }
    }

}




export function lol(msg: Discord.Message): void {
    let args = utils.parse(msg).slice(1)
    if (args.length == 0) {
        msg.reply("Lol module, for more info use `lol help`")
    }
    else {
        switch (args[0]) {
            case "item":
                item(msg)
                break
            case "items":
                item(msg)
                break
        }
    }

} 
