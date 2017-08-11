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

The [key phrase extraction](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) API evaluates text input and for each document returns a list of keywords and a score indicating the strength of the analysis. Text Analytics recognizes up to 102 languages.

> [!Note]
> You can submit the same collection of documents for multiple operations: sentiment analysis, key phrase analysis, and language detection. Operations are indepenent so run them sequentially or in parallel.

## Common use cases

## Talking points

Not sure at all -- maybe we say nothing.  One question I had: what is the context of key phrase extraction? is it bounded by the document, or the transaction?

From intro blog:  Based on n-grams...

N-grams denote all occurrences of n consecutive words in the input text. The precise value of n may vary across scenarios, but it’s common to pick n=2 or n=3. With n=2, for the text “the quick brown fox”, the following n-grams would be generated – [ “the quick”, “quick brown”, “brown fox”]

## Next steps

Use the built-in API testing console in the [REST API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) to call the API interactively. To use the console:

+ Provide an access key to your service. You can get it from the [Azure portal](https://portal.azure.com). 
+ Paste the JSON documents, in the format described for the API. 
+ Click **Send** to analyze content and get the results. 
+ Review the reponse inline. Reponses include a status code, latency (in milliseconds), and payload (in JSON). 

We also recommend the [Quickstart](quick-start.md) for additional practice and detail about each operation.
## See also

 [Sentiment analysis concepts](text-analytics-concept-sentiment-analysis.md) 
 [Language detection concepts](text-analytics-concept-language-detection.md) 