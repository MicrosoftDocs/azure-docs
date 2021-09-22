---
title: Entity linking in Azure Language services
titleSuffix: Azure Cognitive Services
description: Learn about entity linking with Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 09/20/2021
ms.author: aahi
---

# What is entity linking?

Entity linking is on of the features offered by [Azure Cognitive Services for language](../overview.md), a collection of machine learning and AI algorithms in the cloud for your development projects. Entity linking provides the ability to identify and disambiguate the identity of an entity found in text. For example, in the sentence "*We went to Seattle last week.*", the word *Seattle* would be identified, with a link to more information on Wikipedia

you can use this service to help build intelligent applications using: the web-based Language Studio, REST APIs, and client libraries.  

This documentation contains the following types of articles:

* [Quickstarts](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [How-to guides](how-to/call-api.md) contain instructions for using the service in more specific ways.

## Typical workflow

To use the API, you submit data for analysis and handle outputs in your application. Analysis is performed as-is, with no additional customization to the model used on your data.

1. Create an Azure resource for Language Services. Afterwards, get the key and endpoint generated for you to authenticate your requests.

2. Formulate a request using either the REST API or the client library for: C#, Java, JavaScript or Python. You can also call the API asynchronously to combine requests to multiple [Language Services](../overview.md) features in a single call.

3. Send the request containing your data as raw unstructured text. Your key and endpoint will be used for authentication.

4. Stream or store the response locally. The result will be a collection of recognized entities in your text, URLs to an online knowledge base. 

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the following articles to learn about responsible AI use and deployment in your systems:

* [Transparency note for Language services](/legal/cognitive-services/text-analytics/transparency-note)
* [Transparency note for Sentiment Analysis and Opinion Mining](/legal/cognitive-services/text-analytics/transparency-note-sentiment-analysis)
* [Integration and responsible use](/legal/cognitive-services/text-analytics/guidance-integration-responsible-use)
* [Data, privacy and security](/legal/cognitive-services/text-analytics/data-privacy)
