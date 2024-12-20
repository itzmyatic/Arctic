let handler = async (m, { conn, text, usedPrefix, command }) => {
conn.sendFile(m.chat, './picture/qris.png', './picture/qris.png', null, m)
}    
handler.help = ['qris']
handler.tags = ['info']
handler.command = /^qris$/i

export default handler
