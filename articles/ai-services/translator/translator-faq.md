---
title: Frequently asked questions - Translator
titleSuffix: Azure AI services
description: Get answers to frequently asked questions about the Translator API in Azure AI services.
services: cognitive-services
author: laujan
manager: nitinme

ms.service: azure-ai-translator
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
---

# Frequently asked questions—Translator API

[!INCLUDE [Azure AI services rebrand](../includes/rebrand-note.md)]

## How does Translator count characters?

Translator counts every code point defined in Unicode as a character. Each translation counts as a separate translation, even if the request was made in a single API call translating to multiple languages. The length of the response doesn't matter and the number of requests, words, bytes, or sentences isn't relevant to character count.

Translator counts the following input:

* Text passed to Translator in the body of a request.
  * `Text` when using the [Translate](reference/v3-0-translate.md), [Transliterate](reference/v3-0-transliterate.md), and [Dictionary Lookup](reference/v3-0-dictionary-lookup.md) methods
  * `Text` and `Translation` when using the [Dictionary Examples](reference/v3-0-dictionary-examples.md) method.

* All markup: HTML, XML tags, etc. within the request body text field. JSON notation used to build the request (for instance the key "Text:") is **not** counted.
* An individual letter.
* Punctuation.
* A space, tab, markup, or any white-space character.
* A repeated translation, even if you have previously translated the same text. Every character submitted to the translate function is counted even when the content is unchanged or the source and target language are the same.

For scripts based on graphic symbols, such as written Chinese and Japanese Kanji, the Translator service counts the number of Unicode code points. One character per symbol. Exception: Unicode surrogate pairs count as two characters.

Calls to the **Detect** and **BreakSentence** methods aren't counted in the character consumption. However, we do expect calls to the Detect and BreakSentence methods to be reasonably proportionate to the use of other counted functions. If the number of Detect or BreakSentence calls exceeds the number of other counted methods by 100 times, Microsoft reserves the right to restrict your use of the Detect and BreakSentence methods.

For detailed information regarding Azure AI Translator Service request limits, *see* [**Text translation request limits**](service-limits.md#text-translation).

## Where can I see my monthly usage?

The [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) can be used to estimate your costs. You can also monitor, view, and add Azure alerts for your Azure services in your user account in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your Translator resource Overview page.
1. Select the **subscription** for your Translator resource.

    :::image type="content" source="media/azure-portal-overview.png" alt-text="Screenshot of the subscription link on overview page in the Azure portal.":::

1. In the left rail, make your selection under **Cost Management**:

    :::image type="content" source="media/azure-portal-cost-management.png" alt-text="Screenshot of the cost management resources links in the Azure portal.":::

## Is attribution required when using Translator?

Attribution isn't required when using Translator for text and speech translation. It's recommended that you inform users that the content they're viewing is machine translated.

If attribution is present, it must conform to the [Translator attribution guidelines](https://www.microsoft.com/translator/business/attribution/).

## Is Translator a replacement for human translator?

No, both have their place as essential tools for communication. Use machine translation where the quantity of content, speed of creation, and budget constraints make it impossible to use human translation.

Machine translation has been used as a first pass by several of our [language service provider (LSP)](https://www.microsoft.com/translator/business/partners/) partners, prior to using human translation and can improve productivity by up to 50 percent. For a list of LSP partners, visit the Translator partner page.

---
> [!TIP]
> If you can't find answers to your questions in this FAQ, try asking the Translator API community on [StackOverflow](https://stackoverflow.com/search?q=%5Bmicrosoft-cognitive%5D+or+%5Bmicrosoft-cognitive%5D+translator&s=34bf0ce2-b6b3-4355-86a6-d45a1121fe27).
