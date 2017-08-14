---
title: 'Key phrase execution in Text Analytics API (Microsoft Cognitive Services on Azure) | Microsoft Docs'
description: Guidance, best practices, and tips for extracting keyword text terms and phrases using Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: cgronlun

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 08/11/2017
ms.author: heidist

---
# Key phrase extraction in Text Analytics API

The [key phrase extraction API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) evaluates unstructured text, and for each JSON document, returns a list of keywords and a score indicating the strength of the analysis. 

## Common use cases

This analyzer finds and discards non-essential words, and keeps single terms or phrases that appear to be the subject or object of a sentence. This capability is useful if you need to quickly identify the main points in a collection of documents. For example, given input text "The food was delicious and there were wonderful staff", the service returns the main talking points: "food" and 'wonderful staff".

Currently, the following languages are supported for production workloads: English, German, Spanish, and Japanese. Other languages are in preview. For more information, see [Supported languages](overview.md#supported-languages).

## Extraction techniques

Non-essential words are stripped out on the first pass through the text. Once the text is paired down, the model calculates the probability of certain word combinations, elevating the rank of those combinations more likely to be found in common use. For this reason, you might find that adjectives or adverbs that appear by themselves are not flagged for extraction, even they seem interesting or important at face value.

## Guidance for constructing inputs

Although you can submit the same collection of documents for multiple operations, key phrase extraction tends to produce higher quality results when you give it bigger chunks of text to work on. This is opposite from sentiment analysis, which performs better on smaller blocks of text. To get the best results of both operations, consider restructuring the inputs accordingly.

## Next steps

Use the built-in API testing console in the [REST API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) to call the API interactively. To use the console:

+ Provide an access key to your service. You can get it from the [Azure portal](https://portal.azure.com). 
+ Paste the JSON documents, in the format described for the API, into the Request Body section of the page.  
+ Click **Send** to analyze content and get the results. 
+ Review the response inline. Responses include a status code, latency (in milliseconds), and payload (in JSON). 

In addition to the console, we also recommend the [Quickstart](quick-start.md) for more practice and details about each operation.

## See also

 [Sentiment analysis concepts](text-analytics-concept-sentiment-analysis.md) 
 [Language detection concepts](text-analytics-concept-language-detection.md) 