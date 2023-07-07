---
title: Frequently asked questions - Document Translation
titleSuffix: Azure AI services
description: Get answers to frequently asked questions about Document Translation.
services: cognitive-services
author: laujan
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
---

<!-- markdownlint-disable MD001 -->

# Answers to frequently asked questions

## Document Translation: FAQ

#### Should I specify the source language in a request?

If the language of the content in the source document is known, it's recommended to specify the source language in the request to get a better translation. If the document has content in multiple languages or the language is unknown, then don't specify the source language in the request. Document Translation automatically identifies language for each text segment and translates.

#### To what extent are the layout, structure, and formatting maintained?

When text is translated from the source to target language, the overall length of translated text may differ from source.  The result could be reflow of text across pages. The same fonts may not be available both in source and target language. In general, the same font style is applied in target language to retain formatting closer to source.

#### Will the text in an image within a document gets translated?

No. The text in an image within a document won't get translated.

#### Can Document Translation translate content from scanned documents?

Yes. Document Translation translates content from _scanned PDF_ documents.

#### Will my document be translated if it's password protected?

No. If your scanned or text-embedded PDFs are password-locked, you must remove the lock before submission.

#### If I'm using managed identities, do I also need a SAS token URL?

No. Don't include SAS token URLS—your requests will fail. Managed identities eliminate the need for you to include shared access signature tokens (SAS) with your HTTP requests.
