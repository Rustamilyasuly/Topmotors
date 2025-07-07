// --- Данные об автомобилях (Остаются без изменений) ---
const cars = [
    {
        id: 1,
        make: 'Kia',
        model: 'Seltos',
        year: 2024,
        price: 10300000, // Цена в тенге
        image: 'https://via.placeholder.com/600x400?text=Toyota+Camry', // Обновил размер заглушки
        description: 'Элегантный и надежный компакт кроссовер. Идеальный выбор для города и дальних поездок, обеспечивающий комфорт и уверенность на дороге.'
    },
    {
        id: 2,
        make: 'Kia',
        model: 'Sportage',
        year: 2024,
        price: 13000000,
        image: 'https://via.placeholder.com/600x400?text=Hyundai+Elantra',
        description: 'Современный и экономичный седан с динамичным дизайном и комфортным салоном. Отличный выбор для ежедневных поездок.'
    },
    {
        id: 3,
        make: 'Changan',
        model: 'CS55 Plus',
        year: 2025,
        price: 10500000,
        image: 'https://via.placeholder.com/600x400?text=Kia+Sportage',
        description: 'Популярный кроссовер, сочетающий в себе стиль, простор и отличные ходовые качества. Подходит как для городских условий, так и для активного отдыха.'
    },

    {
        id: 4,
        make: 'Changhan',
        model: 'X5 Plus',
        year: 2025,
        price: 8800000, // Цена в тенге
        image: 'https://iili.io/F0XXscu.png',
        description: 'Элегантный и надежный седан бизнес-класса. Идеальный выбор для города и дальних поездок, обеспечивающий комфорт и уверенность на дороге.'
    },
];

// --- Получение ссылок на HTML-элементы ---
// Это элементы, которыми мы будем управлять на странице
const carListDiv = document.getElementById('car-list'); // Список автомобилей
const carDetailsSection = document.getElementById('car-details-section'); // Секция деталей авто
const carDetailsDiv = document.getElementById('car-details'); // Блок для вывода деталей авто
const backToListButton = document.getElementById('back-to-list-button'); // Кнопка "Назад"

// Элементы кредитного калькулятора
const loanAmountInput = document.getElementById('loan-amount');
const downPaymentInput = document.getElementById('down-payment');
const loanTermInput = document.getElementById('loan-term');
const interestRateInput = document.getElementById('interest-rate');
const calculateButton = document.getElementById('calculate-button');
const monthlyPaymentSpan = document.getElementById('monthly-payment');

let currentCarPrice = 0; // Переменная для хранения цены текущего автомобиля

// --- Вспомогательная функция для форматирования валюты (Остается без изменений) ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT', minimumFractionDigits: 0 }).format(amount);
}

// --- Функции для управления отображением "страниц" ---

// Показывает список автомобилей и скрывает детали
function showCarList() {
    carListDiv.style.display = 'grid'; // Показываем как сетку (из CSS)
    carDetailsSection.style.display = 'none'; // Скрываем секцию деталей
}

// Показывает детали автомобиля и скрывает список
function showCarDetails(carId) {
    const selectedCar = cars.find(car => car.id === carId); // Находим автомобиль по ID
    if (!selectedCar) { // Если автомобиль не найден, возвращаемся к списку
        console.error('Автомобиль с ID', carId, 'не найден.');
        showCarList();
        return;
    }

    // Сохраняем цену выбранного авто для калькулятора
    currentCarPrice = selectedCar.price;
    loanAmountInput.value = currentCarPrice; // Устанавливаем цену в поле калькулятора

    // Заполняем блок деталей автомобиля
    carDetailsDiv.innerHTML = `
        <img src="${selectedCar.image}" alt="${selectedCar.make} ${selectedCar.model}">
        <div class="info-block"> <h2>${selectedCar.make} ${selectedCar.model} (${selectedCar.year})</h2>
            <p><strong>Цена:</strong> ${formatCurrency(selectedCar.price)}</p>
            <p>${selectedCar.description}</p>
        </div>
    `;

    // Скрываем список и показываем детали
    carListDiv.style.display = 'none';
    carDetailsSection.style.display = 'block'; // Показываем как блок
}

// --- Функция для создания и отображения карточек автомобилей (Модифицирована) ---
function displayCars() {
    carListDiv.innerHTML = ''; // Очищаем список перед добавлением, чтобы не дублировать
    cars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.classList.add('car-card');

        carCard.innerHTML = `
            <img src="${car.image}" alt="${car.make} ${car.model}" class="car-image">
            <div class="car-info">
                <h2>${car.make} ${car.model}</h2>
                <p>Год: ${car.year}</p>
                <p>Цена: ${formatCurrency(car.price)}</p>
                <p>${car.description.substring(0, 100)}...</p> <button class="details-button" data-car-id="${car.id}">Подробнее / Рассчитать кредит</button>
            </div>
        `;

        // Добавляем обработчик события click для кнопки "Подробнее"
        // Когда кнопка нажата, вызываем showCarDetails с ID автомобиля
        carCard.querySelector('.details-button').addEventListener('click', () => {
            showCarDetails(car.id);
        });

        carListDiv.appendChild(carCard);
    });
}

// --- Логика кредитного калькулятора ---

function calculateLoan() {
    const loanAmount = currentCarPrice; // Берем текущую цену автомобиля
    const downPayment = parseFloat(downPaymentInput.value); // Первоначальный взнос
    let loanTermYears = parseFloat(loanTermInput.value); // Срок кредита в годах
    let interestRate = parseFloat(interestRateInput.value); // Годовая ставка в процентах

    // Проверки на корректность введенных данных
    if (isNaN(loanAmount) || loanAmount <= 0) {
        alert('Некорректная стоимость автомобиля.');
        return;
    }
    if (isNaN(downPayment) || downPayment < 0) {
        alert('Некорректный первоначальный взнос.');
        return;
    }
    if (downPayment >= loanAmount) {
        alert('Первоначальный взнос не может быть больше или равен стоимости автомобиля.');
        monthlyPaymentSpan.textContent = '0 KZT';
        return;
    }
    if (isNaN(loanTermYears) || loanTermYears <= 0) {
        alert('Некорректный срок кредита.');
        return;
    }
    if (isNaN(interestRate) || interestRate <= 0) {
        alert('Некорректная процентная ставка.');
        return;
    }

    // Расчеты
    const principal = loanAmount - downPayment; // Сумма кредита (тело кредита)
    const monthlyInterestRate = (interestRate / 100) / 12; // Месячная процентная ставка
    const numberOfPayments = loanTermYears * 12; // Общее количество платежей

    let monthlyPayment = 0;
    if (monthlyInterestRate === 0) { // Если ставка 0%, то просто делим сумму на количество месяцев
        monthlyPayment = principal / numberOfPayments;
    } else {
        // Формула аннуитетного платежа
        monthlyPayment = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    }

    monthlyPaymentSpan.textContent = formatCurrency(monthlyPayment); // Выводим результат
}

// --- Обработчики событий (Слушаем действия пользователя) ---

// Привязываем функцию calculateLoan к кнопке "Рассчитать"
calculateButton.addEventListener('click', calculateLoan);

// Привязываем функцию showCarList к кнопке "Назад к списку"
backToListButton.addEventListener('click', showCarList);

// Привязываем calculateLoan к изменению любого поля ввода калькулятора
// Это позволит пересчитывать автоматически, как только пользователь меняет значения
downPaymentInput.addEventListener('input', calculateLoan);
loanTermInput.addEventListener('input', calculateLoan);
interestRateInput.addEventListener('input', calculateLoan);


// --- Начальная инициализация: отображаем список автомобилей при загрузке страницы ---
displayCars();