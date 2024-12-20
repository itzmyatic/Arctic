let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    m.reply(`Mengirim 🛩️...`)
    conn.sendFile(m.sender, './picture/komunitas/komunitas.jpg', './picture/komunitas/komunitas.jpg', `
👥 Join Group Official Neri Bot: 
https://chat.whatsapp.com/HzZsEiYpj7V8940g6eiSic
`.trim(), m)
}

handler.help = ['komunitas']
handler.tags = ['data']

handler.command = /^komunitas|community/i

export default handler