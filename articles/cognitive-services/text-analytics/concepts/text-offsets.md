---
title: Text offsets in the Text Analytics API
titleSuffix: Azure Cognitive Services
description: Learn about offsets caused by multilingual and emoji encodings.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 03/09/2020
ms.author: aahi
ms.reviewer: jdesousa
---

# Text offsets in the Text Analytics API output

Multilingual and emoji support has led to Unicode encodings that use more than one [code point](https://wikipedia.org/wiki/Code_point) to represent a single displayed character, called a grapheme. For example, emojis like 🌷 and 👍 may use several characters to compose the shape with additional characters for visual attributes, such as skin tone. Similarly, the Hindi word `अनुच्छेद` is encoded as five letters and three combining marks.

Because of the different lengths of possible multilingual and emoji encodings, the Text Analytics API may return offsets in the response.

## Offsets in the API response. 

Whenever offsets are returned the API response, such as [Named Entity Recognition](../how-tos/text-analytics-how-to-entity-linking.md) or [Sentiment Analysis](../how-tos/text-analytics-how-to-sentiment-analysis.md), remember the following:

* Elements in the response may be specific to the endpoint that was called. 
* HTTP POST/GET payloads are encoded in [UTF-8](https://www.w3schools.com/charsets/ref_html_utf8.asp), which may or may not be the default character encoding on your client-side compiler or operating system.
* Offsets refer to grapheme counts based on the [Unicode 8.0.0](https://unicode.org/versions/Unicode8.0.0) standard, not character counts.

## Extracting substrings from text with offsets

Offsets can cause problems when using character-based substring methods, for example the .NET [substring()](https://docs.microsoft.com/dotnet/api/system.string.substring?view=netframework-4.8) method. One problem is that an offset may cause a substring method to end in the middle of a multi-character grapheme encoding instead of the end.

In .NET, consider using the [StringInfo](https://docs.microsoft.com/dotnet/api/system.globalization.stringinfo?view=netframework-4.8) class, which enables you to work with a string as a series of textual elements, rather than individual character objects. You can also look for grapheme splitter libraries in your preferred software environment. 

The Text Analytics API returns these textual elements as well, for convenience.

## See also

* [Text Analytics overview](../overview.md)
* [Sentiment analysis](../how-tos/text-analytics-how-to-sentiment-analysis.md)
* [Entity recognition](../how-tos/text-analytics-how-to-entity-linking.md)
* [Detect language](../how-tos/text-analytics-how-to-keyword-extraction.md)
* [Language recognition](../how-tos/text-analytics-how-to-language-detection.md)
