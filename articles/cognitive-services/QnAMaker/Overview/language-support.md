---
title: Language support - QnA Maker
titleSuffix: Azure Cognitive Services
description: A list of natural languages supported by QnA Maker.
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/25/2018
ms.author: tulasim
---
# Language and region support for QnA Maker

The language of a knowledge base affects QnA Maker's ability to auto-extract questions and answers from [sources](../Concepts/data-sources-supported.md), as well as the relevance of the results QnA Maker provides in response to user queries.

## Auto extraction
QnA Maker supports question/answer extraction in any language page, but the effectiveness of the extraction is much higher for the following languages, as QnA Maker uses keywords to identify questions.

|Languages supported| Locale|
|-----|----|
|English|en-*|
|French|fr-*|
|Italian|it-*|
|German|de-*|
|Spanish|es-*|

## Query matching and relevance
QnA Maker depends on [language analyzers](https://docs.microsoft.com/rest/api/searchservice/language-support) in Azure search for providing results. Special re-ranking features are available for En-* languages that enable better relevance.

QnA Maker auto-detects the language of the knowledge base during creation and sets the analyzer accordingly. You can create knowledge bases in the following languages. Read [this](../How-To/language-knowledge-base.md) for more details about how QnA Maker handles languages.


> [!Tip]
> Language analyzers, once set, cannot be changed. Also, the language analyzer applies to all the knowledge bases in a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). If you plan to have knowledge bases in different language, you should create them under separate QnA Maker services.

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
