var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs')
var async = require("async");
var q = require('q');
var searchTerm = 'smd';
var url = 'https://www.aliexpress.com/item/Free-shiiping-100PCS-DIODE-M7-1N4007-SMD-1A-1000V-Rectifier-Diode/32333059092.html?spm=2114.01010208.3.425.7ineRA&ws_ab_test=searchweb0_0,searchweb201602_4_10065_10130_10068_433_434_10139_10136_10137_10138_10060_10062_10141_10056_10055_10054_301_10059_201_10099_10531_10530_129_10103_10102_10096_10052_10053_10050_10107_10142_10051_10106_10143_10526_10529_10084_10083_10119_10080_10082_10081_10110_10111_10112_10113_10114_10037_10033_10078_10079_10077_10073_10070_10122_10123_10120_10124-10119_10037_10077,searchweb201603_3,afswitch_1_afChannel,ppcSwitch_7,single_sort_0_default&btsid=f9f21944-5702-4ba4-8035-5c47259cb128&algo_expid=2eed5be7-1177-4b7c-8fac-17c10f6caaba-46&algo_pvid=2eed5be7-1177-4b7c-8fac-17c10f6caaba';
var pagination='www.aliexpress.com/wholesale?initiative';
var shiping = 'https://freight.aliexpress.com/ajaxFreightCalculateService.htm?callback=jQuery18303278056892461083_1490202654424&f=d&count=1&currencyCode=USD&sendGoodsCountry=&country=CA&province=&city=&abVersion=1&_=1490202775139&productid=32333059092';
var pages=[];
// pages.push(url);
 var itemCounter=0;

console.log("start");
request.get(shiping)
    .on('data', function(data) {
        // decompressed data as it is received
        console.log('decoded chunk: ' + data)
        if(data.indexOf("ePacket")>0){
            console.log('epacket: ')

        }
    })
;

return
request(shiping, function(err, resp, body){
    $ = cheerio.load(body);
    console.log("checklinks");
   var links = $("input"); //jquery get all hyperlinks
    //[data-full-name='ePacket']
    console.log(links.length);
//     console.log(":::"+JSON.stringify($(links)));
    $(links).each(function(i, link){
        //var linkstxt=$(link).text();
        // var href=$(link).attr('data-full-name');

        if(link) {
            console.log(":::"+JSON.stringify($(link).attr('name')));
            // if (href=='ePacket') {
            //
            //
            //     console.log("href:"+href );
            //     //pages.push(href);
            // }
        }
    });
     return;

    var requests=[];
    pages.forEach(function (pageUrl) {
         requests.push(processDetail(pageUrl));
    });
    // console.log("counter:" + itemCounter);

    q.all(requests).then(function(results) {
        results.forEach(function (result) {
            console.log("result :"+JSON.stringify(result) );
        console.log("result.value :"+result.value );
            if (result.state === "fulfilled") {
                var value = result.value;
//                console.log("value:"+value);
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

                    console.log(linkstxt + ':\n  ' + $(link).attr('href'));
                    console.log("+");

                }
            });
            d.resolve("ok");
        } else {
            d.resolve("nobody");
        }

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
