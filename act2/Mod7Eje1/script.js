// =================================
// LÓGICA DEL CAMBIO DE TEMA
// =================================
const themeToggle = document.querySelector('#checkbox');
const htmlElement = document.documentElement;

// Función para cambiar el tema
function switchTheme(e) {
    if (e.target.checked) {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Event Listener para el cambio
themeToggle.addEventListener('change', switchTheme, false);

// Aplicar tema al cargar la página
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    htmlElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        themeToggle.checked = true;
    }
} else {
    // Si no hay tema guardado, por defecto es 'dark' para este diseño
    htmlElement.setAttribute('data-theme', 'dark');
    themeToggle.checked = false;
}


// =================================
// CÓDIGO EXISTENTE
// =================================

// Intersection Observer para animaciones al hacer scroll
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar todos los elementos con animación de scroll
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Ripple effect para botones
document.querySelectorAll('.btn-ripple').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = this.querySelector('::before') || document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
    });
});
