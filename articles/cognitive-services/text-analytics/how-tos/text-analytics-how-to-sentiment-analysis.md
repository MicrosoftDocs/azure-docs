---
title: How-to sentiment analysis in Text Analytics REST API (Microsoft Cognitive Services on Azure) | Microsoft Docs
description: How to detect sentiment  using the Text Analytics REST API in Microsoft Cognitive Services on Azure in this walkthrough tutorial.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 08/26/2017
ms.author: heidist
---

# How to detect sentiment in Text Analytics

The [Sentiment Analysis API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) evaluates text input and returns a sentiment score for each document, ranging from 0 (negative) to 1 (positive).

This capability is useful for detecting positive and negative sentiment in social media, customer reviews, and discussion forums. Content is provided by you; models and training data are provided by the service.

Currently, Sentiment Analysis supports English, German, Spanish, and French. Other languages are in preview. For more information, see [Supported languages](../overview.md#supported-languages).

## Concepts

Text Analytics uses a machine learning classification techniques algorithm to generate a sentiment score between 0 and 1. Scores closer to 1 indicate positive sentiment, while scores closer to 0 indicate negative sentiment. The model is pretrained with an extensive body of text with sentiment associations. Currently, it is not possible to provide your own training data. The input features to the classifier include n-grams, features generated from part-of-speech tags, and embedded words.   

Sentiment analysis is performed on the entire document, as opposed to extracting sentiment for a particular entity in the text.

## Preparation

Sentiment analysis produces a higher quality result when you give it smaller chunks of text to work on. This is opposite from key phrase extraction, which performs better on larger blocks of text. To get the best results from both operations, consider restructuring the inputs accordingly.

You must have JSON documents in this format: id, text, language

Document size must be under 10 KB per document, and you can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request. The following is an example of content you might submit for sentiment analysis.

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

+ Create a **POST** request. Review the API documentation for this request: [Sentiment Analysis API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9)

+ Set the HTTP endpoint for key phrase extraction. It must include the `/sentiment` resource: `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment`

+ Set a request header to include the access key for Text Analytics operations. For more information, see [How to find endpoints and access keys](text-analytics-how-to-access-key.md).

+ In the request body, provide the JSON documents collection you prepared for this analysis.

> [!Tip]
> Use [Postman](text-analytics-how-to-call-api.md) or open the **API testing console** in the [documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) to structure the request and POST it to the service.

## Step 2: Post the request

Analysis is performed upon receipt of the request. The service accepts up to 100 requests per minute. Each request can be a maximum of 1 MB.

Recall that the service is stateless. No data is stored in your account. Results are returned immediately in the response.


## Step 3: Handle results

The sentiment analyzer classifies text as predominantly positive or negative, assigning a score in the range of 0 to 1. Values close to 0.5 are neutral or indeterminate. A score of 0.5 indicates neutrality. When a string cannot be analyzed for sentiment or has no sentiment, the score is always 0.5 exactly. For example, if you pass in a Spanish string with an English language code, the score is 0.5.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort, search, and manipulate the data.

The response includes a sentiment score between 0.0 (negative) and 1.0 (positive) to indicate relative sentiment.

```
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

## Summary

In this article, you learned concepts and workflow for sentiment analysis using Text Analytics in Cognitive Services. In summary:

+ [Sentiment analysis API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) is available for selected languages.
+ JSON documents in the request body include an id, text, and language code.
+ POST request is to a `/sentiment` endpoint, using a personalized [access key and an endpoint](text-analytics-how-to-access-key.md) that is valid for your subscription.
+ Response output, which consists of a sentiment score for each document ID, can be streamed to any app that accepts JSON, including Excel and Power BI, to name a few.

## See also 

 [Text Analytics overview](../overview.md)  
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)</br>
 [Text Analytics product page](//go.microsoft.com/fwlink/?LinkID=759712) 

## Next steps

> [!div class="nextstepaction"]
> [Extract keywords](text-analytics-how-to-keyword-extraction.md)
