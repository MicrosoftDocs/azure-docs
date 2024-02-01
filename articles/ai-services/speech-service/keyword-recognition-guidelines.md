---
title: Keyword recognition recommendations and guidelines - Speech service
titleSuffix: Azure AI services
description: An overview of recommendations and guidelines when using keyword recognition.
author: hasyashah
manager: nitinme
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 04/30/2021
ms.author: hasshah
---

# Recommendations and guidelines for keyword recognition

This article outlines how to choose your keyword optimize its accuracy characteristics and how to design your user experiences with Keyword Verification. 

## Choosing an effective keyword

Creating an effective keyword is vital to ensuring your product will consistently and accurately respond. Consider the following guidelines when you choose a keyword.

> [!NOTE]
> The examples below are in English but the guidelines apply to all languages supported by Custom Keyword. For a list of all supported languages, see [Language support](language-support.md?tabs=custom-keyword).

- It should take no longer than two seconds to say.
- Words of 4 to 7 syllables work best. For example, "Hey, Computer" is a good keyword. Just "Hey" is a poor one.
- Keywords should follow common pronunciation rules specific to the native language of your end-users.
- A unique or even a made-up word that follows common pronunciation rules might reduce false positives. For example, "computerama" might be a good keyword.
- Do not choose a common word. For example, "eat" and "go" are words that people say frequently in ordinary conversation. They might lead to higher than desired false accept rates for your product.
- Avoid using a keyword that might have alternative pronunciations. Users would have to know the "right" pronunciation to get their product to voice activate. For example, "509" can be pronounced "five zero nine," "five oh nine," or "five hundred and nine." "R.E.I." can be pronounced "r-e-i" or "ray." "Live" can be pronounced "/līv/" or "/liv/".
- Do not use special characters, symbols, or digits. For example, "Go#" and "20 + cats" could be problematic keywords. However, "go sharp" or "twenty plus cats" might work. You can still use the symbols in your branding and use marketing and documentation to reinforce the proper pronunciation.


## User experience recommendations with Keyword Verification

With a multi-stage keyword recognition scenario where [Keyword Verification](keyword-recognition-overview.md#keyword-verification) is used, applications can choose when the end-user is notified of a keyword detection. The recommendation for rendering any visual or audible indicator is to rely upon on responses from the Keyword Verification service:

![User experience guideline when optimizing for accuracy.](media/custom-keyword/kw-verification-ux-accuracy.png)

This ensures the optimal experience in terms of accuracy to minimize the user-perceived impact of false accepts but incurs additional latency.

For applications that require latency optimization, applications can provide light and unobtrusive indicators to the end-user based on the on-device keyword recognition. For example, lighting an LED pattern or pulsing an icon. The indicators can continue to exist if Keyword Verification responds with a keyword accept, or can be dismissed if the response is a keyword reject:

![User experience guideline when optimizing for latency.](media/custom-keyword/kw-verification-ux-latency.png)

## Next steps

* [Get the Speech SDK.](speech-sdk.md)
* [Learn more about Voice Assistants.](voice-assistants.md)
