"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils = __importStar(require("./utils"));
function cppRef(recherche, msg) {
    msg.channel.send("https://en.cppreference.com/mwiki/index.php?search=" + recherche);
}
function cpp(msg) {
    var args = utils.parse(msg).slice(1);
    if (args.length == 0) {
        msg.channel.send("cpp module, for more info go to the help page : https://nilsponsard.software/bot-discord-js.html");
    }
    else {
        switch (args[0]) {
            case "ref":
                //process.nextTick(mandelbrot, msg)
                cppRef(args.slice(1).join(), msg);
                break;
            case "reference":
                cppRef(args.slice(1).join(), msg);
                break;
        }
    }
}
exports.cpp = cpp;
