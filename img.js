var fs = require('fs'),
  _ = require('underscore'),
  request = require('request'),
  cheerio = require('cheerio'),
  express = require('express'),
  app     = express(),
  basePath = "images/",
  // data = [{images:{src_large:'lenovo_files/lenovo-a2010-na-400x400-imaeaefthczhe8es.jpeg'}},{images:{src_large:'lenovo_files/lenovo-a2010-na-400x400-imaeaeftku77zvyq.jpeg'}}],
  urlRoot = "http://localhost:8081/";
var download = function(uri, filename, dir, callback) {
  // console.log(uri);

  // make the filename not need a directory
  var file = filename.split('/')[filename.split('/').length - 1];
  request.head(uri, function(err, res, body) {
    var r = request(uri).pipe(fs.createWriteStream(dir + file));
    r.on('close', callback);
    r.on('error', error);
  });
};

// iterate through array
// _.each(data, function(item) {
//   // console.log(item);
//   var img_src = item.images.src_large;
//   var filepath = (urlRoot + img_src).toString();
//
//   var directory = _.initial(filename.split('/')).join('/');
//   if (!fs.existsSync(directory)){
//     fs.mkdir(directory);
//   }
//   download(filepath, img_src, function() {
//     // console.log('downloaded', img_src);
//   });
// });

// handle errors
var error = function(message) {
  console.log(message);
};


// productDetail = 'http://www.flipkart.com/lenovo-a2010/p/itmeau2nrzntqqju?pid=MOBE93H6HDGDSWJY&al=Rl9I%2FEovmFPZrHvPX4W7nMldugMWZuE7Qdj0IGOOVquj16hxZ%2FzcQnbYOwIzUz5rB3%2F74nWgi1g%3D&ref=L%3A-7020515180318211250&srno=b_1&findingMethod=hp_widget';
productDetail = 'http://localhost:8081/lenovo.html';
request(productDetail, function(error, response, html){
  // console.log(error, response, html);
  if(!error){
    var $ = cheerio.load(html);

    var title, title2, title3;
    var json = {};



    // $('.pu-image').filter(function(){
    //       var data = $(this);
    //       var href = data.attr('href').text();
    //       json.href = href;
    // });

    $('.product-details h1').filter(function(){
          var data = $(this);
          name = data.text();
          json.name = name;
    });
    json.mainFeatures = [];
    $('.product-details ul.key-specifications li').each(function(){
          var data = $(this);
          json.mainFeatures.push(data.text());
    });
    json.keyFeatures = [];
    $('ul.keyFeaturesList li').each(function(){
          var data = $(this);
          json.keyFeatures.push(data.text());
    });
    json.generalFeatures = {};
    $('.productSpecs table.specTable tr').each(function(){
          var data = $(this),
              h = $('.groupHead', this).text().trim(),
              k = $('.specsKey', this).text().trim(),
              v = $('.specsValue', this).text().trim();
              // console.log(h);
          json.generalFeatures[k] = v;
    });
    json.images = [];
    $('.productImages img').each(function(){
          var data = $(this);
          var img = data.attr('src');

          var filepath = (urlRoot + img).toString();
          // console.log(img);
          // var directory = _.initial(img.split('/')).join('/');
          // // console.log(directory);
          var index = filepath.lastIndexOf("/");
          var yourCuttedString = filepath.substring(index+1, filepath.length);
          // var index2 = yourCuttedString.lastIndexOf("/");
          // var yourCuttedString2 = yourCuttedString.substring(index2+1,yourCuttedString.length);
          var slug = json.name.toString().toLowerCase()
                              .replace(/\s+/g, '-')        // Replace spaces with -
                              .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                              .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                              .replace(/^-+/, '')          // Trim - from start of text
                              .replace(/-+$/, '');
          var dir = basePath+slug+'/';
          json.images.push(dir+yourCuttedString);
          if (!fs.existsSync(dir)){
            fs.mkdir(dir);
          }

          download(filepath, img, dir, function() {
            // console.log('downloaded', img_src);
          });

          // console.log(img);

    });

    $('.selling-price').filter(function(){
          var data = $(this);
          price = data.text();
          json.price = price;
    });

    $('.product-details .subtitle').filter(function(){
          var data = $(this);
          size = data.text();
          json.size = size;

    });

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    });

}



  });

  app.use(express.static('public'));
  app.listen('8081')
