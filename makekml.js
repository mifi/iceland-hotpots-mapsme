const sites = require('./sites');
const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');
const bluebird = require('bluebird');

bluebird.promisifyAll(fs);

//console.log(sites);


function getPathToHtml(site) {
  return __dirname + '/data/' + site.pathName;
}

function getPlacemark(site) {
  return { name: [ site.name ],
      description: [ site.html ],
      TimeStamp: [ { when: [ '2016-06-17T11:46:58Z' ] } ],
      styleUrl: [ '#placemark-purple' ],
      Point: [ { coordinates: [ site.lng + ',' + site.lat ] } ],
      ExtendedData:
       [ { '$': { 'xmlns:mwm': 'http://mapswith.me' },
           'mwm:scale': [ '8' ] } ] };
}

function getKml(setName, sites) {
  return { kml:
   { '$': { xmlns: 'http://earth.google.com/kml/2.2' },
     Document:
      [ { Style:
           [ { '$': { id: 'placemark-blue' },
               IconStyle: [ { Icon: [ { href: [ 'http://mapswith.me/placemarks/placemark-blue.png' ] } ] } ] },
             { '$': { id: 'placemark-brown' },
               IconStyle: [ { Icon: [ { href: [ 'http://mapswith.me/placemarks/placemark-brown.png' ] } ] } ] },
             { '$': { id: 'placemark-green' },
               IconStyle: [ { Icon: [ { href: [ 'http://mapswith.me/placemarks/placemark-green.png' ] } ] } ] },
             { '$': { id: 'placemark-orange' },
               IconStyle: [ { Icon: [ { href: [ 'http://mapswith.me/placemarks/placemark-orange.png' ] } ] } ] },
             { '$': { id: 'placemark-pink' },
               IconStyle: [ { Icon: [ { href: [ 'http://mapswith.me/placemarks/placemark-pink.png' ] } ] } ] },
             { '$': { id: 'placemark-purple' },
               IconStyle: [ { Icon: [ { href: [ 'http://mapswith.me/placemarks/placemark-purple.png' ] } ] } ] },
             { '$': { id: 'placemark-red' },
               IconStyle: [ { Icon: [ { href: [ 'http://mapswith.me/placemarks/placemark-red.png' ] } ] } ] },
             { '$': { id: 'placemark-yellow' },
               IconStyle: [ { Icon: [ { href: [ 'http://mapswith.me/placemarks/placemark-yellow.png' ] } ] } ] } ],
          name: [ setName ],
          visibility: [ '1' ],
          Placemark:
           sites.map(getPlacemark) } ] } };
}


bluebird.all(sites.map(site => fs.readFileAsync(getPathToHtml(site), 'utf8')))
.then(function(fileContents) {
  sites.forEach((site, i) => {
    site.html = fileContents[i];
  });

  const builder = new xml2js.Builder({xmldec: {standalone: false}});
  const xml = builder.buildObject(getKml('test', sites));
  return fs.writeFileAsync(__dirname + '/' + 'output.kml', xml);
})
.then(() => console.log('done'));
