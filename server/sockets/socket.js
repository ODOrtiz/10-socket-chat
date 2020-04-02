const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

// Cuando un usuario se conecta
io.on('connection', (client) => {

    // Se llama cuando alguien entra en el char
    client.on('entrarChar', (usuario, callback) => {

        // Verifico que vengan los parametros obligatorios
        if( !usuario.nombre || !usuario.sala ){
            return callback({
                error: true,
                message: 'El nombre y sala es necesario'
            })
        }

        // Suscribir el usuario a una sala
        client.join(usuario.sala);

        // Agrego la nueva persona a la lista de personas
        let personas = usuarios.agregarPersona( client.id, usuario.nombre, usuario.sala );

        // Emito que personas estan conectadas
        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));

        // Regreso como callback la lista de personas (pero es opcional)
        callback(personas);
    });

    // Enviar mensajes a todos los usuarios de la sala (.to())
    client.on('crearMensaje' , data => {

        // Rescato la persona que envia el mensaje
        let persona = usuarios.getPersona( client.id );

        // Creo el mensaje con el nombre del remitente y el mensaje
        let mensaje = crearMensaje( persona.nombre, data.mensaje );

        // Envio el mensaje
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

    });

    // Cuando un cliente se desconecta
    client.on('disconnect', () => {

        // Borro a la persona de la lista de conectados
        let personaBorrada = usuarios.borrarPersona( client.id );

        // Emito que se ha desconectado una persona a la sala (.to())
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));

        // Emito una lista actualizada de personas conectadas a la sala (.to())
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    // Envio de mensajes privados
    client.on('mensajePrivado', data => {

        // Obtengo la persona que envia el mensaje
        let persona = usuarios.getPersona( client.id );

        // Envio el mensaje a la persona (ID) para la que esta destinado el mensaje
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje( persona.nombre , data.mensaje ));

    });



});