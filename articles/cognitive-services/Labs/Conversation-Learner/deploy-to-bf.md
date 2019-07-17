---
title: How to deploy a Conversation Learner bot - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to deploy a Conversation Learner bot.
services: cognitive-services
author: nitinme
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: nitinme
---

# How to deploy a Conversation Learner bot

This document explains how to deploy a Conversation Learner bot -- either locally, or into Azure.

## Prerequisite: determine the model ID 

To run a bot outside of the Conversation Learner UI, you must set the Conversation Learner model ID that the bot will use -- i.e., the ID of the machine learning model in the Conversation Learner cloud.  (By contrast, when running the bot through the Conversation Learner UI, the UI chooses which model ID.).  

Here's how to obtain the model ID:

1. Start your bot and the Conversation Learner UI.  See the Quickstart guide for full instructions; to summarize:

    In one command window:

    ```
    [open a command window]
    cd my-bot
    npm start
    ```

    In anther command window

    ```bash
    [open second command prompt window]
    cd cl-bot-01
    npm run ui
    ```

2. Open browser to `http://localhost:5050` 

3. Click on the Conversation Learner model you want to get the ID for

4. Click on "Settings" in the nav bar on the left.

5. The "Model ID" GUID is displayed near the top of the page.

## Option 1: Deploying a Conversation Learner bot to run locally

This deploys a bot to your local machine, and shows how you can access it using the Bot Framework emulator.

### Configure your bot for access outside the Conversation Learner UI

When running a bot locally, add the Application ID to the bot's `.env` file:

    ```
    CONVERSATION_LEARNER_MODEL_ID=<YOUR_MODEL_ID>
    ```

Then, start your bot:

    ```
    [open a command window]
    cd my-bot
    npm start
    ```

The bot is now running locally.  You can access it with the Bot Framework emulator.

### Download and install the emulator

    ```
    git clone https://github.com/Microsoft/BotFramework-Emulator
    npm install
    npm run build
    npm start
    ```

### Connect the emulator to your bot

1. In the upper left of the emulator, in the box "Enter your endpoint URL", enter `http://127.0.0.1:3978/api/messages`.  Leave the other fields blank, and click "Connect".

2. You are now conversing with your bot.

## Option 2: Deploy to Azure

Publish your Conversation Learner bot similar to the same way you would publish any other bot. At a high level, you upload your code to a hosted website, set the appropriate configuration values, and then register the bot with various channels. Detailed instructions are in this video showing how to publish your bot using Azure Bot Service.

Once the bot is deployed and running you can connect different channels to it such as Facebook, Teams, Skype etc. using an Azure Bot Channel Registration. For documentation on that process see: https://docs.microsoft.com/bot-framework/bot-service-quickstart-registration

Below are step-by-step instructions for deploying a Conversation Learner Bot to Azure.  These instructions assume that your bot source is available from a cloud-based source such as Azure DevOps Services, GitHub, BitBucket, or OneDrive, and will configure your bot for continuous deployment.

1. Log into the Azure portal at https://portal.azure.com

2. Create a new "Web App Bot" resource 

    1. Give the bot a name
    2. Click on "Bot Template", choose "Node.js", choose "Basic", then click on the "Select" button
    3. Click on "create" to create the Web App Bot.
    4. Wait for the Web App Bot resource to be created.

3. In the Azure portal, edit the Web App Bot resource you just created.

   1. Click on "Application Settings" nav item on the left
   1. Scroll down to the "App Settings" section
   2. Add these settings:

       Environment variable | value
       --- | --- 
       CONVERSATION_LEARNER_SERVICE_URI | "https://westus.api.cognitive.microsoft.com/conversationlearner/v1.0/"
       CONVERSATION_LEARNER_MODEL_ID      | Application Id GUID, obtained from the Conversation Learner UI under the "settings" for the model>
       LUIS_AUTHORING_KEY               | LUIS authoring key for this model
       LUIS_SUBSCRIPTION_KEY            | Not required, but recommended for published bots to avoid using your Authoring quota.
    
   4. Click on "Save" near the top of the page
   5. Open "Build" nav item on the left
   6. Click on "Configure continuous deployment" 
   7. Click on the "Setup" icon under deployments
   8. Click on "Required Settings"
   9. Select the source where your bot code is available, and configure the source.
