const path = require('path');
const express = require('express');
const hbs = require('hbs');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../template/views');

app.set('view engine', 'hbs');
app.set('views', viewsPath);

app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.render('index', {
        welcome: "Seja bem vindo ao Pedra, Papel, Tesoura",
        stacks: "Desenvolvido em NodeJS + Socket IO + Express + hbs"
    })
})

let counter = 11;
let interval;

function EmitTimer(data) {
    if (counter <= 0) {
        clearInterval(interval);
        io.to(data).emit('sendResult', 'send results');
        return;
    }

    counter = counter - 1;
    io.to(data).emit('timer', counter);  
}

//o param socket representa aquele cliente/usuario que foi conectado
io.on('connection', (socket) => {
    socket.on('joined', (data) => {
        socket.join(data);
        socket.emit('joined', 'Você está conectado na sala ' + data);

        var clientsList = io.sockets.adapter.rooms[data];

        if (clientsList.length >= 2)
            interval = setInterval(() => EmitTimer(data), 1000);
    })

    //receber a msg que está vindo do cliente
    socket.on('msg', (data) => {
        //avisa/envia para todo mundo que está conectado  
        //broadcast -> não manda para o proprio socket, manda para todos exceto ele     
        //socket.broadcast.emit('msg', msg);
        //socket.to(data.id).broadcast.emit('msg', data.msg);

        const move = '<img src="/img/' + data.msg + '.jpg">'
        //io.in(data.id).emit('msg', move); //envia para todos os clientes
        socket.to(data.id).broadcast.emit('msg', move);
        io.to(socket.id).emit('msgPrivate', move);
    })

    socket.on('restart', (data) => {
        io.to(data).emit('restartAll');
        counter = 11;
        interval = setInterval(() => EmitTimer(data), 1000);
    })
})



http.listen(3000, () => {
    console.log('Listen port 3000');
})