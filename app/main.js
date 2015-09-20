var fs      = require('fs'),
    mailin  = require('mailin'),
    Promise = require('bluebird'),
    request = require('request');
    
var SLACK_POST_HOOK = process.env.SLACK_POST_HOOK || '';

function randomHexColor() {
  return '#' + [1, 1, 1].map(function() { 
    return Math.floor(Math.random() * 255).toString(16); 
  }).join('');
}

function uploadAttachment(config) {
  
  if (config.data.attachments) {
    var buffer = config.data.attachments[0];
    var filePath = [__dirname, 'tmp', buffer.fileName].join('/');
    fs.writeFileSync(filePath, buffer.content);
  
    var formData = {
      token: process.env.SLACK_AUTH_TOKEN,
      file: fs.createReadStream(filePath),
      filename: buffer.fileName
    };
  
    return new Promise(function(resolve, reject) {
      request.post({ url: 'https://slack.com/api/files.upload', formData: formData }, function(err, response) {
        var body = JSON.parse(response.body);
        
        config.config.image = (body.ok)? body.file.url : null;
        resolve(config);
      });
    }).finally(function() {
      fs.unlinkSync(filePath);
    });  
  }
  
  return Promise.resolve(config);
}

function getData(data) {  
  var config = {
      text: data.text,
      channel: process.env.SLACK_CHANNEL || '#random',
      subject: data.subject,
      image: null,
      received:'New Email from ' + data.headers.from
  };
  
  return Promise.resolve({ config: config, data: data });
}

function send(data) {
  request.post(SLACK_POST_HOOK, {
    form: {
      payload: JSON.stringify({
        channel: data.config.channel,
        attachments: [{
          color: randomHexColor(),
          fallback: data.config.received + ' - ' + data.config.subject + ' - ' + data.config.text,
          pretext: data.config.received,
          title: data.config.subject,
          text: data.config.text,
          image_url: data.config.image
        }]
      })
    }
  });
}

mailin.start({
  port: 25,
  disableWebhook: true // Disable the webhook posting.
});

mailin.on('message', function(connection, data, content) {
  getData(data)
    .then(uploadAttachment)
    .then(send);
});