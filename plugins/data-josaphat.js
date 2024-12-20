let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.sendFile(m.chat, './picture/josaphat.jpg', './picture/josaphat.jpg', `
Nama: *Josaphat Millard Hutauruk*
Umur: 16
Kelas: XIA1

Ayah: John Dolok Haratua Hutauruk
Ibu: Maria Mutiara

`.trim(), m)
}

handler.help = ['josaphat <owner>']
handler.tags = ['data']
handler.rowner = true

handler.command = /^josaphat|josh|jomama/i

export default handler