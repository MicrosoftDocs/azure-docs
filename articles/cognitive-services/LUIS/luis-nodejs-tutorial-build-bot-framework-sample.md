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

This tutorial walks you through creating a bot with the Bot Builder SDK for Node.js and integrating it with a Language Understanding Intelligent Service (LUIS) app. 



## Before you begin
Before you start, make sure you have the accounts and tools you need for working with LUIS and the [Bot Framework][BotFramework].

### LUIS prerequisites
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. This should be the same account that you use for LUIS.

### Bot Framework prerequisites
* Download the [Bot Builder SDK][BotBuilderDownload] from GitHub. [Install][InstallNodeJsSDK] the SDK for [Node.js][NodeJs].
* Install the [Bot Framework Emulator][EmulatorDownload], which you'll use to run the bot locally.
* Create an account on the [Bot Framework developer portal][BFPortal], where you'll register the bot.



## 1. Download the sample bot

Download the sample code for the [LUIS demo bot (Node.js)](https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/intelligence-LUIS) from GitHub. This is a chat bot that can search for hotels in a specified location and provide reviews for a specified hotel. It listens for three different user intents: `SearchHotels`, `ShowHotelsReviews`, and `Help`.

## 2. Import the LUIS model to create the LUIS app
You can create and manage your applications on **My Apps** page. You can always access this page by clicking **My Apps** on the top navigation bar of the [LUIS web page](https://luis.ai).

1. On the **My Apps** page, click **Import App**.
2. In the **Import new app** dialog box, click **Choose file** and navigate to `LuisBot.json` in the folder where you downloaded the bot in step 1. Name your application "Hotel Finder", and Click **Import**. <!--    ![A new app form](./Images/NewApp-Form.JPG) -->It may take a few minutes for LUIS to extract the intents and entities from the JSON file. When the import is complete, LUIS opens the Dashboard page of the Hotel Finder app<!-- which looks like the following screen-->. Use the navigation links in the left panel to move through your app pages to define data and work on your app. 

## 3. Train and publish the LUIS app
Go to **Train & Test** and click **Train your app**.  Optionally, you can also test your app now, but it is not required for publishing. To publish, go to **Publish App**, select an **Endpoint Key**, select **Production** for the **Endpoint slot**, and click **Publish**.

## 4. Copy the LUIS endpoint URL
Once you've published the app, the **Publish App** page will display an endpoint URL. Copy this URL. You'll update the bot's code to point to it.

## 5. Paste the LUIS endpoint into the bot code
1. Go to the `.env` file in the sample bot. Set `LUIS_MODEL_URL` to the URL from the previous step.
2. Delete any trailing `&q=` from the URL. Here's an example of how the URL might look:
```
LUIS_MODEL_URL=https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2c2afc3e-5f39-4b6f-b8ad-c47ce1b98d8a?subscription-key=9823b65a8c9045f8bce7fee87a5e1fbc&verbose=true&timezoneOffset=0
```


In `app.js` this URL is used to initialize the recognizer object that the bot uses to listen for the user's intent.
```javascript
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
```
## 6. Register the bot
Go to the [Bot Framework developer portal][BFPortal] and [register][RegisterInstructions] the bot. As part of this process, you'll generate a Microsoft App ID and password. Copy and securely store the password that is shown, and enter the App ID and password in the bot's `.env` file.

## 7. Start the bot
Open a node.js command prompt, and run the bot: `node app.js`. 

## 8. Start the emulator
1. Run the Bot Framework Emulator, enter `http://localhost:3978/api/messages` for your endpoint URL, and enter the Microsoft App ID and password from step 6, which you should have in the `.env` file.
2. (Optional) Take note of the URL in the **Log** panel of the emulator.  There should be a message displaying the ngrok URL, similar to this example: `ngrok listening on https://ce9a9909.ngrok.io`. Go back to the [Bot Framework developer portal][BFPortal] and enter this URL in the bot's profile, appending `/api/messages` to the URL. This step is optional, but useful if you later decide to test the bot using the developer portal or connect it to channels other than the emulator.

## 9. Talk to the bot
1. Click **Connect** in the emulator. You can start giving the bot some requests like "Find me hotels in Paris", or "Show me reviews of the Contoso Hotel".

## Next steps

* Try to improve your LUIS app's performance by continuing to [add](Add-example-utterances.md) and [label utterances](Label-Suggested-Utterances.md).
* Try adding additional [Features](Add-Features.md) to enrich your model and improve performance in language understanding. Features help your app identify alternative interchangeable words/phrases, as well as commonly used patterns specific to your domain.

<!-- Links -->
[EmulatorDownload]: https://github.com/Microsoft/BotFramework-Emulator
[BotBuilderDownload]: https://github.com/
[InstallNodeJsSDK]: https://docs.microsoft.com/bot-framework/nodejs/
[NodeJs]: https://nodejs.org/
[BFPortal]: https://dev.botframework.com/
[RegisterInstructions]: https://docs.microsoft.com/bot-framework/portal-register-bot
[BotFramework]: https://docs.microsoft.com/bot-framework/
