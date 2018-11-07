---
title: "Tutorial: QnA bot with Azure Bot Service - QnA Maker"
titleSuffix: Azure Cognitive Services
description: This tutorial walks you through building a QnA bot with Azure Bot service v3 on the Azure portal.
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker`
ms.topic: article
ms.date: 10/25/2018
ms.author: tulasim
---

# Tutorial: Create a QnA Bot with Azure Bot Service v3

This tutorial walks you through building a QnA bot with Azure Bot service v3 in the [Azure portal](https://portal.azure.com) without writing any code. Connecting a published knowledge base (KB) to a bot is as simple as changing bot application settings. 

> [!Note] 
> This topic is for version 3 of the Bot SDK. You can find version 4 [here](https://docs.microsoft.com/azure/bot-service/bot-builder-howto-qna?view=azure-bot-service-4.0&tabs=cs). 

**In this tutorial, you learn how to:**

<!-- green checkmark -->
> [!div class="checklist"]
> * Create an Azure Bot Service with the QnA Maker template
> * Chat with the bot to verify the code is working 
> * Connect your published KB to the bot
> * Test the bot with a question

For this article, you can use the free QnA Maker [service](../how-to/set-up-qnamaker-service-azure.md).

## Prerequisites

You need to have a published knowledge base for this tutorial. If you do not have one, follow the steps in [Create a knowledge base](../How-To/create-knowledge-base.md) to create a QnA Maker service with questions and answers.

## Create a QnA Bot

1. In the Azure portal, select **Create a resource**.

    ![bot service creation](../media/qnamaker-tutorials-create-bot/bot-service-creation.png)

2. In the search box, search for **Web App Bot**.

    ![bot service selection](../media/qnamaker-tutorials-create-bot/bot-service-selection.png)

3. In **Bot Service**, provide the required information:

    - Set **App name** to your bot’s name. The name is used as the subdomain when your bot is deployed to the cloud (for example, mynotesbot.azurewebsites.net).
    - Select the subscription, resource group, App service plan, and location.

4. To use the v3 templates, select SDK version of **SDK v3** and SDK language of **C#** or **Node.js**.

    ![bot sdk settings](../media/qnamaker-tutorials-create-bot/bot-v3.png)

5. Select the **Question and Answer** template for the Bot template field, then save the template settings by selecting **Select**.

    ![bot service selection](../media/qnamaker-tutorials-create-bot/bot-v3-template.png)

6. Review your settings, then select **Create**. This creates and deploys the bot service with to Azure.

    ![bot service selection](../media/qnamaker-tutorials-create-bot/bot-blade-settings-v3.png)

7. Confirm that the bot service has been deployed.

    - Select **Notifications** (the bell icon that is located along the top edge of the Azure portal). The notification will change from **Deployment started** to **Deployment succeeded**.
    - After the notification changes to **Deployment succeeded**, select **Go to resource** on that notification.

## Chat with the Bot

Selecting **Go to resource** takes you to the bot's resource.

Select **Test in Web Chat** to open the Web Chat pane. Type "hi" in Web Chat.

![QnA bot web chat](../media/qnamaker-tutorials-create-bot/qna-bot-web-chat.PNG)

The bot responds with "Please set QnAKnowledgebaseId and QnASubscriptionKey in App Settings. This response confirms that your QnA Bot has received the message, but there is no QnA Maker knowledge base associated with it yet. 

## Connect your QnA Maker knowledge base to the bot

1. Open **Application Settings** and edit the **QnAKnowledgebaseId**, **QnAAuthKey**, and the **QnAEndpointHostName** fields to contain the values of your QnA Maker knowledge base.

    ![app settings](../media/qnamaker-tutorials-create-bot/application-settings.PNG)

1. Get your knowledge base ID, host url, and the endpoint key from the settings tab of your knowledge base in the QnA Maker portal.

    - Sign in to [QnA Maker](https://qnamaker.ai)
    - Go to your knowledge base
    - Select the **Settings** tab
    - **Publish** your knowledge base, if not already done so

    ![QnA Maker values](../media/qnamaker-tutorials-create-bot/qnamaker-settings-kbid-key.PNG)

> [!NOTE]
> If you want to connect the preview version of the knowledge base with the QnA bot, set the value of **Ocp-Apim-Subscription-Key** to **QnAAuthKey**. Leave the **QnAEndpointHostName** empty.

## Test the bot

In the Azure portal, select **Test in Web Chat** to test the bot. 

![QnA Maker bot](../media/qnamaker-tutorials-create-bot/qna-bot-web-chat-response.PNG)

Your QnA Bot answers from your knowledge base.

## Clean up resources

When you are done with this tutorial's bot, remove the bot in the Azure portal. The bot services include:

* The App Service plan
* The Search service
* The Cognitive service
* The App service
* Optionally, it may also include the application insights service and storage for the application insights data

## Next steps

> [!div class="nextstepaction"]
> [Concept: knowledge base](../concepts/knowledge-base.md)

## See also

- [Manage your knowledge base](https://qnamaker.ai)
- [Enable your bot in different channels](https://docs.microsoft.com/azure/bot-service/bot-service-manage-channels)
