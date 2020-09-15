// --------------------------------------- Russian Config
//
// Written by Amnon David
//
// Tile count and values from:
//    http://www.gtoal.com/scrabble/details/russian/
//
// --------------

// --------------------------------------- Tiles

LETTER_COUNT = {
	'о':10, 'а': 8, 'е': 8, 'и': 5, 'н': 5, 'р': 5, 'с': 5,
	'т': 5, 'в': 5, 'д': 4, 'к': 4, 'л': 4, 'п': 4, 'у': 4,
	'м': 3, 'б': 2, 'г': 2, 'ь': 2, 'я': 2, 'ы': 2, 'й': 1,
	'з': 2, 'ж': 1, 'х': 1, 'ц': 1, 'ч': 1, 'ш': 1, 'э': 1,
	'ю': 1, 'ф': 1, 'щ': 1, 'ъ': 1, '*': 2 }

LETTER_POINTS = {
	'о': 1, 'а': 1, 'е': 1, 'и': 1, 'н': 1, 'р': 1, 'с': 1,
	'т': 1, 'в': 1, 'д': 2, 'к': 2, 'л': 2, 'п': 2, 'у': 2,
	'м': 2, 'б': 3, 'г': 3, 'ь': 3, 'я': 3, 'ы': 4, 'й': 4,
	'з': 5, 'ж': 5, 'х': 5, 'ц': 5, 'ч': 5, 'ш': 8, 'э': 8,
	'ю': 8, 'ф':10, 'щ': 10, 'ъ':10, '*': '*' }

// --------------------------------------- Messages

// this is basically non-functional

MESSAGE_DISPLAY = {
	
	"Tiles Left": "Осталось букв",
	
	"History": "Сыгранные слова (please help me translate label text!)",
	
	"Play": "Играть",
	"Pass": "Пас",
	"Recall": "Очистить",
	"Swap": "Обмен",
	
	"Argrams": "Argrams",
	"Start a new game?": "Start a new game?",
	"Abandon current game?": "Abandon current game?",
	
	"Settings": "Settings",
	"Computer Level": "Играть на уровне",
	"Show Legal Words": "Show Legal Words",
	"Show Helper Tools": "Show Helper Tools",
	
	"The comuter swaps tiles.": "The comuter swaps tiles.",
	"The computer passes.": "У меня нет ходов, ваша  очередь",
	
	"Bingo": "Bingo",
	
	"Invalid": "Извините",
	"You did not place any tiles.": "вы не сделали ход.",
	"The first word must be placed on the star.": "Первое слово должно быть на звезде.",
	"All tiles must be in the same row or column.": "распложите слова по горизонтали или по вертикали.",
	" is not connected to other tiles.": " не подключен к слову.",
	"Words can not include spaces.": "пробелов в слове.",
	" not found in the dictionary.": " отсутствует в словаре.",
	
	"Win": "Вы выиграли",
	"Loss": "Компьютер выигрывает",
	"Draw": "Это ничья",
	
	"for unplayed tiles": "for unplayed tiles",
	
	"Lookup": "Lookup",
	
	"No moves found.": "???",
	
	"Tiles": "????",
	
	"Could not load dictionary.": "Could not load dictionary."
}

/*
var MESSAGE_DISPLAY = {

  "Not enough tiles remaining to swap.":
  "К сожалению у вас не осталось букв для обмена",

  "After deducting points of unplaced tiles, score is:":
  "Ваш балл после вычета оставшихся букв" ,

  "  Computer:":
  " компьютер:",

  "Computer thinking, please wait ...":
  "Компьютер думает, подождите пожалуйста ...",

  "OK":
  "Ладно",

  "CPU:":
  "Общий балл компьютера:",

  "You:":
  "Ваш общий балл:",

  "Peek":
  "Показать расклад компьютера",

  "Hide":
  "Скрыть расклад компьютера",
};

*/

// --------------------------------------- Definitions

DEFINITION_URL = "https://www.wordreference.com/enru/";

// --------------------------------------- Dictionary

LANGUAGE = "RU";

// --------------------------------------- End