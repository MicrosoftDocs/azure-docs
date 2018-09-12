---
title: What is Text Analytics? (Azure Cognitive Services)
titleSuffix: Azure Cognitive Services
description: Text Analytics in Azure Cognitive Services for sentiment analysis, key phrase extraction, language detection, and entity linking.
services: cognitive-services
author: ashmaka
manager: cgronlun

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: overview
ms.date: 09/12/2018
ms.author: ashmaka
---

# What is Text Analytics?

The Text Analytics service provides advanced natural language processing for raw unstructured text. It includes four main functions: sentiment analysis, key phrase extraction, language detection, and entity linking.

## Analyze sentiment

[Find out](how-tos/text-analytics-how-to-sentiment-analysis.md) what customers think of your brand or topic by analyzing raw text for clues about positive or negative sentiment. This API returns a sentiment score between 0 and 1 for each document, where 1 is the most positive.<br />
The analysis models are pretrained using an extensive body of text and natural language technologies from Microsoft. For [selected languages](text-analytics-supported-languages.md), the API can analyze and score any raw text that you provide.

## Extract key phrases

Automatically [extract key phrases](how-tos/text-analytics-how-to-keyword-extraction.md) to quickly identify the main points. For example, given the input text "The food was delicious and there were wonderful staff", the Text Analytics service returns the main talking points: "food" and "wonderful staff".

## Detect language

For up to 120 languages, [detect](how-tos/text-analytics-how-to-language-detection.md) which language the input text is written in and report a single language code for every document submitted on the request. The language code is paired with a score indicating the strength of the score.

## Identify linked entities (Preview)

[Identify](how-tos/text-analytics-how-to-entity-linking.md) well-known entities in your text and link to more information on the web. Entity linking recognizes and disambiguates when a term is used as one of separately distinguishable entities, verbs, and other word forms.

## Typical workflow

The workflow is simple: you submit data for analysis and handle outputs in your code. Analyzers are consumed as-is, with no additional configuration or customization.

1. [Sign up](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) for an [access key](how-tos/text-analytics-how-to-access-key.md). The key must be passed on each request.

2. [Create a request](how-tos/text-analytics-how-to-call-api.md#json-schema) in JSON that contains your data as raw unstructured text.

3. Post the request to the endpoint established during sign-up, appending the API you want to call: sentiment analysis, key phrase extraction, language detection, or entity identification.

4. Stream or store the response locally. Depending on the request, results are either a sentiment score, a collection of extracted key phrases, or a language code.

Output is returned as a single JSON document, with results for each text document you posted, based on ID. You can then analyze, visualize, or categorize the results into actionable insights.

Operations done by the Text Analytics service are stateless. Data is not stored in your account.

<a name="data-limits"></a>

## Specifications

### Supported languages

See [Supported languages in Text Analytics](text-analytics-supported-languages.md).

### Data limits

All of the Text Analytics service endpoints accept raw text data. The current limit is 5,000 characters for each document; if you need to analyze larger documents, you can break them up into smaller chunks. If you still require a higher limit, [contact us](https://azure.microsoft.com/overview/sales-number/) so that we can discuss your requirements.

| Limit | Value |
|------------------------|---------------|
| Maximum size of a single document | 5,000 characters as measured by `String.Length`. |
| Maximum size of entire request | 1 MB |
| Maximum number of documents in a request | 1,000 documents |

The rate limit is 100 calls per minute. Note you can submit a large quantity of documents in a single call (up to 1000 documents).

### Unicode encoding

The Text Analytics service uses Unicode encoding for text representation and character count calculations. You can submit requests in either UTF-8 or UTF-16, with no measurable differences in the character count. If you use `String.Length` to get the character count, you're using the same method we use to measure data size.

## Next steps

First, try the [interactive demo](https://azure.microsoft.com/services/cognitive-services/text-analytics/). You can paste a text input (5,000 character maximum) to detect the language (up to 120), calculate a sentiment score, extract key phrases, or identify linked entities. No sign-up is necessary.

When you're ready to call the Text Analytics service directly:

+ [Sign up](how-tos/text-analytics-how-to-signup.md) for an access key and review the steps for [calling the API](how-tos/text-analytics-how-to-call-api.md).

+ [Quickstart](quickstarts/csharp.md) is a walkthrough of the REST API calls written in C#. Learn how to submit text, choose an analysis, and view results with minimal code.

+ [API reference documentation](//go.microsoft.com/fwlink/?LinkID=759346) provides the technical documentation for the REST APIs. The documentation supports embedded calls, so you can call the API from each documentation page.

+ [External & Community Content](text-analytics-resource-external-community.md) provides a list of blog posts and videos demonstrating how to use Text Analytics with other tools and technologies.

## See also

 [Cognitive Services Documentation page](https://docs.microsoft.com/azure/cognitive-services/)
