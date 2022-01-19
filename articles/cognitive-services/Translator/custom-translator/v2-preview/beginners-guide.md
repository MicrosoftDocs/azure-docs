---
title: Custom Translator for beginners | preview
titleSuffix: Azure Cognitive Services
description: A user guide for understanding the E2E machine translation customization process to publish custom translation engines.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 01/19/2022
ms.author: moelghaz
ms.topic: overview
#Customer intent: As a new custom translator user, I want to understand the E2E MT customization process, so that I can build and publish custom translation engines.
---
# Custom Translator for beginners | preview

 [Custom Translator](../overview.md) enables you to a build translation system that reflects your business, industry, and domain-specific terminology and style. Training and deploying a custom system is easy and does not require any programming skills. The customized translation system seamlessly integrates into your existing applications, workflows, and websites and is available on Azure through the same cloud-based Microsoft Text Translator [Text API V3](../../reference/v3-0-translate.md?tabs=curl) service that powers billions of translations every day.

## Is a custom translation system the right choice for me?

A custom-trained translation systems, achieves a much higher adherence to domain-specific terminology and style by training a custom translation system on previously translated, in-domain documents. These previously translated documents allow Custom Translator to learn the preferred translations in context. Translator can then apply these terms and phrases in context calls to produce a fluent translation in the target language, respecting the context-dependent grammar of the target language.

![Custom vs. general](media/how-to/for-beginners.png)

## What does training a custom translation system involve?

In order to build custom translation system, you'll need a use-case, in-domain translated data (human-translated is better), data coverage to (1) generalize expected outcome (2) target user location (3) meet regional data residency requirements and human oversight.

## How do I evaluate a use-case?

Having clarity on your use-case and what success looks like is the first step to sourcing proficient training data. Here are a few considerations:

- What is your desired outcome and how will you measure it?
- What is your business domain?
- Do you have in-domain sentences of similar terminology and style?
- Does the use-case involve multiple domains? If yes, should you build one translation system or multiple systems?
- Do you have regional data residency (at rest and in transit)?
- Are the target users in one or multiple regions?

## How should I source my data?

Finding in-domain quality data is often a challenging task that varies based on user classification. There are three common user types:

  1. An enterprise user who tends to have data in translation memory accumulated over many years.

  1. A user with monolingual data that needs to be synthesized to a target language to form sentence-pairs (a source sentence and its target translation).
  
  1. A long-tail customer who needs to crawl online portals to collect source and synthesis-to-target sentences.

## What should I use for training material?

| Source | What it does | Rules to follow |
|---|---|---|
| Bilingual training documents | Teaches the system your terminology and style. | **Be liberal**. Any in-domain human translation is better than machine translation. Add and remove documents as you go and try to improve the [BLEU score](/azure/cognitive-services/translator/custom-translator/what-is-bleu-score?WT.mc_id=aiml-43548-heboelma). |
| Tuning documents | Trains the Neural Machine Translation parameters. | **Be strict**. Compose them to be optimally representative of what you are going to translation in the future. |
| Test documents | Calculate the [BLEU score](/azure/cognitive-services/translator/custom-translator/what-is-bleu-score?WT.mc_id=aiml-43548-heboelma).| **Be strict**. Compose test documents to be optimally representative of what you plan to translate in the future. |
| Phrase dictionary | Forces the given translation with a probability of 1.00. | **Be restrictive**. A phrase dictionary is case-sensitive and any word or phrase listed is translated in the way you specify. In many cases, it is better to not use a phrase dictionary and let the system learn. |
| Sentence dictionary | Forces the given translation with a probability of 1.00. | **Be strict**. A sentence dictionary is case-insensitive and good for common in domain short sentences. For a sentence dictionary match to occur, the entire submitted sentence must match the source dictionary entry. If only a portion of the sentence matches, the entry won't match. |

## What is a BLEU score?

BLEU (bilingual evaluation understudy) is an algorithm for evaluating  evaluating the "precision" or accuracy of text that has been machine-translated from one natural language to another. Microsoft Translator relies on the BLEU metric to report accuracy to project owners.

A BLEU score is always a number between zero and one. A score of 0 indicates a low-quality translation. A score of 1.0 indicates a perfect translation that is identical to one of the reference translations. It's not necessary to attain a score of 1.0— a BLEU score between 0.40 and 0.60 indicates a high quality translation.

[Read more](/azure/cognitive-services/translator/custom-translator/what-is-bleu-score?WT.mc_id=aiml-43548-heboelma)

## What is the difference between auto- and manual-selection of tuning and test data?

Tuning and test sentences are optimally representative of what you plan to translate in the future.

| Auto Selection | Manual Selection |
|---|---|
| Convenient. | Enables fine-tuning for your future needs.|
| Good, if you know that your training data is representative of what you are planning to translate. | Provides more freedom to compose your training data.|
| Easy to redo when you grow or shrink the domain. | Allows for more data and better domain coverage.|
| Remains static over repeated training runs until you request regeneration.| Remains static over repeated training runs|

## How is training material processed by Custom Translator?

When you submit documents for training a custom translation system, the documents undergo a series of processing and filtering steps to prepare for training. These steps are explained below. Knowledge of the filtering process may help with understanding the sentence count displayed as well as the steps you can take to prepare training documents for training with Custom Translator.

- ### Sentence alignment

  If your document isn't in XLIFF, TMX, or ALIGN format, Custom Translator aligns the sentences of your source and target documents to each other, sentence-by-sentence. Translator doesn't perform document alignment—it follows your naming convention for the documents to find a matching document in the other language. Within the source text, Custom Translator tries to find the corresponding sentence in the target language. It uses document markup like embedded HTML tags to help with the alignment.

  If you see a large discrepancy between the number of sentences in the source and target documents, your source document may not be parallel or couldn't be aligned. The document pairs with a large difference (>10%) of sentences on each side warrant a second look to make sure they're indeed parallel. Custom Translator shows a warning next to the document if the sentence count differs significantly.

- ### Tuning and testing data

  Tuning and testing data is optional. If you don't provide it, the system will remove an appropriate percentage from your training document to use for validation and testing. The removal happens dynamically inside of the training run, not in the data processing step. Custom Translator reports the sentence count to you in the project overview after model training.

- ### Length filter

  - Removes sentences with only one word on either side.
  - Removes sentences with more than 100 words on either side. Chinese, Japanese, Korean are exempt.
  - Removes sentences with fewer than three characters. Chinese, Japanese, Korean are exempt.
  - Removes sentences with more than 2000 characters for Chinese, Japanese, Korean.
  - Removes sentences with less than 1% alpha characters.
  - Removes dictionary entries containing more than 50 words

- ### White space

  - Replaces any sequence of white-space characters including tabs and CR/LF sequences with a single space character.
  - Removes leading or trailing space in the sentence.

- ### Sentence end punctuation

  - Replaces multiple sentence end punctuation characters with a single instance. Japanese character normalization.
  - Converts full width letters and digits to half-width characters.

- ### Unescaped XML tags

   Transforms unescaped tags into escaped tags:

  | Tag | Becomes |
  |---|---|
  | \&lt; | \&amp;lt;  |
  | \&gt; | \&amp;gt;  |
  | \&amp; | \&amp;amp; |

- ### Invalid characters

  Custom Translator removes sentences that contain Unicode character U+FFFD. The character U+FFFD indicates a failed encoding conversion.

## What steps should I take before uploading data?

- Remove sentences with invalid encoding.
- Remove Unicode control characters.
- If feasible, align sentences (source-to-target).
- Remove source and target sentences that do not match the source and target languages.
- When source and target sentences have mixed languages, ensure that untranslated words are intentional, for example, names of organizations and products.
- Correct grammatical and typographical errors to prevent teaching these errors to your model.
- Though our training process handles source and target lines containing multiple sentences, it's better to have one source sentence mapped to one target sentence.

## How do I evaluate the results?

After the successful completion of your model training, you will see model performance details listing your custom model's BLEU score and our baseline model used during the training. We use your test data to score both numbers to help you make an informed decision regarding which model would be better for your use-case.

## Next steps

- Try our [Quickstart](quickstart.md) to learn how to build and publish translation systems with Custom Translator.
