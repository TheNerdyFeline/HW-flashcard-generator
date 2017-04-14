// declare var
require('babel-register');
require('./flash-gen.js');
var fs = require("fs");
var inquirer = require("inquirer");
var save, newCard, currFlash, flashChoice;
var counter = 5;
var currFlashArr = [];
userChoice();

// constructure function to build basic flashcard
function BasicFlash(question, answer) {
    this.front = question;
    this.back = answer;
};// close BasicFlash function

// constructure function to build close flashcard
function ClozeFlash(full, partial, cloze) {
    this.back = full; 
    this.front = partial; // missing answer
    this.delete = cloze; // deleted portion
}; // close ClozeFlash Function

//protype functions to append each new flashcard to txt file
// save info to txt docs based on type of flashcard made
BasicFlash.prototype.addBasicFlash = function() {
    newCard = JSON.stringify(save, null, 2);
    fs.appendFile("basic-cards.txt", newCard, function(err) {
	if (err) {
	    console.log(err);
	} else {
	    console.log("New Basic Flashcard made.");
	}
    });
}; // close add basicFlash function

// function to show user front of flash card
BasicFlash.prototype.frontBasicFlash = function() {
    console.log(BasicFlash.front);
}; // close show front of basic flash card

// function to show user back of flash card
BasicFlash.prototype.backBasicFlash = function() {
    console.log(BasicFlash.back);
}; // close show back of basic flash card

ClozeFlash.prototype.addClozeCard = function() {
     newCard = JSON.stringify(save, null, 2);
    //newCard = "\nFull Text: " + save.back + " Partial Text: " + save.front + " Deleted Portion: " + save.delete;
    fs.appendFile("cloze-cards.txt", newCard, function(err) {
	if (err) {
	    console.log(err);
	} else {
	    console.log("New Cloze Flashcard made.");
	}
    });
}; // close add ClozeCard function

// function to ask if user wants to be quizzed or make a new flashcard
function userChoice() {
    inquirer.prompt([{
	name: "toDo",
	type: "list",
	message: "What would you like to do?",
	choices: ["Make a new flashcard", "Run through current flashcards"]
    }	
    ]).then(function(answer) {
	if(answer.toDo === "Make a new flashcard"){
	    makeFlashcard();
	} else if (answer.toDo === "Run through current flashcards"){
	    runFlashcards();
	}
    });
} // close userChoice

// use inquirer to make flash cards based on user input
function makeFlashcard() {
    inquirer.prompt([
	{
	    name: "cardType",
	    type: "list",
	    message: "What type of flashcard would you like to make?",
	    choices: ["Basic Flashcard", "Cloze Flashcard"]
    }]).then(function(typeCard) {
	if (typeCard.cardType === "Basic Flashcard") {
	    inquirer.prompt([
		{
		    name: "front",
		    message: "What should be on the front of this basic card?"

		}, {
		    name: "back",
		    message: "What should be on the back of this basic card?"
		}
	    ]).then(function(basicAnswers) {
		save = new BasicFlash(basicAnswers.front, basicAnswers.back);
		save.addBasicFlash();
		setTimeout(function(){
		    userChoice();
		}, 1000);
	    });
	} else if (typeCard.cardType === "Cloze Flashcard") {
	    inquirer.prompt([{
		name: "back",
		message: "What is the full text for the flashcard?"
	    }, {
		name: "front",
		message: "What will the partial text be?"
	    }, {
		name: "delete",
		message: "What part of the text will be removed?"
	    }
	    ]).then(function(clozeAnswers) {
		save = new ClozeFlash(clozeAnswers.back, clozeAnswers.front, clozeAnswers.delete);
		save.addClozeCard();
		setTimeout(function(){
		    userChoice();
		}, 1000);
	    });

	} else {
	    console.log("You can't do that.");
	}
    });
}; // close makeFlashcard function

// display random flashcard- based on type of card asked for?
function runFlashcards() {
    inquirer.prompt([
	{
	    name: "quizType",
	    type: "list",
	    message: "You will get 5 flashcards. What type of flashcards would you like to use?",
	    choices: ["Basic, Question and Answer", "Cloze, fill in the missing part", "Random"]
	}
    ]).then(function(flashType) {
	flashChoice = flashType.quizType;
	nextFlash();
    });
} // close runFlashcards
			  
function nextFlash() {
    if(counter > 0){
	if(flashChoice === "Basic, Question and Answer") {
	    console.log("This works");
	    fs.readFile("basic-cards.txt", "utf8", function(err, data) {
		//data.sort(function(a, b) {
		 // return 0.5 - Math.random();
		console.log(data[0]);
		//});
		//currFlashArr = data.slice(0, 4);
		//currFlash = currFlashArr.pop();
		currFlash = data[1];
		counter--;
		currFlash.frontBasicFlash();
		inquirer.prompt([
		    {
			name: "confirm",
			type: "confirm",
			Message: "Ready for the answer?"
		    }
		    
		]).then(function(getAnswer) {
		    if(getAnswer) {
			currFlash.backBasicFlash();
			setTimeout(function() {
			    nextFlash();
			}, 3000);
		    }
		});
	    });
	} else if (flashChoice.quizType === "Cloze, fill in the missing part") {
	    fs.readFile("cloze-cards.txt", "utf8", function(err, data) {
		data.sort(function(a, b) {
		    return 0.5 - Math.random();
		});
		currFlashArr = data.slice(0, 4);
		currFlash = currFlashArr.pop();
		counter--;
		currFlash.frontBasicFlash();
		inquirer.prompt([
		    {
			name: "confirm",
			type: "confirm",
			Message: "Ready for the answer?"
		    }
		    
		]).then(function(getAnswer) {
		    if(getAnswer) {
			currFlash.backBasicFlash();
			setTimeout(function() {
			    nextFlash();
			}, 3000);
		    }
		});
	    });
	    
	} else {
	    console.log("You have finished this round of flashcards");
	    userChoice();
	}
    } //close if counter > 0
}; // close nextFlash function	    
