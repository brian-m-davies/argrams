// --------------------------------------- Spanish Config
//
// Written by Brian Davies & Amnon David
//
// Tile count and values from:
//    http://www.gtoal.com/scrabble/details/spanish/
//
// Spanish consulta y traducción con Roberto Fernandez Mata 
//
// --------------

// --------------------------------------- Tiles

/*
The number of letters in the Spanish alphabet is not as clear cut as it is in English -- n and ñ are different letters, so años and anos are (very) different words, but í is an accent, so colibrí and colibri are the same word, just the latter is written incorrectly.  Though many Spanish people are taught not to use accents on capital letters, and since tiles are capital letters, games like this can get away with eliminating accents.  Old Spanish had CH, LL, RR as individual letters in the alphabet.  The last of these were officially deprecated in 2010, but they are still included as tiles.  Those tiles are simply both letters, so both [L][L][A][M][A] and [LL][A][M][A] are legal.

Rather than make the code handle digraphs (which would severely complicate move generation and validation), this game uses different single characters to represent those tiles.  The code is case-sensitive, so C has been selected to mean 'ch', L to mean 'll', and R to mean 'rr'.  To support all the ways a word could be produced, the dictionary file includes multiple versions of words.  For example it includes both 'llama' and 'Lama'.  The LETTER_DISPLAY parameter maps the single character that the engine requires back to the digraph for display to the user.
*/

LETTER_COUNT = {
	'a':12, 'b': 2, 'c': 4, 'C': 1, 'd': 5, 'e':12, 'f': 1, 'g': 2,
	'h': 2, 'i': 6, 'j': 1, 'l': 4, 'L': 1, 'm': 2, 'n': 5, 'ñ': 1,
	'o': 9, 'p': 2, 'q': 1, 'r': 5, 'R': 1, 's': 6, 't': 4, 'u': 5,
	'v': 1, 'x': 1, 'y': 1, 'z': 1, '*': 2 }

LETTER_POINTS = {
	'a': 1, 'b': 3, 'c': 3, 'C': 5, 'd': 2, 'e': 1, 'f': 4, 'g': 2,
	'h': 4, 'i': 1, 'j': 8, 'l': 1, 'L': 8, 'm': 3, 'n': 1, 'ñ': 8,
	'o': 1, 'p': 3, 'q': 5, 'r': 1, 'R': 8, 's': 1, 't': 1, 'u': 1,
	'v': 4, 'x': 8, 'y': 4, 'z':10, '*': '*' }

// this is only necessary in configurations where one tile can represent multiple letters

LETTER_DISPLAY = { 'C': 'ch', 'L': 'll', 'R': 'rr' }

// --------------------------------------- Messages

// this needs help

MESSAGE_DISPLAY = {
	
	"Tiles Left": "Fichas restantes",
	
	"History": "Palabras usadas",
	
	"Play": "Jugar",
	"Pass": "Pasar",
	"Recall": "Limplar",
	"Swap": "Cambiar",
	
	"Argrams": "Eregramas",
	"Start a new game?": "Comenzar juego nuevo?",
	"Abandon current game?": "Abandonar el juego actual?",
	
	"Settings": "Configuracion",
	"Computer Level": "Jugar en el nivel",
	"Show Legal Words": "Mostrar Palabras Validas",
	"Show Helper Tools": "Hacer Trampa",
	
	"The comuter swaps tiles.": "La computadora cambio de fichas.",  // It's El ordenador in European Spanish -- maybe "Cambiem mis fichas." is better?
	"The computer passes.": "La computadora paso.",
	
	"Bingo": "Bingo",
	
	"Invalid": "Invalido",
	"You did not place any tiles.": "No colocaste ninguna ficha.",
	"The first word must be placed on the star.": "La primera palabra debe estar en la estrella.",
	"All tiles must be in the same row or column.": "La palabra tiene que ser horizontal o vertical.",
	" is not connected to other tiles.": " no está conectado a una palabra existente.",
	"Words can not include spaces.": "La palabra no puede contener espacios en blanco.",
	" not found in the dictionary.": " no se encontro en el diccionario.",
	
	"Win": "Ganaste",
	"Loss": "Perdido",
	"Draw": "Empate",
	
	"for unplayed tiles": "por fichas no usadas",
	
	"Lookup": "Buscar",
	
	"No moves found.": "No se encontraron jugadas.",
	
	"Tiles": "Fichas",
	
	"Could not load dictionary.": "No se puede cargar el diccionario."
}

// --------------------------------------- Definitions

DEFINITION_URL = "https://www.wordreference.com/definicion/";

// --------------------------------------- Dictionary

LANGUAGE = "ES";

// --------------------------------------- End