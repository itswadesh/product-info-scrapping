var request = require("request"),
	cheerio = require("cheerio"),
	url = "https://www.google.com/search?q=data+mining",
	
	corpus = {},
	totalResults = 0,
	resultsDownloaded = 0;

function callback () {
	resultsDownloaded++;
	
	if (resultsDownloaded !== totalResults) {
		return;
	}
	
	var words = [];
	
	// stick all words in an array
	for (prop in corpus) {
		words.push({
			word: prop,
			count: corpus[prop]
		});
	}
	
	// sort array based on how often they occur
	words.sort(function (a, b) {
		return b.count - a.count;
	});
	
	// finally, log the first fifty most popular words
	console.log(words.slice(0, 20));
}

request(url, function (error, response, body) {
	if (error) {
		console.log('Couldn\'t get page because of error: ' + error);
		return;
	}
	
	// load the body of the page into Cheerio so we can traverse the DOM
	var $ = cheerio.load(body),
		links = $(".r a");
		
	links.each(function (i, link) {
		// get the href attribute of each link
		var url = $(link).attr("href");
		
		// strip out unnecessary junk
		url = url.replace("/url?q=", "").split("&")[0];
		
		if (url.charAt(0) === "/") {
			return;
		}
		
		// this link counts as a result, so increment results
		totalResults++;
		
		// download that page
		request(url, function (error, response, body) {
			if (error) {
				console.log('Couldn\'t get page because of error: ' + error);
				return;
			}
			
			// load the page into cheerio
			var $page = cheerio.load(body),
				text = $page("body").text();
				
			// throw away extra whitespace and non-alphanumeric characters
			text = text.replace(/\s+/g, " ")
					   .replace(/[^a-zA-Z ]/g, "")
					   .toLowerCase();
			
			// split on spaces for a list of all the words on that page and 
			// loop through that list
			text.split(" ").forEach(function (word) {
				// we don't want to include very short or long words, as they're 
				// probably bad data
				if (word.length < 4 || word.length > 20) {
					return;
				}
				
				if (corpus[word]) {
					// if this word is already in our "corpus", our collection
					// of terms, increase the count by one
					corpus[word]++;
				} else {
					// otherwise, say that we've found one of that word so far
					corpus[word] = 1;
				}
			});
			
			// and when our request is completed, call the callback to wrap up!
			callback();
		});
	});
});