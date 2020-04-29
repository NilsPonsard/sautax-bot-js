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
var fs_1 = require("fs");
var lol = __importStar(require("./lol"));
var image = __importStar(require("./image"));
var cpp = __importStar(require("./cpp"));
var mc = __importStar(require("./mc"));
var utils = __importStar(require("./utils"));
var client = new Discord.Client();
var token_file = fs_1.readFileSync("token");
var token = token_file.toString().replace("\n", "");
exports.prefix = "$";
var gitBotURL = "https://github.com/sautax/sautax-bot-js";
var gitGraphesURL = "https://gitlab.com/nilsponsard/graphes-tools";
var gitSiteURL = "https://github.com/NilsPonsard/sautax-website";
function requestFunc(msg) {
    var args = utils.parse(msg).slice(1);
    if (args.length == 0) {
        msg.reply("Cette fonction permet d'obtenir les liens pour proposer des modifications sur mes projets, les projets disponibles sont : `bot`, `graphes`, `site`");
    }
    else {
        var url = "projet non trouvé";
        var issue = "/issues/new";
        switch (args[0]) {
            case "bot":
                url = gitBotURL + issue;
                break;
            case "graphes":
                url = gitGraphesURL + issue;
                break;
            case "site":
                url = gitSiteURL + issue;
                break;
        }
        msg.reply(url);
    }
}
function roll(msg) {
    var args = utils.parse(msg).slice(1);
    try {
        if (args.length >= 1) {
            var min = 1;
            var max = 0;
            if (args.length === 1) {
                max = parseInt(args[0]);
            }
            else if (args.length === 2) {
                min = parseInt(args[0]);
                max = parseInt(args[1]);
            }
            var result = Math.round(Math.random() * (max - min) + min);
            console.log("roll min " + min + " | max " + max + " | result " + result);
            if (isNaN(result) || isNaN(min) || isNaN(max)) {
                msg.react("🤔");
            }
            else if (min > max) {
                msg.reply("Boulet, min>max");
            }
            else {
                msg.reply("result :  " + result);
            }
        }
        else {
            msg.reply("Arguments incorrects, utilisation : roll max | roll min max");
        }
    }
    catch (e) {
        console.log(e);
    }
    switch (args.length) {
        case 1:
            break;
        case 2:
            break;
    }
}
function help(msg) {
    var embed = new Discord.RichEmbed();
    embed.setTitle("Aide");
    embed.addField("Aide en ligne ici : ", "http://nilsponsard.software/bot-discord-js.html");
    msg.channel.send("", embed);
}
function google(recherche, msg) {
    msg.channel.send("https://www.google.com/search?q=" + recherche);
}
function rtfm(msg) {
    msg.channel.send({ files: ['https://binuxlubuntu.files.wordpress.com/2009/10/mao_rtfm_vectorize_by_cmenghi.png'] });
}
function system(msg) {
    var platform = process.platform;
    var usage = process.resourceUsage();
    var cpu = usage.systemCPUTime;
    var arch = process.arch;
    var uptime = process.uptime();
    var ram = process.memoryUsage().rss;
    var embed = new Discord.RichEmbed();
    embed.setTitle("System");
    embed.addField("Utilisation du CPU", cpu / 10000 + " %");
    embed.addField("Utilisation de la RAM", ram / 1000000 + " MB");
    embed.addField("Arch", arch);
    embed.addField("Platform", platform);
    embed.addField("Uptime", uptime + " S");
    msg.channel.send("", embed);
}
function say(msg) {
    var message = msg.content;
    msg.channel.send(msg.content.slice(5));
    msg.delete();
}
client.on("ready", function () {
    console.log("Logged in as " + client.user.tag + "!");
});
client.on('message', function (msg) {
    if (msg.content.startsWith(exports.prefix) && msg.author.bot == false) {
        var args = msg.content.replace(exports.prefix, "").split(" ");
        switch (args[0]) {
            case "ping":
                msg.channel.send("Pong !");
                break;
            case "lol":
                lol.lol(msg);
                break;
            case "image":
                image.image(msg);
                break;
            case "system":
                system(msg);
                break;
            case "say":
                say(msg);
                break;
            case "help":
                help(msg);
                break;
            case "cpp":
                cpp.cpp(msg);
                break;
            case "?":
                google(args.slice(1).join(), msg);
                break;
            case "rtfm":
                rtfm(msg);
                break;
            case "mc":
                mc.mc(msg);
                break;
            case "roll":
                roll(msg);
                break;
            case "request":
                requestFunc(msg);
                break;
        }
        console.log(msg.author.tag + " issued " + args[0]);
    }
});
client.login(token);
