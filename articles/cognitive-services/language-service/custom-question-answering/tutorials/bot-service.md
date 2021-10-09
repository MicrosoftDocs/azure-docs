---
title: "Tutorial: Create an FAQ bot with question answering and Azure Bot Service"
description: In this tutorial, create a no code FAQ Bot with question answering and Azure Bot Service.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: tutorial
ms.date: 10/08/2021
---

# Tutorial: Create a FAQ bot

Create an FAQ Bot with question answering and Azure [Bot Service](https://azure.microsoft.com/services/bot-service/) with no code.

In this tutorial, you learn how to:

<!-- green checkmark -->
> [!div class="checklist"]
> * Link a question answering project/knowledge base to an Azure Bot Service
> * Deploy the Bot
> * Chat with the Bot in web chat
> * Enable the Bot in supported channels

## Create and publish a knowledge base

Follow the [create knowledge base article](../../../qnamaker/Quickstarts/create-publish-knowledge-base.md). Once the knowledge base has been successfully deployed, you will reach the below page.

## Create a bot

After publishing, you can create a bot from the **Deploy knowledge base** page:

* You can create several bots quickly, all pointing to the same knowledge base for different regions or pricing plans for the individual bots.

When you make changes to the knowledge base and republish, you don't need to take further action with the bot. It's already configured to work with the knowledge base, and works with all future changes to the knowledge base. Every time you publish a knowledge base, all the bots connected to it are automatically updated.

1. In the Language Studio portal, on the question answering **Deploy knowledge base** page, select **Create bot**. This button appears only after you've published the knowledge base.

    > [!div class="mx-imgBorder"]
    > ![Create bot in Azure](../media/bot-service/create-bot-in-azure.png)

1. A new browser tab opens for the Azure portal, with the Azure Bot Service's creation page. Configure the Azure bot service.

    |Setting |Value|
    |----------|---------|
    | Bot handle| Unique identifier for your bot. This value needs to be distinct from your App name |
    | Subscription | Select your subscription |
    | Resource group | Select an existing resource group or create a new one |
    | Location | Select your desired location |
    | Pricing tier | Choose pricing tier |
    |App name | App service name for your bot |
    |SDK language | C# or Node.js. Once the bot is created, you can download the code to your local development environment and continue the development process. |
    | QnA Auth key | This key is automatically populated deployed question answering project/knowledge base |
    | App service plan/Location | This value is automatically populated, do not change this value |

1. After the bot is created, open the **Bot service** resource.
1. Under **Settings**, select **Test in Web Chat**.

    > [!div class="mx-imgBorder"]
    > ![Test web chat](../media/bot-service/test-web-chat.png)

1. At the chat prompt of **Type your message**, enter:

    `How do I setup my surface book?`

    The chat bot responds with an answer from your knowledge base.

    > [!div class="mx-imgBorder"]
    > ![Bot test chat response](../media/bot-service/bot-chat.png)

## Integrate the bot with channels

Select **Channels** in the Bot service resource that you have created. You can activate the Bot in additional [supported channels](/azure/bot-service/bot-service-manage-channels).

   >[!div class="mx-imgBorder"]
   >![Screenshot of integration with teams](../media/bot-service/channels.png)

