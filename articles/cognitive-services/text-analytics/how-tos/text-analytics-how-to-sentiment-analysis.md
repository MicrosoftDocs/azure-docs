---
title: Perform sentiment analysis and opinion mining with Text Analytics REST API
titleSuffix: Azure Cognitive Services
description: This article will show you how to detect sentiment, and mine for opinions in text with the Azure Cognitive Services Text Analytics API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: sample
ms.date: 03/09/2021
ms.author: aahi
---

# How to: Sentiment analysis and Opinion Mining

The Text Analytics API's Sentiment Analysis feature provides two ways for detecting positive and negative sentiment. If you send a Sentiment Analysis request, the API will return sentiment labels (such as "negative", "neutral" and "positive") and confidence scores at the sentence and document-level. You can also send Opinion Mining requests using the Sentiment Analysis endpoint, which provides granular information about the opinions related to words (such as the attributes of products or services) in the text. 

The AI models used by the API are provided by the service, you just have to send content for analysis.

## Sentiment Analysis versions and features

| Feature                                   | Sentiment Analysis v3 | Sentiment Analysis v3.1 (Preview) |
|-------------------------------------------|-----------------------|-----------------------------------|
| Methods for single, and batch requests    | X                     | X                                 |
| Sentiment Analysis scores and labeling             | X                     | X                                 |
| Linux-based [Docker container](text-analytics-how-to-install-containers.md) | X  |  |
| Opinion Mining                            |                       | X                                 |

## Sentiment Analysis

Sentiment Analysis in version 3.x applies sentiment labels to text, which are returned at a sentence and document level, with a confidence score for each. 

The labels are *positive*, *negative*, and *neutral*. At the document level, the *mixed* sentiment label also can be returned. The sentiment of the document is determined below:

| Sentence sentiment                                                                            | Returned document label |
|-----------------------------------------------------------------------------------------------|-------------------------|
| At least one `positive` sentence is in the document. The rest of the sentences are `neutral`. | `positive`              |
| At least one `negative` sentence is in the document. The rest of the sentences are `neutral`. | `negative`              |
| At least one `negative` sentence and at least one `positive` sentence are in the document.    | `mixed`                 |
| All sentences in the document are `neutral`.                                                  | `neutral`               |

Confidence scores range from 1 to 0. Scores closer to 1 indicate a higher confidence in the label's classification, while lower scores indicate lower confidence. For each document or each sentence, the predicted scores associated with the labels (positive, negative and neutral) add up to 1. For more information, see the [Text Analytics transparency note](/legal/cognitive-services/text-analytics/transparency-note?context=/azure/cognitive-services/text-analytics/context/context). 

## Opinion Mining

Opinion Mining is a feature of Sentiment Analysis, starting in the preview of version 3.1. Also known as Aspect-based Sentiment Analysis in Natural Language Processing (NLP), this feature provides more granular information about the opinions related to attributes of products or services in text. The API surfaces opinions as a target (noun or verb) and an assessment (adjective).

For example, if a customer leaves feedback about a hotel such as "The room was great, but the staff was unfriendly.", Opinion Mining will locate targets (aspects) in the text, and their associated assessments (opinions) and sentiments. Sentiment Analysis might only report a negative sentiment.

:::image type="content" source="../media/how-tos/opinion-mining.png" alt-text="A diagram of the Opinion Mining example" lightbox="../media/how-tos/opinion-mining.png":::

To get Opinion Mining in your results, you must include the `opinionMining=true` flag in a request for sentiment analysis. The Opinion Mining results will be included in the sentiment analysis response. Opinion mining is an extension of Sentiment Analysis and is included in your current [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/).


## Sending a REST API request 

### Preparation

Sentiment analysis produces a higher-quality result when you give it smaller amounts of text to work on. This is opposite from key phrase extraction, which performs better on larger blocks of text. To get the best results from both operations, consider restructuring the inputs accordingly.

You must have JSON documents in this format: ID, text, and language. Sentiment Analysis supports a wide range of languages, with more in preview. For more information, see [Supported languages](../language-support.md).

Document size must be under 5,120 characters per document. For the maximum number of documents permitted in a collection, see the [data limits](../concepts/data-limits.md?tabs=version-3) article under Concepts. The collection is submitted in the body of the request.

## Structure the request

Create a POST request. You can [use Postman](text-analytics-how-to-call-api.md) or the **API testing console** in the following reference links to quickly structure and send one. 

#### [Version 3.1-preview](#tab/version-3-1)

[Sentiment Analysis v3.1 reference](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-preview-3/operations/Sentiment)

#### [Version 3.0](#tab/version-3)

[Sentiment Analysis v3 reference](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/Sentiment)

---

### Request endpoints

Set the HTTPS endpoint for sentiment analysis by using either a Text Analytics resource on Azure or an instantiated [Text Analytics container](text-analytics-how-to-install-containers.md). You must include the correct URL for the version you want to use. For example:

> [!NOTE]
> You can find your key and endpoint for your Text Analytics resource on the Azure portal. They will be located on the resource's **Quick start** page, under **resource management**. 

#### [Version 3.1-preview](#tab/version-3-1)

**Sentiment Analysis**

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.4/sentiment`

**Opinion Mining**

To get Opinion Mining results, you must include the `opinionMining=true` parameter. For example:

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.4/sentiment?opinionMining=true`

This parameter is set to `false` by default. 

#### [Version 3.0](#tab/version-3)

**Sentiment Analysis**

In v3.0, the only available endpoint is for Sentiment Analysis.
 
`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0/sentiment`

---

Set a request header to include your Text Analytics API key. In the request body, provide the JSON documents collection you prepared for this analysis.

### Example request for Sentiment Analysis and Opinion Mining  

The following is an example of content you might submit for sentiment analysis. The request format is the same for both `v3.0` and `v3.1-preview`.
    
```json
{
  "documents": [
    {
      "language": "en",
      "id": "1",
      "text": "The restaurant had great food and our waiter was friendly."
    }
  ]
}
```

### Post the request

Analysis is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the [data limits](../overview.md#data-limits) section in the overview.

The Text Analytics API is stateless. No data is stored in your account, and results are returned immediately in the response.


### View the results

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system. Then, import the output into an application that you can use to sort, search, and manipulate the data. Due to multilingual and emoji support, the response may contain text offsets. See [how to process offsets](../concepts/text-offsets.md) for more information.

#### [Version 3.1-preview](#tab/version-3-1)

### Sentiment Analysis and Opinion Mining example response

> [!IMPORTANT]
> The following is a JSON example for using Opinion Mining with Sentiment Analysis, offered in v3.1 of the API. If you don't request Opinion mining, the API response will be the same as the **Version 3.0** tab.  

Sentiment Analysis v3.1 can return response objects for both Sentiment Analysis and Opinion Mining.
  
Sentiment analysis returns a sentiment label and confidence score for the entire document, and each sentence within it. Scores closer to 1 indicate a higher confidence in the label's classification, while lower scores indicate lower confidence. A document can have multiple sentences, and the confidence scores within each document or sentence add up to 1. assessments 

Opinion Mining will locate targets (nouns or verbs) in the text, and their associated assessment (adjective). In the below response, the sentence *The restaurant had great food and our waiter was friendly* has two targets: *food* and *waiter*. Each target's `relations` property contains a `ref` value with the URI-reference to the associated `documents`, `sentences`, and `assessments` objects.

The API returns opinions as a target (noun or verb) and an assessment (adjective).

```json
{
  "documents": [
    {
      "id": "1",
      "sentiment": "positive",
      "confidenceScores": {
        "positive": 1,
        "neutral": 0,
        "negative": 0
      },
      "sentences": [
        {
          "sentiment": "positive",
          "confidenceScores": {
            "positive": 1,
            "neutral": 0,
            "negative": 0
          },
          "offset": 0,
          "length": 58,
          "text": "The restaurant had great food and our waiter was friendly.",
          "targets": [
            {
              "sentiment": "positive",
              "confidenceScores": {
                "positive": 1,
                "negative": 0
              },
              "offset": 25,
              "length": 4,
              "text": "food",
              "relations": [
                {
                  "relationType": "assessment",
                  "ref": "#/documents/0/sentences/0/assessments/0"
                }
              ]
            },
            {
              "sentiment": "positive",
              "confidenceScores": {
                "positive": 1,
                "negative": 0
              },
              "offset": 38,
              "length": 6,
              "text": "waiter",
              "relations": [
                {
                  "relationType": "assessment",
                  "ref": "#/documents/0/sentences/0/assessments/1"
                }
              ]
            }
          ],
          "assessments": [
            {
              "sentiment": "positive",
              "confidenceScores": {
                "positive": 1,
                "negative": 0
              },
              "offset": 19,
              "length": 5,
              "text": "great",
              "isNegated": false
            },
            {
              "sentiment": "positive",
              "confidenceScores": {
                "positive": 1,
                "negative": 0
              },
              "offset": 49,
              "length": 8,
              "text": "friendly",
              "isNegated": false
            }
          ]
        }
      ],
      "warnings": []
    }
  ],
  "errors": [],
  "modelVersion": "2020-04-01"
}
```

#### [Version 3.0](#tab/version-3)

### Sentiment Analysis example response

Sentiment analysis returns a sentiment label and confidence score for the entire document, and each sentence within it. Scores closer to 1 indicate a higher confidence in the label's classification, while lower scores indicate lower confidence. A document can have multiple sentences, and the confidence scores within each document or sentence add up to 1.

Responses from Sentiment Analysis v3 contain sentiment labels and scores for each analyzed sentence and document.

```json
{
    "documents": [
        {
            "id": "1",
            "sentiment": "positive",
            "confidenceScores": {
                "positive": 1.0,
                "neutral": 0.0,
                "negative": 0.0
            },
            "sentences": [
                {
                    "sentiment": "positive",
                    "confidenceScores": {
                        "positive": 1.0,
                        "neutral": 0.0,
                        "negative": 0.0
                    },
                    "offset": 0,
                    "length": 58,
                    "text": "The restaurant had great food and our waiter was friendly."
                }
            ],
            "warnings": []
        }
    ],
    "errors": [],
    "modelVersion": "2020-04-01"
}
```

---

## Summary

In this article, you learned concepts and workflow for sentiment analysis using the Text Analytics API. In summary:

+ Sentiment Analysis and Opinion Mining is available for select languages.
+ JSON documents in the request body include an ID, text, and language code.
+ The POST request is to a `/sentiment` endpoint by using a personalized [access key and an endpoint](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) that's valid for your subscription.
+ Use `opinionMining=true` in Sentient Analysis requests to get Opinion Mining results.
+ Response output, which consists of a sentiment score for each document ID, can be streamed to any app that accepts JSON. For example, Excel and Power BI.

## See also

* [Text Analytics overview](../overview.md)
* [Using the Text Analytics client library](../quickstarts/client-libraries-rest-api.md)
* [What's new](../whats-new.md)
