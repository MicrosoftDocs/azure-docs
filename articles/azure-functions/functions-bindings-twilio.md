<properties
	pageTitle="Azure Functions Twilio binding | Microsoft Azure"
	description="Understand how to use Twilio bindings with Azure Functions."
	services="functions"
	documentationCenter="na"
	authors="wesmc7777"
	manager="erikre"
	editor=""
	tags=""
	keywords="azure functions, functions, event processing, dynamic compute, serverless architecture"/>

<tags
	ms.service="functions"
	ms.devlang="multiple"
	ms.topic="reference"
	ms.tgt_pltfrm="multiple"
	ms.workload="na"
	ms.date="10/20/2016"
	ms.author="wesmc"/>

# Azure Functions Twilio output binding

[AZURE.INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and use Twilio bindings with Azure Functions. 

[AZURE.INCLUDE [intro](../../includes/functions-bindings-intro.md)] 

Azure Functions supports Twilio output bindings to enable your functions to send SMS text messages with a very few lines of code and a [Twilio](https://www.twilio.com/) account. 
 

## function.json for Azure Notification Hub output binding

The function.json file provides the following properties:

- `name` : Variable name used in function code for the Twilio SMS text message.
- `type` : must be set to *"twilioSms"*.
- `accountSid` : This value must be set to the name of an App Setting that holds your Twilio Account Sid.
- `authToken` : This value must be set to the name of an App Setting that holds your Twilio authentication token.
- `to` : This value is set to the phone number that the SMS text will be sent to.
- `from` : This value is set to the phone number that the SMS text will be sent from.
- `direction` : must be set to *"out"*.
- `body` : This value can be used to hard code the SMS text message if you don't need to set it dynamically in the code for your function. 

 
Example function.json:

    {
      "type": "twilioSms",
      "name": "message",
      "accountSid": "TwilioAccountSid",
      "authToken": "TwilioAuthToken",
      "to": "+1704XXXXXXX",
      "from": "+1425XXXXXXX",
      "direction": "out",
      "body": "Azure Functions Testing"
    }


## Example C# queue trigger with Twilio output binding

#### Synchronous

This synchronous example uses an out parameter to send a text to a site admin when a new user requests access to a secured site.

	#r "Newtonsoft.Json"
	#r "Twilio.Api"

	public static void Run(string myQueueItem, out SMSMessage message,  TraceWriter log)
	{
	    log.Info($"C# Queue trigger function processed: {myQueueItem}");
	
		// In this example the queue item is a new user to be processed in the form of a JSON string with 
		// a "name" value.
	    dynamic user = JsonConvert.DeserializeObject(myQueueItem);
	    string msg = "A new user wants to be added - " + user.name;
	
		// Even if you want to use a hard coded message in the body value of the binding, you must at least 
        // initialize the SMSMessage variable.
	    message = new SMSMessage();

		// A dynamic message can be set instead of the body in the output binding...
	    message.Body = msg;
	}

#### Asynchronous

This asynchronous example uses an sends a text to a site admin when a new user requests access to a secured site.

	#r "Newtonsoft.Json"
	#r "Twilio.Api"
	 
	using System;
	using Newtonsoft.Json;
	using Twilio;
	
	public static async Task Run(string myQueueItem, IAsyncCollector<SMSMessage> message,  TraceWriter log)
	{
	    log.Info($"C# Queue trigger function processed: {myQueueItem}");

		// In this example the queue item is a new user to be processed in the form of a JSON string with 
		// a "name" value.
	
	    dynamic user = JsonConvert.DeserializeObject(myQueueItem);
	    string msg = "A new user wants access to your site - " + user.name;
	
	    SMSMessage smsText = new SMSMessage();
	    smsText.Body = msg;
	    
	    await message.AddAsync(smsText);
	}


## Example Node.js queue trigger with Twilio output binding



	module.exports = function (context, myQueueItem) {
	    context.log('Node.js queue trigger function processed work item', myQueueItem);
	
		// In this example the queue item is a new user to be processed in the form of a JSON string with 
		// a "name" value.

	    var msg = "A new user has requested site access - " + myQueueItem.name;
	
	    // If you want to use the body value set on the binding, only initialize the message...
	    context.bindings.message = {};
	
	    // If you want to set the message dynamically, set the body in the message...
	    context.bindings.message = {
	        body : msg
	    };
	
	    context.done();
	};

## Next steps

[AZURE.INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]
