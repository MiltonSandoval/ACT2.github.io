// Elementos del formulario
const form = document.getElementById('registrationForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const age = document.getElementById('age');
const terms = document.getElementById('terms');
const submitBtn = document.getElementById('submitBtn');
const formSummary = document.getElementById('formSummary');

// Elementos de requisitos de contraseña
const reqLength = document.getElementById('req-length');
const reqUppercase = document.getElementById('req-uppercase');
const reqNumber = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');

// Variables para control de estado
let formSubmitted = false;
let passwordValid = false;
let allFieldsValid = {
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    age: false,
    terms: false
};

/**
 * Inicializar estados del formulario
 */
function initializeForm() {
    console.log('🎯 Inicializando formulario...');
    
    // Resetear estados
    passwordValid = false;
    allFieldsValid = {
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
        age: false,
        terms: false
    };
    
    // Remover todas las clases de validación al inicio
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('valid', 'error');
    });
    
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('valid', 'invalid', 'empty');
    });
    
    // Ocultar todos los íconos de éxito al inicio
    document.querySelectorAll('.success-icon').forEach(icon => {
        icon.style.display = 'none';
    });
    
    // Ocultar mensajes de error
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
    });
    
    // Resetear indicadores de contraseña
    updatePasswordRequirements('');
    
    // Deshabilitar botón de enviar
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Registrarse';
    submitBtn.classList.remove('pulse-animation');
    
    // Resetear estado
    formSubmitted = false;
    
    console.log('✅ Formulario inicializado correctamente');
}

/**
 * Sanitizar y limpiar input
 */
function sanitizeInput(value) {
    if (!value) return '';
    return value.trim().replace(/\s+/g, ' '); // Remover espacios extras
}

/**
 * Validar contraseña - FUNCIÓN MEJORADA
 */
function validatePassword(value) {
    const errors = [];
    
    if (value.length === 0) {
        errors.push('La contraseña es obligatoria');
        passwordValid = false;
    } else {
        if (value.length < 8) errors.push('Mínimo 8 caracteres');
        if (!/[A-Z]/.test(value)) errors.push('Al menos una mayúscula');
        if (!/[0-9]/.test(value)) errors.push('Al menos un número');
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) errors.push('Al menos un carácter especial');
        if (value.length > 50) errors.push('Máximo 50 caracteres');
        
        passwordValid = errors.length === 0;
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validar un campo individual
 */
function validateField(field, isBlur = false) {
    const value = sanitizeInput(field.value);
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    const successIcon = formGroup.querySelector('.success-icon');
    
    let isValid = false;
    let message = '';
    
    // Si no es blur y está vacío, no mostrar error (solo validar en blur)
    if (!isBlur && !formSubmitted && value === '') {
        field.classList.remove('invalid', 'valid');
        field.classList.add('empty');
        formGroup.classList.remove('error', 'valid');
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
        if (successIcon) successIcon.style.display = 'none';
        
        // Actualizar estado
        allFieldsValid[field.id] = false;
        return false;
    }
    
    // Validaciones según el campo
    switch(field.id) {
        case 'username':
            if (value.length === 0) {
                message = 'El nombre de usuario es obligatorio';
                isValid = false;
            } else if (value.length < 3) {
                message = 'El nombre debe tener al menos 3 caracteres';
                isValid = false;
            } else if (value.length > 20) {
                message = 'El nombre no puede tener más de 20 caracteres';
                isValid = false;
            } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                message = 'Solo letras, números, guiones y guiones bajos';
                isValid = false;
            } else if (/^\d+$/.test(value)) {
                message = 'El nombre no puede ser solo números';
                isValid = false;
            } else {
                isValid = true;
            }
            break;
            
        case 'email':
            // Regex mejorado para email
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            if (value.length === 0) {
                message = 'El correo electrónico es obligatorio';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                message = 'Ingresa un correo electrónico válido (ejemplo@dominio.com)';
                isValid = false;
            } else if (value.length > 100) {
                message = 'El correo es demasiado largo';
                isValid = false;
            } else {
                isValid = true;
            }
            break;
            
        case 'password':
            const passwordValidation = validatePassword(value);
            isValid = passwordValidation.isValid;
            
            if (!isValid) {
                message = passwordValidation.errors[0]; // Mostrar solo el primer error
            }
            
            // Actualizar requisitos visuales
            updatePasswordRequirements(value);
            break;
            
        case 'confirmPassword':
            const passwordValue = sanitizeInput(password.value);
            
            if (value.length === 0) {
                message = 'Confirma tu contraseña';
                isValid = false;
            } else if (value !== passwordValue) {
                message = 'Las contraseñas no coinciden';
                isValid = false;
            } else if (passwordValue === '') {
                message = 'Primero ingresa una contraseña';
                isValid = false;
            } else {
                isValid = true;
            }
            break;
            
        case 'age':
            const ageValue = parseInt(value);
            
            if (value.length === 0) {
                message = 'La edad es obligatoria';
                isValid = false;
            } else if (isNaN(ageValue) || !Number.isInteger(Number(value))) {
                message = 'La edad debe ser un número entero';
                isValid = false;
            } else if (ageValue < 18) {
                message = 'Debes ser mayor de 18 años';
                isValid = false;
            } else if (ageValue > 120) {
                message = 'Ingresa una edad válida (máximo 120 años)';
                isValid = false;
            } else if (value.includes('.')) {
                message = 'La edad no puede contener decimales';
                isValid = false;
            } else {
                isValid = true;
            }
            break;
    }
    
    // Aplicar clases y mostrar/ocultar mensajes
    if (isValid) {
        formGroup.classList.remove('error');
        formGroup.classList.add('valid');
        field.classList.remove('invalid', 'empty');
        field.classList.add('valid');
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        
        // MOSTRAR ✓ solo si hay valor y es blur o ya fue enviado
        if (value.length > 0 && successIcon && (isBlur || formSubmitted)) {
            successIcon.style.display = 'block';
            successIcon.style.animation = 'none';
            setTimeout(() => {
                successIcon.style.animation = 'popIn 0.3s ease';
            }, 10);
        } else if (successIcon && !isBlur) {
            successIcon.style.display = 'none';
        }
        
        // Actualizar estado
        allFieldsValid[field.id] = true;
        
    } else {
        formGroup.classList.remove('valid');
        formGroup.classList.add('error');
        field.classList.remove('valid', 'empty');
        field.classList.add('invalid');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // OCULTAR ✓ si no es válido
        if (successIcon) {
            successIcon.style.display = 'none';
        }
        
        // Actualizar estado
        allFieldsValid[field.id] = false;
    }
    
    return isValid;
}

/**
 * Actualizar indicadores visuales de requisitos de contraseña
 */
function updatePasswordRequirements(passwordValue) {
    const pass = sanitizeInput(passwordValue);
    
    // Actualizar cada requisito individualmente
    reqLength.classList.toggle('met', pass.length >= 8);
    reqUppercase.classList.toggle('met', /[A-Z]/.test(pass));
    reqNumber.classList.toggle('met', /[0-9]/.test(pass));
    reqSpecial.classList.toggle('met', /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass));
    
    // Actualizar estado de contraseña
    const passwordValidation = validatePassword(pass);
    passwordValid = passwordValidation.isValid;
    allFieldsValid.password = passwordValid;
}

/**
 * Validar checkbox de términos
 */
function validateTerms() {
    const formGroup = terms.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (terms.checked) {
        formGroup.classList.remove('error');
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        allFieldsValid.terms = true;
        return true;
    } else {
        formGroup.classList.add('error');
        errorMessage.textContent = 'Debes aceptar los términos y condiciones';
        errorMessage.style.display = 'block';
        allFieldsValid.terms = false;
        return false;
    }
}

/**
 * Verificar si el formulario completo es válido
 */
function checkFormValidity() {
    // Validar todos los campos individualmente
    validateField(username, false);
    validateField(email, false);
    validateField(password, false);
    validateField(confirmPassword, false);
    validateField(age, false);
    validateTerms();
    
    // Verificar si TODOS los campos son válidos
    const isFormValid = 
        allFieldsValid.username &&
        allFieldsValid.email &&
        allFieldsValid.password &&
        allFieldsValid.confirmPassword &&
        allFieldsValid.age &&
        allFieldsValid.terms;
    
    // Habilitar/deshabilitar botón de enviar con animación
    if (isFormValid && !submitBtn.disabled) {
        // Ya estaba habilitado, no hacer nada
    } else if (isFormValid) {
        // Cambiar de deshabilitado a habilitado
        submitBtn.disabled = false;
        submitBtn.classList.add('pulse-animation');
        setTimeout(() => {
            submitBtn.classList.remove('pulse-animation');
        }, 2000);
    } else {
        // Deshabilitar si no es válido
        submitBtn.disabled = true;
        submitBtn.classList.remove('pulse-animation');
    }
    
    return isFormValid;
}

/**
 * Validar todo el formulario antes de enviar
 */
function validateAllFields() {
    formSubmitted = true;
    
    // Forzar validación completa de todos los campos
    const usernameValid = validateField(username, true);
    const emailValid = validateField(email, true);
    const passwordValidField = validateField(password, true);
    const confirmValid = validateField(confirmPassword, true);
    const ageValid = validateField(age, true);
    const termsValid = validateTerms();
    
    return usernameValid && emailValid && passwordValidField && confirmValid && ageValid && termsValid;
}

// ========== EVENT LISTENERS ==========

// Username
username.addEventListener('input', () => {
    validateField(username, false);
    checkFormValidity();
});

username.addEventListener('blur', () => {
    validateField(username, true);
});

// Email
email.addEventListener('input', () => {
    validateField(email, false);
    checkFormValidity();
});

email.addEventListener('blur', () => {
    validateField(email, true);
});

// Password - CON MEJOR VALIDACIÓN
password.addEventListener('input', () => {
    validateField(password, false);
    
    // Revalidar confirmPassword si ya tiene valor
    if (confirmPassword.value) {
        validateField(confirmPassword, false);
    }
    
    checkFormValidity();
});

password.addEventListener('blur', () => {
    validateField(password, true);
    checkFormValidity();
});

// Confirm Password
confirmPassword.addEventListener('input', () => {
    validateField(confirmPassword, false);
    checkFormValidity();
});

confirmPassword.addEventListener('blur', () => {
    validateField(confirmPassword, true);
    checkFormValidity();
});

// Age
age.addEventListener('input', () => {
    // Prevenir entrada de caracteres no numéricos
    age.value = age.value.replace(/[^0-9]/g, '');
    validateField(age, false);
    checkFormValidity();
});

age.addEventListener('blur', () => {
    if (age.value === '' || age.value === '0') {
        age.value = '';
    }
    validateField(age, true);
    checkFormValidity();
});

// Términos
terms.addEventListener('change', () => {
    validateTerms();
    checkFormValidity();
});

// Prevenir envío con Enter en campos
form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        const inputs = Array.from(form.querySelectorAll('input:not([type="checkbox"])'));
        const currentIndex = inputs.indexOf(e.target);
        
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        } else {
            e.target.blur();
        }
    }
});

// Manejo del envío del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateAllFields()) {
        // Mostrar animación de éxito
        submitBtn.classList.add('success-animation');
        submitBtn.innerHTML = '<span class="loading">✅ Enviando...</span>';
        
        // Mostrar resumen
        formSummary.innerHTML = `
            <div class="success-header">
                <span class="success-icon-large">🎉</span>
                <h3>¡Registro Exitoso!</h3>
            </div>
            <div class="success-details">
                <p><strong>👤 Usuario:</strong> ${sanitizeInput(username.value)}</p>
                <p><strong>📧 Email:</strong> ${sanitizeInput(email.value)}</p>
                <p><strong>🎂 Edad:</strong> ${sanitizeInput(age.value)} años</p>
                <p class="success-message">✅ Los datos se han validado y guardado correctamente.</p>
            </div>
        `;
        formSummary.classList.add('show');
        
        console.log('📝 Formulario enviado exitosamente');
        
        // Simular envío
        setTimeout(() => {
            submitBtn.classList.remove('success-animation');
            submitBtn.innerHTML = 'Registrarse';
            
            // Resetear después de 3 segundos
            setTimeout(() => {
                form.reset();
                initializeForm();
                formSummary.classList.remove('show');
            }, 3000);
        }, 1500);
        
    } else {
        // Mostrar error
        formSummary.innerHTML = `
            <div class="error-header">
                <span class="error-icon">⚠️</span>
                <h3>Corrige los errores del formulario</h3>
            </div>
            <p>Por favor, revisa los campos marcados en rojo.</p>
        `;
        formSummary.classList.add('show', 'error');
        
        // Scroll al primer error
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        setTimeout(() => {
            formSummary.classList.remove('show', 'error');
        }, 3000);
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', initializeForm);