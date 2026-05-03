const express = require('express');
const mqtt = require('mqtt');
const app = express();
const port = process.env.PORT || 3000;

// Konfigurasi MQTT (Kita gunakan Broker Publik HiveMQ untuk latihan)
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

mqttClient.on('connect', () => {
    console.log('Terhubung ke MQTT Broker');
});

// Tampilan utama di HP User
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Vending Machine Aldi</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: sans-serif; text-align: center; padding: 20px; background: #f0f2f5; }
                .product-card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                button { background: #007bff; color: white; border: none; padding: 15px 30px; border-radius: 10px; font-size: 18px; cursor: pointer; }
                #status { margin-top: 20px; color: #28a745; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="product-card">
                <h2>Vending Machine Aldi</h2>
                <p>Produk: Minuman Segar</p>
                <p>Harga: Rp 5.000</p>
                <button onclick="bayar()">BELI SEKARANG</button>
                <div id="status"></div>
            </div>

            <script>
                function bayar() {
                    document.getElementById('status').innerText = "Memproses Pembayaran...";
                    // Di sini nanti Aldi masukkan logika integrasi QRIS (Midtrans/Xendit)
                    // Untuk sekarang, kita asumsikan pembayaran langsung sukses
                    fetch('/trigger-motor?item=1')
                        .then(response => response.text())
                        .then(data => {
                            document.getElementById('status').innerText = "Pembayaran Sukses! Barang sedang keluar...";
                        });
                }
            </script>
        </body>
        </html>
    `);
});

// Endpoint untuk mengirim perintah ke ESP32
app.get('/trigger-motor', (req, res) => {
    const item = req.query.item;
    console.log(`Mengirim perintah untuk produk: ${item}`);
    
    // Mengirim pesan ke topik yang di-subscribe oleh ESP32
    mqttClient.publish('aldi/vending/perintah', 'PUTAR_MOTOR_1');
    
    res.send('Perintah Terkirim');
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
