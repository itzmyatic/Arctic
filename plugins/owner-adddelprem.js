import fs from 'fs';  // Untuk menyimpan perubahan ke config.js

let handler = async (m, { text, usedPrefix, command }) => {
    // Cek apakah input teks tidak kosong
    if (!text) return m.reply(`Gunakan format: ${usedPrefix}${command} 62xxxxx`);

    // Nomor yang diinput
    let number = text.trim();

    // Cek apakah nomor valid (nomor harus angka saja)
    if (!/^\d+$/.test(number)) return m.reply('Masukkan nomor yang valid tanpa spasi atau karakter lain!');

    if (command.toLowerCase() === 'addprem') {
        // Cek apakah nomor sudah ada di daftar premium
        if (global.prems.includes(number)) {
            return m.reply(`Nomor ${number} sudah ada dalam daftar premium.`);
        }

        // Tambahkan nomor ke daftar premium dengan format: , '62xxxxx'
        global.prems.push(number);
        m.reply(`Berhasil menambahkan nomor premium: , '${number}'`);
        savePremiumsToConfig();

    } else if (command.toLowerCase() === 'delprem') {
        // Cek apakah nomor ada di daftar premium
        if (!global.prems.includes(number)) {
            return m.reply(`Nomor ${number} tidak ditemukan dalam daftar premium.`);
        }

        // Hapus nomor dari daftar premium
        global.prems = global.prems.filter(prem => prem !== number);
        m.reply(`Berhasil menghapus nomor premium: , '${number}'`);
        savePremiumsToConfig();
    }
};

// Fungsi untuk menyimpan daftar user premium ke dalam file config.js
function savePremiumsToConfig() {
    // Baca isi file config.js
    let configFile = fs.readFileSync('./config.js', 'utf-8');

    // Ubah konten global.prems dalam file config.js
    let newConfig = configFile.replace(
        /global\.prems\s*=\s*\[[^\]]*\]/,  // Cari global.prems dalam file config.js
        `global.prems = [${global.prems.map(num => `'${num}'`).join(", ")}]` // Format: ', '62xxxxx'
    );

    // Tulis perubahan ke file config.js
    fs.writeFileSync('./config.js', newConfig, 'utf-8');
}

// Tambahkan daftar command yang dapat digunakan
handler.help = ['addprem [nomor]', 'delprem [nomor]'];
handler.tags = ['owner'];
handler.command = /^(addprem|delprem)$/i;

// Pastikan hanya owner yang bisa menggunakan command ini
handler.rowner = true;

export default handler;