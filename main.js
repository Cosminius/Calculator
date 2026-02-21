// calculator state
let firstNumber = null;          // holds the first operand
let operator = null;             // '+', '-', '*', '/'
let waitingForSecond = false;    // are we waiting for the next number?

function add(num1, num2) {
    return num1 + num2;
}

function substract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    // protect against division by zero
    if (num2 === 0) {
        return 'Error';
    }
    return num1 / num2;
}

function operate(op, number1, number2) {
    switch (op) {
        case '+': return add(number1, number2);
        case '-': return substract(number1, number2);
        case '*': return multiply(number1, number2);
        case '/': return divide(number1, number2);
        default: return number2;
    }
}

// round and format
function formatResult(res) {
    if (typeof res === 'number') {
        return parseFloat(res.toFixed(8)).toString();
    }
    return res;
}

// display reference
const displayEl = document.querySelector('.result');

function inputDigit(digit) {
    if (waitingForSecond) {
        displayEl.textContent = digit;
        waitingForSecond = false;
    } else {
        displayEl.textContent = displayEl.textContent === '0' ? digit : displayEl.textContent + digit;
    }
}

function inputDecimal(dot) {
    if (waitingForSecond) {
        displayEl.textContent = '0.';
        waitingForSecond = false;
        return;
    }
    if (!displayEl.textContent.includes(dot)) {
        displayEl.textContent += dot;
    }
}

function handleOperator(nextOp) {
    const inputValue = parseFloat(displayEl.textContent);
    if (operator && waitingForSecond) {
        operator = nextOp;
        return;
    }
    if (firstNumber === null) {
        firstNumber = inputValue;
    } else if (operator) {
        const result = operate(operator, firstNumber, inputValue);
        const formatted = formatResult(result);
        displayEl.textContent = formatted;
        firstNumber = result === 'Error' ? null : parseFloat(formatted);
    }
    waitingForSecond = true;
    operator = nextOp;
}

function resetCalculator() {
    displayEl.textContent = '0';
    firstNumber = null;
    operator = null;
    waitingForSecond = false;
}

// main listener
document.querySelector('.container').addEventListener('click', (e) => {
    if (!e.target.matches('button')) return;
    const val = e.target.textContent;
    if (val >= '0' && val <= '9') {
        inputDigit(val);
    } else if (val === '.') {
        inputDecimal(val);
    } else if (val === '+' || val === '-' || val === '*' || val === '/') {
        handleOperator(val);
    } else if (val === '=') {
        handleOperator(null);
        operator = null;
    } else if (val.toLowerCase() === 'clear') {
        resetCalculator();
    }
});