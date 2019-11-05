---
title: Use entity recognition with the Text Analytics API
titleSuffix: Azure Cognitive Services
description: Learn how to recognize entities using the Text Analytics REST API.
services: cognitive-services
author: aahill

manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 10/21/2019
ms.author: aahi
---

# How to use Named Entity Recognition in Text Analytics

The [Named Entity Recognition API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/5ac4251d5b4ccd1554da7634) takes unstructured text, and for each JSON document, returns a list of disambiguated entities with links to more information on the web (Wikipedia and Bing).

## Entity Linking and Named Entity Recognition

The Text Analytics' `entities` endpoint supports both named entity recognition (NER) and entity linking.

### Entity Linking
Entity linking is the ability to identify and disambiguate the identity of an entity found in text (for example, determining whether the "Mars" is being used as the planet or as the Roman god of war). This process requires the presence of a knowledge base to which recognized entities are linked - Wikipedia is used as the knowledge base for the `entities` endpoint Text Analytics.

### Named Entity Recognition (NER)
Named entity recognition (NER) is the ability to identify different entities in text and categorize them into pre-defined classes, or types. 

## Named Entity Recognition v3 public preview

The [next version of Named Entity Recognition](https://cognitiveusw2ppe.portal.azure-api.net/docs/services/TextAnalytics-v3-0-Preview-1/operations/56f30ceeeda5650db055a3c7/console) is now available for public preview. It provides updates to both entity linking and Named Entity Recognition. 

:::row:::
    :::column span="":::
        **Feature**
    :::column-end:::
    ::: column span="":::
        **Description** 
    :::column-end:::
:::row-end:::
<!-- expanded types and subtypes row-->
:::row:::
    :::column span="":::
        Expanded entity types and subtypes
    :::column-end:::
    :::column span="":::
     Expanded classification and detection for several named entity types.
    :::column-end:::
:::row-end:::
<!-- separate endpoints row-->
:::row:::
    :::column span="":::
        Separate request endpoints 
    :::column-end:::
    :::column span="":::
        Separate endpoints for sending entity linking and NER requests.
    :::column-end:::
:::row-end:::
<!-- model-version row -->
:::row:::
    :::column span="":::
        `model-version` parameter
    :::column-end:::
    :::column span="":::
        An optional parameter for choosing a version of the Text Analytics model. Currently only the default model is available for use.
    :::column-end:::
:::row-end:::

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

## Supported Types for Named Entity Recognition v2

> [!NOTE]
> The following entities are supported by Named Entity Recognition(NER) version 2. [NER v3](#named-entity-recognition-v3-public-preview) is in public preview, and greatly expands the number and depth of the entities recognized in text.   

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

\* Depending on the input and extracted entities, certain entities may omit the `SubType`.  All the supported entity types listed are available only for the English, Chinese-Simplified, French, German, and Spanish languages.

### Language support

Using entity linking in various languages requires using a corresponding knowledge base in each language. For entity linking in Text Analytics, this means each language that is supported by the `entities` endpoint will link to the corresponding Wikipedia corpus in that language. Since the size of corpora varies between languages, it is expected that the entity linking functionality's recall will also vary. See the [language support](../language-support.md#sentiment-analysis-key-phrase-extraction-and-named-entity-recognition) article for more information.

## Preparation

You must have JSON documents in this format: ID, text, language

For currently supported languages, see [this list](../text-analytics-supported-languages.md).

Document size must be under 5,120 characters per document, and you can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request. The following example is an illustration of content you might submit to the entity linking end.

```json
    {
        "documents": [
            {
                "id": "1",
                "language": "en",
                "text": "Jeff bought three dozen eggs because there was a 50% discount."
            },
            {
                "id": "2",
                "language": "en",
                "text": "The Great Depression began in 1929. By 1933, the GDP in America fell by 25%."
            }
        ]
    }
```

## Step 1: Structure the request

Details on request definition can be found in [How to call the Text Analytics API](text-analytics-how-to-call-api.md). The following points are restated for convenience:

+ Create a **POST** request. Review the API documentation for this request: [Entities API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/5ac4251d5b4ccd1554da7634)

+ Set the HTTP endpoint for key phrase extraction by using either a Text Analytics resource on Azure or an instantiated [Text Analytics container](text-analytics-how-to-install-containers.md). You must include `/text/analytics/v2.1/entities`. For example: `https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v2.1/entities`.

+ Set a request header to include [the access key](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource) for Text Analytics operations.

+ In the request body, provide the JSON documents collection you prepared for this analysis

> [!Tip]
> Use [Postman](text-analytics-how-to-call-api.md) or open the **API testing console** in the [documentation](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/5ac4251d5b4ccd1554da7634) to structure a request and POST it to the service.

## Step 2: Post the request

Analysis is performed upon receipt of the request. See the [data limits](../overview.md#data-limits) section in the overview for information on the size and number of requests you can send per minute and second.

Recall that the service is stateless. No data is stored in your account. Results are returned immediately in the response.

## Step 3: View results

All POST requests return a JSON formatted response with the IDs and detected properties.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort, search, and manipulate the data.

An example of the output for entity linking is shown next:

```json
    {
        "Documents": [
            {
                "Id": "1",
                "Entities": [
                    {
                        "Name": "Jeff",
                        "Matches": [
                            {
                                "Text": "Jeff",
                                "Offset": 0,
                                "Length": 4
                            }
                        ],
                        "Type": "Person"
                    },
                    {
                        "Name": "three dozen",
                        "Matches": [
                            {
                                "Text": "three dozen",
                                "Offset": 12,
                                "Length": 11
                            }
                        ],
                        "Type": "Quantity",
                        "SubType": "Number"
                    },
                    {
                        "Name": "50",
                        "Matches": [
                            {
                                "Text": "50",
                                "Offset": 49,
                                "Length": 2
                            }
                        ],
                        "Type": "Quantity",
                        "SubType": "Number"
                    },
                    {
                        "Name": "50%",
                        "Matches": [
                            {
                                "Text": "50%",
                                "Offset": 49,
                                "Length": 3
                            }
                        ],
                        "Type": "Quantity",
                        "SubType": "Percentage"
                    }
                ]
            },
            {
                "Id": "2",
                "Entities": [
                    {
                        "Name": "Great Depression",
                        "Matches": [
                            {
                                "Text": "The Great Depression",
                                "Offset": 0,
                                "Length": 20
                            }
                        ],
                        "WikipediaLanguage": "en",
                        "WikipediaId": "Great Depression",
                        "WikipediaUrl": "https://en.wikipedia.org/wiki/Great_Depression",
                        "BingId": "d9364681-98ad-1a66-f869-a3f1c8ae8ef8"
                    },
                    {
                        "Name": "1929",
                        "Matches": [
                            {
                                "Text": "1929",
                                "Offset": 30,
                                "Length": 4
                            }
                        ],
                        "Type": "DateTime",
                        "SubType": "DateRange"
                    },
                    {
                        "Name": "By 1933",
                        "Matches": [
                            {
                                "Text": "By 1933",
                                "Offset": 36,
                                "Length": 7
                            }
                        ],
                        "Type": "DateTime",
                        "SubType": "DateRange"
                    },
                    {
                        "Name": "Gross domestic product",
                        "Matches": [
                            {
                                "Text": "GDP",
                                "Offset": 49,
                                "Length": 3
                            }
                        ],
                        "WikipediaLanguage": "en",
                        "WikipediaId": "Gross domestic product",
                        "WikipediaUrl": "https://en.wikipedia.org/wiki/Gross_domestic_product",
                        "BingId": "c859ed84-c0dd-e18f-394a-530cae5468a2"
                    },
                    {
                        "Name": "United States",
                        "Matches": [
                            {
                                "Text": "America",
                                "Offset": 56,
                                "Length": 7
                            }
                        ],
                        "WikipediaLanguage": "en",
                        "WikipediaId": "United States",
                        "WikipediaUrl": "https://en.wikipedia.org/wiki/United_States",
                        "BingId": "5232ed96-85b1-2edb-12c6-63e6c597a1de",
                        "Type": "Location"
                    },
                    {
                        "Name": "25",
                        "Matches": [
                            {
                                "Text": "25",
                                "Offset": 72,
                                "Length": 2
                            }
                        ],
                        "Type": "Quantity",
                        "SubType": "Number"
                    },
                    {
                        "Name": "25%",
                        "Matches": [
                            {
                                "Text": "25%",
                                "Offset": 72,
                                "Length": 3
                            }
                        ],
                        "Type": "Quantity",
                        "SubType": "Percentage"
                    }
                ]
            }
        ],
        "Errors": []
    }
```

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
