let deck = [
    "fa fa-diamond",
    "fa fa-diamond",
    "fa fa-btc",
    "fa fa-btc",
    "fa fa-cube",
    "fa fa-cube",
    "fa fa-leaf",
    "fa fa-leaf",
    "fa fa-bomb",
    "fa fa-bomb",
    "fa fa-chrome",
    "fa fa-chrome",
    "fa fa-bolt",
    "fa fa-bolt",
    "fa fa-bluetooth",
    "fa fa-bluetooth"
];

let open = [];
let matched = 0;
let moveCounter = 0;
let numStars = 3;
let seconds = 0;
let minutes = 0;
let clearTime = -1;
let hard = 15;
let medium = 20;

let modal = $("#win-modal");

//Start time first card is clicked

//Start timer
let startTimer = function() {
  if (seconds === 59) {
    minutes++;
    seconds = 0;
  } else {
    seconds++;
  }

  // Ensure that single digit seconds are preceded with a 0
  let timerFormat = "0";
  if (seconds < 10) {
    timerFormat += seconds;
  } else {
    timerFormat = String(seconds);
  }

  let time = String(minutes) + ":" + timerFormat;
  $(".timer").text(time);
};
// Resets timer state and restarts timer
function resetTimer() {
  clearInterval(clearTime);
  seconds = 0;
  minutes = 0;
  $(".timer").text("0:00");

  clearTime = setInterval(startTimer, 1000);
}

// Randomizes cards on board and updates card HTML
function updateCards() {
  deck = shuffle(deck);
  var index = 0;
  $.each($(".card i"), function() {
    $(this).attr("class", "fa " + deck[index]);
    index++;
  });
}

// Toggles win modal on
function showModal() {
  modal.css("display", "block");
}

// Removes last start from remaining stars, updates modal HTML
function removeStar() {
  $(".fa-star")
    .last()
    .attr("class", "fa fa-star-o");
  numStars--;
  $(".num-stars").text(String(numStars));
}

// Restores star icons to 3 stars, updates modal HTML
function resetStars() {
  $(".fa-star-o").attr("class", "fa fa-star");
  numStars = 3;
  $(".num-stars").text(String(numStars));
}

// Updates number of moves in the HTML, removes star if necessary based on difficulty variables
function updateMoveCounter() {
  $(".moves").text(moveCounter);

  if (moveCounter === hard || moveCounter === medium) {
    removeStar();
  }
}

// Checks if card is a valid move (if it not currently matched or open)
function validCard(card) {
  return !(card.hasClass("open") || card.hasClass("match"));
}

// Returns whether or not currently open cards match
function checkMatch() {
  if (open[0].children().attr("class") === open[1].children().attr("class")) {
    return true;
  } else {
    return false;
  }
}

// Returns win condition
function gameWon() {
  if (matched === 16) {
    return true;
  } else {
    return false;
  }
}

// Sets currently open cards to the match state, checks win condition
let setMatch = function() {
  open.forEach(function(card) {
    card.addClass("match");
  });
  open = [];
  matched += 2;

  if (gameWon()) {
    clearInterval(clearTime);
    showModal();
  }
};

// Sets currently open cards back to default state
let resetOpen = function() {
  open.forEach(function(card) {
    card.toggleClass("open");
    card.toggleClass("show");
  });
  open = [];
};

// Sets selected card to the open and shown state
function openCard(card) {
  if (!card.hasClass("open")) {
    card.addClass("open");
    card.addClass("show");
    open.push(card);
  }
}

// Resets all game state variables and resets all required HTML to default state
let resetGame = function() {
  open = [];
  matched = 0;
  moveCounter = 0;
  resetTimer();
  updateMoveCounter();
  $(".card").attr("class", "card");
  updateCards();
  resetStars();
};

// Handles primary game logic of game
let onClick = function() {
  if(seconds == 0 && minutes == 0){
    resetTimer();
  }
  if (validCard($(this))) {
    if (open.length === 0) {
      openCard($(this));
    } else if (open.length === 1) {
      openCard($(this));
      moveCounter++;
      updateMoveCounter();

      if (checkMatch()) {
        setTimeout(setMatch, 300);
      } else {
        setTimeout(resetOpen, 700);
      }
    }
  }
};

// Resets game state and toggles win modal display off
let playAgain = function() {
  resetGame();
  modal.css("display", "none");
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/* Initalize event listeners */

$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);

// Provides a randomized game board on page load
$(updateCards);
 
 

  
