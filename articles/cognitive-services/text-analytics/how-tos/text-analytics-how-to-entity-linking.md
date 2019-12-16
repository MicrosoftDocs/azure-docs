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
ms.date: 12/11/2019
ms.author: aahi
---

# How to use Named Entity Recognition in Text Analytics

The Text Analytics API's `entities` feature lets you takes unstructured text and returns a list of disambiguated entities, with links to more information on the web (Wikipedia and Bing). The endpoint supports both named entity recognition (NER) and entity linking.

### Entity Linking

Entity linking is the ability to identify and disambiguate the identity of an entity found in text (for example, determining whether an occurance of the word `Mars` refers to the planet, or to the Roman god of war). This process requires the presence of a knowledge base to which recognized entities are linked. Entity Linking uses [Wikipedia](https://www.wikipedia.org/) as this knowledge base.

### Named Entity Recognition (NER)

[Named Entity Recognition (NER)](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/5ac4251d5b4ccd1554da7634) is the ability to identify different entities in text and categorize them into pre-defined classes or types. For example: people, places and organizations.

## Named Entity Recognition versions and features

The Text Analytics API offers two versions of Named Entity Recognition - v2 and v3. Sentiment Analysis v3 (Public preview) provides increased detail in the entities that can be detected and categorized.

| Feature                                                         | Sentiment Analysis v2 | Sentiment Analysis v3 |
|-----------------------------------------------------------------|-----------------------|-----------------------|
| Methods for single, and batch requests                          | X                     | X                     |
| Basic entity recognition across several categories              | X                     | X                     |
| Expanded classification for named entities      |                       | X                     |
| Separate endpoints for sending entity linking and NER requests. |                       | X                     |
| Model versioning                                                |                       | X                     |


### Language support

Using entity linking in various languages requires using a corresponding knowledge base in each language. For entity linking in Text Analytics, this means each language that is supported by the `entities` endpoint will link to the corresponding Wikipedia corpus in that language. Since the size of corpora varies between languages, it is expected that the entity linking feature's recall will also vary. See the [language support](../language-support.md#sentiment-analysis-key-phrase-extraction-and-named-entity-recognition) article for more information.

#### [Version 2](#tab/version-2)

### Supported Types for Named Entity Recognition v2

> [!NOTE]
> The following entities are supported by Named Entity Recognition(NER) version 2. NER v3 is in public preview, and greatly expands the number and depth of the entities recognized in text.   

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

#### [Version 3 (Public preview)](#tab/version-3)

### Entity types

Named Entity Recognition v3 provides expanded detection across multiple types. Currently, NER v3 can recognize the following categories of entities. For a detailed list of supported entities and languages, see the [Named entity types](../named-entity-types.md) article.

* General
* Personal Information 

### Request endpoints

Named Entity Recognition v3 uses separate endpoints for NER and entity linking requests. Use a URL format below based on your request:

NER
* General entities - `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/recognition/general`

* Personal information entities - `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/recognition/pii`

Entity linking
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/linking`

### Model versioning

[!INCLUDE [v3-model-versioning](../includes/model-versioning.md)]

---

## Sending a REST API request

### Preparation

You must have JSON documents in this format: ID, text, language

For currently supported languages, see [this list](../text-analytics-supported-languages.md).

Document size must be under 5,120 characters per document, and you can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request. The following example is an illustration of content you might submit to the entity linking end.

### Structure the request

Create a POST request. You can [use Postman](text-analytics-how-to-call-api.md) or the following **API testing console** links to quickly structure and send one. 
    
* [Named Entity Linking v2](https://eastus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/5ac4251d5b4ccd1554da7634)
* [Named Entity Linking v3](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0-Preview-1/operations/EntitiesRecognitionGeneral)

Set the endpoint by using either a Text Analytics resource on Azure or an instantiated [Text Analytics container](text-analytics-how-to-install-containers.md). You must include the correct URL for the version you want to use. For example:
    
[!INCLUDE [text-analytics-find-resource-information](../includes/find-azure-resource-info.md)]

#### [Version 2](#tab/version-2)

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v2.1/entities`

#### [Version 3 (Public preview)](#tab/version-3)

Named Entity Recognition v3 uses separate endpoints for NER and entity linking requests. Use a URL format below based on your request:

NER
* General entities - `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/recognition/general`

* Personal information entities - `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/recognition/pii`

Entity linking
* `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/entities/linking`

---

Set a request header to include your Text Analytics API key. In the request body, provide the JSON documents collection you prepared for this analysis.

### Example Sentiment Analysis request 

The following is an example of content you might submit for entity recognition. The request format is the same for both versions of the API.

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

## Step 2: Post the request

Analysis is performed upon receipt of the request. See the [data limits](../overview.md#data-limits) section in the overview for information on the size and number of requests you can send per minute and second.

The Text Analytics API is stateless. No data is stored in your account, and results are returned immediately in the response.

## Step 3: View results

All POST requests return a JSON formatted response with the IDs and detected properties.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort, search, and manipulate the data.

An example of the output for entity linking is shown below:

#### [Version 2](#tab/version-2)

### Example v2 response
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

#### [Version 3 (Public preview)](#tab/version-3)

### Example v3 response

Version 3 provides separate endpoints for NER and entity linking.

### Example NER response

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
### Example entity linking response
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

---

## Summary

In this article, you learned concepts and workflow for entity linking using Text Analytics in Cognitive Services. In summary:

+ [Entities API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/5ac4251d5b4ccd1554da7634) is available for selected languages.
+ JSON documents in the request body include an ID, text, and language code.
+ POST request is to a `/entities` endpoint, using a personalized [access key and an endpoint](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) that is valid for your subscription.
+ Response output, which consists of linked entities (including confidence scores, offsets, and web links, for each document ID) can be used in any application

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/5ac4251d5b4ccd1554da7634)

* [Text Analytics overview](../overview.md)
* [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)</br>
* [Text Analytics product page](//go.microsoft.com/fwlink/?LinkID=759712)
