# Node Boggle Solver

### Using JavaScript to generate a Boggle board and then find every English word in that board. All the words are stored in a trie for efficiency. Use as a command line tool or a NodeJS module.

```
npm install solve-boggle
```


## Boggle solver module

You can supply the letters to the board in the constructor.
```javascript
const Boggle = require('solve-boggle');

let boggle = new Boggle('adofhptogijrstjg');
boggle.solve(words => {
  boggle.print(); // format the board nicely
  // "words" is an array of the board's words. It is now also referenced as boggle.words
  console.log(words.length + ' words');
  console.log(words.join(', '));
});
```

Or you can omit this to generate a random board.
```javascript
const Boggle = require('solve-boggle');

let boggle = new Boggle;
boggle.solve(words => {
  boggle.print();
  console.log(words);
});
```

Check for individual words in the board.
```javascript
let boggle = new Boggle('eorgvregearjkgoe');
boggle.contains('grave'); // true
boggle.contains('randomstuff') // false
```

## Boggle solver CLI

Board letters are the only argument (optional). Random board is generated if no argument supplied.
```bash
node_modules/.bin/solve-boggle erogijeratierstp
```

```
┌───┬───┬───┬───┐
│ E │ R │ O │ G │
├───┼───┼───┼───┤
│ I │ J │ E │ R │
├───┼───┼───┼───┤
│ A │ T │ I │ E │
├───┼───┼───┼───┤
│ R │ S │ T │ P │
└───┴───┴───┴───┘

103 words

AIR, ATE, ART, ERE, EGO, ERG, ETA, GET, GEE, IRE, ITS, JAR, JOG, JET, ORE, PER, PIS, PIT, PEE, PET, PIE, RAT, REP, RIP, ROE, SIP, SIR, SIT, SAT, TEE, TAR, TIP, TIE, TIT, ARTS, ERGO, GRIP, GRIT, GORE, GETS, JEEP, JEER, JETS, JARS, OGRE, PETS, PIER, PITS, PITA, PEER, RATE, RATS, RIPE, RITE, REIS, SATE, STIR, SIRE, STAR, SITE, STEP, TITS, TSAR, TARS, TIRO, TIRE, TIER, ASTER, ASTIR, EERIE, EGRET, GRIST, GRITS, GREET, GRIPE, ROGER, STEER, SITAR, STAIR, STEEP, TASTE, ATTIRE, ARTIER, ARTIST, EGRETS, GREETS, GORIER, PETITE, RASTER, REGRET, RETIRE, SATIRE, SITTER, STEREO, TASTER, ARTSIER, ARTISTE, PETTIER, REGRETS, RATTIER, TASTIER, GRITTIER, JITTERIER
```


Instead, you can install globally...
```bash
npm install -g solve-boggle
```

and invoke the command like this.
```bash
solve-boggle erogijeratierstp
```
