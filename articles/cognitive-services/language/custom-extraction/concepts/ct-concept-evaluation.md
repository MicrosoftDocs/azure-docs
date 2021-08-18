# Evaluation Metrics

For model evaluation in Custom entity extraction we use the following metrics

* **Precision** is the ratio of successful attempted recognitions to all attempts. It is calculated by the following equation <br> `Precision = #True_Positive / (#True_Positive + #False_Positive)`

* **Recall** is the ratio of successful attempted recognitions to the actual number of entities present (ground truth). It is calculated by the following equation <br> `Recall = #True_Positive / (#True_Positive + #False_Negatives)`

* **F1 score** is the combination of precision and recall. It is calculated by the following equation <br> `F1 Score = 2 * Precision * Recall / (Precision + Recall)`

>[!NOTE]
> Precision, recall and F1 score are calculated for each entity separately (**entity-level** evaluation) and for the model collectively (**model-level** evaluation).

## Model-level and Entity-level evaluation metrics

The definitions of precision, recall and evaluation stay the same for entity-level and model-level evaluations. However, the count of `True Positive`, `False Positive` and `False Negative` differ as shown in the following example.

Take this text for example

```` txt
The first party of this contract is John Smith resident of 8562 Fusce Rd. City of Frederick , State of Nebraska. And the second party is Forrest Ray resident of 191-103 Integer Rd, City of Corona , State of New Mexico. There is also Fannie Thomas resident of 4176  River Road, City of Colorado Springs, State of Colorado.
````

| Entity | Predicted as | Actual type (Ground truth) |
| -- | -- | -- |
| John Smith | Person | Person |
| Frederick | Person | City |
| Forrest | City | Person |
| Fannie Thomas | Person | Person |
| Colorado Springs | City | City |

### Entity-level evaluation for the entity `Person`

| Key | Count | Explanation |
| -- | -- | -- |
| True Positive | 2 | `John Smith` and `Fannie Thomas` were correctly predicted as `Person`. |
| False Positive | 1 | `Frederick` was incorrectly predicted as `Person` while it should have been `City`. |
| False Negative | 1 | `Forrest`was incorrectly predicted as `City` while it should have been `Person`. |

**Precision** = #True_Positive / (#True_Positive + #False_Positive) = 2 / (2 + 1) = 0.67

**Recall** = #True_Positive / (#True_Positive + #False_Negatives) = 2 / (2 + 1) = 0.67

**F1 Score** = 2 * Precision * Recall / (Precision + Recall) =  (2 * 0.67 * 0.67) / (0.67 + 0.67) = 0.67

### Entity-level evaluation for the entity `City`

| Key | Count | Explanation |
| -- | -- | -- |
| True Positive | 1 | `Colorado Springs` was correctly predicted as `City` |
| False Positive | 1 | `Forrest` was incorrectly predicted as `City` while it should have been `Person` |
| False Negative | 1 | `Frederick` was incorrectly predicted as `Person` while it should have been `City` |

**Precision** = #True_Positive / (#True_Positive + #False_Positive) = 2 / (2 + 1) = 0.67

**Recall** = #True_Positive / (#True_Positive + #False_Negatives) = 2 / (2 + 1) = 0.67

**F1 Score** = 2 * Precision * Recall / (Precision + Recall) =  (2 * 0.67 * 0.67) / (0.67 + 0.67) = 0.67

### Model-level evaluation for the collective model

| Key | Count | Explanation |
| -- | -- | -- |
| True Positive | 3 | `John Smith` and `Fannie Thomas` were correctly predicted as `Person`.`Colorado Springs` was correctly predicted as `City`. This the sum of true positives for all entities. |
| False Positive | 2 | `Forrest` was incorrectly predicted as `City` while it should have been `Person`. Frederick` was incorrectly predicted as `Person` while it should have been `City`. This the sum of false positives for all entities. |
| False Negative | 2 | Forrest` was incorrectly predicted as `City` while it should have been `Person`. Frederick` was incorrectly predicted as `Person` while it should have been `City`. This the sum of false negatives for all entities. |

**Precision** = #True_Positive / (#True_Positive + #False_Positive) = 3 / (3 + 2) = 0.6

**Recall** = #True_Positive / (#True_Positive + #False_Negatives) = 3 / (3 + 2) = 0.6

**F1 Score** = 2 * Precision * Recall / (Precision + Recall) =  (2 * 0.6 * 0.6) / (0.6 + 0.6) = 0.6

## Interpreting entity-level evaluation metrics

So what does it actually mean to have a high precision or a high recall for a certain entity?

| Recall | Precision | Interpretation |
| -- | -- | -- |
| High | High | this means that this entity is perfectly handled by the model. |
| Low | High | this means the model cannot always extract this entity but when it does it is with high confidence. |
| High | Low | this means that the model extracts this entity well however it is with low confidence as it is sometimes extracted as another type. |
| Low | Low | this means that this entity type is poorly handled by the model where it is not usually extracted and when it is, it is not with high confidence. |

## Confusion matrix

A Confusion matrix is an N x N matrix used for model performance evaluation, where N is the number of entities.
The matrix compares the actual tags (ground truth) with those predicted tags by the model.
This gives a holistic view of how well the model is performing and what kinds of errors it is making.
The highlighted diagonal is the correctly predicted entities where the predicted tag is the same as the actual tag (ground truth).

![model-details-confusion-matrix-example](../../media/extraction/ct-model-details-confusion-matrix-example.png)

You can calculate the **entity-level** and **model-level** evaluation metrics from the confusion matrix:

* The values in the diagonal are the **True Positive** values of each entity.

* The sum of the values of `Entity 2` row excluding the diagonal is the **False Positive**.

* The sum of the values of `Entity 2` column excluding the diagonal is the **False Negative**.

* The **True Positive** of the model is the sum of **True Positive** for all entities.

* The **False Positive** of the model is the sum of **False Positive** for all entities.

* The **False Negative** of the model is the sum of **False Negative** for all entities.
