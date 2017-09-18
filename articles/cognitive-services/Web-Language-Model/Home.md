---
title: Overview of the Web Language Model API | Microsoft Docs
description: Web Language Model API in Microsoft Cognitive Services provides state-of-the-art tools for natural language processing.
services: cognitive-services
author: piyushbehre
manager: yanbo

ms.service: cognitive-services
ms.technology: web-language-model
ms.topic: article
ms.date: 08/12/2016
ms.author: pibehre
---

# Web Language Model API Overview

Welcome to the Microsoft Web Language Model API, a REST-based cloud service providing state-of-the-art tools for natural language processing. Using this API, your application can leverage the power of big data through language models trained on web-scale corpora collected by Bing in the EN-US market. 

These smoothed backoff N-gram language models, supporting Markov order up to 5, are trained on the following corpora: 

- Web page body text 
- Web page title text 
- Web page anchor text 
- Web search query text 

The Web LM REST API supports four lookup operations:

1. Joint (log10) probability of a sequence of words.  
2. Conditional (log10) probability of one word given a sequence of preceding words. 
3. List of words (completions) most likely to follow a given sequence of words. 
4. Word breaking of strings that contain no spaces. 

## Getting Started

1. Subscribe to the service.
2. Download the [SDK](https://www.github.com/microsoft/cognitive-weblm-windows).
3. Run the SDK sample code. 
4. Consult the [API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/55de9ca4e597ed1fd4e2f104) for further details, including code snippets in a variety of languages.


## Underlying Technology

The following paper provides details on the development of these language models, and should be cited in research publications that utilize this service:

* [An Overview of Microsoft Web N-gram Corpus and Applications](http://research.microsoft.com/apps/pubs/default.aspx?id=130762), NAACL-HLT 2010

Click [here](https://academic.microsoft.com/#/search?iq=And%28Ty%3D'0'%2CRId%3D2145833060%29&q=papers%20citing%20an%20overview%20of%20microsoft%20web%20n%20gram%20corpus%20and%20applications&filters=&from=0&sort=0) for a current list of papers citing this work.
