"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = __importStar(require("discord.js"));
var utils = __importStar(require("./utils"));
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var difflib = __importStar(require("difflib"));
var items = {};
var champions = {};
var version = "";
https.get('https://ddragon.leagueoflegends.com/api/versions.json', function (res) {
    var data = "";
    res.on("data", function (chunck) {
        data = data + chunck;
    });
    res.on("end", function () {
        version = JSON.parse(data)[0];
        console.log("latest lol patch : " + version);
        http.get("http://ddragon.leagueoflegends.com/cdn/" + version + "/data/fr_FR/item.json", function (res) {
            var data = "";
            res.on("data", function (chunck) {
                data = data + chunck;
            });
            res.on("end", function () {
                items = JSON.parse(data).data;
            });
        });
        http.get("http://ddragon.leagueoflegends.com/cdn/" + version + "/data/fr_FR/champion.json", function (res) {
            var data = "";
            res.on("data", function (chunck) {
                data = data + chunck;
            });
            res.on("end", function () {
                champions = JSON.parse(data);
            });
        });
    });
});
function item_search(msg) {
    var args = utils.parse(msg).slice(3);
    if (args.length == 0) {
        msg.channel.send("Please provide a name");
    }
    else {
        var name_1 = args.toString();
        var embed = new Discord.RichEmbed();
        embed.title = "R\u00E9sultat de la recherche : " + name_1;
        for (var item_1 in items) {
            // @ts-ignore
            if (items[item_1].colloq.toLowerCase().indexOf(name_1.toLowerCase()) >= 0) {
                // @ts-ignore
                embed.addField(items[item_1].name, items[item_1].gold.total + " PO");
            }
        }
        msg.channel.send("", embed);
    }
}
function item_stat(msg) {
    var args = utils.parse(msg).slice(3);
    if (args.length == 0) {
        msg.channel.send("Please provide a name");
    }
    else {
        var nom = args.toString();
        var max_ratio = 0;
        var max_ratio_key = "";
        for (var item_2 in items) {
            //@ts-ignore
            var colloq = items[item_2].colloq.split(";");
            var len = colloq.length;
            for (var i = 0; i < len; i++) {
                var s = new difflib.SequenceMatcher(null, colloq[i].toLowerCase(), nom.toLowerCase());
                // @ts-ignore
                var ratio = s.ratio();
                if (ratio > max_ratio) {
                    max_ratio = ratio;
                    max_ratio_key = item_2;
                }
            }
        }
        if (max_ratio == 0) {
            msg.channel.send("Impossible de trouver l'item");
        }
        else {
            var embed = new Discord.RichEmbed();
            // @ts-ignore
            embed.title = items[max_ratio_key].name;
            // @ts-ignore
            embed.setThumbnail("http://ddragon.leagueoflegends.com/cdn/" + version + "/img/item/" + max_ratio_key + ".png");
            // @ts-ignore
            var description = items[max_ratio_key].description;
            description = description.replace("<br>", "\n");
            description = description.replace("<groupLimit>", "__");
            description = description.replace("</groupLimit>", "__");
            description = description.replace("<unique>", "**");
            description = description.replace("</unique>", "**");
            description = description.replace("<active>", "__**");
            description = description.replace("</active>", "**__");
            description = description.replace("<stats>", "```");
            description = description.replace("</stats>", "```");
            description = description.replace("<rules>", "__");
            description = description.replace("</rules>", "__");
            description = description.replace("<passive>", "**");
            description = description.replace("</passive>", "**");
            description = description.replace("<consumable>", "**");
            description = description.replace("</consumable>", "**");
            description = description.replace("<u>", "__");
            description = description.replace("</u>", "__");
            description = description.replace("<br>", "\n");
            embed.addField("Description", description);
            msg.channel.send("", embed);
        }
    }
}
function item(msg) {
    var args = utils.parse(msg).slice(2);
    if (args.length == 0) {
        msg.channel.send("Usage : item search <item> | item stat <item> ");
    }
    else {
        var sous_commande = args[0];
        switch (sous_commande) {
            case "search":
                item_search(msg);
                break;
            case "stat":
                item_stat(msg);
                break;
            case "stats":
                item_stat(msg);
                break;
        }
    }
}
function lol(msg) {
    var args = utils.parse(msg).slice(1);
    if (args.length == 0) {
        msg.reply("Lol module, for more info use `lol help`");
    }
    else {
        switch (args[0]) {
            case "item":
                item(msg);
                break;
            case "items":
                item(msg);
                break;
        }
    }
}
exports.lol = lol;
