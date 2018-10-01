---
title: LUIS Bot with Node.js - Web app Bot - Bot Framework SDK 3.0
titleSuffix: Azure Cognitive Services
description: Build a bot integrated with a LUIS application using the Bot Framework.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/24/2018
ms.author: diberry
---

# LUIS bot in Node.js

Using Node.js, build a chat bot integrated with language understanding (LUIS). This chat bot uses the prebuilt HomeAutomation domain to quickly implement a bot solution. The bot is built with the Bot Framework 3.x and the Azure Web app bot.

## Prerequisite

Before you create the bot, follow the steps in [Create an app](./luis-get-started-create-app.md) to build the LUIS app that it uses.

The bot responds to intents from the HomeAutomation domain that are in the LUIS app. For each of these intents, the LUIS app provides an intent that maps to it. The bot provides a dialog that handles the intent that LUIS detects.

| Intent | Example utterance | Bot functionality |
|:----:|:----------:|---|
| HomeAutomation.TurnOn | Turn on the lights. | The bot invokes the `TurnOnDialog` when the `HomeAutomation.TurnOn` is detected. This dialog is where you'd invoke an IoT service to turn on a device and tell the user that the device has been turned on. |
| HomeAutomation.TurnOff | Turn off the bedroom lights. | The bot invokes the `TurnOffDialog` when the `HomeAutomation.TurnOff` is detected. This dialog where you'd invoke an IoT service to turn off a device and tell the user that the device has been turned off. |


## Create a Language Understanding bot with Bot Service

1. In the [Azure portal](https://portal.azure.com), select **Create new resource** in the menu blade and select **See all**.

    ![Create new resource](./media/luis-tutorial-node-bot/bot-service-creation.png)

2. In the search box, search for **Web App Bot**. 

    ![Create new resource](./media/luis-tutorial-node-bot/bot-service-selection.png)

3. In the **Bot Service** blade, provide the required information, and select **Create**. This creates and deploys the bot service and LUIS app to Azure. If you want to use [speech priming](https://docs.microsoft.com/bot-framework/bot-service-manage-speech-priming), review [region requirements](luis-resources-faq.md#what-luis-regions-support-bot-framework-speech-priming) before creating your bot. 
    * Set **App name** to your bot’s name. The name is used as the subdomain when your bot is deployed to the cloud (for example, mynotesbot.azurewebsites.net). <!-- This name is also used as the name of the LUIS app associated with your bot. Copy it to use later, to find the LUIS app associated with the bot. -->
    * Select the subscription, [resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview), App service plan, and [location](https://azure.microsoft.com/regions/).
    * For **Bot template**, select:
        * **SDK v3**
        * **Node.js**
        * **Language understanding**
    * Select the **LUIS App Location**. This is the authoring [region][LUIS] the app is created in.
    * Select the confirmation checkbox for the legal notice. The terms of the legal notice are below the checkbox.

    ![Bot Service blade](./media/luis-tutorial-node-bot/bot-service-setting-callout-template.png)


4. Confirm that the bot service has been deployed.
    * Select Notifications (the bell icon that is located along the top edge of the Azure portal). The notification will change from **Deployment started** to **Deployment succeeded**.
    * After the notification changes to **Deployment succeeded**, select **Go to resource** on that notification.

## Try the default bot

Confirm that the bot has been deployed by checking the **Notifications**. The notifications will change from **Deployment in progress...** to **Deployment succeeded**. Select **Go to resource** button to open the bot's resources blade.

<!-- this step isn't supposed to be necessary -->
## Install NPM resources
Install NPM packages with the following steps:

1. Select **Build** from the **Bot Management** section of the Web App Bot. 

2. A new, second browser window opens. Select **Open online code editor**.

3. In the top navigation bar, select the web app bot name `homeautomationluisbot`. 

4. In the drop-down list, select **Open Kudu Console**.

5. A new browser window opens. In the console, enter the following command:

    ```
    cd site\wwwroot && npm install
    ```

    Wait for the install process to finish. Return to the first browser window. 

## Test in Web Chat
Once the bot is registered, select **Test in Web Chat** to open the Web Chat pane. Type "hello" in Web Chat.

  ![Test the bot in Web Chat](./media/luis-tutorial-node-bot/bot-service-web-chat.png)

The bot responds by saying "You have reached Greeting. You said: hello". This confirms that the bot has received your message and passed it to a default LUIS app that it created. This default LUIS app detected a Greeting intent. In the next step, you'll connect the bot to the LUIS app you previously created instead of the default LUIS app.

## Connect your LUIS app to the bot

Open **Application Settings** in the first browser window and edit the **LuisAppId** field to contain the application ID of your LUIS app.

  ![Update the LUIS app ID in Azure](./media/luis-tutorial-node-bot/bot-service-app-id.png)

If you don't have the LUIS app ID, log in to the [LUIS](luis-reference-regions.md) website using the same account you use to log in to Azure. Select on **My apps**. 

1. Find the LUIS app you previously created, that contains the intents and entities from the HomeAutomation domain.

2. In the **Settings** page for the LUIS app, find and copy the app ID.

3. If you haven't trained the app, select the **Train** button in the upper right to train your app.

4. If you haven't published the app, select **PUBLISH** in the top navigation bar to open the **Publish** page. Select the Production slot and the **Publish** button.

## Modify the bot code

Go to the second browser window if it is still open or in the first browser window, select **Build** and then select **Open online code editor**.

   ![Open online code editor](./media/luis-tutorial-node-bot/bot-service-build.png)

In the code editor, open `app.js`. It contains the following code:

```javascript
/*-----------------------------------------------------------------------------
A simple Language Understanding (LUIS) bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
var bot = new builder.UniversalBot(connector, function (session, args) {
    session.send('You reached the default message handler. You said \'%s\'.', session.message.text);
});

bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 
bot.dialog('GreetingDialog',
    (session) => {
        session.send('You reached the Greeting intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Greeting'
})

bot.dialog('HelpDialog',
    (session) => {
        session.send('You reached the Help intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Help'
})

bot.dialog('CancelDialog',
    (session) => {
        session.send('You reached the Cancel intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Cancel'
})
```

The existing intents in the app.js are ignored. You can leave them. 

## Add a dialog that matches HomeAutomation.TurnOn

Copy the following code and add it to `app.js`.

```javascript
bot.dialog('TurnOn',
    (session) => {
        session.send('You reached the TurnOn intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'HomeAutomation.TurnOn'
})
```

The [matches][matches] option on the [triggerAction][triggerAction] attached to the dialog specifies the name of the intent. The recognizer runs each time the bot receives an utterance from the user. If the highest scoring intent that it detects matches a `triggerAction` bound to a dialog, the bot invokes that dialog.

## Add a dialog that matches HomeAutomation.TurnOff

Copy the following code and add it to `app.js`.

```javascript
bot.dialog('TurnOff',
    (session) => {
        session.send('You reached the TurnOff intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'HomeAutomation.TurnOff'
})
```
## Test the bot

In the Azure Portal, select on **Test in Web Chat** to test the bot. Try type messages like "Turn on the lights", and "turn off my heater" to invoke the intents that you added to it.
   ![Test HomeAutomation bot in Web Chat](./media/luis-tutorial-node-bot/bot-service-chat-results.png)

> [!TIP]
> If you find that your bot doesn't always recognize the correct intent or entities, improve your LUIS app's performance by giving it more example utterances to train it. You can retrain your LUIS app without any modification to your bot's code. See [Add example utterances](https://docs.microsoft.com/azure/cognitive-services/LUIS/add-example-utterances) and [train and test your LUIS app](https://docs.microsoft.com/azure/cognitive-services/LUIS/luis-interactive-test).

## Learn more about Bot Framework
Learn more about [Bot Framework](https://dev.botframework.com/) and the [3.x](https://github.com/Microsoft/BotBuilder) and [4.x](https://github.com/Microsoft/botbuilder-js) SDKs.

## Next steps

<!-- From trying the bot, you can see that the recognizer can trigger interruption of the currently active dialog. Allowing and handling interruptions is a flexible design that accounts for what users really do. Learn more about the various actions you can associate with a recognized intent.-->
You can try to add other intents, like Help, Cancel, and Greeting, to the LUIS app. Then add dialogs for the new intents and test them using the bot. 

<!-- 
> [!NOTE] 
> The default LUIS app that the template created contains example utterances for Cancel, Greeting, and Help intents. In the list of apps, find the app that begins with the name specified in **App name** in the **Bot Service** blade when you created the Bot Service. -->

> [!div class="nextstepaction"]
> [Add intents](./luis-how-to-add-intents.md)
> [Speech priming](https://docs.microsoft.com/bot-framework/bot-service-manage-speech-priming)


[intentDialog]: https://docs.botframework.com/node/builder/chat-reference/classes/_botbuilder_d_.intentdialog.html

[intentDialog_matches]: https://docs.botframework.com/node/builder/chat-reference/classes/_botbuilder_d_.intentdialog.html#matches 

[NotesSample]: https://github.com/Microsoft/BotFramework-Samples/tree/master/docs-samples/Node/basics-naturalLanguage

[triggerAction]: https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.dialog.html#triggeraction

[confirmPrompt]: https://docs.botframework.com/node/builder/chat-reference/interfaces/_botbuilder_d_.itriggeractionoptions.html#confirmprompt

[waterfall]: bot-builder-nodejs-dialog-manage-conversation-flow.md#manage-conversation-flow-with-a-waterfall

[session_userData]: https://docs.botframework.com/node/builder/chat-reference/classes/_botbuilder_d_.session.html#userdata

[EntityRecognizer_findEntity]: https://docs.botframework.com/node/builder/chat-reference/classes/_botbuilder_d_.entityrecognizer.html#findentity

[matches]: https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.itriggeractionoptions.html#matches

[LUISAzureDocs]: https://docs.microsoft.com/azure/cognitive-services/LUIS/Home

[Dialog]: https://docs.botframework.com/node/builder/chat-reference/classes/_botbuilder_d_.dialog.html

[IntentRecognizerSetOptions]: https://docs.botframework.com/node/builder/chat-reference/interfaces/_botbuilder_d_.iintentrecognizersetoptions.html

[LuisRecognizer]: https://docs.botframework.com/node/builder/chat-reference/classes/_botbuilder_d_.luisrecognizer

[LUISConcepts]: https://docs.botframework.com/node/builder/guides/understanding-natural-language/

[DisambiguationSample]: https://github.com/Microsoft/BotBuilder/tree/master/Node/examples/feature-onDisambiguateRoute

[IDisambiguateRouteHandler]: https://docs.botframework.com/node/builder/chat-reference/interfaces/_botbuilder_d_.idisambiguateroutehandler.html

[RegExpRecognizer]: https://docs.botframework.com/node/builder/chat-reference/classes/_botbuilder_d_.regexprecognizer.html

[AlarmBot]: https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/basics-naturalLanguage/app.js

[LUISBotSample]: https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/intelligence-LUIS

[UniversalBot]: https://docs.botframework.com/node/builder/chat-reference/classes/_botbuilder_d_.universalbot.html


<!-- Old Links -->
[Github-BotFramework-Emulator-Download]: https://aka.ms/bot-framework-emulator
[Github-LUIS-Samples]: https://github.com/Microsoft/LUIS-Samples
[Github-LUIS-Samples-node-hotel-bot]: https://github.com/Microsoft/LUIS-Samples/tree/master/bot-integration-samples/hotel-finder/nodejs
[NodeJs]: https://nodejs.org/
[BFPortal]: https://dev.botframework.com/
[RegisterInstructions]: https://docs.microsoft.com/bot-framework/portal-register-bot
[BotFramework]: https://docs.microsoft.com/bot-framework/
[LUIS]: https://docs.microsoft.com/azure/cognitive-services/luis/luis-reference-regions

