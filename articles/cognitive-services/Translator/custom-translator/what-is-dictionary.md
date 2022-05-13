---
title: "Legacy: What is a dictionary? - Custom Translator"
titleSuffix: Azure Cognitive Services
description: How to create an aligned document that specifies a list of phrases or sentences (and their translations) that you always want Microsoft Translator to translate the same way. Dictionaries are sometimes also called glossaries or term bases.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 12/06/2021
ms.author: lajanuar
ms.topic: conceptual
#Customer intent: As a Custom Translator, I want to understand how to use a dictionary to build a custom translation model.
---

# What is a dictionary?

A dictionary is an aligned pair of documents that specifies a list of phrases or sentences and their corresponding translations. Use a dictionary in your training, when you want Translator to translate any instances of the source phrase or sentence, using the translation you've provided in the dictionary. Dictionaries are sometimes called glossaries or term bases. You can think of the dictionary as a brute force "copy and replace" for all the terms you list. Furthermore, Microsoft Custom Translator service builds and makes use of its own general purpose dictionaries to improve the quality of its translation. However, a customer provided dictionary takes precedent and will be searched first to look up words or sentences.

Dictionaries only work for projects in language pairs that have a fully supported Microsoft general neural network model behind them. [View the complete list of languages](../language-support.md).

## Phrase dictionary

A phrase dictionary is case-sensitive. It's an exact find-and-replace operation. When you include a phrase dictionary in training your model, any word or phrase listed is translated in the way specified. The rest of the sentence is translated as usual. You can use a phrase dictionary to specify phrases that shouldn't be translated by providing the same untranslated phrase in the source and target files.

## Sentence dictionary

A sentence dictionary is case-insensitive. The sentence dictionary allows you to specify an exact target translation for a source sentence. For a sentence dictionary match to occur, the entire submitted sentence must match the source dictionary entry. If the source dictionary entry ends with punctuation, it's ignored during the match. If only a portion of the sentence matches, the entry won't match.  When a match is detected, the target entry of the sentence dictionary will be returned.

## Dictionary-only trainings

You can train a model using only dictionary data. To do so, select only the dictionary document (or multiple dictionary documents) that you wish to include and select **Create model**. Since this training is dictionary-only, there's no minimum number of training sentences required. Your model will typically complete training much faster than a standard training.  The resulting models will use the Microsoft baseline models for translation with the addition of the dictionaries you've added.  You won't get a test report.

>[!Note]
>Custom Translator doesn't sentence align dictionary files, so it is important that there are an equal number of source and target phrases/sentences in your dictionary documents and that they are precisely aligned.

## Recommendations

- Dictionaries aren't a substitute for training a model using training data. We recommended letting the system learn from your training data for better results. However, when sentences or compound nouns must be rendered as-is, use a dictionary.
- The phrase dictionary should be used sparingly. When a phrase within a sentence is replaced, the context within that sentence is lost or limited for translating the rest of the sentence. The result is that while the phrase or word within the sentence will translate according to the provided dictionary, the overall translation quality of the sentence will often suffer.
- The phrase dictionary works well for compound nouns like product names ("Microsoft SQL Server"), proper names ("City of Hamburg"), or features of the product ("pivot table"). It doesn't work equally well for verbs or adjectives because those words are typically highly inflected in the source or in the target language. Best practice is to avoid phrase dictionary entries for anything but compound nouns.
- When using a phrase dictionary, capitalization and punctuation are important. Dictionary entries will only match words and phrases in the input sentence that use exactly the same capitalization and punctuation as specified in the source dictionary file. Also the translations will reflect the capitalization and punctuation provided in the target dictionary file. For example, if you trained an English to Spanish system that uses a phrase dictionary that specifies "US" in the source file, and "EE.UU." in the target file. When you request translation of a sentence that includes the word "us" (not capitalized), it will NOT return a match from the dictionary. However, if you request translation of a sentence that contains the word "US" (capitalized), it will match the dictionary and the translation will contain "EE.UU." The capitalization and punctuation in the translation may be different than specified in the dictionary target file, and may be different from the capitalization and punctuation in the source. It follows the rules of the target language.
- When using a sentence dictionary, the end of sentence punctuation is ignored. For example, if your source dictionary contains "this sentence ends with punctuation!", then any translation requests containing "this sentence ends with punctuation" would match.
- If a word appears more than once in a dictionary file, the system will always use the last entry provided. Thus, your dictionary shouldn't contain multiple translations of the same word.

## Next steps

- Read about [guidelines on document formats](document-formats-naming-convention.md).
