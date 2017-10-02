---
title: Text Moderation API in Azure Content Moderator | Microsoft Docs
description: Use the Text Moderation API for profanity, PII, and matching against custom lists of terms.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/06/2017
ms.author: sajagtap
---

# Text Moderation API overview

Content Moderator’s Text Moderation API does more than screen text: it also matches against custom and shared lists that are specific to your business and users, and search for PII (personally identifiable information). In addition, it can auto-correct text before screening it, which helps catch deliberately misspelled words. After content is processed, results are sent, along with relevant information, either to the Review Tool or to a specified system. You use this information to make decisions about content: take it down, send to a human judge, etc.

## Language detection

The first step is determining the language of the content to be moderated. The Text - Detect Language function returns language codes for the predominant language of the submitted text.

## Screening text

The Text - Screen function does it all – scans the incoming text (maximum 1024 characters) for profanity, autocorrects text, and extracts Personally Identifiable Information (PII), all while matching against custom lists of terms.

The response includes this information:

- Location of detected profanity terms within the submitted text
- Terms: detected profanity content
- PII
- Auto-corrected text
- Original text
- Language

## Profanity terms

If any terms are detected, those terms are included in the response, along with their starting index (location) within the original text.

## PII

The PII feature detects the potential presence of this information:

- Email
- Phone
- Mailing Address

## Auto-correction

Suppose the input text is (the ‘lzay’ is intentional):

	The <a href="www.bunnies.com">qu!ck</a> brown  <a href="b.suspiciousdomain.com">f0x</a> jumps over the lzay dog www.benign.net.

If you ask for auto-correction, the response contains the corrected version of the text:

	“The quick brown fox jumps over the lazy dog."

## Creating and managing your custom lists of terms

While the default, global list of terms works great for most cases, you may want to screen against terms that are specific to your business needs. For example, you may want to filter out any competitive brand names from posts by users. Your threshold of permitted text content may be different from the default list.

The Content Moderator provides a complete [Term List API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f67f) with operations for creating and deleting lists of terms, and for adding and removing text terms from those lists.

## Next steps

Test drive the Text Moderation API by using the [Try Text Moderation API](try-text-api.md) article.
