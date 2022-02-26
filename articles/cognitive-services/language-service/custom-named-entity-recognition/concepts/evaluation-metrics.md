---
title: Custom NER evaluation metrics
titleSuffix: Azure Cognitive Services
description: Learn about evaluation metrics in Custom Named Entity Recognition (NER)
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021
---

# Evaluation metrics for Custom NER models

Model evaluation in custom entity extraction uses the following metrics:


|Metric |Description  |Calculation  |
|---------|---------|---------|
|Precision     |  The ratio of successful recognitions to all attempted recognitions. This shows how many times the model's entity recognition is truly a good recognition.       | `Precision = #True_Positive / (#True_Positive + #False_Positive)`        |
|Recall     | The ratio of successful recognitions to the actual number of entities present.        | `Recall = #True_Positive / (#True_Positive + #False_Negatives)`        |
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

You can use the Confusion matrix to identify entities that are too close to each other and often get mistaken (ambiguity). In this case consider merging these entity types together. If that isn't possible, consider adding more tagged examples of both entities to help the model differentiate between them.

The highlighted diagonal in the image below is the correctly predicted entities, where the predicted tag is the same as the actual tag.

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

[View a model's evaluation in Language Studio](../how-to/view-model-evaluation.md)
