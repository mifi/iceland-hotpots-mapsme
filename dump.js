const childProcess = require('child_process');
const sites = require('./sites');
const Inliner = require('inliner');
const bluebird = require('bluebird');
const fs = require('fs');

bluebird.promisifyAll(fs);

//sites = sites.filter(function(site) { return site.url ==='http://hotpoticeland.com/gjorvidalslaug/';});
//console.log(sites);


let i = 0;

function proceed() {
  if (i >= sites.length) return;

  const site = sites[i];

  new Inliner(site.url, function (error, html) {
    console.log(site.pathName);
    fs.writeFileAsync(__dirname + '/data/' + site.pathName, html)
    .then(() => {
      i++;
      proceed();
    });
  });
}

proceed();
