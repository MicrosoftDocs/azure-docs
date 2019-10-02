---
title: "Quickstart: Create, train, and publish knowledge base - QnA Maker"
titleSuffix: Azure Cognitive Services 
description: You can create a QnA Maker knowledge base (KB) from your own content, such as FAQs or product manuals. The QnA Maker knowledge base in this example is created from a simple FAQ webpage to answer questions on BitLocker key recovery.
author: diberry
manager: nitinme
services: cognitive-services
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 10/01/2019
ms.author: diberry
---

# Quickstart: Create, train, and publish your QnA Maker knowledge base

You can create a QnA Maker knowledge base (KB) from your own content, such as FAQs or product manuals. This article includes an example of creating a QnA Maker knowledge base from a simple FAQ webpage, to answer questions on BitLocker key recovery.

Include a chit-chat personality to make your knowledge more engaging with your users.

[!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Prerequisite

> [!div class="checklist"]
> * If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a new QnA Maker knowledge base

1. Sign in to the [QnAMaker.ai](https://QnAMaker.ai) portal with your Azure credentials.

1. On the QnA Maker portal, select **Create a knowledge base**.

1. On the **Create** page, select **Create a QnA service**. You are directed to the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) to set up a QnA Maker service in your subscription. 

1. In the Qna Maker portal, select your QnA Maker service from the drop-down lists. If you created a new QnA Maker service, be sure to refresh the page.

   ![Screenshot of selecting a QnA Maker service knowledge base](../media/qnamaker-quickstart-kb/qnaservice-selection.png)

1. Name your knowledge base **My Sample QnA KB**.

1. Select **Enable multi-turn extraction from URLs, .pdf or .docx files.**. This allows QnA Maker to extract multi-turn question and answer sets from a data source.

1. Add a sample word document as a URL: 

    `https://github.com/Azure-Samples/cognitive-services-sample-data-files/raw/master/qna-maker/data-source-formats/multi-turn.docx`

1. Select `+ Add URL`.

1. Add **_professional_ Chit-chat** to your KB. 

1. Select **Create your KB**.

    The extraction process takes a few minutes to read the document and identify questions and answers.

    After QnA Maker successfully creates the knowledge base, the **Knowledge base** page opens. You can edit the contents of the knowledge base on this page.


## Add a follow-up prompt

The knowledge base has two different data sources that are not connected. When a customer begins the bot conversation with `hello`, the bot should respond and give the user some options, known as follow-up prompts.

1. In the QnA Maker portal, on the **Edit** section, search for `hello`.  The primary question is **Aloha**. For the **Aloha** question and answer set, select **Add follow-up prompt**.
1. For **Display text**, enter `Surface Pro`.
1. In **Link to QnA**, search for `Surface Pro`. This returns existing question and answer pairs from your data sources. Select the top question then select **Save**.

    The knowledge base knows that a beginning prompt should follow up with options for question and answer sets about the Surface Pro. 

## Save and train

In the upper right, select **Save and train** to save your edits and train the QnA Maker model. Edits aren't kept unless they're saved.

## Test the knowledge base

1. In the QnA Maker portal, in the upper right, select **Test** to test that the changes you made took effect. 
1. Enter an example user query in the box, and select Enter. Make sure **Enable multi-turn** is selected. 

    `hello`  

    You should see the answer text, **Surface Pro**, as a response.

1. Select **Surface Pro** to see more relative prompts.

1. Select **Inspect** to examine the response in more detail. The test window is used to test your changes to the knowledge base before publishing your knowledge base.

1. Select **Test** again to close the **Test** panel.

## Publish the knowledge base

When you publish a knowledge base, the contents of your knowledge base moves from the `test` index to a `prod` index in Azure search.

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

1. A new browser tab opens for the Azure portal, with the Azure Bot Service's creation page. Configure the Azure bot service. 
    
    * Don't change the following settings in the Azure portal when creating the bot. They are pre-populated for your existing knowledge base: 
        * QnA Auth Key
        * App service plan and location
    * The bot and QnA Maker can share the web app service plan, but can't share the web app. This means the **app name** for the bot must be different from the app name for the QnA Maker service. 

1. After the bot is created, open the **Bot service** resource. 
1. Under **Bot Management**, select **Test in Web Chat**.
1. At the chat prompt of **Type your message**, enter:

    `hello`

    The chat bot responds with an answer from your knowledge base. 

## Clean up resources

Clean up the QnA Maker and Bot framework resources in the Azure portal. 

## Next steps

For more information on Bot resource configuration settings, see [Create a QnA Bot with Azure Bot Service v4](../tutorials/create-qna-bot.md).

Review the list of [data sources](../Concepts/data-sources-supported.md) supported [here]. 

For cost savings measures, you can [share](../how-to/set-up-qnamaker-service-azure.md#share-existing-services-with-qna-maker) some but not all Azure resources created for QnA Maker.

> [!div class="nextstepaction"]
> [Add questions and answer with QnA Maker portal](add-question-metadata-portal.md)
