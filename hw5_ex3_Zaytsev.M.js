'use strict';

/* 3**:

Создать форму в html со следующими полями:
* Имя - текстовое поле
* Телефон - текстовое поле
* Пароль - поле типа password
* Повтор пароля - поле типа password
* Кнопка отправить форму

Необходимо реализовать валидацию этой формы по следующим правилам:

* Имя - должно содержать как минимум 1 символ, не более 50 символов.
* Телефон - должно содержать 11 цифр, не больше, не меньше.
* Пароль - минимум 5 символов, максимум 50.
* Повтор пароля - значение должно совпадать с полем пароль.
* Кнопка отправить форму - при нажатии на кнопку форма должна провериться, при прохождении проверки, форма
отправляется, если проверка не была пройдена, то:
- Каждое поле, которое не прошло проверку должно выделяться красным цветом.
- Под каждым полем, что не прошло проверку, должна писаться подсказка по какой причине проверка провалилась.

Можете пользоваться стилями бутстрапа, если лень самим писать.
Пользоваться аттрибутами HTML5 запрещено, необходимо проверки реализовать с помощью javascript.
*/


// Сделаем по объекту на каждый инпут

/**
 * Объект инпута
 * @property {int} minLength - Минимальная длина поля.
 * @property {int} maxLength - Максимальная длина поля.
 * @property {String} descript - Описание требований к содержанию ввода.
 * @property {RegExp} pattern - Шаблон регулярного выражения для проверки ввода.
 */
const name = {
    minLength: 1,
    maxLength: 50,
    descript: `должно содержать как минимум 1 символ, но не более 50 символов`,
    pattern: /^[a-zA-ZА-Яа-я]{1}[a-zA-ZА-Яа-я0-9]*$/,
};

const phone = {
    minLength: 11,
    maxLength: 11,
    descript: 'должно содержать 11 цифр, не больше, не меньше',
    pattern: /^[0-9]+$/,
};

const pass = {
    minLength: 5,
    maxLength: 50,
    descript: 'минимум 5 символов, максимум 50',
    pattern: /^.+$/,
};

const repPass = {
    minLength: pass.minLength,
    maxLength: pass.maxLength,
    descript: 'должно совпадать с полем пароль',
    pattern: pass.pattern,
};


/**
 * Объект содержащий все объекты инпута
 * @property {Object} name - Объект инпута имени.
 * @property {Object} phone - Объект инпута телефона.
 * @property {Object} password - Объект инпута пароля.
 * @property {Object} password_repeat - Объект инпута повтора пароля.
 */
const inputs = {
    name: name,
    phone: phone,
    password: pass,
    password_repeat: repPass,
};


/**
 * Функция прерывания действия по умолчанию.
 * @param {Event} evt - Объект события, которое произошло.
 */
function stopDefAction(evt) {
    evt.preventDefault();
}


/**
 * Функция, которая проверяет корректность введенной информации в инпут
 * @param {HTMLElement} el - элемент (инпут), который подвергается проверке.
 */
function checkInput(el) {
    if (el.value) {
        if (el.value.match(inputs[el.name].pattern)) {
            if (el.name === 'password_repeat') {
                if (el.value === document.querySelector(`[name=password]`).value) {
                    if (document.querySelector(`[name=password]`).classList.contains('valid')) {
                        return removeErrDivs(el);
                    }
                } else {
                    const msg = 'пароли не совпадают';
                    return createErrDiv(el, msg);
                }
            }
            if (el.value.length < inputs[el.name].minLength) {
                const msg = "минимальная длина: " + inputs[el.name].minLength + "символов";
                return createErrDiv(el, msg);
            } else if (el.value.length > inputs[el.name].maxLength) {
                const msg = "максимальная длина: " + inputs[el.name].maxLength + "символов";
                return createErrDiv(el, msg);
            }
            return removeErrDivs(el);
        }
        const msg = "ошибка в значении: " + inputs[el.name].descript;
        return createErrDiv(el, msg);
    }
    const msg = "поле не заполнено: " + inputs[el.name].descript;
    createErrDiv(el, msg);
}


/**
 * Функция тестирования формы, которая перебирает инпуты и отдает их на проверку
 * @param {Event} evt - Объект события, которое произошло.
 */
function testForm(evt) {
    const elements = evt.target.parentElement.getElementsByTagName(`input`);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].name in inputs) {
            checkInput(elements[i]);
        }
    }
}


/**
 * Функция создания DIV'а, поясняющего причину ошибки
 * @param {HTMLElement} el - элемент (инпут), в котором произла ошибка ввода.
 * @param {String} msg - сообщение, которое будет выведено во вспомогательном DIV'е.
 */
function createErrDiv(el, msg) {
    if (el.classList.contains('invalid')) {
        el.parentElement.lastChild.innerText = msg;
    } else {
        const newDiv = document.createElement(`div`);
        newDiv.classList.add('invalid');
        newDiv.innerText = msg;
        el.classList.remove('valid');
        el.classList.add('invalid');
        el.parentElement.appendChild(newDiv);
    }
}


/**
 * Основная функция, запускающая проверку формы, если событие сработало на кнопке,
 * и вызывающая функцию прерывания, если была допущена ошибка ввода.
 * @param {Event} evt - Объект события, которое произошло.
 */
function formAction(evt) {
    if (evt.target.type === 'submit') {
        testForm(evt);
        if (evt.target.parentElement.querySelector('.invalid')) {
            return stopDefAction(evt);
        }
    }
}


/**
 * Функция, которая очищает ввод от вспомогательного DIV'а и делает его валидным
 * @param {HTMLElement} el - элемент (инпут), который нужно очистить.
 */
function removeErrDivs(el) {
    if (el.classList.contains('invalid')) {
        el.parentElement.lastChild.remove();
        el.classList.remove('invalid');
    }
    el.classList.add('valid');
}


// Создаем переменную, с лементом всей Формы, на которую вешаем событие по клику.
const myForm = document.querySelector('.my-form');
myForm.addEventListener('click', formAction, false);
