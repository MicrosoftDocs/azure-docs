---
title: Key phrase extraction using the Text Analytics REST API
titleSuffix: Azure Cognitive Services
description: How to extract key phrases by using the Text Analytics REST API from Azure Cognitive Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 08/04/2021
ms.author: aahi
---

# Example: How to extract key phrases using Text Analytics

The [Key Phrase Extraction API](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/KeyPhrases) evaluates unstructured text, and for each JSON document, returns a list of key phrases.

This capability is useful if you need to quickly identify the main points in a collection of documents. For example, given input text "The food was delicious and there were wonderful staff", the service returns the main talking points: "food" and "wonderful staff".

For more information, see [Supported languages](../language-support.md).

> [!TIP]
> * Text Analytics also provides a Linux-based Docker container image for key phrase extraction, so you can [install and run the Text Analytics container](text-analytics-how-to-install-containers.md) close to your data.
> * You can also use this feature [asynchronously](text-analytics-how-to-call-api.md) using the `/analyze` endpoint.

## Preparation

Key phrase extraction works best when you give it bigger amounts of text to work on. This is opposite from sentiment analysis, which performs better on smaller amounts of text. To get the best results from both operations, consider restructuring the inputs accordingly.

You must have JSON documents in this format: ID, text, language

Document size must be 5,120 or fewer characters per document, and you can have up to 10 items (IDs) per collection. The collection is submitted in the body of the request. The following example is an illustration of content you might submit for key phrase extraction. 

See [How to call the Text Analytics API](text-analytics-how-to-call-api.md) for more information on request and response objects.  

### Example synchronous request object


```json
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

### Example asynchronous request object

Starting in `v3.1`, You can send NER requests asynchronously using the `/analyze` endpoint.


```json
{
    "displayName": "My Job",
    "analysisInput": {
        "documents": [
            {
                "id": "doc1",
                "text": "It's incredibly sunny outside! I'm so happy"
            },
            {
                "id": "doc2",
                "text": "Pike place market is my favorite Seattle attraction."
            }
        ]
    },
    "tasks": {
        "keyPhraseExtractionTasks": [{
            "parameters": {
                "model-version": "latest"
            }
        }],
    }
}
```

## Step 1: Structure the request

For information about request definition, see [How to call the Text Analytics API](text-analytics-how-to-call-api.md). The following points are restated for convenience:

+ Create a **POST** request. Review the API documentation for this request: [Key Phrases API](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/KeyPhrases).

+ Set the HTTP endpoint for key phrase extraction by using either a Text Analytics resource on Azure or an instantiated [Text Analytics container](text-analytics-how-to-install-containers.md). if you're using the API synchronously, you must include `/text/analytics/v3.1/keyPhrases` in the URL. For example: `https://<your-custom-subdomain>.api.cognitiveservices.azure.com/text/analytics/v3.1/keyPhrases`.

+ Set a request header to include the [access key](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) for Text Analytics operations.

+ In the request body, provide the JSON documents collection you prepared for this analysis.

> [!Tip]
> Use [Postman](text-analytics-how-to-call-api.md) or open the **API testing console** in the [documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/KeyPhrases) to structure a request and POST it to the service.

## Step 2: Post the request

Analysis is performed upon receipt of the request. For information about the size and number of requests you can send per minute or per second, see the [data limits](../concepts/data-limits.md) article.

Recall that the service is stateless. No data is stored in your account. Results are returned immediately in the response.

## Step 3: View results

All POST requests return a JSON formatted response with the IDs and detected properties. The order of the returned key phrases is determined internally, by the model.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort, search, and manipulate the data.

An example of the output for key phrase extraction from the v3.1 endpoint is shown here:

### Synchronous result

```json
{
    "documents": [
        {
            "id": "1",
            "keyPhrases": [
                "trail",
                "trip",
                "views",
                "hike"
            ],
            "warnings": []
        },
        {
            "id": "2",
            "keyPhrases": [
                "Worst hike",
                "trails"
            ],
            "warnings": []
        },
        {
            "id": "3",
            "keyPhrases": [
                "less athletic",
                "small children",
                "Everyone",
                "family",
                "trail"
            ],
            "warnings": []
        },
        {
            "id": "4",
            "keyPhrases": [
                "spectacular views",
                "trail",
                "area"
            ],
            "warnings": []
        },
        {
            "id": "5",
            "keyPhrases": [
                "favorite trail",
                "beautiful views",
                "many places"
            ],
            "warnings": []
        }
    ],
    "errors": [],
    "modelVersion": "2021-06-01"
}
```
As noted, the analyzer finds and discards non-essential words, and it keeps single terms or phrases that appear to be the subject or object of a sentence.

### Asynchronous result

If you use the `/analyze` endpoint for asynchronous operation, you will get a response containing the tasks you sent to the API.

```json
{
    "jobId": "fa813c9a-0d96-4a34-8e4f-a2a6824f9190",
    "lastUpdateDateTime": "2021-07-07T18:16:45Z",
    "createdDateTime": "2021-07-07T18:16:15Z",
    "expirationDateTime": "2021-07-08T18:16:15Z",
    "status": "succeeded",
    "errors": [],
    "displayName": "My Job",
    "tasks": {
        "completed": 1,
        "failed": 0,
        "inProgress": 0,
        "total": 1,
        "keyPhraseExtractionTasks": [
            {
                "lastUpdateDateTime": "2021-07-07T18:16:45.0623454Z",
                "taskName": "KeyPhraseExtraction_latest",
                "state": "succeeded",
                "results": {
                    "documents": [
                        {
                            "id": "doc1",
                            "keyPhrases": [],
                            "warnings": []
                        },
                        {
                            "id": "doc2",
                            "keyPhrases": [
                                "Pike place market",
                                "Seattle attraction",
                                "favorite"
                            ],
                            "warnings": []
                        }
                    ],
                    "errors": [],
                    "modelVersion": "2021-06-01"
                }
            }
        ]
    }
}
```


## Summary

In this article, you learned concepts and workflow for key phrase extraction by using Text Analytics in Cognitive Services. In summary:

+ [Key phrase extraction API](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/KeyPhrases) is available for selected languages.
+ JSON documents in the request body include an ID, text, and language code.
+ POST request is to a `/keyphrases` or `/analyze` endpoint, using a personalized [access key and an endpoint](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) that is valid for your subscription.
+ Response output, which consists of key words and phrases for each document ID, can be streamed to any app that accepts JSON, including Microsoft Office Excel and Power BI, to name a few.

## See also

 [Text Analytics overview](../overview.md)
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.yml)</br>
 [Text Analytics product page](//go.microsoft.com/fwlink/?LinkID=759712)

## Next steps

* [Text Analytics overview](../overview.md)
* [Using the Text Analytics client library](../quickstarts/client-libraries-rest-api.md)
* [What's new](../whats-new.md)
* [Model versions](../concepts/model-versioning.md)
