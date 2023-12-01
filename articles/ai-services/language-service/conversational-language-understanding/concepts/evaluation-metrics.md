---
title: Conversational Language Understanding evaluation metrics
titleSuffix: Azure AI services
description: Learn about evaluation metrics in Conversational Language Understanding
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 05/13/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Evaluation metrics for conversational language understanding models

Your [dataset is split](../how-to/train-model.md#data-splitting) into two parts: a set for training, and a set for testing. The training set is used to train the model, while the testing set is used as a test for model after training to calculate the model performance and evaluation. The testing set isn't introduced to the model through the training process, to make sure that the model is tested on new data.

Model evaluation is triggered automatically after training is completed successfully. The evaluation process starts by using the trained model to predict user defined intents and entities for utterances in the test set, and compares them with the provided tags (which establishes a baseline of truth). The results are returned so you can review the model’s performance. For evaluation, conversational language understanding uses the following metrics:

* **Precision**: Measures how precise/accurate your model is. It's the ratio between the correctly identified positives (true positives) and all identified positives. The precision metric reveals how many of the predicted classes are correctly labeled. 

    `Precision = #True_Positive / (#True_Positive + #False_Positive)`

* **Recall**: Measures the model's ability to predict actual positive classes. It's the ratio between the predicted true positives and what was actually tagged. The recall metric reveals how many of the predicted classes are correct.

    `Recall = #True_Positive / (#True_Positive + #False_Negatives)`

* **F1 score**: The F1 score is a function of Precision and Recall. It's needed when you seek a balance between Precision and Recall.

    `F1 Score = 2 * Precision * Recall / (Precision + Recall)`


Precision, recall, and F1 score are calculated for:
* Each entity separately (entity-level evaluation)
* Each intent separately (intent-level evaluation)
* For the model collectively (model-level evaluation).

The definitions of precision, recall, and evaluation are the same for entity-level, intent-level and model-level evaluations. However, the counts for *True Positives*, *False Positives*, and *False Negatives* can differ. For example, consider the following text.

### Example

* Make a response with thank you very much.
* reply with saying yes.
* Check my email please.
* email to cynthia that dinner last week was splendid.
* send email to mike

These are the intents used: *Reply*,*sendEmail*,*readEmail*. These are the entities: *contactName*, *message*.

The model could make the following predictions:

| Utterance | Predicted intent | Actual intent |Predicted entity| Actual entity|
|--|--|--|--|--|
|Make a response with thank you very much|Reply|Reply|`thank you very much` as `message` |`thank you very much` as `message` |
|reply with saying yes| sendEmail|Reply|--|`yes` as `message`|
|Check my email please|readEmail|readEmail|--|--|
|email to cynthia that dinner last week was splendid|Reply|sendEmail|`dinner last week was splendid` as `message`| `cynthia` as `contactName`, `dinner last week was splendid` as `message`|
|send email to mike|sendEmail|sendEmail|`mike` as `message`|`mike` as `contactName`|


### Intent level evaluation for *Reply* intent

| Key | Count | Explanation |
|--|--|--|
| True Positive | 1 | Utterance 1 was correctly predicted as *Reply*. |
| False Positive | 1 |Utterance 4 was mistakenly predicted as *Reply*. |
| False Negative | 1 | Utterance 2 was mistakenly predicted as *sendEmail*. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 1) = 0.5`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 1) = 0.5`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.5 * 0.5) / (0.5 + 0.5) = 0.5 `


### Intent level evaluation for *sendEmail* intent

| Key | Count | Explanation |
|--|--|--|
| True Positive | 1 | Utterance 5 was correctly predicted as *sendEmail* |
| False Positive | 1 |Utterance 2 was mistakenly predicted as *sendEmail*. |
| False Negative | 1 | Utterance 4 was mistakenly predicted as *Reply*. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 1) = 0.5`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 1) = 0.5`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.5 * 0.5) / (0.5 + 0.5) = 0.5 `

### Intent level evaluation for *readEmail* intent

| Key | Count | Explanation |
|--|--|--|
| True Positive | 1 | Utterance 3 was correctly predicted as *readEmail*. |
| False Positive | 0 |--|
| False Negative | 0 |--|

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 0) = 1`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 0) = 1`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 1 * 1) / (1 + 1) = 1`

### Entity level evaluation for *contactName* entity

| Key | Count | Explanation |
|--|--|--|
| True Positive | 1 |  `cynthia` was correctly predicted as `contactName` in utterance 4|
| False Positive | 0 |--|
| False Negative | 1 | `mike` was mistakenly predicted as `message` in utterance 5 |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 0) = 1`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 1) = 0.5`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 1 * 0.5) / (1 + 0.5) = 0.67`

### Entity level evaluation for *message* entity

| Key | Count | Explanation |
|--|--|--|
| True Positive | 2 |`thank you very much` was correctly predicted as `message` in utterance 1 and `dinner last week was splendid` was correctly predicted as `message` in utterance 4 |
| False Positive | 1 |`mike` was mistakenly predicted as `message` in utterance 5  |
| False Negative | 1 | ` yes` was not predicted as `message` in utterance 2 |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 2 / (2 + 1) = 0.67`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 2 / (2 + 1) = 0.67`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.67 * 0.67) / (0.67 + 0.67) = 0.67`


### Model-level evaluation for the collective model

| Key | Count | Explanation |
|--|--|--|
| True Positive | 6 | Sum of TP for all intents and entities |
| False Positive | 3| Sum of FP for all intents and entities  |
| False Negative | 4 | Sum of FN for all intents and entities  |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 6 / (6 + 3) = 0.67`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 6 / (6 + 4) = 0.60`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.67 * 0.60) / (0.67 + 0.60) = 0.63`

## Confusion matrix

A Confusion matrix is an N x N matrix used for model performance evaluation, where N is the number of entities or intents.
The matrix compares the expected labels with the ones predicted by the model.
This gives a holistic view of how well the model is performing and what kinds of errors it is making.

You can use the Confusion matrix to identify intents or entities that are too close to each other and often get mistaken (ambiguity). In this case consider merging these intents or entities together. If that isn't possible, consider adding more tagged examples of both intents or entities to help the model differentiate between them.

The highlighted diagonal in the image below is the correctly predicted entities, where the predicted tag is the same as the actual tag.

:::image type="content" source="../media/confusion-matrix-example.png" alt-text="A screenshot of an example confusion matrix" lightbox="../media/confusion-matrix-example.png":::

You can calculate the intent-level or entity-level and model-level evaluation metrics from the confusion matrix:

* The values in the diagonal are the *True Positive* values of each intent or entity.
* The sum of the values in the intent or entities rows (excluding the diagonal) is the *false positive* of the model.
* The sum of the values in the intent or entities columns (excluding the diagonal) is the *false Negative* of the model.

Similarly,

* The *true positive* of the model is the sum of *true Positives* for all intents or entities.
* The *false positive* of the model is the sum of *false positives* for all intents or entities.
* The *false Negative* of the model is the sum of *false negatives* for all intents or entities.


## Guidance

After you trained your model, you will see some guidance and recommendations on how to improve the model. It's recommended to have a model covering every point in the guidance section.

* Training set has enough data: When an intent or entity has fewer than 15 labeled instances in the training data, it can lead to lower accuracy due to the model not being adequately trained on that intent. In this case, consider adding more labeled data in the training set. You should only consider adding more labeled data to your entity if your entity has a learned component. If your entity is defined only by list, prebuilt, and regex components, then this recommendation is not applicable.

* All intents or entities are present in test set: When the testing data lacks labeled instances for an intent or entity, the model evaluation is less comprehensive due to untested scenarios. Consider having test data for every intent and entity in your model to ensure everything is being tested.

* Unclear distinction between intents or entities: When data is similar for different intents or entities, it can lead to lower accuracy because they may be frequently misclassified as each other. Review the following intents and entities and consider merging them if they’re similar. Otherwise, add more examples to better distinguish them from each other. You can check the *confusion matrix* tab for more guidance. If you are seeing two entities constantly being predicted for the same spans because they share the same list, prebuilt, or regex components, then make sure to add a **learned** component for each entity and make it **required**. Learn more about [entity components](./entity-components.md).

## Next steps

[Train a model in Language Studio](../how-to/train-model.md)
