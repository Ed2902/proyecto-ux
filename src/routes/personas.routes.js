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

        await pool.query('CALL AddPersona(?, ?, ?, ?, ?)', [name, lastname, age, FK_tipopersona, password]);

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

        const [personaResult] = await pool.query('CALL GetPersonaByID(?)', [id]);
        console.log('Datos de persona (result completo):', personaResult); 

        if (personaResult[0].length === 0) {
            return res.status(404).send('Persona no encontrada');
        }

        const persona = personaResult[0][0]; 
        console.log('Datos de persona (procesados):', persona); 

        const [tiposPersonaResult] = await pool.query('CALL GetTiposPersona()');
        console.log('Tipos de persona (result):', tiposPersonaResult); 

        const tiposPersona = tiposPersonaResult[0]; 
        console.log('Tipos de persona procesados:', tiposPersona); 

        res.render('personas/edit', {
            persona,        
            tiposPersona    
        });
    } catch (err) {
        console.error('Error en la ruta /edit/:id:', err.message);
        res.status(500).json({ message: err.message });
    }
});


router.post('/edit/:id', async (req, res) => {
    try {
        const { name, lastname, age, FK_tipopersona } = req.body;
        const { id } = req.params;

        await pool.query('CALL UpdatePersonaByID(?, ?, ?, ?, ?)', [id, name, lastname, age, FK_tipopersona]);

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

        await pool.query('CALL DeletePersonByID(?)', [id]);

        res.redirect('/list');
    } catch (err) {
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

        const [result] = await pool.query('CALL ValidateUserByName(?, ?)', [name, password]);

        if (result[0].length > 0) {
            req.session.user = result[0][0].name;  
            req.session.user_id = result[0][0].id;
            res.redirect('/');  
        } else {
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
        res.redirect('/login'); 
    });
});

/*******************end validad usuario en la base de datos **************** */
/******************reserva *********************/

router.post('/reservar', async (req, res) => {
    try {
        const { hotel_name, location_lat, location_lng } = req.body;

        if (!req.session.user_id) {
            return res.status(401).send('Debe iniciar sesión para realizar una reserva');
        }

        const userId = req.session.user_id;

        await pool.query('CALL InsertReservation(?, ?, ?, ?)', 
            [userId, hotel_name, location_lat, location_lng]);

        res.redirect('/reserva');
    } catch (err) {
        console.error('Error al realizar la reserva:', err);
        res.status(500).send('Error al procesar la reserva');
    }
});

/*********************************reserva  */
router.get('/reserva', async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login'); 
        }

        const [reservas] = await pool.query('CALL GetUserReservations(?)', [req.session.user_id]);

 
        if (reservas.length === 0) {
            return res.render('personas/reserva', { message: 'No tienes reservas aún.', showNav: true });
        }

        res.render('personas/reserva', { reservas: reservas[0], showNav: true });
    } catch (err) {
        console.error('Error al obtener reservas:', err);
        res.status(500).send('Error al procesar las reservas');
    }
});

/********eliminar reserva con trigger */


router.get('/reserva', async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login');  
        }

        const [reservas] = await pool.query('CALL GetUserReservations(?)', [req.session.user_id]);

        if (reservas.length === 0) {
            return res.render('personas/reserva', { message: 'No tienes reservas aún.', showNav: true });
        }

        res.render('personas/reserva', { reservas: reservas[0], showNav: true });
    } catch (err) {
        console.error('Error al obtener reservas:', err);
        res.status(500).send('Error al procesar las reservas');
    }
});


router.get('/reserva/delete/:id', async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login');  
        }

        const { id } = req.params;  
        const userId = req.session.user_id;  

        await pool.query('CALL DeleteReservationByID(?, ?)', [id, userId]);

        res.redirect('/reserva');
    } catch (err) {
        console.error('Error al eliminar la reserva:', err);
        res.status(500).send('Error al eliminar la reserva');
    }
});
















