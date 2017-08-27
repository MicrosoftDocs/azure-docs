---
title: How-to keyword extraction in Text Analytics REST API (Microsoft Cognitive Services on Azure) | Microsoft Docs
description: How to extract key phrases using the Text Analytics REST API in Microsoft Cognitive Services on Azure in this walkthrough tutorial.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 08/26/2017
ms.author: heidist
---

# How to extract keywords in Text Analytics

The [key phrase extraction API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) evaluates unstructured text, and for each JSON document, returns a list of keywords or phrases, and a score indicating the strength of the analysis. 

This capability is useful if you need to quickly identify the main points in a collection of documents. For example, given input text "The food was delicious and there were wonderful staff", the service returns the main talking points: "food" and "wonderful staff".

Currently, the following languages are supported for production workloads: English, German, Spanish, and Japanese. Other languages are in preview. For more information, see [Supported languages](overview.md#supported-languages).

## Concepts

Key words or phrases are identified by a process of elimination. This analyzer finds and discards non-essential words, and keeps single terms or phrases that appear to be the subject or object of a sentence. Once the text is paired down, the model calculates the probability of certain word combinations, elevating the rank of those combinations more likely to be found in common use. For this reason, you might find that adjectives or adverbs that appear by themselves are not flagged for extraction, even they seem interesting or important in the content.

## Preparation

You must have JSON documents in this format: id, text, language

Document size is Under 10 KB per document.

The collection is submitted in the body of the request.

Key phrase extraction produces higher quality results when you give it bigger chunks of text to work on. This is opposite from sentiment analysis, which performs better on smaller blocks of text. To get the best results of both operations, consider restructuring the inputs accordingly.

## Step 1: Structure the request

Entire request must be under 1 MB.

You can send up to 100 requests per minute.

Create a **Post** request. Review the API documentation for this request: [Key Phrases API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6)

Create the HTTP endpoint for key phrase extraction. It must include the `/keyphrases` resource: `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases`

Get the access key that allows your subscription to access Text Analytics operations.

For more information on how to find a valid endpoint for your subscription, see [How to find endpoints and access keys](text-analytics-howto-accesskey.md).

Request headers:

   + `Ocp-Apim-Subscription-Key` set to your access key, obtained from Azure portal.
   + `Content-Type` set to application/json.
   + `Accept` set to application/json.

     Your request should look similar to the following screenshot:

   ![Request screenshot with endpoint and headers](../media/text-analytics/postman-request-keyphrase-1.png)

## Step 2: Structure the request body

1. Click **Body** and choose **raw** for the format.

   ![Request screenshot with body settings](../media/text-analytics/postman-request-body-raw.png)

2. Paste in some JSON documents: 

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
                "text": "Me encanta este sendero. Tiene hermosas vistas y muchos lugares para detenerse y descansar"
            }
        ]
    }
```

> [!Note]
> A Spanish string is included to demonstrate [language detection](#detect-language) and other behaviors, described in a following section. It is incorrectly tagged as `en` to demonstrate the effects of setting the wrong language.

### About the request body

Input rows must be JSON in raw unstructured text. XML is not supported. The schema is simple, consisting of the elements described in the following list. You can use the same documents for all three operations: sentiment, key phrase, and language detection.

+ `id` is required. The data type is string, but in practice document IDs tend to be integers. The system uses the IDs you provide to structure the output. Language codes, keywords, and sentiment scores are generated for each ID.

+ `text` field is requred and contains unstructured raw text, up to 10 KB. For more information about limits, see [Text Analytics Overview > Data limits](overview.md#data-limits). 

+ `language` is used only in sentiment analysis and key phrase extraction. It is ignored in language detection. 

> [!Note]
> For both sentiment analysis and key phrase extraction, `language` is an optional parameter. If `language` is wrong, results of the analysis might be incorrect or suboptimal. If `language` is missing, the system performs language detection prior to sentiment or key phrase analysis. This can slow down operations. For this reason, we recommend including an accurate language code in the request, assuming you know what it is. For more information about which languages are supported, see [Text Analytics Overview > Supported Languages](overview.md#supported-languages).


## Step 3: Post the request

1. Compare the screenshots against your tool to verify the request is configured correctly.

2. Click **Send** to submit the request.

All POST requests return a JSON formatted response with the IDs and detected properties. An example of the output for key phrase extraction is shown next:

```
{
    "documents": [
        {
            "keyPhrases": [
                "year",
                "trail",
                "trip",
                "views"
            ],
            "id": "1"
        },
        {
            "keyPhrases": [
                "Worst hike",
                "trails",
                "goners"
            ],
            "id": "2"
        },
        {
            "keyPhrases": [
                "family",
                "trail",
                "us",
                "small children"
            ],
            "id": "3"
        },
        {
            "keyPhrases": [
                "spectacular views",
                "trail",
                "Worth",
                "area"
            ],
            "id": "4"
        },
        {
            "keyPhrases": [
                "Tiene hermosas vistas y muchos lugares para detenerse y descansar",
                "encanta este sendero"
            ],
            "id": "5"
        }
    ],
    "errors": []
}
```

## Step 4: Review results

Comparing inputs and outputs side by side helps us understand key phrase extraction operations. The analyzer finds and discards non-essential words, and keeps single terms or phrases that appear to be the subject or object of a sentence. 

| ID | Input | key phrase output | 
|----|-------|------|
| 1 | "We love this trail and make the trip every year. The views are breathtaking and well worth the hike!" | "year", "trail", "trip", "views"" |
| 2 | "Poorly marked trails! I thought we were goners. Worst hike ever." | "Worst hike",  "trails", "goners" |
| 3 | "Everyone in my family liked the trail but thought it was too challenging for the less athletic among us. Not necessarily recommended for small children." | "family", "trail", "us", "small children"|
| 4 | "It was foggy so we missed the spectacular views, but the trail was ok. Worth checking out if you are in the area." | "spectacular views", "trail", "Worth", "area" |
| 5 | ""Me encanta este sendero. Tiene hermosas vistas y muchos lugares para detenerse y descansar" | "Tiene hermosas vistas y muchos lugares para detenerse y descansar", "encanta este sendero"|

## Summary

In this article, you learned concepts and workflow for key phrase extraction using Text Analytics in Cognitive Services. The following are a quick reminder of the main points previously explained and demonstrated:

+ [Key phrase extraction API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) is available for selected languages.
+ JSON documents in the request body include an id, text, and language code.
+ POST request is to a `/keyphrases` endpoint, using a personalized [access key and an endpoint](text-analytics-howto-acccesskey.md) that is valid for your subscription.
+ Response output, which consists of key words and phrases for each document ID, can be streamed to any app that accepts JSON, including Excel and Power BI, to name a few.

## Next steps

+ [Quickstart](quick-start.md) is a walk through of the REST API calls written in C#. Learn how to submit text, choose an analysis, and view results with minimal code.

+ [API reference documentation](//go.microsoft.com/fwlink/?LinkID=759346) provides the technical documentation for the APIs. Documentation embeds interactive requests so that you can call the API from each documentation page.

+ [External & Community Content](text-analytics-resource-external-community.md) provides a list of blog posts and videos demonstrating how to use Text Analytics with other tools and technologies.

+ To see how the Text Analytics API can be used as part of a bot, see the [Emotional Bot](http://docs.botframework.com/bot-intelligence/language/#example-emotional-bot) example on the Bot Framework site.


## See also 

 [Text Analytics overview](overview.md)  
 [Frequently asked questions (FAQ)](text-analytics-resource-faq.md)
 [Text Analytics product page](//go.microsoft.com/fwlink/?LinkID=759712) 