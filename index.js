const request = require('request');
const cheerio = require('cheerio');
const restify = require('restify');

var server = restify.createServer();
server.get('/:username', function(req, res, next) {
    getTkTokStats(req.params.username, function(status, stats) {
        res.send(stats);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});

function getTkTokStats(username, callback) {
    request({
        url: `https://tiktok.com/${username}`,
        followAllRedirects: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
        }
    }, function (err, response, body) {
        if(err) {
            throw err;
        }

        if(response.statusCode === 404) {
            return callback(response.statusCode, {});
        }

        const $ = cheerio.load(body);
        const results = {
            following: $('strong[title="Following"]').html(),
            followers: $('strong[title="Followers"]').html(),
            likes: $('strong[title="Likes"]').html()
        };

        callback(response.statusCode, results);
    });
}
gi