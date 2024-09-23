// Inicializar AOS para animaciones en scroll
AOS.init(); 

document.addEventListener('DOMContentLoaded', function () {
    // Selecciona el carrusel usando su ID
    var myCarousel = document.querySelector('#blog-carousel');
    
    // Inicializa el carrusel con Bootstrap 5
    var carousel = new bootstrap.Carousel(myCarousel, {
        interval: 3000,  // Cambiar automáticamente cada 3 segundos
        pause: false     // No se detiene cuando se pasa el mouse sobre el carrusel
    });

    // Opcional: Manejar eventos manualmente si es necesario
    // Avanzar al siguiente slide cuando el usuario hace clic en un botón externo
    document.querySelector('.carousel-control-next').addEventListener('click', function () {
        carousel.next();
    });

    // Ir al slide anterior cuando se hace clic en el botón correspondiente
    document.querySelector('.carousel-control-prev').addEventListener('click', function () {
        carousel.prev();
    });
});

