---
title: Create a knowledge base - QnA Maker
titleSuffix: Azure Cognitive Services
description: Adding chit-chat to your bot makes it more conversational and engaging. QnA Maker allows you to easily add a pre-populated set of the top chit-chat, into your KB. This can be a starting point for your bot's chit-chat and save you the time and cost of writing them from scratch.   
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/12/2018
ms.author: tulasim
---

# Create a knowledge base

QnA Maker makes it simple to add your existing data sources when creating a knowledge base. You can create a new QnA Maker knowledge base from the following document types:

<!-- added for scanability -->
* FAQ pages
* Products manuals
* Structured documents

## Steps

1. Sign into to the [QnA Maker portal](https://qnamaker.ai) with your Azure credentials and select **Create a knowledge base**.

2. If you have not already created a QnA Maker service, select **Create a QnA service**. 

3. Select your Azure tenant, Azure subscription name, and Azure resource name associated with the QnA Maker service from the lists in **Step 2** in the QnA Maker portal. Select the Azure QnA Maker service that will host the Knowledge Base.

    ![Setup QnA service](../media/qnamaker-how-to-create-kb/setup-qna-resource.png)

4. Enter the name of your knowledge base and the data sources for the new knowledge base.

    ![Set data sources](../media/qnamaker-how-to-create-kb/set-data-sources.png)

    - Give your service a **name.** Duplicate names and special characters are supported.
    - Add URLs for data you want extracted. See more information on the types of sources supported [here](../Concepts/data-sources-supported.md).
    - Upload files for data you want extracted. See the [pricing information](https://aka.ms/qnamaker-pricing) to see how many documents you can add.
    - If you want to manually add QnAs, you can skip **Step 4** shown in the preceding image.

5. Add **Chit-chat** to your KB. Choose to add chit-chat support for your bot, by choosing from one of the 3 pre-defined personalities. 

    <!-- TBD: add back in when chit chat how-to is merged
    ![Add chit-chat to KB ](../media/qnamaker-how-to-chitchat/create-kb-chit-chat.png)
    -->

6. Select **Create your KB**.

    ![Create KB](../media/qnamaker-how-to-create-kb/create-kb.png)

7. It takes a few minutes for data to be extracted.

    ![Extraction](../media/qnamaker-how-to-create-kb/hang-tight-extraction.png)

8. When your Knowledge Base is successfully created, you are redirected to the **Knowledge base** page.

## Next steps

> [!div class="nextstepaction"]
> [Add chit-chat personal](./chit-chat-knowledge-base.md)
