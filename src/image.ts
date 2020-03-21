import * as Discord from "discord.js"
import { readFileSync, promises } from "fs";

import * as utils from "./utils";

import * as canvas from "canvas";


const help_message = "available commmands : `mandelbrot`"

async function mandelbrot_core(x: number, y: number, scalex: number, scaley: number, shiftX: number, shiftY: number, max_n: number, ctx: CanvasRenderingContext2D, black_pixel: canvas.ImageData, level_ratio: number, pixel: canvas.ImageData, Rratio: number, Gratio: number, Bratio: number, pixelData: Uint8ClampedArray) {
    let a = x * scalex - shiftX
    let b = y * scaley - shiftY
    let oa = a
    let ob = b
    let n = 0
    while (n < max_n && a * a + b * b < 64.0) {
        let aa = a * a - b * b
        let bb = 2.0 * a * b
        a = aa + oa
        b = bb + ob
        n += 1
    }
    if (n == max_n) {
        ctx.putImageData(black_pixel, x, y)

    } else {
        let level = Math.ceil(n * level_ratio)
        pixelData[0] = Math.ceil(level * Rratio)
        pixelData[1] = Math.ceil(level * Gratio)
        pixelData[2] = Math.ceil(level * Bratio)
        ctx.putImageData(pixel, x, y)
    }
}

function mandelbrot(msg: Discord.Message): void {
    const start = new Date()
    let Rratio = 0.9
    let Gratio = 0.6
    let Bratio = 0.4
    let args = utils.parse(msg).slice(2)
    let max_n = 10
    if (args.length > 0) {
        try {
            max_n = parseInt(args[0], 10)

        } catch (error) {
            msg.channel.send("l'argument N doit être un entier")
            max_n = 10
        }
    }
    if (args.length >= 4) {
        try {
            Rratio = parseFloat(args[1])
            Gratio = parseFloat(args[2])
            Bratio = parseFloat(args[3])

        } catch (error) {
            msg.channel.send("l'argument N doit être un entier, r v et b des flottants")
        }
    }
    const width = 1000
    const height = 1000
    const level_ratio = 255 / max_n
    //let scalex = 2.0 / width
    //let scaley = 2.0 / height
    const zoom = 2.1
    const scalex = zoom / width
    const scaley = zoom / height
    const shiftX = zoom * 3 / 4
    const shiftY = zoom / 2

    const cv = canvas.createCanvas(width, height)
    let ctx = cv.getContext("2d")


    const init = new Date()
    //console.log(`init : ${init.getTime() - start.getTime()}`)
    let black_pixel = ctx.getImageData(0, 0, 1, 1)
    black_pixel.data[0] = 0
    black_pixel.data[1] = 0
    black_pixel.data[2] = 0
    black_pixel.data[3] = 255
    let pixel = ctx.getImageData(0, 0, 1, 1)
    let pixelData = pixel.data
    pixelData[3] = 255


    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let a = x * scalex - shiftX
            let b = y * scaley - shiftY
            let oa = a
            let ob = b
            let n = 0
            while (n < max_n && a * a + b * b < 64.0) {
                let aa = a * a - b * b
                let bb = 2.0 * a * b
                a = aa + oa
                b = bb + ob
                n += 1
            }
            if (n == max_n) {
                ctx.putImageData(black_pixel, x, y)

            } else {
                let level = Math.ceil(n * level_ratio)
                pixelData[0] = Math.ceil(level * Rratio)
                pixelData[1] = Math.ceil(level * Gratio)
                pixelData[2] = Math.ceil(level * Bratio)
                ctx.putImageData(pixel, x, y)
            }
            // mandelbrot_core(x, y, scalex, scaley, shiftX, shiftY, max_n, ctx, black_pixel, level_ratio, pixel, Rratio, Gratio, Bratio, pixelData)
        }
    }
    let compute = new Date()
    console.log(`compute : ${init.getTime() - compute.getTime()}`);

    let buf = cv.toBuffer()
    let dfile = new Discord.Attachment(buf, "file.png")
    let end = new Date()

    let passed = end.getTime() - start.getTime()
    msg.channel.send(`finished in ${passed} ms`, dfile)



}

function help(msg: Discord.Message): void {
    msg.channel.send(help_message)

}

export function image(msg: Discord.Message): void {
    let args = utils.parse(msg).slice(1)

    if (args.length == 0) {
        msg.channel.send("image module, for more info use `image help`")
    }
    else {
        switch (args[0]) {
            case "mandelbrot":
                //process.nextTick(mandelbrot, msg)
                mandelbrot(msg)
                break
            case "help":
                help(msg)
                break

        }
    }
}