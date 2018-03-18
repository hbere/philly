//
// Lotto Simulator loosely based on Match 6
// https://www.palottery.state.pa.us/Games/Match-6.aspx
// https://www.palottery.state.pa.us/Games/Match-6.aspx#howtoplay.  Keys:
// Each game costs $2
// Pick 6 numbers between 1 and 49
// For each 6 you pick, you get 2 extra random plays from the computer
//

// GLOBAL VARIABLES
var games = 0;
var gameMatches = [0, 0, 0, 0, 0, 0, 0];
var amtSpent = 0;
var amtWon = 0;
var netWon = 0;

// FUNCTIONS
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function arrayLoad(lottoBalls, min, max, array) {
  var temp, match;
  // check to see if match
  for (i = 0; i < lottoBalls; i++) {
    // generate new number
    temp = getRandomInt(min, max);
    match = 0;
    // see if not already in list
    for (j = 0; j < array.length; j++) {
      if (temp == array[j]) {
        match += 1;
      }
    }
    // push if no match yet
    if (match == 0) {
      array.push(temp);
    } else {
      i--;
    }
  }
  return array;
}

function printArray(array, desc) {
  str = desc + ": ";
  // array.sort();
  array.sort((a, b) => (a - b)); // https://stackoverflow.com/questions/1063007/how-to-sort-an-array-of-integers-correctly#1063027
  for (j = 0; j < array.length; j++) {
    str += array[j] + " ";
  }
  return str;
}

function squareUp(cost, matches) {
  var prizes = [0,0,0,2,20,1000,2000000]; // https://www.palottery.state.pa.us/Games/Match-6.aspx
          // https://www.palottery.state.pa.us/Games/Match-6/Prizes-Chances.aspx
  var winnings = prizes[matches];
  tot = -1 * cost + winnings;
  return tot;
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript#2901298
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function playGame(plays) {
  // Empty previous results
  $("#thisPlay").empty();
  $("#allPlays").empty();

  // Declare variables
  var myNumbers, roll, matches, net, hits;

  // TEST
  // alert (plays);

  for (m = 0; m < plays; m++) {
    // TEST
    // alert (m);

    // Choose numbers
    myNumbers = [];
    myNumbers = arrayLoad(6, 1, 49, myNumbers);
    // alert(printArray(myNumbers, "My numbers"));

    // Wait for the roll
    roll = [];
    roll = arrayLoad(6, 1, 49, roll);
    // alert(printArray(roll, "Roll"));

    // Get your response
    // https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript#1885569
    // https://stackoverflow.com/questions/16227197/compute-intersection-of-two-arrays-in-javascript
    matches = [];
    matches = myNumbers.filter(function(n) {
        return roll.indexOf(n) !== -1;
    });
    // alert(printArray(matches, "Matches"));

    // Calculate results
    hits = matches.length;
    gameMatches[hits] += 1;
    net = squareUp(2, hits)

    // Update global variables
    games++;
    amtSpent += 2;
    amtWon += net + 2;
    netWon += net;
  }

  // Report results
  // http://api.jquery.com/append/
  $("#thisPlay").append("<p>" + printArray(myNumbers, "My numbers") + "</p>");
  $("#thisPlay").append("<p>" + printArray(roll, "Winning numbers") + "</p>");
  $("#thisPlay").append("<p>" + printArray(matches, "Matched numbers") + "</p>");
  // $("#thisPlay").append("<p>You matched " + hits + " number(s).</p>");
  if (net > 0) {
    $("#thisPlay").append("<h4 style=\"color:green;\">You matched " + hits + " number(s). <strong>You won $" + numberWithCommas(net) + ".</strong></h4>");
  } else if (net == 0) {
    $("#thisPlay").append("<h4 style=\"color:green;\">You matched " + hits + " number(s). <strong>You broke even.</strong></h4>");
  } else {
    $("#thisPlay").append("<h4 style=\"color:darkred;\">You matched " + hits + " number(s). <strong>You lost $" + numberWithCommas(Math.abs(net)) + "!</strong></h4>");
  }
  $("#allPlays").append("<p>Total Games Played: " + numberWithCommas(games) + ". Results:</p>");
  $("#allPlays").append("<ul>");
  $("#allPlays").append("<li>Matched 0 == " + numberWithCommas(gameMatches[0]) + "</li>");
  $("#allPlays").append("<li>Matched 1 == " + numberWithCommas(gameMatches[1]) + "</li>");
  $("#allPlays").append("<li>Matched 2 == " + numberWithCommas(gameMatches[2]) + "</li>");
  $("#allPlays").append("<li>Matched 3 == " + numberWithCommas(gameMatches[3]) + "</li>");
  $("#allPlays").append("<li>Matched 4 == " + numberWithCommas(gameMatches[4]) + "</li>");
  $("#allPlays").append("<li>Matched 5 == " + numberWithCommas(gameMatches[5]) + "</li>");
  $("#allPlays").append("<li>Matched 6 == " + numberWithCommas(gameMatches[6]) + "</li>");
  $("#allPlays").append("</ul>");
  // $("#allPlays").append("<p>You have won $" + numberWithCommas(amtWon) + ".</p>");
  // $("#allPlays").append("<p>You have spent: $" + numberWithCommas(amtSpent) + ".</p>");
  if (netWon > 0) {
    $("#allPlays").append("<h4 style=\"color:green;\">You have spent $" + numberWithCommas(amtSpent) + " and won back $" + numberWithCommas(amtWon) + ".<strong> In sum, you have won $" + numberWithCommas(netWon) + ".</strong></h4>");
  } else if (netWon == 0) {
    $("#allPlays").append("<h4 style=\"color:green;\">You have spent $" + numberWithCommas(amtSpent) + " and won back $" + numberWithCommas(amtWon) + ".<strong> In sum, you have broken even.</strong></h4>");
  } else {
    $("#allPlays").append("<h4 style=\"color:darkred;\">You have spent $" + numberWithCommas(amtSpent) + " and won back $" + numberWithCommas(amtWon) + ".<strong> In sum, you have lost $" + numberWithCommas(Math.abs(netWon)) + "!</strong></h4>");
  }
};


$( "#play1" ).click(function() {
  // alert( "Handler for .click() called." );
  // event.preventDefault();
  playGame(1);
});

$( "#play10" ).click(function() {
  // alert( "Handler for .click() called." );
  // event.preventDefault();
  playGame(10);
});

$( "#play100" ).click(function() {
  // alert( "Handler for .click() called." );
  // event.preventDefault();
  playGame(100);
});

$( "#play1000" ).click(function() {
  // alert( "Handler for .click() called." );
  // event.preventDefault();
  playGame(1000);
});

$( "#play1000000" ).click(function() {
  // alert( "Handler for .click() called." );
  // event.preventDefault();
  playGame(1000000);
});

$( "#startOver" ).click(function() {
  games = 0;
  amtSpent = 0;
  amtWon = 0;
  netWon = 0;
  gameMatches = [0, 0, 0, 0, 0, 0, 0];
  $("#thisPlay").empty();
  $("#thisPlay").append("<p><em>Click a button above to play.</em></p>");
  $("#allPlays").empty();
  $("#allPlays").append("<p><em>Click a button above to play.</em></p>");
});
