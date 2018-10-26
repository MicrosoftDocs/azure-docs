---
title: What is Text Analytics?
titleSuffix: Azure Cognitive Services
description: Text Analytics in Azure Cognitive Services for sentiment analysis, key phrase extraction, language detection, and entity linking.
services: cognitive-services
author: ashmaka
manager: cgronlun

ms.service: cognitive-services
ms.component: text-analytics
ms.topic: overview
ms.date: 10/01/2018
ms.author: ashmaka
---

# What is Text Analytics?

The Text Analytics API is a cloud-based service that provides advanced natural language processing over raw text, and includes four main functions: sentiment analysis, key phrase extraction, language detection, and entity linking.

The API is backed by resources in [Microsoft Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/), a collection of machine learning and AI algorithms in the cloud, readily consumable in your development projects.

## Capabilities in Text Analytics

Text analysis can mean different things, but in Cognitive Services, the Text Analytics API provides four types of analysis as described in the following table.

| Operations| Description | APIs |
|-----------|-------------|------|
|[**Sentiment Analysis**](how-tos/text-analytics-how-to-sentiment-analysis.md) | Find out what customers think of your brand or topic by analyzing raw text for clues about positive or negative sentiment. This API returns a sentiment score between 0 and 1 for each document, where 1 is the most positive.<br /> The analysis models are pretrained using an extensive body of text and natural language technologies from Microsoft. For [selected languages](text-analytics-supported-languages.md), the API can analyze and score any raw text that you provide, directly returning results to the calling application. | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) <br /> [.NET](https://docs.microsoft.com/azure/cognitive-services/text-analytics/quickstarts/csharp#install-the-nuget-sdk-package)  |
|[**Key Phrase Extraction**](how-tos/text-analytics-how-to-keyword-extraction.md) | Automatically extract key phrases to quickly identify the main points. For example, for the input text "The food was delicious and there were wonderful staff", the API returns the main talking points: "food" and "wonderful staff".  | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) <br /> [.NET](https://docs.microsoft.com/azure/cognitive-services/text-analytics/quickstarts/csharp#install-the-nuget-sdk-package) |
|[**Language Detection**](how-tos/text-analytics-how-to-language-detection.md) | For up to 120 languages, detect which language the input text is written in and report a single language code for every document submitted on the request. The language code is paired with a score indicating the strength of the score. | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) <br />  [.NET](https://docs.microsoft.com/azure/cognitive-services/text-analytics/quickstarts/csharp#install-the-nuget-sdk-package) | 
|[**Entity Recognition (Preview)**](how-tos/text-analytics-how-to-entity-linking.md) | Identify and categorize entities in your text as people, places, organizations, date/time, quantities, percentages, currencies, and more. Well-known entities are also recognized and linked to more information on the web. | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V2-1-Preview/operations/5ac4251d5b4ccd1554da7634) | 

## Typical workflow

The workflow is simple: you submit data for analysis and handle outputs in your code. Analyzers are consumed as-is, with no additional configuration or customization.

1. [Sign up](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) for an [access key](how-tos/text-analytics-how-to-access-key.md). The key must be passed on each request.

2. [Formulate a request](how-tos/text-analytics-how-to-call-api.md#json-schema) containing your data as raw unstructured text, in JSON.

3. Post the request to the endpoint established during sign-up, appending the desired resource: sentiment analysis, key phrase extraction, language detection, or entity identification.

4. Stream or store the response locally. Depending on the request, results are either a sentiment score, a collection of extracted key phrases, or a language code.

Output is returned as a single JSON document, with results for each text document you posted, based on ID. You can subsequently analyze, visualize, or categorize the results into actionable insights.

Data is not stored in your account. Operations performed by the Text Analytics API are stateless, which means the text you provide is processed and results are returned immediately.

<a name="supported-languages"></a>

## Supported languages

This section has been moved to a separate article for better discoverability. Refer to [Supported languages in Text Analytics API](text-analytics-supported-languages.md) for this content.

<a name="data-limits"></a>

## Data limits

All of the Text Analytics API endpoints accept raw text data. The current limit is 5,000 characters for each document; if you need to analyze larger documents, you can break them up into smaller chunks. If you still require a higher limit, [contact us](https://azure.microsoft.com/overview/sales-number/) so that we can discuss your requirements.

| Limit | Value |
|------------------------|---------------|
| Maximum size of a single document | 5,000 characters as measured by `String.Length`. |
| Maximum size of entire request | 1 MB |
| Maximum number of documents in a request | 1,000 documents |

The rate limit is 100 calls per minute. Note that you can submit a large quantity of documents in a single call (up to 1000 documents).

## Unicode encoding

The Text Analytics API uses Unicode encoding for text representation and character count calculations. Requests can be submitted in both UTF-8 and UTF-16 with no measurable differences in the character count. Unicode codepoints are used as the heuristic for character length and are considered equivalent for the purposes of text analytics data limits. If you use `String.Length` to get the character count, you are using the same method we use to measure data size.

## Next steps

First, try the [interactive demo](https://azure.microsoft.com/services/cognitive-services/text-analytics/). You can paste a text input (5,000 character maximum) to detect the language (up to 120), calculate a sentiment score, or extract key phrases. No sign-up necessary.

When you are ready to call the API directly:

+ [Sign up](how-tos/text-analytics-how-to-signup.md) for an access key and review the steps for [calling the API](how-tos/text-analytics-how-to-call-api.md).

+ [Quickstart](quickstarts/csharp.md) is a walkthrough of the REST API calls written in C#. Learn how to submit text, choose an analysis, and view results with minimal code.

+ [API reference documentation](//go.microsoft.com/fwlink/?LinkID=759346) provides the technical documentation for the APIs. The documentation supports embedded calls so that you can call the API from each documentation page.

+ [External & Community Content](text-analytics-resource-external-community.md) provides a list of blog posts and videos demonstrating how to use Text Analytics with other tools and technologies.

## See also

 [Cognitive Services Documentation page](https://docs.microsoft.com/azure/cognitive-services/)
