---
title: Perform sentiment analysis with Text Analytics REST API
titleSuffix: Azure Cognitive Services
description: This article will show you how to detect sentiment in text with the Azure Cognitive Services Text Analytics REST API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: sample
ms.date: 03/09/2020
ms.author: aahi
---

# How to: Detect sentiment using the Text Analytics API

The Text Analytics API's Sentiment Analysis feature evaluates text and returns sentiment scores and labels for each sentence. This is useful for detecting positive and negative sentiment in social media, customer reviews, discussion forums and more. The AI models used by the API are provided by the service, you just have to send content for analysis.

> [!TIP]
> Text Analytics also provides a Linux-based Docker container image for language detection, so you can [install and run the Text Analytics container](text-analytics-how-to-install-containers.md) close to your data.

Sentiment Analysis supports a wide range of languages, with more in preview. For more information, see [Supported languages](../text-analytics-supported-languages.md).

## Concepts

The Text Analytics API uses a machine learning classification algorithm to generate a sentiment score between 0 and 1. Scores closer to 1 indicate positive sentiment, while scores closer to 0 indicate negative sentiment. Sentiment analysis is performed on the entire document, instead of individual entities in the text. This means sentiment scores are returned at a document or sentence level. 

The model used is pre-trained with an extensive corpus of text and sentiment associations. It utilizes a combination of techniques for analysis, including text processing, part-of-speech analysis, word placement, and word associations. For more information about the algorithm, see [Introducing Text Analytics](https://blogs.technet.microsoft.com/machinelearning/2015/04/08/introducing-text-analytics-in-the-azure-ml-marketplace/). Currently, it isn't possible to provide your own training data. 

There's a tendency for scoring accuracy to improve when documents contain fewer sentences rather than a large block of text. During an objectivity assessment phase, the model determines whether a document as a whole is objective or contains sentiment. A document that's mostly objective doesn't progress to the sentiment detection phase, which results in a 0.50 score, with no further processing. For documents that continue in the pipeline, the next phase generates a score above or below 0.50. The score depends on the degree of sentiment detected in the document.

## Sentiment Analysis versions and features

The Text Analytics API offers two versions of Sentiment Analysis - v2 and v3. Sentiment Analysis v3 (Public preview) provides significant improvements in the accuracy and detail of the API's text categorization and scoring.

> [!NOTE]
> * The Sentiment Analysis v3 request format and [data limits](../overview.md#data-limits) are the same as the previous version.
> * Sentiment Analysis v3 is available in the following regions: `Australia East`, `Central Canada`, `Central US`, `East Asia`, `East US`, `East US 2`, `North Europe`, `Southeast Asia`, `South Central US`, `UK South`, `West Europe`, and `West US 2`.

| Feature                                   | Sentiment Analysis v2 | Sentiment Analysis v3 |
|-------------------------------------------|-----------------------|-----------------------|
| Methods for single, and batch requests    | X                     | X                     |
| Sentiment scores for the entire document  | X                     | X                     |
| Sentiment scores for individual sentences |                       | X                     |
| Sentiment labeling                        |                       | X                     |
| Model versioning                   |                       | X                     |

#### [Version 3.0-preview](#tab/version-3)

### Sentiment scoring

Sentiment Analysis v3 classifies text with sentiment labels (described below). The returned scores represent the model's confidence that the text is either positive, negative, or neutral. Higher values signify higher confidence. 

### Sentiment labeling

Sentiment Analysis v3 can return scores and labels at a sentence and document level. The scores and labels are `positive`, `negative`, and `neutral`. At the document level, the `mixed` sentiment label also can be returned without a score. The sentiment of the document is determined below:

| Sentence sentiment                                                                            | Returned document label |
|-----------------------------------------------------------------------------------------------|-------------------------|
| At least one `positive` sentence is in the document. The rest of the sentences are `neutral`. | `positive`              |
| At least one `negative` sentence is in the document. The rest of the sentences are `neutral`. | `negative`              |
| At least one `negative` sentence and at least one `positive` sentence are in the document.    | `mixed`                 |
| All sentences in the document are `neutral`.                                                  | `neutral`               |

### Model versioning

> [!NOTE]
> Model versioning for sentiment analysis is available starting in version `v3.0-preview.1`.

[!INCLUDE [v3-model-versioning](../includes/model-versioning.md)]

### Example C# code

You can find an example C# application that calls this version of Sentiment Analysis on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/tree/master/dotnet/Language/TextAnalyticsSentiment.cs).


#### [Version 2.1](#tab/version-2)

### Sentiment scoring

The sentiment analyzer classifies text as predominantly positive or negative. It assigns a score in the range of 0 to 1. Values close to 0.5 are neutral or indeterminate. A score of 0.5 indicates neutrality. When a string can't be analyzed for sentiment or has no sentiment, the score is always 0.5 exactly. For example, if you pass in a Spanish string with an English language code, the score is 0.5.

---

## Sending a REST API request 

### Preparation

Sentiment analysis produces a higher-quality result when you give it smaller amounts of text to work on. This is opposite from key phrase extraction, which performs better on larger blocks of text. To get the best results from both operations, consider restructuring the inputs accordingly.

You must have JSON documents in this format: ID, text, and language.

Document size must be under 5,120 characters per document. You can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request.

## Structure the request

Create a POST request. You can [use Postman](text-analytics-how-to-call-api.md) or the **API testing console** in the following reference links to quickly structure and send one. 

#### [Version 3.0-preview](#tab/version-3)

[Sentiment Analysis v3 reference](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0-Preview-1/operations/Sentiment)

#### [Version 2.1](#tab/version-2)

[Sentiment Analysis v2 reference](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c9)

---

Set the HTTPS endpoint for sentiment analysis by using either a Text Analytics resource on Azure or an instantiated [Text Analytics container](text-analytics-how-to-install-containers.md). You must include the correct URL for the version you want to use. For example:

> [!NOTE]
> You can find your key and endpoint for your Text Analytics resource on the azure portal. They will be located on the resource's **Quick start** page, under **resource management**. 

#### [Version 3.0-preview](#tab/version-3)

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/sentiment`

#### [Version 2.1](#tab/version-2)

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v2.1/sentiment`

---

Set a request header to include your Text Analytics API key. In the request body, provide the JSON documents collection you prepared for this analysis.

### Example Sentiment Analysis request 

The following is an example of content you might submit for sentiment analysis. The request format is the same for both versions of the API.
    
```json
{
    "documents": [
    {
        "language": "en",
        "id": "1",
        "text": "Hello world. This is some input text that I love."
    },
    {
        "language": "en",
        "id": "2",
        "text": "It's incredibly sunny outside! I'm so happy."
    }
    ],
}
```

### Post the request

Analysis is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the [data limits](../overview.md#data-limits) section in the overview.

The Text Analytics API is stateless. No data is stored in your account, and results are returned immediately in the response.


### View the results

The sentiment analyzer classifies text as predominantly positive or negative. It assigns a score in the range of 0 to 1. Values close to 0.5 are neutral or indeterminate. A score of 0.5 indicates neutrality. When a string can't be analyzed for sentiment or has no sentiment, the score is always 0.5 exactly. For example, if you pass in a Spanish string with an English language code, the score is 0.5.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system. Then, import the output into an application that you can use to sort, search, and manipulate the data. Due to multilingual and emoji support, the response may contain text offsets. See [how to process offsets](../concepts/text-offsets.md) for more information.

#### [Version 3.0-preview](#tab/version-3)

### Sentiment Analysis v3 example response

Responses from Sentiment Analysis v3 contain sentiment labels and scores for each analyzed sentence and document. `documentScores` is not returned if the document sentiment label is `mixed`.

```json
{
    "documents": [
        {
            "id": "1",
            "sentiment": "positive",
            "documentScores": {
                "positive": 0.98570585250854492,
                "neutral": 0.0001625834556762,
                "negative": 0.0141316400840878
            },
            "sentences": [
                {
                    "sentiment": "neutral",
                    "sentenceScores": {
                        "positive": 0.0785155147314072,
                        "neutral": 0.89702343940734863,
                        "negative": 0.0244610067456961
                    },
                    "offset": 0,
                    "length": 12
                },
                {
                    "sentiment": "positive",
                    "sentenceScores": {
                        "positive": 0.98570585250854492,
                        "neutral": 0.0001625834556762,
                        "negative": 0.0141316400840878
                    },
                    "offset": 13,
                    "length": 36
                }
            ]
        },
        {
            "id": "2",
            "sentiment": "positive",
            "documentScores": {
                "positive": 0.89198976755142212,
                "neutral": 0.103382371366024,
                "negative": 0.0046278294175863
            },
            "sentences": [
                {
                    "sentiment": "positive",
                    "sentenceScores": {
                        "positive": 0.78401315212249756,
                        "neutral": 0.2067587077617645,
                        "negative": 0.0092281140387058
                    },
                    "offset": 0,
                    "length": 30
                },
                {
                    "sentiment": "positive",
                    "sentenceScores": {
                        "positive": 0.99996638298034668,
                        "neutral": 0.0000060341349126,
                        "negative": 0.0000275444017461
                    },
                    "offset": 31,
                    "length": 13
                }
            ]
        }
    ],
    "errors": []
}
```

#### [Version 2.1](#tab/version-2)

### Sentiment Analysis v2 example response

Responses from Sentiment Analysis v2 contain sentiment scores for each sent document.

```json
{
  "documents": [{
    "id": "1",
    "score": 0.98690706491470337
  }, {
    "id": "2",
    "score": 0.95202046632766724
  }],
  "errors": []
}
```

---

## Summary

In this article, you learned concepts and workflow for sentiment analysis using the Text Analytics API. In summary:

+ Sentiment Analysis is available for selected languages in two versions.
+ JSON documents in the request body include an ID, text, and language code.
+ The POST request is to a `/sentiment` endpoint by using a personalized [access key and an endpoint](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) that's valid for your subscription.
+ Response output, which consists of a sentiment score for each document ID, can be streamed to any app that accepts JSON. For example, Excel and Power BI.

## See also

* [Text Analytics overview](../overview.md)
* [Using the Text Analytics client library](../quickstarts/text-analytics-sdk.md)
* [What's new](../whats-new.md)
