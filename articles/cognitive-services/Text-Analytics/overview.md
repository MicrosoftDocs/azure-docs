---
title: Text Analytics API overview (Microsoft Cognitive Services on Azure) | Microsoft Docs
description: Text Analytics API in Azure Cognitive Services for sentiment analysis, key phrase extraction, and language detection.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 08/24/2017
ms.author: heidist
---

# Text Analytics API Version 2.0

**Text Analytics API** is a cloud-based service that provides advanced natural language processing over raw text. Text Analytics API has three main functions: sentiment analysis, key phrase extraction, and language detection.

The API is backed by resources in [Microsoft Cognitive Services](https://docs.microsoft.com/en-us/azure/cognitive-services/), a collection of machine learning and AI algorithms in the cloud, readily consumable in your development projects. 

## Capabilities in Text Analytics

Text analysis can mean different things, but in Cognitive Services, APIs are exposed for the three types of analysis described in the following table.

| Operations| Description | APIs |
|-----------|-------------|------|
|[**Sentiment Analysis**](text-analytics-howto-sentiment-analysis.md) | Find out what customers think of your brand or topic by analyzing raw text for clues about positive or negative sentiment. This API returns a sentiment score between 0 and 1 for each document, where 1 is the most positive. <p/>Our models are pretrained using an extensive body of text and natural language technologies from Microsoft. For [selected languages](#supported-languages), the service can analyze and score any raw text that you provide, directly returning results to the calling application. | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) <br/> [.NET](https://aka.ms/tasdkdotnet)  |
|[**Key Phrase Extraction**](text-analytics-howto-keyword-extraction.md) | Automatically extract key phrases to quickly identify the main points. For example, for the input text ‘The food was delicious and there were wonderful staff’, the service returns the main talking points: ‘food’ and ‘wonderful staff’.  | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) <br/> [.NET](https://aka.ms/tasdkdotnet) |
|[**Language Detection**](text-analytics-howto-language-detection.md) | For up to 120 languages, detect which language the input text is written in and report a single language code for every document submitted on the request. The code is paired with a score indicating the strength of the score. | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) <br/>  [.NET](https://aka.ms/tasdkdotnet) | 

 ## Typical workflow

 The workflow is simple: you submit data for analysis and handle outputs in your code. Analyzers are consumed as-is, with no additional configuration or customization.
 
1. [Sign up](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) for an 
[access key](text-analytics-howto-accesskey.md). The key must be passed on each request.

3. [Formulate a request](text-analytics-howto-call-api.md#json-schema) containing your data as raw unstructured text, in JSON. 

4. Post the request to an endpoint established during sign-up, appending one of the following resources: sentiment analysis, key phrase extraction, or language detection.

5. Stream or store the response locally. Depending on the request, results are either a sentiment score, a collection of extracted keywords, or a language code.

Output is returned as a single JSON document, with results for each text document you posted, based on ID. You can subsequently analyze, visualize, or categorize the results into actionable insights.

Data is not stored in your account. Operations performed by Text Analytics API are stateless, which means the text you provide is processed and results are returned immediately. 


<a name="supported-languages"></a>

## Supported languages

Text Analytics can detect language for up to 120 different languages. For sentiment analysis and key phrase extraction, the list of supported languages is more selective as we refine the analyzers to accommodate the linguistic rules of additional languages.

Language support is initially rolled out in preview, graduating to generally available (GA) status, independently of each other and of the Text Analytics service overall. It's possible for languages to remain in preview, even while Text Analytics API transitions to generally available.

| Language    | Language code | Sentiment | Key phrases |
|:----------- |:----:|:----:|:----:|
| Danish      | `da` | ✔ \* |  |
| Dutch       | `nl` | ✔ \* |  | 
| English     | `en` | ✔ | ✔ | 
| Finnish     | `fi` | ✔ \* |  | 
| French      | `fr` | ✔ | ✔  | 
| German       | `de` | ✔ \* | ✔ |
| Greek       | `el` | ✔ \* |  |
| Italian     | `it` | ✔ \* |  | 
| Japanese    | `ja` |  | ✔ |   |
| Norwegian   | `no` | ✔ \* |  | 
| Polish      | `pl` | ✔ \* |  | 
| Portuguese  | `pt` | ✔ |  | 
| Russian     | `ru` | ✔ \* |  | 
| Spanish     | `es` | ✔ | ✔ | 
| Swedish     | `sv` | ✔ \* |  | 
| Turkish     | `tr` | ✔ \* |  | 

\* indicates language support in preview

<a name="data-limits"></a>

## Data limits

Text Analytics accepts raw text data. The service currently sets a limit of 10 KB for each document. If you need to analyze larger documents, you can break them up into 10 KB chunks. If you still require a higher limit, [contact us](https://azure.microsoft.com/overview/sales-number/) so that we can discuss your requirements.

|Limits | |
|------------------------|---------------|
| Maximum size of a single document | 10 KB |
| Maximum size of entire request | 1 MB |
| Maximum number of documents in a request | 1,000 documents |

Rate limiting exists at a rate of 100 calls per minute. Note that you can submit large quantities of documents in a single call (up to 1000 documents). 

## Next steps

First, try the [interactive demo](https://azure.microsoft.com/services/cognitive-services/text-analytics/). You can paste a text input (5K character maximum) to detect the language (up to 120), calculate a sentiment score, or extract key phrases. No sign-up necessary.

When you are ready to call the API directly, continue with these links:

+ [Sign up](text-analytics-howto-signup.md) for an access key and review the steps for [calling the API](text-analytics-howto-call-api.md).

+ [Quickstart](quick-start.md) is a walkthrough of the REST API calls written in C#. Learn how to submit text, choose an analysis, and view results with minimal code.

+ [API reference documentation](//go.microsoft.com/fwlink/?LinkID=759346) provides the technical documentation for the APIs. The documentation supports embedded calls so that you can call the API from each documentation page.

+ [External & Community Content](text-analytics-resource-external-community.md) provides a list of blog posts and videos demonstrating how to use Text Analytics with other tools and technologies.

## See also

 [Cognitive Services Documentation page](https://docs.microsoft.com/azure/cognitive-services/)   
 [Cognitive Services Product page](https://azure.microsoft.com/services/cognitive-services/)
