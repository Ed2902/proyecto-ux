import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session'; // Importa express-session
import personasRoutes from './routes/personas.routes.js';
import pool from './database.js';

// Inicialización de la aplicación
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de express-session
app.use(session({
    secret: 'mySecretKey', // Cambia por una clave secreta segura
    resave: false,         // Evita guardar sesiones no modificadas
    saveUninitialized: true, // Guarda sesiones no inicializadas
    cookie: { secure: false }  // Cambia a true si usas HTTPS
}));

// Middleware para hacer que la sesión del usuario esté disponible en todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;  // Si hay un usuario en la sesión, lo pasamos a todas las vistas
    next();
});

// Configuración del servidor para servir archivos estáticos desde "public"
app.use(express.static(join(__dirname, 'public')));

// Configuración del puerto
app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, 'views'));

// Configuración del motor de vistas de Handlebars, incluyendo el helper `ifCond` y el nuevo helper `json`
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        ifCond: function (v1, v2, options) {
            if (v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        // Nuevo helper para convertir objetos a JSON
        json: function (context) {
            return JSON.stringify(context);
        }
    }
}));

app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.use(personasRoutes);

// Ruta de ejemplo con renderizado
app.get('/', async (req, res) => {
    try {
        const [pais] = await pool.query('SELECT c.ID_Ciudad, c.Nombre_Ciudad, p.Nombre_Pais FROM ciudad c JOIN pais p ON c.FK_Pais = p.ID_Pais;');
        res.render('index', { showNav: true, showFooter: true, Hoteles: pais });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ----------------------- API ------------------//

import { ApifyClient } from 'apify-client';
const client = new ApifyClient({
    token: 'apify_api_zQdcXdiP4QYoOtsicWBOsvNjppmaNw3zk9EW',
});

async function BookingScraper(checkIn, checkOut, search, adults, children, rooms) {
    try {
        const actorRun = await client.actor('voyager/booking-scraper').call({
            adults,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            children,
            currency: "COP",
            language: "es",
            maxItems: 2,
            minMaxPrice: "0-999999",
            rooms,
            search,
            sortBy: "distance_from_search",
            starsCountFilter: "any"
        });

        const { items } = await client.dataset(actorRun.defaultDatasetId).listItems();
        return items;
    } catch (error) {
        throw error;
    }
}

app.get('/run-task', async (req, res) => {
    try {
        const { checkIn, checkOut, search, adults, children, rooms } = req.query;
        const adultsCount = 1;
        const childrenCount = 1;
        const roomsCount = 1;
        const scrapedData = await BookingScraper(checkIn, checkOut, search, adultsCount, childrenCount, roomsCount);

        res.render('personas/listHotel', {
            hotels: scrapedData,
            showNav: true,
            showFooter: true
        });
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.listen(app.get('port'), () =>
    console.log('El server está escuchando en el puerto', app.get('port'))
);
