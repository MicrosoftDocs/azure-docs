---
title: Tuning dataset in Custom Translator
titlesuffix: Azure Cognitive Services
description: What is tuning dataset in Custom Translator.
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 10/15/2018
ms.author: v-rada
ms.topic: tuning dataset
Customer intent: As a custom translator user, I want to know how to prepare tuning datasets, so that I manage my tuning documents better.
---

# Tuning dataset

Parallel documents included in this set are used by the Custom Translator to
tune the translation system for optimal results.

The tuning set is used during training to adjust all parameters and weights of
the translation system to the optimal values. Choose your tuning set carefully:
the tuning set should be representative of the content of the documents you
intend to translate in the future. The tuning set has a major influence on the
quality of the translations produced. Tuning enables the translation system to
provide translations that are closest to the samples you provide in the tuning
dataset. You do not need more than 2500 sentences as tuning set. For optimal
translation quality, it is recommended to select the tuning set manually by
choosing the most representative selection of sentences.

When creating your tuning set, choose sentences that are a meaningful and
representative length of the future sentences that you expect to translate. You
should also choose sentences that have words and phrases that you intend to
translate in the approximate distribution that you expect in your future
translations. In practice, a sentence length of 8 to 18 words will produce the
best results, because these sentences contain enough context to show inflection
and provide a phrase length that is significant, without being overly complex.

A good description of the type of sentences to use in the tuning set is “prose”:
actual fluent sentences. Not table cells, not poems, not lists of things, not
only punctuation, or numbers in a sentence - regular language.

If you manually select your tuning data set, it should not have any of the same
sentences as your training and testing data. The tuning set has a significant
impact on the quality of the translations - choose the sentences carefully.

If you are not sure what to choose for your tuning set, just select the training
set and let Custom Translator select your tuning set for you. When you let the
Custom Translator choose the tuning set automatically, it will use a random
subset of sentences from your bilingual training documents and exclude these
sentences from the training material itself.

## Next steps

- Read about [testing dataset](concept-testing-dataset.md).