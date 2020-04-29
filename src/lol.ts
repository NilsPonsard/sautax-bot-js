import * as Discord from "discord.js"
import { readFile, unwatchFile } from "fs";
import * as utils from "./utils"

import * as http from "http"
import * as https from "https"
import * as difflib from "difflib"
import { promises, LookupOneOptions } from "dns";
import { parse } from "path";
import { parentPort } from "worker_threads";


let items = {}
let champions = {}
let version = ""


interface summoner {
    id: string,
    accountId: string,
    puuid: string,
    name: string,
    profileIconId: number,
    summonerLevel: number
}

interface leaugeMatch {
    platformId: string,
    gameId: number,
    champion: number,
    queue: number,
    season: number,
    timestamp: number,
    role: string,
    lane: string
}
interface TeamBansDto {
    championId: number,
    pickTurn: number
}
interface BannedChampion {
    championId: number,
    pickTurn: number,
    teamId: number
}

interface TeamStatsDto {
    towerKills: number,
    riftHeraldKills: number,
    firstBlood: boolean,
    inhibitorKills: number,
    bans: Array<TeamBansDto>,
    firstBaron: boolean,
    firstDragon: boolean,
    dominionVictoryScore: number,
    dragonKills: number,
    baronKills: number,
    firstInhibitor: boolean,
    firstTower: boolean,
    vilemawKills: number,
    firstRiftHerald: boolean,
    teamId: number,
    win: string
}

interface ParticipantStatsDto {
    item0: number,
    item2: number,
    totalUnitsHealed: number,
    item1: number,
    largestMultiKill: number,
    goldEarned: number,
    firstInhibitorKill: boolean,
    physicalDamageTaken: number,
    nodeNeutralizeAssist: number,
    totalPlayerScore: number,
    champLevel: number,
    damageDealtToObjectives: number,
    totalDamageTaken: number,
    neutralMinionsKilled: number,
    deaths: number,
    tripleKills: number,
    magicDamageDealtToChampions: number,
    wardsKilled: number,
    pentaKills: number,
    damageSelfMitigated: number,
    largestCriticalStrike: number,
    nodeNeutralize: number,
    totalTimeCrowdControlDealt: number,
    firstTowerKill: boolean,
    magicDamageDealt: number,
    totalScoreRank: number,
    nodeCapture: number,
    wardsPlaced: number,
    totalDamageDealt: number,
    timeCCingOthers: number,
    magicalDamageTaken: number,
    largestKillingSpree: number,
    totalDamageDealtToChampions: number,
    physicalDamageDealtToChampions: number,
    neutralMinionsKilledTeamJungle: number,
    totalMinionsKilled: number,
    firstInhibitorAssist: boolean,
    visionWardsBoughtInGame: boolean,
    objectivePlayerScore: number,
    kills: number,
    firstTowerAssist: boolean,
    combatPlayerScore: number,
    inhibitorKills: number,
    turretKills: number,
    participantId: number,
    trueDamageTaken: number,
    firstBloodAssist: boolean,
    nodeCaptureAssist: number,
    assists: number,
    teamObjective: number,
    altarsNeutralized: number,
    goldSpent: number,
    damageDealtToTurrets: number,
    altarsCaptured: number,
    win: boolean,
    totalHeal: number,
    unrealKills: number,
    visionScore: number,
    physicalDamageDealt: number,
    firstBloodKill: boolean,
    longestTimeSpentLiving: number,
    killingSprees: number,
    sightWardsBoughtInGame: number,
    trueDamageDealtToChampions: number,
    neutralMinionsKilledEnemyJungle: number,
    doubleKills: number,
    trueDamageDealt: number,
    quadraKills: number,
    item4: number,
    item3: number,
    item6: number,
    item5: number,
    playerScore0: number,
    playerScore1: number,
    playerScore2: number,
    playerScore3: number,
    playerScore4: number,
    playerScore5: number,
    playerScore6: number,
    playerScore7: number,
    playerScore8: number,
    playerScore9: number,
    perk0: number, //rune 
    perk0Var1: number,
    perk0Var2: number,
    perk0Var3: number,
    perk1: number, //rune 
    perk1Var1: number,
    perk1Var2: number,
    perk1Var3: number,
    perk2: number, //rune 
    perk2Var1: number,
    perk2Var2: number,
    perk2Var3: number,
    perk3: number, //rune 
    perk3Var1: number,
    perk3Var2: number,
    perk3Var3: number,
    perk4: number, //rune 
    perk4Var1: number,
    perk4Var2: number,
    perk4Var3: number,
    perk5: number, //rune 
    perk5Var1: number,
    perk5Var2: number,
    perk5Var3: number,
    perkPrimaryStyle: number,
    perkSubStyle: number
}

interface ParticipantTimelineDto {
    participantId: number,
    csDiffPerMinDeltas: Map<string, number>,
    damageTakenPerMinDeltas: Map<string, number>,
    role: string,
    damageTakenDiffPerMinDeltas: Map<string, number>,
    xpPerMinDeltas: Map<string, number>,
    xpDiffPerMinDeltas: Map<string, number>,
    lane: string,
    creepsPerMinDeltas: Map<string, number>,
    goldPerMinDeltas: Map<string, number>
}
interface MasteryDto {
    rank: number,
    masteryId: number
}

interface ParticipantDto {
    participantId: number,
    championId: number,
    runes: Array<object>
    stats: ParticipantStatsDto,
    teamId: number, // 100 for blue side. 200 for red side. 
    timeline: ParticipantTimelineDto,
    spell1Id: number,
    spell2Id: number,
    highestAchievedSeasonTier: string,
    masteries: Array<MasteryDto>
}


interface PlayerDto {
    profileIcon: number,
    accountId: string,
    matchHistoryUri: string,
    currentAccountId: string,
    currentPlatformId: string,
    summonerName: string,
    summonerId: string,
    platformId: string
}

interface ParticipantIdentityDto {
    participantId: number,
    player: PlayerDto
}
interface MatchDto {
    gameId: number
    participantIdentities: Array<ParticipantIdentityDto>,
    queueId: number,
    gameType: string,
    gameDuration: number,
    teams: Array<TeamStatsDto>,
    platformId: string,
    gameCreation: number,
    seasonId: number,
    gameVersion: string,
    mapId: number,
    gameMode: string,
    participants: Array<ParticipantDto>
}
interface Perks {
    perkIds: Array<number>,
    perkStyle: number,
    perkSubStyle: number
}
interface GameCustomizationObject {

    category: string,
    content: string
}
interface CurrentGameParticipant {
    championId: number,
    perks: Perks,
    profileIconId: number,
    bot: boolean,
    teamId: number,
    summonerName: string,
    summonerId: string,
    spell1Id: number,
    spell2Id: number,
    gameCustomizationObjects: Array<GameCustomizationObject>
}

interface CurrentGameInfo {
    gameId: number,
    gameType: string,
    gameStartTime: number,
    mapId: number,
    gameLength: number,
    platformId: number,
    gameMode: string,
    bannedChampions: Array<BannedChampion>,
    gameQueueConfigId: number,
    participants: Array<CurrentGameParticipant>
}




let lolHttpsOptions = {
    "headers": {
        "X-Riot-Token": utils.tokens.riot
    }
}

https.get('https://ddragon.leagueoflegends.com/api/versions.json', (res: http.IncomingMessage) => {
    let data = ""
    res.on("data", (chunck: string) => {
        data = data + chunck
    })
    res.on("end", () => {
        version = JSON.parse(data)[0]
        console.log(`latest lol patch : ${version}`)
        https.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/item.json`, (res: http.IncomingMessage) => {
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
function spectate(msg: Discord.Message) {
    let summonerName = utils.parse(msg).slice(2).join(" ")
    console.log(summonerName)
    summonerByName(summonerName).then((value) => {
        console.log(value)
        spectator(value.id).then((result) => {
            let blueSide = ""
            let redSide = ""
            for (let i = 0; i < result.participants.length; ++i) {
                let current = result.participants[i]
                let currentText = `${current.bot ? "BOT " : ""} ${current.summonerName} \n`
                if (current.teamId == 100) {
                    blueSide = blueSide + currentText
                }
                else {
                    redSide = redSide + currentText
                }
            }
            let embed = new Discord.RichEmbed()
            embed.setTitle(`${summonerName}’s game`)
            embed.addField("Blue team", blueSide)
            embed.addField("Red team", redSide)
            console.log(embed, blueSide, redSide)

            msg.channel.send("", embed)
        }, (reason) => {
            msg.channel.send(JSON.stringify(reason))

        })
    }, (reason) => {
        msg.channel.send(JSON.stringify(reason))

    })
}
function spectator(summonerId: string) {
    let promise: Promise<CurrentGameInfo> = new Promise(function (resolve, reject) {
        console.log(summonerId)
        https.get(`https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}`, lolHttpsOptions, (res: http.IncomingMessage) => {
            let data = ""
            if (res.statusCode != 200) {
                reject("not found")
            }
            res.on("data", (chunck: string) => {
                data = data + chunck
                console.log(data)
            })
            res.on("end", () => {
                let parsed = JSON.parse(data)
                if (parsed.gameId && parsed.gameLength) {
                    let out = <CurrentGameInfo>parsed
                    resolve(out)
                }
                else {
                    reject("data corrupted")
                }
            })

        })
    })
    return promise

}




function matchInfo(matchId: number) {

    let promise: Promise<Array<MatchDto>> = new Promise(function (resolve, reject) {

        https.get(`https://euw1.api.riotgames.com/lol/match/v4/matches/${matchId}`, lolHttpsOptions, (res: http.IncomingMessage) => {
            let data = ""
            if (res.statusCode != 200) {
                reject("not found")
            }
            res.on("data", (chunck: string) => {
                data = data + chunck
            })
            res.on("end", () => {
                let parsed = JSON.parse(data)
                if (parsed.length && parsed.length > 0) {
                    let out = <Array<MatchDto>>parsed
                    resolve(out)
                }
                else {
                    reject("data corrupted")
                }
            })

        })
    })
    return promise

}



function getMatcheList(accountId: string) {
    let promise: Promise<Array<leaugeMatch>> = new Promise(function (resolve, reject) {

        https.get(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`, lolHttpsOptions, (res: http.IncomingMessage) => {
            let data = ""
            if (res.statusCode != 200) {
                reject("not found")
            }
            res.on("data", (chunck: string) => {
                data = data + chunck
            })
            res.on("end", () => {
                let parsed = JSON.parse(data)
                if (parsed.length && parsed.length > 0) {
                    let out = <Array<leaugeMatch>>parsed
                    resolve(out)
                }
                else {
                    reject("data corrupted")
                }
            })

        })
    })
    return promise
}


function summonerByName(name: string): Promise<summoner> {
    let promise: Promise<summoner> = new Promise(function (resolve, reject) {
        https.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`, lolHttpsOptions, (res: http.IncomingMessage) => {
            let data = ""
            if (res.statusCode != 200) {
                reject("not found")
            }
            res.on("data", (chunck: string) => {
                data = data + chunck
            })
            res.on("end", () => {
                let parsed = JSON.parse(data)
                if (parsed.id && parsed.accountId && parsed.name && parsed.puuid && parsed.profileIconId && parsed.summonerLevel) {
                    let out: summoner = {
                        id: parsed.id,
                        accountId: parsed.accountId,
                        puuid: parsed.puuid,
                        name: parsed.name,
                        profileIconId: parsed.profileIconId,
                        summonerLevel: parsed.summonerLevel
                    }
                    resolve(out)
                }
                else {
                    reject("data corrupted")
                }
            })

        })
    })
    return promise
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
            case "spectate":
                spectate(msg)
                break
        }
    }

} 
