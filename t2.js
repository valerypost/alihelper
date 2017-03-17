var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs')
var async = require("async");
var q = require('q');
var searchTerm = 'smd';
var url = 'https://www.aliexpress.com/wholesale?ltype=wholesale&d=y&origin=y&isViewCP=y&catId=0&initiative_id=SB_20170316090523&blanktest=0&tc=af&SearchText=' + searchTerm;
var pagination='www.aliexpress.com/wholesale?initiative';
var pages=[];
 pages.push(url);
 var itemCounter=0;

request(url, function(err, resp, body){
    $ = cheerio.load(body);
    var links = $('a'); //jquery get all hyperlinks
    console.log(links.length);
    // console.log(":::"+JSON.stringify($(links)));
    $(links).each(function(i, link){
        var linkstxt=$(link).text();
        var href=$(link).attr('href');
        if(href.includes(pagination)) {

            console.log(linkstxt + ':\n  ' + $(link).attr('href'));
            pages.push($(link).attr('href'));
        }
    });
    // return;

    var requests=[];
    pages.forEach(function (pageUrl) {
         requests.push(processDetail(pageUrl));
    });
    // console.log("counter:" + itemCounter);

    q.all(requests).then(function(results) {
        results.forEach(function (result) {
            if (result.state === "fulfilled") {
                var value = result.value;
                console.log("value:"+value);
            } else {
                var reason = result.reason;
            }
        });
        console.log("all the requests were created");
        console.log("counter:" + itemCounter);
    });


});


function processDetail(pageUrl) {
    var d = q.defer();

    request(pageUrl, function (err, resp, body) {
        if (body) {
            $ = cheerio.load(body);
            links = $('a'); //jquery get all hyperlinks
            $(links).each(function (i, link) {
                var linkstxt = $(link).text();
                var href = $(link).attr('href');
                if (href.includes("www.aliexpress.com/item")) {
                    itemCounter++;

                    // console.log(linkstxt + ':\n  ' + $(link).attr('href'));
                    console.log("+");

                }
            });
        }
        d.resolve("test");

    });
    return d.promise;
    // console.log("linkstxt" + pageUrl);
}

function extractItems(urlPage) {
   request(urlPage, function (err, resp, body) {
        $ = cheerio.load(body);
        links = $("input[attribute=value]"); //jquery get all hyperlinks
        $(links).each(function (i, link) {
            var linkstxt = $(link).text();
            var href = $(link).attr('href');
            if (href.includes("www.aliexpress.com/item")) {
                itemCounter++

                //console.log(linkstxt + ':\n  ' + $(link).attr('href'));
            }
        });
    });
}
