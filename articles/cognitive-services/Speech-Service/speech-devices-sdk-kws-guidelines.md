---
title: Keyword naming guidelines - Speech service
titleSuffix: Azure Cognitive Services
description: Creating an effective keyword is vital to ensuring your device will consistently and accurately respond.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: trbye
---

# Guidelines for creating an effective keyword

Creating an effective keyword is vital to ensuring your device will consistently and accurately respond. Customizing your keyword is an effective way to differentiate your device and strengthen your branding. In this article, you learn some guiding principles for creating an effective keyword.

## Choose an effective keyword

Consider the following guidelines when you choose a keyword:

> [!div class="checklist"]
> * Your keyword should be an English word or phrase.
> * It should take no longer than two seconds to say.
> * Words of 4 to 7 syllables work best. For example, "Hey, Computer" is a good keyword. Just "Hey" is a poor one.
> * Keywords should follow common English pronunciation rules.
> * A unique or even a made-up word that follows common English pronunciation rules might reduce false positives. For example, "computerama" might be a good keyword.
> * Do not choose a common word. For example, "eat" and "go" are words that people say frequently in ordinary conversation. They might be false triggers for your device.
> * Avoid using a keyword that might have alternative pronunciations. Users would have to know the "right" pronunciation to get their device to respond. For example, "509" can be pronounced "five zero nine," "five oh nine," or "five hundred and nine." "R.E.I." can be pronounced "r-e-i" or "ray." "Live" can be pronounced "/līv/" or "/liv/".
> * Do not use special characters, symbols, or digits. For example, "Go#" and "20 + cats" could be problematic keywords. However, "go sharp" or "twenty plus cats" might work. You can still use the symbols in your branding and use marketing and documentation to reinforce the proper pronunciation.

> [!NOTE]
> If you choose a trademarked word as your keyword, be sure that you own that trademark or that you have permission from the trademark owner to use the word. Microsoft is not liable for any legal issues that might arise from your choice of keyword.

## Next steps

Learn how to [create a custom keyword using Speech Studio](speech-devices-sdk-create-kws.md).
