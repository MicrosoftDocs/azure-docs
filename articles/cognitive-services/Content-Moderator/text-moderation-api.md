---
title: Text Moderation API in Content Moderator | Microsoft Docs
description: The Text Moderation API moderates text for profanity, reports malware and phishing URLs, and matches against lists specific to a business.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 12/01/2016
ms.author: sajagtap
---

# Text Moderation API

Use Content Moderator’s text moderation API [(see API reference)](api-reference.md "Content Moderator API Reference") to moderate text for profanity in more than 100 languages, and match against custom and shared lists that are specific to your business and users.

## Language detection

The first step to using the text moderation API is to have the algorithm detect the language of the content to be moderated. The API supports more than [100 languages](Text-Moderation-API-Languages.md). The **Detect Language** operation returns language codes for the predominant language comprising the submitted text in the following format:
{"DetectedLanguage": "eng"}

## Screening for profanity

The text moderation API’s **Screen** operation does it all – screen the incoming text (maximum 1024 characters) for profanity and PII, while matching against custom lists of terms.

The response may include:

- Auto-corrected text
- Original text
- Language
- PII
- Location of detected terms within the submitted text
- Terms: detected profanity content

Let’s look at these fields in greater detail.

## Auto-correction

Let’s assume that the input text is: (the ‘lzay’ is intentional.)

	The <a href="www.bunnies.com">qu!ck</a> brown  <a href="b.suspiciousdomain.com">f0x</a> jumps over the lzay dog www.benign.net.

If you ask for auto-correction, the response will contain the corrected version of the text as in:

	“The quick brown fox jumps over the lazy dog."

## Profanity terms

If any terms are detected, those terms are included in the response, along with their starting index (location) within the original text.

## Creating and managing your custom lists of terms

While the default, global list of terms works great for most cases, you may want to screen against terms that are specific to your business needs. For example, you may want to filter out any competitive brand names from posts by users. Your threshold of permitted text content may be different from the default list.

The Content Moderator provides a complete [terms list API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f675 "Content Moderator Terms List API") with operations for creating and deleting lists of terms, and for adding and removing text terms from those lists.

A typical sequence of operations would be to:

1. Create a list.
1. Add terms to your list.
1. Screen terms against the ones in the list.
1. Delete term or terms from the list.
1. Delete the list.
