---
title: Bot - C# - v4 
titleSuffix: Language Understanding - Azure Cognitive Services
description: Using C#, build a chat bot integrated with language understanding (LUIS). This chat bot uses the Human Resources app to quickly implement a bot solution. The bot is built with the Bot Framework version 4 and the Azure Web app bot.
services: cognitive-services
author: diberry
ms.custom: seodec18
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: tutorial
ms.date: 06/13/2019
ms.author: diberry
---

# Tutorial: LUIS bot in C# with the Bot Framework 4.x and the Azure Web app bot
Using C#, you can build a chat bot integrated with language understanding (LUIS). This bot uses the HomeAutomation app to implement a bot solution. The bot is built the Azure [Web app bot](https://docs.microsoft.com/azure/bot-service/) with [Bot Framework version](https://github.com/Microsoft/botbuilder-dotnet) v4.

**In this tutorial, you learn how to:**

> [!div class="checklist"]
> * Create a web app bot. This process creates a new LUIS app for you.
> * Download the bot project created by the Web bot service
> * Start bot & emulator locally on your computer
> * View utterance results in bot

## Prerequisites

* [Bot emulator](https://aka.ms/abs/build/emulatordownload)
* [Visual Studio](https://visualstudio.microsoft.com/downloads/)


## Create web app bot

1. In the [Azure portal](https://portal.azure.com), select **Create new resource**.

1. In the search box, search for and select **Web App Bot**. Select **Create**.

1. In **Bot Service**, provide the required information:

    |Setting|Purpose|Suggested setting|
    |--|--|--|
    |Bot name|Resource name|`luis-csharp-bot-` + `<your-name>`, for example, `luis-csharp-bot-johnsmith`|
    |Subscription|Subscription where to create bot.|Your primary subscription.
    |Resource group|Logical group of Azure resources|Create a new group to store all resources used with this bot, name the group `luis-csharp-bot-resource-group`.|
    |Location|Azure region - this doesn't have to be the same as the LUIS authoring or publishing region.|`westus`|
    |Pricing tier|Used for service request limits and billing.|`F0` is the free tier.
    |App name|The name is used as the subdomain when your bot is deployed to the cloud (for example, humanresourcesbot.azurewebsites.net).|`luis-csharp-bot-` + `<your-name>`, for example, `luis-csharp-bot-johnsmith`|
    |Bot template|Bot framework settings - see next table|
    |LUIS App location|Must be the same as the LUIS resource region|`westus`|

1. In the **Bot template settings**, select the following, then choose the **Select** button under these settings:

    |Setting|Purpose|Selection|
    |--|--|--|
    |SDK version|Bot framework version|**SDK v4**|
    |SDK language|Programming language of bot|**C#**|
    |Echo/Basic bot|Type of bot|**Basic bot**|
    
1. Select **Create**. This creates and deploys the bot service to Azure. Part of this process creates a LUIS app named `luis-csharp-bot-XXXX`. This name is based on the /Azure Bot Service app name.

    [![Create web app bot](./media/bfv4-csharp/create-web-app-service.png)](./media/bfv4-csharp/create-web-app-service.png#lightbox)

## The bot's LUIS model

Part of the bot service deployment creates a new LUIS app with intents and example utterances. The bot provides intent mapping to the new LUIS app for the following intents: 

|Basic bot LUIS intents|example utterance|
|--|--|
|Book flight|`Travel to Paris`|
|Cancel|`bye`|
|None|Anything outside the domain of the app.|

## Test the bot

1. While still in the Azure portal for the new bot, select **Test in Web Chat**. 
1. In the **Type your message** textbox, enter the text `hello`. The bot responds with information about the bot framework, as well as example queries for the specific LUIS model such as booking a flight to Paris. 

    You can use the test functionality for quickly testing your bot. For more complete testing, including debugging, download the bot code and use Visual Studio. 

## Download the web app bot 
In order to develop the web app bot code, download the code and use on your local computer. 

1. In the Azure portal, select **Build** from the **Bot management** section. 

1. Select **Download Bot source code**. 

    [![Download web app bot source code for basic bot](../../../includes/media/cognitive-services-luis/bfv4/download-code.png)](../../../includes/media/cognitive-services-luis/bfv4/download-code.png#lightbox)

1. When the source code is zipped, a message will provide a link to download the code. Select the link. 

1. Save the zip file to your local computer and extract the files. Open the project with Visual Studio. 

1. Open the **LuiHelper.cs** file. This is where the user utterance entered into the bot is sent to LUIS.

    ```csharp
    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License.
    
    using System;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Bot.Builder;
    using Microsoft.Bot.Builder.AI.Luis;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    
    namespace Microsoft.BotBuilderSamples
    {
        public static class LuisHelper
        {
            public static async Task<BookingDetails> ExecuteLuisQuery(IConfiguration configuration, ILogger logger, ITurnContext turnContext, CancellationToken cancellationToken)
            {
                var bookingDetails = new BookingDetails();
    
                try
                {
                    // Create the LUIS settings from configuration.
                    var luisApplication = new LuisApplication(
                        configuration["LuisAppId"],
                        configuration["LuisAPIKey"],
                        "https://" + configuration["LuisAPIHostName"]
                    );
    
                    var recognizer = new LuisRecognizer(luisApplication);
    
                    // The actual call to LUIS
                    var recognizerResult = await recognizer.RecognizeAsync(turnContext, cancellationToken);
    
                    var (intent, score) = recognizerResult.GetTopScoringIntent();
                    if (intent == "Book_flight")
                    {
                        // We need to get the result from the LUIS JSON which at every level returns an array.
                        bookingDetails.Destination = recognizerResult.Entities["To"]?.FirstOrDefault()?["Airport"]?.FirstOrDefault()?.FirstOrDefault()?.ToString();
                        bookingDetails.Origin = recognizerResult.Entities["From"]?.FirstOrDefault()?["Airport"]?.FirstOrDefault()?.FirstOrDefault()?.ToString();
    
                        // This value will be a TIMEX. And we are only interested in a Date so grab the first result and drop the Time part.
                        // TIMEX is a format that represents DateTime expressions that include some ambiguity. e.g. missing a Year.
                        bookingDetails.TravelDate = recognizerResult.Entities["datetime"]?.FirstOrDefault()?["timex"]?.FirstOrDefault()?.ToString().Split('T')[0];
                    }
                }
                catch (Exception e)
                {
                    logger.LogWarning($"LUIS Exception: {e.Message} Check your LUIS configuration.");
                }
    
                return bookingDetails;
            }
        }
    }
    ```

    The bot sends the user's utterance to LUIS and gets the results. The top intent determines the conversation flow. 


## Start the bot
Before changing any code or settings, verify the bot works. 

In Visual Studio, start the bot. A browser window opens with the web app bot's web site at `http://localhost:3978/`. A home page displays with information about your bot.

![A home page displays with information about your bot.](./media/bfv4-csharp/running-bot-web-home-page-success.png)

## Start the emulator

1. Begin the Bot Emulator.
1. Create a new bot configuration and copy the `appId` and `appPassword` from the **appsettings.json** file in the Visual Studio project for the bot. The name of the bot configuration file should be the same as the bot name. 

    ```json
    {
        "name": "<bot name>",
        "description": "<bot description>",
        "services": [
            {
                "type": "endpoint",
                "appId": "<appId from appsettings.json>",
                "appPassword": "<appPassword from appsettings.json>",
                "endpoint": "http://localhost:3978/api/messages",
                "id": "<don't change this value>",
                "name": "http://localhost:3978/api/messages"
            }
        ],
        "padlock": "",
        "version": "2.0",
        "overrides": null,
        "path": "<local path to .bot file>"
    }
    ```

1. In the bot emulator, enter `Hello` and get the proper response for the basic bot.

    [![Basic bot response in emulator](./media/cognitive-services-luis/bfv4-csharp/ask-bot-emulator-a-question-and-get-response.png)](./media/cognitive-services-luisbfv4-csharp/ask-bot-emulator-a-question-and-get-response.png#lightbox)


## Ask question for Book Flight intent

1. In the bot emulator, book a flight by entering the following utterance: 

    ```bot
    Book a flight from Paris to Berlin on March 22, 2020
    ```

    The bot emulator asks to confirm. 

1. Select **Yes**. The bot responds with a summary of its actions. 
1. From the log of the bot emulator, select the line that includes `Luis Trace`. This displays the JSON response from LUIS for the intent and entities of the utterance.

    [![Basic bot response in emulator](./media/cognitive-services-luis/bfv4-csharp/ask-luis-book-flight-question-get-json-response-in-bot-emulator.png)](./media/cognitive-services-luisbfv4-csharp/ask-luis-book-flight-question-get-json-response-in-bot-emulator.png#lightbox)

## Learn more about Bot Framework

Azure Bot service uses the Bot Framework SDK. Learn more about the SDK and bot framework:

* [Azure Bot Service](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0) v4 documentation
* [Bot Builder Samples](https://github.com/Microsoft/botbuilder-samples)
* [Bot Builder C# SDK](https://github.com/Microsoft/botbuilder-dotnet)
* [Bot Builder tools](https://github.com/Microsoft/botbuilder-tools):

## Next steps

See more [samples](https://github.com/microsoft/botframework-solutions) with conversational bots. 

> [!div class="nextstepaction"]
> [Build a custom domain in LUIS](luis-quickstart-intents-only.md)
