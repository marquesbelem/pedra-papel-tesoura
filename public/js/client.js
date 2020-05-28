const socket = io();

//assim que foi conectado
socket.on('connect', () => {
    $('#player').html('');
    $('#player').html('Olá jogador <strong>' + socket.id+ '</strong>');
})

//fazer algo quando a msg que foi enviada pelo servidor chega
socket.on('msg', (msg) => {
    $('#msg').append('<div class="card">'+
    '<div class="card-body">'
        + msg +
      '<h5 class="card-title">Outro Jogador</h5>'+
    '</div></div> ');

    $('#rowBtn').removeClass( "hide" ).addClass( "show" );
})

socket.on('msgPrivate', (msg) => {
    $('#msgPrivate').append('<div class="card">'+
    '<div class="card-body">'
        + msg +
      '<h5 class="card-title">Você</h5>'+
    '</div></div> ');
})

socket.on('joined', (msg) => {
    $('#text-room').html('');
    $('#text-room').html(msg);
})

socket.on('timer', (msg) => {
    $('#timer').html('');
    $('#timer').html(msg);
})

socket.on('sendResult', (msg) => {
    socket.emit('msg', {
        id: $('#room').val(),
        msg: $('#result').val().toLowerCase()
    });
})

socket.on('restartAll', () => {
    $('#msg').html('');
    $('#msgPrivate').html('');
    $('#rowBtn').removeClass( "show" ).addClass( "hide" );
    $('#result').val('');
})

$('button').click(() => {
    socket.emit('restart', $('#room').val());
});

$(() => {
    $('#room').keydown((key) => {
        if (key.keyCode === 13) {
            socket.emit('joined', $('#room').val());
            $('#room').prop("disabled", true);
        }
    })
})
