const emojiArr1 = ["✌","😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚"]

const cards = shuffle(makeDouble(get8(shuffle(emojiArr1))))

  
let isFlipped = Array(16).fill(false);
let firstCardIndex = null;
let secondCardIndex = null;
let lockBoard = false;
let moves = 0;
let timeElapsed = 0;
let timerInterval;
  // Shuffle the cards array using the Fisher-Yates (Knuth) shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  
  function get8 (array){
    let tempArr = []
    for(i=0 ; i < 8 ; i++){
      tempArr[i] = array [i]
    }
    
    return tempArr
  }
  
  function makeDouble(array){
   let tempArr = array
    for(i=0 ; i < 8 ; i++){
      tempArr[i+8] = tempArr [i]
    }
   
   return tempArr
  }
  
  function createCardElement(card, index) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.setAttribute('data-index', index);
    
    // Handle the 'matched' class to keep matched cards flipped
    if (isFlipped[index]) {
      cardElement.textContent = cards[index];
      cardElement.classList.add('matched');
    } else {
      cardElement.textContent = '?';
    }
    
    cardElement.addEventListener('click', flipCard);
    return cardElement;
  }
  
  function startTimer() {
    timerInterval = setInterval(() => {
      timeElapsed++;
      displayTimer();
    }, 1000);
  }
  
  function displayTimer() {
    const timerElement = document.getElementById('timer');
    const minutes = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
    const seconds = (timeElapsed % 60).toString().padStart(2, '0');
    timerElement.textContent = `${minutes}:${seconds}`;
  }
  
  function flipCard() {
    if (lockBoard || isFlipped[this.getAttribute('data-index')] || this.classList.contains('matched')) return;
  
    const index = this.getAttribute('data-index');
  
    // Flip the card and display the emoji
    this.textContent = cards[index];
    isFlipped[index] = true;
  
    if (firstCardIndex === null) {
      firstCardIndex = this;
    } else {
      secondCardIndex = this;
      checkForMatch();
    }
  }
  
  
  
  
  function checkForMatch() {
    const isMatch = cards[firstCardIndex.getAttribute('data-index')] === cards[secondCardIndex.getAttribute('data-index')];
    updateMoveCount();
    if (isMatch) {
      disableCards();
    } else {
      unflipCards(); // Fix: Call unflipCards in case of a mismatch
    }
  }
  
  
  function disableCards() {
    firstCardIndex.removeEventListener('click', flipCard);
    secondCardIndex.removeEventListener('click', flipCard);
    // Add a 'matched' class to the matched cards
    firstCardIndex.classList.add('matched');
    secondCardIndex.classList.add('matched');
    resetBoard();
    checkForWin();
  }
  
  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCardIndex.textContent = '?'; // Flip back to question mark
      secondCardIndex.textContent = '?'; // Flip back to question mark
      isFlipped[firstCardIndex.getAttribute('data-index')] = false;
      isFlipped[secondCardIndex.getAttribute('data-index')] = false;
      resetBoard();
    }, 1000);
  }
  
  function resetBoard() {
    [firstCardIndex, secondCardIndex] = [null, null];
    lockBoard = false;
  }
  
  function updateMoveCount() {
    moves++;
    const moveCountElement = document.getElementById('move-count');
    moveCountElement.textContent = moves;
  }
  
  function checkForWin() {
    const matchedCards = document.querySelectorAll('.card.matched');
    if (matchedCards.length === cards.length) {
      clearInterval(timerInterval);
      alert(`Congratulations! You won in ${moves} moves and ${timeElapsed} seconds.`);
    }
  }
  
  function resetGame() {
    clearInterval(timerInterval);
  
    isFlipped = Array(16).fill(false);
    firstCardIndex = null;
    secondCardIndex = null;
    lockBoard = false;
    moves = 0;
    timeElapsed = 0;
  
    const timerElement = document.getElementById('timer');
    timerElement.textContent = '00:00';
  
    const moveCountElement = document.getElementById('move-count');
    moveCountElement.textContent = moves;
  
    initializeGame();
  }
  
  
  function initializeGame() {
    shuffle(cards);
  
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = '';
  
    for (let i = 0; i < cards.length; i++) {
      const cardElement = createCardElement(cards[i], i);
      gameGrid.appendChild(cardElement);
    }
  
    const moveCountElement = document.getElementById('move-count');
    moveCountElement.textContent = moves;
  
    startTimer();
    displayTimer();
  }
  
  document.getElementById('reset-button').addEventListener('click', resetGame);

  
  
  initializeGame();