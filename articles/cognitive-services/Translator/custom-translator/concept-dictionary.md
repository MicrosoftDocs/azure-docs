---
title: Dictionary in Custom Translator
titlesuffix: Azure Cognitive Services
description: How dictionary works in Custom Translator.
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 10/15/2018
ms.author: v-rada
ms.topic: dictionary
Customer intent: As a user, I want to concept of dictionary, so that I can build custom model using it.
---

# Dictionary

Dictionary is an aligned document that specifies a list of phrases or sentences (and their translations) that you always want Microsoft Translator to translate the same way. Dictionaries are sometimes also called glossaries or term bases. You can think of the dictionary as a brute force “copy and replace” for all the terms you list. Your dictionary should not contain multiple translations of the same word. 

The dictionary determines the translation of phrases or sentences with 100% probability. Use phrase dictionary to define proper names and product names exactly the way you want to see them translated. Use sentence dictionaries, when you want to translate entire sentence exactly into the corresponding dictionary entry.

You can specify a dictionary of terms that Microsoft Translator should use in translation, in addition to your training data for the translation system.

Use of a dictionary has the potential to degrade the quality of your
translations. Here are some guidelines and hints:

-   Training documents showing the terms used in context are better than a plain
    dictionary. Terms used in sentence form teach the system the correct
    inflection and agreement, better than a dictionary can.

-   The dictionary maps the dictionary term or phrase exactly to the given
    translated form.

-   Try to minimize the dictionary to the terms that the system does not already
    learn from the training documents. If the system can learn the term from
    prose with context in the regular training data, do not add it as a
    dictionary term.

-   The dictionary works well for compound nouns like product names (“Microsoft
    SQL Server”), proper names (“City of Hamburg”), or features of the product
    (“pivot table”). It doesn’t work equally well for verbs or adjectives
    because these are typically highly inflected in the source or in the target
    language. Avoid dictionary entries for anything but compound nouns.

-   Both sides of the dictionary are case sensitive. Each casing situation
    requires an individual entry into the dictionary.

-   You may create dictionary entries for longer phrases and expressions.

-   Chinese and Japanese are relatively safe with a glossary. Most other
    languages have a richer morphology (more inflections) than English, so the
    quality will suffer if there is a glossary entry for a term or phrase that
    the system already translates correctly.

## How to Create a Dictionary File (WIP)

To create a dictionary, follow the steps listed here.

1.  Create an Excel file. Custom Translator supports only
    “.xlsx” files created using Excel 2007 and later. This file contains a
    list of source-language terms and a list of corresponding
    target-language equivalents in the first sheet of the Workbook. Other
    sheets in the workbook will be ignored.

2.  In cell A1 of the first sheet, enter the ISO standard language IDs for
    the source language (for example “en” or “en-us” for English)

3.  In cell B1 of the first sheet, enter the ISO standard language IDs for
    the target language (for example “es” or “es-es” for Spanish)

4.  Enter the source language terms in Column A, and the equivalent
    translations for these terms in the target Language in Column B. HTML
    tags in the dictionary will be ignored.

The image below shows an Excel file containing a dictionary of terms mapped from
English to Spanish.

![Dictioary file](media/how-to/ct-how-to-create-dictionary.png)

## Next steps

- Read about [guidelines on document formats](concept-document-formats-naming-convention.md).