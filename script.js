document.addEventListener('DOMContentLoaded', function () {
    const displayOperator = document.getElementById('display-operator');
    const displayValue = document.getElementById('display-value');
    const display = document.getElementById('display');
    const displayExpression = document.getElementById('display-expression');
    let current = '0';
    let operator = null;
    let previous = null;
    let resetNext = false;
    let expression = '';

    // Operator symbols for display
    const operatorSymbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '%': '%',
        'mod': '%',
        'pow': '^'
    };

    function updateDisplay() {
        displayExpression.textContent = expression || current;
    }

    function inputNumber(num) {
        if (resetNext) {
            current = num;
            resetNext = false;
        } else if (current === '0') {
            current = num;
        } else {
            current += num;
        }
        expression += num;
        updateDisplay();
    }

    function inputDecimal() {
        if (!current.includes('.')) {
            current += '.';
            expression += '.';
        }
        updateDisplay();
    }

    function clear() {
        current = '0';
        previous = null;
        operator = null;
        resetNext = false;
        expression = '';
        updateDisplay();
    }

    function backspace() {
        if (current.length > 1) {
            current = current.slice(0, -1);
        } else {
            current = '0';
        }
        expression = expression.slice(0, -1);
        updateDisplay();
    }

    function inputOperator(op) {
        if (resetNext) {
            expression = current + (operatorSymbols[op] || op);
            resetNext = false;
        } else {
            expression += operatorSymbols[op] || op;
        }
        previous = current;
        operator = op;
        resetNext = true;
        updateDisplay();
    }

    function inputPercent() {
        current = (parseFloat(current) / 100).toString();
        expression = current;
        updateDisplay();
    }

    function calculate() {
        try {
            // Replace symbols for eval
            let evalExp = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
            let result = eval(evalExp);
            displayExpression.textContent = expression + '=' + result;
            displayExpression.classList.add('result-animate');
            setTimeout(() => {
                displayExpression.classList.remove('result-animate');
            }, 600);
            current = result.toString();
            expression = '';
            operator = null;
            previous = null;
            resetNext = true;
        } catch {
            displayExpression.textContent = 'Error';
            current = '0';
            expression = '';
            operator = null;
            previous = null;
            resetNext = true;
        }
        updateDisplay();
    }

    // Scientific function helpers
    function applyFunction(func) {
        let value = parseFloat(current);
        if (isNaN(value)) return;
        switch (func) {
            case 'sin':
                current = Math.sin(value * Math.PI / 180).toString();
                break;
            case 'cos':
                current = Math.cos(value * Math.PI / 180).toString();
                break;
            case 'tan':
                current = Math.tan(value * Math.PI / 180).toString();
                break;
            case 'sqrt':
                current = Math.sqrt(value).toString();
                break;
            case 'ln':
                current = Math.log(value).toString();
                break;
            case 'log':
                current = Math.log10(value).toString();
                break;
            case 'exp':
                current = Math.exp(value).toString();
                break;
        }
        expression = current;
        resetNext = true;
        updateDisplay();
    }

    function insertConstant(constant) {
        if (resetNext || current === '0') {
            current = constant;
            resetNext = false;
        } else {
            current += constant;
        }
        expression += constant;
        updateDisplay();
    }

    function insertParen(paren) {
        if (resetNext) {
            current = paren;
            resetNext = false;
        } else {
            current += paren;
        }
        expression += paren;
        updateDisplay();
    }

    let powerMode = false;
    let baseValue = null;

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const action = this.getAttribute('data-action');
            if (!isNaN(action)) {
                inputNumber(action);
            } else if (action === '.') {
                inputNumber(action);
            } else if (action === 'clear') {
                clear();
            } else if (action === 'backspace') {
                backspace();
            } else if (['+', '-', '*', '/', '%'].includes(action)) {
                inputOperator(action);
            } else if (action === 'percent') {
                inputPercent();
            } else if (action === '=') {
                if (powerMode) {
                    current = Math.pow(baseValue, parseFloat(current)).toString();
                    powerMode = false;
                    baseValue = null;
                    updateDisplay();
                } else {
                    calculate();
                }
            } else if (['sin', 'cos', 'tan', 'sqrt', 'ln', 'log', 'exp'].includes(action)) {
                applyFunction(action);
            } else if (action === 'pow') {
                baseValue = parseFloat(current);
                powerMode = true;
                resetNext = true;
            } else if (action === 'pi') {
                insertConstant(Math.PI.toString());
            } else if (action === 'e') {
                insertConstant(Math.E.toString());
            } else if (action === 'open-paren') {
                insertParen('(');
            } else if (action === 'close-paren') {
                insertParen(')');
            }
        });
    });

    updateDisplay();
});