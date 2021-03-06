var socket = io();

// Obtengo los parametros de la URL
var params = new URLSearchParams( window.location.search );

// Valido que los campos en la URL no esten vacios
if( !params.has('nombre') || !params.has('sala') ){

    // Si estan vacios envio a index.html
    window.location = 'index.html';

    // Y mando un error
    throw new Error('El nombre y sala son necesarios');
}

// Si estan bien los parametros creo el usuario
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

// ===================================================================
// Funcion para saber si se conectó al socket
// ===================================================================
socket.on('connect', function() {

    console.log('Conectado al servidor');

    // Emito que quiero entrar a un chat enviando la informacion del usuario
    socket.emit('entrarChar', usuario, function( resp ) {

        // Ejecuto la funcion para renderizar usuarios
        renderizarUsuarios(resp);

    });
});

// ===================================================================
// Funcion para saber si se pierde la coneccion con el servidor
// ===================================================================
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// ===================================================================
// Escuchar información para los usuarios
// ===================================================================
socket.on('crearMensaje', function(mensaje) {

    // console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false);

});

// ===================================================================
// Escuchar cambios cuando un usuario entra y sale del chat
// ===================================================================
socket.on('listaPersonas', personas => {

    // Ejecuto la funcion para renderizar usuarios
    renderizarUsuarios(personas);
});

// ===================================================================
// Escucho mensajes privados
// ===================================================================
socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje privado: ', mensaje);
})