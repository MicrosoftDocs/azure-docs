---
title: "Tutorial: Create an FAQ bot with Azure Bot Service"
description: In this tutorial, create a no code FAQ Bot with QnA Maker and Azure Bot Service.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: tutorial
ms.date: 08/31/2020
---

# Tutorial: Create an FAQ bot with Azure Bot Service
Create an FAQ Bot with QnA Maker and Azure [Bot Service](https://azure.microsoft.com/services/bot-service/) with no code.

In this tutorial, you learn how to:

<!-- green checkmark -->
> [!div class="checklist"]
> * Link a QnA Maker knowledge base to an Azure Bot Service
> * Deploy the Bot
> * Chat with the Bot in web chat
> * Light up the Bot in the supported channels

## Create and publish a knowledge base

Follow the [quickstart](../Quickstarts/create-publish-knowledge-base.md) to create a knowledge base. Once the knowledge base has been successfully published, you will reach the below page.

# [QnA Maker GA (stable release)](#tab/v1)

![Screenshot of successful publishing](../media/qnamaker-create-publish-knowledge-base/publish-knowledge-base-to-endpoint.png)

# [QnA Maker managed (preview release)](#tab/v2)

![Screenshot of successful publishing managed](../media/qnamaker-create-publish-knowledge-base/publish-knowledge-base-to-endpoint-managed.png)

---

## Create a bot

After publishing, you can create a bot from the **Publish** page:

* You can create several bots quickly, all pointing to the same knowledge base for different regions or pricing plans for the individual bots.
* If you want only one bot for the knowledge base, use the **View all your bots on the Azure portal** link to view a list of your current bots.

When you make changes to the knowledge base and republish, you don't need to take further action with the bot. It's already configured to work with the knowledge base, and works with all future changes to the knowledge base. Every time you publish a knowledge base, all the bots connected to it are automatically updated.

1. In the QnA Maker portal, on the **Publish** page, select **Create bot**. This button appears only after you've published the knowledge base.

     # [QnA Maker GA (stable release)](#tab/v1)

    ![Screenshot of creating a bot](../media/qnamaker-create-publish-knowledge-base/create-bot-from-published-knowledge-base-page.png)

    # [QnA Maker managed (preview release)](#tab/v2)

    ![Screenshot of creating a bot managed preview](../media/qnamaker-create-publish-knowledge-base/create-bot-from-published-knowledge-base-page-managed.png)

    ---
    

1. A new browser tab opens for the Azure portal, with the Azure Bot Service's creation page. Configure the Azure bot service. The bot and QnA Maker can share the web app service plan, but can't share the web app. This means the **app name** for the bot must be different from the app name for the QnA Maker service.

    * **Do**
        * Change bot handle - if it is not unique.
        * Select SDK Language. Once the bot is created, you can download the code to your local development environment and continue the development process.
    * **Don't**
        * Change the following settings in the Azure portal when creating the bot. They are pre-populated for your existing knowledge base:
           * QnA Auth Key
           * App service plan and location


1. After the bot is created, open the **Bot service** resource.
1. Under **Bot Management**, select **Test in Web Chat**.
1. At the chat prompt of **Type your message**, enter:

    `Azure services?`

    The chat bot responds with an answer from your knowledge base.

    :::image type="content" source="../media/qnamaker-create-publish-knowledge-base/test-web-chat.png" alt-text="Enter a user query into the test web chat.":::
1. Light up the Bot in additional [supported channels](https://docs.microsoft.com/azure/bot-service/bot-service-manage-channels?view=azure-bot-service-4.0&preserve-view=true).
