---
title: Create your first Language Understanding Intelligent Services (LUIS) app in 10 minutes in Azure | Microsoft Docs 
description: Get started quickly by creating and managing a LUIS application on the Language Understanding Intelligent Services (LUIS) webpage. 
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 04/26/2017
ms.author: v-demak
---

# Create your first LUIS app

This Quickstart helps you create your first Language Understanding Intelligent Service (LUIS) app in just a few minutes. When you're finished, you'll have a LUIS endpoint up and running in the cloud.

This article shows you how to create a LUIS app that uses the Home.Automation prebuilt domain. The prebuilt domain provides intents and entities for a home automation system for turning lights and appliances on and off.

## Before you begin
To use Microsoft Cognitive Service APIs, you first need to create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

For this article, you also need a [LUIS.ai][luis.ai] account in order to author your LUIS application.

## Create a new app
You can create and manage your applications on **My Apps** page. You can always access this page by clicking **My Apps** on the top navigation bar of LUIS web page. 

1. On **My Apps** page, click **New App**.
2. In the dialog box, name your application "Home Automation".

    ![A new app form](./media/luis-quickstart-new-app/new-app-dialog.PNG)
3. Choose your application culture (for this Home Automation app, we’ll choose English), and then click **Create**. 

    >[!NOTE]
    >The culture cannot be changed once the application is created. 

LUIS creates the Home Automation app and opens to the Dashboard. The application dashboard contains summary information about app usage. 

You can explore your application using the links in the left panel.

![Home Automation app created and Opened](./media/luis-quickstart-new-app/app-created-opened.PNG)

## Add the Home Automation prebuilt domain

Click on **Prebuilt domains** in the left-side navigation pane. Then click on **HomeAutomation**.
![Home Automation domain called out in prebuilt domain menu](./media/luis-quickstart-new-app/prebuilt-domain-find.PNG)

Click **Yes** when prompted to add the "HomeAutomation" domain to the app.

![Home Automation domain prompt](./media/luis-quickstart-new-app/add-prebuilt-domain-dialog.PNG)

## Take a look at the intents and entities

Click on **Intents** in the left-side navigation pane, and you can see that the HomeAutomation domain provides **HomeAutomation.TurnOff**, **HomeAutomation.TurnOn**, and **None** intents in your application. Each intent has sample utterances.

> [!NOTE]
> **None** is an intent provided by all LUIS apps. You use it to handle utterances that don't correspond to functionality your app provides. 

![Home Automation domain prompt](./media/luis-quickstart-new-app/intents.PNG)

Click on the **HomeAutomation.TurnOff** intent. You can see that the intent contains a list of utterances which are labeled with entities.

![Home Automation domain prompt](./media/luis-quickstart-new-app/utterances.PNG)

Click on the **Labels view** and select **tokens**. This shows the text tokens that make up each labeled entity, instead of the name of the entity type.

If you compare the same utterance in the tokens view and the entities view, you can see that some of the words of each utterance have already been labeled. 

The first utterance is "turn off staircase." The word "off" has been labeled as the type of HomeAutomation.Operation. The word "staircase" has been labeled as the type of "HomeAutomation.Device."

![Home Automation domain prompt](./media/luis-quickstart-new-app/utterances-tokens.PNG)

Click **Entities in use**. This shows the entities this app identifies in the utterances.

![Home Automation domain prompt](./media/luis-quickstart-new-app/entities-in-use.PNG)

## Train your app

Click on **Train & Test** in the left-side navigation, then click **Train application**.

![Home Automation test](./media/luis-quickstart-new-app/test-callout.PNG)

## Test your app
Once you've trained your app, you can test it. Type a test utterance like "Turn off the lights" into the Interactive Testing pane, and press Enter. 

```
Turn off the lights
```

The results display the score associated with each intent. Check that the top scoring intent corresponds to the intent you expected for each test utterance.

In this example, "Turn off the lights" is correctly identified as the top scoring intent of "HomeAutomation.TurnOff."

![Home Automation test](./media/luis-quickstart-new-app/test-prebuilt-domain-home.PNG)

## Publish your app
Select **Publish App** from the left-side menu and click the **Publish** button. 

![Home Automation test](./media/luis-quickstart-new-app/publish-before.PNG)

After you've successfully published, you can use the Endpoint URL that the **Publish App** page displays.

![Home Automation test](./media/luis-quickstart-new-app/publish.PNG)

## Use your app
You can test your published endpoint in a browser using the generated URL. Copy the URL, then replace the `{YOUR-KEY-HERE}` with one of the keys listed in the **Key String** column for the resource you want to use. To open this URL in your browser, set the URL parameter "&q" to your test query. For example, append `&q=turn off the living room light` to your URL, and then press Enter. The browser displays the JSON response of your HTTP endpoint.  

![JSON result detects the intent TurnOff](./media/luis-get-started-node-get-intent/turn-off-living-room.png)

## Next steps

You can call the endpoint from code:

> [!div class="nextstepaction"]
> [Call a LUIS endpoint using code](luis-get-started-node-get-intent.md)


[luis.ai]:https://www.luis.ai