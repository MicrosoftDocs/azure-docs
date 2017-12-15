---
title: Integrate LUIS with a bot using the Bot Builder SDK for C# in Azure | Microsoft Docs 
description: Build a bot integrated with a LUIS application using the Bot Framework. 
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 12/13/2017
ms.author: v-geberr
---

# Web App Bot using the LUIS template for C#

Build a chat bot with integrated language understanding.

## Prerequisite

Before you create the bot, follow the steps in [Create an app](./luis-get-started-create-app.md) to build the LUIS app that it uses.

The bot responds to intents from the HomeAutomation domain that are in the LUIS app. For each of these intents, the LUIS app provides an intent that maps to it. The bot provides a dialog that handles the intent that LUIS detects.

| Intent | Example utterance | Bot functionality |
|:----:|:----------:|---|
| HomeAutomation.TurnOn | Turn on the lights. | The bot invokes the `TurnOnDialog` when the `HomeAutomation.TurnOn` is detected. This dialog is where you'd invoke an IoT service to turn on a device and tell the user that the device has been turned on. |
| HomeAutomation.TurnOff | Turn off the bedroom lights. | The bot invokes the `TurnOffDialog` when the `HomeAutomation.TurnOff` is detected. This dialog where you'd invoke an IoT service to turn off a device and tell the user that the device has been turned off. |

## Create a Language Understanding bot with Bot Service

1. In the [Azure portal](https://portal.azure.com), select **Create new resource** in the menu blade and click **See all**.

    ![Create new resource](./media/luis-tutorial-cscharp-web-bot/bot-service-creation.png)

2. In the search box, search for **Web App Bot**. 

    ![Create new resource](./media/luis-tutorial-cscharp-web-bot/bot-service-selection.png)

3. In the **Bot Service** blade, provide the required information, and click **Create**. This creates and deploys the bot service and LUIS app to Azure. 
    * Set **App name** to your bot’s name. The name is used as the subdomain when your bot is deployed to the cloud (for example, mynotesbot.azurewebsites.net). <!-- This name is also used as the name of the LUIS app associated with your bot. Copy it to use later, to find the LUIS app associated with the bot. -->
    * Select the subscription, [resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview), App service plan, and [location](https://azure.microsoft.com/en-us/regions/).
    * Select the **Language understanding (Node.js)** template for the **Bot template** field.

    ![Bot Service blade](./media/luis-tutorial-cscharp-web-bot/bot-service-setting-callout-template.png)

    * Check the box to confirm to the terms of service.

4. Confirm that the bot service has been deployed.
    * Click Notifications (the bell icon that is located along the top edge of the Azure portal). The notification will change from **Deployment started** to **Deployment succeeded**.
    * After the notification changes to **Deployment succeeded**, click **Go to resource** on that notification.

> [!Note]
> This web app bot creation process also created a new LUIS app for you. Its name contains the Web app bot's name. It has been trained and published for you. 

## Try the default bot

Confirm that the bot has been deployed by checking the **Notifications**. The notifications will change from **Deployment in progress...** to **Deployment succeeded**. Click **Go to resource** button to open the bot's resources blade.

Once the bot is registered, click **Test in Web Chat** to open the Web Chat pane. Type "hello" in Web Chat.

  ![Test the bot in Web Chat](./media/luis-tutorial-cscharp-web-bot/bot-service-web-chat.png)

The bot responds by saying "You have reached Greeting. You said: hello". This confirms that the bot has received your message and passed it to a default LUIS app that it created. This default LUIS app detected a Greeting intent. In the next step you'll connect the bot to the LUIS app you previously created instead of the default LUIS app.

## Connect your LUIS app to the bot

Open **Application Settings** and edit the **LuisAppId** field to contain the application ID of your LUIS app.

  ![Update the LUIS app ID in Azure](./media/luis-tutorial-cscharp-web-bot/bot-service-app-id.png)

If you don't have the LUIS app ID, log in to [https://www.luis.ai](https://www.luis.ai) using the same account you use to log in to Azure. Click on **My apps**. 

1. Find the LUIS app you previously created, that contains the intents and entities from the HomeAutomation domain.
2. In the **Settings** page for the LUIS app, find and copy the app ID.
3. If you haven't trained the app, click the **Train** button in the upper right to train your app.
4. If you haven't published the app, click **Publish** in the top navigation bar to open the **Publish** page. Click the **Publish to production slot** button. 

## Modify the bot code

Click **Build** and then click **Open online code editor**.

   ![Open online code editor](./media/luis-tutorial-cscharp-web-bot/bot-service-build.png)

In the code editor, open `/Dialogs/BasicLuisDialog.cs`. It contains the following code:

```CSharp
using System;
using System.Configuration;
using System.Threading.Tasks;

using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Luis;
using Microsoft.Bot.Builder.Luis.Models;

namespace Microsoft.Bot.Sample.LuisBot
{
    // For more information about this template visit http://aka.ms/azurebots-csharp-luis
    [Serializable]
    public class BasicLuisDialog : LuisDialog<object>
    {
        public BasicLuisDialog() : base(new LuisService(new LuisModelAttribute(
            ConfigurationManager.AppSettings["LuisAppId"], 
            ConfigurationManager.AppSettings["LuisAPIKey"], 
            domain: ConfigurationManager.AppSettings["LuisAPIHostName"])))
        {
        }

        [LuisIntent("None")]
        public async Task NoneIntent(IDialogContext context, LuisResult result)
        {
            await this.ShowLuisResult(context, result);
        }

        // Go to https://luis.ai and create a new intent, then train/publish your luis app.
        // Finally replace "Gretting" with the name of your newly created intent in the following handler
        [LuisIntent("Greeting")]
        public async Task GreetingIntent(IDialogContext context, LuisResult result)
        {
            await this.ShowLuisResult(context, result);
        }

        [LuisIntent("Cancel")]
        public async Task CancelIntent(IDialogContext context, LuisResult result)
        {
            await this.ShowLuisResult(context, result);
        }

        [LuisIntent("Help")]
        public async Task HelpIntent(IDialogContext context, LuisResult result)
        {
            await this.ShowLuisResult(context, result);
        }

        private async Task ShowLuisResult(IDialogContext context, LuisResult result) 
        {
            await context.PostAsync($"You have reached {result.Intents[0].Intent}. You said: {result.Query}");
            context.Wait(MessageReceived);
        }
    }
```

## Change code to use HomeAutomation prebuilt domain
Remove the three intents attributes and methods for **Greeting**, **Cancel**, and **Help**. These are not used in the HomeAutomation prebuilt domain. Make sure to keep the **None** intent attribute and method. 

Add constants to manage strings:

   [!code-csharp[Add Intent and Entity Constants](~/samples-luis/documentation-samples/tutorial-web-app-bot/csharp/BasicLuisDialog.cs?range=23-32&dedent=8 "Add Intent and Entity Constants")]

Add the code for the new intents of HomeAutomation.TurnOn and HomeAutomation.TurnOff:

   [!code-csharp[Add Intents](~/samples-luis/documentation-samples/tutorial-web-app-bot/csharp/BasicLuisDialog.cs?range=59-69&dedent=8 "Add Intents")]

Add the code to get any entities found by LUIS:

   [!code-csharp[Collect entities](~/samples-luis/documentation-samples/tutorial-web-app-bot/csharp/BasicLuisDialog.cs?range=34-51&dedent=8 "Collect entities")]

Change **ShowLuisResult** method to round the score, collect the entities, and display message in chat bot:

   [!code-csharp[Display message in chat bot](~/samples-luis/documentation-samples/tutorial-web-app-bot/csharp/BasicLuisDialog.cs?range=71-81&dedent=8 "Display message in chat bot")]

## Test the bot

In the Azure Portal, click on **Test in Web Chat** to test the bot. Type messages like "Turn on the lights", and "turn off my heater" to invoke the intents that you added to it.

   ![Test HomeAutomation bot in Web Chat](./media/luis-tutorial-cscharp-web-bot/bot-service-chat-results.png)

> [!TIP]
> If you find that your bot doesn't always recognize the correct intent or entities, improve your LUIS app's performance by giving it more example utterances to train it. You can retrain your LUIS app without any modification to your bot's code. See [Add example utterances](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/add-example-utterances) and [train and test your LUIS app](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/train-test).


## Next steps


You'll notice that the bot provides dialogs for handling Help, Cancel, and Greeting intents. You can try to add these intents to the LUIS app and test them using the bot.

> [!NOTE] 
> The default LUIS app that the template created contains example utterances for Cancel, Greeting, and Help intents. In the list of apps, find the app that begins with the name specified in **App name** in the **Bot Service** blade when you created the Bot Service. 

> [!div class="nextstepaction"]
> [Add intents](./add-intents.md)

<!-- Links -->
[Github-BotFramework-Emulator-Download]: https://aka.ms/bot-framework-emulator
[Github-LUIS-Samples]: https://github.com/Microsoft/LUIS-Samples
[Github-LUIS-Samples-cs-hotel-bot]: https://github.com/Microsoft/LUIS-Samples/tree/master/bot-integration-samples/hotel-finder/csharp
[Github-LUIS-Samples-cs-hotel-bot-readme]: https://github.com/Microsoft/LUIS-Samples/blob/master/bot-integration-samples/hotel-finder/csharp/README.md
[BFPortal]: https://dev.botframework.com/
[RegisterInstructions]: https://docs.microsoft.com/bot-framework/portal-register-bot
[BotFramework]: https://docs.microsoft.com/bot-framework/
[LUIS-website]: https://www.luis.ai
[AssignedEndpointDoc]:https://docs.microsoft.com/azure/cognitive-services/LUIS/manage-keys
[VisualStudio]: https://www.visualstudio.com/

<!-- tested on Win10 -->
