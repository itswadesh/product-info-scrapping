var jsdom = require('jsdom');

//example ASIN
var id = "B00000123",
    page = 1;

var scrape = function() {
    jsdom.env(
        "http://www.amazon.com/product-reviews/" + id +
        "/? ie=UTF8&showViewpoints=0&pageNumber=" + page +
        "&sortBy=bySubmissionDateDescending",
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            var $ = window.jQuery;

            $('#productReviews').find('td').children('div:lt(10)').each(function() {
                var date = $(this).find('span:first').next().find('nobr').text(),
                title = $(this).find('span:first').next().find('b').text(),
                starRating = $(this).find('span:first').text(),
                reviewerName = $(this).children().next().find('a:first').find('span').text();

                $(this).children().remove();

                var reviewBlock = $(this).text(),
                review = $.trim(reviewBlock);

                console.log('Title: ' + title  + '\nDate: ' + date + '\nReviewer:' + reviewerName + '\nRating: ' + starRating + '\n' + review + '\n\n');
            };
            window.close();
        }
    )
};

scrape();