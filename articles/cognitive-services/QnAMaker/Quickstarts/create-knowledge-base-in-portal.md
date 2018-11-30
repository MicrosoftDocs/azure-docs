---
title: "Quickstart: Create knowledge base in QnA Maker portal"
titlesuffix: Azure Cognitive Services 
description: This portal-based quickstart walks you through creating a sample QnA Maker knowledge base.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 11/6/2018
ms.author: diberry
#Customer intent: As an knowledge manager new to the QnA Maker service, I want to create a knowledge base in the portal. 
---

# Quickstart: Create a knowledge base in QnA Maker using portal

This portal-based quickstart walks you through creating a sample QnA Maker knowledge base.

## Prerequisites

* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md).

## Create knowledge base

1. Sign-in to the [QnA Maker portal](https://qnamaker.ai) with your Azure credentials and select **Create a knowledge base**.

1. If you have not already created a QnA Maker service, select **Create a QnA service**. 

1. Select your Azure tenant, Azure subscription name, and Azure resource name associated with the QnA Maker service. 
1. 
1. Select the Azure QnA Maker service that will host the Knowledge Base.

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
