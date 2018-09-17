---
title: QnA bot with Azure Bot Service - QnA Maker
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: nstulasi
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/12/2018
ms.author: nstulasi
---

# Create a QnA Bot with Azure Bot Service
This tutorial walks you through building a QnA bot with Azure Bot service on the Azure portal.

## Prerequisite
Before you build, follow the steps in [Create a knowledge base](../How-To/create-knowledge-base.md) to create a QnA Maker service with questions and answers.

The bot responds to questions from the knowledge base you created, via the QnAMakerDialog.

## Create a QnA Bot
1. In the [Azure portal](https://portal.azure.com), select **Create** new resource in the menu blade, and then select **See all**.

    ![bot service creation](../media/qnamaker-tutorials-create-bot/bot-service-creation.png)

2. In the search box, search for **Web App Bot**.

    ![bot service selection](../media/qnamaker-tutorials-create-bot/bot-service-selection.png)

3. In the **Bot Service blade**, provide the required information, and select **Create**. This creates and deploys the bot service with QnAMakerDialog to Azure.

    - Set **App name** to your bot’s name. The name is used as the subdomain when your bot is deployed to the cloud (for example, mynotesbot.azurewebsites.net).
    - Select the subscription, resource group, App service plan, and location.
    - Select the **Question and Answer** (Node.js or C#) template for the Bot template field.
    - Select the confirmation checkbox for the legal notice. The terms of the legal notice are below the checkbox.

        ![bot service selection](../media/qnamaker-tutorials-create-bot/bot-service-qna-template.PNG)

4. Confirm that the bot service has been deployed.

    - Select **Notifications** (the bell icon that is located along the top edge of the Azure portal). The notification will change from **Deployment started** to **Deployment succeeded**.
    - After the notification changes to **Deployment succeeded**, select **Go to resource** on that notification.

## Chat with the Bot
Selecting **Go to resource** takes you to the bot's resource blade.

Once the bot is registered, click **Test in Web Chat** to open the Web Chat pane. Type "hello" in Web Chat.

![QnA bot web chat](../media/qnamaker-tutorials-create-bot/qna-bot-web-chat.PNG)

The bot responds with "Please set QnAKnowledgebaseId and QnASubscriptionKey in App Settings. Learn how to get them at https://aka.ms/qnaabssetup". This response confirms that your QnA Bot has received the message, but there is no QnA Maker knowledge base associated with it yet. Do that in the next step.

## Connect your QnA Maker knowledge base to the bot

1. Open **Application Settings** and edit the **QnAKnowledgebaseId**, **QnAAuthKey**, and the **QnAEndpointHostName** fields to contain the values of your QnA Maker knowledge base.

    ![app settings](../media/qnamaker-tutorials-create-bot/application-settings.PNG)

2. Get your knowledge base ID, host url, and the endpoint key from the settings tab of your knowledge base in https://qnamaker.ai.
    - Log in to [QnA Maker](https://qnamaker.ai)
    - Go to your knowledge base
    - Click on the **Settings** tab
    - **Publish** your knowledge base, if not already done so

    ![QnA Maker values](../media/qnamaker-tutorials-create-bot/qnamaker-settings-kbid-key.PNG)

> [!NOTE]
> If you want to connect the preview version of the knowledge base with the QnA bot, set the value of **Ocp-Apim-Subscription-Key** to **QnAAuthKey**. Leave the **QnAEndpointHostName** empty.

## Test the bot
In the Azure portal, click on **Test in Web Chat** to test the bot. 

![QnA Maker bot](../media/qnamaker-tutorials-create-bot/qna-bot-web-chat-response.PNG)

Your QnA Bot now answers from your knowledge base.

## Next steps

> [!div class="nextstepaction"]
> [Integrate QnA Maker and LUIS](./integrate-qnamaker-luis.md)

## See also

- [Manage your knowledge base](https://qnamaker.ai)
- [Enable your bot in different channels](https://docs.microsoft.com/azure/bot-service/bot-service-manage-channels)
