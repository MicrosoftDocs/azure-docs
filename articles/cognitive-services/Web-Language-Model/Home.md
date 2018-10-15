---
title: Overview of the Web Language Model API
titleSuffix: Azure Cognitive Services
description: Web Language Model API in Microsoft Cognitive Services provides state-of-the-art tools for natural language processing.
services: cognitive-services
author: piyushbehre
manager: cgronlun
ms.service: cognitive-services
ms.component: web-language-model
ms.topic: overview
ms.date: 08/12/2016
ms.author: pibehre
ROBOTS: NOINDEX
---
# What is the Web Language Model API? (Preview)

> [!IMPORTANT]
> The Web Language Model preview was decommissioned on August 9, 2018. We recommend using [Azure Machine Learning text analytics modules](https://docs.microsoft.com/en-us/azure/machine-learning/studio-module-reference/text-analytics) for text processing and analysis.

The Microsoft Web Language Model API is a REST-based cloud service providing state-of-the-art tools for natural language processing. Using this API, your application can leverage the power of big data through language models trained on web-scale corpora collected by Bing in the en-US market.

These smoothed backoff N-gram language models, supporting up to fifth-order Markov chains, are trained on the following corpora:

- Web page body text
- Web page title text
- Web page anchor text
- Web search query text

The Web Language Model API supports four lookup operations:

1. Joint (log10) probability of a sequence of words.
2. Conditional (log10) probability of one word given a sequence of preceding words.
3. List of words (completions) most likely to follow a given sequence of words.
4. Word breaking of strings that contain no spaces.

## Getting Started

1. Subscribe to the service.
2. Download the [SDK](https://www.github.com/microsoft/cognitive-weblm-windows).
3. Run the SDK sample code.
4. Refer to the [API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/55de9ca4e597ed1fd4e2f104) for full details of the endpoints, including code snippets in a variety of languages.

## Underlying Technology

The following paper provides details on the development of these language models, and should be cited in research publications that use this service:

- [An Overview of Microsoft Web N-gram Corpus and Applications](http://research.microsoft.com/apps/pubs/default.aspx?id=130762), NAACL-HLT 2010

Click [here](https://academic.microsoft.com/#/search?iq=And%28Ty%3D'0'%2CRId%3D2145833060%29&q=papers%20citing%20an%20overview%20of%20microsoft%20web%20n%20gram%20corpus%20and%20applications&filters=&from=0&sort=0) for a current list of papers citing this work.
