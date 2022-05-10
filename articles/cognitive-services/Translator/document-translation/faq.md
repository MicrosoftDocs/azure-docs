---
title: Frequently asked questions - Document Translation
titleSuffix: Azure Cognitive Services
description: Get answers to frequently asked questions about Azure Cognitive Services Document Translation.
services: cognitive-services
author: laujan
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 05/24/2022
ms.author: lajanuar
---

<!-- markdownlint-disable MD001 -->

# Document Translation FAQ

## Frequently asked questions about Document Translation.

#### When should I specify the source language of the document in the request?

If the language of the content in the source document is known, its recommended to specify the source language in the request to get a better translation. If the document has content in multiple languages or the language is unknown, then don't specify the source language in the request. Document translation automatically identifies language for each text segment and translates.

#### To what extent are the layout, structure, and formatting maintained?

While translating text from the source to the target language, the overall length of translated text may differ from source.  This could result in reflow of text across pages. The same fonts may not be available both in source and target language. In general, the same font style is applied in target language to retain formatting closer to source.

#### Will the text in an image within a document gets translated?

No. The text in an image within a document will not get translated.

#### Does Document Translation translate content from scanned documents?

Yes. Document translation translates content from _scanned PDF_ documents.

#### Will my document be translated if it is password protected?

No. If your scanned or text-embedded PDFs are password-locked, you must remove the lock before submission.

### Can files with multiple languages in the same document be processed?

Yes. Document Translation has extensive [language support](../language-support.md#translation) for printed text languages and supports PDF document translation with multiple languages in the same document.

#### If I'm using managed identities for authentication, do I also include a SAS token URL?

No. Don't include SAS token URLS—your requests will fail. Managed identities eliminate the need for you to include shared access signature tokens (SAS) with your HTTP requests.
