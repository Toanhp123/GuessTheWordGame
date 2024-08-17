const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const listInput = $$('.list-enter-char .list-item');
const inputChars = $$('.list-enter-char input');
const btnRandom = $('.random-btn');
const btnReset = $('.reset-btn');
const textContent = $$('.content p');
const tryCount = $$('.try-count');
const tryCountTitle = $('.try-count-title');
const mistakeChar = $('.mistake-char');

var isTypes = [];
var scrambled = 'worlds';
var numberTry = 0;
var maxNumberTry = tryCount.length;

function randomText() {
    let _scrambled = scrambled;

    textContent.forEach((text) => {
        text.innerText =
            _scrambled[Math.round(Math.random() * (_scrambled.length - 1))];

        _scrambled = _scrambled.replace(text.innerText, '');
    });
}

function titleTryCount(numberTry, maxNumberTry) {
    tryCountTitle.innerText = `Tries(${numberTry}/${maxNumberTry}):`;
}

function resetText() {
    inputChars.forEach((inputChar) => (inputChar.value = ''));
    isTypes = [];
}

function resetTryCount() {
    numberTry = 0;
    tryCount.forEach((tryCount) => {
        tryCount.classList.remove('active');
    });
}

function resetMistakes() {
    mistakeChar.innerText = '';
}

function resetGame() {
    titleTryCount(0, maxNumberTry);
    resetText();
    resetTryCount();
    resetMistakes();
}

function randomTextAndResetGame() {
    randomText();
    resetGame();
}

function checkWrongText(inputChars) {
    let mistake = [];

    inputChars.forEach((text, index) => {
        if (text.value !== scrambled[index]) {
            mistake.push(text.value);
        }
    });

    mistakeChar.innerText = mistake.join(', ');
}

const app = {
    autoEvent() {
        randomText();
        titleTryCount(numberTry, maxNumberTry);
    },

    handleEvent() {
        inputChars.forEach((inputChar, index, nodeList) => {
            inputChar.addEventListener('input', function moveToNextInput() {
                if (
                    inputChar.value.length === inputChar.maxLength &&
                    !isTypes.includes(`input-${index + 2}`) &&
                    index < nodeList.length - 1
                ) {
                    document.getElementById(`input-${index + 2}`).focus();
                } else {
                    if (isTypes.length === nodeList.length) {
                        document.getElementById(`input-${index + 1}`).blur();

                        let textType = [...nodeList].map((text) => text.value);

                        if (textType.join('') === scrambled) {
                            setTimeout(() => {
                                alert('success');
                                randomTextAndResetGame();
                            }, 10);
                        } else if (numberTry < maxNumberTry) {
                            tryCount[numberTry].classList.add('active');
                            numberTry++;

                            titleTryCount(numberTry, maxNumberTry);
                            checkWrongText(inputChars);
                            resetText();
                        } else {
                            randomTextAndResetGame();
                        }
                    } else {
                        let notType = [...nodeList].filter(
                            (x) => !isTypes.includes(x.id),
                        );

                        document.getElementById(notType[0].id).focus();
                    }
                }
            });

            inputChar.addEventListener('focus', function selectText() {
                listInput[index].classList.add('underline');

                if (inputChar.value.length === inputChar.maxLength) {
                    inputChar.select();
                }
            });

            inputChar.addEventListener('focusout', function removeUnderline() {
                listInput[index].classList.remove('underline');
            });

            inputChar.addEventListener('keydown', function handleDeleteKey(e) {
                const currentIndex = $(`#input-${index + 1}`);
                const prevIndex = `#input-${index}`;

                if (e.key === 'Delete' || e.key === 'Backspace') {
                    if (currentIndex.value === '' && index > 0) {
                        document.querySelector(prevIndex).focus();
                    } else if (currentIndex.value !== '') {
                        currentIndex.value = '';
                        isTypes = isTypes.filter((x) => x !== currentIndex.id);
                    }

                    e.preventDefault();
                } else if (e.which >= 65 && e.which <= 90) {
                    isTypes.push(`input-${index + 1}`);

                    if (currentIndex.value !== '') {
                        isTypes.length--;
                    }
                } else {
                    e.preventDefault();
                }
            });
        });

        btnRandom.addEventListener('click', randomTextAndResetGame);

        btnReset.addEventListener('click', resetGame);
    },

    start() {
        this.autoEvent();
        this.handleEvent();
    },
};

app.start();
