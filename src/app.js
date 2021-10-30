// calculator screen, keys, and body
const screen = document.querySelector('#screen');
const keys = document.querySelector('.keys');
const body = document.querySelector('body');

// theme input radio buttons
const themeOne = document.querySelector('#one');
const themeTwo = document.querySelector('#two');
const themeThree = document.querySelector('#three');

// get item from local storage
const theme = localStorage.getItem('theme');

// check radio button based on localStorage value
if (theme === 'theme-2') {
  themeTwo.checked = true;
}
if (theme === 'theme-3') {
  themeThree.checked = true;
}

// if localStorage has value then body.classList = that value else body.classlist = 'theme-1'
body.classList = theme || 'theme-1';

// set theme and save to local storage
themeOne.addEventListener('click', () => {
  body.classList = 'theme-1';
  localStorage.setItem('theme', 'theme-1');
});
themeTwo.addEventListener('click', () => {
  body.classList = 'theme-2';
  localStorage.setItem('theme', 'theme-2');
});
themeThree.addEventListener('click', () => {
  body.classList = 'theme-3';
  localStorage.setItem('theme', 'theme-3');
});

let resultDisplayed = false;

keys.addEventListener('click', (e) => {
  if (e.target.classList.contains('key')) {
    // convert keys number text to numbers
    const numKey = +e.target.firstElementChild.innerText;

    // keys text
    const key = e.target.firstElementChild.innerText;

    // key button
    const keyEl = e.target.firstElementChild;

    // calculator screen text
    const currentString = screen.innerText;

    // screen text last character
    const lastChar = currentString[currentString.length - 1];

    // select only numbers
    const numbers = currentString.split(/\+|\-|\x|\//g);

    // select only operators
    const operators = currentString.replace(/[0-9]|\./g, '').split('');

    // select only number keys and '.'
    if (!isNaN(numKey) || key === '.') {
      if (resultDisplayed === false) {
        screen.innerText += key;
      } else if (
        (resultDisplayed === true && lastChar === '+') ||
        lastChar === '-' ||
        lastChar === 'x' ||
        lastChar === '/'
      ) {
        resultDisplayed === false;
        screen.innerText += key;
      } else {
        resultDisplayed = false;
        screen.innerText += key;
      }

      // split every number and operator
      const numbersOnly = screen.innerText.split(
        /(?=[+,\-,x,/])|(?<=[+,\-,x,/])/g
      );

      // allow one dot and join array
      let oneDot = numbersOnly
        .map((num) => {
          num = replace(num);
          return num;
        })
        .join('');

      // function to replace every second dot to '' after operator
      function replace(dot) {
        let i = 0;
        const text = dot.replace(/[\.\%]/g, function (match) {
          return match === '.' ? (i++ === 0 ? '.' : '') : '';
        });
        return text;
      }
      screen.innerText = oneDot;
    }

    // select only operators key
    if (e.target.classList.contains('math')) {
      if (
        lastChar === '+' ||
        lastChar === '-' ||
        lastChar === 'x' ||
        lastChar === '/'
      ) {
        // if last character operator prevent add another operator or replace the last operator
        const newString =
          currentString.substring(0, currentString.length - 1) + key;
        screen.innerText = newString;
      } else if (currentString.length === 0) {
        // do nothing if the first character not a number
      } else {
        screen.innerText += key;
      }
    }

    // select '=' key
    if (key === '=') {
      let divide = operators.indexOf('/');
      while (divide != -1) {
        numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
        operators.splice(divide, 1);
        divide = operators.indexOf('/');
      }

      let multiply = operators.indexOf('x');
      while (multiply != -1) {
        numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
        operators.splice(multiply, 1);
        multiply = operators.indexOf('x');
      }

      let subtract = operators.indexOf('-');
      while (subtract != -1) {
        numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
        operators.splice(subtract, 1);
        subtract = operators.indexOf('-');
      }

      let add = operators.indexOf('+');
      while (add != -1) {
        numbers.splice(
          add,
          2,
          parseFloat(numbers[add]) + parseFloat(numbers[add + 1])
        );
        operators.splice(add, 1);
        add = operators.indexOf('+');
      }

      const lastString = screen.innerText[screen.innerText.length - 1];
      if (
        lastString !== 'x' &&
        lastString !== '/' &&
        lastString !== '+' &&
        lastString !== '-'
      ) {
        const fixedNumber = +numbers[0].toFixed(8);
        if (!isNaN(fixedNumber)) {
          screen.innerText = fixedNumber;
        }
      }

      resultDisplayed = true;
    }

    // select RESET key
    if (key === 'RESET') {
      screen.innerText = '';
    }

    // select DEL key
    if (key === 'DEL') {
      const delString = screen.innerText.substring(
        0,
        screen.innerText.length - 1
      );
      screen.innerText = delString;
    }
  }
});
