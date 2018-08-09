---
title: Create your first Language Understanding (LUIS) app in 10 minutes in Azure | Microsoft Docs
description:  In this quickstart, create and manage a LUIS application on the Language Understanding (LUIS) webpage.
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 03/29/2018
ms.author: diberry
#Customer intent: As a new user, I want to quickly get a LUIS app created so I can understand the model and actions to train, test, publish, and query. 
---

# Quickstart: Use prebuilt Home automation app

In this quickstart, create a LUIS app that uses the prebuilt domain `HomeAutomation` for turning lights and appliances on and off.

 This prebuilt domain already has intents and entities provided for you. When you're finished, you'll have a LUIS endpoint running in the cloud.

For this article, you need a free [LUIS](luis-reference-regions.md#luis-website) account in order to author your LUIS application.

## Prerequisites
* To use Microsoft Cognitive Service APIs, you first need to create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal.
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a new app
You can create and manage your applications on **My Apps** page of [LUIS](luis-reference-regions.md#luis-website). 
1. Click **Create new app**.

    [![](media/luis-quickstart-new-app/app-list.png "Screenshot of app list")](media/luis-quickstart-new-app/app-list.png)

2. In the dialog box, name your application "Home Automation".

    [![](media/luis-quickstart-new-app/create-new-app-dialog.png "Screenshot of Create new app pop-up dialog")](media/luis-quickstart-new-app/create-new-app-dialog.png)

3. Choose your application culture (for this Home Automation app, choose English), and then click **Done**. 

    >[!NOTE]
    >The culture cannot be changed once the application is created. 

LUIS creates the Home Automation app. 

## Add prebuilt domain

Click on **Prebuilt domains** in the left-side navigation pane. Then search for "Home". Click on **Add domain**.

[![](media/luis-quickstart-new-app/home-automation.png "Screenshot of Home Automation domain called out in prebuilt domain menu")](media/luis-quickstart-new-app/home-automation.png)

When the domain is successfully added, the prebuilt domain box displays a **Remove domain** button.

[![](media/luis-quickstart-new-app/remove-domain.png "Screenshot of Home Automation domain with remove button")](media/luis-quickstart-new-app/remove-domain.png)

## Intents and entities

Click on **Intents** in the left-side navigation pane to review the HomeAutomation domain intents. 

[![](media/luis-quickstart-new-app/home-automation-intents.png "Screenshot of Intents list with Intent names in table highlighted")](media/luis-quickstart-new-app/home-automation-intents.png)

Each intent has sample utterances.

> [!NOTE]
> **None** is an intent provided by all LUIS apps. You use it to handle utterances that don't correspond to functionality your app provides. 

Click on the **HomeAutomation.TurnOff** intent. You can see that the intent contains a list of utterances that are labeled with entities.

[![](media/luis-quickstart-new-app/home-automation-turnon.png "Screenshot of HomeAutomation.TurnOff intent")](media/luis-quickstart-new-app/home-automation-turnon.png)

## Train your app

Click on **Train** in the top navigation.

[![](media/luis-quickstart-new-app/trained.png "Screenshot of HomeAutomation.TurnOff intent with green success notification")](media/luis-quickstart-new-app/trained.png)

## Test your app
Once you've trained your app, you can test it. Click **Test** in the top navigation. Type a test utterance like "Turn off the lights" into the Interactive Testing pane, and press Enter. 

```
Turn off the lights
```

Check that the top scoring intent corresponds to the intent you expected for each test utterance.

In this example, "Turn off the lights" is correctly identified as the top scoring intent of "HomeAutomation.TurnOff."

[![](media/luis-quickstart-new-app/test.png "Screenshot of Test panel with utterance highlighted")](media/luis-quickstart-new-app/test.png)


Click **Test** again to collapse the test pane. 

## Publish your app
Select **Publish** from the top navigation. 

[![](media/luis-quickstart-new-app/publish.png "Screenshot of app with publish button highlighted")](media/luis-quickstart-new-app/publish.png)

Select the Production slot and the **Publish** button.

The green notification bar at the top indicates the app successfully published.

[![](media/luis-quickstart-new-app/published.png "Screenshot of app with publish success")](media/luis-quickstart-new-app/published.png)

After you've successfully published, you can use the endpoint URL displayed in the **Publish app** page.

[![](media/luis-quickstart-new-app/endpoint.png "Screenshot of publish page with endpoint url highlighted")](media/luis-quickstart-new-app/endpoint.png)

## Use your app
You can test your published endpoint in a browser using the generated URL. Open this URL in your browser, set the URL parameter "&q" to your test query. For example, add `turn off the living room light` to the end of your URL, and then press Enter. The browser displays the JSON response of your HTTP endpoint.


[![](media/luis-quickstart-new-app/turn-off-living-room.png "Screenshot of browser with JSON result detects the intent TurnOff")](media/luis-quickstart-new-app/turn-off-living-room.png)

## Clean up resources
When no longer needed, delete the LUIS app. To do so, select the ellipsis (***...***) button to the right of the app name in the app list, select **Delete**. On the pop-up dialog **Delete app?**, select **Ok**.

## Next steps

You can call the endpoint from code:

> [!div class="nextstepaction"]
> [Call a LUIS endpoint using code](luis-get-started-cs-get-intent.md)
