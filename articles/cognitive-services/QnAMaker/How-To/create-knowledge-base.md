---
title: Create a knowledge base - QnA Maker
titleSuffix: Azure Cognitive Services
description: Adding chit-chat to your bot makes it more conversational and engaging. QnA Maker allows you to easily add a pre-populated set of the top chit-chat, into your KB. This can be a starting point for your bot's chit-chat and save you the time and cost of writing them from scratch.   
services: cognitive-services
author: nstulasi
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/12/2018
ms.author: saneppal
---

# Create a knowledge base

QnA Maker makes it very simple to onboard your existing data sources to create a knowledge base. You can create a new QnA Maker knowledge base from FAQ pages, products manuals, structured documents or add them editorially.

## Steps

1. To get started, sign into to the [QnA Maker portal](https://qnamaker.ai) with your azure credentials and click on **Create new service**.

    ![Create KB ](../media/qnamaker-how-to-create-kb/create-new-service.png)

2. If you have not already created a QnA Maker service, select **Create a QnA service**. Otherwise, choose a QnA Maker service from the drop-downs in Step 2. Select the QnA Maker service that will host the Knowledge Base.

    ![Setup QnA service](../media/qnamaker-how-to-create-kb/setup-qna-resource.png)

3. Enter the following information in order to create the knowledge base.

    ![Set data sources](../media/qnamaker-how-to-create-kb/set-data-sources.png)

    - Give your service a **name.** Duplicate names are supported and special characters are supported as well.
    - Paste in URLs which will be extracted from. See more information on the types of sources supported [here](../Concepts/data-sources-supported.md).
    - Alternately, upload files from which data is extracted. See the [pricing information](https://aka.ms/qnamaker-pricing
) to see how many documents you can add.
    - If you want to manually add QnAs, you can skip linking files.

4. Select **Create**.

    ![Create KB](../media/qnamaker-how-to-create-kb/create-kb.png)

5. It takes a few minutes for data to be extracted.

    ![Extraction](../media/qnamaker-how-to-create-kb/hang-tight-extraction.png)

6. If your Knowledge Base has been successfully created, you will be redirected to the **Knowledge base** page.

## Next steps

> [!div class="nextstepaction"]
> [Import a knowledge base](../Tutorials/migrate-knowledge-base.md)
