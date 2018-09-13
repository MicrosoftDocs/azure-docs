---
title: 'Example: How to extract key phrases in Text Analytics'
titleSuffix: Azure Cognitive Services
description: Learn how to extract key phrases using the Text Analytics REST API.
services: cognitive-services
author: HeidiSteen

manager: cgronlun
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: sample
ms.date: 09/12/2018
ms.author: heidist
---

# Example: How to extract key phrases in Text Analytics

The [Key Phrase Extraction API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) evaluates unstructured text, and for each JSON document, returns a list of key phrases. 

This capability is useful if you need to quickly identify the main points in a collection of documents. For example, given input text "The food was delicious and there were wonderful staff", the service returns the main talking points: "food" and "wonderful staff".

Currently, Key Phrase Extraction supports English, German, Spanish, and Japanese. Other languages are in preview. For more information, see [Supported languages](../text-analytics-supported-languages.md).

## Preparation

Key phrase extraction works best when you give it bigger chunks of text to work on. This is opposite from sentiment analysis, which performs better on smaller blocks of text. To get the best results from both operations, consider restructuring the inputs accordingly.

You must have JSON documents in this format: id, text, language

Document size must be under 5,000 characters per document, and you can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request. The following example is an illustration of content you might submit for key phrase extraction.

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

+ Create a **POST** request. Review the API documentation for this request: [Key Phrases API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6)

+ Set the HTTP endpoint for key phrase extraction. It must include the `/keyphrases` resource: `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases`

+ Set a request header to include the access key for Text Analytics operations. For more information, see [How to find endpoints and access keys](text-analytics-how-to-access-key.md).

+ In the request body, provide the JSON documents collection you prepared for this analysis

> [!Tip]
> Use [Postman](text-analytics-how-to-call-api.md) or open the **API testing console** in the [documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) to structure a request and POST it to the service.

## Step 2: Post the request

Analysis is performed upon receipt of the request. The service accepts up to 100 requests per minute. Each request can be a maximum of 1 MB.

Recall that the service is stateless. No data is stored in your account. Results are returned immediately in the response.

## Step 3: View results

All POST requests return a JSON formatted response with the IDs and detected properties.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort, search, and manipulate the data.

An example of the output for key phrase extraction is shown next:

```
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
                "marked trails",
                "Worst hike",
                "goners"
            ],
            "id": "2"
        },
        {
            "keyPhrases": [
                "trail",
                "small children",
                "family"
            ],
            "id": "3"
        },
        {
            "keyPhrases": [
                "spectacular views",
                "trail",
                "area"
            ],
            "id": "4"
        },
        {
            "keyPhrases": [
                "places",
                "beautiful views",
                "favorite trail"
            ],
            "id": "5"
        }
```

As noted, the analyzer finds and discards non-essential words, and keeps single terms or phrases that appear to be the subject or object of a sentence. 

## Summary

In this article, you learned concepts and workflow for key phrase extraction using Text Analytics in Cognitive Services. In summary:

+ [Key phrase extraction API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6) is available for selected languages.
+ JSON documents in the request body include an id, text, and language code.
+ POST request is to a `/keyphrases` endpoint, using a personalized [access key and an endpoint](text-analytics-how-to-access-key.md) that is valid for your subscription.
+ Response output, which consists of key words and phrases for each document ID, can be streamed to any app that accepts JSON, including Excel and Power BI, to name a few.

## See also 

 [Text Analytics overview](../overview.md)  
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)</br>
 [Text Analytics product page](//go.microsoft.com/fwlink/?LinkID=759712) 

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics API](//westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6)
