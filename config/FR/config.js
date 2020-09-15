// --------------------------------------- French Config
//
// Written by Brian Davies
//
// Tile count and values from:
//    http://www.gtoal.com/scrabble/details/french/
//
// --------------

// --------------------------------------- Tiles

/*
French often omits diacritics with capitol letters.
*/

LETTER_COUNT = {
	'a': 9, 'b': 2, 'c': 2, 'd': 3, 'e':15, 'f': 2, 'g': 2,
	'h': 2, 'i': 8, 'j': 1, 'k': 1, 'l': 5, 'm': 3, 'n': 6,
	'o': 6, 'p': 2, 'q': 1, 'r': 6, 's': 6, 't': 6, 'u': 6,
	'v': 2, 'w': 1, 'x': 1, 'y': 1, 'z': 1, '*': 2 }

LETTER_POINTS = {
	'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 4, 'g': 2,
	'h': 4, 'i': 1, 'j': 8, 'k':10, 'l': 1, 'm': 2, 'n': 1,
	'o': 1, 'p': 3, 'q': 8, 'r': 1, 's': 1, 't': 1, 'u': 1,
	'v': 4, 'w':10, 'x':10, 'y':10, 'z':10, '*': '*' }

// --------------------------------------- Messages

// this needs help

MESSAGE_DISPLAY = {
	
	"Tiles Left": "Tiles Left",
	
	"History": "History (please help me translate label text!)",
	
	"Play": "Play",
	"Pass": "Pass",
	"Recall": "Recall",
	"Swap": "Swap",
	
	"Argrams": "Argrams",
	"Start a new game?": "Start a new game?",
	"Abandon current game?": "Abandon current game?",
	
	"Settings": "Settings",
	"Computer Level": "Computer Level",
	"Show Legal Words": "Show Legal Words",
	"Show Helper Tools": "Show Helper Tools",
	
	"The comuter swaps tiles.": "The comuter swaps tiles.",
	"The computer passes.": "The computer passes.",
	
	"Bingo": "Bingo",
	
	"Invalid": "Invalid",
	"You did not place any tiles.": "You did not place any tiles.",
	"The first word must be placed on the star.": "The first word must be placed on the star.",
	"All tiles must be in the same row or column.": "All tiles must be in the same row or column.",
	" is not connected to other tiles.": " is not connected to other tiles.",
	"Words can not include spaces.": "Words can not include spaces.",
	" not found in the dictionary.": " not found in the dictionary.",
	
	"Win": "Win",
	"Loss": "Lose",
	"Draw": "Draw",
	
	"for unplayed tiles": "for unplayed tiles",
	
	"Lookup": "Lookup",
	
	"No moves found.": "???",
	
	"Tiles": "????",
	
	"Could not load dictionary.": "Could not load dictionary."
}

// --------------------------------------- Definitions

DEFINITION_URL = "https://www.wordreference.com/fren/";

// --------------------------------------- Dictionary

LANGUAGE = "FR";

// --------------------------------------- End