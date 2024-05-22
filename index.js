/// Tapple
// 1. Select timer (10,15,20,25s);
// 2. Click Start.
// 3. Start timer and show A-Z keys.
// on click the key on keyboard, start the timer again.
// if the timer ends. Stop the game and with a message.

/// GLOBALS
const timerButtons = document.querySelector('#timer');
const actionButton = document.querySelector('#action_btn');
const keyboardContainer = document.querySelector('#keyboard');
const timerLabel = document.querySelector('#timer_title');
const gameEnd = document.querySelector('#game_end');

const classes = {
  itemBtn: 'item_btn',
  selected: 'selected',
  disabled: 'disabled',
  hidden: 'hidden',
  keysContainer: 'keys_container',
  keyboardItem: 'keyboard_item',
};

const keyboardLayout = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

let timerValue = 0;
let selectedTimer = 0;
let isPlaying = false;
let timerInterval = null;
const pressedKeys = new Map();
/// END: GLOBALS

function addActionButtonListener() {
  actionButton.addEventListener('click', handleActionButtonOnClick);
}

function handleActionButtonToggle(toggle) {
  if (toggle) {
    actionButton.classList.remove(classes.disabled);
  } else {
    actionButton.classList.add(classes.disabled);
  }
}

function handleActionButtonOnClick() {
  if (actionButton.classList.contains(classes.disabled)) return;

  timerButtons.childNodes.forEach((e) => {
    const val = 'value_' + timerValue;

    if (e.id !== val) {
      e.classList.add(classes.hidden);
    }
  });

  actionButton.classList.add(classes.hidden);
  keyboardContainer.classList.remove(classes.hidden);
  timerLabel.innerText = 'Playing';

  handleActionButtonToggle(false);
  handleStartGame();
}

function handleTimerOnClick(e) {
  if (e.target.classList.contains(classes.selected)) return;

  timerButtons.childNodes.forEach((element) => {
    if (element != e.target) {
      element.classList.remove(classes.selected);
    }
  });

  e.target.classList.add(classes.selected);
  const id = e.target.id;

  selectedTimer = parseInt(id.match(/\d+/), 10);
  timerValue = selectedTimer;

  handleActionButtonToggle(true);
}

// Generate timer buttons (10,15,20,25);
function generateTimers(timersCount) {
  for (let i = 1; i <= timersCount; i++) {
    const timerValue = i * 5 + 5;
    const timerItem = document.createElement('li');
    timerItem.classList.add(classes.itemBtn);
    timerItem.setAttribute('id', 'value_' + timerValue);
    timerItem.innerText = timerValue;

    timerItem.addEventListener('click', handleTimerOnClick);

    timerButtons.append(timerItem);
  }
}

function generateKeyboardButtons() {
  // reset inner HTML if any;
  keyboardContainer.innerHTML = '';
  keyboardContainer.classList.add(classes.hidden);

  // generate 3 rows for the keyboard layout;
  for (let i = 0; i < 3; i++) {
    const row = document.createElement('ul');
    row.classList.add(classes.keysContainer);

    for (let j = 0; j < keyboardLayout[i].length; j++) {
      const rowItem = document.createElement('li');
      const letter = keyboardLayout[i][j];

      rowItem.classList.add(classes.keyboardItem);
      rowItem.setAttribute('id', letter);
      rowItem.innerText = letter;

      row.appendChild(rowItem);
    }
    keyboardContainer.append(row);
  }
}

function removeTimer() {
  clearInterval(timerInterval);
}

function createTimer() {
  if (!isPlaying) return;

  const selectedTimerText = document.querySelector(`#value_${selectedTimer}`);

  timerValue = selectedTimer;

  selectedTimerText.innerText = timerValue;

  timerInterval = setInterval(() => {
    timerValue--;
    selectedTimerText.innerText = timerValue;
    if (timerValue === 0) {
      removeTimer();
      stopGame();
      return;
    }
  }, 1000);
}

function restartTimer() {
  removeTimer();
  createTimer();
}

function handleStartGame() {
  isPlaying = true;
  createTimer();
  handleKeyboardClicks();
}

function stopGame() {
  isPlaying = false;
  checkIfGameIsFinished();
}

function checkIfGameIsFinished() {
  // win condition
  if (pressedKeys.size === 26 && isPlaying) {
    gameEnd.innerText = '!! CONGRATULATIONS !!';
    gameEnd.classList.remove(classes.hidden);
    removeTimer();
  }

  // lose condition
  if (!isPlaying) {
    gameEnd.innerText = '!! TRY AGAIN !!';
    gameEnd.classList.remove(classes.hidden);
  }
}

function handleKeyDisabled(key) {
  pressedKeys.set(key, key);
  console.log(pressedKeys);
  const pressedKey = document.querySelector(`#${key}`);
  pressedKey.classList.add(classes.disabled);
}

function handleKeyboardClicks() {
  let answer = '';
  document.addEventListener('keypress', (e) => {
    const key = e.key.toUpperCase();

    if (!isPlaying || pressedKeys.get(key)) return;

    if (key.match(/[A-Z]/) && !answer) {
      answer = key;
      handleKeyDisabled(key);
    }

    if (e.code === 'Space' && answer) {
      console.log(e.code, answer);
      restartTimer();
      answer = '';
      checkIfGameIsFinished();
    }
  });
}

function setup() {
  generateTimers(4);
  addActionButtonListener();
  handleActionButtonToggle(false);
  generateKeyboardButtons();
}

setup();
