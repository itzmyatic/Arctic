import db from '../lib/database/index.js'

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

let handler = async (m, { conn, text, isOwner }) => {
  let [_, code, expired] = text.match(linkRegex) || []
  if (!code) throw 'Link invalid'
  let res = await conn.groupAcceptInvite(code)
  expired = Math.floor(Math.min(999, Math.max(1, isOwner ? isNumber(expired) ? parseInt(expired) : 0 : 3)))
  m.reply(`Berhasil join grup ${res}${expired ? ` selama ${expired} hari` : ''}`)
  let chats = db.users.get(res)
  if (!chats) {
    chats = {
      expired: 0
    }
    db.users.update(res, chats)
  }
  if (expired) {
    db.users.update(res, (chats) => {
      chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24
    })
  }
}
handler.help = ['rjoin <chat.whatsapp.com>']
handler.tags = ['premium']
handler.rowner = true

handler.command = /^rjoin$/i

export default handler

const isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x))