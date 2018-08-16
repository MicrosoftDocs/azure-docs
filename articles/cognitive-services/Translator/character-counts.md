---
title: Microsoft Translator Text API Character Counts | Microsoft Docs
description: How the Microsoft Translator Text API counts characters.
services: cognitive-services
author: Jann-Skotdal
manager: chriswendt1
ms.service: cognitive-services
ms.component: translator-text
ms.topic: article
ms.date: 12/20/2017
ms.author: v-jansko
---

# How the Microsoft Translator Text API counts characters

Microsoft Translator counts every character of the input. Characters in the Unicode sense, not bytes. Unicode surrogates count as two characters. White space and markup count as characters. The length of the response does not matter.

Calls to the Detect and BreakSentence methods are not counted in the character consumption. However, we do expect that the calls to the Detect and BreakSentence methods are in a reasonable proportion to the use of other functions that are counted. Microsoft reserves the right to start counting Detect and BreakSentence. 

More information about character counts is in the [Microsoft Translator FAQ](https://www.microsoft.com/en-us/translator/faq.aspx).
