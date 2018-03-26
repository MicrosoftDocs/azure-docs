---
title: Microsoft Translator Text API Dynamic Dictionary | Microsoft Docs
description: How to use the dynamic dictionary feature of the Microsoft Translator Text API.
services: cognitive-services
author: Jann-Skotdal
manager: chriswendt1

ms.service: cognitive-services
ms.technology: translator
ms.topic: article
ms.date: 12/14/2017
ms.author: v-jansko
---

# How to use the dynamic dictionary feature of the Microsoft Translator Text API

If you already know the translation you want to apply to a word or a phrase, you can supply it as markup within the request. The dynamic dictionary is only safe for compound nouns like proper names and product names. 

**Syntax:** 

<mstrans:dictionary translation=”translation of phrase”>phrase</mstrans:dictionary>

**Example: en-de:**

Source input: Instant dictionary: word <mstrans:dictionary translation=”wordomatic”>word or phrase</mstrans:dictionary> is a dictionary entry.

Target output: Sofortige Wörterbuch: Wort "wordomatic" ist einen Wörterbucheintrag.


This feature works the same way with and without HTML mode. 

The feature should be used sparingly. The appropriate and far better way of customizing translation is by using the Microsoft Translator Hub. The Hub makes full use of context and statistical probabilities. If you have or can afford to create training data that shows your work or phrase in context, you get much better results. You can find more information about the hub at [http://hub.microsofttranslator.com](http://hub.microsofttranslator.com).

