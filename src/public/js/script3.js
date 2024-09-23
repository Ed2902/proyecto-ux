// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    // Verificar si el contenedor del mapa existe antes de inicializar Leaflet
    var mapContainer = document.getElementById('map');
    if (mapContainer) {
        // Inicializar el mapa centrado en Bogotá (Lat: 4.60971, Lng: -74.08175)
        var map = L.map('map').setView([4.60971, -74.08175], 13);

        // Cargar los tiles de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Comprobar si la variable "reservas" está disponible y tiene datos
        if (typeof reservas !== 'undefined' && reservas.length > 0) {
            // Iterar sobre las reservas y agregar un marcador para cada una
            reservas.forEach(function(reserva) {
                var lat = reserva.location_lat;
                var lng = reserva.location_lng;
                var hotelName = reserva.hotel_name;

                // Agregar un marcador en la posición de la reserva
                L.marker([lat, lng]).addTo(map)
                    .bindPopup(hotelName);
            });

            // Obtener la ubicación actual del usuario y agregar un marcador
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    // Agregar un marcador para la ubicación del usuario
                    L.marker([userLat, userLng]).addTo(map).bindPopup('Tu ubicación actual');

                    // Calcular la distancia desde la ubicación del usuario hasta cada reserva
                    document.querySelectorAll('.distance').forEach(function(td) {
                        const lat = parseFloat(td.getAttribute('data-lat'));
                        const lng = parseFloat(td.getAttribute('data-lng'));

                        const distancia = calcularDistancia(userLat, userLng, lat, lng);
                        td.textContent = `${distancia.toFixed(2)} km`;
                    });
                }, function() {
                    alert('No se pudo obtener la ubicación');
                });
            } else {
                alert('Geolocalización no es soportada por tu navegador');
            }
        } else {
            console.error("No se encontraron reservas para mostrar en el mapa.");
        }
    } else {
        console.error("No se encontró el contenedor del mapa con id='map'.");
    }
});

// Función para calcular la distancia entre dos coordenadas (Haversine formula)
function calcularDistancia(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distancia en km
    return distancia;
}
