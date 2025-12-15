// =================================
// LÓGICA DEL CAMBIO DE TEMA
// =================================
const themeToggle = document.querySelector('#checkbox');
const htmlElement = document.documentElement;

// Función para cambiar el tema
function switchTheme(e) {
    if (e.target.checked) {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// Event Listener para el cambio
themeToggle.addEventListener('change', switchTheme, false);

// Aplicar tema al cargar la página
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    htmlElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggle.checked = true;
    }
}


// =============================================================
// CÓDIGO EXISTENTE PARA EL LAYOUT MASONRY ALEATORIO
// =============================================================

/* Objetivo: Simular un contenido dinámico asignando clases 
   de tamaño aleatorio a las tarjetas para ver el efecto Masonry.
*/

// 1. Seleccionamos todas las tarjetas
const cards = document.querySelectorAll('.card');

// 2. Definimos las posibles variaciones de tamaño
const sizes = ['card-normal', 'card-tall', 'card-wide', 'card-big'];

// 3. Iteramos sobre cada tarjeta
cards.forEach(card => {
    // Generamos un número aleatorio entre 0 y 3
    const randomSize = Math.floor(Math.random() * sizes.length);
    
    // Si sale 0 (card-normal), no añadimos clase extra.
    // Si sale otro, añadimos la clase correspondiente (tall, wide o big)
    if (sizes[randomSize] !== 'card-normal') {
        card.classList.add(sizes[randomSize]);
    }
});

/* NOTA TÉCNICA:
   Al añadir estas clases, el CSS Grid detectará que algunos elementos
   son más grandes (ocupan más 'spans'). Gracias a 'grid-auto-flow: dense',
   el navegador calculará matemáticamente dónde encajar las piezas pequeñas
   para rellenar los huecos que dejan las grandes.
*/