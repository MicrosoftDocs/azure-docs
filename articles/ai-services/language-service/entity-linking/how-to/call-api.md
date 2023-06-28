---
title: How to call the entity linking API
titleSuffix: Azure AI services
description: Learn how to identify and link entities found in text with the entity linking API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-entity-linking, ignite-fall-2021
---

# How to use entity linking

The entity linking feature can be used to identify and disambiguate the identity of an entity found in text (for example, determining whether an occurrence of the word "*Mars*" refers to the planet, or to the Roman god of war). It will return the entities in the text with links to [Wikipedia](https://www.wikipedia.org/) as a knowledge base.


## Development options

[!INCLUDE [development-options](../includes/development-options.md)]

## Determine how to process the data (optional)

### Specify the entity linking model

By default, entity linking will use the latest available AI model on your text. You can also configure your API requests to use a specific [model version](../../concepts/model-lifecycle.md).

### Input languages

When you submit documents to be processed by entity linking, you can specify which of [the supported languages](../language-support.md) they're written in. if you don't specify a language, entity linking will default to English. Due to [multilingual and emoji support](../../concepts/multilingual-emoji-support.md), the response may contain text offsets. 

## Submitting data

Entity linking produces a higher-quality result when you give it smaller amounts of text to work on. This is opposite from some features, like key phrase extraction which performs better on larger blocks of text. To get the best results from both operations, consider restructuring the inputs accordingly.

To send an API request, you will need a Language resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Language resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. Using entity linking synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

[!INCLUDE [asynchronous-result-availability](../../includes/async-result-availability.md)]

### Getting entity linking results  

You can stream the results to an application, or save the output to a file on the local system.

## Service and data limits

[!INCLUDE [service limits article](../../includes/service-limits-link.md)]

## See also

* [Entity linking overview](../overview.md)
