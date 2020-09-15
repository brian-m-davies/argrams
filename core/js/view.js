// --------------------------------------- View
//
// Written by Brian Davies & Amnon David
//
// --------------

// --------------------------------------- Main

function GAME_VIEW ()
{	
	// Properties
	
	this.props = {
		
		// Game Config
		
		config: { boardx: 0, boardy: 0, racksize: 0, lettercount: {}, letterpoints: {}, squaretypes: [] },
		
		computerlevel: 1,
		
		// Game Data
		
		data: { tilebag: [], boardletters: null, playerrack: "", computerrack: "", playerscore: 0, computerscore: 0, history: [] },
		
		
		// Internal Data
				
		thinking: false,
		locked: false,
		placements: [],
		validmove: false,
		validword: false,
		validwordpoints: 0,
		
		showlegal: true,
		showcheats: false,
		
		// Dialogs
		
		alertvisible: false,
		alertmessage: "",
		defineblankvisible: false,
		blankcell: null,
		blanktile: null,
		swaptilesvisible: false,
		wordlookupvisible: false,
		tilebagvisible: false,
		restartvisible: false,
		settingsvisible: false
	}
	
	
	// Render
	
	this.render = function ()
	{
		ReactDOM.render (React.createElement (GameUI, this.props), document.getElementById ("gameui"));
	}
	
	
	// Model Set Functions
	
	this.setconfig = function (config)
	{
		this.props.config = config;
		
		this.props.computerlevel = config.computerlevel;
		
		this.render ();
	}
	
	this.setdata = function (data)
	{
		this.props.data = data;
		
		this.render ();
	}
	
	
	
	this.setbusy = function (busy)
	{
		this.props.thinking = busy;
		this.props.locked = busy;
		
		this.setplayerrackdraggable (! busy);
		
		this.render ();
	}
	
	this.setlocked = function (locked)
	{
		this.props.locked = locked;
		
		this.render ();
	}
	
	this.setcomputerlevel = function (level)
	{
		this.props.computerlevel = level;
	
		this.render ();
	}
	
	this.setshowlegal = function (legal)
	{
		this.props.showlegal = legal;
		
		this.render ();
	}
	
	this.setshowcheats = function (cheats)
	{
		this.props.showcheats = cheats;
		
		this.render ();
	}
	
	
	// Model Event Handlers
	
	this.onplayerplay = function ()
	{
		this.props.placements = [];
		
		this.props.validmove = false;
		this.props.validword = false;
		this.props.validwordpoints = 0;
		
		this.setalltilesnotdraggable ();
	}
	
	this.onplayerinvalidplay = function (message)
	{
		this.showalert ('<h1><i class="fas fa-exclamation-triangle"></i> ' + localize ("Invalid") + '</h1>'
			+ '<hr/><p>' + localize (message) + '</p>');
	}
	
	this.onplayerinvalidword = function (message)
	{
		this.showalert ('<h1><i class="fas fa-exclamation-triangle"></i> ' + localize ("Invalid") + '</h1>'
			+ '<hr/><p>' + localize (message) + '</p>');
		
		/*
		if (this.props.showlegal == false)
		{
			setTimeout ( function () { model.takecomputerturn.call (model); }, 300);
			this.placementstorack ();
		}
		*/
	}
	
	this.onplayerbingo = function (move)
	{
		this.showalert ('<h1><i class="fas fa-certificate"></i> ' + localize ("Bingo") + '</h1>'
			+ '<hr/><p>' + move.word.toUpperCase () + ' ' + move.score + '</p>');
	}
	
	this.oncomputerplay = function (placements, callback)
	{
		this.racktoplacements (placements, callback, "computer", this.props.data.computerrack);
	}
	
	this.oncomputerswap = function ()
	{
		this.showalert ('<p>' + localize ("The computer swaps tiles.") + '</p>');
	}
	
	this.oncomputerpass = function ()
	{
		this.showalert ('<p>' + localize ("The computer passes.") + '</p>');
	}
	
	this.ongameover = function (computerdeductions, playerdeductions)
	{
		this.setplayerrackdraggable (false);
		this.showpeek ();
		
		html = '<h1>';
		
		if (this.props.data.computerscore < this.props.data.playerscore)
			html += '<i class="fas fa-smile-wink"></i> ' + localize ("Win");
		else if (this.props.data.computerscore > this.props.data.playerscore)
			html += '<i class="fas fa-sad-tear"></i> ' + localize ("Loss");
		else
			html += '<i class="fas fa-meh-blank"></i> ' + localize ("Draw");
		
		html += '</h1><hr/>';
		
		html += '<h2><i class="fas fa-user"></i> <span class="score">' + this.props.data.playerscore + '</span></h2>';
		
		if (playerdeductions)
			html += '<p>-' + playerdeductions + ' ' + localize ("for unplayed tiles") + '</p>';
		
		html += '<br/>';
		
		html += '<h2><i class="fas fa-tablet-alt"></i>  <span class="score">' + this.props.data.computerscore + '</span></h2>';
		
		if (computerdeductions)
			html += '<p>-' + computerdeductions + ' ' + localize ("for unplayed tiles") + '</p>';
		
		this.showalert (html);
	}
	
	
	// Dialogs
	
	this.showalert = function (message)
	{
		this.props.alertmessage = message;
		this.props.alertvisible = true;
		
		this.render ();
	}
	
	this.hidealert = function ()
	{
		this.props.alertvisible = false;
		
		this.render ();
	}

	this.showdefineblankdialog = function (x, y, tile)
	{
		this.props.defineblankvisible = true;
		this.props.blankcell = { x: x, y: y };
		this.props.blanktile = tile;
		
		this.render ();
	}
	
	this.submitdefineblank = function (letter)
	{
		var cellid = "cell_" + this.props.blankcell.x + "_" + this.props.blankcell.y;
		
		var tile = document.getElementById (cellid).firstChild;
		
		this.insertblankdefinition (tile, letter);
		
		this.addplacement (this.props.blankcell.x, this.props.blankcell.y, letter, 0, this.props.blanktile);
	}
	
	this.hidedefineblankdialog = function ()
	{
		this.props.defineblankvisible = false;
		this.props.blankcell = null;
		this.props.blanktile = null;
		
		this.render ();
	}

	this.showswaptilesdialog = function ()
	{
		this.props.swaptilesvisible = true;
		
		this.render ();
	}
	
	this.hideswaptilesdialog = function ()
	{
		this.props.swaptilesvisible = false;
		
		this.render ();
	}
	
	this.showwordlookupdialog = function ()
	{
		this.props.wordlookupvisible = true;
		
		this.render ();
	}
	
	this.hidewordlookupdialog = function ()
	{
		this.props.wordlookupvisible = false;
		
		this.render ();
	}
	
	this.showtilebagdialog = function ()
	{
		this.props.tilebagvisible = true;
		
		this.render ();
	}
	
	this.hidetilebagdialog = function ()
	{
		this.props.tilebagvisible = false;
		
		this.render ();
	}
	
	this.showworddefinition = function (word)
	{
		window.open (this.props.config.definitionurl + word.toLowerCase ());
	}
	
	this.showrestartdialog = function ()
	{
		this.props.restartvisible = true;
		
		this.render ();
	}
	
	this.hiderestartdialog = function ()
	{
		this.props.restartvisible = false;
		
		this.render ();
	}
	
	this.showsettingsdialog = function ()
	{
		this.props.settingsvisible = true;
		
		this.render ();
	}
	
	this.hidesettingsdialog = function ()
	{
		this.props.settingsvisible = false;
		
		this.render ();
	}
	
	
	// Tile HTML
	
	this.maketilehtml = function (who, letter, sample)
	{
		var points = sample ? null : model.getletterpoints (letter);
		
		var content = localizetiles (letter);
		
		var spanclasses = [];
		
		if (sample)
			spanclasses.push ('blank');
		
		if (content.length == 2)
			spanclasses.push ('digraph');
		
		return "<div class='tile " + who + "tile" + (who == "player" ? " redips-drag" : '') + "'"
			+ "data-letter='" + letter + "' data-points='" + points + "' " + (points == '*' ? "data-blank='" + letter + "' " : '')
			+ "style='background-position: " + Math.round (Math.random () * 90) + '%' + ' ' + Math.round (Math.random () * 90) + "%'"
			+ ">"
			+ "<span class='" + spanclasses.join (' ') + "'>"
			+ (points == '*' ? "" : content)
			+ "</span>"
			+ "<sup>" + (points == null || points == '*' ? "&nbsp;" : points) + "</sup>"
			+ "</div>";
	}
	
	this.insertblankdefinition = function (tile, letter)
	{
		tile.dataset.letter = letter;
		
		var content = localizetiles (letter);
		
		tile.innerHTML = "<span class='blank'>"
			+ (content.length == 2 ? "<span class='digraph'>" : "")
			+ content
			+ (content.length == 2 ? "</span>" : "")
			+ "</span><sup>&nbsp;</sup>";
	}
	
	this.removeblankdefinition = function (tile)
	{
		tile.dataset.letter = tile.dataset.blank;
		
		tile.innerHTML = "&nbsp;";
	}
	
	
	// Tile Movement
	
	this.addplacement = function (x, y, letter, points, blank)
	{
		var placement = { letter: letter, points: points, x: x, y: y };
		
		if (blank)
			placement.blank = blank;
		
		this.props.placements.push (placement);
		
		this.checkvalidmove ();
	}
	
	this.removeplacement = function (x, y)
	{
		this.props.placements = this.props.placements.filter
			(function (placement) { return (placement.x != x) || (placement.y != y); });
		
		this.checkvalidmove ();
	}
	
	this.checkvalidmove = function ()
	{
		var move = model.createplayermove (this.props.placements);
		
		this.props.validmove = (move.error == undefined);
		
		this.props.validword = (move.error == undefined) && (move.unknown == undefined);
		this.props.validwordpoints = (move.score || 0);
		
		this.render ();
	}
	
	
	// Animations
	
	this.placementstorack = function (animate)   // NEEDS CLEANUP
	{	
		var tiles = [];
		
		for (i in this.props.placements)
		{
			var placement = this.props.placements [i];
			var cellid = "cell_" + placement.x + "_" + placement.y;
			
			var boardcell = document.getElementById (cellid);
			
			tiles.push (boardcell.firstChild);
			
			if (! animate)
				boardcell.innerHTML = "";
		}
		
		for (i = 0; i < this.props.config.racksize; i ++)
		{
			var rackcell = document.getElementById ("playerrack" + i);
			
			if (! rackcell.firstChild && tiles.length)
			{
				var tile = tiles.shift ();
				
				if (tile.dataset.blank)
					this.removeblankdefinition (tile);
				
				if (! animate)
				{
					rackcell.appendChild (tile);
				}
				else
				{
					REDIPS.drag.moveObject ({ obj: tile, target: rackcell });
				}
			}
		}
		
		this.props.placements = [];
		this.checkvalidmove ();
		
		this.render ();
	}
	
	this.racktoplacements = function (placements, callback, who, rack)
	{
		for (var i = 0; i < placements.length; i ++)
		{
			var placement = placements [i];
			
			var letter = placement.blank || placement.letter;
			
			var rackindex = rack.indexOf (letter);
			rack = rack.replace (letter, '.');
			
			var tile = document.getElementById (who + "rack" + rackindex).firstChild;
			var boardcell = document.getElementById ("cell_" + placement.x + "_" + placement.y);
			
			if (tile.dataset.blank)
				this.insertblankdefinition (tile, placement.letter);
			
			tile.classList.remove ("computertile");
			
			moveletter (tile, boardcell, (i == placements.length - 1), 10 + 200 * i, callback);
		}
		
		function moveletter (obj, target, lastmove, wait, callback)
		{
			var info = { obj: obj, target: target }
			
			if (lastmove)
				info.callback = function () { callback (); };
			
			setTimeout (function () { REDIPS.drag.moveObject (info); }, wait);
		}
	}
	
	
	// REDIPS
	
	this.setalltilesnotdraggable = function ()
	{
		REDIPS.drag.enableDrag (false, 'div.tile');
	}
	
	this.setplayerrackdraggable = function (draggable)
	{
		REDIPS.drag.enableDrag (draggable, "#playerrack div.tile");
	}
	
	this.initializedraghandlers = function ()
	{
		REDIPS.drag.init ();  // this has to be called from body.onload, so this is a duplicate
		
		REDIPS.drag.hover = '';
		REDIPS.drag.style.borderDisabled = 'solid';
		REDIPS.drag.dropMode = 'shift';
		REDIPS.drag.shift.overflow = 'source';
		REDIPS.drag.shift.animation = true;
		
		REDIPS.drag.event.droppedBefore = function ()
		{
			var target = REDIPS.drag.td.target;
			
			// "dropMode: shift" to allow rack tiles to shuffle means need to manually block drop on occupied squares
			
			if ((target.id.indexOf ("cell_") == 0) && (target.firstChild != undefined))
			{
				return false;
			}
			else if (target.id.indexOf ("playerrack") == 0)
			{
				var targetindex = parseInt (target.id.substring (target.id.length - 1));
				var emptyindex = null;
				
				for (var i = 0; i < view.props.config.racksize; i ++)
				{
					if (document.getElementById ("playerrack" + i).firstChild == undefined)
						emptyindex = i;
				}
				
				if (targetindex < emptyindex)
					emptyindex ++;
				
				REDIPS.drag.shift.overflow = document.getElementById ("playerrack" + emptyindex)
			}
		}
		
		REDIPS.drag.event.dropped = function ()
		{
			var tile = REDIPS.drag.obj;
			var source = REDIPS.drag.td.source;
			var target = REDIPS.drag.td.target;
			
			var letter = tile.dataset.letter;
			var points = tile.dataset.points;
			var blank = tile.dataset.blank;
			
			if (source.id.indexOf ("cell_") == 0)
			{
				var x = parseInt (source.id.split ('_') [1]);
				var y = parseInt (source.id.split ('_') [2]);
				
				view.removeplacement (x, y);
			}
			
			if (target.id.indexOf ("cell_") == 0)
			{
				var x = parseInt (target.id.split ("_") [1]);
				var y = parseInt (target.id.split ("_") [2]);
				
				if (blank)
				{
					view.showdefineblankdialog (x, y, letter);
				}
				else
				{
					view.addplacement (x, y, letter, isNaN (parseFloat (points)) ? 0 : parseFloat (points));
				}
			}
			else if (target.id.indexOf ("playerrack") == 0)
			{
				if ((source.id.indexOf ("cell_") == 0) && (blank))
				{
					view.removeblankdefinition (tile);
				}
			}
			
			view.render ();
		};
	}
	
	
	// Keyboard
	
	this.handlekeyevent = function (evt)
	{
		var BACKSPACE = 8;
		var ENTER = 13;
		var CONTROL = 17;
		var ESCAPE = 27;
		var SPACE = 32;
		
		var key = evt.keyCode;
		
		if (this.props.alertvisible)
		{
			if (key == BACKSPACE || key == ENTER || key == ESCAPE|| key == SPACE)
				document.getElementById ('alertsubmit').click ();
		}
		else if (this.props.defineblankvisible)
		{
			var char = String.fromCharCode (key).toLowerCase ();
			
			if (document.getElementById ('defineblank' + char))
				document.getElementById ('defineblank' + char).click ();
		}
		else if (this.props.swaptilesvisible)
		{
			if (key == ENTER)
				document.getElementById ('swapsubmit').click ();
			else if (key == ESCAPE)
				document.getElementById ('swapcancel').click ();
		}
		else if (this.props.wordlookupvisible)
		{
			if (key == ESCAPE)
				document.getElementById ('lookupsubmit').click ();
		}
		else if (this.props.restartvisible)
		{
			if (key == ENTER)
				document.getElementById ('restartsubmit').click ();
			else if (key == ESCAPE)
				document.getElementById ('restartcancel').click ();
		}
		else if (this.props.settingsvisible)
		{
			if (key == ENTER)
				document.getElementById ('settingssubmit').click ();
			else if (key == ESCAPE)
				document.getElementById ('settingscancel').click ();
		}
		else if (key == ENTER)
		{
			document.getElementById ('playbutton').click ();
		}
		else if (key == ESCAPE)
		{
			document.getElementById ('clearbutton').click ();
		}
		else if (key == SPACE)
		{
			document.getElementById ('passbutton').click ();
		}
		else if (key == BACKSPACE)
		{
			document.getElementById ('swapbutton').click ();
		}
		else if (key == 49)  // 1
		{
			if (! this.props.locked)
			{
				if (confirm (localize ("Start new game?")))
				{
					this.placementstorack ();
					this.hidepeek ()
					model.startnewgame ();
				}
			}
		}
		else if (key == 50)  // 2
		{
			if (! this.props.locked)
				this.showsettingsdialog ();
		}
		else if (key == 51)  // 3
		{
			if (! this.props.locked && this.props.showcheats)
			{
				this.showwordlookupdialog ();
				return false;
			}
		}
		else if (key == 52)  // 4
		{
			if (! this.props.locked && this.props.placements.length == 0 && this.props.showcheats)
				this.showplayerhint ();
		}
		else if (key == 53)  // 5
		{
			if (! this.props.locked && this.props.showcheats)
				this.showpeek ();
		}
		else if (key == 54)  // 6
		{
			if (! this.props.locked && this.props.showcheats)
				this.showtilebagdialog ();
		}
	}
	
	
	// Cheating

	this.showpeek = function ()
	{
		for (var i = 0; i < this.props.config.racksize; i ++)
		{
			var rackcell = document.getElementById ("computerrack" + i);
			
			var tile = rackcell.firstChild;
			
			if (tile)
				tile.classList.remove ("computertile");
		}
	}
	
	this.hidepeek = function ()
	{
		for (var i = 0; i < this.props.config.racksize; i ++)
		{
			var rackcell = document.getElementById ("computerrack" + i);
			
			var tile = rackcell.firstChild;
			
			if (tile && ! tile.classList.contains ("computertile"))
				tile.classList.add ("computertile");
		}
	}
	
	this.getplayercurrentrackorder = function ()
	{
		var currentrack = "";
		
		for (var i = 0; i < this.props.data.playerrack.length; i ++)
		{
			var rackcell = document.getElementById ("playerrack" + i);
			
			if (rackcell.firstChild)
				currentrack += rackcell.firstChild.dataset.letter;
			else
				currentrack += '.';
		}
		
		return currentrack;
	}
	
	this.showplayerhint = function ()
	{	
		var move = model.selectbestmove (model.findmoves (model.data.playerrack));
		
		if (move)
		{
			var currentrack = this.getplayercurrentrackorder ();
			
			this.props.placements = move.placements;
			
			this.setlocked (true);
			
			this.racktoplacements (move.placements, function () { view.checkvalidmove (); view.setlocked (false); }, "player", currentrack);
		}
		else
		{
			this.showalert ('<p>' + localize ("No moves found.") + '</p>');
		}
	}
}

// --------------------------------------- End