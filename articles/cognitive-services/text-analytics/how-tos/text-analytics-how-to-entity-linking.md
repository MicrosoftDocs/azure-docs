---
title: Use entity recognition with the Text Analytics API
titleSuffix: Azure Cognitive Services
description: Learn how to identify and disambiguate the identity of an entity found in text with the Text Analytics REST API.
services: cognitive-services
author: aahill

manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 03/15/2021
ms.author: aahi
---

# How to use Named Entity Recognition in Text Analytics

The Text Analytics API lets you takes unstructured text and returns a list of disambiguated entities, with links to more information on the web. The API supports both named entity recognition (NER) for several entity categories, and entity linking.

## Entity Linking

Entity linking is the ability to identify and disambiguate the identity of an entity found in text (for example, determining whether an occurrence of the word "Mars" refers to the planet, or to the Roman god of war). This process requires the presence of a knowledge base in an appropriate language, to link recognized entities in text. Entity Linking uses [Wikipedia](https://www.wikipedia.org/) as this knowledge base.

## Named Entity Recognition (NER)

Named Entity Recognition (NER) is the ability to identify different entities in text and categorize them into pre-defined classes or types such as: person, location, event, product, and organization.  

## Personally Identifiable Information (PII)

The PII feature is part of NER and it can identify and redact sensitive entities in text that are associated with an individual person such as: phone number, email address, mailing address, passport number.

## Named Entity Recognition features and versions

| Feature                                                         | NER v3.0 | NER v3.1-preview.4 |
|-----------------------------------------------------------------|--------|----------|
| Methods for single, and batch requests                          | X      | X        |
| Expanded entity recognition across several categories           | X      | X        |
| Separate endpoints for sending entity linking and NER requests. | X      | X        |
| Recognition of personal (`PII`) and health (`PHI`) information entities        |        | X        |
| Redaction of `PII`        |        | X        |

See [language support](../language-support.md) for information.

Named Entity Recognition v3 provides expanded detection across multiple types. Currently, NER v3.0 can recognize entities in the [general entity category](../named-entity-types.md).

Named Entity Recognition v3.1-preview.4 includes the detection capabilities of v3.0, and: 
* The ability to detect personal information (`PII`) using the `v3.1-preview.4/entities/recognition/pii` endpoint. 
* An optional `domain=phi` parameter to detect confidential health information (`PHI`).
* [Asynchronous operation](text-analytics-how-to-call-api.md) using the `/analyze` endpoint.

For more information, see the [entity categories](../named-entity-types.md) article, and [request endpoints](#request-endpoints) section below. For more information on confidence scores, see the [Text Analytics transparency note](/legal/cognitive-services/text-analytics/transparency-note?context=/azure/cognitive-services/text-analytics/context/context). 

## Sending a REST API request

### Preparation

You must have JSON documents in this format: ID, text, language.

Each document must be under 5,120 characters, and you can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request.

### Structure the request

Create a POST request. You can [use Postman](text-analytics-how-to-call-api.md) or the **API testing console** in the following links to quickly structure and send one. 

> [!NOTE]
> You can find your key and endpoint for your Text Analytics resource on the azure portal. They will be located on the resource's **Quick start** page, under **resource management**. 


### Request endpoints

#### [Version 3.1-preview](#tab/version-3-preview)

Named Entity Recognition `v3.1-preview.4` uses separate endpoints for NER, PII, and entity linking requests. Use a URL format below based on your request.

**Entity linking**
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.4/entities/linking`

[Named Entity Recognition version 3.1-preview reference for `Linking`](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-Preview-4/operations/EntitiesLinking)

**Named Entity Recognition**
* General entities - `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.4/entities/recognition/general`

[Named Entity Recognition version 3.1-preview reference for `General`](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-Preview-4/operations/EntitiesRecognitionGeneral)

**Personally Identifiable Information (PII)**
* Personal (`PII`) information - `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.4/entities/recognition/pii`

You can also use the optional `domain=phi` parameter to detect health (`PHI`) information in text. 

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.4/entities/recognition/pii?domain=phi`

Starting in `v3.1-preview.4`, The JSON response includes a `redactedText` property, which contains the modified input text where the detected PII entities are replaced by an `*` for each character in the entities.

[Named Entity Recognition version 3.1-preview reference for `PII`](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-Preview-4/operations/EntitiesRecognitionPii)

The API will attempt to detect the [listed entity categories](../named-entity-types.md?tabs=personal) for a given document language. If you want to specify which entities will be detected and returned, use the optional pii-categories parameter with the appropriate entity categories. This parameter can also let you detect entities that aren't enabled by default for your document language. For example, a French driver's license number that might occur in English text.

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.4/entities/recognition/pii?piiCategories=[FRDriversLicenseNumber]`

**Asynchronous operation**

Starting in `v3.1-preview.4`, You can send NER and entity linking requests asynchronously using the `/analyze` endpoint.

* Asynchronous operation - `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.1-preview.4/analyze`

See [How to call the Text Analytics API](text-analytics-how-to-call-api.md) for information on sending asynchronous requests.

#### [Version 3.0](#tab/version-3)

Named Entity Recognition v3 uses separate endpoints for NER and entity linking requests. Use a URL format below based on your request:

**Entity linking**
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0/entities/linking`

[Named Entity Recognition version 3.0 reference for `Linking`](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/EntitiesRecognitionGeneral)

**Named Entity Recognition**
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0/entities/recognition/general`

[Named Entity Recognition version 3.0 reference for `General`](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/EntitiesRecognitionGeneral)

---

Set a request header to include your Text Analytics API key. In the request body, provide the JSON documents you prepared.

## Example requests

#### [Version 3.1-preview](#tab/version-3-preview)

### Example synchronous NER request 

The following JSON is an example of content you might send to the API. The request format is the same for both versions of the API.

```json
{
  "documents": [
    {
        "id": "1",
        "language": "en",
        "text": "Our tour guide took us up the Space Needle during our trip to Seattle last week."
    }
  ]
}
```

### Example asynchronous NER request

If you use the `/analyze` endpoint for [asynchronous operation](text-analytics-how-to-call-api.md), you will get a response containing the tasks you sent to the API.

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
        "entityRecognitionPiiTasks": [{
            "parameters": {
                "model-version": "latest"
            }
        }]
    }
}
```

#### [Version 3.0](#tab/version-3)

### Example synchronous NER request 

Version 3.0 only includes synchronous operation. The following JSON is an example of content you might send to the API. The request format is the same for both versions of the API.

```json
{
  "documents": [
    {
        "id": "1",
        "language": "en",
        "text": "Our tour guide took us up the Space Needle during our trip to Seattle last week."
    }
  ]
}
```

---

## Post the request

Analysis is performed upon receipt of the request. See the [data limits](../overview.md#data-limits) section in the overview for information on the size and number of requests you can send per minute and second.

The Text Analytics API is stateless. No data is stored in your account, and results are returned immediately in the response.

## View results

All POST requests return a JSON formatted response with the IDs and detected entity properties.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort, search, and manipulate the data. Due to multilingual and emoji support, the response may contain text offsets. For more information, see [how to process text offsets](../concepts/text-offsets.md).

### Example responses

Version 3 provides separate endpoints for general NER, PII, and entity linking. Version 3.1-pareview includes an asynchronous Analyze mode. The responses for these operations are below. 

#### [Version 3.1-preview](#tab/version-3-preview)

### Synchronous example results

Example of a general NER response:

```json
{
  "documents": [
    {
      "id": "1",
      "entities": [
        {
          "text": "tour guide",
          "category": "PersonType",
          "offset": 4,
          "length": 10,
          "confidenceScore": 0.45
        },
        {
          "text": "Space Needle",
          "category": "Location",
          "offset": 30,
          "length": 12,
          "confidenceScore": 0.38
        },
        {
          "text": "trip",
          "category": "Event",
          "offset": 54,
          "length": 4,
          "confidenceScore": 0.78
        },
        {
          "text": "Seattle",
          "category": "Location",
          "subcategory": "GPE",
          "offset": 62,
          "length": 7,
          "confidenceScore": 0.78
        },
        {
          "text": "last week",
          "category": "DateTime",
          "subcategory": "DateRange",
          "offset": 70,
          "length": 9,
          "confidenceScore": 0.8
        }
      ],
      "warnings": []
    }
  ],
  "errors": [],
  "modelVersion": "2020-04-01"
}
```

Example of a PII response:

```json
{
  "documents": [
    {
    "redactedText": "You can even pre-order from their online menu at *************************, call ************ or send email to ***************************!",
    "id": "0",
    "entities": [
        {
        "text": "www.contososteakhouse.com",
        "category": "URL",
        "offset": 49,
        "length": 25,
        "confidenceScore": 0.8
        }, 
        {
        "text": "312-555-0176",
        "category": "Phone Number",
        "offset": 81,
        "length": 12,
        "confidenceScore": 0.8
        }, 
        {
        "text": "order@contososteakhouse.com",
        "category": "Email",
        "offset": 111,
        "length": 27,
        "confidenceScore": 0.8
        }
      ],
    "warnings": []
    }
  ],
  "errors": [],
  "modelVersion": "2020-07-01"
}
```

Example of an Entity linking response:

```json
{
  "documents": [
    {
      "id": "1",
      "entities": [
        {
          "bingId": "f8dd5b08-206d-2554-6e4a-893f51f4de7e", 
          "name": "Space Needle",
          "matches": [
            {
              "text": "Space Needle",
              "offset": 30,
              "length": 12,
              "confidenceScore": 0.4
            }
          ],
          "language": "en",
          "id": "Space Needle",
          "url": "https://en.wikipedia.org/wiki/Space_Needle",
          "dataSource": "Wikipedia"
        },
        {
          "bingId": "5fbba6b8-85e1-4d41-9444-d9055436e473",
          "name": "Seattle",
          "matches": [
            {
              "text": "Seattle",
              "offset": 62,
              "length": 7,
              "confidenceScore": 0.25
            }
          ],
          "language": "en",
          "id": "Seattle",
          "url": "https://en.wikipedia.org/wiki/Seattle",
          "dataSource": "Wikipedia"
        }
      ],
      "warnings": []
    }
  ],
  "errors": [],
  "modelVersion": "2020-02-01"
}
```

### Example asynchronous result

```json
{
  "displayName": "My Analyze Job",
  "jobId": "dbec96a8-ea22-4ad1-8c99-280b211eb59e_637408224000000000",
  "lastUpdateDateTime": "2020-11-13T04:01:14Z",
  "createdDateTime": "2020-11-13T04:01:13Z",
  "expirationDateTime": "2020-11-14T04:01:13Z",
  "status": "running",
  "errors": [],
  "tasks": {
      "details": {
          "name": "My Analyze Job",
          "lastUpdateDateTime": "2020-11-13T04:01:14Z"
      },
      "completed": 1,
      "failed": 0,
      "inProgress": 2,
      "total": 3,
      "keyPhraseExtractionTasks": [
          {
              "name": "My Analyze Job",
              "lastUpdateDateTime": "2020-11-13T04:01:14.3763516Z",
              "results": {
                  "inTerminalState": true,
                  "documents": [
                      {
                          "id": "doc1",
                          "keyPhrases": [
                              "sunny outside"
                          ],
                          "warnings": []
                      },
                      {
                          "id": "doc2",
                          "keyPhrases": [
                              "favorite Seattle attraction",
                              "Pike place market"
                          ],
                          "warnings": []
                      }
                  ],
                  "errors": [],
                  "modelVersion": "2020-07-01"
              }
          }
      ]
  }
}
```


#### [Version 3.0](#tab/version-3)

Example of a general NER response:
```json
{
  "documents": [
    {
      "id": "1",
      "entities": [
        {
          "text": "tour guide",
          "category": "PersonType",
          "offset": 4,
          "length": 10,
          "confidenceScore": 0.45
        },
        {
          "text": "Space Needle",
          "category": "Location",
          "offset": 30,
          "length": 12,
          "confidenceScore": 0.38
        },
        {
          "text": "trip",
          "category": "Event",
          "offset": 54,
          "length": 4,
          "confidenceScore": 0.78
        },
        {
          "text": "Seattle",
          "category": "Location",
          "subcategory": "GPE",
          "offset": 62,
          "length": 7,
          "confidenceScore": 0.78
        },
        {
          "text": "last week",
          "category": "DateTime",
          "subcategory": "DateRange",
          "offset": 70,
          "length": 9,
          "confidenceScore": 0.8
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

In this article, you learned concepts and workflow for entity linking using Text Analytics in Cognitive Services. In summary:

* JSON documents in the request body include an ID, text, and language code.
* POST requests are sent to one or more endpoints, using a personalized [access key and an endpoint](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) that is valid for your subscription.
* Response output, which consists of linked entities (including confidence scores, offsets, and web links, for each document ID) can be used in any application

## Next steps

* [Text Analytics overview](../overview.md)
* [Using the Text Analytics client library](../quickstarts/client-libraries-rest-api.md)
* [What's new](../whats-new.md)
