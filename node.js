var scraper = require('website-scraper');
var cheerio = require('cheerio');
var request = require('request');
var express = require('express');
var fs = require('fs');
var app     = express();
productDetail = 'http://localhost:8081/flipkart.html';
var links = [];
request(productDetail, function(error, response, html){
  var $ = cheerio.load(html);
  links.push('http://localhost:8081/');
  $('.product-unit').each(function(){
        var data = $(this);
        // console.log(data);
        var t = $('.pu-title', this).text().trim();
        var slug = t.toString().toLowerCase()
                            .replace(/\s+/g, '-')        // Replace spaces with -
                            .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                            .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                            .replace(/^-+/, '')          // Trim - from start of text
                            .replace(/-+$/, '');
        var a = $('a', this);
        // console.log(t,a);
        var url = a.attr('href');
        links.push({filename:slug+'.html',url:url});
  });
  // console.log(links);
  fs.writeFile('output.json', JSON.stringify(links, null, 4), function(err){
    console.log('File successfully written! - Check your project directory for the output.json file');
  });
});
scraper.scrape({
  urls: [
    {url: 'http://nodejs.org/about', filename: 'about.html'},
    {url: 'http://www.flipkart.com/moto-g-3rd-generation/p/itme9ysjr7mfry3n/', filename: 'moto-g-3rd-generation-black-16-gb.html'}
  ],
  directory: 'src/',
  subdirectories: [
    {directory: 'img', extensions: ['.jpg', '.png', '.svg']},
    {directory: 'css', extensions: ['.css']}
  ],
  sources: [
    {selector: 'img', attr: 'src'},
    {selector: 'link[rel="stylesheet"]', attr: 'href'}
  ],
  request: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
    }
  }
}).then(function (result) {
  console.log(result);
}).catch(function(err){
  console.log(err);
});
app.use(express.static('public'));
app.listen('8081')
