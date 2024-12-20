import db from '../lib/database/index.js';

async function showAutoNeriHistory(m, conn) {
  const who = m.sender;
  let user = await db.users.get(who);
  const history = user.autoneriplus || [];

  if (history.length === 0) {
    conn.reply(m.chat, 'Tidak ada history percakapan dengan AutoNeri.', m);
    return;
  }

  let historyMessage = '';
  for (let i = 0; i < history.length; i++) {
    const message = history[i];
    const role = i % 2 === 0 ? `👥 ${user.nama}` : '🤖 AutoNeri';
    historyMessage += `${role}: ${message}\n`;
  }

  conn.reply(m.chat, '🚀 Berikut adalah history percakapan dengan AutoNeri 🤖:\n\n' + historyMessage, m);
}

async function handler(m, { conn, command }) {
  if (['anh', 'autonerihistory'].includes(command)) {
    await showAutoNeriHistory(m, conn);
  }
}

handler.help = ['anh', 'autonerihistory'];
handler.tags = ['ai'];
handler.command = /^(anh|autonerihistory)$/i;

export default handler;