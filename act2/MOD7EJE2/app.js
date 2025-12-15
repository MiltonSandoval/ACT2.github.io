// 1. Obtenemos los elementos necesarios del DOM
const themeToggle = document.querySelector('#checkbox');
const htmlElement = document.documentElement;

// 2. Función para cambiar el tema
function switchTheme(e) {
    if (e.target.checked) {
        // Si el checkbox está marcado, aplicamos el tema oscuro
        htmlElement.setAttribute('data-theme', 'dark');
        // Guardamos la preferencia en localStorage
        localStorage.setItem('theme', 'dark');
    } else {
        // Si no, aplicamos el tema claro
        htmlElement.setAttribute('data-theme', 'light');
        // Guardamos la preferencia en localStorage
        localStorage.setItem('theme', 'light');
    }
}

// 3. Añadimos el Event Listener para el cambio
themeToggle.addEventListener('change', switchTheme, false);

// 4. Lógica para aplicar el tema al cargar la página
// Obtenemos el tema guardado en localStorage
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    // Aplicamos el tema guardado
    htmlElement.setAttribute('data-theme', currentTheme);

    // Sincronizamos el estado del checkbox
    if (currentTheme === 'dark') {
        themeToggle.checked = true;
    }
}
