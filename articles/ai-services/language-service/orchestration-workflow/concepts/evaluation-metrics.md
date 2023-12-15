---
title: Orchestration workflow model evaluation metrics
titleSuffix: Azure AI services
description: Learn about evaluation metrics in orchestration workflow
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 05/19/2022
ms.author: aahi
ms.custom: language-service-orchestration
---

# Evaluation metrics for orchestration workflow models

Your dataset is split into two parts: a set for training, and a set for testing. The training set is used to train the model, while the testing set is used as a test for model after training to calculate the model performance and evaluation. The testing set isn't introduced to the model through the training process, to make sure that the model is tested on new data. <!--See [data splitting](../how-to/train-model.md#data-splitting) for more information-->

Model evaluation is triggered automatically after training is completed successfully. The evaluation process starts by using the trained model to predict user defined intents for utterances in the test set, and compares them with the provided tags (which establishes a baseline of truth). The results are returned so you can review the model’s performance. For evaluation, orchestration workflow uses the following metrics:

* **Precision**: Measures how precise/accurate your model is. It's the ratio between the correctly identified positives (true positives) and all identified positives. The precision metric reveals how many of the predicted classes are correctly labeled. 

    `Precision = #True_Positive / (#True_Positive + #False_Positive)`

* **Recall**: Measures the model's ability to predict actual positive classes. It's the ratio between the predicted true positives and what was actually tagged. The recall metric reveals how many of the predicted classes are correct.

    `Recall = #True_Positive / (#True_Positive + #False_Negatives)`

* **F1 score**: The F1 score is a function of Precision and Recall. It's needed when you seek a balance between Precision and Recall.

    `F1 Score = 2 * Precision * Recall / (Precision + Recall)` 


Precision, recall, and F1 score are calculated for:
* Each intent separately (intent-level evaluation)
* For the model collectively (model-level evaluation).

The definitions of precision, recall, and evaluation are the same for intent-level and model-level evaluations. However, the counts for *True Positives*, *False Positives*, and *False Negatives* can differ. For example, consider the following text.

### Example

* Make a response with thank you very much
* Call my friend
* Hello
* Good morning

These are the intents used: *CLUEmail* and *Greeting*

The model could make the following predictions:

| Utterance | Predicted intent | Actual intent |
|--|--|--|
|Make a response with thank you very much|CLUEmail|CLUEmail|
|Call my friend|Greeting|CLUEmail|
|Hello|CLUEmail|Greeting|
|Goodmorning| Greeting|Greeting|

### Intent level evaluation for *CLUEmail* intent

| Key | Count | Explanation |
|--|--|--|
| True Positive | 1 | Utterance 1 was correctly predicted as *CLUEmail*. |
| False Positive | 1 |Utterance 3 was mistakenly predicted as *CLUEmail*. |
| False Negative | 1 | Utterance 2 was mistakenly predicted as *Greeting*. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 1) = 0.5`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 1) = 0.5`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.5 * 0.5) / (0.5 + 0.5) = 0.5`

### Intent level evaluation for *Greeting* intent

| Key | Count | Explanation |
|--|--|--|
| True Positive | 1 | Utterance 4 was correctly predicted as *Greeting*. |
| False Positive | 1 |Utterance 2 was mistakenly predicted as *Greeting*. |
| False Negative | 1 | Utterance 3 was mistakenly predicted as *CLUEmail*. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 1) = 0.5`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 1) = 0.5`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.5 * 0.5) / (0.5 + 0.5) = 0.5`


### Model-level evaluation for the collective model

| Key | Count | Explanation |
|--|--|--|
| True Positive | 2 | Sum of TP for all intents |
| False Positive | 2| Sum of FP for all intents |
| False Negative | 2 | Sum of FN for all intents |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 2 / (2 + 2) = 0.5`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 2 / (2 + 2) = 0.5`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.5 * 0.5) / (0.5 + 0.5) = 0.5`


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
