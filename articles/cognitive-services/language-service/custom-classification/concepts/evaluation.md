---
title: Custom text classification evaluation metrics
titleSuffix: Azure Cognitive Services
description: Learn about evaluation metrics in custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 04/05/2022
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# Evaluation metrics

Your [dataset is split](../how-to/train-model.md) into two parts: a set for training, and a set for testing. The training set while building the model and the testing set is used as a blind set to evaluate model performance after training is completed.

Model evaluation is triggered after training is completed successfully. The evaluation process starts by using the trained model to predict user defined classes for files in the test set, and compares them with the provided data tags (which establishes a baseline of truth). The results are returned so you can review the model’s performance. For evaluation, custom text classification uses the following metrics:

* **Precision**: Measures how precise/accurate your model is. It is the ratio between the correctly identified positives (true positives) and all identified positives. The precision metric reveals how many of the predicted classes are correctly tagged. 

    `Precision = #True_Positive / (#True_Positive + #False_Positive)`

* **Recall**: Measures the model's ability to predict actual positive classes. It is the ratio between the predicted true positives and what was actually tagged. The recall metric reveals how many of the predicted classes are correct.

    `Recall = #True_Positive / (#True_Positive + #False_Negatives)`

* **F1 score**: The F1 score is a function of Precision and Recall. It's needed when you seek a balance between Precision and Recall.

    `F1 Score = 2 * Precision * Recall / (Precision + Recall)` <br> 

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

> [!NOTE] 
> For single-label classification models, the count of false negatives and false positives are always equal. Custom single-label classification models always predict one class for each file. If the prediction is not correct, FP count of the predicted class increases by one and FN of the actual class increases by one, overall count of FP and FN for the model will always be equal. This is not the case for multi-label classification, because failing to predict one of the classes of a file is counted as a false negative. 

## Interpreting class-level evaluation metrics

So what does it actually mean to have a high precision or a high recall for a certain class?

| Recall | Precision | Interpretation |
|--|--|--|
| High | High | This class is perfectly handled by the model. |
| Low | High | The model cannot always predict this class but when it does it is with high confidence. This may be because this class is underrepresented in the dataset so consider balancing your data distribution.|
| High | Low | The model predicts this class well, however it is with low confidence. This may be because this class is over represented in the dataset so consider balancing your data distribution. |
| Low | Low | This class is poorly handled by the model where it is not usually predicted and when it is, it is not with high confidence. |

Custom text classification models are expected to experience both false negatives and false positives. You need to consider how each will affect the overall system, and carefully think through scenarios where the model will ignore correct predictions, and recognize incorrect predictions. Depending on your scenario, either *precision* or *recall* could be more suitable evaluating your model's performance.  

For example, if your scenario involves processing technical support tickets, predicting the wrong class could cause it to be forwarded to the wrong department/team. In this example, you should consider making your system more sensitive to false positives, and precision would be a more relevant metric for evaluation. 

As another example, if your scenario involves categorizing email as  "*important*" or "*spam*", an incorrect prediction could cause you to miss a useful email if it's labeled "*spam*". However, if a spam email is labeled *important* you can simply disregard it. In this example, you should consider making your system more sensitive to false negatives, and recall would be a more relevant metric for evaluation. 

If you want to optimize for general purpose scenarios or when precision and recall are both important, you can utilize the F1 score. Evaluation scores are subjective based on your scenario and acceptance criteria. There is no absolute metric that works for every scenario. 

## See also

* [View the model evaluation](../how-to/view-model-evaluation.md)
* [Train a model](../how-to/train-model.md)
