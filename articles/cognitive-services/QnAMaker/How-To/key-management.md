---
title: Resource and key management - QnA Maker
titleSuffix: Azure Cognitive Services
description: Your QnA Maker service deals with two kinds of keys, subscription keys and endpoint keys.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 03/04/2019
ms.author: diberry
ms.custom: seodec18
---

# How to manage keys in QnA Maker

Your QnA Maker service deals with two kinds of keys, **subscription keys** and **endpoint keys**.

![key management](../media/qnamaker-how-to-key-management/key-management.png)

1. **Subscription Keys**: These keys are used to access the [QnA Maker management service APIs](https://go.microsoft.com/fwlink/?linkid=2092179). These APIs let you perform edit your knowledge base.  

2. **Endpoint Keys**: These keys are used to access the knowledge base endpoint to get a response for a user question. You would typically use this endpoint in your chat bot, or client application code that consumes the QnA Maker service.
 
## Subscription Keys
You can view and reset your subscription keys from the Azure portal where you created the QnA Maker resource. 
1. Go to the QnA Maker resource in the Azure portal.

    ![QnA Maker resource list](../media/qnamaker-how-to-key-management/qnamaker-resource-list.png)

2. Go to **Keys**.

    ![subscription key](../media/qnamaker-how-to-key-management/subscription-key.PNG)

## Endpoint Keys

Endpoint keys can be managed from the [QnA Maker portal](https://qnamaker.ai).

1. Log in to the [QnA Maker portal](https://qnamaker.ai), go to your profile, and then click **Service settings**.

    ![endpoint key](../media/qnamaker-how-to-key-management/Endpoint-keys.png)

2. View or reset your keys.

    ![endpoint key manager](../media/qnamaker-how-to-key-management/Endpoint-keys1.png)

    >[!NOTE]
    >Refresh your keys if you feel they have been compromised. This may require corresponding changes to your client application or bot code.

## Next steps

> [!div class="nextstepaction"]
> [Create a knowledge base in a different language](./language-knowledge-base.md)
