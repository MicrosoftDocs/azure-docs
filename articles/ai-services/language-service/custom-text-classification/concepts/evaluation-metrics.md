---
title: Custom text classification evaluation metrics
titleSuffix: Azure AI services
description: Learn about evaluation metrics in custom text classification.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021, event-tier1-build-2022
---

# Evaluation metrics

Your [dataset is split](../how-to/train-model.md#data-splitting) into two parts: a set for training, and a set for testing. The training set is used to train the model, while the testing set is used as a test for model after training to calculate the model performance and evaluation. The testing set isn't introduced to the model through the training process, to make sure that the model is tested on new data.

Model evaluation is triggered automatically after training is completed successfully. The evaluation process starts by using the trained model to predict user defined classes for documents in the test set, and compares them with the provided data tags (which establishes a baseline of truth). The results are returned so you can review the model’s performance. For evaluation, custom text classification uses the following metrics:

* **Precision**: Measures how precise/accurate your model is. It's the ratio between the correctly identified positives (true positives) and all identified positives. The precision metric reveals how many of the predicted classes are correctly labeled. 

    `Precision = #True_Positive / (#True_Positive + #False_Positive)`

* **Recall**: Measures the model's ability to predict actual positive classes. It's the ratio between the predicted true positives and what was actually tagged. The recall metric reveals how many of the predicted classes are correct.

    `Recall = #True_Positive / (#True_Positive + #False_Negatives)`

* **F1 score**: The F1 score is a function of Precision and Recall. It's needed when you seek a balance between Precision and Recall.

    `F1 Score = 2 * Precision * Recall / (Precision + Recall)` <br> 

>[!NOTE]
> Precision, recall and F1 score are calculated for each class separately (*class-level* evaluation) and for the model collectively (*model-level* evaluation).
## Model-level and Class-level evaluation metrics

The definitions of precision, recall, and evaluation are the same for both class-level and model-level evaluations. However, the count of *True Positive*, *False Positive*, and *False Negative* differ as shown in the following example.

The below sections use the following example dataset:

| Document | Actual classes | Predicted classes |
|--|--|--|
| 1 | action, comedy | comedy|
| 2 | action | action |
| 3 | romance | romance |
| 4 | romance, comedy | romance |
| 5 | comedy | action |

### Class-level evaluation for the *action* class 

| Key | Count | Explanation |
|--|--|--|
| True Positive | 1 | Document 2 was correctly classified as *action*. |
| False Positive | 1 | Document 5 was mistakenly classified as *action*. |
| False Negative | 1 | Document 1 was not classified as *Action* though it should have. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 1) = 0.5`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 1) = 0.5`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.5 * 0.5) / (0.5 + 0.5) = 0.5`

### Class-level evaluation for the *comedy* class 

| Key | Count | Explanation |
|--|--|--|
| True positive | 1 | Document 1 was correctly classified as *comedy*. |
| False positive | 0 | No documents were mistakenly classified as *comedy*. |
| False negative | 2 | Documents 5 and 4 were not classified as *comedy* though they should have. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 0) = 1`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 2) = 0.33`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 1 * 0.67) / (1 + 0.67) = 0.80`

### Model-level evaluation for the collective model

| Key | Count | Explanation |
|--|--|--|
| True Positive | 4 | Documents 1, 2, 3 and 4 were given correct classes at prediction. |
| False Positive | 1 | Document 5 was given a wrong class at prediction. |
| False Negative | 2 | Documents 1 and 4 were not given all correct class at prediction. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 4 / (4 + 1) = 0.8`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 4 / (4 + 2) = 0.67`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.8 * 0.67) / (0.8 + 0.67) = 0.73`

> [!NOTE] 
> For single-label classification models, the count of false negatives and false positives are always equal. Custom single-label classification models always predict one class for each document. If the prediction is not correct, FP count of the predicted class increases by one and FN of the actual class increases by one, overall count of FP and FN for the model will always be equal. This is not the case for multi-label classification, because failing to predict one of the classes of a document is counted as a false negative. 
## Interpreting class-level evaluation metrics

So what does it actually mean to have a high precision or a high recall for a certain class?

| Recall | Precision | Interpretation |
|--|--|--|
| High | High | This class is perfectly handled by the model. |
| Low | High | The model can't always predict this class but when it does it is with high confidence. This may be because this class is underrepresented in the dataset so consider balancing your data distribution.|
| High | Low | The model predicts this class well, however it is with low confidence. This may be because this class is over represented in the dataset so consider balancing your data distribution. |
| Low | Low | This class is poorly handled by the model where it is not usually predicted and when it is, it is not with high confidence. |

Custom text classification models are expected to experience both false negatives and false positives. You need to consider how each will affect the overall system, and carefully think through scenarios where the model will ignore correct predictions, and recognize incorrect predictions. Depending on your scenario, either *precision* or *recall* could be more suitable evaluating your model's performance.  

For example, if your scenario involves processing technical support tickets, predicting the wrong class could cause it to be forwarded to the wrong department/team. In this example, you should consider making your system more sensitive to false positives, and precision would be a more relevant metric for evaluation. 

As another example, if your scenario involves categorizing email as  "*important*" or "*spam*", an incorrect prediction could cause you to miss a useful email if it's labeled "*spam*". However, if a spam email is labeled *important* you can disregard it. In this example, you should consider making your system more sensitive to false negatives, and recall would be a more relevant metric for evaluation. 

If you want to optimize for general purpose scenarios or when precision and recall are both important, you can utilize the F1 score. Evaluation scores are subjective depending on your scenario and acceptance criteria. There is no absolute metric that works for every scenario. 

## Guidance

After you trained your model, you will see some guidance and recommendation on how to improve the model. It's recommended to have a model covering all points in the guidance section.

* Training set has enough data: When a class type has fewer than 15 labeled instances in the training data, it can lead to lower accuracy due to the model not being adequately trained on these cases.

* All class types are present in test set: When the testing data lacks labeled instances for a class type, the model’s test performance may become less comprehensive due to untested scenarios.

* Class types are balanced within training and test sets: When sampling bias causes an inaccurate representation of a class type’s frequency, it can lead to lower accuracy due to the model expecting that class type to occur too often or too little.

* Class types are evenly distributed between training and test sets: When the mix of class types doesn’t match between training and test sets, it can lead to lower testing accuracy due to the model being trained differently from how it’s being tested.

* Class types in training set are clearly distinct: When the training data is similar for multiple class types, it can lead to lower accuracy because the class types may be frequently misclassified as each other.

## Confusion matrix

> [!Important]
> Confusion matrix is not available for multi-label classification projects.
A Confusion matrix is an N x N matrix used for model performance evaluation, where N is the number of classes.
The matrix compares the expected labels with the ones predicted by the model.
This gives a holistic view of how well the model is performing and what kinds of errors it is making.

You can use the Confusion matrix to identify classes that are too close to each other and often get mistaken (ambiguity). In this case consider merging these classes together. If that isn't possible, consider labeling more documents with both classes to help the model differentiate between them.

All correct predictions are located in the diagonal of the table, so it is easy to visually inspect the table for prediction errors, as they will be represented by values outside the diagonal.

:::image type="content" source="../media/confusion.png" alt-text="A screenshot of an example confusion matrix." lightbox="../media/confusion.png":::

You can calculate the class-level and model-level evaluation metrics from the confusion matrix:

* The values in the diagonal are the *True Positive* values of each class.
* The sum of the values in the class rows (excluding the diagonal) is the *false positive* of the model.
* The sum of the values in the class columns (excluding the diagonal) is the *false Negative* of the model.

Similarly,

* The *true positive* of the model is the sum of *true Positives* for all classes.
* The *false positive* of the model is the sum of *false positives* for all classes.
* The *false Negative* of the model is the sum of *false negatives* for all classes.


## Next steps

* [View a model's performance in Language Studio](../how-to/view-model-evaluation.md)
* [Train a model](../how-to/train-model.md)
