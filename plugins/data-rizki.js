let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.sendFile(m.chat, './picture/rizki.jpg', './picture/rizki.jpg', `
Penipu 2 juta rupiah ▶️

Nama : Rizki
Nomor Telepon : 085785089431
Nomor WA : wa.me/6285785089431

`.trim(), m)
}

handler.help = ['rizki']
handler.tags = ['data']

handler.command = /^rizki/i

export default handler