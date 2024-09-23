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



router.get('/list', async(req, res)=>{
    try{
        const [result] = await pool.query('SELECT personas.id ,personas.name, personas.lastname,personas.age, tipopersona.Nombre FROM personas INNER JOIN tipopersona on tipopersona.ID = personas.FK_tipopersona');
        res.render('personas/list', {showNav: true, showFooter: true, personas: result})
    }catch(err){
        res.status(500).json({message:err.message});
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

router.get('/delete/:id', async(req, res)=>{
    try {
        const{id} = req.params;
        await pool.query('DELETE FROM personas WHERE id = ?', [id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});

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
/******************reserva */

router.post('/reservar', async (req, res) => {
    try {
        const { hotel_name, location_lat, location_lng } = req.body;

        // Asegúrate de que el usuario está autenticado
        if (!req.session.user_id) {
            return res.status(401).send('Debe iniciar sesión para realizar una reserva');
        }

        // Obtener el ID del usuario desde la sesión
        const userId = req.session.user_id;  // ID del usuario

        // Insertar los datos en la tabla de reservas
        await pool.query('INSERT INTO reservas (FK_persona, hotel_name, location_lat, location_lng) VALUES (?, ?, ?, ?)', 
            [userId, hotel_name, location_lat, location_lng]);

        // Redirigir a la página de confirmación o mostrar un mensaje
        res.redirect('/reserva');  // Redirige a una página de confirmación de reserva
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

        // Obtener las reservas del usuario autenticado
        const [reservas] = await pool.query('SELECT hotel_name, location_lat, location_lng FROM reservas WHERE FK_persona = ?', [req.session.user_id]);

        // Verificar si hay reservas
        if (reservas.length === 0) {
            return res.render('personas/reserva', { message: 'No tienes reservas aún.', showNav: true });
        }

        // Renderizar la vista reserva.hbs con los datos de reservas
        res.render('personas/reserva', { reservas, showNav: true });
    } catch (err) {
        console.error('Error al obtener reservas:', err);
        res.status(500).send('Error al procesar las reservas');
    }
});

// Ruta para editar una reserva (GET)
router.get('/reserva/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener los datos de la reserva a editar
        const [reserva] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);

        if (reserva.length === 0) {
            return res.status(404).send('Reserva no encontrada.');
        }

        // Renderiza la vista de edición con los datos de la reserva
        res.render('personas/editarReserva', { reserva: reserva[0], showNav: true });
    } catch (err) {
        console.error('Error al obtener la reserva:', err);
        res.status(500).send('Error al procesar la solicitud.');
    }
});












