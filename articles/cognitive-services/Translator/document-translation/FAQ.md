---
title: Frequently asked questions - Document Translation
titleSuffix: Azure Cognitive Services
description: Get answers to frequently asked questions about Document Translation in the Translator servive from Azure Cognitive Services.
services: cognitive-services
author: laujan
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: lajanuar
---

# Frequently asked questions — Document Translation

## When to specify source language of the document in the request?

If content of the language in the source document is known, its recommended to specify the source language in the request to get better translation. 
If the document has content in multiple languages or unknown, then don’t specify the source language in the request.
Document translation automatically identifies language for each text segment and translates.

## To what extent layout structure and formatting are maintained?

While translating text from source to target language; overall length of translated text may differ from source.  This could result in reflow of text across pages.
Same fonts may not be available both in source and target language. So in general same font style is applied in target language, to retain formatting closer to source.

## Will the text embedded in an image within a document gets translated?

No. The text embedded in an image within a document will not get translated.

## Does document translation translates content from scanned documents?

No. Document translation doesn’t translate content from scanned documents.


