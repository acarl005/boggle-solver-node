'use strict';

const EventEmitter = require('events');
const readline = require('readline');
const fs = require('fs');
const Trie = require('./trie');


const english = new Trie;
let loadedEnglish = false;

const lineReader = readline.createInterface({
  input: fs.createReadStream(__dirname + '/english.txt')
});

lineReader.on('line', line => { // add each english words to the trie
  if (line.search(/^[a-z]+$/) != -1) { // filter out words with accents on the letters
    english.add(line.trim());
  }
});

lineReader.on('close', () => loadedEnglish = true);

class Boggle extends EventEmitter {

  constructor(letters) {
    super();
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

  // returns true if the given coordinate is inside the board
  has(y, x) {
    return x >= 0 &&
           x < 4  &&
           y >= 0  &&
           y < 4;
  }

  print() {
    let boardStr = `
    ┌───┬───┬───┬───┐
    │ % │ % │ % │ % │
    ├───┼───┼───┼───┤
    │ % │ % │ % │ % │
    ├───┼───┼───┼───┤
    │ % │ % │ % │ % │
    ├───┼───┼───┼───┤
    │ % │ % │ % │ % │
    └───┴───┴───┴───┘
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
    console.log(boardStr);
  }

  solve() {
    if (loadedEnglish) { // begin solving if we have loaded english.txt
      this._startPaths();
    } else { // if english.txt hasn't loaded into the trie yet, wait until it has
      lineReader.on('close', this._startPaths.bind(this));
    }
  }

  _startPaths() {
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
        if (that.has(y - 1, x - 1) && !visited[y - 1][x - 1]) {
          visit(y - 1, x - 1, word);
        }
        if (that.has(y - 1, x) && !visited[y - 1][x]) {
          visit(y - 1, x, word);
        }
        if (that.has(y - 1, x + 1) && !visited[y - 1][x + 1]) {
          visit(y - 1, x + 1, word);
        }
        if (that.has(y, x - 1) && !visited[y][x - 1]) {
          visit(y, x - 1, word);
        }
        if (that.has(y, x + 1) && !visited[y][x + 1]) {
          visit(y, x + 1, word);
        }
        if (that.has(y + 1, x - 1) && !visited[y + 1][x - 1]) {
          visit(y + 1, x - 1, word);
        }
        if (that.has(y + 1, x) && !visited[y + 1][x]) {
          visit(y + 1, x, word);
        }
        if (that.has(y + 1, x + 1) && !visited[y + 1][x + 1]) {
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
    process.nextTick(this.emit.bind(this), 'solved', uniqWords);

  }

}


module.exports = Boggle;
