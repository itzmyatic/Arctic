import fs from 'fs';
import * as ws from 'ws';
import path from 'path';
import { HelperConnection } from '../lib/simple.js';
import importFile from '../lib/import.js';
import single2multi from '../lib/single2multi.js';
import P from 'pino';
import Boom from '@hapi/boom';
import readline from 'readline';
import chalk from 'chalk';
// Menggunakan chalk untuk pewarnaan teks
import _ from 'lodash';
import path from 'path';
import { toBuffer } from 'qrcode';
import Connection from '../lib/connection.js';
import Store from '../lib/store.js';
import db from '../lib/database/index.js';

const {
    DisconnectReason,
    makeWASocket,
    areJidsSameUser,
    useMultiFileAuthState
} = await import('@whiskeysockets/baileys');

const usePairingCode = true;

let handler = async (m, { isPrems, conn: _conn, __dirname }) => {
    let user = await db.users.get(m.sender)

    const activeConnections = [...Connection.connections.entries()].filter(([_, { conn }]) => conn.user.jid && !conn.ws.isClosed);
    const users = [...new Set(activeConnections.map(([_, { conn }]) => conn.user))];

    if (users.length >= 30) {
        m.reply(`
🤖 Jadibot sudah penuh 🤖
`.trim());
        return;
    }

    // Prevent from duplicate ids
    let id = Connection.connections.size;
    while (Connection.connections.has(id))
        id++;

    const logger = Connection.logger.child({ jadibot: id });
    let store = Store.makeInMemoryStore();
    const folder = path.join(__dirname, '../sessions-jadibot', m.chat.split('@')[0].toString());
    let authState = await useMultiFileAuthState(folder);
    const opts = { store, logger, isChild: true, authState };

    let conn = await Connection.start(null, opts),
        lastQr;

    // Timeout jika tidak ada koneksi setelah 3 menit
    const timeout = setTimeout(() => {
        if (conn?.user?.jid) return;
        logout('timeout');
    }, 3 * 60 * 1000);  // Ubah timeout menjadi 3 menit (180.000 milidetik)

    const logout = async (reason) => {
        if (reason === 'timeout' && !conn?.user?.jid) {
            (lastQr || m).reply('Timeout! QR code tidak bisa dipindai setelah 3 menit.');
        }
        if (conn?.user?.jid) {
            await _conn.reply(conn.user.jid || m.chat, 'Koneksi terputus...');
        }
        conn.end();
        Connection.connections.delete(id);
        conn = store = authState = null;
        clearTimeout(timeout);
        await fs.promises.rm(folder, { force: true, recursive: true });
    };

    const sendSuccessLoginMessage = async () => {
        let waiting = 0;
        const wait = () =>
            new Promise((resolve) =>
                conn.user?.id ? resolve() : (waiting++, setTimeout(() => resolve(wait()), 500))
            );
        await wait();

        // Cek apakah ada koneksi yang duplikat
        const existing = activeConnections.find(([_, { conn: { user } }]) =>
            areJidsSameUser(user.id, conn.user.id)
        );

        if (existing) {
            await _conn.reply(conn.user.jid || m.chat, `Duplicate connection, close the oldest connection!`);
            existing[1].conn.end();
            Connection.connections.delete(existing[0]);
        }

        if (!existing) {
            await _conn.reply(
                conn.user.jid || m.chat,
                `
Berhasil tersambung dengan WhatsApp-mu.
\`\`\`
${JSON.stringify(conn.user, null, 2)}
\`\`\`
`.trim()
            );
        }
        clearTimeout(timeout);
    };

    /** @param {import('@whiskeysockets/baileys').BaileysEventMap<unknown>['connection.update']} update */
    async function connectionUpdate(update) {
    let jconn = makeWASocket({
        logger: P({ level: "silent" }),
        printQRInTerminal: !usePairingCode,
        auth: authState.state,
        browser: [ "Ubuntu", "Chrome", "20.0.04" ]
    })
        console.log(update, update.lastDisconnect?.error?.output);
        if (update.isNewLogin) {
            sendSuccessLoginMessage();
        }
        const code = update.lastDisconnect?.error?.output?.statusCode || update.lastDisconnect?.error?.output?.payload?.statusCode;
        if (code && code != DisconnectReason.loggedOut) {
            await Connection.reload(conn, true, opts);
            conn.ev.on('connection.update', connectionUpdate);
        } else if (code && code == DisconnectReason.loggedOut) {
            await logout();
        } else if (usePairingCode && !jconn.authState.creds.registered) {
            // Meminta pairing code
            await _conn.reply(conn.user.jid || m.chat, 'Masukan Nomer Yang Aktif Awali Dengan 62');
            const phoneNumber = m.text.trim();
            const jcode = await jconn.requestPairingCode(phoneNumber);
            await _conn.reply(conn.user.jid || m.chat, `Pairing code: ${jcode}`);
        }
    }

    conn.ev.on('connection.update', connectionUpdate);

    Connection.connections.set(id, { conn, store });
    sendSuccessLoginMessage();
};

handler.help = ['jadibot'];
handler.tags = ['premium'];

handler.command = /^jadibot$/i;

handler.limit = true;
handler.private = true;
handler.premium = true;

export default handler;