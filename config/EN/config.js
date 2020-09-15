// --------------------------------------- Config
//
// Written by Brian Davies
//
// --------------

// --------------------------------------- Instructions

// For the non-programmers out there, anthing that starts with // is a "comment"
// and is ignored by the code. (That includes these instructions.)

// All of these parameters are optional.  The game model includes default values
// for all of these, so any missing parameters will simply use the defaults.

// --------------------------------------- Letters

// specify the number of each tile

LETTER_COUNT = {
	'a':10, 'b': 2, 'c': 2, 'd': 5, 'e':13, 'f': 2, 'g': 3,
	'h': 3, 'i': 8, 'j': 1, 'k': 1, 'l': 4, 'm': 2, 'n': 6,
	'o': 7, 'p': 2, 'q': 1, 'r': 6, 's': 5, 't': 5, 'u': 4,
	'v': 2, 'w': 2, 'x': 1, 'y': 2, 'z': 1, '*': 2 }

// zero is valid, decimals are rounded up, negative numbers are treated as 0

// specify the point value of each tile

LETTER_POINTS = {
	'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 3, 'g': 2,
	'h': 3, 'i': 1, 'j': 8, 'k': 4, 'l': 2, 'm': 2, 'n': 1,
	'o': 1, 'p': 3, 'q':10, 'r': 1, 's': 1, 't': 1, 'u': 2,
	'v': 4, 'w': 4, 'x': 8, 'y': 3, 'z': 8, '*': '*' }

// if a letter is undefined it is scored as 1
// if a letter has a point value of '*' it is a blank
// zero, decimals and negative numbers are valid

// --------------------------------------- Rack Size

// specify the number of tiles on the player and computer racks

RACK_SIZE = 7;

// zero and negative values will be treated as a 1; decimals are rounded down

// --------------------------------------- Bingo

// using this number of tiles in one turn gets you a bonus
// (this is usually the same as the rack size)

BINGO_LENGTH = 7;

// specify the number of points given as a bonus

BINGO_POINTS = 50;

// if the bingo length is less than the rack size, longer words receive this extra bonus per tile

BINGO_INCREMENT = 0;

// zero, decimals, and negative numbers are valid

// --------------------------------------- Board Size

// specify the size of the board

BOARD_WIDTH = 15;
BOARD_HEIGHT = 15;

// zero and negative values will be treated as a 1; decimals are rounded down
// (the square types defined below should generally match these sizes

// --------------------------------------- Square Layout

// specify the type of every square

// 0 is a regular square
// 1 is a double letter square
// 2 is a triple letter square
// 3 is a double word square
// 4 is a triple word square
// 5 is a start square

SQUARE_TYPES = 
   [[4,0,0,1,0,0,0,4,0,0,0,1,0,0,4],
	[0,1,0,0,0,1,0,0,0,3,0,0,0,1,0],
	[0,0,3,0,0,0,2,0,1,0,0,0,3,0,0],
	[1,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
	[0,0,0,0,3,0,0,1,0,0,3,0,0,0,0],
	[0,3,0,0,0,2,0,0,0,2,0,0,0,1,0],
	[0,0,1,0,0,0,1,0,1,0,0,0,2,0,0],
	[4,0,0,0,1,0,0,5,0,0,1,0,0,0,4],
	[0,0,2,0,0,0,1,0,1,0,0,0,1,0,0],
	[0,1,0,0,0,2,0,0,0,2,0,0,0,3,0],
	[0,0,0,0,3,0,0,1,0,0,3,0,0,0,0],
	[1,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
	[0,0,3,0,0,0,1,0,2,0,0,0,3,0,0],
	[0,1,0,0,0,3,0,0,0,1,0,0,0,1,0],
	[4,0,0,1,0,0,0,4,0,0,0,1,0,0,4]];

// if this grid is not the size specified by the height and width,
// undefined squares are considered regular squares
	
// --------------------------------------- Square Effects

// specify the behavior of the square types

LETTER_MULTIPLIERS [1] = 2;
LETTER_MULTIPLIERS [2] = 3;

WORD_MULTIPLIERS [3] = 2;
WORD_MULTIPLIERS [4] = 3;
WORD_MULTIPLIERS [5] = 2;  // start square is a double word

// zero, decimals, and negative numbers are all valid, though freaky

// specify which type of square is a valid first move

START_SQUARE_TYPE = 5;

// there can be more than one start square

// example 1: change the effect of the start square
// WORD_MULTIPLIERS [5] = 1;     // start square is no longer a double word score square
// LETTER_MULTIPLIERS [5] = 4;   // start square is now a quadruple letter score square

// example 2: create a new tile type
// WORD_MULTIPLIERS [6] = 4;   // 6 is a new a quadruple word score square type
// new square types will be displayed as grey squares with a question mark
// to add visuals for new tile types, modify bonusclassnames in widgets.js and add styles

// --------------------------------------- Definitions

// specify the online dictionary for word lookup

DEFINITION_URL = "https://www.wordreference.com/definition/";

// this can be any online dictionary where the URL has a consistent beginning
// and ends with the word to look up

// an alternative dictionary that will also work is
// DEFINITION_URL = "https://www.merriam-webster.com/dictionary/"
// DEFINITION_URL = "https://www.dictionary.com/browse/"

// --------------------------------------- End