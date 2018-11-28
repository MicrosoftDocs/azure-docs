---
title: Prevent content translation - Translator Text API
titlesuffix: Azure Cognitive Services
description: Avoid translation when using the Translator Text API.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun
ms.service: cognitive-services
ms.component: translator-text
ms.topic: conceptual
ms.date: 11/20/2018
ms.author: v-jansko
---

# Prevent translation of content with the Translator Text API

The Translator Text API allows you to tag content so that it isn't translated. For example, you may want to tag code, a brand name, or a word/phrase that doesn't make sense when localized. There are a few ways you can do this: 

1. Escape to a Twitter tag @somethingtopassthrough or #somethingtopassthrough. Un-escape after translation.

2. Tag your content with `notranslate`. 

Example:

```html
<div class="notranslate">This will not be translated.</div>
<div>This will be translated. </div>
```

3. Use the [dynamic dictionary](dynamic-dictionary.md) to prescribe a specific translation.

(4) Do not pass the string to translation.

(5) Custom Translator: Use a [dictionary in Custom Translator](custom-translator/what-is-dictionary.md) to prescribe the translation of a phrase with 100% probability.


## Next steps
> [!div class="nextstepaction"]
> [Avoid translation in your Translator API call](reference/v3-0-translate.md)
