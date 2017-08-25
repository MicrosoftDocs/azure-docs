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

# Text Analytics API in Microsoft Cognitive Services

Text Analytics API is a cloud-based service that provides advanced natural language processing over raw text. Text Analytics API has three main functions: sentiment analysis, key phrase extraction, and language detection.

The API is backed by resources in [Microsoft Cognitive Services](https://docs.microsoft.com/en-us/azure/cognitive-services/), a collection of machine learning and AI algorithms in the cloud, readily consumable in your development projects. 

Our models are pretrained using an extensive body of text and natural language technologies from Microsoft. As a result, the workflow is simple: upload raw text for scoring and analysis, and have your code handle the results.

## Capabilities in Text Analytics

Text analysis can mean different things, but in Cognitive Services, APIs are exposed for the three types of analysis described in the following table.

| Operations | APIs | Description |
|-----------|------|-------------|
|[Sentiment Analysis](text-analytics-concept-sentiment-analysis.md) | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) <br/> [.NET](https://github.com/Microsoft/Cognitive-TextAnalytics-DotNet)  | Sentiment analysis helps you find out what customers think of your brand or topic by analyzing any text for clues about sentiment. This API returns a sentiment score between 0 and 1 for each document. The sentiment score is generated using classification techniques. |
|[Key Phrase Extraction](text-analytics-concept-keyword-extraction.md) | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) <br/> [.NET](https://github.com/Microsoft/Cognitive-TextAnalytics-DotNet) | Automatically extract key phrases to quickly identify the main points. For example, for the input text ‘The food was delicious and there were wonderful staff’, the service returns the main talking points: ‘food’ and ‘wonderful staff’. Key phrase extraction uses technology from Microsoft Office's sophisticated Natural Language Processing toolkit. |
|[Language Detection](text-analytics-concept-language-detection.md) | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) <br/>  [.NET](https://github.com/Microsoft/Cognitive-TextAnalytics-DotNet) |  For up to 120 languages, the service can detect which language the input text is written in and report a single language code for every document submitted on the request. The code is paired with a score indicating the strength of the score. Typically, the score is either 1.0 for a positive identification, 0.5 for mixed languages or content that is only. |

 ## Typical workflow

 The workflow is simple: you submit data for analysis and handle outputs in your code. Analyzers are consumed as-is, with no additional configuration or customization.
 
1. [Sign up](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) for the **Text Analytics API** when creating a Cognitive Services account. As with most Azure Services, there is a free version so that you can experiment at no cost.

2. [Get an access key](text-analytics-howto-accesskey.md) from the portal. The key must be passed on each request.

3. [Formulate a request body](text-analytics-howto-call-api.md#json-schema) containing your data as raw unstructured text, in JSON. 

4. Post the request to an endpoint, specifying one of the following resources: sentiment analysis, key phrase extraction, or language detection.

5. Store or stream the response returned from each request. Depending on the request, results are either a sentiment score, a collection of extracted keywords, or a language code.

Output is returned as a single JSON document, with results for each text document you posted, based on ID. You can subsequently analyze, visualize, or categorize the results into actionable insights.

Data is not stored in your account. Operations performed by Text Analytics API are stateless, which means the text you provide is processed and results are returned immediately. 


<a name="supported-languages"></a>

## Supported languages

Text Analytics can detect language for up to 120 different languages. For sentiment analysis and key phrase extraction, the list of supported languages is more selective as we refine the analyzers to accommodate the linguistic rules of additional languages.

Language support is initially rolled out in preview, graduating to generally available (GA) status, independently of each other and of the Text Analytics service overall. Several languages remain in preview, even though the Text Analytics API itself is GA.

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

<a name="data-limits"></a>

## Data limits

Text Analytics accepts raw text data. The service currently sets a limit of 10 KB for each document. If you need to analyze larger documents, you can break them up into 10 KB chunks. If you still require a higher limit, [contact us](https://azure.microsoft.com/overview/sales-number/) so that we can discuss your requirements.

|Limits | |
|------------------------|---------------|
| Maximum size of a single document | 10 KB |
| Maximum size of entire request | 1 MB |
| Maximum number of documents in a request | 1,000 documents |

Rate limiting exists at a rate of 100 calls per minute. We therefore recommend that you submit large quantities of documents in a single call. 

## Next steps

Step through the [quickstart](quick-start.md) to learn the basic workflow using the REST API in C#.

For .NET developers, we recommend the [Cognitive Services Text Analytics .NET SDK](https://github.com/Microsoft/Cognitive-TextAnalytics-DotNet) for developing text analysis apps in managed code.

Alternativley, try the [interactive demo](https://azure.microsoft.com/services/cognitive-services/text-analytics/). You can paste a text input (5K character maximum) to detect the language (up to 120), calculate a sentiment score, or extract key phrases.

## See also

 [Cognitive Services Documentation page](https://docs.microsoft.com/azure/cognitive-services/)   
 [Cognitive Services Product page](https://azure.microsoft.com/services/cognitive-services/)