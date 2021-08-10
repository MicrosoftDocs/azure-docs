---
title: What is the Language Detection API 
titleSuffix: Azure Cognitive Services
description: Learn about the language detection API, which lets you easily determine the language of written text using prebuilt AI models.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: sample
ms.date: 07/27/2021
ms.author: aahi
---

# What is language detection?

Language detection can detect the language an input text is written in and report a single language code for every document submitted on the request in a wide range of languages, variants, dialects, and some regional/cultural languages. The language code is paired with a confidence score.

This documentation contains the following types of articles:

* [How-to guides](how-to/call-api.md) contain instructions for using the service in more specific or customized ways.

## Deploy on premises using Docker containers

Use Docker containers to deploy the API on-premises. Docker containers enable you to bring the service closer to your data for compliance, security or other operational reasons. 

## Typical workflow

To use the API, you submit data for analysis and handle outputs in your application. Analysis is performed as-is, with no additional customization to the model used on your data.

1. Create an Azure resource for Language Services. Afterwards, get the key and endpoint generated for you to authenticate your requests.

2. Formulate a request using either the REST API or the client library for: C#, Java, JavaScript or Python. You can also call the API asynchronously to combine requests to multiple [Language Services](../overview.md) features in a single call.

3. Send the request containing your data as raw unstructured text. Your key and endpoint will be used for authentication.

4. Stream or store the response locally. The result will be the recognized language of the text you send.  

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the following articles to learn about responsible AI use and deployment in your systems:

* [Transparency note for Language services](/legal/cognitive-services/text-analytics/transparency-note)