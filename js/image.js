"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var canvas = __importStar(require("canvas"));
var help_message = "available commmands : `mandelbrot`";
function mandelbrot_core(x, y, scalex, scaley, shiftX, shiftY, max_n, ctx, black_pixel, level_ratio, pixel, Rratio, Gratio, Bratio, pixelData) {
    return __awaiter(this, void 0, void 0, function () {
        var a, b, oa, ob, n, aa, bb, level;
        return __generator(this, function (_a) {
            a = x * scalex - shiftX;
            b = y * scaley - shiftY;
            oa = a;
            ob = b;
            n = 0;
            while (n < max_n && a * a + b * b < 64.0) {
                aa = a * a - b * b;
                bb = 2.0 * a * b;
                a = aa + oa;
                b = bb + ob;
                n += 1;
            }
            if (n == max_n) {
                ctx.putImageData(black_pixel, x, y);
            }
            else {
                level = Math.ceil(n * level_ratio);
                pixelData[0] = Math.ceil(level * Rratio);
                pixelData[1] = Math.ceil(level * Gratio);
                pixelData[2] = Math.ceil(level * Bratio);
                ctx.putImageData(pixel, x, y);
            }
            return [2 /*return*/];
        });
    });
}
function mandelbrot(msg) {
    var start = new Date();
    var Rratio = 0.9;
    var Gratio = 0.6;
    var Bratio = 0.4;
    var args = utils.parse(msg).slice(2);
    var max_n = 10;
    if (args.length > 0) {
        try {
            max_n = parseInt(args[0], 10);
        }
        catch (error) {
            msg.channel.send("l'argument N doit être un entier");
            max_n = 10;
        }
    }
    if (args.length >= 4) {
        try {
            Rratio = parseFloat(args[1]);
            Gratio = parseFloat(args[2]);
            Bratio = parseFloat(args[3]);
        }
        catch (error) {
            msg.channel.send("l'argument N doit être un entier, r v et b des flottants");
        }
    }
    var width = 500;
    var height = 500;
    var level_ratio = 255 / max_n;
    //let scalex = 2.0 / width
    //let scaley = 2.0 / height
    var zoom = 2.1;
    var scalex = zoom / width;
    var scaley = zoom / height;
    var shiftX = zoom * 3 / 4;
    var shiftY = zoom / 2;
    var cv = canvas.createCanvas(width, height);
    var ctx = cv.getContext("2d");
    var init = new Date();
    //console.log(`init : ${init.getTime() - start.getTime()}`)
    var black_pixel = ctx.getImageData(0, 0, 1, 1);
    black_pixel.data[0] = 0;
    black_pixel.data[1] = 0;
    black_pixel.data[2] = 0;
    black_pixel.data[3] = 255;
    var pixel = ctx.getImageData(0, 0, 1, 1);
    var pixelData = pixel.data;
    pixelData[3] = 255;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var a = x * scalex - shiftX;
            var b = y * scaley - shiftY;
            var oa = a;
            var ob = b;
            var n = 0;
            while (n < max_n && a * a + b * b < 64.0) {
                var aa = a * a - b * b;
                var bb = 2.0 * a * b;
                a = aa + oa;
                b = bb + ob;
                n += 1;
            }
            if (n == max_n) {
                ctx.putImageData(black_pixel, x, y);
            }
            else {
                var level = Math.ceil(n * level_ratio);
                pixelData[0] = Math.ceil(level * Rratio);
                pixelData[1] = Math.ceil(level * Gratio);
                pixelData[2] = Math.ceil(level * Bratio);
                ctx.putImageData(pixel, x, y);
            }
            // mandelbrot_core(x, y, scalex, scaley, shiftX, shiftY, max_n, ctx, black_pixel, level_ratio, pixel, Rratio, Gratio, Bratio, pixelData)
        }
    }
    var compute = new Date();
    console.log("compute : " + (init.getTime() - compute.getTime()));
    var buf = cv.toBuffer();
    var dfile = new Discord.Attachment(buf, "file.png");
    var end = new Date();
    var passed = end.getTime() - start.getTime();
    msg.channel.send("finished in " + passed + " ms", dfile);
}
function help(msg) {
    msg.channel.send(help_message);
}
function image(msg) {
    var args = utils.parse(msg).slice(1);
    if (args.length == 0) {
        msg.channel.send("image module, for more info use `image help`");
    }
    else {
        switch (args[0]) {
            case "mandelbrot":
                //process.nextTick(mandelbrot, msg)
                mandelbrot(msg);
                break;
            case "help":
                help(msg);
                break;
        }
    }
}
exports.image = image;
