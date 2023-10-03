const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();
require('./src/dbConnection');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require('./src/routes')(app);
const { SocketProcess } = require('./src/services/chat');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

SocketProcess(io);

server.listen(process.env.PORT, () => {
    console.log(`Server Listening On Port :- ${process.env.PORT}`);
});

