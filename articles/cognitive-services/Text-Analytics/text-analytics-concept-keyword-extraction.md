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

## Extraction techniques

Internally, we employ techniques from Microsoft Office's sophisticated Natural Language Processing toolkit. 

N-grams denote all occurrences of *n* consecutive words in the input text. The precise value of *n* may vary across scenarios, but it’s common to pick *n=2* or *n=3*. With n=2, for the text “the quick brown fox”, the following n-grams would be generated – [ “the quick”, “quick brown”, “brown fox”]

Currently, the following languages are supported for production workloads: English, German, Spanish and Japanese. Other languages are in preview. For more information, see [Supported languages](overview.md#supported-languages).

> [!Note]
> Key phrase analysis is distinct from sentiment analysis. Individual words or phrases are not extracted based on degree of sentiment.

## Guidance for constructing inputs

You can submit the same collection of documents for multiple operations: sentiment analysis, key phrase analysis, and language detection. Operations are indepedendent so run them sequentially or in parallel.

## Next steps

Use the built-in API testing console in the [REST API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) to call the API interactively. To use the console:

+ Provide an access key to your service. You can get it from the [Azure portal](https://portal.azure.com). 
+ Paste the JSON documents, in the format described for the API, into the Request Body section of the page.  
+ Click **Send** to analyze content and get the results. 
+ Review the reponse inline. Reponses include a status code, latency (in milliseconds), and payload (in JSON). 

In addition to the console, we also recommend the [Quickstart](quick-start.md) for more practice and details about each operation.

## See also

 [Sentiment analysis concepts](text-analytics-concept-sentiment-analysis.md) 
 [Language detection concepts](text-analytics-concept-language-detection.md) 