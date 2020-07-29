---
title: What is the Text Analytics API? - Capabilities - 
titleSuffix: Azure Cognitive Services
description: Use the Text Analytics API from Azure Cognitive Services for sentiment analysis, key phrase extraction, language detection, and entity recognition.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 03/04/2020
ms.author: aahi
---

# What is the Text Analytics API?

The Text Analytics API is a cloud-based service that provides advanced natural language processing over raw text, and includes four main functions: sentiment analysis, key phrase extraction, language detection, and named entity recognition.

The API is a part of [Azure Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/), a collection of machine learning and AI algorithms in the cloud for your development projects.

> [!VIDEO https://channel9.msdn.com/Shows/AI-Show/Understanding-Text-using-Cognitive-Services/player]

Text analysis can mean different things, but in Cognitive Services, the Text Analytics API provides four types of analysis as described below. You can use these features with the [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V2-1/), or the [client library](quickstarts/text-analytics-sdk.md).

## Sentiment Analysis
Use [sentiment analysis](how-tos/text-analytics-how-to-sentiment-analysis.md) to find out what customers think of your brand or topic by analyzing raw text for clues about positive or negative sentiment. This API returns a sentiment score between 0 and 1 for each document, where 1 is the most positive.<br /> The analysis models are pretrained using an extensive body of text and natural language technologies from Microsoft. For [selected languages](text-analytics-supported-languages.md), the API can analyze and score any raw text that you provide, directly returning results to the calling application.

## Key Phrase Extraction
Automatically [extract key phrases](how-tos/text-analytics-how-to-keyword-extraction.md) to quickly identify the main points. For example, for the input text "The food was delicious and there were wonderful staff", the API returns the main talking points: "food" and "wonderful staff".

## Language Detection
You can [detect which language the input text is written in](how-tos/text-analytics-how-to-language-detection.md) and report a single language code for every document submitted on the request in a wide range of languages, variants, dialects, and some regional/cultural languages. The language code is paired with a score indicating the strength of the score.

## Named Entity Recognition
[Identify and categorize entities](how-tos/text-analytics-how-to-entity-linking.md) in your text as people, places, organizations, date/time, quantities, percentages, currencies, and more. Well-known entities are also recognized and linked to more information on the web.

## Use containers

[Use the Text Analytics containers](how-tos/text-analytics-how-to-install-containers.md) to extract key phrases, detect language, and analyze sentiment locally, by installing standardized Docker containers closer to your data.

## Typical workflow

The workflow is simple: you submit data for analysis and handle outputs in your code. Analyzers are consumed as-is, with no additional configuration or customization.

1. [Create an Azure resource](../cognitive-services-apis-create-account.md) for Text Analytics. Afterwards, [get the key](../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) generated for you to authenticate your requests.

2. [Formulate a request](how-tos/text-analytics-how-to-call-api.md#json-schema) containing your data as raw unstructured text, in JSON.

3. Post the request to the endpoint established during sign-up, appending the desired resource: sentiment analysis, key phrase extraction, language detection, or named entity recognition.

4. Stream or store the response locally. Depending on the request, results are either a sentiment score, a collection of extracted key phrases, or a language code.

Output is returned as a single JSON document, with results for each text document you posted, based on ID. You can subsequently analyze, visualize, or categorize the results into actionable insights.

Data is not stored in your account. Operations performed by the Text Analytics API are stateless, which means the text you provide is processed and results are returned immediately.

## Text Analytics for multiple programming experience levels

You can start using the Text Analytics API in your processes, even if you don't have much experience in programming. Use these tutorials to learn how you can use the API to analyze text in different ways to fit your experience level. 

* Minimal programming required:
    * [Extract information in Excel using Text Analytics and Power Automate](tutorials/extract-excel-information.md)
    * [Use the Text Analytics API and MS Flow to identify the sentiment of comments in a Yammer group](https://docs.microsoft.com/Yammer/integrate-yammer-with-other-apps/sentiment-analysis-flow-azure?toc=%2F%2Fazure%2Fcognitive-services%2Ftext-analytics%2Ftoc.json&bc=%2F%2Fazure%2Fbread%2Ftoc.json)
    * [Integrate Power BI with the Text Analytics API to analyze customer feedback](tutorials/tutorial-power-bi-key-phrases.md)
* Programming experience recommended:
    * [Sentiment analysis on streaming data using Azure Databricks](https://docs.microsoft.com/azure/azure-databricks/databricks-sentiment-analysis-cognitive-services?toc=%2F%2Fazure%2Fcognitive-services%2Ftext-analytics%2Ftoc.json&bc=%2F%2Fazure%2Fbread%2Ftoc.json)
    * [Build a Flask app to translate text, analyze sentiment, and synthesize speech](https://docs.microsoft.com/azure/cognitive-services/translator/tutorial-build-flask-app-translation-synthesis?toc=%2F%2Fazure%2Fcognitive-services%2Ftext-analytics%2Ftoc.json&bc=%2F%2Fazure%2Fbread%2Ftoc.json)


<a name="supported-languages"></a>

## Supported languages

This section has been moved to a separate article for better discoverability. Refer to [Supported languages in the Text Analytics API](text-analytics-supported-languages.md) for this content.

<a name="data-limits"></a>

## Data limits

All of the Text Analytics API endpoints accept raw text data. The current limit is 5,120 characters for each document; if you need to analyze larger documents, you can break them up into smaller chunks.

| Limit | Value |
|------------------------|---------------|
| Maximum size of a single document | 5,120 characters as measured by [`StringInfo.LengthInTextElements`](https://docs.microsoft.com/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum size of entire request | 1 MB |
| Maximum number of documents in a request | Up to 1,000 documents ([varies for each feature](concepts/data-limits.md)) |

Your rate limit will vary with your pricing tier.

| Tier          | Requests per second | Requests per minute |
|---------------|---------------------|---------------------|
| S / Multi-service | 1000                | 1000                |
| S0 / F0         | 100                 | 300                 |
| S1            | 200                 | 300                 |
| S2            | 300                 | 300                 |
| S3            | 500                 | 500                 |
| S4            | 1000                | 1000                |

Requests are measured for each Text Analytics feature separately. For example, you can send the maximum number of requests for your pricing tier to each feature, at the same time.      

## Unicode encoding

The Text Analytics API uses Unicode encoding for text representation and character count calculations. Requests can be submitted in both UTF-8 and UTF-16 with no measurable differences in the character count. Unicode codepoints are used as the heuristic for character length and are considered equivalent for the purposes of text analytics data limits. If you use [`StringInfo.LengthInTextElements`](https://docs.microsoft.com/dotnet/api/system.globalization.stringinfo.lengthintextelements) to get the character count, you are using the same method we use to measure data size.

## Next steps

+ [Create an Azure resource](../cognitive-services-apis-create-account.md) for Text Analytics to get a key and endpoint for your applications.

+ Use the [quickstart](quickstarts/text-analytics-sdk.md) to start sending API calls. Learn how to submit text, choose an analysis, and view results with minimal code.

+ See [what's new in the Text Analytics API](whats-new.md) for information on new releases and features.

+ Dig in a little deeper with this [sentiment analysis tutorial](https://docs.microsoft.com/azure/azure-databricks/databricks-sentiment-analysis-cognitive-services) using Azure Databricks.

+ Check out our list of blog posts and more videos on how to use the Text Analytics API with other tools and technologies in our [External & Community Content page](text-analytics-resource-external-community.md).
