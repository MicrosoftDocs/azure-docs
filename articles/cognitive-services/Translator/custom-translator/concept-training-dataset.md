---
title: Training dataset in Custom Translator
titlesuffix: Azure Cognitive Services
description: What is training dataset in Custom Translator.
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 10/15/2018
ms.author: v-rada
ms.topic: training dataset
Customer intent: As a custom translator user, I want to know how to prepare training datasets, so that I manage my training documents better.
---

# Training dataset

Documents included in training set are used by the Custom Translator as the basis for building your model. During training execution, sentences that are present in these documents are aligned (or paired). You can take liberties in composing your set of training documents. You can include documents that you believe are of tangential relevance in one model. Again exclude them in another to see the impact in BLEU score. As long as you keep the tuning set and test set constant, feel free to experiment with the composition of the training set. This approach  is an effective way to modify the quality of your translation system. 

You can run multiple trainings within a project and compare the resulting BLEU scores across all the training runs. When you are running multiple trainings for comparison, ensure same tuning/ test data is specified each time. Also make sure to also inspect the results manually in the [“Testing”](how-to-view-system-test-results.md) tab.

## Next steps

- Read about [tuning dataset](concept-tuning-dataset.md).
- Read about [testing dataset](concept-testing-dataset.md).