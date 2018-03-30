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
#	Cognitive Skills: PaginationSkill

The pagination skill is used to break text into chunks or pages of text.  It allows you to specify the desired maximum page length.

This is especially useful if there are maximum text length requirements in other skills down the pipeline. 

## @odata.type  
Microsoft.Skills.Text.PaginationSkill 

## Parameters

| Parameter name	 | Description |
|--------------------|-------------|
| defaultLanguageCode	| One of the following: da,de,en,es, fi,fr,it,ko,pt-br,pt  |
| maximumPageLength	| Maximum page length as measured by String.Length The minimum value is 100. |

##	Sample definition

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
      { //optional
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
                 "One the second page we…" ]
                }
      },
      {
        "recordId": "2",
        "data" : {
               "pages": [
                 "This is the second document...",
                 "One the second page of the second doc…" ]
                }
      }
    ]
}
```


## Error cases
If a language provided is not supported, then an error will be generated, and no output will be generated.
