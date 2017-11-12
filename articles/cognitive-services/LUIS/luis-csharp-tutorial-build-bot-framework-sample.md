---
title: Integrate LUIS with a bot using the Bot Builder SDK for C# in Azure | Microsoft Docs 
description: Build a bot integrated with a LUIS application using the Bot Framework. 
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 10/16/2017
ms.author: v-g-berr
---

# Integrate LUIS with a bot using the Bot Builder SDK for C#

This tutorial walks you through connecting to a bot built with [Bot Framework][BotFramework] integrated with a LUIS app.

When a user talks to your bot with a phrase such as "Search hotels in Seattle", the bot calls into your LUIS app with the LUIS endpoint URL. LUIS returns a response to the bot and the bot constructs a response to the user. 

In the Bot Framework Emulator, you can see what is happening from the user's view as well as the HTTP request/response log in the log panel.

## Prerequisites
The tutorial assumes you have the following before you begin the next steps:

* The latest version of [Visual Studio][VisualStudio] installed 
* An Azure LUIS subscription

## Outline of steps
The steps in this tutorial are summarized here. More details will be given in the following sections for these steps. 

* Download and install the [Bot Framework emulator][Github-BotFramework-Emulator-Download].
* Download the [BotBuilder-Samples][Github-BotBuilder-Samples] repository. This has the LUIS app definition file as well as the LUIS sample bot.
* In [luis.ai][LUIS-website], create and publish a LUIS app from a file provided in BotBuilder-Samples. Publishing the app gives you the app's LUIS endpoint. This will be the URL that the bot calls. 
* In Visual Studio, edit the BotBuilder-Samples LUIS bot's RootLuisDialog.cs for the LUIS endpoint.
* In Visual Studio, start the BotBuilder-Samples LUIS bot. Note the port, such as 3979
* Start the Bot Framework Emulator. Enter the URL for the bot, such as http://localhost:3979/api/messages.
* Ask the bot: "Search hotels in Seattle"
* View the bot's response

>[!NOTE]
* If you choose to secure your bot or work with a bot that is not local to your computer, you need to create a [Bot Framework developer account][BFPortal] and [register][RegisterInstructions] your bot. Learn more about the [Bot Framework][BotFramework].
* Bot Builder is used as an NuGet dependency in the LUIS sample bot application. You don’t have to do anything in order to get the dependency. It is already included for you.

## Download and install the Bot Emulator
The [Bot Framework Emulator][Github-BotFramework-Emulator-Download] is available on GitHub. Download and install the correct version for your operating system. Note where the application is on your computer so you can start it in a later step.

## Clone or download the BotBuilder-Samples repository
 [BotBuilder-Samples][Github-BotBuilder-Samples] is a GitHub repository with more samples beyond just the LUIS bot. The subfolder you need for this tutorial is [./CSharp/Intelligence-LUIS][Github-BotBuilder-Samples-LUIS].

Clone or download the repository to your computer. You edit and run the CSharp/Intelligence-LUIS sample found in this repository.

## Create a new LUIS Application from the application definition file
Create a [luis.ai][LUIS-website] account and log in.

In order to get a new LUIS application set up for the bot, you need to import the **LuisBot.json** file found at ./BotBuilder-Samples/CSharp/Intelligence-LUIS folder. The file contains the application definition for the LUIS app the sample bot uses.

1. On the **My Apps** page  of the [LUIS web page][LUIS-website], click **Import App**.
2. In the **Import new app** dialog box, click **Choose file** and upload the LuisBot.json file. Name your application "Hotel Finder", and Click **Import**. <!--    ![A new app form](./Images/NewApp-Form.JPG) -->It may take a few minutes for LUIS to extract the intents and entities from the JSON file. When the import is complete, LUIS opens the Dashboard page of the Hotel Finder app<!-- which looks like the following screen-->. 
3. Once the app is imported, you need to change the [Assigned endpoint key][AssignedEndpointDoc] on the Publish App page to your Azure LUIS subscription. Then publish the app. Copy your endpoint URL which contains your LUIS app ID and your LUIS subscription ID.

The URL looks something like the following URL: 

```
# LUIS endpoint URL
https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/a0be191c-ebe0-4153-a4c3-d880b9c5d753?subscription-key=a237d6bc86cd4562bf67b09dff44d2e6&timezoneOffset=0&verbose=true&q=
```

The number after the /apps/ is your app ID. The number in the query string for subscription-key is your subscription ID. Using the above example, the app ID is: 

```
a0be191c-ebe0-4153-a4c3-d880b9c5d753
```

and the subscription ID is:

```
a237d6bc86cd4562bf67b09dff44d2e6
```

and the domain is the base URL:

```
https://westus.api.cognitive.microsoft.com
```


## Set the LUIS endpoint in the LUIS sample bot
In Visual Studio, set your LUIS application credentials. Open the `RootLuisDialog.cs` file and change the `LuisModel` attribute settings for the app ID, subscription ID, and domain:

```
[LuisModel("a0be191c-ebe0-4153-a4c3-d880b9c5d753", "a237d6bc86cd4562bf67b09dff44d2e6", domain: "westus.api.cognitive.microsoft.com")]
[Serializable]
public class RootLuisDialog : LuisDialog<object>
```

## Start the bot
From Visual Studio, start the LUIS bot sample. A browser window will open including the URL with a port number. The port number, such as 3979, is necessary for the next step.

## Start the Bot Emulator
Start the Bot Framework emulator.

The Bot Emulator needs the sample bot's endpoint such as http://localhost:3979/api/messages. Enter that into the address bar at the top of the emulator. It asks you for the Bot's application ID and password. You don't need those values if the bot is local to your computer, so click on CONNECT. 

If you see the following connection error in the log, the Bot Emulator cannot find your bot. 

```
POST connect ECONNREFUSED 127.0.0.1:3979
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

## See the LUIS response while running the bot
The Bot Builder SDK uses the LUIS endpoint API you set in the **RootLuisDialog.cs** file in the class level attribute **LuisModel**. The LuisModel is defined as: 

```
public LuisModelAttribute(string modelID, string subscriptionKey, LuisApiVersion apiVersion = LuisApiVersion.V2, string domain = null, bool log = true, bool spellCheck = false, bool staging = false, bool verbose = false);
```

Set a breakpoint in each of the methods decorated with your LUIS intents of Help, None, ShowHotelsReviews, and SearchHotels. And enter your query again: "Search hotels in Seattle".

When the breakpoint stops in the **SearchHotels** intent's method of **Search**, you can inspect what LUIS returned with the result parameter. The result parameter includes **TopScoringIntent** which in this case is "SearchHotels" as well as all entities and Intents found.

## Next steps

* You can learn more about this [specific sample][BotBuilder-CSharp-Sample-Readme]. 
* Try to improve your LUIS app's performance by continuing to [add](Add-example-utterances.md) and [label utterances](Label-Suggested-Utterances.md).
* Try adding additional [Features](Add-Features.md) to enrich your model and improve performance in language understanding. Features help your app identify alternative interchangeable words/phrases, as well as commonly used patterns specific to your domain.

<!-- Links -->
[Github-BotFramework-Emulator-Download]: https://github.com/Microsoft/BotFramework-Emulator/releases/
[Github-BotBuilder-Samples]: https://github.com/Microsoft/BotBuilder-Samples
[Github-BotBuilder-Samples-LUIS]:https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/intelligence-LUIS
[BotBuilder-CSharp-Sample-Readme]:https://github.com/Microsoft/BotBuilder-Samples/blob/master/CSharp/intelligence-LUIS/README.md
[BFPortal]: https://dev.botframework.com/
[RegisterInstructions]: https://docs.microsoft.com/bot-framework/portal-register-bot
[BotFramework]: https://docs.microsoft.com/bot-framework/
[LUIS-website]: https://luis.ai
[AssignedEndpointDoc]:https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/manage-keys
[VisualStudio]: https://www.visualstudio.com/

<!-- tested on Win10 -->
