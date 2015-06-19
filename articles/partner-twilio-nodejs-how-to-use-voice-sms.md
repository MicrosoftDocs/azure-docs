<properties 
	pageTitle="Using Twilio for Voice, VoIP, and SMS Messaging in Azure" 
	description="Learn how to make a phone call and send a SMS message with the Twilio API service on Azure. Code samples written in Node.js." 
	services="" 
	documentationCenter="nodejs" 
	authors="MikeWasson" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="article" 
	ms.date="11/25/2014" 
	ms.author="mwasson"/>


# Using Twilio for Voice, VoIP, and SMS Messaging in Azure

This guide demonstrates how to build apps that communicate with Twilio and node.js on Azure.

<a id="whatis"/>
## What is Twilio?

Twilio is an API platform that makes it easy for developers to make and receive phone calls, send and receive text messages, and embed VoIP calling into browser-based and native mobile applications.  Let's briefly go over how this works before diving in.

### Receiving Calls and Text Messages

Twilio allows developers to [purchase programmable phone numbers][purchase_phone] which can be used to both send and receive calls and text messages.  When a Twilio number receives an inbound call or text, Twilio will send your web application an HTTP POST or GET request, asking you for instructions on how to handle the call or text.  Your server will respond to Twilio's HTTP request with [TwiML][twiml], a simple set of XML tags that contain instructions on how to handle a call or text.  We will see examples of TwiML in just a moment.

### Making Calls and Sending Text Messages

By making HTTP requests to the Twilio web service API, developers can send text messages or initiate outbound phone calls.  For outbound calls, the developer must also specify a URL that returns TwiML instructions for how to handle the outbound call once it is connected.

### Embedding VoIP Capabilities in UI code (JavaScript, iOS, or Android)

Twilio provides a client-side SDK which can turn any desktop web browser, iOS app, or Android app into a VoIP phone.  In this article, we will focus on how to use VoIP calling in the browser.  In addition to the Twilio JavaScript SDK running in the browser, a server-side application (our node.js application) must be used to issue a "capability token" to the JavaScript client.  You can read more about using VoIP with node.js [on the Twilio dev blog][voipnode].

<a id="signup"/>
## Sign Up For Twilio (Microsoft Discount)

Before using Twilio services, you must first [sign up for an account][signup].  Microsoft Azure customers receive a special discount - [be sure to sign up here][signup]!

<a id="azuresite"/>
## Create and Deploy a node.js Azure Website

Next, you will need to create a node.js website running on Azure.  [The official documentation for doing this is located here][azure_new_site].  At a high level, you will be doing the following:

* Signing up for an Azure account, if you don't have one already
* Using the Azure admin console to create a new website
* Adding source control support (we will assume you used git)
* Creating a file `server.js` with a simple node.js web application
* Deploying this simple application to Azure

<a id="twiliomodule"/>
## Configure the Twilio Module

Next, we will begin to write a simple node.js application which makes use of the Twilio API.  Before we begin, we need to configure our Twilio account credentials.  

### Configuring Twilio Credentials in System Environment Variables

In order to make authenticated requests against the Twilio back end, we need our account SID and auth token, which function as the username and password set for our Twilio account. The most secure way to configure these for use with the node module in Azure is via system environment variables, which you can set directly in the Azure admin console.

Select your node.js website, and click the "CONFIGURE" link.  If you scroll down a bit, you will see an area where you can set configuration properties for your application.  Enter your Twilio account credentials ([found on your Twilio dashboard][twilio_dashboard]) as shown - make sure to name them "TWILIO_ACCOUNT_SID" and "TWILIO_AUTH_TOKEN", respectively:

![Azure admin console][azure-admin-console]

Once you have configured these variables, restart your application in the Azure console.

### Declaring the Twilio module in package.json

Next, we need to create a package.json to manage our node module dependencies via [npm].  At the same level as the "server.js" file you created in the Azure/node.js tutorial, create a file named "package.json".  Inside this file, place the following:

  {
    "name": "application-name",
    "version": "0.0.1",
    "private": true,
    "scripts": {
      "start": "node server"
    },
    "dependencies": {
      "express": "3.1.0",
      "ejs": "*",
      "twilio":"*"
    }
  }

This declares the twilio module as a dependency, as well as the popular [express web framework][express] and the EJS template engine.  Okay, now we're all set - let's write some code!

<a id="makecall"/>
## Make an Outbound Call

Let's create a simple form that will place a call to a number we choose.  Open up server.js, and enter the following code.  Note where it says "CHANGE_ME" - put the name of your azure website there:

    // Module dependencies
    var express = require('express'), 
      path = require('path'), 
      http = require('http'), 
      twilio = require('twilio');

    // Create Express web application
    var app = express();

    // Express configuration
    app.configure(function(){
      app.set('port', process.env.PORT || 3000);
      app.set('views', __dirname + '/views');
      app.set('view engine', 'ejs');
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(express.static(path.join(__dirname, 'public')));
    });
    app.configure('development', function(){
      app.use(express.errorHandler());
    });

    // Render an HTML user interface for the application's home page
    app.get('/', function(request, response) {
      response.render('index');
    });

    // Handle the form POST to place a call
    app.post('/call', function(request, response) {
      var client = twilio();
      client.makeCall({
          // make a call to this number
          to:request.body.number,

          // Change to a Twilio number you bought - see:
          // https://www.twilio.com/user/account/phone-numbers/incoming
          from:'+15558675309',

          // A URL in our app which generates TwiML
          // Change "CHANGE_ME" to your app's name
          url:'https://CHANGE_ME.azurewebsites.net/outbound_call'
      }, function(error, data) {
          // Go back to the home page
          response.redirect('/');
      });
    });

    // Generate TwiML to handle an outbound call
    app.post('/outbound_call', function(request, response) {
      var twiml = new twilio.TwimlResponse();

      // Say a message to the call's receiver 
      twiml.say('hello - thanks for checking out Twilio and Azure', {
          voice:'woman'
      });

      response.set('Content-Type', 'text/xml');
      response.send(twiml.toString());
    });

    // Start server
    http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });

Next, create a directory called "views" - inside this directory, create a file named "index.ejs" with the following contents:

    <!DOCTYPE html>
    <html>
    <head>
      <title>Twilio Test</title>
      <style>
        input { height:20px; width:300px; font-size:18px; margin:5px; padding:5px; }
      </style>
    </head>
    <body>
      <h1>Twilio Test</h1>
      <form action="/call" method="POST">
          <input placeholder="Enter a phone number" name="number"/>
          <br/>
          <input type="submit" value="Call the number above"/>
      </form>
    </body>
    </html>

Now, deploy your website to Azure and open your home .  You should be able to enter your phone number in the text field, and receive a call from your Twilio number!

<a id="sendmessage"/>
## Send an SMS Message

Now, let's set up a user interface and form handling logic to send a text message.  Open up "server.js", and add the following code after the last call to "app.post":

    app.post('/sms', function(request, response) {
      var client = twilio();
      client.sendSms({
          // send a text to this number
          to:request.body.number,

          // A Twilio number you bought - see:
          // https://www.twilio.com/user/account/phone-numbers/incoming
          from:'+15558675309',

          // The body of the text message
          body: request.body.message
          
      }, function(error, data) {
          // Go back to the home page
          response.redirect('/');
      });
    });

In "views/index.ejs", add another form under the first one to submit a number and a text message:

    <form action="/sms" method="POST">
      <input placeholder="Enter a phone number" name="number"/>
      <br/>
      <input placeholder="Enter a message to send" name="message"/>
      <br/>
      <input type="submit" value="Send text to the number above"/>
    </form>

Redeploy your application to Azure, and you should now be able to submit that form and send yourself (or any of your closest friends) a text message!

<a id="nextsteps"/>
## Next Steps

You have now learned the basics of using node.js and Twilio to build apps that communicate.  But these examples barely scratch the surface of what's possible with Twilio and node.js.  For more information using Twilio with node.js, check out the following resources:

* [Official module docs][docs]
* [Tutorial on VoIP with node.js applications][voipnode]
* [Votr - a real-time SMS voting application with node.js and CouchDB (three parts)][votr]
* [Pair programming in the browser with node.js][pair]

We hope you love hacking node.js and Twilio on Azure!

[purchase_phone]: https://www.twilio.com/user/account/phone-numbers/available/local
[twiml]: https://www.twilio.com/docs/api/twiml
[signup]: http://ahoy.twilio.com/azure
[azure_new_site]: http://www.windowsazure.com/develop/nodejs/tutorials/create-a-website-(mac)/
[twilio_dashboard]: https://www.twilio.com/user/account
[npm]: http://npmjs.org
[express]: http://expressjs.com
[voipnode]: http://www.twilio.com/blog/2013/04/introduction-to-twilio-client-with-node-js.html
[docs]: http://twilio.github.io/twilio-node/
[votr]: http://www.twilio.com/blog/2012/09/building-a-real-time-sms-voting-app-part-1-node-js-couchdb.html
[pair]: http://www.twilio.com/blog/2013/06/pair-programming-in-the-browser-with-twilio.html
[azure-admin-console]: ./media/partner-twilio-nodejs-how-to-use-voice-sms/twilio_1.png



