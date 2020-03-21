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
var client = new Discord.Client();
var token_file = fs_1.readFileSync("token");
var token = token_file.toString().replace("\n", "");
exports.prefix = "$";
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
        }
        console.log(msg.author.tag + " issued " + args[0]);
    }
});
client.login(token);
