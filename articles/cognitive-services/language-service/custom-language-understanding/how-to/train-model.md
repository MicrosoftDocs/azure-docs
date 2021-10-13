# Train and evaluate models
After you have completed [tagging your utterances](./tag-utterances.md), you can proceed to training. Training is the act of converting the current state of your project's training data that you've created to build a model that can be used for predictions. Every time you train, you have to name your training instance. 

You can create and train multiple models within the same project. However, if you re-train a specific model it overwrites the last state.

The training times can be anywhere from a few seconds when dealing with orchestration workflow projects, up to 1.5 hours when you reach the maximum utterances limits. Learn more about the service limits [here](./service-limits.md).

Before training, you have an option to enable evaluation. If enabled, your tagged utterances will be spilt into 3 parts; 80% for training, 10% for validation and 10% for testing. This will provide evaluation results in the following stages.

## Train Model

Enter a new model name or select an existing model from the **Model Name** dropdown. Press **Enter** after you add a model name. Select whether or not you want to evaluate your model by changing the "Enable/Disable Evaluation" toggle.

:::image type="content" source="../media/train-model.png" alt-text="A screenshot showing the Train model page for Conversational Language Understanding projects." lightbox="../media/train-model.png":::

Click the **Train** button and wait for training to complete. You will see the training status of your model in the view model details page.

## Evaluate Model

After model training is completed, you can view your model details and see how well it performs against the test set if you enabled evaluation in the training step. Observing how well your model performed is called **evaluation**. The test set is composed of 20% of your utterances, and this split is done at random before training. The test set is a blind set that was not introduced to the model during the training process. For the evaluation process to complete there must be at least 10 utterances in your training set.

In the view model details page, you'll be able to see all your models, with their current training status, date they were last trained.

:::image type="content" source="../media/model-page-1.png" alt-text="A screenshot showing the View model details page for Conversational Language Understanding projects." lightbox="../media/model-page-1.png":::

* Click on the model name for more details. A model name is only clickable if you've enabled evaluation before hand. 
* In the **Overview** section you can find the macro precision, recall and F1 score for the collective intents or entities, based on which option you select. 
* Under the **Intents** and **Entities** tabs you can find the micro precision, recall and F1 score for each intent or entity separately.

:::image type="content" source="../media/model-page-2.png" alt-text="A screenshot showing the Overview metrics for a model." lightbox="../media/model-page-2.png":::

> [!NOTE]
> If you don't see any of the intents or entities you have in your model displayed here, it is because they were not there in any of the utterances that were used for the test set.

* Click on the **Test set confusion matrix** tab at the top.
* Click on the **Intents** or **Entities** tab to observe the confusion matrix for each of them.

A Confusion matrix is an N x N matrix used for model performance evaluation, where N is the number of intents or entities.
The matrix compares the actual tags with the predicted tags by the model.
This gives a holistic view of how well the model is performing and what kinds of errors it is making.
The highlighted diagonal is the correctly predicted intents or entities where the predicted tag is the same as the actual tag (ground truth).

:::image type="content" source="../media/model-page-3.png" alt-text="A screenshot showing the Test set confusion matrix for a model." lightbox="../media/model-page-3.png":::

## Evaluation metrics explained

* **Precision** is the ratio of successful attempted recognitions to all attempts. It is calculated by the following equation <br> `Precision = #True_Positive / (#True_Positive + #False_Positive)`

* **Recall** is the ratio of successful attempted recognitions to the actual number of entities present (ground truth). It is calculated by the following equation <br> `Recall = #True_Positive / (#True_Positive + #False_Negatives)`

* **F1 score** is the combination of precision and recall. It is calculated by the following equation <br> `F1 Score = 2 * Precision * Recall / (Precision + Recall)`

>[!NOTE]
> Precision, recall and F1 score are calculated for each intent and entity separately (**micro** evaluation) and for the model collectively (**macro** evaluation).

#### Micro and macro evaluation

CLU provides evaluation both at the intent and entity level (**micro** evaluation) and on the collective model (all intents or all entities) level (**macro** evaluation).

The definitions of precision, recall and evaluation stay the same for micro and macro evaluations. However, the count of `True Positive`, `False Positive` and `False Negative` differ as shown in the following example.

Take this text for example:

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

##### **Micro** evaluation for the entity `Person`

| Key | Count | Explanation |
| -- | -- | -- |
| True Positive | 2 | `John Smith` and `Fannie Thomas` were correctly predicted as `Person`.
| False Positive | 1 | `Frederick` was incorrectly predicted as `Person` while it should have been `City`. |
| False Negative | 1 | `Forrest`was incorrectly predicted as `City` while it should have been `Person`. |

**Precision** = #True_Positive / (#True_Positive + #False_Positive) = 2 / (2 + 1) = 0.67

**Recall** = #True_Positive / (#True_Positive + #False_Negatives) = 2 / (2 + 1) = 0.67

**F1 Score** = 2 * Precision * Recall / (Precision + Recall) =  (2 * 0.67 * 0.67) / (0.67 + 0.67) = 0.67

##### **Micro** evaluation for the entity `City`

| Key | Count | Explanation |
| -- | -- | -- |
| True Positive | 1 | `Colorado Springs` was correctly predicted as `City` |
| False Positive | 1 | `Forrest`was incorrectly predicted as `City` while it should have been `Person` |
| False Negative | 1 | `Frederick` was incorrectly predicted as `Person` while it should have been `City` |

**Precision** = #True_Positive / (#True_Positive + #False_Positive) = 2 / (2 + 1) = 0.67

**Recall** = #True_Positive / (#True_Positive + #False_Negatives) = 2 / (2 + 1) = 0.67

**F1 Score** = 2 * Precision * Recall / (Precision + Recall) =  (2 * 0.67 * 0.67) / (0.67 + 0.67) = 0.67

##### **Macro** evaluation for the collective model

| Key | Count | Explanation |
| -- | -- | -- |
| True Positive | 3 | `John Smith` and `Fannie Thomas` were correctly predicted as `Person`.`Colorado Springs` was correctly predicted as `City`. This is the sum of true positives for all entities. |
| False Positive | 2 | `Forrest` was incorrectly predicted as `City` while it should have been `Person`. Frederick` was incorrectly predicted as `Person` while it should have been `City`. This is the sum of false positives for all entities. |
| False Negative | 2 | Forrest` was incorrectly predicted as `City` while it should have been `Person`. Frederick` was incorrectly predicted as `Person` while it should have been `City`. This is the sum of false negatives for all entities. |

**Precision** = #True_Positive / (#True_Positive + #False_Positive) = 3 / (3 + 2) = 0.6

**Recall** = #True_Positive / (#True_Positive + #False_Negatives) = 3 / (3 + 2) = 0.6

**F1 Score** = 2 * Precision * Recall / (Precision + Recall) =  (2 * 0.6 * 0.6) / (0.6 + 0.6) = 0.6

### Interpreting micro evaluation metrics

So what does it actually mean to have a high precision or a high recall for a certain entity?

| Recall | Precision | Interpretation |
| -- | -- | -- |
| High | High | this means that this intent or entity is perfectly handled by the model. |
| Low | High | this means the model cannot always predict this intent or entity but when it does it is with high confidence. |
| High | Low |  this means that the model predicts this intent or entity well however it is with low confidence as it is sometimes predicted as another type. |
| Low | Low | this means that this intent or entity is poorly handled by the model. |

## Next Steps
* [Deploy and query model](./deploy-query-model.md)
