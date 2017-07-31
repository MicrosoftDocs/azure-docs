---
title: What is Text Analytics API (Azure Cognitive Servies) | Microsoft Docs
description: A Text Analytics API in Azure Cognitive Services for sentiment analysis, key phrase extraction, and language detection.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 07/31/2017
ms.author: heidist
---

# Text Analytics API in Azure Cognitive Services

Azure Cognitive Services is Microsoft's cloud solution for adding intelligent behaviors to the features you create in custom apps. **Text Analytics** is a collection of APIs within Cognitive Services - presented with a clear focus on sentiment analysis, key phrase extraction, and language detection. 

> [!Note]
> As part of the language-oriented services in [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/), you can combine Text Analytics with other services to support complex development projects. For ideas on multi-technology scenarios, see [How to use Text Analytics](text-analytics-overview-how.md).

## Workloads supported through Text Analytics APIs

Text analysis can mean different things, but in Azure Cognitive Services, APIs are exposed through three resource types. Each resource is backed by leading edge algorithms, models, and natural language processing capabilites from Microsoft.

| Workloads | APIs | Description |
|-----------|------|-------------|
|Sentiment Analysis | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) or [.NET](https://github.com/Microsoft/Cognitive-TextAnalytics-DotNet) | Sentiment analysis helps you find out what customers think of your brand or topic by analyzing any text for clues about sentiment. A sentiment score is generated using classification techniques, and returns a score between 0 and 1. The input features to the classifier include n-grams, features generated from part-of-speech tags, and embedded words. |
|Key Phrase Extraction | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) or [.NET](https://github.com/Microsoft/Cognitive-TextAnalytics-DotNet) | Automatically extract key phrases to quickly identify the main points. We employ techniques from Microsoft Office's sophisticated Natural Language Processing toolkit. For example, for the input text ‘The food was delicious and there were wonderful staff’, the service returns the main talking points: ‘food’ and ‘wonderful staff’.|
|Language Detection | [REST](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) or [.NET](https://github.com/Microsoft/Cognitive-TextAnalytics-DotNet) | The service can detect which language the input text is written in (120 languages are supported). A single language code is provided for every document submitted on the request, along with a score indicating a level of certainty for the analysis. For example, if text includes a combination of languages, the service gives you the predominant language, but with a score reflecting the mixed results. |

## Typical workflow

The Text Analytics API is used to access an analytics engine in the Azure cloud, which hosts machine learning algorithms and models for handling requests and returning results to a calling application.

To use our analytical services, you submit raw text data in JSON as part of a request for sentiment analysis, key phrase extraction, or language detection. Inputs are analyzed, and outputs are returned in the form of JSON documents, typically a one-to-one result set for each document you provide as input.

Data is not stored, but on occasion Microsoft might capture and use it temporarily for testing various Cognitive Services algorithms and platforms. 

Generally, the documents you provide can be used as-is for all three workloads. For example, given a single JSON documents collection, your code can invoke a series of operations (language detection, keyword extraction, sentiment analysis) over the same data.

## Supported languages for sentiment and key phrase extraction

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

<a name="data-limits"></a>

## Data limits

Text Analytics accepts raw text data. The service currently sets a limit of 10 KB for each document. While this number might seem low, the vast majority of text submitted for analysis is below this limit. If you require a higher limit, contact us so that we can discuss your requirements.

|Limits | |
|------------------------|---------------|
| Maximum size of a single document | 10 KB |
| Maximum size of entire request | 1 MB |
| Maximum number of documents in a request | 1,000 documents |

Rate limiting exists at a rate of 100 calls per minute. We therefore recommend that you submit large quantities of documents in a single call. 

## Sign up and billing

Although Cognitive Services has multiple APIs, we ask you to sign up for them individually to control cost and availability for each workload:

+ [Pricing for text analytics](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/)
+ [Calculator](https://azure.microsoft.com/pricing/calculator/?service=cognitive-services)

You are charged only for the transactions you submit. A transaction is defined as a POST specifying one of the following resources:  sentiment, keyword, or language detection. You cannot combine multiple analyses into one request. There is no storage component to billing. However, there are [limits on the size and structure of the payload](#data-limits).

At the Free tier, there is a maximum number of requests per month. The counter is reset one month plus one day ahead of the first request.

**How to sign up**

Sign in to the Azure portal, create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account), choosing the **Text Analytics API**.

**How to change tiers**

Standard billing is offers at graduated levels of transactions. You can switch tiers and still keep the same endpoint and access keys.

1. Sign in to [Azure portal](https://portal.azure.com) and find your Text Analytics API dashboard.

2. Click **Price Tier**.

   ![Price tier command in left navigation menu](../media/text-analytics/portal-pricing-tier.png)

3. Choose the tier you want and click **Select**.  The new limits take effect as soon as the selection is processed. 

   ![Tiles and Select button in tier selection page](../media/text-analytics/portal-choose-tier.png)

## Next steps

First, try the [interactive demo](https://azure.microsoft.com/services/cognitive-services/text-analytics/). You can submit text input (5K character maximum) to detect the language (up to 120), calculate a sentiment score, or extract key phrases.

Next, step through the [quickstart REST API tutorial](text-analytics-quickstart-rest-api.md) to learn the basic workflow using the REST API and a Web API testing tool.

For .NET developers, we recommend the [Cognitive Services Text Analytics .NET SDK](https://github.com/Microsoft/Cognitive-TextAnalytics-DotNet) for developing text analysis apps in managed code.

## See also

 [Azure Cognitive Services Documentation page](https://docs.microsoft.com/azure/cognitive-services/)   
 [Azure Cognitive Services Product page](https://azure.microsoft.com/services/cognitive-services/)


