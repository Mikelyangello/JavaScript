'use strict';

/* 1. Создать функцию, генерирующую шахматную доску.
При этом можно использовать любые html-теги по своему желанию.
Доска должна быть разлинована соответствующим образом, т.е. чередовать черные и белые ячейки.
Строки должны нумероваться числами от 1 до 8, столбцы – латинскими буквами A, B, C, D, E, F, G, H.
*/

/**
 * Объект с настройками игры.
 * @property {int} rowsCount - Количество строк в карте.
 * @property {int} colsCount - Количество колонок в карте.
 * @property {string} otherCellColor - Цвет ячейки шахматного порядка.
 * @property {arr} digitArr - Массив с номерами строк игрового поля.
 * @property {arr} symbolArr - Массив с буквами столбцов игрового поля.
 *
 */
const settings = {
    rowsCount: 10,
    colsCount: 10,
    otherCellColor: '#888888',
    digitArr: [8, 7, 6, 5, 4, 3, 2, 1],
    symbolArr: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
};

/**
 * Объект игры.
 * @property {HTMLElement} gameContainerEl - Контейнер игры (DOM элемент).
 * @property {HTMLCollection} cellElements - Коллекция ячеек игрового поля.
 * @property {arr} figures - Массив с разновидностями шахматных фигур и их атрибутами.
 * @property {arr} figuresCode - Массив с соответствием коду символа к определенной фигуре и цвету.
 */
const chess = {
    settings,
    gameContainerEl: document.getElementById('game'),
    cellElements: null,
    figures: [
        {name: 'p', color: 'w', pos: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2']},
        {name: 'N', color: 'w', pos: ['b1', 'g1']},
        {name: 'B', color: 'w', pos: ['c1', 'f1']},
        {name: 'R', color: 'w', pos: ['a1', 'h1']},
        {name: 'Q', color: 'w', pos: 'd1'},
        {name: 'K', color: 'w', pos: 'e1'},
        {name: 'p', color: 'b', pos: ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7']},
        {name: 'N', color: 'b', pos: ['b8', 'g8']},
        {name: 'B', color: 'b', pos: ['c8', 'f8']},
        {name: 'R', color: 'b', pos: ['a8', 'h8']},
        {name: 'Q', color: 'b', pos: 'd8'},
        {name: 'K', color: 'b', pos: 'e8'},
    ],
    figuresCode: {
        pw: '&#9817;',
        Nw: '&#9816;',
        Bw: '&#9815;',
        Rw: '&#9814;',
        Qw: '&#9813;',
        Kw: '&#9812;',
        pb: '&#9823;',
        Nb: '&#9822;',
        Bb: '&#9821;',
        Rb: '&#9820;',
        Qb: '&#9819;',
        Kb: '&#9818;',
    },

    /**
     * Метод отрисовки шахматных фигур.
     */
    renderFigures() {
        // перебираем все ячейки шахматной доски
        for (let el = 0; el < this.cellElements.length; el++) {
            // проверяем наличие атрибута в ячейке
            if (this.cellElements[el].getAttribute('coordinates')) {
                const curCell = this.cellElements[el];
                // очищаем каждую ячейку игрового поля
                curCell.innerHTML = '';
                // записываем координаты ячейки
                const coordinate = curCell.getAttribute('coordinates');
                // перебираем все фигуры
                for (let elem of this.figures) {
                    // проверяем в каждой фигуре наличие нашей координаты
                    if (elem.pos.includes(coordinate)) {
                        // скрепляем фигуру с цветом и ищем нужный код в кодировке фигур, внося его в ячейку
                        const code = elem.name + elem.color;
                        curCell.innerHTML = this.figuresCode[code];
                    }
                }
            }
        }
    },

    /**
     * Метод отображения карты (игрового поля).
     */
    renderMap() {
        // Очищаем контейнер для доски.
        this.gameContainerEl.innerHTML = '';
        // Массив ячеек пока пуст.
        this.cellElements = [];
        // Пробегаемся в цикле столько раз, какое количество строк на доске.
        for (let row = 0; row < this.settings.rowsCount; row++) {
            // Создаем новую строку.
            const trElem = document.createElement('tr');
            // Добавляем строку в контейнер с игрой.
            this.gameContainerEl.appendChild(trElem);
            // В каждой строке пробегаемся по циклу столько раз, сколько у нас колонок.
            for (let col = 0; col < this.settings.colsCount; col++) {
                // Создаем ячейку.
                const cell = document.createElement('td');
                // Определяем внешние строки и столбцы для обозначений
                if ((row === 0 ||
                    row ===  this.settings.rowsCount - 1) &&
                    col > 0 &&
                    col < this.settings.colsCount - 1
                ) {
                    // Записываем в ячейку значение из соответствующего массива (буквы или цифры)
                    cell.innerHTML = this.settings.symbolArr[col - 1];
                } else if ((col === 0 ||
                    col ===  this.settings.colsCount - 1) &&
                    row > 0 &&
                    row < this.settings.rowsCount - 1
                ) {
                    cell.innerHTML = this.settings.digitArr[row - 1];
                } else if (row !==0 && row !== this.settings.rowsCount - 1) {
                    // создаем координаты для каждой ячейки игрового поля в ее атрибутах
                    const coordinate = this.settings.symbolArr[col - 1] + this.settings.digitArr[row - 1];
                    cell.setAttribute('coordinates', coordinate);
                    if (this.isCellIsBlack(row, col)){
                        cell.style.backgroundColor = this.settings.otherCellColor;
                    }
                }
                // Записываем ячейку в массив ячеек.
                this.cellElements.push(cell);
                // Добавляем ячейку в текущую строку.
                trElem.appendChild(cell);
                console.log(cell.getAttribute('coordinates'));
            }
        }
    },

    /**
     * Определяет является ли ячейка черной.
     * @param {int} rowNum Номер в строке.
     * @param {int} colNum Номер в колонке.
     * @returns {boolean} true, если ячейка должна быть черной, иначе false.
     */
    isCellIsBlack(rowNum, colNum) {
        return rowNum % 2 === colNum % 2;
    },
};

// Запускаем метод отображения карты.
chess.renderMap();
// Запускаем метод отрисовки шахматных фигур.
chess.renderFigures();


