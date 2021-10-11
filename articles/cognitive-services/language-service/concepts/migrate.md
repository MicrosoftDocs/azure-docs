---
title: "Migrate to Azure Cognitive Service for Language from: LUIS, QnA Maker, and Text Analytics"
titleSuffix: Azure Cognitive Services
description: Use this article to learn if you need to migrate your applications from LUIS, QnA Maker, and Text Analytics.
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 10/11/2021
ms.author: aahi
---

# What happened to LUIS, QnA Maker, and Text Analytics?

On November 2nd 2021, Azure Cognitive Service for Language was released into public preview. This language service unifies the Text Analytics, QnA Maker, and LUIS service offerings, and provides several new features as well. 

## Do I need to migrate to the language service if I am using Text Analytics?

Text Analytics has been incorporated into the language service, and its features are still available. If you were using Text Analytics, your applications should continue to work without breaking changes. Your Azure Text Analytics resource will let you use all of the other features of the service.  

Consider using one of the available quickstart articles to see the latest information on service endpoints, and API calls. 

## How do I migrate to the language service if I am using LUIS?

If you're using Language Understanding (LUIS), you can [import your LUIS JSON file](../custom-language-understanding/concepts/backwards-compatibility.md) to the new Conversational language understanding feature. 

## How do I migrate to the language service if I am using QnA Maker?

If you're using QnA Maker, see the [migration guide](../custom-question-answering/how-to/migrate-qnamaker.md) for information on migrating knowledge bases from QnA Maker to question answering.

## See also

* [Azure Cognitive Service for Language overview](../overview.md)
* [Custom language understanding overview](../custom-language-understanding/overview.md)
* [Question answering overview](../custom-question-answering/overview.md)