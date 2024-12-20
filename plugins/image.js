import axios from 'axios';
// Untuk melakukan permintaan HTTP

// Mengambil API Key dari file .env
const UNSPLASH_API_KEY = 'G2Um3JcxKBj1gH_OtyBzXj0iL8dZQHzEabGWn5mYzlo';

let handler = async (m, { conn, args }) => {
    // Validasi jika ada kata kunci yang dimasukkan
    if (!args[0]) return m.reply(`Gunakan format: >image [kata kunci]`);

    // Kata kunci pencarian gambar
    let query = args.join(' ').trim();
    
    try {
        // Lakukan pencarian gambar ke Unsplash API
        let response = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query, per_page: 1 },  // Mengambil satu gambar pertama berdasarkan kata kunci
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
            }
        });

        let imageUrl = response.data.results[0]?.urls?.regular;
        
        if (!imageUrl) {
            return m.reply('Gambar tidak ditemukan!');
        }

        // Kirim gambar ke chat
        await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: `Hasil pencarian gambar untuk: *${query}*` });
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat mencari gambar. Silakan coba lagi nanti.');
    }
};

// Tambahkan daftar command yang dapat digunakan
handler.help = ['uimage [kata kunci]'];
handler.tags = ['tools'];
handler.command = /^(uimage)$/i;

// Hanya untuk user yang diizinkan (opsional)
handler.rowner = false;

export default handler;