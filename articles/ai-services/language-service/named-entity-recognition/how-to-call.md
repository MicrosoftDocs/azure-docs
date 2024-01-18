---
title: How to perform Named Entity Recognition (NER)
titleSuffix: Azure AI services
description: This article will show you how to extract named entities from text.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
ms.author: jboback
ms.custom: language-service-ner, ignite-fall-2021
---


# How to use Named Entity Recognition (NER)

The NER feature can evaluate unstructured text, and extract named entities from text in several predefined categories, for example: person, location, event, product, and organization.  

## Development options

[!INCLUDE [development options](./includes/development-options.md)]

## Determine how to process the data (optional)

### Input languages

When you submit documents to be processed, you can specify which of [the supported languages](language-support.md) they're written in. if you don't specify a language, key phrase extraction defaults to English. The API may return offsets in the response to support different [multilingual and emoji encodings](../concepts/multilingual-emoji-support.md). 

## Submitting data

Analysis is performed upon receipt of the request. Using the NER feature synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

[!INCLUDE [asynchronous-result-availability](../includes/async-result-availability.md)]

The API attempts to detect the [defined entity categories](concepts/named-entity-categories.md) for a given document language. 

## Getting NER results

When you get results from NER, you can stream the results to an application or save the output to a file on the local system. The API response will include [recognized entities](concepts/named-entity-categories.md), including their categories and subcategories, and confidence scores. 

## Select which entities to be returned (Preview API only)

Starting with **API version 2023-04-15-preview**, the API attempts to detect the [defined entity types and tags](concepts/named-entity-categories.md) for a given document language. The entity types and tags replace the categories and subcategories structure the older models use to define entities for more flexibility. You can also specify which entities are detected and returned, use the optional `includeList` and `excludeList` parameters with the appropriate entity types. The following example would detect only `Location`. You can specify one or more [entity types](concepts/named-entity-categories.md) to be returned. Given the types and tags hierarchy introduced for this version, you have the flexibility to filter on different granularity levels as so:

**Input:**

> [!NOTE]
> In this example, it returns only the **Location** entity type.

```bash
{
    "kind": "EntityRecognition",
    "parameters": 
    {
        "includeList" :
        [
            "Location"
        ]
    },
    "analysisInput":
    {
        "documents":
        [
            {
                "id":"1",
                "language": "en",
                "text": "We went to Contoso foodplace located at downtown Seattle last week for a dinner party, and we adore the spot! They provide marvelous food and they have a great menu. The chief cook happens to be the owner (I think his name is John Doe) and he is super nice, coming out of the kitchen and greeted us all. We enjoyed very much dining in the place! The pasta I ordered was tender and juicy, and the place was impeccably clean. You can even pre-order from their online menu at www.contosofoodplace.com, call 112-555-0176 or send email to order@contosofoodplace.com! The only complaint I have is the food didn't come fast enough. Overall I highly recommend it!"
            }
        ]
    }
}

```

The above examples would return entities falling under the `Location` entity type such as the `GPE`, `Structural`, and `Geological` tagged entities as [outlined by entity types and tags](concepts/named-entity-categories.md). We could also further filter the returned entities by filtering using one of the entity tags for the `Location` entity type such as filtering over `GPE` tag only as outlined:

```bash

    "parameters": 
    {
        "includeList" :
        [
            "GPE"
        ]
    }
    
```

This method returns all `Location` entities only falling under the `GPE` tag and ignore any other entity falling under the `Location` type that is tagged with any other entity tag such as `Structural` or `Geological` tagged `Location` entities. We could also further drill down on our results by using the `excludeList` parameter. `GPE` tagged entities could be tagged with the following tags: `City`, `State`, `CountryRegion`, `Continent`. We could, for example, exclude `Continent` and `CountryRegion` tags for our example:

```bash

    "parameters": 
    {
        "includeList" :
        [
            "GPE"
        ],
        "excludeList": :
        [
            "Continent",
            "CountryRegion"
        ]
    }
    
```

Using these parameters we can successfully filter on only `Location` entity types, since the `GPE` entity tag included in the `includeList` parameter, falls under the `Location` type. We then filter on only Geopolitical entities and exclude any entities tagged with `Continent` or `CountryRegion` tags.

## Specify the NER model

By default, this feature uses the latest available AI model on your text. You can also configure your API requests to use a specific [model version](../concepts/model-lifecycle.md).

## Service and data limits

[!INCLUDE [service limits article](../includes/service-limits-link.md)]

## Next steps

[Named Entity Recognition overview](overview.md)
