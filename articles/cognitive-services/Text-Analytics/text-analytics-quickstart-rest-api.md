---
title: 'Text Analytics REST API Quickstart (Azure Cognitive Services) | Microsoft Docs'
description: Learn the Text Analytics API in Azure Cognitive Services.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 07/24/2017
ms.author: heidist
---

# Analyze text for sentiment, keywords, and language in 10 minutes (REST API)

In this Quickstart, learn how to call the Text Analytics REST APIs to perform sentiment analysis, keyword extraction, and language detection on text uploaded to Azure Cognitive Services.

> [!Tip]
> We recommend using a Web API testing tool for this exercise. [Chrome Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop) is a good choice, but any tool that sends HTTP requests will work. You can watch this [short video](https://www.youtube.com/watch?v=jBjXVrS8nXs) to learn basic Postman operations.
>

## Before you begin

To use Microsoft Cognitive Service APIs, you first need to [create a Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal. Policies and release cycles vary for each API, so we ask you to sign up for each API individually. 

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## 1. Set up a request for keyword extraction

Text Analytics APIs invoke operations against models and algorithms running in Azure data centers. You need an access key to the Text Analytics API for operation access. 

Endpoints for each operation include the resource providing the underlying algorithms used for a particular analysis: sentiment analysis, key phrase extraction, language detection. We list them in full below.

1. In the [Azure portal](https://portal.azure.com) and find the Text Analysis API you signed up for. Leave the page open so that you can copy a key and endpoint in the next step.

2. In Postman or another tool, set up the request:

   + Choose **Post** as the request type.
   + Paste in the endpoint.
   + Append a resource. In this exercise, start with **/keyPhrases**.

  Endpoints for each available resource are as follows (your data center may vary):

   + https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment
   + https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases
   + https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages

3. Set three request headers:

   + `Ocp-Apim-Subscription-Key` set to your access key, obtained from Azure portal.
   + `Content-Type` set to application/json.
   + `Accept` set to application/json.

  Your request should look similar to the following screenshot.

   ![Request screenshot with endpoint and headers](../media/text-analytics/postman-request-keyphrase-1.png)

4. Provide text for analysis. Click **Body** and paste in the JSON documents below. Choose **raw** for the format. Click **Send** to submit the request.

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
                    "text": "Ok but nothing special. Check out the other trails instead."
                },
                {
                    "language": "en",
                    "id": "3",
                    "text": "Not recommended for small children or dogs."
                },
                {
                    "language": "en",
                    "id": "4",
                    "text": "It was foggy so we missed the spectacular views, but the trail was deserted and our dog loved it!"
                },                
                {
                    "language": "en",
                    "id": "5",
                    "text": "Stunning view but very crowded with small children and dogs."
                }
            ]
        }
```

### Formatting the request body

 Input rows must be JSON. XML is not supported. For sentiment, key phrases and language, the format is the same:
 
 + Each ID should be unique and is the ID returned by the system. 
 + Language is an optional parameter that should be specified if analyzing non-English text. Refer to the [Text Analytics Overview](overview.md#supported-languages) for a list of supported languages.
 
 The maximum size of a single document that can be submitted is 10 KB, and the total maximum size of submitted input is 1 MB. No more than 1,000 documents may be submitted in one call. 
 
 Rate limiting exists at a rate of 100 calls per minute - we therefore recommend that you submit large quantities of documents in a single call. 

### Parsing the response payload

This call returns a JSON formatted response with the IDs and detected properties. An example of the output for key phrase extraction is shown below.

The keyPhrases algorithm iterates over the entire collection and picks up on common phrases(?).

```
{
    "documents": [
        {
            "keyPhrases": [
                "views",
                "hike",
                "trail"
            ],
            "id": "1"
        },
        {
            "keyPhrases": [
                "trails"
            ],
            "id": "2"
        },
        {
            "keyPhrases": [
                "dogs",
                "small children"
            ],
            "id": "3"
        },
        {
            "keyPhrases": [
                "trail",
                "spectacular views",
                "dog"
            ],
            "id": "4"
        },
        {
            "keyPhrases": [
                "small children",
                "Stunning view"
            ],
            "id": "5"
        }
    ],
    "errors": []
}
```

## 2. Detect sentiment

Using the same documents, you can edit the existing request to call the sentiment analysis algorithm and return sentiment scores.

+ Replace `/keyPhrases` with `/sentiment` in the endpoint and then click **Send** to submit the same documents collection.

The response includes a sentiment score between 0.0 (negative) and 0.9999999 (positive) to indicate relative sentiment.


```
{
    "documents": [
        {
            "score": 0.992584952105894,
            "id": "1"
        },
        {
            "score": 0.902196155767694,
            "id": "2"
        },
        {
            "score": 0.0902095755821843,
            "id": "3"
        },
        {
            "score": 0.0645565664913637,
            "id": "4"
        },
        {
            "score": 0.0565953372622392,
            "id": "5"
        }
    ],
    "errors": []
}
```

> [!TIP]
> For sentiment analysis, we recommend spliting text into sentences. This generally leads to higher precision in sentiment predictions.
> 
>

## 3. Detect language

Again, using same documents, you can edit the existing request to call the language detection algorithm.

+ Replace `/sentiment` with `/languages` in the endpoint and then click **Send** to submit the same documents collection.
+ Optionally, use an online translator to translate some of the existing phrases from English to another language. Re-send the request to detect the non-English languages (120 languages are supported for language detection).

The response includes language codes for each document and a score indicating certainty of the analysis.


## Next steps

+ Sign up for the [Translate API]() and submit the documents collection for translation. Copy the strings to create a language-specific version of the documents, then run language detection to confirm the results.

+ [Visit the product page](//go.microsoft.com/fwlink/?LinkID=759712) to try out an interactive demo of the APIs. Submit text, choose an analysis, and view results without writing any code.

+ [Visit API refrence documentation](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs. Documentation embeds interactive requests so that you can call the API from each documentation page.

+ Learn how to call the [Text Analytics API from PowerApps](https://powerapps.microsoft.com/blog/custom-connectors-and-text-analytics-in-powerapps-part-one/), an application development platform that does not require in-depth programming knowledge to use.

+ To see how the Text Analytics API can be used as part of a bot, see the [Emotional Bot](http://docs.botframework.com/bot-intelligence/language/#example-emotional-bot) example on the Bot Framework site.

## See also 

 [What is Text Analytics in Azure Cognitive Services](overview.md)  
 [Frequently asked queestions (FAQ)](text-analytics-resource-faq.md)