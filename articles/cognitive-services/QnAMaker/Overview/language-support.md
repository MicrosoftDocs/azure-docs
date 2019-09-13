---
title: Language support - QnA Maker
titleSuffix: Azure Cognitive Services
description: The language of a knowledge base affects QnA Maker's ability to auto-extract questions and answers from sources, as well as the relevance of the results QnA Maker provides in response to user queries. A list of culture, natural languages supported by QnA Maker for your knowledge base. Do not mix languages in the same knowledge base.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 03/21/2019
ms.author: diberry
ms.custom: seodec18
---
# Language support for QnA Maker

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

## Primary Language detection

The primary language used for detection is set for the QnA Maker resource, and all knowledge bases created on that resource, when the first document or URL is added to the first knowledge base. The language can't be changed. 

If the user plans to support multiple languages, they need to have a new QnA Maker resource for each language. Learn how to [create a language-based QnA Maker knowledge base](../how-to/language-knowledge-base.md).  

Verify the primary language with the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).  
1. Look for and select the Azure Search resource created as part of your QnA Maker resource. The Azure Search resource name will begin with the same name as the QnA Maker resource and will have the type **Search service**. 
1. From the **Overview** page of the Search resource, select **Indexes**. 
1. Select the **testkb** index.
1. Select the **Fields** tab. 
1. View the **Analyzer** column for the **questions** and **answer** fields. 


## Query matching and relevance
QnA Maker depends on [language analyzers](https://docs.microsoft.com/rest/api/searchservice/language-support) in Azure search for providing results. Special re-ranking features are available for En-* languages that enable better relevance.

While the Azure Search capabilities are on par for supported languages, QnA Maker has an additional ranker that sits above the Azure search results. In this ranker model, we use some special semantic and word-based features in en-*, that are not yet available for other languages. We do not make these features available, as they are part of the internal working of the QnA Maker's ranker. 

QnA Maker [auto-detects the language of the knowledge base](#primary-language-detection) during creation and sets the analyzer accordingly. You can create knowledge bases in the following languages. 

|Languages supported|
|-----|
|Arabic|
|Armenian|
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
