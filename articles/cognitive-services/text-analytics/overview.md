---
title: Text mining and analysis with the Text Analytics API - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn about text mining with the Text Analytics API. Use it for sentiment analysis, language detection, and other forms of Natural Language Processing.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 09/09/2020
ms.author: aahi
keywords: text mining, sentiment analysis, text analytics
ms.custom: cog-serv-seo-aug-2020
---

# What is the Text Analytics API?

The Text Analytics API is a cloud-based service that provides Natural Language Processing (NLP) features for text mining and text analysis, including: sentiment analysis, opinion mining, key phrase extraction, language detection, and named entity recognition.

The API is a part of [Azure Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/), a collection of machine learning and AI algorithms in the cloud for your development projects. You can use these features with the [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V2-1/), or the [client library](quickstarts/text-analytics-sdk.md).

> [!VIDEO https://channel9.msdn.com/Shows/AI-Show/Understanding-Text-using-Cognitive-Services/player]

## Sentiment analysis

Use [sentiment analysis](how-tos/text-analytics-how-to-sentiment-analysis.md) and find out what people think of your brand or topic by mining the text for clues about positive or negative sentiment. This API feature returns a sentiment score between 0 and 1 for each document, where 1 is the most positive.

Starting in the v3.1 preview, opinion mining is a feature of Sentiment Analysis. Also known as Aspect-based Sentiment Analysis in Natural Language Processing (NLP), this feature provides more granular information about the opinions related to aspects (such as the attributes of products or services) in text.

## Key phrase extraction

Use [key phrase extraction](how-tos/text-analytics-how-to-keyword-extraction.md) to quickly identify the main concepts in text. For example, in the text "The food was delicious and there were wonderful staff", Key Phrase Extraction will return the main talking points: "food" and "wonderful staff".

## Language detection

Language detection can [detect the language an input text is written in](how-tos/text-analytics-how-to-language-detection.md) and report a single language code for every document submitted on the request in a wide range of languages, variants, dialects, and some regional/cultural languages. The language code is paired with a confidence score.

## Named entity recognition

Named Entity Recognition (NER) can [Identify and categorize entities](how-tos/text-analytics-how-to-entity-linking.md) in your text as people, places, organizations, quantities, Well-known entities are also recognized and linked to more information on the web.

## Use containers

[Use the Text Analytics containers](how-tos/text-analytics-how-to-install-containers.md) as an on-premises solution for mining text and using the API. These Docker containers enable you to extract key phrases, detect language, and analyze sentiment closer to your data.

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

All of the Text Analytics API endpoints accept raw text data. See the [Data limits](concepts/data-limits.md) article for more information.

## Unicode encoding

The Text Analytics API uses Unicode encoding for text representation and character count calculations. Requests can be submitted in both UTF-8 and UTF-16 with no measurable differences in the character count. Unicode codepoints are used as the heuristic for character length and are considered equivalent for the purposes of text analytics data limits. If you use [`StringInfo.LengthInTextElements`](https://docs.microsoft.com/dotnet/api/system.globalization.stringinfo.lengthintextelements) to get the character count, you are using the same method we use to measure data size.

## Next steps

+ [Create an Azure resource](../cognitive-services-apis-create-account.md) for Text Analytics to get a key and endpoint for your applications.

+ Use the [quickstart](quickstarts/text-analytics-sdk.md) to start sending API calls. Learn how to submit text, choose an analysis, and view results with minimal code.

+ See [what's new in the Text Analytics API](whats-new.md) for information on new releases and features.

+ Dig in a little deeper with this [sentiment analysis tutorial](https://docs.microsoft.com/azure/azure-databricks/databricks-sentiment-analysis-cognitive-services) using Azure Databricks.

+ Check out our list of blog posts and more videos on how to use the Text Analytics API with other tools and technologies in our [External & Community Content page](text-analytics-resource-external-community.md).
