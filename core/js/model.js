// --------------------------------------- Model
//
// Written by Amnon David & Brian Davies
//
// This is based on the original by Amnon David available here:
//   http://amnond.github.io/jscrab/
//
// letter point values are informed by https://deadspin.com/h-y-and-z-are-your-money-letters-how-to-beat-scrabbl-5975490
// move selection bonuses informed by https://blog.moneysavingexpert.com/2014/07/how-much-is-a-blank-worth-at-scrabble/
//
// --------------

// --------------------------------------- Model

var LETTER_MULTIPLIERS = [1,2,3,1,1,1];
var WORD_MULTIPLIERS = [1,1,1,2,3,2];

function GAME_MODEL ()
{
	// Game Configuration
	
	this.config = {
		
		language: window ["LANGUAGE"] || "EN",
		
		boardx: isNaN (parseInt (window ["BOARD_WIDTH"])) ? 15 : Math.max (1, parseInt (window ["BOARD_WIDTH"])),
		
		boardy: isNaN (parseInt (window ["BOARD_HEIGHT"])) ? 15 : Math.max (1, parseInt (window ["BOARD_HEIGHT"])),
		
		racksize: parseInt (window ["RACK_SIZE"]) || 7,
		
		lettercount: window ["LETTER_COUNT"] || { 'a':10, 'b': 2, 'c': 2, 'd': 5, 'e':13, 'f': 2, 'g': 3, 'h': 3, 'i': 8, 'j': 1, 'k': 1, 'l': 4, 'm': 2, 'n': 6, 'o': 7, 'p': 2, 'q': 1, 'r': 6, 's': 5, 't': 5, 'u': 4, 'v': 2, 'w': 2, 'x': 1, 'y': 2, 'z': 1, '*': 2 },
		
		letterpoints: window ["LETTER_POINTS"] || { 'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 3, 'g': 2, 'h': 3, 'i': 1, 'j': 8, 'k': 4, 'l': 2, 'm': 2, 'n': 1, 'o': 1, 'p': 3, 'q':10, 'r': 1, 's': 1, 't': 1, 'u': 2, 'v': 4, 'w': 4, 'x': 8, 'y': 3, 'z': 8, '*': '*' },
		
		bingolength: isNaN (parseFloat (window ["BINGO_LENGTH"])) ? 7 : parseFloat (window ["BINGO_LENGTH"]),
		
		bingopoints: isNaN (parseFloat (window ["BINGO_POINTS"])) ? 50 : parseFloat (window ["BINGO_POINTS"]),
		
		bingoincrement: isNaN (parseFloat (window ["BINGO_INCREMENT"])) ? 0 : parseFloat (window ["BINGO_INCREMENT"]),
		
		lettermultipliers: window ["LETTER_MULTIPLIERS"] || [1,2,3,1,1,1],
		
		wordmultipliers: window ["WORD_MULTIPLIERS"] || [1,1,1,2,3,2],
		
		startsquaretype: isNaN (parseInt (window ["START_SQUARE_TYPE"])) ? 5 : parseInt (window ["START_SQUARE_TYPE"]),
		
		squaretypes: window ["SQUARE_TYPES"] || 
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
			[4,0,0,1,0,0,0,4,0,0,0,1,0,0,4]],
		
		dictionary: window ["DICTIONARY"],
		
		definitionurl: window ["DEFINITION_URL"] || "https://www.merriam-webster.com/dictionary/",
		
		computerlevel: parseInt (window ["COMPUTER_LEVEL"]) || 3
	}
	
	// Game Data
	
	this.data = {
		
		status: 0,
		boardletters: null,
		boardpoints: null,
		tilebag: [],
		playerrack: "",
		computerrack: "",
		playerscore: 0,
		computerscore: 0,
		history: [],
		passes: 0,
		computerswaps: 0
	}
	
	
	// Status
	
	this.setgamenew = function ()
	{
		this.data.status = 0;
	}
	
	this.setgamestarted = function ()
	{
		this.data.status = 1;
	}
	
	this.setgamefinished = function ()
	{
		this.data.status = 2;
	}
	
	
	// Board
	
	this.initializeboard = function ()
	{
		this.data.boardletters = [];
		this.data.boardpoints = [];
		
		for (var i = 0; i < this.config.boardx; i ++)
		{
			this.data.boardletters [i] = [];
			this.data.boardpoints [i] = [];
			
			for (var j = 0; j < this.config.boardy; j ++)
			{
				this.data.boardletters [i][j] = "";
				this.data.boardpoints [i][j] = "";
			}
		}
	}
	
	this.commitplacements = function (placements)
	{
		for (var i in placements)
		{
			var placement = placements [i];
			
			this.data.boardletters [placement.x] [placement.y] = placement.letter;
			this.data.boardpoints [placement.x] [placement.y] = placement.points;
		}
	}
	
	
	// Tilebag
	
	this.initializetilebag = function ()
	{
		this.data.tilebag = [];
		
		for (var letter in this.config.lettercount)
		{	
			for (var i = 0; i < this.config.lettercount [letter]; i ++)
				this.data.tilebag.push (letter);
		}
		
		this.shuffletiles ();
		
		view.setdata (this.data);
	}
	
	this.drawtiles = function (existing)
	{
		if (existing == undefined)
			existing = "";
		
		var needed = Math.min (this.config.racksize - existing.replace (/\./g, '').length, this.data.tilebag.length);
		
		var letters = this.data.tilebag.slice (0, needed).join ("");
		
		this.data.tilebag.splice (0, needed);
		
		view.setdata (this.data);
		
		if (existing)
		{
			for (var i = 0; i < letters.length; i ++)
			{
				existing = existing.replace ('.', letters.charAt (i));
			}
			
			return existing;
		}
		else
		{
			return letters;
		}
	}
	
	this.returntiles = function (swap)
	{
		for (var i = 0; i < swap.length; i ++)
			this.data.tilebag.push (swap.charAt (i));
		
		this.shuffletiles ();
		
		view.setdata (this.data);
	}
	
	this.shuffletiles = function ()
	{
		this.data.tilebag = this.shuffle (this.data.tilebag);
	}
	
	
	// Racks
	
	this.setplayerrack = function (rack)
	{	
		this.data.playerrack = rack;
		
		view.setdata (this.data);
	}
	
	this.setcomputerrack = function (rack)
	{
		this.data.computerrack = rack;
		
		view.setdata (this.data);
	}
	
	/*
	this.removefromplayerrack = function (letters)
	{
		for (var i = 0; i < letters.length; i ++)
			this.data.playerrack = this.data.playerrack.replace (letters [i], '.');
		
		view.setdata (this.data);
	}
	*/
	
	this.removefromcomputerrack = function (letters)
	{
		for (var i = 0; i < letters.length; i ++)
			this.data.computerrack = this.data.computerrack.replace (letters [i], '.');
		
		view.setdata (this.data);
	}
	
	this.getplayertiles = function ()
	{
		return this.data.playerrack.replace (/\./g, '')
	}
	
	this.getcomputertiles = function ()
	{
		return this.data.computerrack.replace (/\./g, '')
	}
	
	
	// Score
	
	this.addplayerscore = function (score)
	{
		this.data.playerscore += score;
		
		view.setdata (this.data);
	}
	
	this.setplayerscore = function (score)
	{
		this.data.playerscore = score;
		
		view.setdata (this.data);
	}
	
	this.addcomputerscore = function (score)
	{
		this.data.computerscore += score;
		
		view.setdata (this.data);
	}
	
	this.setcomputerscore = function (score)
	{
		this.data.computerscore = score;
		
		view.setdata (this.data);
	}
	
	
	// History
	
	this.addtohistory = function (player, action, words, score, bingo)
	{
		this.data.history.push ({ player: player, action: action, words: words, score: score, bingo: bingo });
		
		view.setdata (this.data);
	}
	
	this.clearhistory = function ()
	{
		this.data.history = [];
		
		view.setdata (this.data);
	}
	
	
	// Passes
	
	this.incrementpasses = function ()
	{
		this.data.passes ++;
	}
	
	this.resetpasses = function ()
	{
		this.data.passes = 0;
	}
	
	
	// Computer Swaps
	
	this.incrementcomputerswaps = function ()
	{
		this.data.computerswaps ++;
	}
	
	this.resetcomputerswaps = function ()
	{
		this.data.computerswaps = 0;
	}
	
	
	// Config
	
	this.setcomputerlevel = function (level)
	{
		if (level >= 1 && level <= 5)
		{
			this.config.computerlevel = level;
			
			view.setcomputerlevel (level);
		}
	}
	
	this.getletterpoints = function (letter)
	{
		var value = this.config.letterpoints [letter];
		
		return ((value == undefined) ? 1 : value);
	}
	
	this.getwordmultiplier = function (squaretype)
	{
		var value = this.config.wordmultipliers [squaretype];
		
		return (isNaN (parseFloat (value)) ? 1 : parseFloat (value));
	}
	
	this.getlettermultiplier = function (squaretype)
	{
		var value = this.config.lettermultipliers [squaretype];
		
		return (isNaN (parseFloat (value)) ? 1 : parseFloat (value));
	}
	
	
	// Player Events
	
	this.onplayerswap = function (swap, keep)
	{
		if (swap.length !== 0)
		{
			view.placementstorack ();
			
			this.addtohistory ("player", "swap", null, 0, false);
			
			this.returntiles (swap);
			
			this.setplayerrack (this.drawtiles (keep));
			
			this.resetpasses ();
			
			view.setbusy (true);
			
			setTimeout ( function () { model.takecomputerturn.call (model); }, 300);
		}
	}
	
	this.onplayerpass = function ()
	{
		view.placementstorack ();
		
		this.addtohistory ("player", "pass", null, 0, false);
		
		this.incrementpasses ();
		
		if (this.data.passes >= 2)
		{
			this.ongameover ();
		}
		else
		{
			view.setbusy (true);
			
			setTimeout ( function () { model.takecomputerturn.call (model); }, 300);
		}
	}

	this.onplayerplay = function (placements, rackorder)
	{
		var move = this.createplayermove (placements);
		
		if (move.error)
		{
			view.onplayerinvalidplay (move.error);
		}
		else if (move.unknown)
		{
			view.onplayerinvalidword (move.unknown);
		}
		else
		{
			this.setplayerrack (rackorder);
			
			this.commitplacements (move.placements);
			this.setgamestarted ();
			this.resetpasses ();
			
			view.onplayerplay ();
			
			this.addtohistory ("player", "play", move.allwords, move.score, move.bingo);
			
			this.addplayerscore (move.score);
			
			if (move.bingo)
				view.onplayerbingo (move);
			
			this.setplayerrack (this.drawtiles (this.data.playerrack));
			
			if (this.getplayertiles ().length == 0)
			{
				this.ongameover ();
			}
			else
			{
				view.setbusy (true);
				
				setTimeout ( function () { model.takecomputerturn.call (model); }, 300);
			}
		}
	}
	
	this.createplayermove = function (placements)   // NEEDS CLEANUP
	{
		if (placements.length === 0)
		{
			return { error: localize ("You did not place any tiles.") };
		}
		
		var invalidwords = [];
		
		var lettersused = "";
		var minx = placements [0].x;
		var miny = placements [0].y;
		var maxx = minx;
		var maxy = miny;
		
		var startsquares = this.findstartsquares ();
		
		var onstartsquare = false;
	
		for (var i = 0; i < placements.length; i ++)
		{
			var placement = placements [i];
			
			lettersused += (placement.blank) ? placement.blank : placement.letter;
			
			minx = Math.min (minx, placement.x);
			maxx = Math.max (maxx, placement.x);
			miny = Math.min (miny, placement.y);
			maxy = Math.max (maxy, placement.y);
			
			if (startsquares.length)
			{
				var square = startsquares.find (function (square) { return placement.x == square.x && placement.y == square.y; });
				
				if (square)
					onstartsquare = true;
			}
		}
		
		if (this.data.status == 0 && startsquares.length && ! onstartsquare)
		{
			return { error: localize ("The first word must be placed on the star.") };
		}
		
		var horizontal = (minx < maxx);
		var vertical = (miny < maxy);
	
		if (horizontal && vertical)
		{
			return { error: localize ("All tiles must be in the same row or column.") };
		}
		else if (! horizontal && ! vertical)  // only one letter was placed
		{
			if ((minx > 0 && this.data.boardletters [minx - 1][miny] !== "")
				|| (minx < this.config.boardx - 1 && this.data.boardletters [minx + 1][miny] !== ""))
			{
				horizontal = true;
			}
			else if ((miny > 0 && this.data.boardletters [minx][miny-1] !== "")
				|| (miny < this.config.boardy - 1 && this.data.boardletters [minx][miny+1] !== ""))
			{
				vertical = true;
			}
			else
			{
				return { error: localizetiles (lettersused) + localize (" is not connected to other tiles.") };
			}
		}
		
		var dx = horizontal ? 1 : 0;
		var dy = horizontal ? 0 : 1;
		
		var word = "";
		var wordmult = 1;
		var wordscore = 0; // word score
		var oscore = 0; // score from orthogonal created words
		var allwords = []; // array of orthogonal words created
		
		// walk back to word start
		
		var x = minx - dx;
		var y = miny - dy;
		
		while ((x >= 0) && (y >= 0) && (this.data.boardletters [x][y] !== ""))
		{
			x -= dx;
			y -= dy;
		}
		
		var startx = x + dx;
		var starty = y + dy;
		
		// walk forward to word end
		
		var letter = true;
		
		while (letter)
		{
			x += dx;
			y += dy;
			
			if (x < this.config.boardx && y < this.config.boardy)
				letter = this.data.boardletters [x][y];
			else
				letter = false;
			
			var placement = placements.find (function (placement) { return placement.x == x && placement.y == y; });
			
			if (placement)  // new player tile
			{
				letter = placement.letter;
				var points  = placement.points;
			
				word += letter;
				
				var squaretype = this.config.squaretypes [y][x];
				
				wordmult *= this.getwordmultiplier (squaretype);
				lettermult = this.getlettermultiplier (squaretype);
				
				wordscore += (points * lettermult);
				
				var orthinfo = this.getorthogonal (letter, points, x, y, dx, dy);
				
				if (orthinfo.error)
				{
					invalidwords.push (localizetiles (orthinfo.word));
				}
				else if (orthinfo.score > 0)
				{
					oscore += orthinfo.score;
					allwords.push (orthinfo.word);
				}
			}
			else if (letter)  // existing tile on board
			{
				word += letter;
				wordscore += this.data.boardpoints [x][y];
			}
			else
			{
				letter = null;
				
				if (x >= minx && x<= maxx && y >= miny && y <= maxy)
					return { error: localize ("Words can not include spaces.") };
			}
		}
		
		allwords.unshift (word);
	
		if (! (word in this.config.dictionary))
		{
			invalidwords.push (localizetiles (word));
		}
		
		if (invalidwords.length > 0)
		{
			return { unknown: invalidwords.join (', ') + localize (" not found in the dictionary.") };
		}
		
		if ((this.data.status != 0) && (oscore == 0) && (word.length == placements.length))
		{
			return { error: localizetiles (word) + localize (" is not connected to other tiles.") };
		}
		
		var score = wordscore * wordmult + oscore;
		
		var bingo = false;
		
		if (lettersused.length >= this.config.bingolength)
		{
			var overage = lettersused.length - this.config.bingolength;
			score += this.config.bingopoints + (this.config.bingoincrement * overage);
			bingo = true;
		}
		
		return { word: word, allwords: allwords, x: startx, y: starty,
				lettersused: lettersused, score: score, placements: placements, horizontal: horizontal, bingo: bingo };
	}
	
	this.getorthogonal = function (letter, points, x, y, dx, dy)
	{
		var wordmult = 1;
	
		var wordscore = 0;
		var wx = x;
		var wy = y;
	
		var squaretype = this.config.squaretypes [wy][wx];
		
		wordmult *= this.getwordmultiplier (squaretype);
		points *= this.getlettermultiplier (squaretype);
		
		// temporarily place letter
		
		this.data.boardletters [wx][wy] = letter;
		this.data.boardpoints [wx][wy] = points;
		
		while (x >= 0 && y >= 0 && this.data.boardletters [x][y] !== "")
		{
			x -= dy;
			y -= dx;
		}
		if (x < 0 || y < 0 || this.data.boardletters [x][y] === "")
		{
			x += dy;
			y += dx;
		}
		
		var orthword = "";
		
		while (x < this.config.boardx && y < this.config.boardy && this.data.boardletters [x][y]!=="")
		{
			var letter = this.data.boardletters [x][y];
			wordscore += this.data.boardpoints [x][y];
			orthword += letter;
			
			x += dy;
			y += dx;
		}
		
		// remove temporay letter
		
		this.data.boardletters [wx][wy] = "";
		this.data.boardpoints [wx][wy] = "";
		
		if (orthword.length == 1)  // the letter does not form an orthogonal word.
		{
			return {score: 0, word: orthword };
		}
		else if (! (orthword in this.config.dictionary))  // the letter forms an invalid word
		{
			return { error: true, word: orthword };
		}
		else
		{
			wordscore *= wordmult;
		
			return { score: wordscore, word: orthword };
		}
	}
	
	
	// Computer Player

	this.takecomputerturn = function ()
	{
		var move = this.selectmove (this.findmoves (this.getcomputertiles ()));
		
		if (move)
		{
			this.oncomputerplay (move);
		}
		else
		{
			view.setbusy (false);
			
			if (this.data.tilebag.length >= 7 && this.data.computerswaps < 2)
			{
				this.oncomputerswap (this.getcomputertiles (), "");
			}
			else
			{
				this.oncomputerpass ();
			}
		}
	}
	
	this.findmoves = function (rack)
	{
		if (this.data.status == 0)
		{
			return this.findfirstmoves (rack);
		}
		else
		{
			var moves = [];
		
			for (var x = 0; x < this.config.boardx; x ++)
			{
				for (var y = 0; y < this.config.boardy; y ++)
				{
					if (this.data.boardletters [x][y] == "")
					{
						for (var z = 0; z < 2; z ++)
						{
							var horizontal = (z == 0);
							
							var newmoves = this.findmovesatxy (x, y, rack, horizontal);
							
							moves = moves.concat (newmoves);
						}
					}
				}
			}
			
			return moves;
		}
	}
	
	this.findfirstmoves = function (rack)
	{
		var startsquares = this.findstartsquares ();
		
		if (! startsquares.length)  // if config has no star, pick a random square
		{
			var startsquare = { };
			
			startsquare.x = Math.floor (Math.random () * this.config.boardx);
			startsquare.y = Math.floor (Math.random () * this.config.boardy);
		}
		else
		{
			var startsquare = startsquares [Math.floor (Math.random () * startsquares.length)];
		}
		
		var moves = [];
		
		for (var i = 0; i < rack.length; i ++)
		{
			// simulate a letter already on the start square
			
			var anchorletter = rack.charAt (i);
			
			if (this.getletterpoints (anchorletter) != '*')
			{
				this.data.boardletters [startsquare.x][startsquare.y] = anchorletter;
				this.data.boardpoints [startsquare.x][startsquare.y] = this.getletterpoints (anchorletter);
				
				// find moves assuming that anchor
				
				var rackwithoutanchor = rack.replace (anchorletter, '');
				
				for (var x = 0; x <= Math.min (startsquare.x + 1, this.config.boardx - 1); x ++)
				{
					var newmoves = this.findmovesatxy (x, startsquare.y, rackwithoutanchor, true);  // only horizontal
					
					for (var j in newmoves)
					{
						// patch the anchor letter into the move object
						
						var currentmove = newmoves [j];
						
						var anchorindex = (startsquare.x - currentmove.x);
						
						var anchorletter = currentmove.word.charAt (anchorindex);
						var anchorpoints = this.getletterpoints (anchorletter);
						
						currentmove.placements.splice (anchorindex, 0,
							{ letter: anchorletter, points: anchorpoints, x: startsquare.x, y: startsquare.y });
						
						var squaretype = this.config.squaretypes [startsquare.y][startsquare.x];
						
						var wordmult = this.getwordmultiplier (squaretype);
						var lettermult = this.getlettermultiplier (squaretype);
						
						if (currentmove.bingo)
						{
							var overage = currentmove.lettersused.length - this.config.bingolength;
							currentmove.score -= this.config.bingopoints + (this.config.bingoincrement * overage)
							currentmove.bingo = false;
						}
						
						currentmove.lettersused += anchorletter;
						
						currentmove.score = currentmove.score - anchorpoints + (lettermult * anchorpoints)
						currentmove.score = currentmove.score * wordmult;
						
						if (currentmove.lettersused.length >= this.config.bingolength)
						{
							var overage = currentmove.lettersused.length - this.config.bingolength;
							currentmove.score += this.config.bingopoints + (this.config.bingoincrement * overage);
							currentmove.bingo = true;
						}
					}
					
					moves = moves.concat (newmoves);
				}
				
				// remove simulated letter
			
				this.data.boardletters [startsquare.x][startsquare.y] = "";
				this.data.boardpoints [startsquare.x][startsquare.y] = "";
			}
		}
		
		return moves;
	}
	
	this.findmovesatxy = function (x, y, rack, horizontal)   // NEEDS CLEANUP
	{
		var moves = [];
		
		var regex = getRegex (x, y, rack, horizontal, this.blankletterrange);
		
		if ((regex !== null) && (regex.max <= this.dictionarystring.length))
		{	
			var regexp = new RegExp (regex.rgx, "g");
			
			var match = null;
			var matches = null;
			var requiredletters = null;
			var word = null;
			
			for (var wordlettercount = regex.min - 2; wordlettercount < regex.max - 1; wordlettercount ++)
			{
				var id = regex.rgx + wordlettercount;
				
				if (id in this.regexmatchcache)
				{
					matches = this.regexmatchcache [id];
				}
				else
				{
					matches = [];
					
					while ((match = regexp.exec (this.dictionarystring [wordlettercount])) !== null)
					{
						// go over all matching regex groups for this word
						// (this.dictionarystring[wordlettercount]), and save the required letters
						requiredletters = "";
						
						for (i = 1; i < match.length; i ++)
						{
							if (match [i]) // ignore the groups with 'undefined'
								requiredletters += match [i];
						}
						// save the word and the missing letters
						var mseq = match [0];
						// remove the marker symbols for the regex match
						word = mseq.substr (1, mseq.length - 2);
						
						matches.push ({word: word, reqs: requiredletters});
					}
					
					this.regexmatchcache [id] = matches;
				}
		
				for (var j = 0; j < matches.length; j ++)
				{
					// we have a word that matches the required regular expression
					// check if we have matching letters for the sequence of missing
					// letters found in the regular expression for this word
					
					var pointsarray = [];
		
					var requiredletters = matches [j].reqs;
					var lettersused = "";
					var unusedletters = rack;
					
					var possible = true;
					
					for (i = 0; i < requiredletters.length; i ++)
					{
						var letter = requiredletters.charAt (i);
						
						if (unusedletters.indexOf (letter) != -1)
						{
							unusedletters = unusedletters.replace (letter, '.');
							lettersused += letter;
							
							pointsarray.push (this.getletterpoints (letter));
						}
						else if (unusedletters.split ('').find (function (letter) { return model.getletterpoints (letter) == '*' }))  // use a blank -- this is hugely inefficient
						{
							var blank = unusedletters.split ('').find (function (letter) { return model.getletterpoints (letter) == '*' })
							
							unusedletters = unusedletters.replace (blank, '.');
							lettersused += blank;
							
							pointsarray.push (0);
						}
						else
						{
							possible = false;
							break;
						}
					}
					
					if (possible)  // rack includes the letters to create this word
					{
						var startx = regex.horizontal ? regex.ps : x;
						var starty = regex.horizontal ? y : regex.ps;
						
						var move = this.createcomputermove (matches [j].word, lettersused, pointsarray, regex.horizontal, startx, starty);
						
						if (! move.error)
							moves.push (move);
					}
				}
			}
		}
		
		return moves;
	}
	
	this.createcomputermove = function (word, lettersused, pointsarray, horizontal, startx, starty)   // NEEDS CLEANUP
	{	
		var x = startx;
		var y = starty;
		
		var dx = horizontal ? 1 : 0;
		var dy = horizontal ? 0 : 1;
		
		var wordmult = 1;
		var wordscore = 0;  // word score
		var oscore = 0;  // orthogonal created words score
		var allwords = []; // list of valid orthogonal words created with this move
		
		allwords.push (word);
		
		var placements = [];
		
		var unusedletters = lettersused;
		
		var seqcount = 0;
		
		for (var i = 0; i < word.length; i ++)
		{
			var letter = word.charAt (i);
			
			if (this.data.boardletters [x][y] === "")
			{
				var points = pointsarray [seqcount];
				
				var placement = { letter: letter, points: points, x: x, y: y };
				
				if (unusedletters.indexOf (letter) != -1)
				{
					unusedletters = unusedletters.replace (letter, '.');
				}
				else
				{
					var blank = unusedletters.split ('').find (function (letter) { return model.getletterpoints (letter) == '*' })
					
					unusedletters = unusedletters.replace (blank, '.');
					placement.blank = blank;
				}
				
				placements.push (placement);
				
				var squaretype = this.config.squaretypes [y][x];
				
				wordmult *= this.getwordmultiplier (squaretype);
				lettermult = this.getlettermultiplier (squaretype);
				
				wordscore += (points * lettermult);
				
				var orthinfo = this.getorthogonal (letter, points, x, y, dx, dy);
				
				if (orthinfo.error)
				{
					return { error: true };
				}
				else if (orthinfo.score > 0)
				{
					oscore += orthinfo.score;
					allwords.push (orthinfo.word);
				}
					
				seqcount ++;
			}
			else  // existing tile on board
			{
				wordscore += this.data.boardpoints [x][y];
			}
			
			x += dx;
			y += dy;
		}
		
		var score = wordscore * wordmult + oscore;
		
		var bingo = false;
		
		if (lettersused.length >= this.config.bingolength)
		{
			var overage = lettersused.length - this.config.bingolength;
			score += this.config.bingopoints + (this.config.bingoincrement * overage);
			bingo = true;
		}
		
		return { word: word, allwords: allwords, x: startx, y: starty,
				lettersused: lettersused, score: score, placements: placements, horizontal: horizontal, bingo: bingo };
	}
	
	this.selectmove = function (moves)   // NEEDS CLEANUP
	{
		var totalmovecount = moves.length;
		
		var level = this.config.computerlevel;
		var language = this.config.language;
		
		moves = this.filtermovesbylevel (moves, level);
		
		// console.log ("vocabulary level cuts " + totalmovecount + " options to " + moves.length)
		
		if (moves.length > 0)
		{
			if (this.data.tilebag.length > this.config.racksize)
			{
				var records = moves.map (function (move)
				{
					var bonus = 0;
					
					if (language == "EN")
					{
						var _count = move.lettersused.split ('*').length - 1;
						var scount = move.lettersused.split ('s').length - 1;
						var ecount = move.lettersused.split ('e').length - 1;
						var xcount = move.lettersused.split ('x').length - 1;
						
						var wcount = move.lettersused.split ('w').length - 1;
						var ucount = move.lettersused.split ('u').length - 1;
						var vcount = move.lettersused.split ('v').length - 1;
						var qcount = move.lettersused.split ('q').length - 1;
						
						bonus -= level * ((5 * _count) + (2 * scount) + (.5 * ecount) + (.5 * xcount));
						bonus += level * ((.5 * wcount) + (.5 * ucount) + (.5 * vcount) + (2 * qcount));
					}
					
					var ontl = (move.placements.some (function (placement)
					{
						return model.config.squaretypes [placement.y][placement.x] == 4;
					}));
					
					if (ontl)
					{
						bonus += (level * 2);
					}
					
					var ondl = (move.placements.some (function (placement)
					{
						return model.config.squaretypes [placement.y][placement.x] == 3;
					}));
					
					if (ondl)
					{
						bonus += (level * .5);
					}
					
					return { value: move.score + bonus, move: move };
				});
				
				records = records.sort (function (record1, record2) { return record1.value < record2.value });
				
				var movestoconsider = 11 - (level * 2);
				
				records = records.slice (0, movestoconsider);
				
				/*
				records.forEach (function (record)
				{
					console.log (record.value + " " + record.move.score + " " + record.move.word + " " + record.move.lettersused + " " + record.move.x + " " + record.move.y);
				})
				*/
				
				moves = records.map (function (record) { return record.move });
				
				return this.selectrandommove (moves);
			}
			else
			{
				return this.selectbestmove (moves);
			}
		}
		else
		{
			return null;
		}
	}
	
	this.filtermovesbylevel = function (moves, level)
	{
		return moves.filter (function (move)
		{
			var levels = move.allwords.map (function (word) { return model.config.dictionary [word]; });
			
			var maxlevel = Math.max.apply (null, levels);
			
			return (maxlevel <= level);  // cap parallel plays?   && move.allwords.length <= level
		});
	}
	
	this.selectbestmove = function (moves)
	{
		var bestmove = null;
		
		if (moves.length)
		{
			bestmove = moves.reduce (function (one, two) { return (one.score > two.score) ? one : two });
		}
		
		return bestmove;
	}
	
	this.selectrandommove = function (moves)
	{
		var randommove = null;
		
		if (moves.length)
		{
			var randomindex = Math.floor (Math.random () * moves.length)
			
			randommove = moves [randomindex];
		}
		
		return randommove;
	}
	
	this.oncomputerplay = function (move)
	{
		var animationcallback = function ()
		{
			view.setbusy (false);
			
			model.addtohistory ("computer", "play", move.allwords, move.score, move.bingo);
			
			model.addcomputerscore (move.score);
			
			model.removefromcomputerrack (move.lettersused);
			model.setcomputerrack (model.drawtiles (model.data.computerrack));
			
			if (model.getcomputertiles ().length == 0)
			{
				model.ongameover ();
			}
		};
		
		
		this.commitplacements (move.placements);
		this.setgamestarted ();
		this.resetpasses ();
		this.resetcomputerswaps ();
		
		view.oncomputerplay (move.placements, animationcallback);
	}
	
	this.oncomputerswap = function (swap, rack)
	{
		this.returntiles (swap);
		
		this.setcomputerrack (this.drawtiles (rack));
		
		this.resetpasses ();
		this.incrementcomputerswaps ();
		
		this.addtohistory ("computer", "swap", null, 0, false);
		view.oncomputerswap ();
	}
	
	this.oncomputerpass = function ()
	{
		this.resetcomputerswaps ();
		this.incrementpasses ();
	
		if (this.data.passes >= 2)
		{
			this.ongameover ();
		}
		else
		{
			this.addtohistory ("computer", "pass", null, 0, false);
			view.oncomputerpass ();
		}
	}
	
	
	// Events
	
	this.ongameover = function ()
	{
		var computerdeductions = 0;
		
		for (var i = 0; i < this.getcomputertiles ().length; i ++)
			computerdeductions += this.getletterpoints (this.getcomputertiles ().charAt (i));
		
		this.addcomputerscore (0 - computerdeductions);
		
		var playerdeductions = 0;
		
		for (i = 0; i < this.getplayertiles ().length; i ++)
			playerdeductions += this.getletterpoints (this.getplayertiles ().charAt (i));
		
		this.addplayerscore (0 - playerdeductions);  // should deductions be displayed in the history?
		
		view.ongameover (computerdeductions, playerdeductions);
		
		this.setgamefinished ();
	}
	
	
	// Start Square
	
	this.findstartsquares = function ()
	{
		var startsquares = [];
		
		for (x = 0; x < this.config.boardx; x ++)
		{
			for (y = 0; y < this.config.boardy; y ++)
			{
				if (this.config.squaretypes [y][x] == this.config.startsquaretype)
					startsquares.push ({ x: x, y: y });
			}
		}
		
		return startsquares;
	}
	
	
	// Utilities
	
	this.shuffle = function (array)
	{
		for (var i = array.length - 1; i > 0; i --)
		{
			var j = Math.floor (Math.random () * (i + 1));
			
			var temp = array [i];
			
			array [i] = array [j];
			array [j] = temp;
		}
		
		return array;
	}
	
	
	// Initialize
	
	this.startnewgame = function ()
	{
		view.setbusy (true);
		view.setconfig (this.config);
		
		this.setgamenew ();
		
		this.initializeboard ();
		this.initializetilebag ();
		
		this.setplayerrack (this.drawtiles ());
		this.setcomputerrack (this.drawtiles ());
		
		this.setcomputerscore (0);
		this.setplayerscore (0);
		
		this.clearhistory ();
		
		this.resetpasses ();
		this.resetcomputerswaps ();
		
		view.initializedraghandlers ();
		
		view.setbusy (false);
	}
	
	
	// Dictionary
	
	this.blankletterrange = null;
	this.dictionarystring = null;
	
	this.regexmatchcache = {};
	
	this.setdictionary = function ()
	{
		this.config.dictionary = window ["DICTIONARY"];
	
		this.blankletterrange = this.generateblankletterrange ();
		this.dictionarystring = this.generatedictionarystring ();
	}
	
	this.initializedictionary = function ()
	{
		this.setdictionary ();
		this.startnewgame ();
	}
	
	this.generateblankletterrange = function ()
	{
		blankletterrange = "";
		
		for (letter in this.config.lettercount)
		{
			if (this.getletterpoints (letter) != '*')
				blankletterrange += letter;
		}
		
		return blankletterrange = '[' + blankletterrange + ']';
	}
	
	this.generatedictionarystring = function ()
	{
		var wordstring = [];
		
		for (var word in this.config.dictionary)
		{
			var length = word.length - 2;
			
			if (wordstring [length] == null)
				wordstring [length] = '_';
				
			wordstring [length] += word + '_';
		}
		
		return wordstring;
	}
}


// --------------------------------------- RegEx Generator

// Get regular expression that matches all the words that qualify being
// in the set of words that place the first letter on the board at anchor
// position ax,ay in direction dir using at most rack.length number of letters.

function getRegex (ax, ay, rack, horizontal, blankletterrange)
{
	var blank = rack.split ('').find (function (letter) { return (model.getletterpoints (letter) == '*') });
	
	if (blank)
		var letrange = blankletterrange;
	else
		var letrange = "[" + rack + "]";
	
	// deX........  => /de[a-z]{1,7}/g
	// ..eX.m.....  => /e[a-z]{2}m[a-z]{0,3}/g
	// ...X.m..p..  => /e[a-z]m[a-z]{2}p[a-z]{0,2}/g

	// r = new RegExp("de[a-z]{1,7}", "g")
	// word.match(r); // returns null if nothing found
	
	if (model.data.boardletters [ax][ay] !== "")  // already a letter on the board
		return null;

	var ap = horizontal ? ax : ay;

	var max = horizontal ? model.config.boardx : model.config.boardy;

	var dx = horizontal ? 1 : 0;
	var dy = 1 - dx;

	//--------------------------------------------------------------------
	// check that there is some letter on the board
	// that we can connect to
	var ok = false;

	var l_x = ax - dx; // board position to left of x
	var a_y = ay - dy; // board position above y

	if (ap>0 && model.data.boardletters [l_x][a_y] !== "")
		// Either placement to left of x or
		// above y has a letter on board
		ok = true;

	// Start scanning for letters on board from parallel lines
	// staring at position ax+1,ay or ax,ay+1
	var sc = ap;  // sc: short for scan
	var scx = ax+dx;
	var scy = ay+dy;

	// by default, set the minimum location of the first
	// letter found in the parallel line search to be
	// higher than any possible minimum found when building
	// the regex, so that if no minimum is found in the
	// parallel scan, the minimum from the regex creation
	// will be used.
	var sminpos = max;
	var empty;
	
	if (!ok)
		empty = 0;
		// No board letters to the left or above anchor, check
		// if lines parallel to direction have letters in them.
		while (sc < max-1)
		{
			if (model.data.boardletters [scx][scy] !== "")
			{
				ok = true;
				break;
			}
			else
				empty++;

			if (empty > rack.length)
				// we can't get further than this point
				// with the number of letters we have
				break;

			a_y = scy-dx;  // x line above y
			b_y = scy+dx;  // x line below y
			l_x = scx-dy;  // y line left of x
			r_x = scx+dy;  // y line right of x
			
			if ( l_x>=0 && a_y>=0 && model.data.boardletters [l_x][a_y] !== "" ||
				 r_x< model.config.boardx && b_y< model.config.boardy && model.data.boardletters [r_x][b_y] !== "" )  // BMD fix use boardx, boardy, not "max"
			{
				// found a board letter to the left or
				// above the scanned line.
				sminpos = sc + 1;
				ok = true;
				break;
			}

			scx += dx;
			scy += dy;
			sc++;
		}

	if (!ok)
		// No letters that we can connect to from ax,ay
		return null;

	//----------------------------------------------------------------------
	// Find any letters immediately preceeding the first placement location

	var ps = ap - 1;
	var xs = ax - dx;
	var ys = ay - dy;
	while (ps>=0 && model.data.boardletters [xs][ys]!=="") {
		xs -= dx;
		ys -= dy;
		ps--;
	}

	if (ps < 0) {
		ps = 0;
		if (xs < 0)
			xs = 0;
		else
		if (ys < 0)
			ys = 0;
	}

	var prev = "";
	for (var i=ps; i<ap; i++) {
		prev += model.data.boardletters [xs][ys];
		xs += dx;
		ys += dy;
	}
	// prev now contains the sequence of letters that immediatly preceede
	// the anchor position (either above it or to it's left, depending on
	// the direction context).

	//--------------------------------------------------------------------
	// Generate the regular expression for the possible words
	// starting at ax,ay using direction dir. Also calculate minimum
	// word size, maximum word size and word starting position.

	var x = ax; // x anchor coordinate
	var y = ay; // y anchor coordinate
	var p = ap; // either ax or ay, depending on the context

	var mws = "_"; // "^"; // marker for word start
	var mwe = "_"; // "$"; // marker for word end
	var regex = mws+prev; // regexp match
	var regex2 = ""; // another possible match
	var letters = 0;
	var blanks  = 0;

	var minl	= 0; // minimum word length that can be created
	var minplay = 1; // no letters were played yet

	var countpost; // flag to include letters in line for minl count

	var prevlen = prev.length;

	var flpos = ap;
	var l;
	// iterate over word letters
	while ( p < max )
	{
		// l is the letter at position x,y on the board
		l = model.data.boardletters [x][y];
		if (l === "")
		{
			// There is no letter at board position x,y
			if (p==ap && prevlen>0)
			{
				minl = prevlen + 1;
				// start adding additional board
				// letters to minimum word length
				countpost = true;
			}
			else
				// stop adding additional board
				// letters to minimum word length
				countpost = false;

			blanks++;
			if (letters == rack.length)
				break;
			letters++;
		}
		else
		{
			hadletters = true;
			if (blanks > 0)
			{
				regex += "(" + letrange;
				if (blanks > 1)
				{
					// If there are letters before the anchor position
					// and two or more free spaces, we can add another
					// match for a shorter word without the connecting
					// to additional letters in same line on board.
					// For example, the following:
					// ..ad..sing (two blanks after d)
					// Should make it possible to find ..adD.sing
					// and also ..adVIsing, so the search should match
					// _ad([a-z]{1})_  or _ad([a-z]{2})sing_
					if (prev !== "")
					{
						regex2 = "|"+regex;
						if (blanks > 2)
							regex2 += "{1,"+(blanks-1)+"}";
						regex2 += ")"+mwe;
					}
					regex += "{" + blanks + "}";
				}
				regex += ")"; // close group capture
				if (minl === 0)
				{
					minl = prevlen + blanks;
					// start adding additional board
					// letters to minimum word length
					countpost = true;
				}
				if (countpost && flpos==ap)
					// save 1st letter position
					flpos = p;
				blanks = 0;
			}
			regex += l;
			if (countpost)
				minl++;
			minplay = 0; // letters were played
		}
		x += dx;
		y += dy;
		p++;
	}

	if (blanks > 0)
	{
		// Last place was a blank
		regex += "(" + letrange;
		if (p == max)
			// and it was the end of the board
			regex += "{"+minplay+","+blanks+"}";
		else {
			// used all the letters before
			// reaching the end of the board
			// check the next board space
			if (model.data.boardletters [x][y] === "")
				regex += "{"+minplay+","+blanks+"}";
			else {
				regex += "{"+blanks+"}";
				for (i=p+1; i<max; i++)
				{
					l = model.data.boardletters [x][y];
					if (l === "") break;
					regex += l;
					x += dx;
					y += dy;
				}
			}
		}
		regex += ")";  // close group capture
	}

	// flpos - position of first letter that was found
	//		 when generating the regex
	// sminpos - first letter found in parallel line scan
	if (flpos == ap)
		// no first letter was found in the regex scan.

		// Are there any letters before the anchor ?
		if (prev !== "")
			//  yes - then the minimum is one more
			minl = prevlen + 1;
		else
			// No, then set the minimum word length to
			// be the distance to the first letter found
			// in the parallel line scan.
			minl = sminpos - ap + 1;
	else
	{
		var mindiff = flpos - sminpos;
		if ( mindiff > 1 )
			// If the regex scan first letter position is at a
			// distance of two or more further from the parallel
			// scan first letter position, then the minimum word
			// length is the distance from the anchor to the first
			// letter found in the parallel scan.
			minl -= mindiff;
	}

	var s = ap-prev.length;
	var maxl = p-s;

	// if there was another possible match then add it
	regex += mwe + regex2;

	// eg: {rgx: "^am[a-z]{2}t$", xs: 0, min: 3, max: 5, prf: "am"}
	// will be returned for |am*.t|
	// TODO: optimize by eliminating length 4 in this case
	var res  = { rgx:regex, ps:s, min:minl, max:maxl };
	res.prec = prev;
	res.horizontal   = horizontal;
	return res;
}

// --------------------------------------- End