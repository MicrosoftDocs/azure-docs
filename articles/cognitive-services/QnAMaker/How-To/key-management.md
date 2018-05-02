---
title: Key management - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: How to manage your QnAMaker keys
services: cognitive-services
author: nstulasi
manager: sangitap
ms.service: cognitive-services
ms.component: QnAMaker
ms.topic: article
ms.date: 04/21/2018
ms.author: saneppal
---

# Key Management

Your QnAMaker service deals with two kinds of keys, **subscription keys** and **endpoint keys**.

![key management](../media/qnamaker-how-to-key-management/key-management.png)
1. **Subscription Keys**: These keys are used to access the [QnAMaker management service APIs](). These APIs let you perform various CRUD operations on your knowledge base.  
2. **Endpoint Keys**: These keys are used to access the knowledge base endpoint to get a response for a user question. You would typically use this endpoint in your chat bot/App code that consumes the QnAMaker service.
 
## Subscription Keys
You can view and reset your subscription keys from the Azure portal where you created the QnAMaker resource. 
1. Go to the QnAMaker resource in the Azure portal

    ![QnAMaker resource list](../media/qnamaker-how-to-key-management/qnamaker-resource-list.png)

2. Go to **Keys**.

    ![subscription key](../media/qnamaker-how-to-key-management/subscription-key.PNG)

## Endpoint Keys

Endpoint keys can be managed from the [QnAMaker portal](https://qnamaker.ai).

1. Log in to the [QnAMaker portal](https://qnamaker.ai), and go to **Manage keys**.

    ![endpoint key](../media/qnamaker-how-to-key-management/Endpoint-keys.png)

2. View or reset your keys

    ![endpoint key manage](../media/qnamaker-how-to-key-management/Endpoint-keys1.png)

    >[!NOTE]
    >Refresh your keys if you feel they have been compromised. This may require corresponding changes to your App/Bot code.

## Next steps

> [!div class="nextstepaction"]
> [Create a knowledge base in a different language](./language-knowledge-base.md)
