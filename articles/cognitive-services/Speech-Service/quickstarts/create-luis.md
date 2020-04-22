---
title: "Quickstart: Create a LUIS key"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to create a LUIS application and get a key.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: tutorial
ms.date: 02/10/2020
ms.author: trbye

# Customer intent: As a C# programmer, I want to learn how to derive speaker intent from their utterances so that I can create a conversational UI for my application.
---

# Quickstart: Getting a LUIS endpoint key

## Prerequisites

Be sure you have the following items before you begin this tutorial:

* A LUIS account. You can get one for free through the [LUIS portal](https://www.luis.ai/home).

## LUIS and speech

LUIS integrates with the Speech service to recognize intents from speech. You don't need a Speech service subscription, just LUIS.

LUIS uses three kinds of keys:

|Key type|Purpose|
|--------|-------|
|Authoring|Lets you create and modify LUIS apps programmatically|
|Starter|Lets you test your LUIS application using text only|
|Endpoint |Authorizes access to a particular LUIS app|

For this tutorial, you need the endpoint key type. The tutorial uses the example Home Automation LUIS app, which you can create by following the [Use prebuilt Home automation app](https://docs.microsoft.com/azure/cognitive-services/luis/luis-get-started-create-app) quickstart. If you've created a LUIS app of your own, you can use it instead.

When you create a LUIS app, LUIS automatically generates a starter key so you can test the app using text queries. This key doesn't enable the Speech service integration and won't work with this tutorial. Create a LUIS resource in the Azure dashboard and assign it to the LUIS app. You can use the free subscription tier for this tutorial.

After you create the LUIS resource in the Azure dashboard, log into the [LUIS portal](https://www.luis.ai/home), choose your application on the **My Apps** page, then switch to the app's **Manage** page. Finally, select **Keys and Endpoints** in the sidebar.

![LUIS portal keys and endpoint settings](~/articles/cognitive-services/Speech-Service/media/sdk/luis-keys-endpoints-page.png)

On the **Keys and Endpoint settings** page:

1. Scroll down to the **Resources and Keys** section and select **Assign resource**.
1. In the **Assign a key to your app** dialog box, make the following changes:

   * Under **Tenant**, choose **Microsoft**.
   * Under **Subscription Name**, choose the Azure subscription that contains the LUIS resource you want to use.
   * Under **Key**, choose the LUIS resource that you want to use with the app.

   In a moment, the new subscription appears in the table at the bottom of the page.

1. Select the icon next to a key to copy it to the clipboard. (You may use either key.)

![LUIS app subscription keys](~/articles/cognitive-services/Speech-Service/media/sdk/luis-keys-assigned.png)


## Next steps

> [!div class="nextstepaction"]
> [Recognize Intents](~/articles/cognitive-services/Speech-Service/quickstarts/intent-recognition.md)
