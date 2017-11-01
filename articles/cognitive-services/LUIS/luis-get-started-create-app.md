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

# Create your first LUIS app in ten minutes

This Quickstart helps you create your first Language Understanding Intelligent Service (LUIS) app in just a few minutes. When you're finished, you'll have a LUIS endpoint up and running in the cloud.

This article shows you how to create a LUIS app that uses the Home.Automation domain, which provides intents and entities for a home automation system for turning lights and appliances on and off.

## Before you begin
To use Microsoft Cognitive Service APIs, you first need to create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a new app
You can create and manage your applications on **My Apps** page. You can always access this page by clicking **My Apps** on the top navigation bar of LUIS web page. 

1. On **My Apps** page, click **New App**.
2. In the dialog box, name your application "Home Automation".

    ![A new app form](./media/luis-quickstart-new-app/new-app-dialog.PNG)
3. Choose your application culture (for this Home Automation app, we’ll choose English), and then click **Create**. 

    >[!NOTE]
    >The culture cannot be changed once the application is created. 

LUIS creates the Home Automation app and opens its main page which looks like the following screen. Use the navigation links in the left panel to move through your app pages to define data and work on your app. 

![Home Automation app created and Opened](./media/luis-quickstart-new-app/app-created-opened.PNG)

## Add the Home Automation prebuilt domain

Click on **Prebuilt domains** in the left-side navigation pane. Then click on **HomeAutomation**.
![Home Automation domain called out in prebuilt domain menu](./media/luis-quickstart-new-app/prebuilt-domain-find.PNG).

Click **Yes** when prompted to add the "HomeAutomation" domain to the app.

![Home Automation domain prompt](./media/luis-quickstart-new-app/add-prebuilt-domain-dialog.PNG).

## Take a look at the intents and entities

You can see the intents that have been added for you from the prebuilt domain. Click on **Intents** in the left-side navigation pane, and you can see that the HomeAutomation domain provides **HomeAutomation.TurnOff**, **HomeAutomation.TurnOn**, and **None**.

> [!NOTE]
> **None** is an intent provided by all LUIS apps. You use it to handle utterances that don't correspond to functionality your app provides. 

![Home Automation domain prompt](./media/luis-quickstart-new-app/intents.PNG).

Click on the **HomeAutomation.TurnOff** intent. You can see that the intent contains utterances which are labeled with entities.

![Home Automation domain prompt](./media/luis-quickstart-new-app/utterances.PNG).

Click on the **Labels view** and select **tokens**. This shows the text tokens that make up each labeled entity, instead of the name of the entity type.

![Home Automation domain prompt](./media/luis-quickstart-new-app/utterances-tokens.PNG).

Click **Entities in use**. This shows the entities that this app identifies in the utterances.

![Home Automation domain prompt](./media/luis-quickstart-new-app/entities-in-use.PNG).

## Train your app

Click on **Train & Test** in the left-side navigation, then click **Train application**.

![Home Automation test](./media/luis-quickstart-new-app/test-callout.PNG).

## Test your app
Once you've trained your app, you can test it. Type a test utterance like "Turn on the lights" into the Interactive Testing pane, and press Enter. The results display the score associated with each intent. Check that the top scoring intent corresponds to the intent of each test utterance.

![Home Automation test](./media/luis-quickstart-new-app/test-prebuilt-domain-home.PNG).

## Publish your app
Select **Publish App** from the left-side menu and click the **Publish** button. 

![Home Automation test](./media/luis-quickstart-new-app/publish-before.PNG).

After you've successfully published, the **Publish App** page displays an Endpoint URL.

![Home Automation test](./media/luis-quickstart-new-app/publish.PNG).

## Use your app
Click on the endpoint URL in the Publish App page to open it in a web browser. Append a query like "turn off the living room lights" to the end of the URL and submit the request. The JSON containing results should show in the browser window.

![JSON result detects the intent TurnOff](./media/luis-get-started-node-get-intent/turn-off-living-room.png)

## Next steps

You can call the endpoint from code:
* [Call a LUIS endpoint using C#](luis-get-started-cs-get-intent.md)
* [Call a LUIS endpoint using Node.js](luis-get-started-node-get-intent.md)
* [Call a LUIS endpoint using client-side JavaScript](luis-get-started-js-get-intent.md)
* [Call a LUIS endpoint using Java](luis-get-started-java-get-intent.md)
* [Call a LUIS endpoint using Python](luis-get-started-python-get-intent.md)


