---
title: Create your first Language Understanding (LUIS) app in 10 minutes in Azure | Microsoft Docs 
description: Get started quickly by creating and managing a LUIS application on the Language Understanding (LUIS) webpage. 
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/29/2018
ms.author: v-geberr;
---

# Create your first LUIS app

This article shows you how to create a LUIS app that uses the `HomeAutomation` prebuilt domain. The prebuilt domain provides intents and entities for a home automation system for turning lights and appliances on and off. When you're finished, you'll have a LUIS endpoint running in the cloud.

## Prerequisites
> [!div class="checklist"]
> * To use Microsoft Cognitive Service APIs, you first need to create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal.
> * If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
> * For this article, you also need a [LUIS.][LUIS] account in order to author your LUIS application.

## Create a new app
You can create and manage your applications on **My Apps** page of [LUIS][LUIS]. 
1. Click **Create new app**.

2. In the dialog box, name your application "Home Automation".

    ![A new app form](./media/luis-quickstart-new-app/create-new-app-dialog.png)

3. Choose your application culture (for this Home Automation app, choose English), and then click **Done**. 

    >[!NOTE]
    >The culture cannot be changed once the application is created. 

LUIS creates the Home Automation app. 

## Add prebuilt domain

Click on **Prebuilt domains** in the left-side navigation pane. Then search for "Home". Click on **Add domain**.

![Home Automation domain called out in prebuilt domain menu](./media/luis-quickstart-new-app/home-automation.png)

When the domain is successfully added, the prebuilt domain box displays a **Remove domain** button.

![Home Automation domain called out in prebuilt domain menu](./media/luis-quickstart-new-app/remove-domain.png)

## Intents and entities

Click on **Intents** in the left-side navigation pane to review the HomeAutomation domain intents. 

![Home Automation domain prompt](./media/luis-quickstart-new-app/home-automation-intents.png)

Each intent has sample utterances.

> [!NOTE]
> **None** is an intent provided by all LUIS apps. You use it to handle utterances that don't correspond to functionality your app provides. 

Click on the **HomeAutomation.TurnOff** intent. You can see that the intent contains a list of utterances that are labeled with entities.

![Home Automation domain prompt](./media/luis-quickstart-new-app/home-automation-turnon.png)

## Train your app

Click on **Train** in the top navigation.

![Home Automation test](./media/luis-quickstart-new-app/trained.png)

## Test your app
Once you've trained your app, you can test it. Click **Test** in the top navigation. Type a test utterance like "Turn off the lights" into the Interactive Testing pane, and press Enter. 

```
Turn off the lights
```

Check that the top scoring intent corresponds to the intent you expected for each test utterance.

In this example, "Turn off the lights" is correctly identified as the top scoring intent of "HomeAutomation.TurnOff."

![Home Automation test](./media/luis-quickstart-new-app/test.png)

Click **Test** again to collapse the test pane. 

## Publish your app
Select **Publish** from the top navigation. 

![Home Automation test](./media/luis-quickstart-new-app/publish.png)

Click **Publish to production slot**.

The green notification bar at the top indicates the app successfully published.

![Publish success](./media/luis-quickstart-new-app/published.png)


After you've successfully published, you can use the endpoint URL displayed in the **Publish app** page.

![Endpoint url](./media/luis-quickstart-new-app/endpoint.png)

## Use your app
You can test your published endpoint in a browser using the generated URL. Open this URL in your browser, set the URL parameter "&q" to your test query. For example, add `turn off the living room light` to the end of your URL, and then press Enter. The browser displays the JSON response of your HTTP endpoint.  

![JSON result detects the intent TurnOff](./media/luis-get-started-node-get-intent/turn-off-living-room.png)

## Next steps

You can call the endpoint from code:

> [!div class="nextstepaction"]
> [Call a LUIS endpoint using code](luis-get-started-cs-get-intent.md)


[LUIS]: luis-reference-regions.md
