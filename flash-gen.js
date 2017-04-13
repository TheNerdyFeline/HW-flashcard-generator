// declare var
var fs = require("fs");
var inquirer = require("inquirer");
var save, newCard;
makeFlashcard();

// constructure function to build basic flashcard
function BasicFlash(question, answer) {
    this.front = question;
    this.back = answer;
};// close BasicFlash function

// constructure function to build close flascard
function ClozeFlash(full, partial, cloze) {
    this.full = full;
    this.partial = partial;
    this.cloze = cloze;
}; // close ClozeFlash Function

//protype functions to append each new flashcard to txt file
// save info to txt docs based on type of flashcard made
BasicFlash.prototype.addBasicFlash = function() {
    fs.appendFile("basic-cards.txt", newCard, function(err) {
	if (err) {
	    console.log(err);
	} else {
	    console.log("New Basic Flashcard made.");
	}
    });
}; // close add basicFlash function

ClozeFlash.prototype.addClozeCard = function() {
    fs.appendFile("cloze-cards.txt", newCard, function(err) {
	if (err) {
	    console.log(err);
	} else {
	    console.log("New Cloze Flashcard made.");
	}
    });
}; // close add ClozeCard function

// function to ask if user wants to be quizzed or make a new flashcard
//function userChoice() {
  //  inquirer.prompt
//} // close userChoice

// use inquirer to make flash cards based on user input
function makeFlashcard() {
    inquirer.prompt([
	{
	    name: "cardType",
	    message: "What type of flashcard would you like to make?",
	    choices: ["Basic Flashcard", "Cloze Flashcard"]
    }]).then(function(typeCard) {
	if (typeCard === "Basic Flashcard") {
	    inquirer.prompt([
		{
		    name: "question",
		    message: "What should be on the front of this basic card?"

		}, {
		    name: "answer",
		    message: "What should be on the back of this basic card?"
		}
	    ]).then(function(basicAnswers) {
		save = new BasicFlash(basicAnswers.question, basicAnswers.answer);
		newCard = "/nQuestion: " + save.question + " Answer: " + save.answer;
		newCard.addBasicFlash();
	    });
	} else if (typeCard === "Cloze Flashcard") {

	} else {
	    console.log("You can't do that.");
	}
    });
}; // close makeFlashcard function
// display random flashcard- based on type of card asked for?
