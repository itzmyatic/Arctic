import fs from 'fs';  // Untuk menyimpan perubahan ke config.js

let handler = async (m, { text, usedPrefix, command }) => {
    // Cek apakah input teks tidak kosong
    if (!text) return m.reply(`Gunakan format: ${usedPrefix}${command} nomor1, nomor2, ...`);

    // Pisahkan input nomor berdasarkan koma dan spasi
    let numbersToRemove = text.split(',').map(v => v.trim());

    // Variabel untuk menyimpan nomor yang berhasil dihapus
    let removedNumbers = [];

    // Iterasi untuk setiap nomor yang dimasukkan
    numbersToRemove.forEach(num => {
        // Cek apakah nomor ada di global.prems
        if (global.prems.includes(num)) {
            // Hapus nomor dari global.prems jika ada
            global.prems = global.prems.filter(prem => prem !== num);
            removedNumbers.push(num);
        } else {
            // Jika tidak ada, beri tahu bahwa nomor tidak ditemukan
            m.reply(`Nomor ${num} tidak ditemukan dalam daftar premium.`);
        }
    });

    // Jika ada nomor yang berhasil dihapus, beri notifikasi
    if (removedNumbers.length > 0) {
        m.reply(`Berhasil menghapus user premium:\n${removedNumbers.join(', ')}`);
        // Simpan daftar premium yang sudah diperbarui ke file config.js
        savePremiumsToConfig();
    } else {
        m.reply(`Tidak ada nomor yang dihapus.`);
    }
};

// Fungsi untuk menyimpan daftar user premium ke dalam file config.js
function savePremiumsToConfig() {
    // Baca isi file config.js
    let configFile = fs.readFileSync('./config.js', 'utf-8');
    
    // Ubah konten global.prems dalam file config.js
    let newConfig = configFile.replace(
        /global\.prems\s*=\s*\[[^\]]*\]/,  // Cari global.prems dalam file config.js
        `global.prems = [${global.prems.map(num => `'${num}'`).join(", '")}]` // Simpan dengan format ", '62xxxxx'"
    );

    // Tulis perubahan ke file config.js
    fs.writeFileSync('./config.js', newConfig, 'utf-8');
}

// Tambahkan daftar command yang dapat digunakan
handler.help = ['delprem [nomor]'];
handler.tags = ['owner'];
handler.command = /^(delprem)$/i;

// Pastikan hanya owner yang bisa menggunakan command ini
handler.rowner = true;

export default handler;