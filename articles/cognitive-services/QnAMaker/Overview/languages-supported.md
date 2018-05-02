---
title: Learn about QnAMaker - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn about QnAMaker and how it works.
services: cognitive-services
author: nstulasi
manager: sangitap
ms.service: cognitive-services
ms.component: QnAMaker
ms.topic: article
ms.date: 04/21/2018
ms.author: saneppal
---
# Supported languages

The language of a knowledge base affects QnAMaker's ability to auto-extract questions and answers from [sources](../Concepts/data-sources-supported.md), as well as the relevance of the results QnAMaker provides in response to user queries.

## Auto extraction
QnAMaker supports question/answer extraction in any language page, but the effectiveness of the extraction is much higher for the following languages, as QnAMaker uses keywords to identify questions.

|Languages supported| Locale|
|-----|----|
|English|en-*|
|French|en-*|
|Italian|fr-*|
|German|it-*|
|Spanish|es-*|

## Query matching and relevance
QnAMaker depends on [language analyzers](https://docs.microsoft.com/en-us/rest/api/searchservice/language-support) in Azure search for providing results. Special re-ranking features are available for En-* languages that enable better relevance.

QnAMaker auto-detects the language of the knowledge base during creation and sets the analyzer accordingly. You can create knowledge bases in the following languages.Read [this](../How-To/language-knowledge-base.md) for more details about how QnAMaker handles languages.


> [!Tip]
> Language analyzers, once set, cannot be changed. Also, the language analyzer applies to all the knowledge bases in a [QnAMaker service](../How-To/set-up-qnamaker-service-azure.md). If you plan to have knowledge bases in different language, you should create them under separate QnAMaker services.

|Languages supported|
|-----|
|Arabic|
|Armenian|,
Bengali|
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
