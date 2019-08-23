---
title: "Quickstart: Add questions and answer in QnA Maker portal"
titleSuffix: Azure Cognitive Services 
description:  
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 08/123/2019
ms.author: diberry
---

# Quickstart: Add questions and answer with QnA Maker portal

Once a knowledge base is created, add question and answer sets with metadata so your users' can find the right answer to their question.

The right answer is a single answer but there can be many ways a customer could ask the question that leads to that single answer.

For example, the questions in the following table are about service limits, but each has to do with a different service. 

|Questions|Answer|Metadata|
|--|--|--|
|`How large a knowledge base can I create?`<br><br>`What is the max size of a knowledge base?`<br><br>`How many GB of data can a knowledge base hold?` |`The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](https://docs.microsoft.com/azure/cognitive-services/qnamaker/tutorials/choosing-capacity-qnamaker-deployment) for more details.`|`service=qna-maker, link-in-answer=true`|
|`How many knowledge bases can I have for my QnA Maker service?`<br><br>`I selected a Azure Search tier that holds 15 knowledge bases, but I can only create 14 - what is going on?`<br><br>`What is the connection between the number of knowledge bases in my QnA Maker service and the Azure Search service?` |`Each knowledge base uses 1 index, and all the knowledge bases share a test index. You can have N-1 knowledge bases where N is the number of indexes your Azure Search tier supports.`|`service=search, link-in-answer=false`|

Once metadata is added to a question-and-answer set, the client application can:

* Request answers that only match certain metadata.
* Receive all answers but post-process the answers depending on the metadata for each answer.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Prerequisites

* QnA Maker service 
* Knowledge base

Both were created in the [first quickstart](../how-to/create-knowledge-base.md).

## Sign in to the QnA Maker portal

1. Sign in to the [QnA Maker portal](https://www.qnamaker.ai).
1. Select your existing knowledge base. If you don't have a knowledge base, return to the [previous quickstart](../how-to/create-knowledge-base.md) and finish the steps to create your knowledge base.