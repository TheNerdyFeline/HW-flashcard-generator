// declare var
require('babel-register');
require('./flash-gen.js');
var fs = require("fs");
var inquirer = require("inquirer");
var save, newCard, currFlash, flashChoice;
var counter = 5;
var basicArr = [];
var clozeArr = [];
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
		basicArr.push(save);
		console.log("New basic flashcard made.");
		userChoice();
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
		clozeArr.push(save);
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
		    currFlash = basicArr.pop();
		    counter--;
		    console.log("Question: " + currFlash.front);
		    inquirer.prompt([
			{
			    name: "confirm",
			    type: "confirm",
			    Message: "Ready for the answer?"
			}
			
		    ]).then(function(getAnswer) {
			if(getAnswer) {
			    console.log("Answer: " + currFlash.back);
			    setTimeout(function() {
				nextFlash();
			    }, 3000);
			} else {
			    console.log("No answer.");
			}
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
