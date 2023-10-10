---
title: Text split cognitive skill
titleSuffix: Azure Cognitive Search
description: Break text into chunks or pages of text based on length in an AI enrichment pipeline in Azure Cognitive Search. 
author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.topic: reference
ms.date: 08/12/2021
---

# Text split cognitive skill

The **Text Split** skill breaks text into chunks of text. You can specify whether you want to break the text into sentences or into pages of a particular length. This skill is especially useful if there are maximum text length requirements in other skills downstream. 

> [!NOTE]
> This skill isn't bound to Azure AI services. It is non-billable and has no Azure AI services key requirement.

## @odata.type  
Microsoft.Skills.Text.SplitSkill 

## Skill Parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| `textSplitMode`    | Either `pages` or `sentences` | 
| `maximumPageLength` | Only applies if `textSplitMode` is set to `pages`. This parameter refers to the maximum page length in characters as measured by `String.Length`. The minimum value is 300, the maximum is 50000, and the default value is 5000.  The algorithm does its best to break the text on sentence boundaries, so the size of each chunk may be slightly less than `maximumPageLength`. | 
| `pageOverlapLength` | Only applies if `textSplitMode` is set to `pages`. If it's specificied (needs to be >= 0), (n+1)th page starts with this number of characters from the end of the nth page. If it's set to 0, it should behave the same as if this value isn't set. |
| `maximumPagesToTake` | Only applies if `textSplitMode` is set to `pages`. Number of pages to return. Default (0) to all pages. It can be used if only a partial number of pages is needed.
| `defaultLanguageCode`	| (optional) One of the following language codes: `am, bs, cs, da, de, en, es, et, fr, he, hi, hr, hu, fi, id, is, it, ja, ko, lv, no, nl, pl, pt-PT, pt-BR, ru, sk, sl, sr, sv, tr, ur, zh-Hans`. Default is English (en). Few things to consider:<ul><li>Providing a language code is useful to avoid cutting a word in half for nonwhitespace languages such as Chinese, Japanese, and Korean.</li><li>If you don't know the language (that is, you need to split the text for input into the [LanguageDetectionSkill](cognitive-search-skill-language-detection.md)), the default of English (en) should be sufficient. </li></ul>  |


## Skill Inputs

| Parameter name	   | Description      |
|----------------------|------------------|
| `text`	| The text to split into substring. |
| `languageCode`	| (Optional) Language code for the document. If you don't know the language (that is, you need to split the text for input into the [LanguageDetectionSkill](cognitive-search-skill-language-detection.md)), it's safe to remove this input. If the language isn't in the supported list for the `defaultLanguageCode` parameter above, a warning is emitted and the text won't be split.  |

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
                    "This is the loan...Here is the overlap part...",
                    "Here is the overlap part...On the second page we..."
                ]
            }
        },
        {
            "recordId": "2",
            "data": {
                "textItems": [
                    "This is the second document...Here is the overlap part...",
                    "Here is the overlap part...On the second page of the second doc..."
                ]
            }
        }
    ]
}
```

## Error cases
+ If a language isn't supported, a warning is generated.

## See also

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
