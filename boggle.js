// "new" dice set according to http://www.bananagrammer.com/2013/10/the-boggle-cube-redesign-and-its-effect.html
var dice = [
  'AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS',
  'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY',
  'DISTTY', 'EEGHNW', 'EEINSU', 'EHRTVW',
  'EIOSST', 'ELRTTY', 'HIMNUQ', 'HLNNRZ',
];

// "classic" dice set
// var dice = [
//   'AACIOT', 'ABILTY', 'ABJMOQ', 'ACDEMP',
//   'ACELRS', 'ADENVZ', 'AHMORS', 'BIFORX',
//   'DENOSW', 'DKNOTU', 'EEFHIY', 'EGKLUY',
//   'EGINTV', 'EHINPS', 'ELPSTU', 'GILRUW',
// ];

function Boggle() {

  function roll() {
    var diceIndex = Math.floor(Math.random() * dice.length);
    var die = dice.splice(diceIndex, 1)[0];
    var stringIndex = Math.floor(Math.random() * die.length);
    return die[stringIndex];
  }

  this.board = [];

  for (var i = 0; i < 4; i++) {
    var row = [];
    for (var j = 0; j < 4; j++) {
      row.push(roll());
    }
    this.board.push(row);
  }
}

Boggle.prototype.has = function(y, x) {
  return x >= 0 && x < 4 && y >= 0 && y < 4;
};

Boggle.prototype.print = function() {
  if (!this.boardStr) {
    this.boardStr = `
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
    this.board.forEach(row => {
      row.forEach(char => {
        if (char === 'Q') {
          this.boardStr = this.boardStr.replace('% ', 'Qu');
        } else {
          this.boardStr = this.boardStr.replace('%', char);
        }
      });
    });
  }
  console.log(this.boardStr);
};

module.exports = Boggle;
