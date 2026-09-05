// ========== 1. Таймер обратного отсчёта ==========
// Целевая дата: 15 ноября 2025, 10:00 (локальное время)
const targetDate = new Date('2025-11-15T10:00:00').getTime();

function updateCountdown() {
    const now = Date.now();
    const distance = targetDate - now;

    // По умолчанию — нули (если дата прошла)
    const values = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
    };

    if (distance > 0) {
        values.days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
        values.hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        values.minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        values.seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
    }

    // Обновляем новые элементы с data-unit
    document.querySelectorAll('.countdown__value[data-unit]').forEach((el) => {
        const unit = el.dataset.unit;
        if (unit in values) {
            el.textContent = values[unit];
        }
    });

    // Fallback для старых ID (совместимость)
    ['days', 'hours', 'minutes', 'seconds'].forEach((id) => {
        const legacy = document.getElementById(id);
        if (legacy) legacy.textContent = values[id];
    });
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ========== 2. Плавный скролл по якорным ссылкам ==========
// Offset 80px учитывает высоту sticky header
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Игнорируем пустой якорь "#"
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== 3. Мобильное меню (бургер) ==========
const burger = document.querySelector('.burger');
// Поддерживаем оба варианта навигации: .main-nav (registration) и .header__nav (index)
const nav = document.querySelector('.main-nav') || document.querySelector('.header__nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        const isActive = nav.classList.toggle('active');
        burger.classList.toggle('active', isActive);
        burger.setAttribute('aria-expanded', String(isActive));
        // Блокировка скролла при открытом меню (опционально)
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Закрытие при клике на ссылку в меню
    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

// ========== 4. Анимация появления блоков при скролле ==========
// Все секции изначально скрыты: opacity 0 + translateY(24px)
// При попадании в viewport добавляется класс .fade-in (animation из style.css)
// Используем Intersection Observer с threshold 0.1 и rootMargin '0px 0px -50px 0px'
const animatedSections = document.querySelectorAll('section, .registration');

if ('IntersectionObserver' in window && animatedSections.length) {
    // Устанавливаем начальное состояние через inline style (если нет CSS)
    animatedSections.forEach((section) => {
        // Не трогаем hero — он видимый сразу
        if (!section.classList.contains('hero')) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(24px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });

    const fadeObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('fade-in');
                    // Снимаем inline скрытие — анимация сделает fade-in
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    observer.unobserve(el);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    animatedSections.forEach((section) => {
        if (!section.classList.contains('hero')) {
            fadeObserver.observe(section);
        }
    });
}

// ========== 5. Валидация формы регистрации ==========
const form = document.querySelector('.form-card');

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const fioInput = form.querySelector('#fio');
        const emailInput = form.querySelector('#email');
        let isValid = true;
        let errorMessage = '';

        // Проверка ФИО
        if (!fioInput || !fioInput.value.trim()) {
            isValid = false;
            errorMessage = 'Пожалуйста, заполните поле ФИО.';
            fioInput?.focus();
        }
        // Проверка email
        else if (!emailInput || !emailInput.value.trim()) {
            isValid = false;
            errorMessage = 'Пожалуйста, заполните поле Email.';
            emailInput?.focus();
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                isValid = false;
                errorMessage = 'Пожалуйста, введите корректный email.';
                emailInput?.focus();
            }
        }

        // Проверка выбора формата (radio)
        const formatChecked = form.querySelector('input[name="format"]:checked');
        if (isValid && !formatChecked) {
            isValid = false;
            errorMessage = 'Пожалуйста, выберите формат участия.';
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        // Успешная отправка
        alert('Регистрация успешна!');
        form.reset();
    });
}

// ========== 6. Подсветка активного пункта меню при скролле ==========
const sections = document.querySelectorAll('section[id], main[id]');
const navLinks = document.querySelectorAll('.header__nav a, .main-nav a');

function updateActiveNav() {
    let currentId = '';
    const scrollPos = window.scrollY + 100; // небольшой offset

    sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
            currentId = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        // href может быть "#about" или "index.html#about"
        if (href && currentId && href.includes('#' + currentId)) {
            link.classList.add('active');
        }
    });
}

if (sections.length && navLinks.length) {
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    // Инициализация при загрузке
    updateActiveNav();
}
