---
title: "What is a dictionary? - Custom Translator"
titleSuffix: Azure AI services
description: How to create an aligned document that specifies a list of phrases or sentences (and their translations) that you always want Microsoft Translator to translate the same way. Dictionaries are sometimes also called glossaries or term bases.
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.date: 07/18/2023
ms.author: lajanuar
ms.topic: conceptual
ms.custom: cogserv-non-critical-translator
#Customer intent: As a Custom Translator, I want to understand how to use a dictionary to build a custom translation model.
---

# What is a dictionary?

A dictionary is an aligned pair of documents that specifies a list of phrases or sentences and their corresponding translations. Use a dictionary in your training, when you want Translator to translate any instances of the source phrase or sentence, using the translation you provide in the dictionary. Dictionaries are sometimes called glossaries or term bases. You can think of the dictionary as a brute force "copy and replace" for all the terms you list. Furthermore, Microsoft Custom Translator service builds and makes use of its own general purpose dictionaries to improve the quality of its translation. However, a customer provided dictionary takes precedent and is searched first to look up words or sentences.

Dictionaries only work for projects in language pairs that have a fully supported Microsoft general neural network model behind them. [View the complete list of languages](../../language-support.md).

## Phrase dictionary

A phrase dictionary is case-sensitive. It's an exact find-and-replace operation. When you include a phrase dictionary in training your model, any word or phrase listed is translated in the way specified. The rest of the sentence is translated as usual. You can use a phrase dictionary to specify phrases that shouldn't be translated by providing the same untranslated phrase in the source and target files.

## Dynamic dictionary

The [dynamic dictionary](../../dynamic-dictionary.md) feature allows you to customize translations for specific terms or phrases. You define custom translations for your unique context, language, or specific needs.

## Neural dictionary

The neural dictionary extends our [dynamic dictionary](#dynamic-dictionary) and [phrase dictionary](#phrase-dictionary) features. Dynamic and phrase dictionaries allow you to customize the translation output by providing your own translations for specific terms or phrases. The neural dictionary improves translation quality for sentences that include one or more term translations by letting the machine translation model adjust both the term and the context. This adjustment produces more fluent translations. At the same time, it preserves high-term translation accuracy.

## Sentence dictionary

A sentence dictionary is case-insensitive. The sentence dictionary allows you to specify an exact target translation for a source sentence. For a sentence dictionary match to occur, the entire submitted sentence must match the source dictionary entry. A source dictionary entry that ends with punctuation is ignored during the match. If only a portion of the sentence matches, the entry isn't matched.  When a match is detected, the target entry of the sentence dictionary is returned.

## Dictionary-only trainings

You can train a model using only dictionary data. To do so, select only the dictionary document (or multiple dictionary documents) that you wish to include and select **Create model**. Since this training is dictionary-only, there's no minimum number of training sentences required. Your model typically completes training faster than a standard training.  The resulting models use the Microsoft baseline models for translation with the addition of the dictionaries you add.  You don't get a test report.

>[!Note]
>Custom Translator doesn't sentence align dictionary files, so it is important that there are an equal number of source and target phrases/sentences in your dictionary documents and that they are precisely aligned.

## Recommendations

- Dictionaries aren't a substitute for training a model using training data. For better results, we recommended letting the system learn from your training data. However, when sentences or compound nouns must be translated verbatim, use a dictionary.

- The phrase dictionary should be used sparingly. When a phrase within a sentence is replaced, the context of that sentence is lost or limited for translating the rest of the sentence. The result is that, while the phrase or word within the sentence is translated according to the provided dictionary, the overall translation quality of the sentence often suffers.

- The phrase dictionary works well for compound nouns like product names ("_Microsoft SQL Server_"), proper names ("_City of Hamburg_"), or product features ("_pivot table_"). It doesn't work as well for verbs or adjectives because those words are typically highly contextual within the source or target language. The best practice is to avoid phrase dictionary entries for anything but compound nouns.

- If you're using a phrase dictionary, capitalization and punctuation are important. Dictionary entries are case- and punctuation-sensitive. Custom Translator only matches words and phrases in the input sentence that use exactly the same capitalization and punctuation marks as specified in the source dictionary file. Also, translations reflect the capitalization and punctuation provided in the target dictionary file.

  **Example**

  - If you're training an English-to-Spanish system that uses a phrase dictionary and you specify _SQL server_ in the source file and _Microsoft SQL Server_ in the target file. When you request the translation of a sentence that contains the phrase _SQL server_, Custom Translator matches the dictionary entry and the translation that contains _Microsoft SQL Server_.
  - When you request translation of a sentence that includes the same phrase but **doesn't** match what is in your source file, such as _sql server_, _sql Server_ or _SQL Server_, it **won't** return a match from your dictionary.
  - The translation follows the rules of the target language as specified in your phrase dictionary.

- If you're using a sentence dictionary, end-of-sentence punctuation is ignored.

  **Example**
  
  - If your source dictionary contains "_This sentence ends with punctuation!_", then any translation requests containing "_This sentence ends with punctuation_" matches.

- Your dictionary should contain unique source lines. If a source line (a word, phrase, or sentence) appears more than once in a dictionary file, the system always uses the **last entry** provided and return the target when a match is found.

- Avoid adding phrases that consist of only numbers or are two- or three-letter words, such as acronyms, in the source dictionary file.

## Next steps

> [!div class="nextstepaction"]
> [Learn about document formatting guidelines](document-formats-naming-convention.md)
