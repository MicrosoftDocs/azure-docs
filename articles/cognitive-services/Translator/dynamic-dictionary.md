---
title: Translator Text API Dynamic Dictionary
titlesuffix: Azure Cognitive Services
description: How to use the dynamic dictionary feature of the Translator Text API.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: conceptual
ms.date: 12/14/2017
ms.author: v-jansko
---

# How to use the dynamic dictionary feature of the Translator Text API

If you already know the translation you want to apply to a word or a phrase, you can supply it as markup within the request. The dynamic dictionary is only safe for compound nouns like proper names and product names. 

**Syntax:** 

<mstrans:dictionary translation=”translation of phrase”>phrase</mstrans:dictionary>

**Example: en-de:**

Source input: The word <mstrans:dictionary translation=\"wordomatic\">word or phrase</mstrans:dictionary> is a dictionary entry.

Target output: Das Wort "wordomatic" ist ein Wörterbucheintrag.

This feature works the same way with and without HTML mode. 

The feature should be used sparingly. The appropriate and far better way of customizing translation is by using Custom Translator. Custom Translator makes full use of context and statistical probabilities. If you have or can create training data that shows your work or phrase in context, you get much better results. You can find more information about Custom Translator at [http://aka.ms/CustomTranslator](http://aka.ms/CustomTranslator).

