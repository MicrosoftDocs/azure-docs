---
title: What is the Bing Spell Check API?
titleSuffix: Azure Cognitive Services
description: Learn about the Bing Spell Check API, which uses machine learning and statistical machine translation for contextual spell checking.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: overview
ms.date: 12/19/2019
ms.author: aahi
---

# What is the Bing Spell Check API?

> [!WARNING]
> Bing Search APIs are moving from Cognitive Services to Bing Search Services. Starting **October 30, 2020**, any new instances of Bing Search need to be provisioned following the process documented [here](/bing/search-apis/bing-web-search/create-bing-search-service-resource).
> Bing Search APIs provisioned using Cognitive Services will be supported for the next three years or until the end of your Enterprise Agreement, whichever happens first.
> For migration instructions, see [Bing Search Services](/bing/search-apis/bing-web-search/create-bing-search-service-resource).

The Bing Spell Check API enables you to perform contextual grammar and spell checking on text. While most spell-checkers rely on dictionary-based rule sets, the Bing spell-checker leverages machine learning and statistical machine translation to provide accurate and contextual corrections. 

## Features

| Feature | Description |
|---------|---------|
|Multiple spell check modes     | Multiple spell check modes enable you to get corrections focused on grammar and/or spelling. |
|Slang and informal language recognition     | Recognize common expressions and informal terms used in text.         |
|Differentiate between similar words     | Find the correct usage between words that sound similar but differ in meaning (for example, "see" and "sea")        |
|Brand, title, and popular usage support     | Recognize new brands, titles, and other popular expressions as they emerge |

## Workflow

The Bing Spell Check API is easy to call from any programming language that can make HTTP requests and parse JSON responses. The service is accessible using the REST API or the Bing Spell Check SDKs. 

1. Create a [Cognitive Services API account](../cognitive-services-apis-create-account.md) with access to the Bing Search APIs. If you don't have an Azure subscription, you can create a free account. 
2. Send a request to the Bing Web Search API.
3. Parse the JSON response

## Next steps

First, try the Bing Spell Check Search API [interactive demo](https://azure.microsoft.com/services/cognitive-services/spell-check/) to see how you can quickly check a variety of texts.

When you are ready to call the API, create a [Cognitive services API account](../../cognitive-services/cognitive-services-apis-create-account.md). If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/free/cognitive-services/) for free.

You can also visit the [Bing Search API hub page](../bing-web-search/overview.md) to explore the other available APIs.