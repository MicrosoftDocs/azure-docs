---
title: View the evaluation for a Custom Named Entity Recognition (NER) model
titleSuffix: Azure Cognitive Services
description: Learn how to view the evaluation scores for a Custom Named Entity Recognition (NER) model
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 08/17/2021
ms.author: aahi
---


# View the evaluation for a Custom Named Entity Recognition (NER) model

After your model has finished training, you can view the model details and see how well does it perform against the test set, which contains 10% of your data at random, which is created during [training](train-model.md#data-groups). The test set consists of data that was not introduced to the model during the training process. For the evaluation process to complete there must be at least 10 files in your dataset.

## Prerequisites

* A [custom NER project](../quickstart.md)
* A [trained model](train-model.md)

## View the model's evaluation details

1. Go to your project page in [Language Studio](https://language.azure.com/customTextNext/projects/extraction).

2. Select **View model details** from the menu on the left side of the screen.

3. View your model training status in the **Status** column, and the F1 score for the model in the **F1 score** column. you can click on the model name for more details.

4. You can find the **model-level** evaluation metrics under **Overview**, and the **entity-level** evaluation metrics under **Entity performance metrics**. The confusion matrix for the model is located under **Test set confusion matrix**
    
    > [!NOTE]
    > If you don't find all the entities displayed here, it's because they were not in any of the files within the test set.

    :::image type="content" source="../media/model-details.png" alt-text="A screenshot of the model performance metrics in Language Studio" lightbox="../media/model-details.png":::



## Evaluation Metrics

Model evaluation in custom entity extraction uses the following metrics:


|Metric |Description  |Calculation  |
|---------|---------|---------|
|Precision     |  The ratio of successful attempted recognitions to all attempts.       | `Precision = #True_Positive / (#True_Positive + #False_Positive)`        |
|Recall     | The ratio of successful attempted recognitions to the actual number of entities present.        | `Recall = #True_Positive / (#True_Positive + #False_Negatives)`        |
|F1 score    |  The combination of precision and recall.       |  `F1 Score = 2 * Precision * Recall / (Precision + Recall)`       |

## Model-level and entity-level evaluation metrics

Precision, recall, and F1 score are calculated for each entity separately (entity-level evaluation) and for the model collectively (model-level evaluation).

The definitions of precision, recall, and evaluation are the same for both entity-level and model-level evaluations. However, the counts for *True Positives*, *False Positives*, and *False Negatives* differ can differ. For example, consider the following text.

### Example

*The first party of this contract is John Smith, resident of 5678 Main Rd., City of Frederick, state of Nebraska. And the second party is Forrest Ray, resident of 123-345 Integer Rd., City of Corona, state of New Mexico. There is also Fannie Thomas resident of 7890 River Road, city of Colorado Springs, State of Colorado.*

The model extracting entities from this text could have the following predictions:

| Entity | Predicted as | Actual type |
|--|--|--|
| John Smith | Person | Person |
| Frederick | Person | City |
| Forrest | City | Person |
| Fannie Thomas | Person | Person |
| Colorado Springs | City | City |

### Entity-level evaluation for the *person* entity 

The model would have the following entity-level evaluation, for the *person* entity:

| Key | Count | Explanation |
|--|--|--|
| True Positive | 2 | *John Smith* and *Fannie Thomas* were correctly predicted as *person*. |
| False Positive | 1 | *Frederick* was incorrectly predicted as *person* while it should have been *city*. |
| False Negative | 1 | *Forrest* was incorrectly predicted as *city* while it should have been *person*. |

* **Precision**: `#True_Positive / (#True_Positive + #False_Positive)` = `2 / (2 + 1) = 0.67`
* **Recall**: `#True_Positive / (#True_Positive + #False_Negatives)` = `2 / (2 + 1) = 0.67`
* **F1 Score**: `2 * Precision * Recall / (Precision + Recall)` = `(2 * 0.67 * 0.67) / (0.67 + 0.67) = 0.67`

### Entity-level evaluation for the *city* entity

The model would have the following entity-level evaluation, for the *city* entity:

| Key | Count | Explanation |
|--|--|--|
| True Positive | 1 | *Colorado Springs* was correctly predicted as *city*. |
| False Positive | 1 | *Forrest* was incorrectly predicted as *city* while it should have been *person*. |
| False Negative | 1 | *Frederick* was incorrectly predicted as *person* while it should have been *city*. |

* **Precision** = `#True_Positive / (#True_Positive + #False_Positive)` = `2 / (2 + 1) = 0.67`
* **Recall** = `#True_Positive / (#True_Positive + #False_Negatives)` = `2 / (2 + 1) = 0.67`
* **F1 Score** = `2 * Precision * Recall / (Precision + Recall)` =  `(2 * 0.67 * 0.67) / (0.67 + 0.67) = 0.67`

### Model-level evaluation for the collective model

The model would have the following evaluation for the model in its entirety:

| Key | Count | Explanation |
|--|--|--|
| True Positive | 3 | *John Smith* and *Fannie Thomas* were correctly predicted as *person*. *Colorado Springs* was correctly predicted as *city*. This is the sum of true positives for all entities. |
| False Positive | 2 | *Forrest* was incorrectly predicted as *city* while it should have been *person*. *Frederick* was incorrectly predicted as *person* while it should have been *city*. This is the sum of false positives for all entities. |
| False Negative | 2 | *Forrest* was incorrectly predicted as *city* while it should have been *person*. *Frederick* was incorrectly predicted as *person* while it should have been *city*. This is the sum of false negatives for all entities. |

* **Precision** = `#True_Positive / (#True_Positive + #False_Positive)` = `3 / (3 + 2) = 0.6`
* **Recall** = `#True_Positive / (#True_Positive + #False_Negatives)` = `3 / (3 + 2) = 0.6`
* **F1 Score** = `2 * Precision * Recall / (Precision + Recall)` =  `(2 * 0.6 * 0.6) / (0.6 + 0.6) = 0.6`

## Interpreting entity-level evaluation metrics

So what does it actually mean to have high precision or high recall for a certain entity?

| Recall | Precision | Interpretation |
|--|--|--|
| High | High | This entity is handled well by the model. |
| Low | High | The model cannot always extract this entity, but when it does it is with high confidence. |
| High | Low | The model extracts this entity well, however it is with low confidence as it is sometimes extracted as another type. |
| Low | Low | This entity type is poorly handled by the model, because it is not usually extracted. When it is, it is not with high confidence. |

## Confusion matrix

A Confusion matrix is an N x N matrix used for model performance evaluation, where N is the number of entities.
The matrix compares the actual tags with the tags predicted by the model.
This gives a holistic view of how well the model is performing and what kinds of errors it is making.
The highlighted diagonal is the correctly predicted entities, where the predicted tag is the same as the actual tag.

:::image type="content" source="../media/confusion-matrix-example.png" alt-text="A screenshot of an example confusion matrix" lightbox="../media/confusion-matrix-example.png":::

You can calculate the entity-level and model-level evaluation metrics from the confusion matrix:

* The values in the diagonal are the *True Positive* values of each entity.
* The sum of the values in the entity rows (excluding the diagonal) is the *false positive* of the model.
* The sum of the values in the entity columns (excluding the diagonal) is the *false Negative* of the model.

Similarly,

* The *true positive* of the model is the sum of *true Positives* for all entities.
* The *false positive* of the model is the sum of *false positives* for all entities.
* The *false Negative* of the model is the sum of *false negatives* for all entities.

## Next steps

After reviewing your model's evaluation, you can start [improving your model](improve-model.md).

