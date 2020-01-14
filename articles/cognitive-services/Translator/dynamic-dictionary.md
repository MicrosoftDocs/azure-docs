---
title: Dynamic Dictionary - Translator Text API
titleSuffix: Azure Cognitive Services
description: This article explains how to use the dynamic dictionary feature of the Azure Cognitive Services Translator Text API.
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

If you already know the translation you want to apply to a word or a phrase, you can supply it as markup within the request. The dynamic dictionary is safe only for compound nouns like proper names and product names.

**Syntax:**

<mstrans:dictionary translation="translation of phrase">phrase</mstrans:dictionary>

**Requirements:**

* The `From` and `To` languages must include English and another supported language. 
* You must include the `From` parameter in your API translation request instead of using the autodetect feature. 

**Example: en-de:**

Source input: `The word <mstrans:dictionary translation=\"wordomatic\">word or phrase</mstrans:dictionary> is a dictionary entry.`

Target output: `Das Wort "wordomatic" ist ein Wörterbucheintrag.`

This feature works the same way with and without HTML mode.

Use the feature sparingly. A better way to customize translation is by using Custom Translator. Custom Translator makes full use of context and statistical probabilities. If you have or can create training data that shows your work or phrase in context, you get much better results. You can find more information about Custom Translator at [https://aka.ms/CustomTranslator](https://aka.ms/CustomTranslator).
