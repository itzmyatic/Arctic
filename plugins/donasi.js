let handler = async (m, { conn, text, usedPrefix, command }) => {
conn.sendFile(m.chat, './picture/qris.png', './picture/qris.png', `
╭─「 Donasi • Pulsa 」
│ • Telkomsel [082213162100]
╰────

╭─「 Donasi • Non Pulsa 」
│ • Gopay [082213162100]
╰────
`.trim(), m)
}    
handler.help = ['donasi']
handler.tags = ['info']
handler.command = /^dona(te|si)$/i

export default handler
