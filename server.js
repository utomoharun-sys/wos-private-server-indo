const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Database sederhana di dalam memori
const databasePemain = {};

// Data Pengumuman Default
let pengumumanServer = {
    judul: "Selamat Datang di WOS Private Server!",
    isi: "Nikmati fitur Free VIP 12, 99.999 Diamond, dan 999.999 Frost Star gratis untuk semua pemain baru!",
    waktu: new Date().toLocaleString('id-ID')
};

// ==========================================
// 1. ENDPOINT UNTUK GAME (CLIENT GAME WOS)
// ==========================================

// Endpoint Profil & Register Otomatis
app.get('/api/player/profile', (req, res) => {
    const playerId = req.query.id || "WOS-PLAYER-TEST";

    if (!databasePemain[playerId]) {
        databasePemain[playerId] = {
            playerId: playerId,
            playerName: `Pemain Baru ${Math.floor(1000 + Math.random() * 9000)}`,
            diamonds: 99999,
            frostStars: 999999,
            vipLevel: 12,
            allianceName: "Belum Ada Aliansi"
        };
        console.log(`[Database] Akun baru sultan dibuat: ${playerId}`);
    }
    return res.status(200).json(databasePemain[playerId]);
});

// Endpoint Top Up
app.post('/api/player/topup', (req, res) => {
    const { playerId, jenisItem, jumlahTopUp } = req.body;

    if (!databasePemain[playerId]) {
        return res.status(404).json({ error: "Akun tidak ditemukan!" });
    }

    if (jenisItem === "diamonds" || jenisItem === "frostStars") {
        databasePemain[playerId][jenisItem] += parseInt(jumlahTopUp);
        console.log(`[Database] Top up sukses untuk ${playerId}`);
        return res.status(200).json({ message: "Top up sukses!", profile: databasePemain[playerId] });
    } else {
        return res.status(400).json({ error: "Jenis item tidak valid!" });
    }
});

// ==========================================
// 2. HALAMAN PANEL ADMIN Sederhana (WEB BROWSER)
// ==========================================

app.get('/admin', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>WOS Admin Panel</title>
        <style>
            body { font-family: Arial; margin: 30px; background: #f4f6f9; }
            .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .form-group { margin-bottom: 15px; }
            label { display: block; font-weight: bold; margin-bottom: 5px; }
            input, select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
            button { background: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>👑 WOS Private Server Admin</h2>
            <div class="form-group">
                <label>ID Pemain (Player ID):</label>
                <input type="text" id="targetPlayerId" value="WOS-PLAYER-TEST">
            </div>
            <div class="form-group">
                <label>Jenis Item:</label>
                <select id="itemType">
                    <option value="diamonds">Diamonds</option>
                    <option value="frostStars">Frost Stars</option>
                </select>
            </div>
            <div class="form-group">
                <label>Jumlah:</label>
                <input type="text" id="topupAmount" value="50000">
            </div>
            <button onclick="sendTopUp()">Kirim Suntik Item</button>
        </div>
        <script>
            function sendTopUp() {
                const playerId = document.getElementById('targetPlayerId').value;
                const jenisItem = document.getElementById('itemType').value;
                const jumlahTopUp = document.getElementById('topupAmount').value;
                fetch(window.location.origin + '/api/player/topup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ playerId, jenisItem, jumlahTopUp })
                })
                .then(res => res.json())
                .then(data => alert(data.message || data.error));
            }
        </script>
    </body>
    </html>
    `);
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server WOS Pro berjalan di port ${PORT}`);
});