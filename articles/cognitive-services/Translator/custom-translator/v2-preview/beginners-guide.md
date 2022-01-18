---
title: Custom Translator for beginners | preview
titleSuffix: Azure Cognitive Services
description: A user guide for understanding the E2E machine translation customization process to publish custom translation engines.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 01/18/2022
ms.author: moelghaz
ms.topic: overview
#Customer intent: As a new custom translator user, I want to understand the E2E MT customization process, so that I can build and publish custom translation engines.
---
# Custom Translator for beginners | preview

 [Custom Translator](../overview.md) enables you to a build translation system that reflects your business, industry, and domain-specific terminology and style. Training and deploying a custom system is easy and does not require any programming skills. The customized translation system seamlessly integrates into your existing applications, workflows, and websites and is available on Azure through the same cloud-based Microsoft Text Translator [Text API V3](../../reference/v3-0-translate.md?tabs=curl) service that powers billions of translations every day.

## Is custom translation systems the right choice for me?

A custom-trained translation systems, achieves a much higher adherence to domain-specific terminology and style by training a custom translation system on previously translated, in-domain documents. These previously translated documents allow Custom Translator to learn the preferred translations in context. Translator can then apply these terms and phrases in context calls to produce a fluent translation in the target language, respecting the context-dependent grammar of the target language.

![Custom vs. general](media/how-to/for-beginners.png)

## What does training custom translation systems involve?

In order to build custom translation system, you start with a use-case, in-domain translated data (human-translated is better), data coverage to generalize, expected outcome, target users location, regional data residency requirement, and human oversight.

## Evaluate your use-case

Having clarity on the use-case and what success looks like is the first step before sourcing training data. Here are a few suggested questions consider:

- What is the desired outcome and how to measure it?
- What is the business domain?
- Do you have in-domain sentences of similar terminology and style?
- Does the use-case involve multiple domains? If yes, should you build one translation system or multiple systems?
- Do you have regional data residency (at rest and in transit)?
- The target users, are they in one or multiple regions?

## Source your data

Finding in-domain quality data is often a challenging task that varies based on the customer classification. There are three common types, an enterprise customer who tends to have data in translation memory accumulated over many years, a customer with monolingual data that needs to be synthesized to a target language to form sentence-pair (a source sentence and its target translation), or long tail customer who would need to crawl online portals, for example, own portal, competition, government, NGO, judicial, etc. to collect source sentences and synthesis to target sentences.

### Training material

| What goes in | What it does | Rules to follow |
|---|---|---|
| Bilingual training documents | Teaches the system your terminology and style | Be liberal. Any in-domain human translation is better than machine translation. Add and remove documents as you go and try to improve the [BLEU score](/azure/cognitive-services/translator/custom-translator/what-is-bleu-score?WT.mc_id=aiml-43548-heboelma). |
| Tuning documents | Train the Neural Machine Translation parameters | Be strict. Compose them to be optimally representative of what you are going to translation in the future. |
| Test documents | Calculate the [BLEU score](/azure/cognitive-services/translator/custom-translator/what-is-bleu-score?WT.mc_id=aiml-43548-heboelma) - just for you | Be strict. Compose them to be optimally representative of what you are going to translation in the future. |
| Phrase dictionary | Forces the given translation with a probability of 1. | Be restrictive. Case-sensitive and safe to use only for compound nouns and named entities. Better to not use and let the system learn. |
| Sentence dictionary | Forces the given translation with a probability of 1. | Case-insensitive and good for common in domain short sentences. |

### BLEU Score

BLEU is the industry standard method for evaluating the "precision" or accuracy of the translation model. Though other methods of evaluation exist, Microsoft Translator relies BLEU method to report accuracy to Project Owners.
[Read more](/azure/cognitive-services/translator/custom-translator/what-is-bleu-score?WT.mc_id=aiml-43548-heboelma)

### Auto or manual selection of Tuning and Test data

Goal: Tuning and test sentences are optimally representative of what you are going to translate in the future.

| Auto Selection | Manual Selection |
|---|---|
| +Convenient | Fine-tune to your future needs|
| +Good if you know that your training data is representative of what you are going to translate | +Take more freedom in composing your training data|
| +Easy to redo when you grow or shrink the domain | +More data - better domain coverage|
| +Remains static over repeated training runs, until you request regeneration| +Remains static over repeated training runs|

### How we process training material

When you submit documents to be used for training a custom translation system, the documents undergo a series of processing and filtering steps to prepare for training. These steps are explained here. The knowledge of the filtering may help you understand the sentence count displayed in custom translator as well as the steps you may take yourself to prepare the documents for training with Custom Translator.

### Sentence alignment

If your document isn't in XLIFF, TMX, or ALIGN format, Custom Translator aligns the sentences of your source and target documents to each other, sentence by sentence. Translator doesn't perform document alignment - it follows your naming of the documents to find the matching document of the other language. Within the document, Custom Translator tries to find the corresponding sentence in the other language. It uses document markup like embedded HTML tags to help with the alignment.

If you see a large discrepancy between the number of sentences in the source and target side documents, your document may not have been parallel in the first place, or for other reasons couldn't be aligned. The document pairs with a large difference (>10%) of sentences on each side warrant a second look to make sure they're indeed parallel. Custom Translator shows a warning next to the document if the sentence count differs suspiciously.

### Tuning and testing data

Tuning and Testing are optional. If you do not provide them, the system will remove an appropriate percentage from Training document to use for validation and testing. The removal happens dynamically inside of the training run, not in the data processing step. Custom Translator reports the sentence count to you in the project overview after model training.

### Length filter

- Remove sentences with only one word on either side.
- Remove sentences with more than 100 words on either side. Chinese, Japanese, Korean are exempt.
- Remove sentences with fewer than three characters. Chinese, Japanese, Korean are exempt.
- Remove sentences with more than 2000 characters for Chinese, Japanese, Korean.
- Remove sentences with less than 1% alpha characters.
- Remove dictionary entries containing more than 50 words

### White space

- Replace any sequence of white-space characters including tabs and CR/LF sequences with a single space character.
- Remove leading or trailing space in the sentence.

### Sentence end punctuation

- Replace multiple sentence end punctuation characters with a single instance. Japanese character normalization.
- Convert full width letters and digits to half-width characters.

### Unescaped XML tags

Filtering transforms unescaped tags into escaped tags:

| Tag | Becomes |
|---|---|
| \&lt; | \&amp;lt;  |
| \&gt; | \&amp;gt;  |
| \&amp; | \&amp;amp; |

### Invalid characters

Custom Translator removes sentences that contain Unicode character U+FFFD. The character U+FFFD indicates a failed encoding conversion.

## Before uploading data

- Remove sentences with invalid encoding.
- Remove Unicode control characters.
- If feasible, align sentences (source to target).
- Remove source and target sentences that do not match the source and target languages.
- When source and target sentences have mixed languages, ensure that untranslated words are intentional, for example, names of organizations and products.
- Correct grammatical and typographical errors to prevent teaching your model these errors.
- Though our training process handles source and target lines containing multiple sentences, it's better to have one source sentence mapped to one target sentence.

## Evaluate

After successful completion of your model training, you will see model performance details listing your custom model BLEU score and our baseline model used during the training. We use your test data to score both numbers to help you make informed decision which model would be better for your use-case.

## Next steps

- Read [Quickstart](quickstart.md) to learn, how to build and publish translation systems with Custom Translator.
