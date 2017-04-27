---
title: Build a bot integrated with LUIS using the Bot Framework | Microsoft Docs
description: Build a bot that's integrated with a LUIS application . 
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 04/26/2017
ms.author: v-demak
---

# Build a bot integrated with LUIS using the Bot Framework

This tutorial walks you through creating a bot with the Bot Builder SDK for Node.js and integrating it with a Language Understanding Intelligent Service (LUIS) app. 

> [!NOTE]
>  This article is temporary content and only meant to be a placeholder.

## Before you begin
To use Microsoft Cognitive Service APIs, you first need to create a [Cognitive Services API account](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## 1. Download sample code for the bot

Download the sample code for the bot from GitHub:
•	[LUIS demo bot (Node.js)](https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/intelligence-LUIS) 

## 2. Import the LUIS model to create the LUIS app
You can create and manage your applications on **My Apps** page. You can always access this page by clicking **My Apps** on the top navigation bar of the [LUIS web page](https://luis.ai).

1. On the **My Apps** page, click **Import App**.
2. In the **Import new app** dialog box, click **Choose file** and navigate to LuisBot.json in the folder where you downloaded the bot in step 1. Name your application "Hotel Finder".

<!--    ![A new app form](./Images/NewApp-Form.JPG) -->
3. Choose your application culture (for this Hotel Finder app, we’ll choose English), and then click **Create**. 

    >[!NOTE]
    >The culture cannot be changed once the application is created. 

LUIS creates the Hotel Finder app and opens its main page which looks like the following screen. Use the navigation links in the left panel to move through your app pages to define data and work on your app. 


> [!NOTE]
>  TODO: Additional steps are being authored.

## Next steps

* Try to improve your app's performance by continuing to add and label utterances.
* Try adding [Features](Add-Features.md) to enrich your model and improve performance in language understanding. Features help your app identify alternative interchangeable words/phrases, as well as commonly-used patterns specific to your domain.
