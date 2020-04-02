
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

// Referencias de JQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

// ================================================
//           Funciones de renderizado
// ================================================

// Funcion para renderizar usuarios
function renderizarUsuarios( personas ){
    console.log(personas);

    // Html para crear el nombre de la sala y la lista de personas conectadas
    var html = ``;
    html += `<li>`    
    html += `   <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>`
    html += `</li>`

    // Recorrer el vector de personas
    for ( var i = 0; i< personas.length; i++ ){
        html += `<li>`;
        html += `    <a data-id="${personas[i].id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${personas[i].nombre} <small class="text-success">online</small></span></a>`;
        html += `</li>`;
    }

    // Cambiar el contenido del div de la lista de usuarios
    divUsuarios.html(html);
    scrollBottom();
    
}

// Funcion para renderizar mensajes
function renderizarMensajes( mensaje, yo ){

    // Declaracion de variables
    html = ``;
    var fecha = new Date(mensaje.fecha);
    var hora  = fecha.getHours() + ':' + fecha.getMinutes();

    // Clase de administrador
    var adminClass = 'info';
    if(mensaje.nombre === 'Administrador'){
        adminClass = 'danger';
    }

    // Reviso si el mensaje lo envié yo (true -> si), (false -> no)
    if( yo ){
        html += `<li class="reverse">`;
        html += `    <div class="chat-content">`;
        html += `        <h5>${mensaje.nombre}</h5>`;
        html += `        <div class="box bg-light-inverse">${mensaje.mensaje}</div>`;
        html += `    </div>`;
        html += `    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>`;
        html += `    <div class="chat-time">${hora}</div>`;
        html += `</li>`;
    }else{
        html += `<li class="animated fadeIn">`;
        if( mensaje.nombre !== 'Administrador' ) html +=     `<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>`;
        html +=     `<div class="chat-content">`;
        html +=         `<h5>${mensaje.nombre}</h5>`;
        html +=         `<div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>`;
        html +=     `</div>`;
        html +=     `<div class="chat-time">${hora}</div>`;
        html += `</li>`;
    }

    divChatbox.append(html);
    scrollBottom();
}

// Funcion para mantener el scroll en el bootom
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// ================================================
//              Listeners
// ================================================

// Cuando alguien hace click en un elemento "a" de "divUsuarios"
divUsuarios.on('click', 'a', function(){

    // Rescato el parametro "id" que puse en el "a"
    var id = $(this).data('id');

    // Valido la existencia de id
    if( id ){
        console.log(id);
    }

});

// Cuando se hace click en el boton de enviar
formEnviar.on('submit', function(e){

    // Eliminar el comportamiento por defecto del form
    e.preventDefault();

    // Validar que el input no este vacio
    if( txtMensaje.val().trim().length === 0 ){
        return;
    }

    // Evento para enviar el mensaje
    socket.emit('crearMensaje', {
        nombre: usuario.nombre,
        mensaje: txtMensaje.val()
    }, (res) => {
        txtMensaje.val('').focus();
        renderizarMensajes(res, true);
    });

});
