---
title: Character Counts - Translator Text API
titlesuffix: Azure Cognitive Services
description: How the Translator Text API counts characters.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 06/04/2019
ms.author: swmachan
---

# How the Translator Text API counts characters

The Translator Text API counts every Unicode code point of input text as a character. Each translation of a text to a language counts as a separate translation, even if the request was made in a single API call translating to multiple languages. The length of the response does not matter.

What counts is:

* Text passed to the Translator Text API in the body of the request
   * `Text` when using the Translate, Transliterate, and Dictionary Lookup methods
   * `Text` and `Translation` when using the Dictionary Examples method
* All markup: HTML, XML tags, etc. within the text field of the request body. JSON notation used to build the request (for instance "Text:") is not counted.
* An individual letter
* Punctuation
* A space, tab, markup, and any kind of white space character
* Every code point defined in Unicode
* A repeated translation, even if you have translated the same text previously

For scripts based on ideograms such as Chinese and Japanese Kanji, the Translator Text API will still count the number of Unicode code points, one character per ideogram. Exception: Unicode surrogates count as two characters.

The number of requests, words, bytes, or sentences is irrelevant in the character count.

Calls to the Detect and BreakSentence methods are not counted in the character consumption. However, we do expect that the calls to the Detect and BreakSentence methods are in a reasonable proportion to the use of other functions that are counted. If the number of Detect or BreakSentence calls you make exceeds the number of other counted methods by 100 times, Microsoft reserves the right to restrict your use of the Detect and BreakSentence methods.


More information about character counts is in the [Microsoft Translator FAQ](https://www.microsoft.com/en-us/translator/faq.aspx).
