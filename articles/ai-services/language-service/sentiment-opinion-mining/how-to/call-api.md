---
title: How to perform sentiment analysis and opinion mining
titleSuffix: Azure AI services
description: This article will show you how to detect sentiment, and mine for opinions in text.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 07/19/2023
ms.author: aahi
ms.custom: language-service-sentiment-opinion-mining, ignite-fall-2021
---

# How to: Use Sentiment analysis and Opinion Mining 

Sentiment analysis and opinion mining are two ways of detecting positive and negative sentiment. Using sentiment analysis, you can get sentiment labels (such as "negative", "neutral" and "positive") and confidence scores at the sentence and document-level. Opinion Mining provides granular information about the opinions related to words (such as the attributes of products or services) in the text.

## Sentiment Analysis

Sentiment Analysis applies sentiment labels to text, which are returned at a sentence and document level, with a confidence score for each. 

The labels are *positive*, *negative*, and *neutral*. At the document level, the *mixed* sentiment label also can be returned. The sentiment of the document is determined below:

| Sentence sentiment                                                                            | Returned document label |
|-----------------------------------------------------------------------------------------------|-------------------------|
| At least one `positive` sentence is in the document. The rest of the sentences are `neutral`. | `positive`              |
| At least one `negative` sentence is in the document. The rest of the sentences are `neutral`. | `negative`              |
| At least one `negative` sentence and at least one `positive` sentence are in the document.    | `mixed`                 |
| All sentences in the document are `neutral`.                                                  | `neutral`               |

Confidence scores range from 1 to 0. Scores closer to 1 indicate a higher confidence in the label's classification, while lower scores indicate lower confidence. For each document or each sentence, the predicted scores associated with the labels (positive, negative, and neutral) add up to 1. For more information, see the [Responsible AI transparency note](/legal/cognitive-services/text-analytics/transparency-note?context=/azure/ai-services/text-analytics/context/context). 

## Opinion Mining

Opinion Mining is a feature of Sentiment Analysis. Also known as Aspect-based Sentiment Analysis in Natural Language Processing (NLP), this feature provides more granular information about the opinions related to attributes of products or services in text. The API surfaces opinions as a target (noun or verb) and an assessment (adjective).

For example, if a customer leaves feedback about a hotel such as "The room was great, but the staff was unfriendly.", Opinion Mining will locate targets (aspects) in the text, and their associated assessments (opinions) and sentiments. Sentiment Analysis might only report a negative sentiment.

:::image type="content" source="../media/opinion-mining.png" alt-text="A diagram of the Opinion Mining example" lightbox="../media/opinion-mining.png":::

If you're using the REST API, to get Opinion Mining in your results, you must include the `opinionMining=true` flag in a request for sentiment analysis. The Opinion Mining results will be included in the sentiment analysis response. Opinion mining is an extension of Sentiment Analysis and is included in your current [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/).

## Development options

[!INCLUDE [development options](../includes/development-options.md)]

## Determine how to process the data (optional)

### Specify the sentiment analysis model

By default, sentiment analysis will use the latest available AI model on your text. You can also configure your API requests to use a specific [model version](../../concepts/model-lifecycle.md).

<!--### Using a preview model version

To use the a preview model version in your API calls, you must specify the model version using the model version parameter. For example, if you were sending a request using Python:

```python
result = text_analytics_client.analyze_sentiment(documents, show_opinion_mining=True, model_version="2021-10-01-preview")
```

or if you were using the REST API:

```rest
https://your-resource-name.cognitiveservices.azure.com/text/analytics/v3.1/sentiment?opinionMining=true&model-version=2021-10-01-preview
```

See the reference documentation for more information.
* [REST API](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Sentiment)

* [.NET](/dotnet/api/azure.ai.textanalytics.analyzesentimentaction#properties)
* [Python](/python/api/azure-ai-textanalytics/azure.ai.textanalytics.textanalyticsclient#analyze-sentiment-documents----kwargs-)
* [Java](/java/api/com.azure.ai.textanalytics.models.analyzesentimentoptions.setmodelversion#com_azure_ai_textanalytics_models_AnalyzeSentimentOptions_setModelVersion_java_lang_String_)
* [JavaScript](/javascript/api/@azure/ai-text-analytics/analyzesentimentoptions)
-->

### Input languages

When you submit documents to be processed by sentiment analysis, you can specify which of [the supported languages](../language-support.md) they're written in. If you don't specify a language, sentiment analysis will default to English. The API may return offsets in the response to support different [multilingual and emoji encodings](../../concepts/multilingual-emoji-support.md). 

## Submitting data

Sentiment analysis and opinion mining produce a higher-quality result when you give it smaller amounts of text to work on. This is opposite from some features, like key phrase extraction which performs better on larger blocks of text. 

To send an API request, you'll need your Language resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Language resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. Using the sentiment analysis and opinion mining features synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

[!INCLUDE [asynchronous-result-availability](../../includes/async-result-availability.md)]

## Getting sentiment analysis and opinion mining results

When you receive results from the API, the order of the returned key phrases is determined internally, by the model. You can stream the results to an application, or save the output to a file on the local system.

Sentiment analysis returns a sentiment label and confidence score for the entire document, and each sentence within it. Scores closer to 1 indicate a higher confidence in the label's classification, while lower scores indicate lower confidence. A document can have multiple sentences, and the confidence scores within each document or sentence add up to 1.

Opinion Mining will locate targets (nouns or verbs) in the text, and their associated assessment (adjective). For example, the sentence "*The restaurant had great food and our server was friendly*" has two targets: *food* and *server*. Each target has an assessment. For example, the assessment for *food* would be *great*, and the assessment for *server* would be *friendly*.

The API returns opinions as a target (noun or verb) and an assessment (adjective).

## Service and data limits

[!INCLUDE [service limits article](../../includes/service-limits-link.md)]

## See also

* [Sentiment analysis and opinion mining overview](../overview.md)
