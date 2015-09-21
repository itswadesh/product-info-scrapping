var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var app     = express();

app.get('/scrape', function(req, res){
	// Let's scrape Anchorman 2
	//url = 'http://www.imdb.com/title/tt1229340/';
	imdb = 'http://localhost/imdb.html';
	// productDetail = 'http://www.flipkart.com/lenovo-a2010/p/itmeau2nrzntqqju?pid=MOBE93H6HDGDSWJY&al=Rl9I%2FEovmFPZrHvPX4W7nMldugMWZuE7Qdj0IGOOVquj16hxZ%2FzcQnbYOwIzUz5rB3%2F74nWgi1g%3D&ref=L%3A-7020515180318211250&srno=b_1&findingMethod=hp_widget';
	productDetail = 'http://localhost:8081/lenovo.html';
	request(productDetail, function(error, response, html){
		// console.log(error, response, html);
		if(!error){
			var $ = cheerio.load(html);

			var title, title2, title3;
			var json = {};

			

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
								k = $('.specsKey', this).text().trim(),
								v = $('.specsValue', this).text().trim();
						json.generalFeatures[k] = v;
			});
			json.images = [];
			$('.productImages img').each(function(){
						var data = $(this);
		        var img = data.attr('src');
						json.images.push(img);

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




		}

		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');
        })

        res.send('Check your console!')
	})
})
app.use(express.static('public'));
app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
