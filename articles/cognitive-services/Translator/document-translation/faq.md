---
title: Frequently asked questions - Document Translation
titleSuffix: Azure Cognitive Services
description: Get answers to frequently asked questions about Document Translation in the Translator service from Azure Cognitive Services.
services: cognitive-services
author: laujan
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: lajanuar
---

# Document Translation FAQ

This article contains answers to frequently asked questions about Document Translation.

|Frequently asked questions|
|:--|
|**When should I specify the source language of the document in the request?**<br/>If the language of the content in the source document is known, its recommended to specify the source language in the request to get a better translation. If the document has content in multiple languages or the language is unknown, then don’t specify the source language in the request. Document translation automatically identifies language for each text segment and translates.|
|**To what extent are the layout, structure, and formatting maintained?**<br/>While translating text from the source to the target language, the overall length of translated text may differ from source.  This could result in reflow of text across pages. The same fonts may not be available both in source and target language. In general, the same font style is applied in target language to retain formatting closer to source.|
|**Will the text embedded in an image within a document gets translated?**<br/>No. The text embedded in an image within a document will not get translated.|
|**Does document translation translate content from scanned documents?**<br/>No. Document translation doesn’t translate content from scanned documents.|



