
document.addEventListener('DOMContentLoaded', function () {
    
    var mapContainer = document.getElementById('map');
    if (mapContainer) {
    
        var map = L.map('map').setView([4.60971, -74.08175], 13);

        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Comprobar si la variable "reservas" está disponible y tiene datos
        if (typeof reservas !== 'undefined' && reservas.length > 0) {
            
            reservas.forEach(function(reserva) {
                var lat = reserva.location_lat;
                var lng = reserva.location_lng;
                var hotelName = reserva.hotel_name;

               
                L.marker([lat, lng]).addTo(map)
                    .bindPopup(hotelName);
            });

           
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                  
                    L.marker([userLat, userLng]).addTo(map).bindPopup('Tu ubicación actual');

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


function calcularDistancia(lat1, lng1, lat2, lng2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; 
    return distancia;
}
