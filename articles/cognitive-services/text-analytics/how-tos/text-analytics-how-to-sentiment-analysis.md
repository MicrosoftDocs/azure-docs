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
ms.date: 04/15/2020
ms.author: aahi
---

# How to: Detect sentiment using the Text Analytics API

The Text Analytics API's Sentiment Analysis feature evaluates text and returns sentiment scores and labels for each sentence. This is useful for detecting positive and negative sentiment in social media, customer reviews, discussion forums and more. The AI models used by the API are provided by the service, you just have to send content for analysis.

After sending a sentiment analysis request, the API returns sentiment labels (such as "negative", "neutral" and "positive") and confidence scores at the sentence and document-level.

> [!NOTE]
> * The Text Analytics API offers multiple versions of Sentiment Analysis. This article only covers versions 3.0 and 3.1.
>   * v3.1 offers a public preview of [opinion mining](#opinion-mining).
> * There is a Linux-based Docker container image that you can use on-premises. See [install and run the Text Analytics container](text-analytics-how-to-install-containers.md) for more information.
> * Sentiment Analysis v3 is available in the following regions: `Australia East`, `Central Canada`, `Central US`, `East Asia`, `East US`, `East US 2`, `North Europe`, `Southeast Asia`, `South Central US`, `UK South`, `West Europe`, and `West US 2`.

Sentiment Analysis supports a wide range of languages, with more in preview. For more information, see [Supported languages](../text-analytics-supported-languages.md).

## Sentiment Analysis versions and features

| Feature                                   | Sentiment Analysis v3 | Sentiment Analysis v3.1 (Preview) |
|-------------------------------------------|-----------------------|-----------------------------------|
| Methods for single, and batch requests    | X                     | X                                 |
| Sentiment scores and labeling             | X                     | X                                 |
| Opinion mining                            |                       | X                                 |

### Sentiment scoring and labeling

Sentiment Analysis in v3 applies sentiment labels to text, which are returned at a sentence and document level, with a confidence score for each. 

The labels are `positive`, `negative`, and `neutral`. At the document level, the `mixed` sentiment label also can be returned without a score. The sentiment of the document is determined below:

| Sentence sentiment                                                                            | Returned document label |
|-----------------------------------------------------------------------------------------------|-------------------------|
| At least one `positive` sentence is in the document. The rest of the sentences are `neutral`. | `positive`              |
| At least one `negative` sentence is in the document. The rest of the sentences are `neutral`. | `negative`              |
| At least one `negative` sentence and at least one `positive` sentence are in the document.    | `mixed`                 |
| All sentences in the document are `neutral`.                                                  | `neutral`               |

Confidence scores range from 1 to 0. Scores closer to 1 indicate a higher confidence in the label's classification, while lower scores indicate lower confidence. A document can have multiple sentences, and the confidence scores within each document or sentence add up to 1.

### Opinion mining

Opinion mining is a feature of Sentiment Analysis, starting in version 3.1. Also known as Aspect-based Sentiment Analysis in Natural Language Processing (NLP), this feature provides more granular information about the opinions related to aspects (such as the attributes of products or services) in text.

For example, if a customer leaves feedback about a hotel such as "the room was great, but the staff was unfriendly", opinion mining will locate aspects in the text, and their associated opinions and sentiments:

| Aspect | Opinion    | Sentiment |
|--------|------------|-----------|
| room   | great      | positive  |
| staff  | unfriendly | negative  |

To get opinion mining in your results, you must include the `TBD` flag in a request for sentiment analysis. The opinion mining results will be included in the sentiment analysis response.

## Sending a REST API request 

### Preparation

Sentiment analysis produces a higher-quality result when you give it smaller amounts of text to work on. This is opposite from key phrase extraction, which performs better on larger blocks of text. To get the best results from both operations, consider restructuring the inputs accordingly.

You must have JSON documents in this format: ID, text, and language.

Document size must be under 5,120 characters per document. You can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request.

## Structure the request

Create a POST request. You can [use Postman](text-analytics-how-to-call-api.md) or the **API testing console** in the following reference links to quickly structure and send one. 

#### [Version 3.0](#tab/version-3)

[Sentiment Analysis v3 reference](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0-Preview-1/operations/Sentiment)

#### [Version 3.1-preview](#tab/version-3-1)

[Sentiment Analysis v3.1 reference](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c9)

---

### Request endpoints

Set the HTTPS endpoint for sentiment analysis by using either a Text Analytics resource on Azure or an instantiated [Text Analytics container](text-analytics-how-to-install-containers.md). You must include the correct URL for the version you want to use. For example:

> [!NOTE]
> You can find your key and endpoint for your Text Analytics resource on the azure portal. They will be located on the resource's **Quick start** page, under **resource management**. 

#### [Version 3.0](#tab/version-3)

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0/sentiment`

#### [Version 3.1-preview](#tab/version-3-1)

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/sentiment`

To get opinion mining results, you must include the `TBD` parameter. For example:

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1/sentiment?TBD`

---

Set a request header to include your Text Analytics API key. In the request body, provide the JSON documents collection you prepared for this analysis.

### Example Sentiment Analysis request 

The following is an example of content you might submit for sentiment analysis. 

#### [Version 3.0](#tab/version-3)
    
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

#### [Version 3.1-preview](#tab/version-3-1)

```json
TBD
```

---

### Post the request

Analysis is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the [data limits](../overview.md#data-limits) section in the overview.

The Text Analytics API is stateless. No data is stored in your account, and results are returned immediately in the response.


### View the results

Sentiment analysis returns a sentiment label and confidence score for the entire document, and each sentence within it. Scores closer to 1 indicate a higher confidence in the label's classification, while lower scores indicate lower confidence. A document can have multiple sentences, and the confidence scores within each document or sentence add up to 1.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system. Then, import the output into an application that you can use to sort, search, and manipulate the data. Due to multilingual and emoji support, the response may contain text offsets. See [how to process offsets](../concepts/text-offsets.md) for more information.

#### [Version 3.0](#tab/version-3)

### Sentiment Analysis v3.0 example response

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

#### [Version 3.1-preview](#tab/version-3-1)

### Sentiment Analysis v3.1 example response

> [!NOTE]
> The following example response includes output for opinion mining.

```json
TBD
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
