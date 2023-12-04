---
title: Text split skill
titleSuffix: Azure AI Search
description: Break text into chunks or pages of text based on length in an AI enrichment pipeline in Azure AI Search.
author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 10/25/2023
---

# Text split cognitive skill

The **Text Split** skill breaks text into chunks of text. You can specify whether you want to break the text into sentences or into pages of a particular length. This skill is especially useful if there are maximum text length requirements in other skills downstream. 

> [!NOTE]
> This skill isn't bound to Azure AI services. It's non-billable and has no Azure AI services key requirement.

## @odata.type  
Microsoft.Skills.Text.SplitSkill 

## Skill Parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| `textSplitMode`    | Either `pages` or `sentences`. Pages have a configurable maximum length, but the skill attempts to avoid truncating a sentence so the actual length might be smaller. Sentences are a string that terminates at sentence-ending punctuation, such as a period, question mark, or exclamation point, assuming the language has sentence-ending punctuation. | 
| `maximumPageLength` | Only applies if `textSplitMode` is set to `pages`. This parameter refers to the maximum page length in characters as measured by `String.Length`. The minimum value is 300, the maximum is 50000, and the default value is 5000.  The algorithm does its best to break the text on sentence boundaries, so the size of each chunk might be slightly less than `maximumPageLength`. | 
| `pageOverlapLength` | Only applies if `textSplitMode` is set to `pages`. Each page starts with this number of characters from the end of the previous page. If this parameter is set to 0, there's no overlapping text on successive pages. This parameter is supported in [2023-10-01-Preview](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2023-10-01-preview&tabs=HTTP#splitskill&preserve-view=true) REST API and in Azure SDK beta packages that have been updated to support integrated vectorization. This [example](#example-for-chunking-and-vectorization) includes the parameter. |
| `maximumPagesToTake` | Only applies if `textSplitMode` is set to `pages`. Number of pages to return. The default is 0, which means to return all pages. You should set this value if only a subset of pages are needed. This parameter is supported in [2023-10-01-Preview](/rest/api/searchservice/skillsets/create-or-update?view=rest-searchservice-2023-10-01-preview&tabs=HTTP#splitskill&preserve-view=true) REST API and in Azure SDK beta packages that have been updated to support integrated vectorization. This [example](#example-for-chunking-and-vectorization) includes the parameter.|
| `defaultLanguageCode`	| (optional) One of the following language codes: `am, bs, cs, da, de, en, es, et, fr, he, hi, hr, hu, fi, id, is, it, ja, ko, lv, no, nl, pl, pt-PT, pt-BR, ru, sk, sl, sr, sv, tr, ur, zh-Hans`. Default is English (en). A few things to consider: <ul><li>Providing a language code is useful to avoid cutting a word in half for nonwhitespace languages such as Chinese, Japanese, and Korean.</li><li>If you don't know the language  in advance (for example, if you're using the [LanguageDetectionSkill](cognitive-search-skill-language-detection.md) to detect language), we recommend the `en` default. </li></ul>  |

## Skill Inputs

| Parameter name	   | Description      |
|----------------------|------------------|
| `text`	| The text to split into substring. |
| `languageCode`	| (Optional) Language code for the document. If you don't know the language of the text inputs (for example, if you're using [LanguageDetectionSkill](cognitive-search-skill-language-detection.md) to detect the language), you can omit this parameter. If you set `languageCode` to a language isn't in the supported list for the `defaultLanguageCode`, a warning is emitted and the text isn't split.  |

## Skill Outputs 

| Parameter name	 | Description |
|--------------------|-------------|
| `textItems`	| An array of substrings that were extracted. |

## Sample definition

```json
{
    "@odata.type": "#Microsoft.Skills.Text.SplitSkill",
    "textSplitMode" : "pages", 
    "maximumPageLength": 1000,
    "defaultLanguageCode": "en",
    "inputs": [
        {
            "name": "text",
            "source": "/document/content"
        },
        {
            "name": "languageCode",
            "source": "/document/language"
        }
    ],
    "outputs": [
        {
            "name": "textItems",
            "targetName": "mypages"
        }
    ]
}
```

## Sample input

```json
{
    "values": [
        {
            "recordId": "1",
            "data": {
                "text": "This is the loan application for Joe Romero, a Microsoft employee who was born in Chile and who then moved to Australia...",
                "languageCode": "en"
            }
        },
        {
            "recordId": "2",
            "data": {
                "text": "This is the second document, which will be broken into several pages...",
                "languageCode": "en"
            }
        }
    ]
}
```

## Sample output

```json
{
    "values": [
        {
            "recordId": "1",
            "data": {
                "textItems": [
                    "This is the loan...",
                    "In the next section, we continue..."
                ]
            }
        },
        {
            "recordId": "2",
            "data": {
                "textItems": [
                    "This is the second document...",
                    "In the next section of the second doc..."
                ]
            }
        }
    ]
}
```

## Example for chunking and vectorization

This example is for integrated vectorization, currently in preview. It adds preview-only parameters to the sample definition, and shows the resulting output. 

+ `pageOverlapLength`: Overlapping text is useful in [data chunking](vector-search-how-to-chunk-documents.md) scenarios because it preserves continuity between chunks generated from the same document. 

+ `maximumPagesToTake`: Limits on page intake are useful in [vectorization](vector-search-how-to-generate-embeddings.md) scenarios because it helps you stay under the maximum input limits of the embedding models providing the vectorization.

### Sample definition

This definition adds `pageOverlapLength` of 100 characters and `maximumPagesToTake` of one. 

Assuming the `maximumPageLength` is 5000 characters (the default), then `"maximumPagesToTake": 1` processes the first 5000 characters of each source document. 

```json
{
    "@odata.type": "#Microsoft.Skills.Text.SplitSkill",
    "textSplitMode" : "pages", 
    "maximumPageLength": 1000,
    "pageOverlapLength": 100,
    "maximumPagesToTake": 1,
    "defaultLanguageCode": "en",
    "inputs": [
        {
            "name": "text",
            "source": "/document/content"
        },
        {
            "name": "languageCode",
            "source": "/document/language"
        }
    ],
    "outputs": [
        {
            "name": "textItems",
            "targetName": "mypages"
        }
    ]
}
```

### Sample input (same as previous example)

```json
{
    "values": [
        {
            "recordId": "1",
            "data": {
                "text": "This is the loan application for Joe Romero, a Microsoft employee who was born in Chile and who then moved to Australia...",
                "languageCode": "en"
            }
        },
        {
            "recordId": "2",
            "data": {
                "text": "This is the second document, which will be broken into several sections...",
                "languageCode": "en"
            }
        }
    ]
}
```

### Sample output (notice the overlap)

Within each "textItems" array, trailing text from the first item is copied into the beginning of the second item.

```json
{
    "values": [
        {
            "recordId": "1",
            "data": {
                "textItems": [
                    "This is the loan...Here is the overlap part",
                    "Here is the overlap part...In the next section, we continue..."
                ]
            }
        },
        {
            "recordId": "2",
            "data": {
                "textItems": [
                    "This is the second document...Here is the overlap part...",
                    "Here is the overlap part...In the next section of the second doc..."
                ]
            }
        }
    ]
}
```

## Error cases

If a language isn't supported, a warning is generated.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
