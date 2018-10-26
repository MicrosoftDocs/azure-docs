---
title: Text split cognitive search skill (Azure Search) | Microsoft Docs
description: Break text into chunks or pages of text based on length in an Azure Search enrichment pipeline. 
services: search
manager: pablocas
author: luiscabrer

ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.date: 05/01/2018
ms.author: luisca
---
#	Text split cognitive skill

The **Text Split** skill breaks text into chunks of text. You can specify whether you want to break the text into sentences or into pages of a particular length. This skill is especially useful if there are maximum text length requirements in other skills downstream. 

> [!NOTE]
> Cognitive Search is in public preview. Skillset execution, and image extraction and normalization are currently offered for free. At a later time, the pricing for these capabilities will be announced. 

## @odata.type  
Microsoft.Skills.Text.SplitSkill 

## Skill Parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| textSplitMode      | Either "pages" or "sentences" | 
| maximumPageLength	| If textSplitMode is set to "pages", this refers to the maximum page length as measured by `String.Length`. The minimum value is 100. | 
| defaultLanguageCode	| (optional) One of the following language codes: `da, de, en, es, fi, fr, it, ko, pt`. Default is English (en). Few things to consider:<ul><li>If you pass a languagecode-countrycode format, only the languagecode part of the format is used.</li><li>If the language is not in the previous list, the split skill breaks the text at character boundaries.</li><li>Providing a language code is useful to avoid cutting a word in half for non-space languages such as Chinese, Japanese, and Korean.</li></ul>  |


## Skill Inputs

| Parameter name	   | Description      |
|----------------------|------------------|
| text	| The text to split into substring. |
| languageCode	| (Optional) Language code for the document.  |

## Skill Outputs 

| Parameter name	 | Description |
|--------------------|-------------|
| textItems	| An array of substrings that were extracted. |


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
                "text": "This is a the loan application for Joe Romero, he is a Microsoft employee who was born in Chile and then moved to Australia…",
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
If a language is not supported, a warning is generated and the text is split at character boundaries.

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
