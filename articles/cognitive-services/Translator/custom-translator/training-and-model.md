---
title: What is training and model? - Custom Translator
titleSuffix: Azure Cognitive Services
description: A model is the system, which provides translation for a specific language pair. The outcome of a successful training is a model. When training a model, three mutually exclusive data sets are required training dataset, tuning dataset, and testing dataset.
author: swmachan
manager: christw
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 02/21/2019
ms.author: swmachan
#Customer intent: As a Custom Translator user, I want to concept of a model and training, so that I can efficiently use training, tuning and testing datasets the helps me build a translation model.
---

# What are trainings and models?

A model is the system, which provides translation for a specific language pair.
The outcome of a successful training is a model. When training a model, three
mutually exclusive data sets are required: training dataset, tuning dataset, and
testing dataset. Dictionary data can also be provided.

If only training data is provided when queuing a training, Custom Translator will automatically assemble tuning and testing datasets. It will exclude 5,000 sentences from your training data and use 2,500 each to assemble a tuning and testing sets.

## Training dataset for Custom Translator

Documents included in training set are used by the Custom Translator as the basis for building your model. During training execution, sentences that are present in these documents are aligned (or paired). You can take liberties in composing your set of training documents. You can include documents that you believe are of tangential relevance in one model. Again exclude them in another to see the impact in [BLEU (Bilingual Evaluation Understudy) score](what-is-bleu-score.md). As long as you keep the tuning set and test set constant, feel free to experiment with the composition of the training set. This approach  is an effective way to modify the quality of your translation system.

You can run multiple trainings within a project and compare the [BLEU scores](what-is-bleu-score.md) across all training runs. When you are running multiple trainings for comparison, ensure same tuning/ test data is specified each time. Also make sure to also inspect the results manually in the [“Testing”](how-to-view-system-test-results.md) tab.

## Tuning dataset for Custom Translator

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

A good description of the type of sentences to use in the tuning set is prose:
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

## Testing dataset for Custom Translator

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

You don't need more than 2,500 sentences as the testing set. When you let the
system choose the testing set automatically, it will use a random subset of
sentences from your bilingual training documents, and exclude these sentences
from the training material itself.

You can view the custom translations of the testing set, and compare them to the
translations provided in your testing set, by navigating to the test tab within
a model.
