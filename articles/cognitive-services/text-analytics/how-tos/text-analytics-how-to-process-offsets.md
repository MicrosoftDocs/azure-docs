---
title: Process offsets in API output
titleSuffix: Azure Cognitive Services
description: This article explains how to process text offsets in the output of the Azure Cognitive Services Text Analytics APIs.
services: cognitive-services
author: jdesousa
manager: andyh

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 02/27/2020
ms.author: jdesousa
---

# How to process text offsets in the output of the Text Analytics API

After [making a call](text-analytics-how-to-call-api.md) to Text Analytics, the JSON payload in the response includes elements that are specific to each of of the APIs.

Whenever **offsets** are returned, e.g. for [Named Entity Recognition](text-analytics-how-to-entity-linking) or [Sentiment Analysis](text-analytics-how-to-sentiment-analysis), bear in mind that

+ HTTP POST/GET payloads are encoded in [UTF-8](https://www.w3schools.com/charsets/ref_html_utf8.asp), which may or may not be the default character encoding on your client-side compiler/operating system;
+ offsets refer not to character counts, but **grapheme** counts.

## Why Grapheme offsets

Multilingual and emoji support led to character encodings that may use more than one [code point](https://en.wikipedia.org/wiki/Code_point) (character) to represent a single visual element - which we refer to as a **grapheme**.

For example, the Hindi word "अनुच्छेद" is encoded as 5 letters and 3 combining marks:
अ + न + ु + च + ् + छ + े + द

Emojis such as faces, objects, and gestures, 🌷, 👍, may use several characters to compose the shape plus additional characters for visual attributes such as skin tone.

Because of the different lengths of possible multilingual/emoji encodings, the unifying approach is to return grapheme offsets.


## Extracting substrings using Grapheme offsets

The practical consequence of dealing with grapheme offsets, is that using character-based `substring()` methods may result in errors from mild to serious, for example if an offset lands `substring()` in the middle of a multi-character grapheme encoding.

In .NET you may use the [StringInfo](https://docs.microsoft.com/en-us/dotnet/api/system.globalization.stringinfo?view=netframework-4.8) class, and you may look for grapheme splitter libraries in your favorite software environment 



## See also 

 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)

## Next steps

> [!div class="nextstepaction"]
> [Named Entity Recognition](text-analytics-how-to-entity-linking)