const TwitterPackage = require('twitter');
const twitterConfig = require('./config_itoi.json');
const twitterimage = require('fs').readFileSync('./public/img/a.gif');

// import twitter configuration files
const twitterSecrets = {
  consumer_key: twitterConfig.consumer_key,
  consumer_secret: twitterConfig.consumer_secret,
  access_token_key: twitterConfig.access_token_key,
  access_token_secret: twitterConfig.access_token_secret
};

const Twitter = new TwitterPackage(twitterSecrets);
/*
Twitter.post('statuses/update', {status: 'Kia ora ano!'},  function(error, tweet, response){
  if(error){
    console.log(error);
  }
  console.log(tweet);  // Tweet body.
  console.log(response);  // Raw response object.
});
*/

Twitter.post('media/upload', {media: twitterimage}, function(error, media, response) {
  if (!error) {
    // Lets tweet it
    const status = {
      status: 'Kia ora ano - he pikitia',
      media_ids: media.media_id_string // Pass the media id string
    };

    Twitter.post('statuses/update', status, function(error, tweet, response) {
      if (!error) {
        console.log(tweet.text);
      };
    });

  };
});

module.exports = Twitter;
