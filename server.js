const express = require('express');
const cors = require('cors');
const app = express();

// Middleware wajib agar bisa membaca data JSON dan menghindari blokir CORS
app.use(cors());
app.use(express.json()); 

// Database sederhana di dalam memori (RAM) server
const databasePemain = {};

// 1. ENDPOINT PROFIL & PEMBUATAN AKUN OTOMATIS
app.get('/api/player/profile', (req, res) => {
    const playerId = req.query.id || "WOS-PLAYER-TEST";

    console.log(`-> Request profil masuk untuk ID: ${playerId}`);

    // Jika akun belum ada, otomatis buat baru dengan saldo melimpah
    if (!databasePemain[playerId]) {
        databasePemain[playerId] = {
            playerId: playerId,
            playerName: `Pemain Baru ${Math.floor(1000 + Math.random() * 9000)}`,
            diamonds: 99999,      // Modal awal Diamond Gratis langsung 99.999
            frostStars: 999999,   // Modal awal Frost Star langsung 999.999
            vipLevel: 12,          // Langsung otomatis VIP 12
            allianceName: "Belum Ada Aliansi"
        };
        console.log(`[Database] Akun baru sultan berhasil dibuat untuk ID: ${playerId}`);
    }

    // Kirim data akun ke aplikasi game
    return res.status(200).json(databasePemain[playerId]);
});

// 2. ENDPOINT SIMULASI TOP UP (DIAMOND & FROST STAR)
app.post('/api/player/topup', (req, res) => {
    const { playerId, jenisItem, jumlahTopUp } = req.body; 
    // jenisItem bisa berupa: "diamonds" atau "frostStars"

    console.log(`-> Request Top Up ${jenisItem} masuk untuk ID: ${playerId} sebesar ${jumlahTopUp}`);

    // Periksa apakah akun ada di database
    if (!databasePemain[playerId]) {
        return res.status(404).json({ error: "Akun tidak ditemukan!" });
    }

    // Validasi tipe item yang di-top up
    if (jenisItem === "diamonds" || jenisItem === "frostStars") {
        databasePemain[playerId][jenisItem] += parseInt(jumlahTopUp);
        console.log(`[Database] Top up sukses! ${jenisItem} terbaru untuk ${databasePemain[playerId].playerName}: ${databasePemain[playerId][jenisItem]}`);
        
        return res.status(200).json({
            message: `Top up ${jenisItem} berhasil!`,
            profile: databasePemain[playerId]
        });
    } else {
        return res.status(400).json({ error: "Jenis item tidak valid! Gunakan 'diamonds' atau 'frostStars'" });
    }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server game berjalan lancar di port ${PORT}`);
});