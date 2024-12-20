import fs from 'fs'
import path from 'path'
import ws from 'ws'
import Connection from '../lib/connection.js'
import Store from '../lib/store.js'
import db from '../lib/database/index.js'

let isFarmStopped = false

const {
    generateForwardMessageContent,
    generateWAMessageContent,
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    generateWAMessage,
    DisconnectReason,
    default: makeWASocket,
} = (await import('@whiskeysockets/baileys')).default

// Fungsi utama untuk menangani command <>farm {pesan} {delay}
let handler = async (m, { sock, text, command, bot, conn: _conn, usedPrefix, args }) => {
    let user = await db.users.get(m.sender)
    // Mengambil user dari database

    // Cek apakah pengirim adalah nomor bot itu sendiri
    const botNumber = _conn.user.id.split(":")[0] + '@s.whatsapp.net'
    if (m.sender !== botNumber) {
        // Cek apakah nomor pengirim sama dengan nomor bot
        m.reply('Perintah ini hanya dapat digunakan oleh _*Nomer Bot Ini*_ !')
        return
    }

    // Fungsi untuk menghentikan pengiriman pesan otomatis
    if (command.toLowerCase() == 'farm') {
        isFarmStopped = false
        // Mendapatkan konten pesan dari args
        let message = args[0]
        // Pesan yang akan dikirim
        let delayInMs = args[1] ? parseInt(args[1]) * 1000 : 0
        // Delay antara setiap pengiriman pesan
        let timeoutInMs = args[2] ? parseInt(args[2]) * 1000 : null
        // Timeout untuk menghentikan pengiriman pesan (null jika tidak ada timeout)

        // Validasi angka delay
        if (!message || isNaN(delayInMs)) {
            m.reply('Gunakan format: farm [message] [delay] [timeout]')
        } else {
            // Informasikan tentang pengiriman pesan berulang
            let delayInfo = delayInMs ? ` setiap ${args[1]} detik` : ' tanpa delay'
            let timeoutInfo = timeoutInMs ? `Timeout: *${args[2]} detik*` : 'Tidak ada timeout (akan berjalan hingga dihentikan).'

            m.reply(`🟢Farm ON🟢 \n *${message}* \n Delay: *${args[1]} detik* \n ${timeoutInfo}`)
            
            let startTime = Date.now()
            message = message.replace(/_/g, ' ')

        // Jika ada yang ditag dalam pesan, gunakan m.mentionedJid
            let mentionedJid = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid : []
            if (mentionedJid.length > 0) {
              message = `@${mentionedJid[0].split('@')[0]}`
            }

            // Fungsi pengiriman pesan berulang
            const sendMessageRecursively = async (message, delayInMs, timeoutInMs, startTime) => {
                // Cek jika timeout diisi dan waktu timeout sudah tercapai, atau jika dihentikan secara manual
                if ((timeoutInMs && (Date.now() - startTime >= timeoutInMs)) || isFarmStopped) {
                    m.reply(isFarmStopped ? '⛔Farm Stop⛔' : '*UDAH TIMEOUT WOY*')
                    return
                }

                // Kirim pesan dengan mention jika ada
                let smessage = {
                    text: message,
                    mentions: mentionedJid  // Tambahkan mentions jika ada
                }
                await _conn.sendMessage(m.chat, smessage)

                // Lanjutkan pengiriman pesan setelah delay
                setTimeout(() => {
                    sendMessageRecursively(message, delayInMs, timeoutInMs, startTime)
                }, delayInMs)
            }

            // Mulai pengiriman pesan berulang
            sendMessageRecursively(message, delayInMs, timeoutInMs, startTime)
        }
    } else {
        isFarmStopped = true
    }
}

// Tambahkan daftar command yang dapat digunakan
handler.help = ['farm', 'stop']
handler.tags = ['premium']
handler.command = /^(farm|stop)$/i

export default handler

// Helper function untuk validasi angka
function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}