let handler = async (m, { conn, text, usedPrefix, command }) => {
    m.reply(`
🪙 List Rank (Neri 🍣):
➢ user premium ⇝ 15k/bulan
➢ jadibot premium ⇝ 10k/bulan
➢ jadibot premium (newest version) ⇝ 17.5k/bulan
➢ jadibot deluxe (slot 0/2) ⇝ 100k/bulan
➢ user vip ⇝ 25k/bulan (coming soon)

👥 List Join Group (Neri 🍣):
➤ 1 bulan ➜ 10k
➤ 2 bulan ➜ 20k
➤ 3 bulan ➜ 25k
`.trim())
}

handler.help = ['premium', 'store']
handler.tags = ['premium']

handler.command = /^(premium|store)$/i

export default handler