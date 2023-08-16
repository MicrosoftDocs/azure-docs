---
title: How to detect Personally Identifiable Information (PII)
titleSuffix: Azure AI services
description: This article will show you how to extract PII and health information (PHI) from text and detect identifiable information.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 07/27/2022
ms.author: jboback
ms.custom: language-service-pii, ignite-fall-2021
---


# How to detect and redact Personally Identifying Information (PII)

The PII feature can evaluate unstructured text, extract and redact sensitive information (PII) and health information (PHI) in text across several [pre-defined categories](concepts/entity-categories.md).


## Development options

[!INCLUDE [development options](./includes/development-options.md)]

## Determine how to process the data (optional)

### Specify the PII detection model

By default, this feature will use the latest available AI model on your text. You can also configure your API requests to use a specific [model version](../concepts/model-lifecycle.md).

### Input languages

When you submit documents to be processed, you can specify which of [the supported languages](language-support.md) they're written in. if you don't specify a language, extraction will default to English. The API may return offsets in the response to support different [multilingual and emoji encodings](../concepts/multilingual-emoji-support.md). 

## Submitting data

Analysis is performed upon receipt of the request. Using the PII detection feature synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

[!INCLUDE [asynchronous-result-availability](../includes/async-result-availability.md)]

## Select which entities to be returned

The API will attempt to detect the [defined entity categories](concepts/entity-categories.md) for a given document language. If you want to specify which entities will be detected and returned, use the optional `piiCategories` parameter with the appropriate entity categories. This parameter can also let you detect entities that aren't enabled by default for your document language. The following example would detect only `Person`. You can specify one or more [entity types](concepts/entity-categories.md) to be returned.

> [!TIP]
> If you don't include `default` when specifying entity categories, The API will only return the entity categories you specify.

**Input:**

> [!NOTE]
> In this example, it will return only **person** entity type:

`https://<your-language-resource-endpoint>/language/:analyze-text?api-version=2022-05-01`

```bash
{
    "kind": "PiiEntityRecognition",
    "parameters": 
    {
        "modelVersion": "latest",
        "piiCategories" :
        [
            "Person"
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

**Output:**

```bash

{
    "kind": "PiiEntityRecognitionResults",
    "results": {
        "documents": [
            {
                "redactedText": "We went to Contoso foodplace located at downtown Seattle last week for a dinner party, and we adore the spot! They provide marvelous food and they have a great menu. The chief cook happens to be the owner (I think his name is ********) and he is super nice, coming out of the kitchen and greeted us all. We enjoyed very much dining in the place! The pasta I ordered was tender and juicy, and the place was impeccably clean. You can even pre-order from their online menu at www.contosofoodplace.com, call 112-555-0176 or send email to order@contosofoodplace.com! The only complaint I have is the food didn't come fast enough. Overall I highly recommend it!",
                "id": "1",
                "entities": [
                    {
                        "text": "John Doe",
                        "category": "Person",
                        "offset": 226,
                        "length": 8,
                        "confidenceScore": 0.98
                    }
                ],
                "warnings": []
            }
        ],
        "errors": [],
        "modelVersion": "2021-01-15"
    }
}
```

## Getting PII results

When you get results from PII detection, you can stream the results to an application or save the output to a file on the local system. The API response will include [recognized entities](concepts/entity-categories.md), including their categories and subcategories, and confidence scores. The text string with the PII entities redacted will also be returned.

## Service and data limits

[!INCLUDE [service limits article](../includes/service-limits-link.md)]

## Next steps

[Named Entity Recognition overview](overview.md)
