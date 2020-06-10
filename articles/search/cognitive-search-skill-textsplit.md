---
title: Text split cognitive skill
titleSuffix: Azure Cognitive Search
description: Break text into chunks or pages of text based on length in an AI enrichment pipeline in Azure Cognitive Search. 

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/04/2020
---
# Text split cognitive skill

The **Text Split** skill breaks text into chunks of text. You can specify whether you want to break the text into sentences or into pages of a particular length. This skill is especially useful if there are maximum text length requirements in other skills downstream. 

> [!NOTE]
> This skill is not bound to a Cognitive Services API and you are not charged for using it. You should still [attach a Cognitive Services resource](cognitive-search-attach-cognitive-services.md), however, to override the **Free** resource option that limits you to a small number of daily enrichments per day.

## @odata.type  
Microsoft.Skills.Text.SplitSkill 

## Skill Parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| textSplitMode      | Either "pages" or "sentences" | 
| maximumPageLength	| If textSplitMode is set to "pages", this refers to the maximum page length as measured by `String.Length`. The minimum value is 300.  If the textSplitMode is set to "pages", the algorithm will try to split the text into chunks that are at most "maximumPageLength" in size. In this case, the algorithm will do its best to break the sentence on a sentence boundary, so the size of the chunk may be slightly less than "maximumPageLength". | 
| defaultLanguageCode	| (optional) One of the following language codes: `da, de, en, es, fi, fr, it, ko, pt`. Default is English (en). Few things to consider:<ul><li>If you pass a languagecode-countrycode format, only the languagecode part of the format is used.</li><li>If the language is not in the previous list, the split skill breaks the text at character boundaries.</li><li>Providing a language code is useful to avoid cutting a word in half for non-whitespace languages such as Chinese, Japanese, and Korean.</li><li>If you do not know the language (i.e. you need to split the text for input into the [LanguageDetectionSkill](cognitive-search-skill-language-detection.md)), the default of English (en) should be sufficient. </li></ul>  |


## Skill Inputs

| Parameter name	   | Description      |
|----------------------|------------------|
| text	| The text to split into substring. |
| languageCode	| (Optional) Language code for the document. If you do not know the language (i.e. you need to split the text for input into the [LanguageDetectionSkill](cognitive-search-skill-language-detection.md)), it is safe to remove this input.  |

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
                "text": "This is a the loan application for Joe Romero, a Microsoft employee who was born in Chile and who then moved to Australia…",
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

+ [Built-in skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
