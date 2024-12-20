let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.sendFile(m.chat, './picture/rizki.png', './picture/rizki.png', `
Scammer List ➡️ 
- wa.me/6285785089431
~ Rizki -> (/Rizki)

- wa.me/6285215960827
~ Exsan

`.trim(), m)
}

handler.help = ['penipu <data (hati - hati)>']
handler.tags = ['data']

handler.command = /^penipu/i

export default handler