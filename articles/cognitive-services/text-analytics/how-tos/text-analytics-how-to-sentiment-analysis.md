---
title: Sentiment analysis using the Text Analytics from Azure Cognitive Services | Microsoft Docs
description: Learn how to detect sentiment using the Text Analytics REST API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: sample
ms.date: 02/26/2019
ms.author: aahi
---

# Example: How to detect sentiment with Text Analytics

The [Sentiment Analysis API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c9) evaluates text input and returns a sentiment score for each document, ranging from 0 (negative) to 1 (positive).

This capability is useful for detecting positive and negative sentiment in social media, customer reviews, and discussion forums. Content is provided by you; models and training data are provided by the service.

Currently, Sentiment Analysis supports English, German, Spanish, and French. Other languages are in preview. For more information, see [Supported languages](../text-analytics-supported-languages.md).

> [!TIP]
> Text Analytics also provides a Linux-based Docker container image for sentiment analysis, so you can [install and run the Text Analytics container](text-analytics-how-to-install-containers.md) close to your data.

## Concepts

Text Analytics uses a machine learning classification algorithm to generate a sentiment score between 0 and 1. Scores closer to 1 indicate positive sentiment, while scores closer to 0 indicate negative sentiment. The model is pretrained with an extensive body of text with sentiment associations. Currently, it is not possible to provide your own training data. The model uses a combination of techniques during text analysis, including text processing, part-of-speech analysis, word placement, and word associations. For more information about the algorithm, see [Introducing Text Analytics](https://blogs.technet.microsoft.com/machinelearning/2015/04/08/introducing-text-analytics-in-the-azure-ml-marketplace/).

Sentiment analysis is performed on the entire document, as opposed to extracting sentiment for a particular entity in the text. In practice, there is a tendency for scoring accuracy to improve when documents contain one or two sentences rather than a large block of text. During an objectivity assessment phase, the model determines whether a document as a whole is objective or contains sentiment. A document that is mostly objective does not progress to the sentiment detection phrase, resulting in a .50 score, with no further processing. For documents continuing in the pipeline, the next phase generates a score above or below .50, depending on the degree of sentiment detected in the document.

## Preparation

Sentiment analysis produces a higher quality result when you give it smaller chunks of text to work on. This is opposite from key phrase extraction, which performs better on larger blocks of text. To get the best results from both operations, consider restructuring the inputs accordingly.

You must have JSON documents in this format: ID, text, language

Document size must be under 5,120 characters per document, and you can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request. The following is an example of content you might submit for sentiment analysis.

```
    {
        "documents": [
            {
                "language": "en",
                "id": "1",
                "text": "We love this trail and make the trip every year. The views are breathtaking and well worth the hike!"
            },
            {
                "language": "en",
                "id": "2",
                "text": "Poorly marked trails! I thought we were goners. Worst hike ever."
            },
            {
                "language": "en",
                "id": "3",
                "text": "Everyone in my family liked the trail but thought it was too challenging for the less athletic among us. Not necessarily recommended for small children."
            },
            {
                "language": "en",
                "id": "4",
                "text": "It was foggy so we missed the spectacular views, but the trail was ok. Worth checking out if you are in the area."
            },                
            {
                "language": "en",
                "id": "5",
                "text": "This is my favorite trail. It has beautiful views and many places to stop and rest"
            }
        ]
    }
```

## Step 1: Structure the request

Details on request definition can be found in [How to call the Text Analytics API](text-analytics-how-to-call-api.md). The following points are restated for convenience:

+ Create a **POST** request. Review the API documentation for this request: [Sentiment Analysis API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c9)

+ Set the HTTP endpoint for sentiment analysis, using either a Text Analytics resource on Azure or an instantiated [Text Analytics container](text-analytics-how-to-install-containers.md). It must include the `/sentiment` resource: `https://westus.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment`

+ Set a request header to include the access key for Text Analytics operations. For more information, see [How to find endpoints and access keys](text-analytics-how-to-access-key.md).

+ In the request body, provide the JSON documents collection you prepared for this analysis.

> [!Tip]
> Use [Postman](text-analytics-how-to-call-api.md) or open the **API testing console** in the [documentation](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c9) to structure the request and POST it to the service.

## Step 2: Post the request

Analysis is performed upon receipt of the request. See the [data limits](../overview.md#data-limits) section in the overview for information on the size and number of requests you can send per minute and second.

Recall that the service is stateless. No data is stored in your account. Results are returned immediately in the response.


## Step 3: View results

The sentiment analyzer classifies text as predominantly positive or negative, assigning a score in the range of 0 to 1. Values close to 0.5 are neutral or indeterminate. A score of 0.5 indicates neutrality. When a string cannot be analyzed for sentiment or has no sentiment, the score is always 0.5 exactly. For example, if you pass in a Spanish string with an English language code, the score is 0.5.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort, search, and manipulate the data.

The following example shows the response for the document collection in this article.

```json
{
    "documents": [
        {
            "score": 0.9999237060546875,
            "id": "1"
        },
        {
            "score": 0.0000540316104888916,
            "id": "2"
        },
        {
            "score": 0.99990355968475342,
            "id": "3"
        },
        {
            "score": 0.980544924736023,
            "id": "4"
        },
        {
            "score": 0.99996328353881836,
            "id": "5"
        }
    ],
    "errors": []
}
```

## Sentiment analysis V3 public preview

The [next version of Sentiment Analysis](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0-preview/operations/56f30ceeeda5650db055a3c9) is now available for Public Preview, providing significant improvements in the accuracy and detail of the API's text categorization and scoring. 

> [!NOTE]
> * The sentiment analysis v3 request format and [data limits](../overview.md#data-limits) are the same as the previous version.
> * At this time, Sentiment analysis V3: 
>    * Currently only supports the English language.  
>    * Is available in the following regions: `Central US`, `Central Canada`, `East Asia` 

|Feature |Description  |
|---------|---------|
|Improved accuracy     | Significant improvement in detecting positive, neutral, negative, and mixed sentiment in text documents over previous versions.           |
|Document and Sentence-level Sentiment Score     | Detect the sentiment of both a document and its individual sentences. If the document includes multiple sentences, each sentence is also assigned a sentiment score.         |
|Sentiment category and score     | The API now returns sentiment categories (`positive`, `negative`, `neutral` and `mixed`) for text, in addition to a sentiment score.        |
| Improved output | Sentiment analysis now returns information for both an entire text document, and its individual sentences. |

### Sentiment labeling

Sentiment analysis V3 can return scores and labels (`positive`, `negative`, and `neutral`) at a sentence and document level. At the document level the `mixed` sentiment label (not score) can also be returned. The sentiment of the document is determined by aggregating its sentences' scores.

| Sentence sentiment                                                        | Returned document label |
|---------------------------------------------------------------------------|----------------|
| At least one positive sentence and the rest of the sentences are neutral. | `positive`     |
| At least one negative sentence and the rest of the sentences are neutral.  | `negative`     |
| At least one negative sentence and at least one positive sentence.         | `mixed`        |
| All sentences are neutral.                                                 | `neutral`      |

### Sentiment analysis V3 example request

The following JSON is an example of a request made to the new version of sentiment analysis. Note that the request formatting is the same as the previous version:

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
  ]
}
```

### Sentiment analysis V3 example response

While the request format is the same as the previous version, the response format has changed. The following JSON is an example response from the new version of the API:

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

### Example C# code

You can find an example C# application that calls this version of sentiment analysis on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/tree/master/dotnet/Language/SentimentV3.cs).

## Summary

In this article, you learned concepts and workflow for sentiment analysis using Text Analytics in Cognitive Services. In summary:

+ [Sentiment analysis API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c9) is available for selected languages.
+ JSON documents in the request body include an ID, text, and language code.
+ POST request is to a `/sentiment` endpoint, using a personalized [access key and an endpoint](text-analytics-how-to-access-key.md) that is valid for your subscription.
+ Response output, which consists of a sentiment score for each document ID, can be streamed to any app that accepts JSON, including Excel and Power BI, to name a few.

## See also 

 [Text Analytics overview](../overview.md)  
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)</br>
 [Text Analytics product page](//go.microsoft.com/fwlink/?LinkID=759712) 

## Next steps

> [!div class="nextstepaction"]
> [Extract key phrases](text-analytics-how-to-keyword-extraction.md)
