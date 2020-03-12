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
ms.date: 02/10/2020
ms.author: aahi
---

# How to use Named Entity Recognition in Text Analytics

The Text Analytics API lets you takes unstructured text and returns a list of disambiguated entities, with links to more information on the web. The API supports both named entity recognition (NER) and entity linking.

### Entity Linking

Entity linking is the ability to identify and disambiguate the identity of an entity found in text (for example, determining whether an occurrence of the word `Mars` refers to the planet, or to the Roman god of war). This process requires the presence of a knowledge base in an appropriate language, to link recognized entities in text. Entity Linking uses [Wikipedia](https://www.wikipedia.org/) as this knowledge base.


### Named Entity Recognition (NER)

Named Entity Recognition (NER) is the ability to identify different entities in text and categorize them into pre-defined classes or types such as: person, location, event, product and organization.  

Starting in version 3, this feature of the Text Analytics API can also identify personal and sensitive information types such as: phone number, Social Security Number, email address, and bank account number.  Identifying these entities can help in classifying sensitive documents, and redacting personal information.

## Named Entity Recognition versions and features

The Text Analytics API offers two versions of Named Entity Recognition - v2 and v3. Version 3 (Public preview) provides increased detail in the entities that can be detected and categorized.

| Feature                                                         | NER v2 | NER v3 |
|-----------------------------------------------------------------|--------|--------|
| Methods for single, and batch requests                          | X      | X      |
| Basic entity recognition across several categories              | X      | X      |
| Expanded classification for recognized entities                 |        | X      |
| Separate endpoints for sending entity linking and NER requests. |        | X      |
| Model versioning                                                |        | X      |

See [language support](../language-support.md#sentiment-analysis-key-phrase-extraction-and-named-entity-recognition) for information.


#### [Version 3.0-preview](#tab/version-3)

### Entity types

Named Entity Recognition v3 provides expanded detection across multiple types. Currently, NER v3 can recognize the following categories of entities:

* General
* Personal Information 

For a detailed list of supported entities and languages, see the [NER v3 supported entity types](../named-entity-types.md) article.

### Request endpoints

Named Entity Recognition v3 uses separate endpoints for NER and entity linking requests. Use a URL format below based on your request:

NER
* General entities - `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/recognition/general`

* Personal information - `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/recognition/pii`

Entity linking
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/linking`

### Model versioning

[!INCLUDE [v3-model-versioning](../includes/model-versioning.md)]

#### [Version 2.1](#tab/version-2)

### Entity types

> [!NOTE]
> Named Entity Recognition(NER) version 2 only supports the following entities. NER v3 is in public preview, and greatly expands the number and depth of the entities recognized in text.   

| Type  | SubType | Example |
|:-----------   |:------------- |:---------|
| Person        | N/A\*         | "Jeff", "Bill Gates"     |
| Location      | N/A\*         | "Redmond, Washington", "Paris"  |
| Organization  | N/A\*         | "Microsoft"   |
| Quantity      | Number        | "6", "six"     |
| Quantity      | Percentage    | "50%", "fifty percent"|
| Quantity      | Ordinal       | "2nd", "second"     |
| Quantity      | Age           | "90 day old", "30 years old"    |
| Quantity      | Currency      | "$10.99"     |
| Quantity      | Dimension     | "10 miles", "40 cm"     |
| Quantity      | Temperature   | "32 degrees"    |
| DateTime      | N/A\*         | "6:30PM February 4, 2012"      |
| DateTime      | Date          | "May 2nd, 2017", "05/02/2017"   |
| DateTime      | Time          | "8am", "8:00"  |
| DateTime      | DateRange     | "May 2nd to May 5th"    |
| DateTime      | TimeRange     | "6pm to 7pm"     |
| DateTime      | Duration      | "1 minute and 45 seconds"   |
| DateTime      | Set           | "every Tuesday"     |
| URL           | N/A\*         | "https:\//www.bing.com"    |
| Email         | N/A\*         | "support@contoso.com" |
| US Phone Number  | N/A\*         | (US phone numbers only) "(312) 555-0176" |
| IP Address    | N/A\*         | "10.0.0.100" |

\* Depending on the input and extracted entities, certain entities may omit the `SubType`.  All the supported entity types listed are available only for the English, Chinese-Simplified, French, German, and Spanish languages.

### Request endpoints

Named Entity Recognition v2 uses a single endpoint for NER and entity linking requests:

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v2.1/entities`

---

## Sending a REST API request

### Preparation

You must have JSON documents in this format: ID, text, language.

Each document must be under 5,120 characters, and you can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request.

### Structure the request

Create a POST request. You can [use Postman](text-analytics-how-to-call-api.md) or the **API testing console** in the following links to quickly structure and send one. 

> [!NOTE]
> You can find your key and endpoint for your Text Analytics resource on the azure portal. They will be located on the resource's **Quick start** page, under **resource management**. 

#### [Version 3.0-preview](#tab/version-3)

[Named Entity Recognition v3 reference](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0-Preview-1/operations/EntitiesRecognitionGeneral)

Version 3 uses separate endpoints for NER and entity linking requests. Use a URL format below based on your request:

NER
* General entities - `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/recognition/general`

* Personal information entities - `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/recognition/pii`

Entity linking
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/linking`

#### [Version 2.1](#tab/version-2)

[Named Entity Recognition (NER) v2 reference](https://eastus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/5ac4251d5b4ccd1554da7634)

Version 2 uses the following endpoint for entity linking and NER requests: 

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v2.1/entities`

---

Set a request header to include your Text Analytics API key. In the request body, provide the JSON documents you prepared.

### Example NER request 

The following is an example of content you might send to the API. The request format is the same for both versions of the API.

```json
{
  "documents": [
    {
      "language": "en",
      "id": "1",
      "text": "I had a wonderful trip to Seattle last week."
    }
  ]
}
```

## Post the request

Analysis is performed upon receipt of the request. See the [data limits](../overview.md#data-limits) section in the overview for information on the size and number of requests you can send per minute and second.

The Text Analytics API is stateless. No data is stored in your account, and results are returned immediately in the response.

## View results

All POST requests return a JSON formatted response with the IDs and detected entity properties.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort, search, and manipulate the data. Due to multilingual and emoji support, the response may contain text offsets. See [how to process text offsets](../concepts/text-offsets.md) for more information.

#### [Version 3.0-preview)](#tab/version-3)

### Example v3 responses

Version 3 provides separate endpoints for NER and entity linking. The responses for both operations are below. 

#### Example NER response

```json
{
    "documents": [{
    "id": "1",
    "entities": [{
        "text": "Seattle",
        "type": "Location",
        "offset": 26,
        "length": 7,
        "score": 0.80624294281005859
    }, {
        "text": "last week",
        "type": "DateTime",
        "subtype": "DateRange",
        "offset": 34,
        "length": 9,
        "score": 0.8
    }]
    }],
    "errors": [],
    "modelVersion": "2019-10-01"
}
```

#### Example entity linking response

```json
{
  "documents": [{
    "id": "1",
    "entities": [{
      "name": "Seattle",
      "matches": [{
        "text": "Seattle",
        "offset": 26,
        "length": 7,
        "score": 0.15046201222847677
      }],
      "language": "en",
      "id": "Seattle",
      "url": "https://en.wikipedia.org/wiki/Seattle",
      "dataSource": "Wikipedia"
    }]
  }],
  "errors": [],
  "modelVersion": "2019-10-01"
}
```

#### [Version 2.1](#tab/version-2)

### Example NER v2 response
```json
{
  "documents": [{
    "id": "1",
    "entities": [{
      "name": "Seattle",
      "matches": [{
        "wikipediaScore": 0.15046201222847677,
        "entityTypeScore": 0.80624294281005859,
        "text": "Seattle",
        "offset": 26,
        "length": 7
      }],
      "wikipediaLanguage": "en",
      "wikipediaId": "Seattle",
      "wikipediaUrl": "https://en.wikipedia.org/wiki/Seattle",
      "bingId": "5fbba6b8-85e1-4d41-9444-d9055436e473",
      "type": "Location"
    }, {
      "name": "last week",
      "matches": [{
        "entityTypeScore": 0.8,
        "text": "last week",
        "offset": 34,
        "length": 9
      }],
      "type": "DateTime",
      "subType": "DateRange"
    }]
  }],
  "errors": []
}
```

---

## Summary

In this article, you learned concepts and workflow for entity linking using Text Analytics in Cognitive Services. In summary:

* Named Entity Recognition is available for selected languages in two versions.
* JSON documents in the request body include an ID, text, and language code.
* POST requests are sent to one or more endpoints, using a personalized [access key and an endpoint](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) that is valid for your subscription.
* Response output, which consists of linked entities (including confidence scores, offsets, and web links, for each document ID) can be used in any application

## Next steps

* [Text Analytics overview](../overview.md)
* [Using the Text Analytics client library](../quickstarts/text-analytics-sdk.md)
* [What's new](../whats-new.md)
