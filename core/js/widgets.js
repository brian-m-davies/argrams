// --------------------------------------- Widgets
//
// Written by Brian Davies & Amnon David
//
// --------------

// --------------------------------------- Main UI

var GameUI = createReactClass ({ displayName: "GameUI",

	render: function ()
	{
		var objects = [
			React.createElement ('div', { id: 'redips-drag' },
				React.createElement (ComputerRack, { racksize: this.props.config.racksize, computerrack: this.props.data.computerrack }),
				React.createElement (Board, { boardx: this.props.config.boardx, boardy: this.props.config.boardy, squaretypes: this.props.config.squaretypes, status: this.props.data.status }),
				React.createElement (PlayerRack, { racksize: this.props.config.racksize, playerrack: this.props.data.playerrack, status: this.props.data.status })),
			React.createElement ('div', { id: 'sidebar' },
				React.createElement (Status, this.props),
				React.createElement (History, this.props),
				React.createElement (Controls, this.props),
				React.createElement (Cheats, this.props)),
			React.createElement (Spinner, this.props),
			React.createElement (Disabler, this.props)
		];
		
		if (this.props.alertvisible)
			objects.push (React.createElement (AlertDialog, this.props));
		
		if (this.props.swaptilesvisible)
			objects.push (React.createElement (SwapTilesDialog, this.props));
		
		if (this.props.defineblankvisible)
			objects.push (React.createElement (DefineBlankDialog, this.props));
		
		if (this.props.wordlookupvisible)
			objects.push (React.createElement (WordLookupDialog, this.props));
		
		if (this.props.tilebagvisible)
			objects.push (React.createElement (TileBagDialog, this.props));
		
		if (this.props.restartvisible)
			objects.push (React.createElement (RestartDialog, this.props));
		
		if (this.props.settingsvisible)
			objects.push (React.createElement (SettingsDialog, this.props));
		
		return objects;
	}
});


// --------------------------------------- Play Area

var ComputerRack = createReactClass ({ displayName: "ComputerRack",

	render: function ()
	{
		cells = [];
		
		for (i = 0; i < this.props.racksize; i ++)
		{
			var letter = this.props.computerrack.charAt (i);
			
			cells.push (React.createElement (ComputerRackCell, { i: i, letter: letter }))
		}
		
		return React.createElement ('div', { className: "rack" },
			React.createElement ('table', { },
				React.createElement ('tr', { }, cells)));
	}
});

var ComputerRackCell = createReactClass ({ displayName: "ComputerRack",

	render: function ()
	{
		var tile = null;
		
		if (this.props.letter && this.props.letter != '.')
			tile = view.maketilehtml ("computer", this.props.letter);
		
		return React.createElement ('td', { id: 'computerrack' + this.props.i, dangerouslySetInnerHTML: { __html: tile }})
	},
	
	shouldComponentUpdate: function (nextprops, nextstate)
	{
		return (this.props.letter != nextprops.letter);
	}
});

var Board = createReactClass ({ displayName: "Board",

	render: function ()
	{
		var bonusclassnames = ["default", "DL", "TL", "DW", "TW", "ST"];
		
		html = "";
		
		for (i = 0; i < this.props.boardy; i ++)
		{
			html += "<tr>";
			
			for (j = 0; j < this.props.boardx; j ++)
			{
				var bonusid = 0;
				
				if (i < this.props.squaretypes.length)
					bonusid = this.props.squaretypes [i][j];
				
				var bonusclass = bonusclassnames [bonusid] || "custom";
				
				html += "<td class='cell" + (bonusclass ? " " + bonusclass : "") + " redips-single' "
					+ "id='" + ("cell_" + j + "_" + i) + "'></td>";
			}
			
			html += "</tr>";
		}
		
		return React.createElement ('table', { className: 'board', dangerouslySetInnerHTML: { __html: html }});
	},
	
	shouldComponentUpdate: function (nextprops, nextstate)
	{
		return (this.props.status != 0 && nextprops.status == 0);
	},
	
	componentDidUpdate: function ()
	{
		for (var x = 0; x < this.props.boardx; x ++)
		{
			for (var y = 0; y < this.props.boardy; y ++)
			{
				var boardcell = document.getElementById ("cell_" + x + "_" + y);
				
				if (boardcell.firstChild)
					boardcell.firstChild.remove ();
			}
		}
	}
});

var PlayerRack = createReactClass ({ displayName: "PlayerRack",

	render: function ()
	{
		cells = [];
		
		for (i = 0; i < this.props.racksize; i ++)
		{
			cells.push (React.createElement (PlayerRackCell, { i: i, letter: this.props.playerrack.charAt (i) }))
		}
		
		return React.createElement ('div', { className: "rack" },
			React.createElement ('table', { id: "playerrack" },
				React.createElement ('tr', { }, cells)));
	},
	
	shouldComponentUpdate: function (nextprops, nextstate)
	{
		return this.props.playerrack != nextprops.playerrack;
	},
	
	componentDidUpdate: function ()
	{
		if (this.props.status == 0)
			view.initializedraghandlers ();
	}
});

var PlayerRackCell = createReactClass ({ displayName: "PlayerRackCell",

	render: function ()
	{
		var tile = null;
		
		if (this.props.letter && this.props.letter != '.')
			tile = view.maketilehtml ("player", this.props.letter);
		
		return React.createElement ('td', { id: 'playerrack' + this.props.i, dangerouslySetInnerHTML: { __html: tile }})
	},
	
	shouldComponentUpdate: function (nextprops, nextstate)
	{
		var node = ReactDOM.findDOMNode (this);
		
		return (! node.firstChild || nextprops.letter != node.firstChild.dataset.letter);
	}
});


// --------------------------------------- Sidebar

// Status Panel

var Status = createReactClass ({ displayName: "Status",

	render: function ()
	{	
		return React.createElement ('div', { id: 'status' },
			React.createElement (ScoreDisplay, this.props),
			React.createElement ('h2', { },
				React.createElement (BagButton, this.props),
				React.createElement ('span', { }, this.props.data.tilebag.length + ' ' + localize ('Tiles Left')),
				React.createElement (SettingsButton, this.props),
				React.createElement (NewGameButton, this.props)));
	}
});

var ScoreDisplay = createReactClass ({ displayName: "ScoreDisplay",

	render: function ()
	{
		var playerhtml = '<i class="fas fa-user"></i> <span class="score">' + this.props.data.playerscore + '</span>';
		
		var computerhtml = '<i class="fas fa-tablet-alt"></i>  <span class="score">' + this.props.data.computerscore + '</span>';
		
		return [
			React.createElement ('div', { id: 'playerscorebox', className: 'scorebox' },
				React.createElement ('h1', { dangerouslySetInnerHTML: { __html: playerhtml }})),
			React.createElement ('div', { id: 'computerscorebox', className: 'scorebox' },
				React.createElement ('h1', { dangerouslySetInnerHTML: { __html: computerhtml }}))
				];
	}
});

var BagButton = createReactClass ({ displayName: "BagButton",

	render: function ()
	{
		var disabled = this.props.locked || this.props.tilebagvisible;
		
		return React.createElement ('span', { id: 'tiles', className: 'link' + (disabled ? " disabled" : ""), dangerouslySetInnerHTML: { __html: '<i class="fas fa-shopping-bag"></i>' }, onClick: this.click });
	},
	
	click: function ()
	{
		var disabled = this.props.locked || this.props.tilebagvisible;
		
		if (! disabled)
			view.showtilebagdialog ();
	}
});

var NewGameButton = createReactClass ({ displayName: "NewGameButton",

	render: function ()
	{
		var disabled = this.props.locked;
		
		return React.createElement ('span', { id: 'newgame', className: 'link' + (disabled ? " disabled" : ""), dangerouslySetInnerHTML: { __html: '<i class="fas fa-crow"></i>' }, onClick: this.click });
	},
	
	click: function ()
	{
		var disabled = this.props.locked;
		
		if (! disabled)
			view.showrestartdialog ();
	}
});

var SettingsButton = createReactClass ({ displayName: "SettingsButton",

	render: function ()
	{
		var disabled = this.props.locked;
		
		var label = '<i class="fas fa-cog"></i>';
		
		return React.createElement ('span', { id: 'settings', className: 'link' + (disabled ? " disabled" : ""), dangerouslySetInnerHTML: { __html: label }, onClick: this.click });
	},
	
	click: function ()
	{
		var disabled = this.props.locked;
		
		if (! disabled)
			view.showsettingsdialog ();
	}
});


// History Panel

var History = createReactClass ({ displayName: "History",
	
	render: function ()
	{
		var moves = this.props.data.history.map (function (move)
		{
			return React.createElement (HistoryMove, { move: move });
		});
		
		html = /* '<i class="fas fa-clock"></i> ' + */ localize ('History');
		
		return React.createElement ('div', { id: 'history' },
					React.createElement ('h2', { dangerouslySetInnerHTML: { __html: html }}),
					React.createElement ('div', { id: "moves" }, moves));
	},
	
	getInitialState: function ()
	{
		return { length: 0 }
	},
	
	componentDidUpdate: function ()
	{
		if (this.props.data.history.length != this.state.length)
		{
			this.setState ({length: this.props.data.history.length });
			
			document.getElementById ("moves").scrollTop = 99999999;
		}
	}
});

var HistoryMove  = createReactClass ({ displayName: "HistoryMove",
	
	render: function ()
	{
		var move = this.props.move;
		
		var whoicon = move.player == "player" ? '<i class="fas fa-user"></i>' : '<i class="fas fa-tablet-alt"></i>'
		
		if (move.action == "play")
		{
			var contents = move.words.map (function (word)
			{
				word = localizetiles (word).toLowerCase ();
				
				return "<span class='word' onclick='view.showworddefinition (\"" + word + "\")'>" + word + "</span>";
			}).join (", ");
			
			var score = move.bingo ? '<i class="fas fa-certificate"></i> ' + move.score : move.score;
		}
		else if (move.action == "pass")
		{
			var contents = "...";
			var score = 0;
		}
		else if (move.action == "swap")
		{
			// var contents = '<i class="fas fa-random"></i>';
			// var contents = "&harr;";
			var contents = "&nbsp;-"
			var score = 0;
		}
		
		return React.createElement ('p', { className: move.player },
			React.createElement ('span', { className: 'who' },
				React.createElement ('i', { className: "fas " + (move.player == "player" ? "fa-user" : "fa-tablet-alt") })),
			React.createElement ('span', { className: 'words', dangerouslySetInnerHTML: { __html: " " + contents }}),
			React.createElement ('span', { className: 'score', dangerouslySetInnerHTML: { __html: score }}));
	}
});


// Control Panel

var Controls = createReactClass ({ displayName: "Controls",

	render: function ()
	{
		return React.createElement ('div', { id: 'controls' },
			React.createElement (PlayButton, this.props),
			React.createElement (ClearButton, this.props),
			React.createElement (PassButton, this.props),
			React.createElement (SwapButton, this.props));
	}
});
		
var PlayButton = createReactClass ({ displayName: "PlayButton",

	render: function ()
	{
		var disabled = this.props.locked || (this.props.placements.length == 0) || (this.props.data.status == 2);
		
		var label = '<i class="fas fa-play"></i> &nbsp;' + localize ('Play');
		
		var showvalidword = this.props.validword && this.props.showlegal;
		
		return React.createElement ('div', { id: 'playbutton', className: 'button' + (disabled ? " disabled" : "") + (showvalidword ? " green" : ""), onClick: this.click },
			React.createElement ('span', { dangerouslySetInnerHTML: { __html: label }}),
			React.createElement ('div', { id: 'pointspreview', className: (showvalidword ? 'visible' : '' )}, this.props.validwordpoints));
	},
	
	click: function ()
	{
		var disabled = this.props.locked || (this.props.placements.length == 0) || (this.props.data.status == 2);
		
		if (! disabled)
		{
			model.onplayerplay (this.props.placements, view.getplayercurrentrackorder ());
		}
	}
});

var PassButton = createReactClass ({ displayName: "PassButton",

	render: function ()
	{
		var disabled = this.props.locked || (this.props.placements.length > 0) || (this.props.data.status == 2);
		
		var label = '<i class="fas fa-forward"></i> &nbsp;' + localize ('Pass');
		
		return React.createElement ('div', { id: 'passbutton', className: 'button' + (disabled ? " disabled" : ""), onClick: this.click },
			React.createElement ('span', { dangerouslySetInnerHTML: { __html: label }}));
	},
	
	click: function ()
	{
		var disabled = this.props.locked || (this.props.placements.length > 0) || (this.props.data.status == 2);
		
		if (! disabled)
			model.onplayerpass ();
	}
});

var ClearButton = createReactClass ({ displayName: "ClearButton",

	render: function ()
	{
		var disabled = this.props.locked || (this.props.placements.length == 0) || (this.props.data.status == 2);
		
		var label = '<i class="fas fa-undo-alt"></i></i> &nbsp;' + localize ('Recall');
		
		return React.createElement ('div', { id: 'clearbutton', className: 'button' + (disabled ? " disabled" : ""), onClick: this.click },
			React.createElement ('span', { dangerouslySetInnerHTML: { __html: label }}));
	},
	
	click: function ()
	{
		var disabled = this.props.locked || (this.props.placements.length == 0) || (this.props.data.status == 2);
		
		if (! disabled)
			view.placementstorack (true);
	}
});

var SwapButton = createReactClass ({ displayName: "SwapButton",

	render: function ()
	{
		var disabled = this.props.locked || (this.props.placements.length > 0) || (this.props.data.tilebag.length < this.props.config.racksize) || (this.props.data.status == 2);
		
		var label = '<i class="fas fa-random"></i> &nbsp;' + localize ('Swap');
		
		return React.createElement ('div', { id: 'swapbutton', className: 'button' + (disabled ? " disabled" : ""), onClick: this.click },
			React.createElement ('span', { dangerouslySetInnerHTML: { __html: label }}));
	},
	
	click: function ()
	{
		var disabled = this.props.locked || (this.props.placements.length > 0) || (this.props.data.tilebag.length < this.props.config.racksize) || (this.props.data.status == 2);
		
		if (! disabled)
		{
			view.showswaptilesdialog ();
	    }
	}
});


// Cheats Panel

var Cheats = createReactClass ({ displayName: "Cheats",

	render: function ()
	{
		var visible = this.props.showcheats;
		
		return React.createElement ('div', { id: 'cheats', style: { display: (visible ? "block" : "none") }},
			React.createElement ('h2', { },
				React.createElement (LookupButton, this.props),
				React.createElement (HintButton, this.props),
				React.createElement (PeekButton, this.props)))
	}
});

var LookupButton = createReactClass ({ displayName: "LookupButton",

	render: function ()
	{
		var disabled = this.props.locked || this.props.wordlookupvisible;
		
		var label = '<i class="fas fa-binoculars"></i>';
		
		return React.createElement ('span', { id: 'lookup', className: 'link' + (disabled ? " disabled" : ""), dangerouslySetInnerHTML: { __html: label }, onClick: this.click });
	},
	
	click: function ()
	{
		var disabled = this.props.locked || this.props.wordlookupvisible;
		
		if (! disabled)
			view.showwordlookupdialog ();
	}
});

var HintButton = createReactClass ({ displayName: "HintButton",

	render: function ()
	{
		var disabled = this.props.locked || this.props.placements.length > 0 || this.props.data.status == 2;
		
		return React.createElement ('span', { className: 'link' + (disabled ? " disabled" : ""), dangerouslySetInnerHTML: { __html: '<i class="fas fa-lightbulb"></i>' }, onClick: this.click });
	},
	
	click: function ()
	{
		var disabled = this.props.locked || this.props.placements.length > 0 || this.props.data.status == 2;
		
		if (! disabled)
			view.showplayerhint ();
	}
});

var PeekButton = createReactClass ({ displayName: "PeekButton",

	render: function ()
	{
		var disabled = this.props.locked;
		
		return React.createElement ('span', { className: 'link' + (disabled ? " disabled" : ""), dangerouslySetInnerHTML: { __html: '<i class="fas fa-mask"></i>' }, onClick: this.click });
	},
	
	click: function ()
	{
		var disabled = this.props.locked;
		
		if (! disabled)
			view.showpeek ();
	}
});


// --------------------------------------- Spinner

var Spinner = createReactClass ({ displayName: "Spinner",

	render: function ()
	{
		var html = '<i class="fas fa-spinner fa-spin"></i>';
		
		return React.createElement ('div', { className: 'spinner' + (this.props.thinking ? ' visible' : ''), dangerouslySetInnerHTML: { __html: html }});
	}
});


// --------------------------------------- Dialogs

var Disabler = createReactClass ({ displayName: "Disabler",

	render: function ()
	{
		return React.createElement ('div', { className: 'disabler', onClick: this.click });
	},
	
	getInitialState: function ()
	{
		return { visible: false }
	},
	
	componentDidMount: function ()
	{
		var disabler = ReactDOM.findDOMNode (this);
		
		disabler.style.display = "none";
		disabler.style.opacity = 0;
		
		var that = this;
		
		disabler.addEventListener ("transitionend", function () { that.transitionend () }, false);
	},
	
	componentDidUpdate: function ()
	{
		var disabler = ReactDOM.findDOMNode (this);
		var visible = this.props.alertvisible || this.props.defineblankvisible || this.props.swaptilesvisible
			|| this.props.wordlookupvisible || this.props.tilebagvisible || this.props.restartvisible || this.props.settingsvisible;
		
		if (visible && ! this.state.visible)
		{
			disabler.style.display = "block";
			
			// not sure why this is necessary but it is
			setTimeout (function () { disabler.style.opacity = .5; });
		}
		else if (! visible && this.state.visible)
		{
			disabler.style.opacity = 0;
		}
		
		this.state.visible = visible;
	},
	
	transitionend: function ()
	{
		var disabler = ReactDOM.findDOMNode (this);
		var visible = this.props.alertvisible || this.props.defineblankvisible || this.props.swaptilesvisible
			|| this.props.wordlookupvisible || this.props.tilebagvisible || this.props.restartvisible || this.props.settingsvisible;
		
		if (! visible)
		{
			disabler.style.display = "none";
		}
	},
	
	click: function ()
	{
		if (this.props.alertvisible)
			view.hidealert ();
		
		if (this.props.swaptilesvisible)
			view.hideswaptilesdialog ();
		
		if (this.props.wordlookupvisible)
			view.hidewordlookupdialog ();
		
		if (this.props.tilebagvisible)
			view.hidetilebagdialog ();
		
		if (this.props.restartvisible)
			view.hiderestartdialog ();
				
		if (this.props.settingsvisible)
			view.hidesettingsdialog ();
	}
});

var AlertDialog = createReactClass ({ displayName: "AlertDialog",

	render: function ()
	{
		var html = this.props.alertmessage;
		
		return React.createElement ('div', { id: 'alertdialog', className: 'dialog' + (this.props.alertvisible ? ' visible' : '') },
					React.createElement ('div', { className: 'content', dangerouslySetInnerHTML: { __html: html }}),
					React.createElement ('div', { id: 'alertsubmit', className: 'dialogbutton', onClick: this.submit },
						React.createElement ('span', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-check"></i>' }})));
	},
	
	componentDidMount: function ()
	{
		var dialog = ReactDOM.findDOMNode (this);
		
		dialog.style.top = "40%";
		dialog.style.marginTop = (0 - (dialog.offsetHeight) * 2 / 5) + "px";
		
		dialog.style.left = "50%";
		dialog.style.marginLeft = (0 - (dialog.offsetWidth) / 2) + "px";
	},
	
	submit: function ()
	{
		view.hidealert ();
	}
});

var DefineBlankDialog = createReactClass ({ displayName: "DefineBlankDialog",

	render: function ()
	{
		var buttons = [];
		
		for (var letter in this.props.config.lettercount)
		{
			if (this.props.config.letterpoints [letter] != "*")
			{
				var html = view.maketilehtml ("", letter, true);
		
				buttons.push (React.createElement ('span', { id: 'defineblank' + letter, onClick: this.click.bind (this, letter),
					dangerouslySetInnerHTML: { __html: html }}));
			}
		}
		
		return React.createElement ('div', { id: 'defineblankdialog', className: 'dialog' + (this.props.defineblankvisible ? ' visible' : '') },
					React.createElement ('div', { className: 'content' },
						React.createElement ('h1', { }, localize ("Select")),
						React.createElement ('hr', { }),
					React.createElement ('p', { }, buttons)));
	},
	
	componentDidMount: function ()
	{
		var dialog = ReactDOM.findDOMNode (this);
		
		dialog.style.top = "40%";
		dialog.style.marginTop = (0 - (dialog.offsetHeight) * 2 / 5) + "px";
		
		dialog.style.left = "50%";
		dialog.style.marginLeft = (0 - (dialog.offsetWidth) / 2) + "px";
	},
	
	click: function (letter)
	{
		view.submitdefineblank (letter);
		view.hidedefineblankdialog ();
	}
});

var SwapTilesDialog = createReactClass ({ displayName: "SwapTilesDialog",

	render: function ()
	{
		var tiles = [];
		
		var currentorder = view.getplayercurrentrackorder ();
		
		for (var i = 0; i < this.props.data.playerrack.length; i ++)
		{	
			var letter = currentorder [i];
			
			tiles.push (React.createElement ('div', { id: "swaptile" + i, className: 'tileselector',
					style: { verticalAlign: 'top', float: "left" }, onClick: this.select.bind (this, i),
				dangerouslySetInnerHTML: { __html: view.maketilehtml ("", letter) }}))
		}
		
		return React.createElement ('div', { id: 'swaptilesdialog', className: 'dialog' + (this.props.swaptilesvisible ? ' visible' : '') },
					React.createElement ('div', { className: 'content' },
						React.createElement ('h1', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-random"></i> ' + localize ("Swap") }}),
						React.createElement ('hr', { }),
						React.createElement ('div', { style: { verticalAlign: 'top' }}, tiles)),
					React.createElement ('div', { id: 'swapsubmit', className: 'dialogbutton', onClick: this.submit },
						React.createElement ('span', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-check"></i>' }})),
					React.createElement ('div', { id: 'swapcancel', className: 'dialogbutton', onClick: this.cancel },
						React.createElement ('span', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-times"></i>' }})));
	},
	
	getInitialState: function ()
	{
		return { selected: [] }
	},
	
	componentDidMount: function ()
	{
		var dialog = ReactDOM.findDOMNode (this);
		
		dialog.style.top = "40%";
		dialog.style.marginTop = (0 - (dialog.offsetHeight) * 2 / 5) + "px";
		
		dialog.style.left = "50%";
		dialog.style.marginLeft = (0 - (dialog.offsetWidth) / 2) + "px";
	},
	
	select: function (index)
	{
		var prev = this.state.selected;
		
		prev [index] = ! prev [index];
		
		this.state.selected = prev;
		
		document.getElementById ("swaptile" + index).style.marginTop = (prev [index] ? "16px" : "0px");
	},
	
	cancel: function ()
	{
		view.hideswaptilesdialog ();
	},
	
	submit: function ()
	{
		var currentorder = view.getplayercurrentrackorder ();
		
		var rack = "";
		var swap = "";
		
		for (var i = 0; i < this.props.data.playerrack.length; i ++)
		{
			if (this.state.selected [i])
			{
				swap += currentorder [i];
				rack += '.';
			}
			else
			{
				rack += currentorder [i];
			}
		}
		
		model.onplayerswap (swap, rack);
		
		view.hideswaptilesdialog ();
	}
});

var WordLookupDialog = createReactClass ({ displayName: "WordLookupDialog",

	render: function ()
	{
		var output = '';
		var link = '';
		
		if (this.state.word)
		{
			output = this.state.validword ? '<i class="fas fa-thumbs-up"></i>' : '<i class="fas fa-thumbs-down"></i>';
			if (this.state.validword)
				link = "<span class='link' onclick='view.showworddefinition (\"" + this.state.word + "\")'><i class='fas fa-info-circle'></i></span>";
		}
		
		return React.createElement ('div', { id: 'lookupdialog', className: 'dialog' + (this.props.wordlookupvisible ? ' visible' : '') },
					React.createElement ('div', { className: 'content' },
						React.createElement ('h1', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-binoculars"></i> ' + localize ("Lookup") }}),
						React.createElement ('hr', { }),
						React.createElement ('input', { id: "lookupinput", value: this.state.word.toUpperCase (), onChange: this.change }),
						React.createElement ('span', { id: "lookupoutput", dangerouslySetInnerHTML: { __html: output }}),
						React.createElement ('span', { id: "lookuplink", dangerouslySetInnerHTML: { __html: link }})),
					React.createElement ('div', { id: 'lookupsubmit', className: 'dialogbutton', onClick: this.submit },
						React.createElement ('span', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-check"></i>' }})));
	},
	
	getInitialState: function ()
	{
		return { word: "", selectionstart: 0, selectionend: 0, validword: false };
	},
	
	componentDidMount: function ()
	{
		var dialog = ReactDOM.findDOMNode (this);
		
		dialog.style.top = "40%";
		dialog.style.marginTop = (0 - (dialog.offsetHeight) * 2 / 5) + "px";
		
		dialog.style.left = "50%";
		dialog.style.marginLeft = (0 - (dialog.offsetWidth) / 2) + "px";
		
		document.getElementById ("lookupinput").focus ();
	},
	
	componentDidUpdate: function ()
	{
		var input = document.getElementById ('lookupinput');
		
		input.setSelectionRange (this.state.selectionstart, this.state.selectionend);
	},
	
	change: function ()
	{
		var input = document.getElementById ('lookupinput');
		
		var selectionstart = input.selectionStart;
		var selectionend = input.selectionEnd;
		
		var word = input.value.trim ().toLowerCase ();
		
		this.setState ({ word: word, selectionstart: selectionstart, selectionend: selectionend, validword: (word in model.config.dictionary) });
	},
	
	submit: function ()
	{
		view.hidewordlookupdialog ();
	}
});

var TileBagDialog  = createReactClass ({ displayName: "WordLookupDialog",

	render: function ()
	{
		var hiddentiles = this.props.data.tilebag.concat (this.props.data.computerrack.split (""));
		
		var count = hiddentiles.reduce (function (count, tile)
		{
			count [tile] = (count [tile] ? count [tile] + 1 : 1);
			
			return count;
		}, {});
		
		var output = [];
		
		for (letter in model.config.lettercount)
		{
			if (count [letter] > 0)
				output.push (view.maketilehtml ("", letter) + ' x ' + count [letter]);
		}
	
		return React.createElement ('div', { id: 'lookupdialog', className: 'dialog' + (this.props.tilebagvisible ? ' visible' : '') },
					React.createElement ('div', { className: 'content' },
						React.createElement ('h1', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-shopping-bag"></i> ' + localize ("Tiles") }}),
						React.createElement ('hr', { }),
						React.createElement ('p', { dangerouslySetInnerHTML: { __html: output.join (' ') }})),
					React.createElement ('div', { id: 'lookupsubmit', className: 'dialogbutton', onClick: this.submit },
						React.createElement ('span', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-check"></i>' }})));
	},
	
	componentDidMount: function ()
	{
		var dialog = ReactDOM.findDOMNode (this);
		
		dialog.style.top = "40%";
		dialog.style.marginTop = (0 - (dialog.offsetHeight) * 2 / 5) + "px";
		
		dialog.style.left = "50%";
		dialog.style.marginLeft = (0 - (dialog.offsetWidth) / 2) + "px";
	},
	
	submit: function ()
	{
		view.hidetilebagdialog ();
	}
});

var RestartDialog = createReactClass ({ displayName: "RestartDialog",render: function ()
	{
		var languagelabel = localize ('Language') + ': ';
		var boardx = localize ('Width') + ': ';
		
		return React.createElement ('div', { id: 'restartdialog', className: 'dialog' + (this.props.restartvisible ? ' visible' : '') },
					React.createElement ('div', { className: 'content' },
						React.createElement ('h1', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-crow"></i> ' + localize ("Argrams") }}),
						React.createElement ('hr', { }),
						React.createElement ('form', { },
							React.createElement ('table', { },
								
								React.createElement ('tr', { },
									React.createElement ('td', { },
										
										React.createElement ('p', {}, localize ("Start a new game?"))
								
								/*
										React.createElement ('br'),
										React.createElement ('p', { style: { 'fontStyle' : 'italic', 'fontSize': '.7em' }}, "future versions will let you set configuration here -- for now, to change the tiles / board / rules, download the game and modify the config file")))
								*/
								
								/*
								React.createElement ('tr', { },
									React.createElement ('td', { },
										React.createElement ('p', { },
											React.createElement ('span', { dangerouslySetInnerHTML: { __html: localize ('Board Size') + ': ' }}),
											React.createElement ('input', { name: "boardx", value: this.state.boardx, style: { width: "50px" }, onChange: this.updatefield }),
											React.createElement ('span', { }, ' x '),
											React.createElement ('input', { name: "boardy", value: this.state.boardy, style: { width: "50px" }, onChange: this.updatefield })
											))),
								*/
								
								/*
								React.createElement ('tr', { },
									React.createElement ('td', { },
										React.createElement ('p', { },
											React.createElement ('span', { dangerouslySetInnerHTML: { __html: localize ('Rack Size') + ': ' }}),
											React.createElement ('input', { name: "racksize", value: this.state.racksize, style: { width: "50px" }, onChange: this.updatefield })
											)))
								*/
										))))),
								
					React.createElement ('div', { id: 'restartsubmit', className: 'dialogbutton', onClick: this.submit },
						React.createElement ('span', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-check"></i>' }})),
					React.createElement ('div', { id: 'restartcancel', className: 'dialogbutton', onClick: this.cancel },
						React.createElement ('span', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-times"></i>' }})));
	},
	
	getInitialState: function ()
	{
		return { originallanguage: this.props.config.language, language: this.props.config.language,
				 originalboardx: this.props.config.boardx, boardx: this.props.config.boardx,
				 originalboardy: this.props.config.boardy, boardy: this.props.config.boardy,
				 originalracksize: this.props.config.racksize, racksize: this.props.config.racksize };
	},
	
	componentDidMount: function ()
	{
		var dialog = ReactDOM.findDOMNode (this);
		
		dialog.style.top = "40%";
		dialog.style.marginTop = (0 - (dialog.offsetHeight) * 2 / 5) + "px";
		
		dialog.style.left = "50%";
		dialog.style.marginLeft = (0 - (dialog.offsetWidth) / 2) + "px";
	},
	
	updatefield: function (evt)
	{
		var state = {}
		
		state [evt.target.name] = evt.target.value;
		
		this.setState (state);
	},
	
	cancel: function ()
	{
		view.hiderestartdialog ();
	},
	
	submit: function ()
	{
		if ((this.props.data.status != 1 && this.props.placements.length == 0) || confirm (localize ("Abandon current game?")))
		{
			if (this.state.language != this.state.originallanguage)
			{
				model.config.language = this.state.language;
				
				loaddictionary (this.state.language);
			}
			
			view.placementstorack ();
			view.hidepeek ();
				
			model.config.boardx = parseInt (this.state.boardx);
			model.config.boardy = parseInt (this.state.boardy);
			model.config.racksize = parseInt (this.state.racksize);
			
			model.startnewgame ();
		}
		
		view.hiderestartdialog ();
	}
});
	
var SettingsDialog = createReactClass ({ displayName: "SettingsDialog",

	render: function ()
	{
		var levellabel = localize ('Computer Level') + ' ';
		
		return React.createElement ('div', { id: 'settingsdialog', className: 'dialog' + (this.props.settingsvisible ? ' visible' : '') },
					React.createElement ('div', { className: 'content' },
						React.createElement ('h1', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-cog"></i> ' + localize ("Settings") }}),
						React.createElement ('hr', { }),
						React.createElement ('form', { },
							React.createElement ('table', { },
								React.createElement ('tr', { },
									React.createElement ('td', { },
										React.createElement ('p', { },
											React.createElement ('span', { }, levellabel),
											React.createElement ('select', { name: "computerlevel", value: this.state.computerlevel, onChange: this.updatefield },
												React.createElement ('option', { value: 1 }, "1"),
												React.createElement ('option', { value: 2 }, "2"),
												React.createElement ('option', { value: 3 }, "3"),
												React.createElement ('option', { value: 4 }, "4"),
												React.createElement ('option', { value: 5 }, "5"))))),
								React.createElement ('tr', { },
									React.createElement ('td', { },
										React.createElement ('p', { },
											React.createElement ('input', { id: 'showlegal', name: 'showlegal', type: 'checkbox', checked: this.state.showlegal, onChange: this.updatefield }),
											React.createElement ('label', { htmlFor: 'showlegal', dangerouslySetInnerHTML: { __html: ' ' + localize ('Show Legal Words') }}),
											))),
								React.createElement ('tr', { },
									React.createElement ('td', { },
										React.createElement ('p', { },
											React.createElement ('input', { id: 'showcheats', name: 'showcheats', type: 'checkbox', checked: this.state.showcheats, onChange: this.updatefield }),
											React.createElement ('label', { htmlFor: 'showcheats', dangerouslySetInnerHTML: { __html: ' ' + localize ('Show Helper Tools') }}),
											)))
										))),
								
					React.createElement ('div', { id: 'settingssubmit', className: 'dialogbutton', onClick: this.submit },
						React.createElement ('span', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-check"></i>' }})),
					React.createElement ('div', { id: 'settingscancel', className: 'dialogbutton', onClick: this.cancel },
						React.createElement ('span', { dangerouslySetInnerHTML: { __html: '<i class="fas fa-times"></i>' }})));
	},
	
	getInitialState: function ()
	{
		return { originalcomputerlevel: this.props.computerlevel, computerlevel: this.props.computerlevel,
				 originalshowlegal: this.props.showlegal, showlegal: this.props.showlegal,
				 originalshowcheats: this.props.showcheats, showcheats: this.props.showcheats };
	},
	
	componentDidMount: function ()
	{
		var dialog = ReactDOM.findDOMNode (this);
		
		dialog.style.top = "40%";
		dialog.style.marginTop = (0 - (dialog.offsetHeight) * 2 / 5) + "px";
		
		dialog.style.left = "50%";
		dialog.style.marginLeft = (0 - (dialog.offsetWidth) / 2) + "px";
	},
	
	updatefield: function (evt)
	{
		var state = {}
		
		if (evt.target.type == "checkbox")
		{
			state [evt.target.name] = evt.target.checked;
		}
		else
		{
			state [evt.target.name] = evt.target.value;
		}
		
		this.setState (state);
	},
	
	cancel: function ()
	{
		view.hidesettingsdialog ();
	},
	
	submit: function ()
	{
		if (this.state.computerlevel != this.state.originalcomputerlevel)
		{
			model.setcomputerlevel (this.state.computerlevel);
		}
		
		if (this.state.showlegal != this.state.originalshowlegal)
		{
			view.setshowlegal (this.state.showlegal);
		}
		
		if (this.state.showcheats != this.state.originalshowcheats)
		{
			view.setshowcheats (this.state.showcheats);
		}
		
		view.hidesettingsdialog ();
	}
});

// --------------------------------------- End