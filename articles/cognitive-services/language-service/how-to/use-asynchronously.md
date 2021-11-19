---
title: "How to: Use Language Service features asynchronously"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to start using Text Summarization.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: quickstart
ms.date: 11/18/2021
ms.author: aahi
ms.custom: language-service-summarization, ignite-fall-2021
zone_pivot_groups: programming-languages-text-analytics
---

# How to use Language Service features asynchronously

The Language service enables you to send API requests asynchronously as a batch, using either the REST API or client library. You can also include multiple different Language Service features in your request, to be performed on your data at the same time. 

Currently, the following features are available to be used asynchronously:
* Entity linking
* Extractive summarization
* Key phrase extraction
* Language detection
* Named Entity Recognition (NER) and Personally Identifiable Information (PII) detection
* Sentiment analysis and opinion mining
* Text Analytics for health


## Send asynchronous API requests using the REST API

To create an asynchronous API request, review the [reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Analyze) for the JSON body you'll send in your request.
1. Add your documents to the `analysisInput` object.  
1. In the `tasks` object, include the operations you want performed on your data. For example, if you wanted to perform sentiment analysis, you would include the `SentimentAnalysisTasks` object.
1. You can optionally:
    1. Choose a specific version of the model used on your data with the `model-version` value.
    1. Include additional Language Service features in the `tasks` object, to be performed on your data at the same time.   

Once you've created the JSON body for your request, add your key to the `Ocp-Apim-Subscription-Key` header. Then send your API request to the `/analyze` endpoint:

```http
https://your-endpoint/text/analytics/v3.1/analyze
```

A successful call will return a 202 response code. The `operation-location` in the response header will be the URL you will use to retrieve the API results. The value will look similar to the following URL:

```http
https://your-endpoint.cognitiveservices.azure.com/text/analytics/v3.2-preview.1/analyze/jobs/12345678-1234-1234-1234-12345678
```

To [retrieve the results](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/AnalyzeStatus) of the request, send a GET request to the URL you received in the `operation-location` header from the previous API response. Remember to include your key in the `Ocp-Apim-Subscription-Key`. The response will include the results of your API call.

## Send asynchronous API requests using the client library

First, make sure you have the client library installed for your language of choice. For steps on installing the client library, see the quickstart article for the feature you want to use.

Afterwards, use the client object to send asynchronous calls to the API. The method calls to use will vary depending on your language. Use the available samples and reference documentation to help you get started.

* [C#](/dotnet/api/overview/azure/ai.textanalytics-readme?view=azure-dotnet#async-examples)
* [Java](/java/api/overview/azure/ai-textanalytics-readme?preserve-view=true&view=azure-java-preview#analyze-multiple-actions)
* [JavaScript](/javascript/api/overview/azure/ai-text-analytics-readme?preserve-view=true&view=azure-node-preview#analyze-actions)
* [Python](/python/api/overview/azure/ai-textanalytics-readme?view=azure-python-preview#multiple-analysis)

## Result availability 

When using this feature asynchronously, the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

## See also

* [Azure Cognitive Service for Language overview](../overview.md)
* [Multilingual and emoji support](../concepts/multi-lingual-emoji-support.md)
* [What's new](../whats-new.md)