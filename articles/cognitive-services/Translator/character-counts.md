---
title: Character Counts - Translator
titleSuffix: Azure Cognitive Services
description: This article explains how the Azure Cognitive Services Translator counts characters so you can understand how it ingests content.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 05/26/2020
ms.author: swmachan
---

# How the Translator counts characters

The Translator counts every unicode code point of input text as a character. Each translation of a text to a language counts as a separate translation, even if the request was made in a single API call translating to multiple languages. The length of the response does not matter.

What counts is:

* Text passed to Translator in the body of the request
   * `Text` when using the Translate, Transliterate, and Dictionary Lookup methods
   * `Text` and `Translation` when using the Dictionary Examples method
* All markup: HTML, XML tags, etc. within the text field of the request body. JSON notation used to build the request (for instance "Text:") is not counted.
* An individual letter
* Punctuation
* A space, tab, markup, and any kind of white space character
* Every code point defined in Unicode
* A repeated translation, even if you have translated the same text previously

For scripts based on ideograms such as Chinese and Japanese Kanji, the Translator service still counts the number of Unicode code points, one character per ideogram. Exception: Unicode surrogates count as two characters.

The number of requests, words, bytes, or sentences is irrelevant in the character count.

Calls to the Detect and BreakSentence methods are not counted in the character consumption. However, we do expect that the calls to the Detect and BreakSentence methods are in a reasonable proportion to the use of other functions that are counted. If the number of Detect or BreakSentence calls you make exceeds the number of other counted methods by 100 times, Microsoft reserves the right to restrict your use of the Detect and BreakSentence methods.

More information about character counts is in the [Translator FAQ](https://www.microsoft.com/en-us/translator/faq.aspx).
