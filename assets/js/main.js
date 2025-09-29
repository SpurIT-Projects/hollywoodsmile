// Hollywood Smile - Основная JavaScript функциональность

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initPricingCalculator();
    initContactForm();
    initSmoothScroll();
});

// Анимация элементов при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми секциями
    const sections = document.querySelectorAll('.section, .advantage-card, .gallery-item');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Калькулятор стоимости
function initPricingCalculator() {
    const form = document.getElementById('calculatorForm');
    if (!form) return;

    const implantSystem = document.getElementById('implantSystem');
    const crownType = document.getElementById('crownType');
    const teethCount = document.getElementById('teethCount');
    const result = document.getElementById('calculatorResult');
    const resultPrice = document.getElementById('resultPrice');

    // Базовые цены
    const prices = {
        straumann: {
            implant: 1600,
            formirователь: 160,
            metalCeramic: 1000,
            zirconia: 1150
        },
        megagen: {
            implant: 990,
            formirователь: 150,
            metalCeramic: 800,
            zirconia: 950
        }
    };

    function calculatePrice() {
        const system = implantSystem.value;
        const crown = crownType.value;
        const count = parseInt(teethCount.value) || 1;

        if (!system || !crown) return;

        const systemPrices = prices[system];
        let totalPrice = 0;

        // Базовая стоимость за один зуб
        totalPrice += systemPrices.implant; // Имплант
        totalPrice += systemPrices.formirователь; // Формирователь

        if (crown === 'metalCeramic') {
            totalPrice += systemPrices.metalCeramic;
        } else if (crown === 'zirconia') {
            totalPrice += systemPrices.zirconia;
        }

        // Умножаем на количество зубов
        totalPrice *= count;

        // Скидка при множественной имплантации
        if (count >= 3) {
            totalPrice *= 0.9; // 10% скидка
        }

        resultPrice.textContent = `${totalPrice.toFixed(0)} BYN`;
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Слушатели изменений
    implantSystem.addEventListener('change', calculatePrice);
    crownType.addEventListener('change', calculatePrice);
    teethCount.addEventListener('input', calculatePrice);
}

// Обработка контактной формы
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            service: formData.get('service'),
            message: formData.get('message')
        };

        // Валидация
        if (!data.name || !data.phone) {
            showNotification('Пожалуйста, заполните обязательные поля', 'error');
            return;
        }

        // Симуляция отправки
        showNotification('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
    });
}

// Плавная прокрутка к якорям
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        animation: slideInFromRight 0.3s ease-out;
    `;

    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Закрытие уведомления
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Автозакрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Функция для загрузки компонентов
async function loadComponent(componentPath, targetSelector) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.querySelector(targetSelector).innerHTML = html;
    } catch (error) {
        console.error(`Ошибка загрузки компонента ${componentPath}:`, error);
    }
}

// Утилита для форматирования номера телефона
function formatPhone(input) {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('375')) {
            value = value.slice(3);
        }
        
        if (value.length > 0) {
            if (value.length <= 2) {
                value = `+375 (${value}`;
            } else if (value.length <= 5) {
                value = `+375 (${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length <= 7) {
                value = `+375 (${value.slice(0, 2)}) ${value.slice(2, 5)}-${value.slice(5)}`;
            } else {
                value = `+375 (${value.slice(0, 2)}) ${value.slice(2, 5)}-${value.slice(5, 7)}-${value.slice(7, 9)}`;
            }
        }
        
        e.target.value = value;
    });
}

// Применить форматирование к полям телефона
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(formatPhone);
});

// Экспорт функций для использования в других файлах
window.HollywoodSmile = {
    loadComponent,
    showNotification,
    formatPhone
};