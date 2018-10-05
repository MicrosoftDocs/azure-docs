---
title: Testing dataset in Custom Translator
titlesuffix: Azure Cognitive Services
description: Testing dataset in Custom Translator.
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 10/15/2018
ms.author: v-rada
ms.topic: testing dataset
Customer intent: As a custom translator user, I want to know how to prepare testing datasets, so that I manage my test documents better.
---

# Testing dataset

Parallel documents included in the testing set are used to compute the BLEU
(Bilingual Evaluation Understudy) score. This score indicates the quality of your
translation system. This score actually tells you how closely the translations done by
the translation system resulting from this training match the reference
sentences in the test data set.

The BLEU score is a measurement of the delta
between the automatic translation and the reference translation. Its value
ranges from 0 to 100. A score of 0 indicates that not a single word of the
reference appears in the translation. A score of 100 indicates that the
automatic translation exactly matches the reference: the same word is in the
exact same position. The score you receive is the BLEU score average for all
sentences of the testing set.

The test set should include parallel documents where the target language
sentences are the most desirable translations of the corresponding source
language sentences in the pair. You may want to use the same criteria you used
to compose the tuning set. However, the testing set has no influence over the
quality of the translation system. It is used exclusively to generate the BLEU
score for you, and for nothing else.

You do not need more than 2500 sentences as the testing set. When you let the
system choose the testing set automatically, it will use a random subset of
sentences from your bilingual training documents, and exclude these sentences
from the training material itself.

You can view the custom translations of the testing set, and compare them to the
translations provided in your testing set, by navigating to the test tab within
a model.

## Next steps

- Read about [sentence alignment in parallel documents](concept-sentence-alignment.md).