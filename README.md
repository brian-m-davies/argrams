# Argrams

The is a free, browser-based crossword tile game, in the spirit of Scrabble, Words With Friends, and Lexulous.

It is based on Amnon David's **[JScrab](http://amnond.github.io/jscrab)** from 2013.  There isn't a lot of the original code left, but my hat
is off to Amnon for providing a stable foundation, with a clear devision between model and view, a nice computer play animation, and a genuinely
brilliant regex solution for move generation.


## Getting Started

The game can be played over the web.  You only need to download the package if you want to customize the game.

Drag your tiles to the board to play.  The main controls are the yellow "play", "recall", "pass" and "swap" buttons.
Click the gear for the Settings panel, to choose the computer level and which computer assists you'd like.
Click the bird to start a new game.

The game can be played in
[English](https://brian-m-davies.github.io/rscrab/index.html),
[Spanish](https://brian-m-davies.github.io/rscrab/index-es.html),
[French](https://brian-m-davies.github.io/rscrab/index-fr.html),
[Italian](https://brian-m-davies.github.io/rscrab/index-it.html),
and [Russian](https://brian-m-davies.github.io/rscrab/index-ru.html).
Some languages are more robust than others.  See the section below on translation for more information.

If you're on a mobile device, there are specific layouts for regular-sized iPad and iPhone 6.  It probably works on other devices, but
I haven't tested there.

If you're got a keyboard, there are shortcuts for all the buttons: type return for "play", escape for "recall", space for "pass", delete for "swap",
plus "!" for new game, "@" for the settings dialog, and shift-3 through 6 for the helpers if you have that panel active.


## Nerdy Details

### Interface

This version has a new, modern interface built on React, with a completely new look and feel.  Graphics are mostly SVG and FontAwesome icons,
with wood backgrounds to the tiles.  Buttons and dialogs have easing effects.  You can choose whether or not the program tells you if a move is
legal and how many points it would be worth, and there are helpers, like word lookup, hint, and peeking at the computer's tiles or the tile bag.


### Engine

The engine is significantly more robust.  This version eliminated a number of edge case bugs in play and scoring.  Display of word definitions has
been handed off to outside web sites, and the dictionary format required for Regex is now generated dynamically, so the load time is about 20% of what it was.


### Strategy

The original JScrab capped the points per move based on level, which meant it would play words you had never heard of as long as they weren't worth
much, and turn down obvious moes with simple words on bonus squares because they were worth too much.  The computer strategy is now more realistic.

The dictionary is now marked up based on the computer level, so it will no longer uncork obscure words at low levels.  Moves using blank, S, E, and X
have a penalty -- the computer makes sure it's "worth it" to use one of those.  Moves using W, U, V, and Q have a bonus -- the computer favors moves
that get those out of its rack.  The first move generation is more robust -- previously the computer would unnecessarily pass a lot if you let it play first.
The computer will now swap tiles rather than just pass, which solves the problem of it basically surrendering the game if it gets an intractable rack.


### Configurable

The game is designed to be highly configurable.  If you download the package and open the English config.js file, each line is documented.  Hopefully, it's to
the point where non-programmers can change the game parameters.

The board size, bonus square layout, rack size, tile count, tile points, bingo rules, and bonus square behavior are all customizable.  If you want to
try a game with multiple star tiles, zero point tiles, quadruple letter squares, incremental bingos, black hole squares that are worthless to play on,
this game was made for you.


### Translation

The original JScrab included rough versions in Spanish and Russian.  The Spanish version is now substantially improved (though it could still use some work),
and I've added rough French and Italian versions.

For Spanish, the dictionary now includes words with Ñ, so that tile is no longer deadweight.  The engine can now handle digraphs, so the game now
supports CH, LL, and RR tiles, as they are (or were) considered individual letters in Spanish.  Frequency data has been added to the dictionary, so the
play at lower levels should be more realistic.  And you can now look up word definitions online.

For French, the dictionary has frequency data, so the play should be plausible at lower levels.  You can look up word definitions online.  But the
interface text is all still in English.

Russian has no frequency data, so it will use obscure words at low levels.  The interface text translations are just what I could salvage from JScrab.

Italian also has no frequency data, and the interface text is all still in English.

Any native speakers of Spanish, French, Italian, or Russian out there, I would love help translating the 30 or so pieces of text used in the interface,
and also help evaluating the computer skill levels.


### Code

If you're interested in working on the code, the model.js contains the basic game configuration and state, and the functions to run the game.  The view.js
contains all the properties and events required for display.  The widgets.js are React classes to display the GUI.  In general, the model updates the view,
the view sends properties to the widgets, and the widgets call functions in the model.

There are 2 fundamental data objects:
* a "placement" is a letter, the point value, and the coordinates
* a "move" is a word, the score, the letters used, the start coordinates, an array of placements, an array of all
words created including orthogonal words, a flag for horizontal versus vertical, and a flag for bingo.
