const express = require('express');
const app = express();

app.use(express.json());

// Jalur simulasi saat aplikasi game WoS ...
app.get('/api/player/profile', (req, res) => {
    console.log("Aplikasi game WoS sedang ...");

    // Di sini kita kunci data agar akun ...
    const dataPemainTiruan = {
        playerId: "WOS-FREE-VIP12",
        playerName: "Developer Server",
        diamonds: 9999999,
        vipLevel: 12, // Mengunci status ...
        allianceName: "Private Server Cre..."
    };

    res.json(dataPemainTiruan);
});

// Menyalakan server lokal di laptop HP A...
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server lokal WoS buatan ...`);
});