---
title: Text split cognitive skill
titleSuffix: Azure Cognitive Search
description: Break text into chunks or pages of text based on length in an AI enrichment pipeline in Azure Cognitive Search. 
author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
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
| `textSplitMode`    | Either `pages` or `sentences` | 
| `maximumPageLength` | Only applies if `textSplitMode` is set to `pages`. This parameter refers to the maximum page length in characters as measured by `String.Length`. The minimum value is 300, the maximum is 50000, and the default value is 5000.  The algorithm does its best to break the text on sentence boundaries, so the size of each chunk might be slightly less than `maximumPageLength`. | 
| `pageOverlapLength` | Only applies if `textSplitMode` is set to `pages`. Each page starts with this number of characters from the end of the previous page. If this parameter is set to 0, there is no overlapping text on successive pages. This parameter is supported in [2023-10-01-Preview](/rest/api/searchservice/2023-10-01-preview/skillsets/create-or-update#splitskill) REST API and in Azure SDK beta packages that have been updated to support integrated vectorization. |
| `maximumPagesToTake` | Only applies if `textSplitMode` is set to `pages`. Number of pages to return. The default is 0, which means return all pages. You should set this value if only a subset of pages are needed. This parameter is supported in [2023-10-01-Preview](/rest/api/searchservice/2023-10-01-preview/skillsets/create-or-update#splitskill) REST API and in Azure SDK beta packages that have been updated to support integrated vectorization.|
| `defaultLanguageCode`	| (optional) One of the following language codes: `am, bs, cs, da, de, en, es, et, fr, he, hi, hr, hu, fi, id, is, it, ja, ko, lv, no, nl, pl, pt-PT, pt-BR, ru, sk, sl, sr, sv, tr, ur, zh-Hans`. Default is English (en). A few things to consider: <ul><li>Providing a language code is useful to avoid cutting a word in half for nonwhitespace languages such as Chinese, Japanese, and Korean.</li><li>If you don't know the language  in advance (for example, if you're using the [LanguageDetectionSkill](cognitive-search-skill-language-detection.md) to detect language), we recommend the `en` default. </li></ul>  |

## Skill Inputs

| Parameter name	   | Description      |
|----------------------|------------------|
| `text`	| The text to split into substring. |
| `languageCode`	| (Optional) Language code for the document. If you don't know the language of the text inputs (for example, if you're using [LanguageDetectionSkill](cognitive-search-skill-language-detection.md) to detect the language), you can omit this parameter. If you set `languageCode` to a language isn't in the supported list for the `defaultLanguageCode`, a warning is emitted and the text won't be split.  |

## Skill Outputs 

| Parameter name	 | Description |
|--------------------|-------------|
| `textItems`	| An array of substrings that were extracted. |


##	Sample definition

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

##	Sample Input

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

##	Sample Output

```json
{
    "values": [
        {
            "recordId": "1",
            "data": {
                "textItems": [
                    "This is the loan…",
                    "On the second page we…"
                ]
            }
        },
        {
            "recordId": "2",
            "data": {
                "textItems": [
                    "This is the second document...",
                    "On the second page of the second doc…"
                ]
            }
        }
    ]
}
```

## Error cases
<<<<<<< HEAD

If a language isn't supported, a warning is generated.
=======
If a language is not supported, a warning is generated.
>>>>>>> bcb80c40fa26e07aec1ba197d5dcc57bd58aeafb

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
