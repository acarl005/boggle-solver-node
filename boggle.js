'use strict';

const readline = require('readline');
const fs = require('fs');
const Trie = require('./trie');


const english = new Trie; // store all words in a trie
let loadedEnglish = false; // flag for whether or not we're done loading english.txt

const lineReader = readline.createInterface({ // stream in each word
  input: fs.createReadStream(__dirname + '/english.txt')
});

lineReader.on('line', line => { // add each english words to the trie
  english.add(line.trim());
});

lineReader.on('close', () => loadedEnglish = true);

class Boggle {

  constructor(letters) {
    this.board = [];
    this.words = [];

    if (letters) {
      if (letters.length !== 16 || !letters.match(/^[a-z]+$/i)) {
        let diff = letters.length - 16;
        throw new Error(`Need letters to fill a 4x4 board. Need ${Math.abs(diff)} ${diff > 0 ? 'less' : 'more'}.`);
      }
      letters = letters.toUpperCase();
    }

    // "new" dice set according to http://www.bananagrammer.com/2013/10/the-boggle-cube-redesign-and-its-effect.html
    const dice = [
      'AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS',
      'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY',
      'DISTTY', 'EEGHNW', 'EEINSU', 'EHRTVW',
      'EIOSST', 'ELRTTY', 'HIMNUQ', 'HLNNRZ',
    ];

    // "classic" dice set
    // const dice = [
    //   'AACIOT', 'ABILTY', 'ABJMOQ', 'ACDEMP',
    //   'ACELRS', 'ADENVZ', 'AHMORS', 'BIFORX',
    //   'DENOSW', 'DKNOTU', 'EEFHIY', 'EGKLUY',
    //   'EGINTV', 'EHINPS', 'ELPSTU', 'GILRUW',
    // ];

    function roll() {
      let diceIndex = Math.floor(Math.random() * dice.length);
      let die = dice.splice(diceIndex, 1)[0];
      let stringIndex = Math.floor(Math.random() * die.length);
      return die[stringIndex];
    }

    for (let i = 0; i < 4; i++) {
      let row = [];
      for (let j = 0; j < 4; j++) {
        if (letters)
          row.push(letters[i * 4 + j]);
        else
          row.push(roll());
      }
      this.board.push(row);
    }
  }

  print() {
    console.log(this.toString());
  }

  toString() {
    let boardStr = `\
    ╔═══╦═══╦═══╦═══╗
    ║ % ║ % ║ % ║ % ║
    ╠═══╬═══╬═══╬═══╣
    ║ % ║ % ║ % ║ % ║
    ╠═══╬═══╬═══╬═══╣
    ║ % ║ % ║ % ║ % ║
    ╠═══╬═══╬═══╬═══╣
    ║ % ║ % ║ % ║ % ║
    ╚═══╩═══╩═══╩═══╝
    `;
    // fill in the boardStr with the letters
    this.board.forEach(row => {
      row.forEach(char => {
        if (char === 'Q') {
          boardStr = boardStr.replace('% ', 'Qu');
        } else {
          boardStr = boardStr.replace('%', char);
        }
      });
    });
    return boardStr;
  }

  solve(done) {
    if (loadedEnglish) { // begin solving if we have loaded english.txt
      this._startPaths(done);
    } else { // if english.txt hasn't loaded into the trie yet, wait until it has
      lineReader.on('close', this._startPaths.bind(this, done));
    }
    return this;
  }

  _startPaths(done) {
    let that = this;
    let visited = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    for (let x = 0; x < 4; x++) {  // begin a path at each position on the grid
      for (let y = 0; y < 4; y++) {
        visit(y, x, '');
      }
    }

    function visit(y, x, word) {
      visited[y][x] = true; // mark this space as visited
      let letter = that.board[y][x];
      word += (letter === 'Q' ? 'QU' : letter); // account for the "Qu" die
      if (english.contains(word)) { // if its a valid english word, add it to the array
        that.words.push(word);
      }
      if (english.isPrefix(word)) { // if that is a potential prefix for a valid english word, keep going
        if (that._has(y - 1, x - 1) && !visited[y - 1][x - 1]) {
          visit(y - 1, x - 1, word);
        }
        if (that._has(y - 1, x) && !visited[y - 1][x]) {
          visit(y - 1, x, word);
        }
        if (that._has(y - 1, x + 1) && !visited[y - 1][x + 1]) {
          visit(y - 1, x + 1, word);
        }
        if (that._has(y, x - 1) && !visited[y][x - 1]) {
          visit(y, x - 1, word);
        }
        if (that._has(y, x + 1) && !visited[y][x + 1]) {
          visit(y, x + 1, word);
        }
        if (that._has(y + 1, x - 1) && !visited[y + 1][x - 1]) {
          visit(y + 1, x - 1, word);
        }
        if (that._has(y + 1, x) && !visited[y + 1][x]) {
          visit(y + 1, x, word);
        }
        if (that._has(y + 1, x + 1) && !visited[y + 1][x + 1]) {
          visit(y + 1, x + 1, word);
        }
      }
      visited[y][x] = false; // unmark this as visited so other paths can visit it
    }

    let uniqWords = Array.from(new Set(this.words)); // convert from array to set and back to array to enforce uniqueness
    uniqWords.sort((a, b) => { // sort primarily by length, secondarily by first letter alphabetically
      return (a.length - b.length) * 1000 + (a.charCodeAt(0) - b.charCodeAt(0));
    });

    this.words = uniqWords;
    if (done) {
      process.nextTick(done, uniqWords);
    }
  }

  contains(target) {
    if(target.length < 3) {
      return false;
    }
    target = target.toUpperCase();
    let that = this;
    let found = false;
    let visited = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];
    for (let x = 0; x < 4; x++) {  // begin a path at each position on the grid
      for (let y = 0; y < 4; y++) {
        found || visit(y, x, '');
      }
    }
    return found;

    function visit(y, x, word) {
      word += that.board[y][x];
      let i = word.length - 1;
      if (word[i] !== target[i]){
        return;
      }
      if (word.length === target.length) {
        return found = true;
      }
      visited[y][x] = true;
      if (that._has(y - 1, x - 1) && !visited[y - 1][x - 1]) {
        visit(y - 1, x - 1, word);
      }
      if (that._has(y - 1, x) && !visited[y - 1][x]) {
        visit(y - 1, x, word);
      }
      if (that._has(y - 1, x + 1) && !visited[y - 1][x + 1]) {
        visit(y - 1, x + 1, word);
      }
      if (that._has(y, x - 1) && !visited[y][x - 1]) {
        visit(y, x - 1, word);
      }
      if (that._has(y, x + 1) && !visited[y][x + 1]) {
        visit(y, x + 1, word);
      }
      if (that._has(y + 1, x - 1) && !visited[y + 1][x - 1]) {
        visit(y + 1, x - 1, word);
      }
      if (that._has(y + 1, x) && !visited[y + 1][x]) {
        visit(y + 1, x, word);
      }
      if (that._has(y + 1, x + 1) && !visited[y + 1][x + 1]) {
        visit(y + 1, x + 1, word);
      }
      visited[y][x] = false;
    }
  }

  // returns true if the given coordinate is inside the board
  _has(y, x) {
    return x >= 0 &&
           x < 4  &&
           y >= 0 &&
           y < 4;
  }

}


module.exports = Boggle;
