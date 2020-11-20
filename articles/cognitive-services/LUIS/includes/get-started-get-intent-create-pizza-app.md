---
title: include file
description: include file
services: cognitive-services
author: roy-har
manager: diberry
ms.service: cognitive-services
ms.date: 06/03/2020
ms.subservice: language-understanding
ms.topic: include
ms.custom: include file
ms.author: roy-har
---
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

If you see the dialog **How to create an effective LUIS app**, close the dialog.

## Train and publish the Pizza app

You should see the **Intents** page with a list of the intents in the Pizza app.

[!INCLUDE [How to train](howto-train.md)]

[!INCLUDE [How to publish](howto-publish.md)]

Your Pizza app is now ready to use.

## Record the app ID, prediction key, and prediction endpoint of your Pizza app

To use your new Pizza app, you will need the app ID, prediction key, and prediction endpoint of your Pizza app.

To find these values:

1. From the **Intents** page, select **MANAGE**.
1. From the **Application Settings** page, record the **App ID**.
1. Select **Azure Resources**.
1. From the **Azure Resources** page, record the **Primary Key**. This value is your prediction key.
1. Record the **Endpoint URL**. This value is your prediction endpoint.
