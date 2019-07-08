---
title: What is a dictionary? - Custom Translator
titleSuffix: Azure Cognitive Services
description: A dictionary is an aligned document that specifies a list of phrases or sentences (and their translations) that you always want Microsoft Translator to translate the same way. Dictionaries are sometimes also called glossaries or term bases.
author: swmachan
manager: christw
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 02/21/2019
ms.author: swmachan
ms.topic: conceptual
#Customer intent: As a Custom Translator, I want to understand how to use a dictionary to build a custom translation model.
---

# What is a dictionary?

A dictionary is an aligned pair of documents that specifies a list of phrases or sentences and their corresponding translations. Use a dictionary in your training, when you want Microsoft Translator to always translate any instances of the source phrase or sentence, using the translation you've provided in the dictionary. Dictionaries are sometimes called glossaries or term bases. You can think of the dictionary as a brute force “copy and replace” for all the terms you list.

Dictionaries only work for projects in language pairs that have a fully supported Microsoft neural machine translation (NMT) system behind them. [View the complete list of languages](https://docs.microsoft.com/azure/cognitive-services/translator/language-support#customization).

## Phrase dictionary
When you include a phrase dictionary in training your model, any word or phrase listed is translated in the way you specified. The rest of the sentence is translated as usual. You can use a phrase dictionary to specify phrases that shouldn't be translated by providing the same untranslated phrase in the source and target file in the dictionary.

## Sentence dictionary
The sentence dictionary allows you to specify an exact target translation for a source sentence. For a sentence dictionary match to occur, the entire submitted sentence must match the source dictionary entry.  If only a portion of the sentence matches, the entry won't match.  When a match is detected, the target entry of the sentence dictionary will be returned.

## Dictionary-only trainings
You can train a model using only dictionary data. To do this, select only the dictionary document (or multiple dictionary documents) that you wish to include and tap Create model. Since this is a dictionary-only training, there is no minimum number of training sentences required. Your model will typically complete training much faster than a standard training.  The resulting models will use the Microsoft baseline models for translation with the addition of the dictionaries you have added.  You will not get a test report.

>[!Note]
>Custom Translator does not sentence align dictionary files, so it is important that there are an equal number of source and target phrases/ sentences in your dictionary documents and that they are precisely aligned.

## Recommendations

- Dictionaries are not a substitute for a trained model with training data.  Dictionaries essentially find and replace words or sentences.  Letting the system learn from your training material in full sentences is generally a better choice than using a dictionary.
- The phrase dictionary should be used sparingly. When a phrase within a sentence is replaced, the context within that sentence is lost or limited for translating the rest of the sentence. The result is that while the phrase or word within the sentence will translate according to the phrase dictionary, the overall translation quality of the sentence will often suffer.
- The phrase dictionary works well for compound nouns like product names (“Microsoft SQL Server”), proper names (“City of Hamburg”), or features of the product (“pivot table”). It does not work equally well for verbs or adjectives because these are typically highly inflected in the source or in the target language. Avoid phrase dictionary entries for anything but compound nouns.
- When using a dictionary, capitalization and punctuation in your translations will reflect the capitalization and punctuation provided in your target file. Capitalization and punctuation are ignored when trying to identify matches between your input sentence and the source sentences in your dictionary file. For example, let’s say we trained an English to Spanish system that used a dictionary that specified “City of Hamburg” in the source file, and “Ciudad de hamburg” in the target file. If I requested translation of a sentence that included the phrase “city of Hamburg”, then “city of Hamburg” would match to my dictionary file for the entry “City of Hamburg”, and would map to “Ciudad de hamburg” in my final translation.
- If a word appears more than once in a dictionary file, the system will always use the last entry provided. Your dictionary should not contain multiple translations of the same word.

## Next steps

- Read about [guidelines on document formats](document-formats-naming-convention.md).
