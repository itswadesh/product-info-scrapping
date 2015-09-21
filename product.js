var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
	// Let's scrape Anchorman 2
	//url = 'http://www.imdb.com/title/tt1229340/';
	imdb = 'http://localhost/imdb.html';
	redme2 = 'http://localhost:8081/redme2.html';
	request(redme2, function(error, response, html){
		// console.log(error, response, html);
		if(!error){
			var $ = cheerio.load(html);

			var title, title2, title3;
			var json = { title : "", title2 : "", title3 : ""};

			$('.product-details h1').filter(function(){
				console.log($(this));
		        var data = $(this);
		        name = data.text();
		       	json.name = name;
			});
			
			$('.product-details div').filter(function(){
				console.log($(this));
		        var data = $(this);
		        mainFeature = data.text();
		        json.mainFeature = mainFeature;
			});

		        


		        title3 = data.children().last().text();
		        json.title3 = title3;
	        })

	        $('.star-box-giga-star').filter(function(){
	        	var data = $(this);
	        	rating = data.text();

	        	json.rating = rating;
	        })
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