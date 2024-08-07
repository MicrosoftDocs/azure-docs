---
title: Conversational language understanding evaluation metrics
titleSuffix: Azure AI services
description: Learn about evaluation metrics in conversational language understanding.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: jboback
ms.custom: language-service-clu
---

# Evaluation metrics for conversational language understanding models

Your [dataset is split](../how-to/train-model.md#data-splitting) into two parts: a set for training and a set for testing. The training set is used to train the model, while the testing set is used as a test for model after training to calculate the model performance and evaluation. The testing set isn't introduced to the model through the training process to make sure that the model is tested on new data.

Model evaluation is triggered automatically after training is completed successfully. The evaluation process starts by using the trained model to predict user-defined intents and entities for utterances in the test set. Then the process compares them with the provided tags to establish a baseline of truth. The results are returned so that you can review the model's performance. For evaluation, conversational language understanding uses the following metrics:

* **Precision**: Measures how precise or accurate your model is. It's the ratio between the correctly identified positives (true positives) and all identified positives. The precision metric reveals how many of the predicted classes are correctly labeled.

    `Precision = #True_Positive / (#True_Positive + #False_Positive)`

* **Recall**: Measures the model's ability to predict actual positive classes. It's the ratio between the predicted true positives and what was tagged. The recall metric reveals how many of the predicted classes are correct.

    `Recall = #True_Positive / (#True_Positive + #False_Negatives)`

* **F1 score**: The F1 score is a function of precision and recall. It's needed when you seek a balance between precision and recall.

    `F1 Score = 2 * Precision * Recall / (Precision + Recall)`

Precision, recall, and the F1 score are calculated for:

* Each entity separately (entity-level evaluation).
* Each intent separately (intent-level evaluation).
* For the model collectively (model-level evaluation).

The definitions of precision, recall, and evaluation are the same for entity-level, intent-level, and model-level evaluations. However, the counts for *true positives*, *false positives*, and *false negatives* can differ. For example, consider the following text.

### Example

* Make a response with "thank you very much."
* Reply with saying "yes."
* Check my email please.
* Email to Cynthia that dinner last week was splendid.
* Send an email to Mike.

The intents used are `Reply`, `sendEmail`, and `readEmail`. The entities are `contactName` and `message`.

The model could make the following predictions:

| Utterance | Predicted intent | Actual intent |Predicted entity| Actual entity|
|--|--|--|--|--|
|Make a response with "thank you very much"|Reply|Reply|`thank you very much` as `message` |`thank you very much` as `message` |
|Reply with saying "yes"| sendEmail|Reply|--|`yes` as `message`|
|Check my email please|readEmail|readEmail|--|--|
|Email to Cynthia that dinner last week was splendid|Reply|sendEmail|`dinner last week was splendid` as `message`| `cynthia` as `contactName`, `dinner last week was splendid` as `message`|
|Send an email to Mike|sendEmail|sendEmail|`mike` as `message`|`mike` as `contactName`|

### Intent-level evaluation for Reply intent

| Key | Count | Explanation |
|--|--|--|
| True positive | 1 | Utterance 1 was correctly predicted as `Reply`. |
| False positive | 1 |Utterance 4 was mistakenly predicted as `Reply`. |
| False negative | 1 | Utterance 2 was mistakenly predicted as `sendEmail`. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 1) = 0.5`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 1) = 0.5`

**F1 score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.5 * 0.5) / (0.5 + 0.5) = 0.5 `

### Intent-level evaluation for sendEmail intent

| Key | Count | Explanation |
|--|--|--|
| True positive | 1 | Utterance 5 was correctly predicted as `sendEmail`. |
| False positive | 1 |Utterance 2 was mistakenly predicted as `sendEmail`. |
| False negative | 1 | Utterance 4 was mistakenly predicted as `Reply`. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 1) = 0.5`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 1) = 0.5`

**F1 score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.5 * 0.5) / (0.5 + 0.5) = 0.5 `

### Intent-level evaluation for readEmail intent

| Key | Count | Explanation |
|--|--|--|
| True positive | 1 | Utterance 3 was correctly predicted as `readEmail`. |
| False positive | 0 |--|
| False negative | 0 |--|

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 0) = 1`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 0) = 1`

**F1 score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 1 * 1) / (1 + 1) = 1`

### Entity-level evaluation for contactName entity

| Key | Count | Explanation |
|--|--|--|
| True positive | 1 |  `cynthia` was correctly predicted as `contactName` in utterance 4.|
| False positive | 0 |--|
| False negative | 1 | `mike` was mistakenly predicted as `message` in utterance 5. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 1 / (1 + 0) = 1`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 1 / (1 + 1) = 0.5`

**F1 score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 1 * 0.5) / (1 + 0.5) = 0.67`

### Entity-level evaluation for message entity

| Key | Count | Explanation |
|--|--|--|
| True positive | 2 |`thank you very much` was correctly predicted as `message` in utterance 1 and `dinner last week was splendid` was correctly predicted as `message` in utterance 4. |
| False positive | 1 |`mike` was mistakenly predicted as `message` in utterance 5.  |
| False negative | 1 | ` yes` wasn't predicted as `message` in utterance 2. |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 2 / (2 + 1) = 0.67`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 2 / (2 + 1) = 0.67`

**F1 Score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.67 * 0.67) / (0.67 + 0.67) = 0.67`

### Model-level evaluation for the collective model

| Key | Count | Explanation |
|--|--|--|
| True positive | 6 | Sum of true positives for all intents and entities. |
| False positive | 3| Sum of false positives for all intents and entities.  |
| False negative | 4 | Sum of false negatives for all intents and entities.  |

**Precision** = `#True_Positive / (#True_Positive + #False_Positive) = 6 / (6 + 3) = 0.67`

**Recall** = `#True_Positive / (#True_Positive + #False_Negatives) = 6 / (6 + 4) = 0.60`

**F1 score** = `2 * Precision * Recall / (Precision + Recall) =  (2 * 0.67 * 0.60) / (0.67 + 0.60) = 0.63`

## Confusion matrix

A confusion matrix is an N x N matrix used for model performance evaluation, where N is the number of entities or intents. The matrix compares the expected labels with the ones predicted by the model. The matrix gives a holistic view of how well the model is performing and what kinds of errors it's making.

You can use the confusion matrix to identify intents or entities that are too close to each other and often get mistaken (ambiguity). In this case, consider merging these intents or entities together. If merging isn't possible, consider adding more tagged examples of both intents or entities to help the model differentiate between them.

The highlighted diagonal in the following image shows the correctly predicted entities, where the predicted tag is the same as the actual tag.

:::image type="content" source="../media/confusion-matrix-example.png" alt-text="Screenshot that shows an example Confusion matrix." lightbox="../media/confusion-matrix-example.png":::

You can calculate the intent-level or entity-level and model-level evaluation metrics from the confusion matrix:

* The values in the diagonal are the true positive values of each intent or entity.
* The sum of the values in the intent or entities rows (excluding the diagonal) is the false positive of the model.
* The sum of the values in the intent or entities columns (excluding the diagonal) is the false negative of the model.

Similarly:

* The true positive of the model is the sum of true positives for all intents or entities.
* The false positive of the model is the sum of false positives for all intents or entities.
* The false negative of the model is the sum of false negatives for all intents or entities.

## Guidance

After you train your model, you see some guidance and recommendations on how to improve the model. We recommend that you have a model covering every point in the guidance section.

* **Training set has enough data:** When an intent or entity has fewer than 15 labeled instances in the training data, it can lead to lower accuracy because the model isn't adequately trained on that intent. In this case, consider adding more labeled data in the training set. You should only consider adding more labeled data to your entity if your entity has a learned component. If your entity is defined only by list, prebuilt, and regex components, this recommendation doesn't apply.
* **All intents or entities are present in test set:** When the testing data lacks labeled instances for an intent or entity, the model evaluation is less comprehensive because of untested scenarios. Consider having test data for every intent and entity in your model to ensure that everything is being tested.
* **Unclear distinction between intents or entities:** When data is similar for different intents or entities, it can lead to lower accuracy because they might be frequently misclassified as each other. Review the following intents and entities and consider merging them if they're similar. Otherwise, add more examples to better distinguish them from each other. You can check the **Confusion matrix** tab for more guidance. If you're seeing two entities constantly being predicted for the same spans because they share the same list, prebuilt, or regex components, make sure to add a *learned* component for each entity and make it *required*. Learn more about [entity components](./entity-components.md).

## Related content

* [Train a model in Language Studio](../how-to/train-model.md)
