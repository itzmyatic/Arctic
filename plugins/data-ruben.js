let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.sendFile(m.chat, './picture/ruben.jpg', './picture/ruben.jpg', `
Nama: *Ruben Orville Sebayang*
Umur: 16
Kelas: XIA4

Ayah: Hendra
Ibu: Nina

`.trim(), m)
}

handler.help = ['ruben <owner>']
handler.tags = ['data']
handler.rowner = true

handler.command = /^ruben|benben|ben2/i

export default handler