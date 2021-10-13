---
title: How to perform language detection 
titleSuffix: Azure Cognitive Services
description: This article will show you how to detect the language of written text, using Azure Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: sample
ms.date: 11/02/2021
ms.author: aahi
---

# How to use language detection

The Language Detection feature can evaluate text, and return a language identifier that indicates the language a document was written in.

Language detection is useful for content stores that collect arbitrary text, where language is unknown. You can parse the results of this analysis to determine which language is used in the input document. The response also returns a score between 0 and 1 that reflects the confidence of the model.

The Language Detection feature can detect a wide range of languages, variants, dialects, and some regional or cultural languages.

> [!TIP]
> If you want to start using this feature, you can follow the [quickstart article](../quickstart.md) to get started. You can also make example requests using [Language Studio](../../language-studio.md) without needing to write code.

## Determine how to process the data (optional)

### Specify the language detection model

By default, language detection will use the latest available AI model on your text. You can also configure your API requests to use a previous model version, if you determine one performs better on your data. The model you specify will be used to perform language detection operations.

| Supported Versions | latest version |
|--|--|
|  `2019-10-01`, `2020-07-01`, `2020-09-01`, `2021-01-05` | `2021-01-05`   |

### Input languages

When you submit documents to be evaluated, language detection will attempt to determine if the text was written in any of [the supported languages](../language-support.md).  

If you have content expressed in a less frequently used language, you can try the Language Detection feature to see if it returns a code. The response for languages that can't be detected is `unknown`.

## Submitting data

> [!TIP]
> You can use a [Docker container](use-containers.md)for language detection, so you can use the API on-premises.

Analysis is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the data limits below.

Using the language detection feature synchronously is stateless. No data is stored in your account, and results are returned immediately in the response.

When using this feature asynchronously, the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.


## Getting language detection results

When you get results from language detection, you can stream the results to an application or save the output to a file on the local system.

Language detection will return one predominant language for each document you submit, along with it's [ISO 639-1](https://www.iso.org/standard/22109.html) name, a human-readable name, and a confidence score. A positive score of 1 indicates the highest possible confidence level of the analysis.

### Ambiguous content

In some cases it may be hard to disambiguate languages based on the input. You can use the `countryHint` parameter to specify an [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country/region code. By default the API uses "US" as the default country hint. To remove this behavior, you can reset this parameter by setting this value to empty string `countryHint = ""` .

For example, "Impossible" is common to both English and French and if given with limited context the response will be based on the "US" country/region hint. If the origin of the text is known to be coming from France that can be given as a hint.

**Input**

```json
{
    "documents": [
        {
            "id": "1",
            "text": "impossible"
        },
        {
            "id": "2",
            "text": "impossible",
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
    "modelVersion":"2020-09-01"
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

## Data limits

> [!NOTE]
> * If you need to analyze larger documents than the limit allows, you can break the text into smaller chunks of text before sending them to the API. 
> * A document is a single string of text characters.  

| Limit | Value |
|------------------------|---------------|
| Maximum size of a single document (synchronous) | 5,120 characters as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum number of characters per request (asynchronous)  | 125K characters across all submitted documents, as measured by [StringInfo.LengthInTextElements](/dotnet/api/system.globalization.stringinfo.lengthintextelements). |
| Maximum size of entire request | 1 MB.  |
| Max Documents Per Request | 1000 |

If a document exceeds the character limit, the API will behave differently depending on the endpoint you're using:

* Asynchronous: The API will reject the entire request and return a `400 bad request` error if any document within it exceeds the maximum size.
* Synchronous:  The API won't process a document that exceeds the maximum size, and will return an invalid document error for it. If an API request has multiple documents, the API will continue processing them if they are within the character limit.

### Rate limits

Your rate limit will vary with your [pricing tier](https://aka.ms/unifiedLanguagePricing).

| Tier          | Requests per second | Requests per minute |
|---------------|---------------------|---------------------|
| S / Multi-service | 1000                | 1000                |
| S0 / F0         | 100                 | 300                 |

## See also

* [Language detection overview](../overview.md)