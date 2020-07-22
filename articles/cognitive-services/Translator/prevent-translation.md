---
title: Prevent content translation - Translator
titleSuffix: Azure Cognitive Services
description: Prevent translation of content with the Translator. The Translator allows you to tag content so that it isn't translated.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 05/26/2020
ms.author: swmachan
---

# How to prevent translation of content with the Translator

The Translator allows you to tag content so that it isn't translated. For example, you may want to tag code, a brand name, or a word/phrase that doesn't make sense when localized.

## Methods for preventing translation

1. Tag your content with `notranslate`. It's by design that this works only when the input textType is set as HTML

   Example:

   ```html
   <span class="notranslate">This will not be translated.</span>
   <span>This will be translated. </span>
   ```
   
   ```html
   <div class="notranslate">This will not be translated.</div>
   <div>This will be translated. </div>
   ```

2. Use the [dynamic dictionary](dynamic-dictionary.md) to prescribe a specific translation.

3. Don't pass the string to the Translator for translation.

4. Custom Translator: Use a [dictionary in Custom Translator](custom-translator/what-is-dictionary.md) to prescribe the translation of a phrase with 100% probability.


## Next steps
> [!div class="nextstepaction"]
> [Avoid translation in your Translator call](reference/v3-0-translate.md)
