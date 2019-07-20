---
title: Dynamic Dictionary - Translator Text API
titlesuffix: Azure Cognitive Services
description: How to use the dynamic dictionary feature of the Translator Text API.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 06/04/2019
ms.author: swmachan
---

# How to use a dynamic dictionary

If you already know the translation you want to apply to a word or a phrase, you can supply it as markup within the request. The dynamic dictionary is only safe for compound nouns like proper names and product names.

**Syntax:**

<mstrans:dictionary translation=”translation of phrase”>phrase</mstrans:dictionary>

**Requirements:**

* The `From` and `To` languages must be different. 
* You must include the `From` parameter in your API translation request instead of using the auto-detect feature. 

**Example: en-de:**

Source input: The word <mstrans:dictionary translation=\"wordomatic\">word or phrase</mstrans:dictionary> is a dictionary entry.

Target output: Das Wort "wordomatic" ist ein Wörterbucheintrag.

This feature works the same way with and without HTML mode.

The feature should be used sparingly. The appropriate and far better way of customizing translation is by using Custom Translator. Custom Translator makes full use of context and statistical probabilities. If you have or can create training data that shows your work or phrase in context, you get much better results. You can find more information about Custom Translator at [https://aka.ms/CustomTranslator](https://aka.ms/CustomTranslator).
