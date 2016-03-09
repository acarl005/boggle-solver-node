var expect = require('chai').expect;
var Boggle = require('../boggle');

describe('Boggle solver', () => {
  it('should solve the board', done => {
    var ans = [
      'ARE', 'AGO', 'AGE', 'ERA', 'EGG', 'ERR', 'EGO', 'ERG', 'EVE', 'ERE', 'EAR', 'JOG', 'KEG',
      'OVA', 'OAK', 'OAR', 'ORE', 'ROE', 'REV', 'RAG', 'AVER', 'EVER', 'EAVE', 'ERGO', 'GROG',
      'GEAR', 'GAVE', 'GORE', 'OVER', 'OGRE', 'RAVE', 'RAKE', 'REAR', 'ROAR', 'RAGE', 'RARE', 'ROVE',
      'ERROR', 'EAGER', 'GORGE', 'GROVE', 'GRAVE', 'ROVER', 'ROGER', 'RARER', 'GRAVER', 'OVERAGE'
    ];
    var boggle = new Boggle('eorgvregearjkgoe');
    boggle.solve(words => {
      expect(words).to.eql(ans);
      done();
    });
  });

  it('should solve the board faster because it doesn\'t have to load english again', done => {
    var ans = [
      'ARE', 'AGO', 'AGE', 'ERA', 'EGG', 'ERR', 'EGO', 'ERG', 'EVE', 'ERE', 'EAR', 'JOG', 'KEG',
      'OVA', 'OAK', 'OAR', 'ORE', 'ROE', 'REV', 'RAG', 'AVER', 'EVER', 'EAVE', 'ERGO', 'GROG',
      'GEAR', 'GAVE', 'GORE', 'OVER', 'OGRE', 'RAVE', 'RAKE', 'REAR', 'ROAR', 'RAGE', 'RARE', 'ROVE',
      'ERROR', 'EAGER', 'GORGE', 'GROVE', 'GRAVE', 'ROVER', 'ROGER', 'RARER', 'GRAVER', 'OVERAGE'
    ];
    var boggle = new Boggle('eorgvregearjkgoe');
    boggle.solve(words => {
      expect(words).to.eql(ans);
      done();
    });
  });

  it('should have working "contains" method', () => {
    var boggle = new Boggle('eorgvregearjkgoe');
    expect(boggle.contains('are')).to.be.true;
    expect(boggle.contains('oar')).to.be.true;
    expect(boggle.contains('grave')).to.be.true;
    expect(boggle.contains('overage')).to.be.true;
    expect(boggle.contains('a')).to.be.false;
    expect(boggle.contains('ar')).to.be.false;
    expect(boggle.contains('not')).to.be.false;
    expect(boggle.contains('gores')).to.be.false;
    expect(boggle.contains('randomstuff')).to.be.false;
    expect(boggle.contains('roverd')).to.be.false;
  });
});
