// CALENDARIO
let abrirModal = document.getElementById("abrir-modal");
let modal = document.getElementById("calendarModal");
const fechaActual = new Date();
let mesActual = fechaActual.getMonth();
let añoActual = fechaActual.getFullYear();
let fechaInicio = null;
let fechafin = null;

// DROPDOWN
const ciudad = document.getElementById('dropdownBuscar');
const dropContenido = document.getElementById('dropContenido');

// HUESPED/HABITACIONES
let abrirHuesped = document.getElementById("abrir-huesped");
let huespedModal = document.getElementById("huespedModal");
let menos = document.getElementById('menos');
let mas = document.getElementById('mas');
let cantidad = document.getElementById('cantidad');
let menos1 = document.getElementById('menos1');
let mas1 = document.getElementById('mas1');
let cantidad1 = document.getElementById('cantidad1');
let menos2 = document.getElementById('menos2');
let mas2 = document.getElementById('mas2');
let cantidad2 = document.getElementById('cantidad2');
let contador = 1;
let contador1 = 1;
let contador2 = 1;
let huespedHabitacion = document.getElementById('huesped/habitacion');

// DOM
// CALENDARIO
const calenBody = document.getElementById('calenBody');
const mesActualElemento = document.getElementById('mesActual');
const llegada = document.getElementById('llegada');
const salida = document.getElementById('salida');
const prevBtn = document.getElementById('prevbtn');
const nextBtn = document.getElementById('nextbtn');

// MODAL
if (abrirModal) {
    abrirModal.addEventListener("click", function(){
        modal.style.display = "block";
    });
}

window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// Botones para mostrar mes siguiente o mes anterior
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        mesActual--;
        renderCalen();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        mesActual++;
        renderCalen();
    });
}

// Creación del calendario
function renderCalen() {
    const diasDelMes = new Date(añoActual, mesActual + 1, 0).getDate();
    const primerDia = new Date(añoActual, mesActual, 1).getDay();

    mesActualElemento.textContent = new Date(añoActual, mesActual).toLocaleDateString('default', { month: 'long', year: 'numeric' });

    let dias = '';
    for (let i = 0; i < primerDia; i++) {
        dias += `<div class="calendarDay"></div>`;
    }

    for (let i = 1; i <= diasDelMes; i++) {
        const fecha = new Date(añoActual, mesActual, i);
        const NombreClass = getDiaClass(fecha);
        dias += `<div class="calenDay ${NombreClass}" onclick="seleccionarDia(${i})">${i}</div>`;
    }

    calenBody.innerHTML = dias;
}

function seleccionarDia(dia) {
    const clickFecha = new Date(añoActual, mesActual, dia);
    if (!fechaInicio || fechafin) {
        fechaInicio = clickFecha;
        fechafin = null;
    } else if (clickFecha < fechaInicio) {
        fechaInicio = clickFecha;
    } else if (clickFecha > fechaInicio) {
        fechafin = clickFecha;
    }

    renderCalen();
    actualizarFechas();
}

function actualizarFechas() {
    if (fechaInicio && fechafin) {
        llegada.textContent = `${formatearFecha(fechaInicio)}`;
        salida.textContent = `${formatearFecha(fechafin)}`;
    } else if (fechaInicio) {
        llegada.textContent = `${formatearFecha(fechaInicio)}`;
        salida.textContent = `Agregar Fecha`;
    } else {
        llegada.textContent = `Agregar Fecha`;
        salida.textContent = `Agregar Fecha`;
    }
}

function getDiaClass(fecha) {
    if (fechaInicio && fecha.toDateString() === fechaInicio.toDateString()) {
        return 'selected';
    }
    if (fechafin && fecha.toDateString() === fechafin.toDateString()) {
        return 'selected';
    }
    if (fechaInicio && fechafin && fecha > fechaInicio && fecha < fechafin) {
        return 'range';
    }
    return '';
}

function formatearFecha(fecha) {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

renderCalen();
actualizarFechas();

// DROPDOWN
if (ciudad) {
    ciudad.addEventListener('input', () => {
        const filtrar = ciudad.value.toLowerCase();
        const datos = dropContenido.getElementsByTagName('span');

        for (let i = 0; i < datos.length; i++) {
            const nombreCiudad = datos[i].textContent.toLowerCase();
            datos[i].style.display = nombreCiudad.includes(filtrar) ? '' : 'none';
        }
    });
}

// Actualizar el input con la ciudad seleccionada
const datos = dropContenido.getElementsByTagName('span');
for (let i = 0; i < datos.length; i++) {
    datos[i].addEventListener('click', (event) => {
        event.preventDefault();
        ciudad.value = event.target.textContent;
        dropContenido.style.display = 'none';
    });
}

// Mostrar el dropdown al enfocar el input
if (ciudad) {
    ciudad.addEventListener('focus', () => {
        dropContenido.style.display = 'block';
    });
}

// Cerrar el dropdown al hacer clic fuera de él
document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown')) {
        dropContenido.style.display = 'none';
    }
});

// MODAL HUESPED/HABITACIONES
if (abrirHuesped) {
    abrirHuesped.addEventListener("click", function(){
        huespedModal.style.display = "block";
    });
}

window.addEventListener("click", function(event) {
    if (event.target == huespedModal) {
        huespedModal.style.display = "none";
    }
});

function actualizarHuesped() {
    if (contador && contador1 && contador2) {
        huespedHabitacion.textContent = `${contador + contador1} Huespedes, ${contador2} Habitaciones`;
    } else {
        huespedHabitacion.textContent = `1 Huespedes, 1 Habitacion`;
    }
}

menos.addEventListener('click', () => {
    if (contador > 1) {
        contador--;
        cantidad.textContent = contador;
        actualizarHuesped();
    }
});

mas.addEventListener('click', () => {
    contador++;
    cantidad.textContent = contador;
    actualizarHuesped();
});

menos1.addEventListener('click', () => {
    if (contador1 > 1) {
        contador1--;
        cantidad1.textContent = contador1;
        actualizarHuesped();
    }
});

mas1.addEventListener('click', () => {
    contador1++;
    cantidad1.textContent = contador1;
    actualizarHuesped();
});

menos2.addEventListener('click', () => {
    if (contador2 > 1) {
        contador2--;
        cantidad2.textContent = contador2;
        actualizarHuesped();
    }
});

mas2.addEventListener('click', () => {
    contador2++;
    cantidad2.textContent = contador2;
    actualizarHuesped();
});

// PASAR DATOS A INDEX.JS PARA PASARLOS A LA API
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-buscar').addEventListener('click', async () => {
        const fechaLlegada = formatearFecha(new Date(fechaInicio));
        const fechaSalida = formatearFecha(new Date(fechafin));
        const valorInput = ciudad.value;
        const nombreCiudad = valorInput.split(',')[0].trim();
        const adultos = parseInt(contador);
        const niños = parseInt(contador1);
        const cantidadHabitaciones = parseInt(contador2);
        window.location.href = `/run-task?checkIn=${fechaLlegada}&checkOut=${fechaSalida}&search=${nombreCiudad}&adults=${adultos}&children=${niños}&rooms=${cantidadHabitaciones}`;
    });
});

// Mostrar más en la descripción
document.addEventListener('DOMContentLoaded', function () {
    const showMoreLinks = document.querySelectorAll('.show-more');

    showMoreLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const cardBody = link.closest('.card-body');
            const shortDescription = cardBody.querySelector('.short-description');
            const fullDescription = cardBody.querySelector('.full-description');

            if (fullDescription.classList.contains('d-none')) {
                shortDescription.classList.add('d-none');
                fullDescription.classList.remove('d-none');
                link.textContent = 'Ver menos';
            } else {
                shortDescription.classList.remove('d-none');
                fullDescription.classList.add('d-none');
                link.textContent = 'Ver más';
            }
        });
    });
});
