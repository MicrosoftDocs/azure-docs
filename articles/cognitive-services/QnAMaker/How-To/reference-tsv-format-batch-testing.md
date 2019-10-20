---
title: Batch test TSV format - QnA Maker
titleSuffix: Azure Cognitive Services
description: Understand the TSV format for batch testing
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: reference
ms.date: 10/20/2019
ms.author: diberry
---

# Batch testing TSV format

Use the following information to understand and implement the TSV format for batch testing. 

## TSV input fields

|TSV input file fields|Notes|
|--|--|
|KBID||
|Question||
|Metadata tags|optional|
|Top parameter|optional| 
|Expected answer ID|optional|

## TSV output fields 

|TSV Output file parameters|Notes|
|KBID||
|Question||
|Answer||
|Answer ID||
|Score||
|Metadata tags|associated with returned answer|
|Expected answer ID|optional (only when expected answer ID is given)|
|Judgement label|optional-values could be Correct/ Incorrect (only when expected answer is given)|
