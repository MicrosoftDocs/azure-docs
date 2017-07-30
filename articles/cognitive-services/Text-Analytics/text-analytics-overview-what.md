---
title: What is Text Analytics API (Azure Cognitive Servies) | Microsoft Docs
description: A Text Analytics API in Azure Cognitive Services for sentiment analysis, key phrase extraction, and language detection.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 07/24/2017
ms.author: heidist
---

# What is the Text Analytics API (Azure Cognitive Services)

Azure Cognitive Services is Microsoft's cloud service for providing artificial intelligence and machine learning to your development projects.

**Text Analytics** is a platform within Cognitive Services for analyzing text with a clear focus on *sentiment analysis*, *key phrase extraction*, and *language detection*. 

As part of the language-oriented services in [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/), you can combine Text Analytics with other services to support more complex scenarios. For ideas on multi-service use cases, see [How to use Text Analytics](text-analytics-overview-how.md).

## Resources provided by Text Analytics API

Text analysis can mean different things, but in Azure Cognitives Services, Text Analytics APIs support the following three workloads.

| Workloads | Description |
|-----------|-------------|
|Sentiment Analysis | Sentiment analysis helps you find out what customers think of your brand or topic by analyzing any text for clues about sentiment. A sentiment score is generated using classification techniques, and returns a score between 0 and 1. The input features to the classifier include n-grams, features generated from part-of-speech tags, and embedded words. |
|Key Phrase Extraction | Automatically extract key phrases to quickly identify the main points. We employ techniques from Microsoft Office's sophisticated Natural Language Processing toolkit. For example, for the input text ‘The food was delicious and there were wonderful staff’, the service returns the main talking points: ‘food’ and ‘wonderful staff’.|
|Language Detection | The service can detect which language the input text is written in (120 languages are supported). A single language code is provided for every document submitted on the request, along with a score indicating a level of certainty for the analysis. For example, if text includes a combination of languages, the service gives you the predominant language, but with a score reflecting the mixed results. |

+ Sentiment analysis returns a sentiment score between 0 and 1, generated using classification techniques. Inputs are JSON documents, that typically include n-grams, text generated from part-of-speech tags, and embedded words. 
+ Keyphrase extraction
+ Language detection 

## Typical workflow

The Text Analytics API is used to access an analytics engine in the Azure cloud. Your applicaion code submits the request and handles the results.

You submit text data in JSON as part of a request for sentiment analysis, keyword extraction, or language detection. Inputs are analyzed, and outputs are in the form of JSON documents, typically a one-to-one result for each document you provided.

Data is not stored but Microsoft might capture it for testin purposes as we evolve the algorithms used for various Cognitive Services platforms. 

## Supported Languages for sentiment analysis and key phrase extraction

Analyzing sentiment and phrases is a complex operation requiring access to linguistic rules specific to each language. Support for several languages has graduated from preview to generally available (GA) status. Others are still in preview, even though the Text Analytics API itself has GA status.

| Language    | Language code | Sentiment | Key phrases |
|:----------- |:----:|:----:|:----:|
| Danish      | `da` | ✔ \* |  |
| German       | `de` | ✔ \* | ✔ |
| Greek       | `el` | ✔ \* |  |
| English     | `en` | ✔ | ✔ | 
| Spanish     | `es` | ✔ | ✔ | 
| Finnish     | `fi` | ✔ \* |  | 
| French      | `fr` | ✔ | ✔ \* | 
| Japanese    | `ja` |  | ✔ |   |
| Italian     | `it` | ✔ \* |  | 
| Dutch       | `nl` | ✔ \* |  | 
| Norwegian   | `no` | ✔ \* |  | 
| Polish      | `pl` | ✔ \* |  | 
| Portuguese  | `pt` | ✔ |  | 
| Russian     | `ru` | ✔ \* |  | 
| Swedish     | `sv` | ✔ \* |  | 
| Turkish     | `tr` | ✔ \* |  | 

\* indicates language support in preview

## Sign up and billing

Although Cognivitive Services has multiple APIs, we ask you to sign up for them individually so that you can control cost and availability for each workload:

+ [Pricing for text analytics](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/)
+ [Calculator](https://azure.microsoft.com/pricing/calculator/?service=cognitive-services)

You are charged only for the requests you submit, where a request is either sentiment, keyword, or language detection (they can't be combined into one request). We don't store data, nor charge by the size of the payload. A request with 1 megabyte of data costs the same as one with 1 kilobyte of data.

At the Free tier, there is a maximum number of requests per month, where the counter is reset one month plus one day ahead of the first request.

**How to change tiers**

Standard billing is in tiers. You can switch up or down easily in the portal. You do not have to repeat the sign up process when changing the tier, which means you can adjust limits and still keep the same endpoint and access keys.

1. Sign in to Azure portal and find your Text Analytics API dashboard.
2. Click **Price Tier**.
   ![Price tier command in left navigation menu](../media/text-analytics/portal-pricing-tier.png)
3. Choose the tier you want and click **Select**.  The new limits take effect as soon as the selection is processed. 
   ![Tiles and Select button in tier selction page](../media/text-analytics/portal-choose-tier.png)

## Next steps

First, try the [interactive demo]() to submit text input (5K character maximum) to detect the language (up to 120), calculate a sentiment score, or extract key phrases.

Next, step through the [quickstart REST API tutorial](text-analytics-quickstart-rest-api.md) to learn the basic workflow using the REST API and a Web API testing tool.

For .NET developers, we recommend the [Cognitive Services Text Analytics .NET SDK](https://github.com/Microsoft/Cognitive-TextAnalytics-DotNet), for developing text analysis apps in managed code.

## See also

 [Azure Cognitive Services Documentation page](https://docs.microsoft.com/azure/cognitive-services/)   
 [Azure Cognitive Services Product page](https://azure.microsoft.com/services/cognitive-services/)


