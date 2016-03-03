var readline = require('readline');
var fs = require('fs');
var Trie = require('./trie');
var Boggle = require('./boggle');

var boggle = new Boggle;
boggle.print();

var english = new Trie;
var lineReader = readline.createInterface({
  input: fs.createReadStream('english.txt')
});

lineReader.on('line', function(line) { // add each english words to the trie
  if (line.search(/^[a-z]+$/) != -1) { // filter out words with accents on the letters
    english.add(line.trim());
  }
});

lineReader.on('close', solve);

function solve() {
  var words = [];
  var visited = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ];

  for (var x = 0; x < 4; x++) {  // begin a path at each position on the grid
    for (var y = 0; y < 4; y++) {
      visit(y, x, '');
    }
  }

  function visit(y, x, word) {
    visited[y][x] = true; // mark this space as visited
    var letter = boggle.board[y][x];
    word += (letter === 'Q' ? 'QU' : letter); // account for the "Qu" die
    if (english.contains(word)) { // if its a valid english word, add it to the array
      words.push(word);
    }
    if (english.isPrefix(word)) { // if this is a potential prefix for a valid english word, keep going
      if (boggle.has(y - 1, x - 1) && !visited[y - 1][x - 1]) {
        visit(y - 1, x - 1, word);
      }
      if (boggle.has(y - 1, x) && !visited[y - 1][x]) {
        visit(y - 1, x, word);
      }
      if (boggle.has(y - 1, x + 1) && !visited[y - 1][x + 1]) {
        visit(y - 1, x + 1, word);
      }
      if (boggle.has(y, x - 1) && !visited[y][x - 1]) {
        visit(y, x - 1, word);
      }
      if (boggle.has(y, x + 1) && !visited[y][x + 1]) {
        visit(y, x + 1, word);
      }
      if (boggle.has(y + 1, x - 1) && !visited[y + 1][x - 1]) {
        visit(y + 1, x - 1, word);
      }
      if (boggle.has(y + 1, x) && !visited[y + 1][x]) {
        visit(y + 1, x, word);
      }
      if (boggle.has(y + 1, x + 1) && !visited[y + 1][x + 1]) {
        visit(y + 1, x + 1, word);
      }
    }
    visited[y][x] = false; // unmark this as visited so other paths can visit it
  }

  uniqWords = Array.from(new Set(words)); // convert from array to set and back to array to enforce uniqueness
  console.log(uniqWords.length + ' words\n');
  console.log(uniqWords.join(', '));

}
