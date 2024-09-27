import { Router } from "express";
import pool from '../database.js'

const router = Router();

router.get('/login', (req, res) => {
    res.render('personas/login', { showNav: true});
});


router.get('/add', (req, res) => {
    res.render('personas/add', { showNav: true});
});

router.get('/listHotel', (req, res) => {
    res.render('personas/listHotel', { showNav: true, showFooter: true }); 
});


// Ruta para agregar una nueva persona (POST)
router.post('/personas/add', async (req, res) => {
    try {
        const { name, lastname, age, FK_tipopersona, password } = req.body;

        // Llamar al procedimiento almacenado para agregar la persona
        await pool.query('CALL AddPersona(?, ?, ?, ?, ?)', [name, lastname, age, FK_tipopersona, password]);

        // Enviar una respuesta JSON indicando que fue exitoso
        res.json({ success: true, message: 'Guardado con éxito' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});



// Ruta para listar personas (GET)
router.get('/personas/list', async (req, res) => {
    try {
        const [result] = await pool.query('CALL GetPersonasList()');
        res.render('personas/list', {showNav: true, showFooter: true, personas: result[0]});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});



router.get('/list', async(req, res) => {
    try {
        // Llamada al procedimiento almacenado GetPersonas
        const [result] = await pool.query('CALL GetPersonas()');
        res.render('personas/list', { showNav: true, showFooter: true, personas: result[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


/*******************editar **************** */
router.get('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Llamar al procedimiento almacenado para obtener la información de la persona
        const [personaResult] = await pool.query('CALL GetPersonaByID(?)', [id]);
        console.log('Datos de persona (result completo):', personaResult); // Verificar la estructura completa

        // Verificar que los datos de la persona existan
        if (personaResult[0].length === 0) {
            return res.status(404).send('Persona no encontrada');
        }

        const persona = personaResult[0][0]; // Obtener la primera persona del array anidado
        console.log('Datos de persona (procesados):', persona); // Verificar que la persona está correctamente procesada

        // Ejecutar el procedimiento almacenado para obtener los tipos de persona
        const [tiposPersonaResult] = await pool.query('CALL GetTiposPersona()');
        console.log('Tipos de persona (result):', tiposPersonaResult); // Verificar si los datos llegan correctamente

        const tiposPersona = tiposPersonaResult[0]; // Accede al primer array de resultados
        console.log('Tipos de persona procesados:', tiposPersona); // Verificar que estamos accediendo a los datos correctos

        // Renderizar la vista de edición con la persona y los tipos de persona
        res.render('personas/edit', {
            persona,        // Pasamos la información de la persona
            tiposPersona    // Pasamos los tipos de persona para el select
        });
    } catch (err) {
        console.error('Error en la ruta /edit/:id:', err.message); // Captura y muestra el error
        res.status(500).json({ message: err.message });
    }
});


router.post('/edit/:id', async (req, res) => {
    try {
        const { name, lastname, age, FK_tipopersona } = req.body;
        const { id } = req.params;

        // Llamar al procedimiento almacenado para actualizar la persona
        await pool.query('CALL UpdatePersonaByID(?, ?, ?, ?, ?)', [id, name, lastname, age, FK_tipopersona]);

        // Redirigir a la lista de personas después de la actualización
        res.redirect('/list');
    } catch (err) {
        console.error('Error en la ruta /edit/:id (POST):', err.message);
        res.status(500).json({ message: err.message });
    }
});

/*******************end editar **************** */
/******************* eliminar usuario  **************** */
router.get('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Llamar al procedimiento almacenado para eliminar a la persona
        await pool.query('CALL DeletePersonByID(?)', [id]);

        // Redirigir de vuelta a la lista una vez completada la eliminación
        res.redirect('/list');
    } catch (err) {
        // Manejo de errores
        console.error('Error al eliminar la persona:', err.message);
        res.status(500).json({ message: 'Ocurrió un error al eliminar la persona.' });
    }
});
/*******************end eliminar usuario **************** */
/*******************validad usuario en la base de datos **************** */
export default router;

router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;

        // Ejecutar el procedimiento almacenado para validar el usuario
        const [result] = await pool.query('CALL ValidateUserByName(?, ?)', [name, password]);

        if (result[0].length > 0) {
            // Si las credenciales son correctas, almacenar el nombre de usuario y el ID en la sesión
            req.session.user = result[0][0].name;  // Nombre del usuario
            req.session.user_id = result[0][0].id; // ID del usuario
            res.redirect('/');  // Redirigir a la página deseada
        } else {
            // Si las credenciales no son correctas, renderiza la página de login con un mensaje de error
            res.render('personas/login', { errorMessage: 'Nombre o contraseña incorrectos' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');  // Redirigir al login después de cerrar sesión
    });
});

/*******************end validad usuario en la base de datos **************** */
/******************reserva *********************/

router.post('/reservar', async (req, res) => {
    try {
        const { hotel_name, location_lat, location_lng } = req.body;

        // Asegúrate de que el usuario está autenticado
        if (!req.session.user_id) {
            return res.status(401).send('Debe iniciar sesión para realizar una reserva');
        }

        // Obtener el ID del usuario desde la sesión
        const userId = req.session.user_id;

        // Llamar al procedimiento 
        await pool.query('CALL InsertReservation(?, ?, ?, ?)', 
            [userId, hotel_name, location_lat, location_lng]);

        // Redirigir a la página de confirmación o mostrar un mensaje
        res.redirect('/reserva');
    } catch (err) {
        console.error('Error al realizar la reserva:', err);
        res.status(500).send('Error al procesar la reserva');
    }
});

/*********************************reserva  */
router.get('/reserva', async (req, res) => {
    try {
        // Verificar si el usuario ha iniciado sesión
        if (!req.session.user_id) {
            return res.redirect('/login');  // Redirigir si no ha iniciado sesión
        }

        // Llamar al procedimiento almacenado para obtener las reservas del usuario
        const [reservas] = await pool.query('CALL GetUserReservations(?)', [req.session.user_id]);

        // Verificar si hay reservas
        if (reservas.length === 0) {
            return res.render('personas/reserva', { message: 'No tienes reservas aún.', showNav: true });
        }

        // Renderizar la vista reserva.hbs con los datos de reservas
        res.render('personas/reserva', { reservas: reservas[0], showNav: true });
    } catch (err) {
        console.error('Error al obtener reservas:', err);
        res.status(500).send('Error al procesar las reservas');
    }
});

/********eliminar reserva con trigger */

// Ruta para eliminar una reserva específica
router.get('/reserva', async (req, res) => {
    try {
        // Verificar si el usuario ha iniciado sesión
        if (!req.session.user_id) {
            return res.redirect('/login');  // Redirigir si no ha iniciado sesión
        }

        // Obtener las reservas del usuario autenticado
        const [reservas] = await pool.query('CALL GetUserReservations(?)', [req.session.user_id]);

        // Verificar si hay reservas
        if (reservas.length === 0) {
            return res.render('personas/reserva', { message: 'No tienes reservas aún.', showNav: true });
        }

        // Renderizar la vista con las reservas, asegurando que cada reserva tenga un ID
        res.render('personas/reserva', { reservas: reservas[0], showNav: true });
    } catch (err) {
        console.error('Error al obtener reservas:', err);
        res.status(500).send('Error al procesar las reservas');
    }
});


router.get('/reserva/delete/:id', async (req, res) => {
    try {
        // Verificar si el usuario ha iniciado sesión
        if (!req.session.user_id) {
            return res.redirect('/login');  // Redirigir si no ha iniciado sesión
        }

        const { id } = req.params;  // Obtener el ID de la reserva desde la URL
        const userId = req.session.user_id;  // Obtener el ID del usuario desde la sesión

        // Llamar al procedimiento almacenado para eliminar la reserva por su ID
        await pool.query('CALL DeleteReservationByID(?, ?)', [id, userId]);

        // Redirigir de vuelta a la página de reservas después de la eliminación
        res.redirect('/reserva');
    } catch (err) {
        console.error('Error al eliminar la reserva:', err);
        res.status(500).send('Error al eliminar la reserva');
    }
});
















