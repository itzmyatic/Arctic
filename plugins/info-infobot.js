import db from '../lib/database/index.js'
import { performance } from 'perf_hooks';
import { getUserCache } from './_cache.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {    
    const message = await m.reply('_Loading ⭕_')
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    
    let old = performance.now()
    await message
    let neww = performance.now()
    
    let users = getUserCache();
    
    m.reply(`
════════════════════
╠═〘 ${conn.getName(conn.user.jid)} 〙 ═
╠➥ 🧬 *Versi:* 0.4.0
╠➥ 🏠 *HomePage:* bit.ly/nerigroup
╠➥ ⚠️ *Issue:* wa.me/6282213162100
╠➥ ⭕ *Prefix:* '${usedPrefix}'
╠➥ 💿 *Menu:* ${usedPrefix}menu
╠➥ 🌐 *Ping:* ${Math.floor((neww - old) * 10000)} *ms*
╠➥ 👥 *Total user:* ${users.length} *user*
╠➥ 🔼 *Uptime:* ${uptime}
║
╠═〘 DONASI 〙 ═
╠➥ Gopay: 082213162100
╠➥ Telkomsel: 082213162100
║
╠═ Request? wa.me/6282213162100
════════════════════
`.trim())
}

handler.help = ['infobot']
handler.tags = ['info']

handler.command = /^(infobot)$/i
handler.rowner = false

export default handler


function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}