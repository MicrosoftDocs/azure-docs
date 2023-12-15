---
title: "Quickstart: Create, train, and publish knowledge base - QnA Maker"
description: You can create a QnA Maker knowledge base (KB) from your own content, such as FAQs or product manuals. This article includes an example of creating a QnA Maker knowledge base from a simple FAQ webpage, to answer questions QnA Maker.
ms.service: azure-ai-language
manager: nitinme
ms.author: jboback
author: jboback
ms.subservice: azure-ai-qna-maker
ms.topic: quickstart
ms.date: 11/02/2021
ms.custom: ignite-fall-2021, mode-other
---

# Quickstart: Create, train, and publish your QnA Maker knowledge base

[!INCLUDE [Custom question answering](../includes/new-version.md)]

You can create a QnA Maker knowledge base (KB) from your own content, such as FAQs or product manuals. This article includes an example of creating a QnA Maker knowledge base from a simple FAQ webpage, to answer questions.

## Prerequisites

> [!div class="checklist"]
> * If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.
> * A [QnA Maker resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) created in the Azure portal. Remember your Microsoft Entra ID, Subscription, QnA Maker resource name you selected when you created the resource.

## Create your first QnA Maker knowledge base

1. Sign in to the [QnAMaker.ai](https://QnAMaker.ai) portal with your Azure credentials.

2. In the QnA Maker portal, select **Create a knowledge base**.

3. On the **Create** page, skip **Step 1** if you already have your QnA Maker resource.

If you haven't created the service yet, select **Stable** and **Create a QnA service**. You are directed to the [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) to set up a QnA Maker service in your subscription. Remember your Microsoft Entra ID, Subscription, QnA resource name you selected when you created the resource.

When you are done creating the resource in the Azure portal, return to the QnA Maker portal, refresh the browser page, and continue to **Step 2**.

4. In **Step 2**, select your Active directory, subscription, service (resource), and the language for all knowledge bases created in the service.

    :::image type="content" source="../media/qnamaker-create-publish-knowledge-base/qnaservice-selection.png" alt-text="Screenshot of selecting a QnA Maker service knowledge base":::

5. In **Step 3**, name your knowledge base **My Sample QnA KB**.

6. In **Step 4**, configure the settings with the following table:

    |Setting|Value|
    |--|--|
    |**Enable multi-turn extraction from URLs, .pdf or .docx files.**|Checked|
    |**Multi-turn default text**| Select an option|
    |**+ Add URL**|`https://www.microsoft.com/download/faq.aspx`|
    |**Chit-chat**|Select **Professional**|

7. In **Step 5**, Select **Create your KB**.

    The extraction process takes a few moments to read the document and identify questions and answers.

    After QnA Maker successfully creates the knowledge base, the **Knowledge base** page opens. You can edit the contents of the knowledge base on this page.

## Add a new question and answer set

1. In the QnA Maker portal, on the **Edit** page, select **+ Add QnA pair** from the context toolbar.
1. Add the following question:

    `How many Azure services are used by a knowledge base?`

1. Add the answer formatted with _markdown_:

    ` * Azure AI QnA Maker service\n* Azure Cognitive Search\n* Azure web app\n* Azure app plan`

    :::image type="content" source="../media/qnamaker-create-publish-knowledge-base/add-question-and-answer.png" alt-text="Add the question as text and the answer formatted with markdown.":::

    The markdown symbol, `*`, is used for bullet points. The `\n` is used for a new line.

    The **Edit** page shows the markdown. When you use the **Test** panel later, you will see the markdown displayed properly.

## Save and train

In the upper right, select **Save and train** to save your edits and train QnA Maker. Edits aren't kept unless they're saved.

## Test the knowledge base

1. In the QnA Maker portal, in the upper right, select **Test** to test that the changes you made took effect.
2. Enter an example user query in the textbox.

    `I want to know the difference between 32 bit and 64 bit Windows`

    :::image type="content" source="../media/qnamaker-create-publish-knowledge-base/query-dialogue.png" alt-text="Enter an example user query in the textbox.":::

3. Select **Inspect** to examine the response in more detail. The test window is used to test your changes to the knowledge base before publishing your knowledge base.

4. Select **Test** again to close the **Test** panel.

## Publish the knowledge base

When you publish a knowledge base, the contents of your knowledge base move from the `test` index to a `prod` index in Azure search.

![Screenshot of moving the contents of your knowledge base](../media/qnamaker-how-to-publish-kb/publish-prod-test.png)

1. In the QnA Maker portal, select **Publish**. Then to confirm, select **Publish** on the page.

    The QnA Maker service is now successfully published. You can use the endpoint in your application or bot code.

    ![Screenshot of successful publishing](../media/qnamaker-create-publish-knowledge-base/publish-knowledge-base-to-endpoint.png)

## Create a bot

After publishing, you can create a bot from the **Publish** page:

* You can create several bots quickly, all pointing to the same knowledge base for different regions or pricing plans for the individual bots.
* If you want only one bot for the knowledge base, use the **View all your bots on the Azure portal** link to view a list of your current bots.

When you make changes to the knowledge base and republish, you don't need to take further action with the bot. It's already configured to work with the knowledge base, and works with all future changes to the knowledge base. Every time you publish a knowledge base, all the bots connected to it are automatically updated.

1. In the QnA Maker portal, on the **Publish** page, select **Create bot**. This button appears only after you've published the knowledge base.

    ![Screenshot of creating a bot](../media/qnamaker-create-publish-knowledge-base/create-bot-from-published-knowledge-base-page.png)

1. A new browser tab opens for the Azure portal, with the Azure AI Bot Service's creation page. Configure the Azure AI Bot Service. The bot and QnA Maker can share the web app service plan, but can't share the web app. This means the **app name** for the bot must be different from the app name for the QnA Maker service.

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

## What did you accomplish?

You created a new knowledge base, added a public URL to the knowledge base, added your own QnA pair, trained, tested, and published the knowledge base.

After publishing the knowledge base, you created a bot, and tested the bot.

This was all accomplished in a few minutes without having to write any code or clean the content.

## Clean up resources

If you are not continuing to the next quickstart, delete the QnA Maker and Bot framework resources in the Azure portal.

## Next steps

> [!div class="nextstepaction"]
> [Add questions with metadata](add-question-metadata-portal.md)

For more information:

* [Markdown format in answers](../reference-markdown-format.md)
* QnA Maker [data sources](../concepts/data-sources-and-content.md).
