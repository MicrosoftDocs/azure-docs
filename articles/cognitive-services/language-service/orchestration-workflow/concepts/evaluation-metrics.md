---
title: Orchestration workflow model evaluation metrics
titleSuffix: Azure Cognitive Services
description: Learn about evaluation metrics in orchestration workflow
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 03/17/2022
ms.author: aahi
ms.custom: language-service-orchestration
---

# Evaluation metrics for orchestration workflow models

Model evaluation in orchestration workflow uses the following metrics:

|Metric |Description  |Calculation  |
|---------|---------|---------|
|Precision     |  The ratio of successful recognitions to all attempted recognitions. This shows how many times the model's entity recognition is truly a good recognition.       | `Precision = #True_Positive / (#True_Positive + #False_Positive)`        |
|Recall     | The ratio of successful recognitions to the actual number of entities present.        | `Recall = #True_Positive / (#True_Positive + #False_Negatives)`        |
|F1 score    |  The combination of precision and recall.       |  `F1 Score = 2 * Precision * Recall / (Precision + Recall)`       |

## Confusion matrix

A Confusion matrix is an N x N matrix used for model performance evaluation, where N is the number of intents.
The matrix compares the actual tags with the tags predicted by the model.
This gives a holistic view of how well the model is performing and what kinds of errors it is making.

You can use the Confusion matrix to identify intents that are too close to each other and often get mistaken (ambiguity). In this case consider merging these intents  together. If that isn't possible, consider adding more tagged examples of both intents to help the model differentiate between them.

You can calculate the model-level evaluation metrics from the confusion matrix:

* The *true positive* of the model is the sum of *true Positives* for all intents.
* The *false positive* of the model is the sum of *false positives* for all intents.
* The *false Negative* of the model is the sum of *false negatives* for all intents.

## Next steps

[Train a model in Language Studio](../how-to/train-model.md)