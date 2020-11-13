---
title: Call the Text Analytics API
titleSuffix: Azure Cognitive Services
description: This article explains how you can call the Azure Cognitive Services Text Analytics REST API and Postman.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/30/2019
ms.author: aahi
---

# How to call the Text Analytics REST API
In this article, we use REST and [Postman](https://www.postman.com/downloads/) to demonstrate key concepts.

Calls to the synchronous **Text Analytics API** are HTTP POST/GET calls, which you can formulate in any language. Calls to the **Text Analytics asynchronous APIs** are HTTP POST call followed by  HTTP GET. Each request must include your access key and an HTTP endpoint. The endpoint specifies the region you chose during sign up and the service URL.

| Feature                                   | Synchronous API  | Asynchronous API |
|-------------------------------------------|-----------------------|-----------------------------------|
| Language detection    | X                     |                                |
| Sentiment analysis             | X                     |                                  |
| Key phrase extraction | X  |  |
| Named entity recognition  |           X            |                                 |
| Text Analytics for health    |                     | X                                 |
| Analyze     |                      | X                                 |

[!INCLUDE [text-analytics-api-references](../includes/text-analytics-api-references.md)]

[!INCLUDE [v3 region availability](../includes/v3-region-availability.md)]

## Prerequisites

1.	First, go to [Azure Portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new TA Resource. If you do not have an Azure subscription, you will first need to sign up and create a [free Trial](https://azure.microsoft.com/en-in/free/).  
2.	Select the [SKU and the pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/) that is the most appropriate to your scenario
> [!Note]
> Choose the Standard (S) pricing tier if you want to use any of the asynchronous capabilities. If you had an existing Standard (S) TA resource before Nov 19th, you won't have access to the new preview capabilities. You will need to create a new resource to get access.

3.	Select the region you want you endpoint to hit
> [!Note]
> •	Analyze API is available in: West US2, East US2, West Europe, North Europe, Central US
  •	Text Analytics for health API is available in: West US2, East US2,South Central US, North Central US, UK South


4.	Create the TA resource and go to the “keys and endpoint blade” in the left of the page. Copy the key to be used later when calling any of the APIs. It will be added as value for the `Ocp-Apim-Subscription-Key` header.


<a name="json-schema"></a>

## JSON schema definition

Input must be JSON in raw unstructured text. XML is not supported. The schema is simple, consisting of the elements described in the following list.

#### [TA sync APIs](#tab/ta-sync/schemadef)

You can currently submit the same documents for all synchronous Text Analytics operations: sentiment, key phrase, language detection, and entity identification. (The schema is likely to vary for each analysis in the future.)

| Element | Valid values | Required? | Usage |
|---------|--------------|-----------|-------|
|`id` |The data type is string, but in practice document IDs tend to be integers. | Required | The system uses the IDs you provide to structure the output. Language codes, key phrases, and sentiment scores are generated for each ID in the request.|
|`text` | Unstructured raw text, up to 5,120 characters. | Required | For language detection, text can be expressed in any language. For sentiment analysis, key phrase extraction and entity identification, the text must be in a [supported language](../language-support.md). |
|`language` | 2-character [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code for a [supported language](../language-support.md) | Varies | Required for sentiment analysis, key phrase extraction, and entity linking; optional for language detection. There is no error if you exclude it, but the analysis is weakened without it. The language code should correspond to the `text` you provide. |

#### [Analyze API](#tab/ta-analyze/schemadef)

In the Analyze API, you get to choose which of the supported TA features you want to call in the same API call. Currently the supported TA features are entity recognition, key phrase extraction and entity recognition PII/PHI tasks.

| Element | Valid values | Required? | Usage |
|---------|--------------|-----------|-------|
|`displayName` | Data type is string | Required | The system uses the display name as the unique identifier to the job.|
|`analysisInput` | Includes the below `documents` field | Required | Contains all the information on the documents that you want to send |
|`documents` | Includes the two below `id` and `text` fields | Required | Contains the information of each document that is being input and the raw text of the document |
|`id` | Data type is string | Required | The system uses the IDs you provide to structure the output. |
|`text` | Unstructured raw text, up to 125,000 characters. | Required | Must be in English language as this is the only language currently being supported |
|`tasks` | Includes the TA features supported: `entityRecognitionTasks` or `keyPhraseExtractionTasks` or `entityRecognitionPiiTasks` | Required | Must add to the system which of the TA features you want to use. You can specify all of the supported features or only one. |
|`parameters` | Includes the below `model-version` and `stringIndexType` fields | Required | This field is included within the above feature tasks that you choose. They contain information about the model-version that you want to use and the index type. |
|`model-version` | Data type is string | Required | Specify which version of the model being called that you want to use.  |
|`stringIndexType` | Data type is string | Required | Specify the text decoder that you want. |

#### [Health API](#tab/ta-health/schemadef)

For the health API, ....

| Element | Valid values | Required? | Usage |
|---------|--------------|-----------|-------|

---

For more information about limits, see [Text Analytics Overview > Data limits](../overview.md#data-limits).

## JSON schema definition examples

#### [TA sync API](#tab/ta-sync)

```json
{
  "documents": [
    {
      "language": "en",
      "id": "1",
      "text": "Sample text to be sent to the text analytics api."
    },
    {
      "language": "en",
      "id": "2",
      "text": "It's incredibly sunny outside! I'm so happy."
    },
    {
      "language": "en",
      "id": "3",
      "text": "Pike place market is my favorite Seattle attraction."
    }
  ]
}
```

#### [Analyze API](#tab/analyze-api)
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
        "entityRecognitionTasks": [
            {
                "parameters": {
                    "model-version": "latest",
                    "stringIndexType": "TextElements_v8"
                }
            }
        ],
        "keyPhraseExtractionTasks": [{
            "parameters": {
                "model-version": "latest"
            }
        }],
        "entityRecognitionPiiTasks": [{
            "parameters": {
                "model-version": "latest"
            }
        }]
    }
}

```

#### [Health API](#tab/health-api)

```json
{
  "to be added"
}

```
---

## Set up a request in Postman

The service accepts request up to 1 MB in size for synchronous operations and 5 GB for asynchronous operations. If you are using Postman (or another Web API test tool), set up the endpoint to include the resource you want to use, and provide the access key in a request header. Each operation requires that you append the appropriate resource to the endpoint.


| Feature      | Request type |Resource endpoints (regions may vary) |
|--------------------------------------------|-----------------------------------|
| Language detection    | POST |  https://westus.api.cognitive.microsoft.com/text/analytics/v3.0/languages                               |
| Sentiment analysis  | POST |https://westus.api.cognitive.microsoft.com/text/analytics/v3.0/sentiment                                               |
| Key phrase extraction | POST |   https://westus.api.cognitive.microsoft.com/text/analytics/v3.0/keyPhrases         |
| Named entity recognition  | POST |   https://westus.api.cognitive.microsoft.com/text/analytics/v3.0/entities/recognition/general                                       |
| Text Analytics for health    |  POST | ?????                                                   |
| Text Analytics for health    |  GET | ?????                                                   |
| Text Analytics for health    |  DELETE | ?????                                                   |
| Analyze     |     POST |       ??????                                          |
| Analyze     |     GET |       ??????                                          |
| Analyze     |     DELETE |       ??????                                          |


1. In Postman:

   + Choose the **POST** request type
   + Paste in the endpoint of the proper operation you want from the above table. Noticing the endpoint may differ depending on the region you create your TA resource in.


2. Set the three request headers:

   + `Ocp-Apim-Subscription-Key`: your access key, obtained from Azure portal
   + `Content-Type`: application/json
   + `Accept`: application/json

   Your request should look similar to the following screenshot, assuming a **/keyPhrases** feature.

   ![Request screenshot with endpoint and headers](../media/postman-request-keyphrase-1.png)

3. Click **Body** and choose **raw** for the format

   ![Request screenshot with body settings](../media/postman-request-body-raw.png)

4. Paste in some JSON documents in a format that is valid for the intended analysis. For more information about a particular analysis, see the topics below:

      + [Language detection](text-analytics-how-to-language-detection.md)
      + [Key phrase extraction](text-analytics-how-to-keyword-extraction.md)
      + [Sentiment analysis](text-analytics-how-to-sentiment-analysis.md)
      + [Entity recognition](text-analytics-how-to-entity-linking.md)


5. Click **Send** to submit the request.

6. If the call was for a synchronous API, the response is displayed in the next window down, as a single JSON document, with an item for each document ID provided in the request.

7. For the asynchronous APIs, you will get in the header of the response an `operation-id` field that has a URL ending with the Job number. Copy and paste this number.
   
   ![Screenshot of header response](../media/postman-async-response-header.png)

8. Choose the **GET** request type and past the appropriate endpoint URL for that operation

9. The response is displayed in the next window down, as a single JSON document, with an item for each document ID provided in the request.


See the [data limits](../overview.md#data-limits) section in the overview for information on the number of requests you can send per minute and second.



## See also

[Text Analytics Overview](../overview.md)
[Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
