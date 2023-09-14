---
title: how to call the Key Phrase Extraction API
titleSuffix: Azure AI services
description: How to extract key phrases by using the Key Phrase Extraction API.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 01/10/2023
ms.author: jboback
ms.custom: language-service-key-phrase, ignite-fall-2021
---

# How to use key phrase extraction 

The key phrase extraction feature can evaluate unstructured text, and for each document, return a list of key phrases.

This feature is useful if you need to quickly identify the main points in a collection of documents. For example, given input text "*The food was delicious and the staff was wonderful*", the service returns the main topics: "*food*" and "*wonderful staff*".

> [!TIP]
> If you want to start using this feature, you can follow the [quickstart article](../quickstart.md) to get started. You can also make example requests using [Language Studio](../../language-studio.md) without needing to write code.

## Development options

[!INCLUDE [development options](../includes/development-options.md)]

## Determine how to process the data (optional)

### Specify the key phrase extraction model

By default, key phrase extraction will use the latest available AI model on your text. You can also configure your API requests to use a specific [model version](../../concepts/model-lifecycle.md).

### Input languages

When you submit documents to be processed by key phrase extraction, you can specify which of [the supported languages](../language-support.md) they're written in. if you don't specify a language, key phrase extraction will default to English. The API may return offsets in the response to support different [multilingual and emoji encodings](../../concepts/multilingual-emoji-support.md). 

## Submitting data

Key phrase extraction works best when you give it bigger amounts of text to work on. This is opposite from sentiment analysis, which performs better on smaller amounts of text. To get the best results from both operations, consider restructuring the inputs accordingly.

To send an API request, You will need your Language resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Language resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. Using the key phrase extraction feature synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

[!INCLUDE [asynchronous-result-availability](../../includes/async-result-availability.md)]


## Getting key phrase extraction results

When you receive results from the API, the order of the returned key phrases is determined internally, by the model. You can stream the results to an application, or save the output to a file on the local system.

## Service and data limits

[!INCLUDE [service limits article](../../includes/service-limits-link.md)]

## Next steps

[Key Phrase Extraction overview](../overview.md)
