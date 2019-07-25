---
title: Create knowledge base
titleSuffix: QnA Maker API - Azure Cognitive Services
description: Use the QnA Maker API service portal, to add create a knowledge base with chit-chat. This makes your app engaging. Add a pre-populated set of the top chit-chat into your KB as a starting point for your bot's chit-chat and save you the time and cost of writing them from scratch.     
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 05/10/2019
ms.author: diberry
ms.custom: seodec18
---

# Quickstart: Create a knowledge base using the QnA Maker API service portal

The QnA Maker API service portal makes it simple to add your existing data sources when creating a knowledge base. You can create a new QnA Maker knowledge base from the following document types:

<!-- added for scanability -->
* FAQ pages
* Products manuals
* Structured documents

Include a chit-chat personality to make your knowledge more engaging with your users.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Create a new knowledge base

1. Sign into to the [QnA Maker portal](https://qnamaker.ai) with your Azure credentials and select **Create a knowledge base**.

1. If you have not already created a QnA Maker service, select **Create a QnA service**. 

1. Select your Azure tenant, Azure subscription name, and Azure resource name associated with the QnA Maker service from the lists in **Step 2** in the QnA Maker portal. Select the Azure QnA Maker service that will host the Knowledge Base.

    ![Setup QnA service](../media/qnamaker-how-to-create-kb/setup-qna-resource.png)

1. Enter the name of your knowledge base and the data sources for the new knowledge base.

    ![Set data sources](../media/qnamaker-how-to-create-kb/set-data-sources.png)

    - Give your service a **name.** Duplicate names and special characters are supported.
    - Add URLs for data you want extracted. See more information on the types of sources supported [here](../Concepts/data-sources-supported.md).
    - Upload files for data you want extracted. See the [pricing information](https://aka.ms/qnamaker-pricing) to see how many documents you can add.
    - If you want to manually add QnAs, you can skip **Step 4** shown in the preceding image.

1. Add **Chit-chat** to your KB. Choose to add chit-chat support for your bot, by choosing from one of the  personalities. 

    ![Add chit-chat to KB](../media/qnamaker-how-to-create-kb/create-kb-chit-chat.png)

1. Select **Create your KB**.

    ![Create KB](../media/qnamaker-how-to-create-kb/create-kb.png)

1. It takes a few minutes for data to be extracted.

    ![Extraction](../media/qnamaker-how-to-create-kb/hang-tight-extraction.png)

1. When your Knowledge Base is successfully created, you are redirected to the **Knowledge base** page.

## Clean up resources

When you are done with the knowledge base, remove it in the QnA Maker portal.

## Next steps

For cost savings measures, you can [share](upgrade-qnamaker-service.md?#share-existing-services-with-qna-maker) some but not all Azure resources created for QnA Maker.

> [!div class="nextstepaction"]
> [Add chit-chat personal](./chit-chat-knowledge-base.md)
