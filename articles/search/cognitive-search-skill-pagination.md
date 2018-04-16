---
title: Microsoft.Skills.Text.Pagination cognitive search skill (Azure Search) | Microsoft Docs
description: Break text into chunks or pages of text based on length in an Azure Search augmentation pipeline. 
services: search
manager: pablocas
author: luiscabrer
documentationcenter: ''

ms.assetid: 
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 05/01/2018
ms.author: luisca
---
#	Microsoft.Skills.Text.Pagination cognitive skill

The pagination skill breaks text into chunks or pages of text. You can specify the desired maximum page length. This skill is especially useful if there are maximum text length requirements in other skills downstream. 

## @odata.type  
Microsoft.Skills.Text.PaginationSkill 

## Skill Parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| defaultLanguageCode	| One of the following: da, de, en, es, fi, fr, it, ko, pt-br, pt  |
| maximumPageLength	| Maximum page length as measured by String.Length. The minimum value is 100. |

##	Sample definition

The `languageCode` input is optional. Providing it is useful if you want to avoid cutting a word in half for non-space languages such as Chinese, Japanese, and Korean.

```json
{
    "@odata.type": "#Microsoft.Skills.Text.PaginationSkill",
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
        "name": "pages",
        "targetName": "mypages"
      }
    ]
  }

```
##	Sample Input

```json
{
    "values": 
    [
      {
        "recordId": "1",
        "data":
           {
             "text": "This is a the loan application for Joe Romero, he is a Microsoft employee who was born in Chile and then moved to Australia…",
             "languageCode": "en"
           }
      },
      {
        "recordId": "2",
        "data":
           {
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
        "data" : {
               "pages": [
                 "This is the loan…", 
                 "On the second page we…" ]
                }
      },
      {
        "recordId": "2",
        "data" : {
               "pages": [
                 "This is the second document...",
                 "On the second page of the second doc…" ]
                }
      }
    ]
}
```


## Error cases
If a language is not supported, an error is generated and no output is returned.

## See also

+ [Predefined skills](cognitive-search-predefined-skills.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
