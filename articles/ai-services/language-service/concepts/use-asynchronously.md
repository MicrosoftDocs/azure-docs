---
title: "How to: Use Language service features asynchronously"
titleSuffix: Azure AI services
description: Learn how to send Language service API requests asynchronously.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: aahi
---

# How to use Language service features asynchronously

The Language service enables you to send API requests asynchronously, using either the REST API or client library. You can also include multiple different Language service features in your request, to be performed on your data at the same time. 

Currently, the following features are available to be used asynchronously:
* Entity linking
* Document summarization
* Conversation summarization
* Key phrase extraction
* Language detection
* Named Entity Recognition (NER)
* Customer content detection
* Sentiment analysis and opinion mining
* Text Analytics for health
* Personal Identifiable information (PII)

When you send asynchronous requests, you will incur charges based on number of text records you include in your request, for each feature use. For example, if you send a text record for sentiment analysis and NER, it will be counted as sending two text records, and you will be charged for both according to your [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/). 

## Submit an asynchronous job using the REST API

To submit an asynchronous job, review the [reference documentation](/rest/api/language/2023-04-01/text-analysis-runtime/submit-job) for the JSON body you'll send in your request.
1. Add your documents to the `analysisInput` object.  
1. In the `tasks` object, include the operations you want performed on your data. For example, if you wanted to perform sentiment analysis, you would include the `SentimentAnalysisLROTask` object.
1. You can optionally:
    1. Choose a specific [version of the model](model-lifecycle.md) used on your data.
    1. Include additional Language service features in the `tasks` object, to be performed on your data at the same time.   

Once you've created the JSON body for your request, add your key to the `Ocp-Apim-Subscription-Key` header. Then send your API request to job creation endpoint. For example:

```http
POST https://your-endpoint.cognitiveservices.azure.com/language/analyze-text/jobs?api-version=2022-05-01
```

A successful call will return a 202 response code. The `operation-location` in the response header will be the URL you will use to retrieve the API results. The value will look similar to the following URL:

```http
GET {Endpoint}/language/analyze-text/jobs/12345678-1234-1234-1234-12345678?api-version=2022-05-01
```

To [get the status and retrieve the results](/rest/api/language/2023-04-01/text-analysis-runtime/job-status) of the request, send a GET request to the URL you received in the `operation-location` header from the previous API response. Remember to include your key in the `Ocp-Apim-Subscription-Key`. The response will include the results of your API call.

## Send asynchronous API requests using the client library

First, make sure you have the client library installed for your language of choice. For steps on installing the client library, see the quickstart article for the feature you want to use.

Afterwards, use the client object to send asynchronous calls to the API. The method calls to use will vary depending on your language. Use the available samples and reference documentation to help you get started.

* [C#](/dotnet/api/overview/azure/ai.textanalytics-readme?preserve-view=true&view=azure-dotnet#async-examples)
* [Java](/java/api/overview/azure/ai-textanalytics-readme?preserve-view=true&view=azure-java-preview#analyze-multiple-actions)
* [JavaScript](/javascript/api/overview/azure/ai-text-analytics-readme?preserve-view=true&view=azure-node-preview#analyze-actions)
* [Python](/python/api/overview/azure/ai-textanalytics-readme?preserve-view=true&view=azure-python-preview#multiple-analysis)

## Result availability 

When using this feature asynchronously, the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

## Automatic language detection

Starting in version `2022-07-01-preview` of the REST API, you can request automatic [language detection](../language-detection/overview.md) on your documents. By setting the `language` parameter to `auto`, the detected language code of the text will be returned as a language value in the response. This language detection will not incur extra charges to your Language resource.

## Data limits

> [!NOTE]
> * If you need to analyze larger documents than the limit allows, you can break the text into smaller chunks of text before sending them to the API. 
> * A document is a single string of text characters.  

You can send up to 125,000 characters across all documents contained in the asynchronous request, as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). This character limit is higher than the limit for synchronous requests, to enable higher throughput. 

If a document exceeds the character limit, the API will reject the entire request and return a `400 bad request` error if any document within it exceeds the maximum size.

## See also

* [Azure AI Language overview](../overview.md)
* [Multilingual and emoji support](../concepts/multilingual-emoji-support.md)
* [What's new](../whats-new.md)
