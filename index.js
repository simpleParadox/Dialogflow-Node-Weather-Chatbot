const dialogflow = require('dialogflow');
const request = require('request');
const assert = require('assert');
const key = require('./app_key.json')
const projectId = 'weather-node-js-82d21';
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';

// Instantiate a DialogFlow client.
const sessionClient = new dialogflow.SessionsClient();

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// The text query request.



const query = process.argv[2];

const req = {
  session: sessionPath,
  queryInput: {
    text: {
      text: query,
      languageCode: languageCode,
    },
  },
};

// Send request and log result

sessionClient
  .detectIntent(req)
  .then(responses => {
    // console.log('Detected intent');
    const result = responses[0].queryResult;
    // console.log(`  Query: ${result.queryText}`);
    // console.log(`  Response: ${result.fulfillmentText}`);

    // Now use the city to find the weather.
    var city_name = result.fulfillmentText;
    if (city_name.includes('geo')) {
      console.log('Invalid Request, please enter the name of the city to retrieve weather !!');
    }
    else {
      var url = `http://api.openweathermap.org/data/2.5/weather?q=${city_name}&units=metric&APPID=${key.key}`;
      request(url, (error, response, body) => {
        var body = JSON.parse(response.body);
        try{
          assert(body.weather !=  undefined, 'Invalid Request!');
          var weather = body.weather[0];
          var temp = body.main;

          console.log(`\nWeather at ${city_name}\n`);
          console.log(`${weather.main} - ${weather.description}`);
          console.log(`Temperature : ${temp.temp}°C \nHumidity : ${temp.humidity}%`);
          console.log(`Visibility  : ${body.visibility}m`);
          console.log(`Cloud Cover : ${body.clouds.all}%\n`);
        }
        catch(err){
          console.log('Something went wrong, please check the request and try again!!');
        }
      });
    }
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
