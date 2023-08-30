---
title: How to perform language detection
titleSuffix: Azure AI services
description: This article will show you how to detect the language of written text using language detection.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/01/2022
ms.author: jboback
ms.custom: language-service-language-detection, ignite-fall-2021
---

# How to use language detection

The Language Detection feature can evaluate text, and return a language identifier that indicates the language a document was written in.

Language detection is useful for content stores that collect arbitrary text, where language is unknown. You can parse the results of this analysis to determine which language is used in the input document. The response also returns a score between 0 and 1 that reflects the confidence of the model.

The Language Detection feature can detect a wide range of languages, variants, dialects, and some regional or cultural languages.

## Development options

[!INCLUDE [development options](../includes/development-options.md)]

## Determine how to process the data (optional)

### Specify the language detection model

By default, language detection will use the latest available AI model on your text. You can also configure your API requests to use a specific [model version](../../concepts/model-lifecycle.md).

### Input languages

When you submit documents to be evaluated, language detection will attempt to determine if the text was written in any of [the supported languages](../language-support.md).  

If you have content expressed in a less frequently used language, you can try the Language Detection feature to see if it returns a code. The response for languages that can't be detected is `unknown`.

## Submitting data

> [!TIP]
> You can use a [Docker container](use-containers.md)for language detection, so you can use the API on-premises.

Analysis is performed upon receipt of the request. Using the language detection feature synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

[!INCLUDE [asynchronous-result-availability](../../includes/async-result-availability.md)]


## Getting language detection results

When you get results from language detection, you can stream the results to an application or save the output to a file on the local system.

Language detection will return one predominant language for each document you submit, along with it's [ISO 639-1](https://www.iso.org/standard/22109.html) name, a human-readable name, and a confidence score. A positive score of 1 indicates the highest possible confidence level of the analysis.

### Ambiguous content

In some cases it may be hard to disambiguate languages based on the input. You can use the `countryHint` parameter to specify an [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country/region code. By default the API uses "US" as the default country hint. To remove this behavior, you can reset this parameter by setting this value to empty string `countryHint = ""` .

For example, "communication" is common to both English and French and if given with limited context the response will be based on the "US" country/region hint. If the origin of the text is known to be coming from France that can be given as a hint.

**Input**

```json
{
    "documents": [
        {
            "id": "1",
            "text": "communication"
        },
        {
            "id": "2",
            "text": "communication",
            "countryHint": "fr"
        }
    ]
}
```

The language detection model now has additional context to make a better judgment: 

**Output**

```json
{
    "documents":[
        {
            "detectedLanguage":{
                "confidenceScore":0.62,
                "iso6391Name":"en",
                "name":"English"
            },
            "id":"1",
            "warnings":[
                
            ]
        },
        {
            "detectedLanguage":{
                "confidenceScore":1.0,
                "iso6391Name":"fr",
                "name":"French"
            },
            "id":"2",
            "warnings":[
                
            ]
        }
    ],
    "errors":[
        
    ],
    "modelVersion":"2022-10-01"
}
```

If the analyzer can't parse the input, it returns `(Unknown)`. An example is if you submit a text string that consists solely of numbers.

```json
{
    "documents": [
        {
            "id": "1",
            "detectedLanguage": {
                "name": "(Unknown)",
                "iso6391Name": "(Unknown)",
                "confidenceScore": 0.0
            },
            "warnings": []
        }
    ],
    "errors": [],
    "modelVersion": "2021-01-05"
}
```

### Mixed-language content

Mixed-language content within the same document returns the language with the largest representation in the content, but with a lower positive rating. The rating reflects the marginal strength of the assessment. In the following example, input is a blend of English, Spanish, and French. The analyzer counts characters in each segment to determine the predominant language.

**Input**

```json
{
    "documents": [
        {
            "id": "1",
            "text": "Hello, I would like to take a class at your University. ¿Se ofrecen clases en español? Es mi primera lengua y más fácil para escribir. Que diriez-vous des cours en français?"
        }
    ]
}
```

**Output**

The resulting output consists of the predominant language, with a score of less than 1.0, which indicates a weaker level of confidence.

```json
{
    "documents": [
        {
            "id": "1",
            "detectedLanguage": {
                "name": "Spanish",
                "iso6391Name": "es",
                "confidenceScore": 0.88
            },
            "warnings": []
        }
    ],
    "errors": [],
    "modelVersion": "2021-01-05"
}
```

## Service and data limits

[!INCLUDE [service limits article](../../includes/service-limits-link.md)]

## See also

* [Language detection overview](../overview.md)
