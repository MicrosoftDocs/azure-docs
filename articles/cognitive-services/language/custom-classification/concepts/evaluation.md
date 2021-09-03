---
title: Custom classification evaluation metrics 
titleSuffix: Azure Cognitive Services
description: Learn about evaluation metrics in custom entity extraction, which is a part of Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/15/2021
ms.author: aahi
---

# Evaluation metrics

After you train your model, Custom Text Classification will evaluate your model against a [test set](../how-to/train-model.md#data-groups) generated from your documents at random. 

Model evaluation in Custom Text Classification uses the following metrics:

* **Precision** is the ratio of correctly predicted classes to all tagged classes in your data. It's calculated with the following equation: 

    `Precision = #True_Positive / (#True_Positive + #False_Positive)`

* **Recall** is the ratio of correctly predicted classes to the actual number of classes (ground truth). It's calculated with the following equation 
    
    `Recall = #True_Positive / (#True_Positive + #False_Negatives)`

* **F1 score** is the combination of precision and recall. It's calculated with the following equation

    `F1 Score = 2 * Precision * Recall / (Precision + Recall)`

>[!NOTE]
> Precision, recall and F1 score are calculated for each class separately (*class-level* evaluation) and for the model collectively (*model-level* evaluation).

## Model-level and Class-level evaluation metrics

The definitions of precision, recall, and evaluation are the same for both class-level and model-level evaluations. However, the count of *True Positive*, *False Positive*, and *False Negative* differ as shown in the following example.

The below sections use the following example dataset:

| File | Actual classes | Predicted classes |
|--|--|--|
| 1 | action, comedy | comedy|
| 2 | action | action |
| 3 | romance | romance |
| 4 | romance, comedy | romance |
| 5 | comedy | action |

### Class-level evaluation for the *action* class 

| Key | Count | Explanation |
|--|--|--|
| True Positive | 1 | File 2 was correctly classified as *action*. |
| False Positive | 1 | File 5 was mistakenly classified as *action*. |
| False Negative | 1 | File 1 was not classified as *Action* though it should have. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 1) = 0.5`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 1) = 0.5`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.5 * 0.5) / (0.5 + 0.5) = 0.5`

### Class-level evaluation for the *comedy* class 

| Key | Count | Explanation |
|--|--|--|
| True positive | 1 | File 1 was correctly classified as *comedy*. |
| False positive | 0 | No files were mistakenly classified as *comedy*. |
| False negative | 2 | Files 5 and 4 were not classified as *comedy* though they should have. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 0) = 1`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 2) = 0.67`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 1 * 0.67) / (1 + 0.67) = 0.8`

### Model-level evaluation for the collective model

| Key | Count | Explanation |
|--|--|--|
| True Positive | 4 | Files 1, 2, 3 and 4 were given correct classes at prediction. |
| False Positive | 1 | File 5 was given a wrong class at prediction. |
| False Negative | 2 | Files 1 and 4 were not given all correct class at prediction. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 4 / (4 + 1) = 0.8`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 4 / (4 + 2) = 0.67`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.8 * 0.67) / (0.8 + 0.67) = 0.12`

## Interpreting class-level evaluation metrics

So what does it actually mean to have a high precision or a high recall for a certain class?

| Recall | Precision | Interpretation |
|--|--|--|
| High | High | This class is perfectly handled by the model. |
| Low | High | The model cannot always predict this class but when it does it is with high confidence. This may be because this class is underrepresented in the dataset so consider balancing your data distribution.|
| High | Low | The model predicts this class well, however it is with low confidence. This may be because this class is over represented in the dataset so consider balancing your data distribution. |
| Low | Low | This class is poorly handled by the model where it is not usually predicted and when it is, it is not with high confidence. |

## See also

* [View the model evaluation](../how-to/view-model-evaluation.md)
* [Train a model](../how-to/train-model.md)