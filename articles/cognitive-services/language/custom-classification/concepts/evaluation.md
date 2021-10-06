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

Your dataset is split into two parts train set and test set where the train set is used to train the model, while the test set is used as a blind set to evaluate model performance. You can learn more bout data splits [here](../how-to/train-model.md#data-splits).

Model evaluation process is triggered after training is completed successfully. The evaluation process takes place by using the trained model to predict user defined classes for files in the test set and compare them with the provided data tags (ground truth). The results are returned to the developer to review the model’s performance. For evaluation Custom Text Classification uses the following metrics:

* **Precision** the measure of how precise/accurate your model is. It is the ratio between the True Positives and all the Positives. Precision reveals out of all predicted classes, how many of them are actually true (belong to the right class as tagged).<br> `Precision = #True_Positive / (#True_Positive + #False_Positive)` <br>

* **Recall**: the measure of the model's ability to predict actual positive classes. It is the ratio between the predicted True Positives and the actually tagged positives. Recall reveals out of predicted classes, how many of them are correct. <br> `Recall = #True_Positive / (#True_Positive + #False_Negatives)` <br> 

* **F1 score**: F1 score is a function of Precision and Recall. It is needed when you seek a balance between Precision and Recall. <br> `F1 Score = 2 * Precision * Recall / (Precision + Recall)` <br> 

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

**Note**: False negative and false positive are equal in the cases of single-label classification because the way custom single label classification model works is that it always predicts one class to each file, so no files would given a negative class which is by definition not predicting a positive label. However this is not the case for multi-label classification because in this case failing to predict one of the classes of a file is counted as a false negative. Precision, recall and F1 score are laso expected to be equal in case of single-label classification becasue false negative and false positive are equal. 

## Interpreting class-level evaluation metrics

So what does it actually mean to have a high precision or a high recall for a certain class?

| Recall | Precision | Interpretation |
|--|--|--|
| High | High | This class is perfectly handled by the model. |
| Low | High | The model cannot always predict this class but when it does it is with high confidence. This may be because this class is underrepresented in the dataset so consider balancing your data distribution.|
| High | Low | The model predicts this class well, however it is with low confidence. This may be because this class is over represented in the dataset so consider balancing your data distribution. |
| Low | Low | This class is poorly handled by the model where it is not usually predicted and when it is, it is not with high confidence. |

Any Custom classification model is expected to experience both false negative and false positive errors. Developers need to consider how each type of error will affect the overall system and carefully think through scenarios where true events won't be recognized and incorrect events will be recognized. Depending on your scenario, **Precision** or **Recall** could be more a suitable metric for evaluating your model's performance.  

For example, if your scenario is about tickets triaging, predicting the wrong class would then cause it forwarded to the wrong team and this will cost time and effort. In this case your system should be more sensitive to false positives and precision would then be a more relevant metric for evaluation. However, if your scenario is about categorizing your email to important or spam, failing to predict that a certain email is important will cause you to miss it but if spam email was mistakenly marked important you simply disregard it. In this case, the system should be more sensitive to false negatives and recall would then be a more relevant metric for evaluation. If you want to optimize for general purpose scenarios or when precision and recall are both important, you can rely in the F1 score. Evaluation scores are subjective to your scenario and acceptance criteria, there is no absolute metric that works for all the scenarios. 

 
## See also

* [View the model evaluation](../how-to/view-model-evaluation.md)
* [Train a model](../how-to/train-model.md)
