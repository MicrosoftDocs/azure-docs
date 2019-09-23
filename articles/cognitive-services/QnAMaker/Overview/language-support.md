---
title: Language support - QnA Maker
titleSuffix: Azure Cognitive Services
description: The language of a knowledge base affects QnA Maker's ability to auto-extract questions and answers from sources, as well as the relevance of the results QnA Maker provides in response to user queries. A list of culture, natural languages supported by QnA Maker for your knowledge base. Do not mix languages in the same knowledge base.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: reference
ms.date: 09/23/2019
ms.author: diberry
---
# Language support for QnA Maker

The language of the first knowledge base affects QnA Maker's ability to auto-extract questions and answers from [sources](../Concepts/data-sources-supported.md) of all knowledge bases in that resource, as well as the relevance of the results QnA Maker provides in response to user queries.

## One language for all knowledge bases 

QnA Maker allows you to select the language for your QnA service, while creating the first knowledge base. For all the knowledge bases in a QnA Maker resource, they all must be in the same language.  

Creating multiple knowledge bases in one service negatively affects the relevance of the results QnA Maker provides in response to user queries.

Language select is part of the first knowledge base created in a resource. 

## Verify language

You can verify the language of your QnA Maker resource from the service settings page in the Azure portal. 

## Query matching and relevance
QnA Maker depends on [language analyzers](https://docs.microsoft.com/rest/api/searchservice/language-support) in Azure search for providing results. 

While the Azure Search capabilities are on par for supported languages, QnA Maker has an additional ranker that sits above the Azure search results. In this ranker model, we use some special semantic and word-based features in the following languages. 

|Languages with additional ranker|
|--|
|Chinese|
|Czech|
|Dutch|
|English|
|French|
|German|
|Hungarian|
|Italian|
|Japanese|
|Korean|
|Polish|
|Portuguese|
|Spanish|
|Swedish|

This additional ranking is an internal working of the QnA Maker's ranker.

You can set the language analyzer for QnA service while creating the first knowledge base in new service. This language can’t be changed and all additional knowledge bases in this resource must be in the same language for expected ranking results.


## Languages supported

The following list contains the languages supported for a QnA Maker resource. 

|Language|
|--|
|Arabic|
|Armenian|
|Bengali|
|Basque|
|Bulgarian|
|Catalan|
|Chinese_Simplified|
|Chinese_Traditional|
|Croatian|
|Czech|
|Danish|
|Dutch|
|English|
|Estonian|
|Finnish|
|French|
|Galician|
|German|
|Greek|
|Gujarati|
|Hebrew|
|Hindi|
|Hungarian|
|Icelandic|
|Indonesian|
|Irish|
|Italian|
|Japanese|
|Kannada|
|Korean|
|Latvian|
|Lithuanian|
|Malayalam|
|Malay|
|Norwegian|
|Polish|
|Portuguese|
|Punjabi|
|Romanian|
|Russian|
|Serbian_Cyrillic|
|Serbian_Latin|
|Slovak|
|Slovenian|
|Spanish|
|Swedish|
|Tamil|
|Telugu|
|Thai|
|Turkish|
|Ukrainian|
|Urdu|
|Vietnamese|