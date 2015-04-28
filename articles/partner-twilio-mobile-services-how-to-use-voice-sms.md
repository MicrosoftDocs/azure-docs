<properties 
	pageTitle="Use Twilio for Voice and SMS Capabilities | Mobile Dev Center" 
	description="Learn how to perform common tasks using the Twilio API with Azure Mobile Services." 
	services="mobile-services" 
	documentationCenter="" 
	authors="devinrader" 
	manager="twilio" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="04/24/2015" 
	ms.author="devinrader"/>


# How to use Twilio for voice and SMS capabilities from Mobile Services

This topic shows you how to perform common tasks using the Twilio API with Azure Mobile Services. In this tutorial you will learn how to create Custom API scripts that use the Twilio API to initiate a phone call and to send a Short Message Service (SMS) message. 

## <a id="WhatIs"></a>What is Twilio?
Twilio is powering the future of business communications, enabling developers to embed voice, VoIP, and messaging into applications. They virtualize all infrastructure needed in a cloud-based, global environment, exposing it through the Twilio communications API platform. Applications are simple to build and scalable. Enjoy flexibility with pay-as-you go pricing, and benefit from cloud reliability.

**Twilio Voice** allows your applications to make and receive phone calls. **Twilio SMS** enables your applications to send and receive SMS messages. **Twilio Client** allows you to make VoIP calls from any phone, tablet, or browser and supports WebRTC.

## <a id="Pricing"></a>Twilio Pricing and Special Offers
Azure customers receive a [special offer][special_offer]: complimentary $10 of Twilio Credit when you upgrade your Twilio Account. This Twilio Credit can be applied to any Twilio usage ($10 credit equivalent to sending as many as 1,000 SMS messages or receiving up to 1000 inbound Voice minutes, depending on the location of your phone number and message or call destination). Redeem this Twilio credit and get started at [ahoy.twilio.com/azure][special_offer].

Twilio is a pay-as-you-go service. There are no set-up fees and you can close your account at any time. You can find more details at [Twilio Pricing][twilio_pricing].  

## <a id="Concepts"></a>Concepts
The Twilio API is a RESTful API that provides voice and SMS functionality for applications. Client libraries are available in multiple languages; for a list, see [Twilio API Libraries] [twilio_libraries].  Additional tutorials are available for using the Twilio any Azure application written in [.NET][azure_twilio_howto_dotnet], [node.js][azure_twilio_howto_node], [Java][azure_twilio_howto_java], [PHP][azure_twilio_howto_php], [Python][azure_twilio_howto_python] or [Ruby][azure_twilio_howto_ruby].

Key aspects of the Twilio API are Twilio verbs and Twilio Markup Language (TwiML).

### <a id="Verbs"></a>Twilio verbs
The API makes use of Twilio verbs; for example, the **&lt;Say&gt;** verb instructs Twilio to audibly deliver a message on a call. 

The following is a list of Twilio verbs.  Learn about the other verbs and capabilities via [Twilio Markup Language documentation](http://www.twilio.com/docs/api/twiml).

* **&lt;Dial&gt;**: Connects the caller to another phone.
* **&lt;Gather&gt;**: Collects numeric digits entered on the telephone keypad.
* **&lt;Hangup&gt;**: Ends a call.
* **&lt;Play&gt;**: Plays an audio file.
* **&lt;Pause&gt;**: Waits silently for a specified number of seconds.
* **&lt;Record&gt;**: Records the caller's voice and returns a URL of a file that contains the recording.
* **&lt;Redirect&gt;**: Transfers control of a call or SMS to the TwiML at a different URL.
* **&lt;Reject&gt;**: Rejects an incoming call to your Twilio number without billing you
* **&lt;Say&gt;**: Converts text to speech that is made on a call.
* **&lt;Sms&gt;**: Sends an SMS message.

### <a id="TwiML"></a>TwiML
TwiML is a set of XML-based instructions based on the Twilio verbs that inform Twilio of how to process a call or SMS.

As an example, the following TwiML would convert the text **Hello World** to speech.

    <?xml version="1.0" encoding="UTF-8" ?>
    <Response>
       <Say>Hello World</Say>
    </Response>

When your application calls the Twilio API, one of the API parameters is the URL that returns the TwiML response. For development purposes, you can use Twilio-provided URLs to provide the TwiML responses used by your applications. You could also host your own URLs to produce the TwiML responses, and another option is to use the **TwiMLResponse** object.

For more information about Twilio verbs, their attributes, and TwiML, see [TwiML][twiml]. For additional information about the Twilio API, see [Twilio API][twilio_api].

## <a id="CreateAccount"></a>Create a Twilio Account
When you're ready to get a Twilio account, sign up at [Try Twilio][try_twilio]. You can start with a free account, and upgrade your account later.

When you sign up for a Twilio account, you'll receive an account ID and an authentication token. Both will be needed to make Twilio API calls. To prevent unauthorized access to your account, keep your authentication token secure. Your account ID and authentication token are viewable at the [Twilio account page][twilio_account], in the fields labeled **ACCOUNT SID** and **AUTH TOKEN**, respectively.

## <a id="create_app"></a>Create a Mobile Service
A Mobile Service that hosts a Twilio enabled application is no different from any other Mobile Service. You simply add the Twilio node.js library in order to reference it from your Mobile Service Custom API scripts. For information on creating an initial mobile service, see [Getting Started with Mobile Services](mobile-services-ios-get-started.md).

## <a id="ConfigureMobileService"></a>Configure Your Mobile Service to use the Twilio Node.js Library
Twilio provides a Node.js library that wraps various aspects of Twilio to provide simple and easy ways to interact with the Twilio REST API and Twilio Client to generate TwiML responses.

To use the Twilio node.js library in your Mobile Service, you need leverage Mobile Services npm module support, which you can do by storing your scripts in source control. 

1. Complete the tutorial [Store Scripts in Source Control](mobile-services-store-scripts-source-control.md). This walks you through setting-up source control for your Mobile Services and storing your server scripts in a Git repository.

2. After you have set up source control for your Mobile Service, open the repository on your local computer, browse to the `\services` subfolder, open the package.json file in a text editor, and add the following field to the **dependencies** object:

		"twilio": "~1.7.0"
 
3. After you have added the Twilio package reference to the **dependencies** object, the package.json file should look like the following:

		{
		  "name": "todolist",
		  "version": "1.0.0",
		  "description": "todolist - hosted on Azure Mobile Services",
		  "main": "server.js",
		  "engines": {
		    "node": ">= 0.8.19"
		  },
		  "dependencies": {
			"twilio": "~1.7.0" 
		  },
		  "devDependencies": {},
		  "scripts": {},
		  "author": "unknown",
		  "licenses": [],
		  "keywords":[]
		}

	>[AZURE.NOTE]The dependency for Twilio should be added as `"twilio": "~1.7.0"`, with a (~). A reference with a caret (^) is not supported. 

4. Commit this file update and push the update back to the mobile service.

	This update to the package.json file will restart your mobile service.
	
The mobile service now installs and loads the Twilio package so you can reference and use the Twilio library in your custom API and table scripts.

## <a id="howto_make_call"></a>How to: Make an outgoing call
The following script shows how to initiate an outgoing call from your Mobile Service using the **makeCall** function. This code also uses a Twilio-provided site to return the Twilio Markup Language (TwiML) response. Substitute your values for the **From** and **To** phone numbers, and ensure that you verify the **From** phone number for your Twilio account prior to running the code.

    var twilio = require('twilio');

    exports.post = function(request, response) {

        var client = new twilio.RestClient('[ACCOUNT_SID]', 'AUTH_TOKEN');

        client.makeCall({
            to:'+16515556677', 
            from: '+14506667788',
            url: 'http://www.example.com/twiml.php' 

        }, function(err, responseData) {
            console.log(responseData.from); 
            response.send(200, '');
        });
    };

For more information about the parameters passed in to the **client.makeCall** function, see [http://www.twilio.com/docs/api/rest/making-calls][twilio_rest_making_calls].

As mentioned, this code uses a Twilio-provided site to return the TwiML response. You could instead use your own site to provide the TwiML response. For more information, see [How to: Provide TwiML responses from your own web site](#howto_provide_twiml_responses).

## <a id="howto_send_sms"></a>How to: Send an SMS message
The following code shows how to send an SMS message using the **sendSms**  function. The **From** number is provided by Twilio for trial accounts to send SMS messages. The **To** number must be verified for your Twilio account before you run the code.

    var twilio = require('twilio');

    exports.post = function(request, response) {

        var client = new twilio.RestClient('[ACCOUNT_SID]', 'AUTH_TOKEN');
 
        client.sendSms({
            to:'[]',
            from:'[]',
            body:'ahoy hoy! Testing Twilio and node.js'
        }, function(error, message) {
    
            // The "error" variable will contain error information, if any.
            // If the request was successful, this value will be "false"
            if (!error) {
                console.log('Success! The SID for this SMS message is: ' + message.sid);
                console.log('Message sent on: ' + message.dateCreated);
            }
            else {
                console.log('Oops! There was an error.');
            }
            response.send(200, { error : error } );
        });
    };


## <a id="howto_provide_twiml_responses"></a>How to: Provide TwiML responses from your own website

When your application initiates a call to the Twilio API - for example, via the client.InitiateOutboundCall method - Twilio sends your request to a URL that is expected to return a TwiML response. The example in How to: Make an outgoing call uses the Twilio-provided URL http://twimlets.com/message to return the response.

> [AZURE.NOTE] While TwiML is designed for use by web services, you can view the TwiML in your browser. For example, click [twimlet_message_url](http://twimlets.com/message) to see an empty &lt;Response&gt; element; as another example, click [twimlet_message_url_hello_world](http://twimlets.com/message?Message%5B0%5D=Hello%20World) to see a &lt;Response&gt; element that contains a &lt;Say&gt; element.

Instead of relying on the Twilio-provided URL, you can create your own URL site that returns HTTP responses. You can create the site in any language that returns HTTP responses. This topic assumes you'll be hosting the URL from an ASP.NET generic handler.

The following script results in a TwiML response that says Hello World on the call.

    var twilio = require('twilio');

    exports.post = function(request, response) {
        var resp = new twilio.TwimlResponse();
        resp.say({voice:'woman'}, 'ahoy hoy! Testing Twilio and node.js');
        response.set('Content-Type', 'text/xml');
        response.send(200, resp.toString());
    };

For more information about TwiML, see [https://www.twilio.com/docs/api/twiml](https://www.twilio.com/docs/api/twiml).

Once you have set up a way to provide TwiML responses, you can pass that URL into the **client.makeCall** method as shown in the following code sample:
    
    var twilio = require('twilio');

    exports.post = function(request, response) {

        var client = new twilio.RestClient('[ACCOUNT_SID]', 'AUTH_TOKEN');

        client.makeCall({
            to:'+16515556677', 
            from: '+14506667788',
            url: 'http://<your_mobile_service>.azure-mobile.net/api/makeCall' 

        }, function(err, responseData) {

            console.log(responseData.from);
            response.send(200, '');
        });
    };

[AZURE.INCLUDE [twilio_additional_services_and_next_steps](../includes/twilio_additional_services_and_next_steps.md)]


[twilio_rest_making_calls]: http://www.twilio.com/docs/api/rest/making-calls

[twilio_pricing]: http://www.twilio.com/pricing
[special_offer]: http://ahoy.twilio.com/azure
[twilio_libraries]: https://www.twilio.com/docs/libraries
[twiml]: http://www.twilio.com/docs/api/twiml
[twilio_api]: http://www.twilio.com/api
[try_twilio]: https://www.twilio.com/try-twilio
[twilio_account]:  https://www.twilio.com/user/account
[verify_phone]: https://www.twilio.com/user/account/phone-numbers/verified#


[azure_twilio_howto_dotnet]: /develop/net/how-to-guides/twilio-voice-and-sms-service/
[azure_twilio_howto_java]: /develop/java/how-to-guides/twilio-voice-and-sms-service/
[azure_twilio_howto_node]: /develop/nodejs/how-to-guides/twilio-voice-and-sms-service/
[azure_twilio_howto_ruby]: /develop/ruby/how-to-guides/twilio-voice-and-sms-service/
[azure_twilio_howto_python]: /develop/python/how-to-guides/twilio-voice-and-sms-service/
[azure_twilio_howto_php]: /develop/php/how-to-guides/twilio-voice-and-sms-service/
