---
title: Integrate LUIS with a bot using the Bot Builder SDK for Node.js in Azure | Microsoft Docs 
description: Build a bot integrated with a LUIS application using the Bot Framework. 
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 04/26/2017
ms.author: v-demak
---

# Integrate LUIS with a bot using the Bot Builder SDK for Node.js

This tutorial walks you through connecting to a bot built with [Bot Framework][BotFramework] and integrated with a LUIS app.

When a user talks to your bot with a phrase such as "Search hotels in Seattle", the bot calls into your LUIS app with the LUIS endpoint URL. LUIS returns a response to the bot and the bot constructs a response to the user. 

In the Bot Framework Emulator, you can see what is happening from the user's view as well as the HTTP request/response log in the log panel.

## Prerequisites
The tutorial assumes you have the following before you begin the next steps:

* The latest version of [Node.js][NodeJs] installed 
* An Azure LUIS subscription

## Outline of steps
The steps in this tutorial are summarized here. More details will be given in the following sections for these steps. 

* Download and install the [Bot Framework emulator][Github-BotFramework-Emulator-Download].
* Download the [BotFramework-Samples][Github-BotBuilder-Samples] repository. This has the LUIS app definition file as well as the LUIS sample bot.
* In [luis.ai][LUIS-website], create and publish a LUIS app from a file provided in BotFramework-Samples. Publishing the app gives you the app's LUIS endpoint. This will be the URL that the bot calls. 
* In a code editor, edit the BotFramework-Samples LUIS bot's .env for the LUIS endpoint.
* From a command line/terminal, start the BotFramework-Samples LUIS bot. Note the port, such as 3978
* Start the Bot Framework Emulator. Enter the URL for the bot, such as http://localhost:3978/api/messages.
* Ask the bot: "Search hotels in Seattle"
* View the bot's response

>[!NOTE]
* If you choose to secure your bot or work with a bot that is not local to your computer, you need to create a [Bot Framework developer account][BFPortal] and [register][RegisterInstructions] your bot. Learn more about the [Bot Framework][BotFramework].
* Bot Builder is used as an NPM dependency in the LUIS sample bot application. You don’t have to do anything other than the typical "npm install" in order to get the dependency. 

## Download and install the Bot Emulator
The [Bot Framework Emulator][Github-BotFramework-Emulator-Download] is available on GitHub. Download and install the correct version for your operating system. Note where the application is on your computer so you can start it in a later step.

## Clone or download the BotFramework-Samples repository
 [BotBuilder-Samples][Github-BotBuilder-Samples] is a GitHub repository with more samples beyond just the LUIS bot. The subfolder you need for this tutorial is [./Node/Intelligence-LUIS][Github-BotBuilder-Samples-LUIS].

Clone or download the repository to your computer. You edit and run the Node/Intelligence-LUIS sample found in this repository.

## Create a new LUIS application from the application definition file
Create a [luis.ai][LUIS-website] account and log in.

In order to get a new LUIS application set up for the bot, you need to import the **LuisBot.json** file found at ./BotBuilder-Samples/Node/Intelligence-LUIS folder. The file contains the application definition for the LUIS app the sample bot uses.

1. On the **My Apps** page  of the [LUIS web page][LUIS-website], click **Import App**.
2. In the **Import new app** dialog box, click **Choose file** and upload the LuisBot.json file. Name your application "Hotel Finder", and Click **Import**. <!--    ![A new app form](./Images/NewApp-Form.JPG) -->It may take a few minutes for LUIS to extract the intents and entities from the JSON file. When the import is complete, LUIS opens the Dashboard page of the Hotel Finder app<!-- which looks like the following screen-->. 
3. Once the app is imported, you need to change the Assigned endpoint key on the Publish App page to your Azure LUIS subscription. Then publish the app to get the endpoint API URL. You need to copy the URL, you need to paste that URL as an environment variable in the next step.

## Set the LUIS endpoint in the LUIS sample bot
In a code editor, set the LUIS_MODEL_URL environment variable and comment out the security variables. 

1. Open the `.env` file and change `LUIS_MODEL_URL` to the LUIS endpoint URL from the previous step.
2. Delete any trailing `&q=` from the URL. Here's an example of how the URL might look:
```
LUIS_MODEL_URL=https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2c2afc3e-5f39-4b6f-b8ad-c47ce1b98d8a?subscription-key=9823b65a8c9045f8bce7fee87a5e1fbc&verbose=true&timezoneOffset=0
```
3. Add the pound sign, '#', in front of the MICROSOFT_APP environment variables:
```
#MICROSOFT_APP_ID=
#MICROSOFT_APP_PASSWORD=
```
These environment variables are for security to a remote bot so you do not need them.

## Start the bot
From a command line, at the root of the LUIS sample bot, install the node dependencies and start the LUIS Sample. 

Install the node dependencies:
````
> npm install
````

After the node modules are installed, start the bot.
````
> npm start
````

You should see a response such as the following response:

```
restify listening to http://[::]:3978
```
The port number is necessary for the next step.

## Start the Bot Emulator
Start the Bot Framework emulator.

The Bot Emulator needs the sample bot's endpoint such as http://localhost:3978/api/messages. Enter that into the address bar at the top of the emulator. It asks you for the Bot's application ID and password. You don't need those values if the bot is local to your computer, so click on CONNECT. 

If you see the following connection error in the log, the Bot Emulator cannot find your bot. 

```
POST connect ECONNREFUSED 127.0.0.1:3978
```

If you see this successful HTTP response in the log, the Bot emulator connected to the LUIS sample bot:
```
POST 202 [conversationUpdate] 
```

## Ask the bot a question
In the bottom bar of the emulator, enter:

```
Search hotels in Seattle
``` 
The bot should respond with suggestions for hotels.

## See the bot's response
In the left panel of the emulator, the user sees suggested hotels. 

In the right panel, the HTTP conversation between the bot emulator and the LUIS sample bot is shown.

```
Log
[13:10:55] Emulator listening on http://[::]:61655 
[13:10:55] ngrok not configured (only needed when connecting to remotely hosted bots) 
[13:10:55] Connecting to bots hosted remotely 
[13:10:55] Edit ngrok settings 
[13:10:55] Checking for new version... 
[13:10:56] Application is up to date. 
[13:11:51] -> POST 202 [conversationUpdate] 
[13:11:51] -> POST 202 [conversationUpdate] 
[13:12:01] -> POST 202 [message] search for hotels in seattle 
[13:12:01] <- GET 200 getPrivateConversationData 
[13:12:01] <- GET 200 getUserData 
[13:12:01] <- GET 200 getConversationData 
[13:12:02] <- POST 200 setPrivateConversationData 
[13:12:02] <- POST 200 Reply[message] Welcome to the Hotels finder! We are analyzing you... 
[13:12:02] <- POST 200 Reply[message] Looking for hotels in seattle... 
[13:12:02] <- POST 200 Reply[event] Debug Event 
[13:12:03] <- POST 200 setPrivateConversationData 
[13:12:03] <- POST 200 Reply[message] I found 5 hotels: 
[13:12:03] <- POST 200 Reply[message] application/vnd.microsoft.card.hero 
[13:12:03] <- POST 200 Reply[event] Debug Event 
```


In the command line for the LUIS bot sample, you will see the following

```
Debugging with inspector protocol because Node.js v8.6.0 was detected.
node --inspect-brk=37939 app.js 
Debugger listening on ws://127.0.0.1:37939/b905da3e-0ffb-4c54-bf5c-e5ca051682b8
restify listening to http://[::]:3978
WARN: ChatConnector: receive - emulator running without security enabled.
ChatConnector: message received.
WARN: ChatConnector: receive - emulator running without security enabled.
ChatConnector: message received.
WARN: ChatConnector: receive - emulator running without security enabled.
ChatConnector: message received.
UniversalBot("*") routing "find hotels in seattle" from "emulator"
Library("*")recognize() recognized: SearchHotels(1)
Library("*").findRoutes() explanation:
	GlobalAction(1)
Session.beginDialog(*:SearchHotels)
SearchHotels - waterfall() step 1 of 2
SearchHotels - Session.send()
SearchHotels - waterfall() step 2 of 2
SearchHotels - Session.send()
SearchHotels - Session.sendBatch() sending 2 message(s)
SearchHotels - Session.send()
SearchHotels - Session.send()
SearchHotels - Session.endDialog()
Session.sendBatch() sending 2 message(s)
WARN: ChatConnector: receive - emulator running without security enabled.
ChatConnector: message received.
UniversalBot("*") routing "find hotels in seattle" from "emulator"
Library("*")recognize() recognized: SearchHotels(1)
Library("*").findRoutes() explanation:
	GlobalAction(1)
Session.beginDialog(*:SearchHotels)
SearchHotels - waterfall() step 1 of 2
SearchHotels - Session.send()
SearchHotels - waterfall() step 2 of 2
```

## See the LUIS response while running the bot
The Bot Builder SDK uses the LUIS endpoint API you set in the **.env** file when creating the recognizer. After creating the recognizer, it is set on the **bot** object.

```
// app.js - register LUIS endpoint API
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);
```

If you set a breakpoint in the **app.js file** in the first function of **bot.dialog**, you can watch the LUIS response for cityEntity and airportEntity.

```
// app.js - set breakpoint to watch the LUIS response
var cityEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.geography.city');
var airportEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'AirportCode');
```

Using the sample request "Search for hotel in Seattle," LUIS response with a filled cityEntity and an null airportEntity.

```
// cityEntity viewed in debug
{
    entity: "seattle", type: "builtin.geography.city", startIndex: 15, endIndex: 21, score: 0.9239899}
    endIndex: 21
    entity: "seattle"
    score: 0.9239899
    startIndex: 15
    type: "builtin.geography.city"
    __proto__: Object {__defineGetter__: , __defineSetter__: , hasOwnProperty: , …
}
```

The score of .92 is a high probability for the entity **Seattle** found with the built-in type **geography.city**. That is enough information to search for hotels in the city of Seattle.


## Next steps

* You can learn more about this [specific sample][Github-BotBuilder-Samples-LUIS].
* Try to improve your LUIS app's performance by continuing to [add](Add-example-utterances.md) and [label utterances](Label-Suggested-Utterances.md).
* Try adding additional [Features](Add-Features.md) to enrich your model and improve performance in language understanding. Features help your app identify alternative interchangeable words/phrases, as well as commonly used patterns specific to your domain.

<!-- Links -->
[Github-BotFramework-Emulator-Download]: https://github.com/Microsoft/BotFramework-Emulator/releases/
[Github-BotBuilder-Samples]: https://github.com/Microsoft/BotBuilder-Samples
[Github-BotBuilder-Samples-LUIS]:https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/intelligence-LUIS
[NodeJs]: https://nodejs.org/
[BFPortal]: https://dev.botframework.com/
[RegisterInstructions]: https://docs.microsoft.com/bot-framework/portal-register-bot
[BotFramework]: https://docs.microsoft.com/bot-framework/
[LUIS-website]: https://luis.ai
