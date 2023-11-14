---
title: include file
description: include file
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.date: 06/04/2020
ms.subservice: azure-ai-luis
ms.topic: include
ms.custom: include file
ms.author: aahi
ms.reviewer: roy-har
---
Create the pizza app.

1. Select [pizza-app-for-luis-v6.json](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/luis/apps/pizza-app-for-luis-v6.json) to bring up the GitHub page for the `pizza-app-for-luis.json` file.
1. Right-click or long tap the **Raw** button and select **Save link as** to save the `pizza-app-for-luis.json` to your computer.
1. Sign into the [LUIS portal](https://www.luis.ai).
1. Select [My Apps](https://www.luis.ai/applications).
1. On the **My Apps** page, select **+ New app for conversation**.
1. Select **Import as JSON**.
1. In the **Import new app** dialog, select the **Choose File** button.
1. Select the `pizza-app-for-luis.json` file you downloaded, then select **Open**.
1. In the **Import new app** dialog **Name** field, enter a name for your Pizza app, then select the **Done** button.

The app will be imported.

If you see a dialog **How to create an effective LUIS app**, close the dialog.

## Train and publish the Pizza app

You should see the **Intents** page with a list of the intents in the Pizza app.

[!INCLUDE [How to train](howto-train.md)]

[!INCLUDE [How to publish](howto-publish.md)]

## Add an authoring resource to the Pizza app

1. Select **MANAGE**.
1. Select **Azure Resources**.
1. Select **Authoring Resource**.
1. Select **Change authoring resource**.

If you have an authoring resource, enter the **Tenant Name**, **Subscription Name**, and **LUIS resource name** of your authoring resource.

If you do not have an authoring resource:

1. Select **Create new resource**.
1. Enter a **Tenant Name**, **Resource Name**, **Subscription Name**, and **Azure Resource Group Name**.

Your Pizza app is now ready to use.

## Record the access values for your Pizza app

To use your new Pizza app, you will need the app ID, authoring key, and authoring endpoint of your Pizza app. To get predictions, you will need your separate prediction endpoint and prediction key.

To find these values:

1. From the **Intents** page, select **MANAGE**.
1. From the **Application Settings** page, record the **App ID**.
1. Select **Azure Resources**.
1. Select **Authoring Resource**.
1. From the **Authoring Resource** and **Prediction Resources** tabs, record the **Primary Key**. This value is your authoring key.
1. Record the **Endpoint URL**. This value is your authoring endpoint.
