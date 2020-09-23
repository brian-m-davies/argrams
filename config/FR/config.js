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
	
	"Tiles Left": "Tuiles restantes",
	
	"History": "L'histoire (all text is from Google translate -- please help improve it!)",
	
	"Play": "Jouer",
	"Pass": "Passer",
	"Recall": "Rappeler",
	"Swap": "Échanger",
	
	"Argrams": "Erregrammes",
	"Start a new game?": "Commencer un nouveau jeu?",
	"Abandon current game?": "Abandonner le jeu en cours?",
	
	"Settings": "Paramètres",
	"Computer Level": "Niveau ordinateur",
	"Show Legal Words": "Afficher des Mots Juridiques",
	"Show Helper Tools": "Afficher les Outils d'Aide",
	
	"The comuter swaps tiles.": "L'ordinateur échange les tuiles.",
	"The computer passes.": "L'ordinateur passe.",
	
	"Bingo": "Bingo",
	
	"Invalid": "Invalide",
	"You did not place any tiles.": "Vous n'avez posé aucune tuile.",
	"The first word must be placed on the star.": "Le premier mot doit être placé sur l'étoile.",
	"All tiles must be in the same row or column.": "Toutes les tuiles doivent être dans la même ligne ou colonne.",
	" is not connected to other tiles.": " n'est pas connecté à d'autres tuiles.",
	"Words can not include spaces.": "Les mots ne peuvent pas inclure d'espaces.",
	" not found in the dictionary.": " introuvable dans le dictionnaire.",
	
	"Win": "Triompher",
	"Loss": "Perte",
	"Draw": "Match Nul",
	
	"for unplayed tiles": "pour les tuiles non jouées",
	
	"Lookup": "Chercher",
	
	"No moves found.": "Aucun mouvement trouvé.",
	
	"Tiles": "Tuile",
	
	"Could not load dictionary.": "Impossible de charger le dictionnaire."
}

// --------------------------------------- Definitions

DEFINITION_URL = "https://www.wordreference.com/fren/";

// --------------------------------------- Dictionary

LANGUAGE = "FR";

// --------------------------------------- End