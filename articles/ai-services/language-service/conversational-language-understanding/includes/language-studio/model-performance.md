---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 05/16/2022
ms.author: aahi
---

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. Select **Model performance** from the menu on the left side of the screen.

3. In this page you can only view the successfully trained models, F1 score of each model and [model expiration date](../../../concepts/model-lifecycle.md#expiration-timeline). You can select the model name for more details about its performance. Models only include evaluation details if there was test data selected while training the model.

### [Overview](#tab/overview)

* In this tab you can view the model's details such as: F1 score, precision, recall, date and time for the training job, total training time and number of training and testing utterances included in this training job.  You can view details between intents or entities by selecting Model Type at the top.

    :::image type="content" source="../../media/overview.png" alt-text="A screenshot that shows the overview page for model evaluation." lightbox="../../media/overview.png":::

* You will also see [guidance](../../concepts/evaluation-metrics.md#guidance) on how to improve the model. When clicking on *view details* a side panel will open to give more guidance on how to improve the model.

    :::image type="content" source="../../media/overview-guidance.png" alt-text="A screenshot that shows the guidance page for model evaluation." lightbox="../../media/overview-guidance.png":::

### [Model type performance](#tab/model-performance)

* This is a snapshot of how your model performed during testing. The metrics here are static and tied to your model, so they won’t update until you train again.

* You can see for each intent or entity the precision, recall, F1 score, number of training and testing labels. Entities that do not include a learned component will show no training labels. A learned component is added only by adding labels in your training set.


    :::image type="content" source="../../media/model-type-performance.png" alt-text="A screenshot of model performance." lightbox="../../media/model-type-performance.png":::

### [Test set details](#tab/test-set)

* Here you will see the utterances included in the **test set** and their intent or entity predictions. You can use the *Show errors only* toggle to show only the utterances where there are different predictions from their labels, or unselect the toggle to view all utterances in the test set. You can also toggle the view between **Showing entity labels** as the view for each utterance, or **Showing entity predictions**. Entity predictions show as dotted lines and labels show as solid lines.

* You can expand each row to view its intent or entity predictions, specified by the **Model Type** column. The **Text** column shows the text of the entity that was predicted or labeled. Each row has a **Labeled as** column to indicate the label in the test set, and **Predicted as** column to indicate the actual prediction. Also, you will see whether it is a [true positive](../../concepts/evaluation-metrics.md), [false positive](../../concepts/evaluation-metrics.md) or [false negative](../../concepts/evaluation-metrics.md) in the **Result Type** column. 

    :::image type="content" source="../../media/test-set.png" alt-text="A screenshot of test set details." lightbox="../../media/test-set.png":::    

### [Dataset distribution](#tab/dataset-distribution) 

This snapshot shows how intents or entities are distributed across your training and testing sets. This data is static and tied to your model, so it won’t update until you train again. Entities that do not include a learned component will show no training labels. A learned component is added only by adding labels in your training set.

  :::image type="content" source="../../media/dataset-table.png" alt-text="A screenshot showing distribution in table view." lightbox="../../media/dataset-table.png":::

### [Confusion matrix](#tab/confusion-matrix) 

A [confusion matrix](../../concepts/evaluation-metrics.md#confusion-matrix) is an N x N matrix used for evaluating the performance of your model, where N is the number of target intents or entities. The matrix compares the expected labels with those predicted by the model to identify which intents or entities are being misclassified as other intents and entities. You can click into any cell of the confusion matrix to identify exactly which utterances contributed to the values in that cell.

You can view the intent confusion matrix in *raw count* or *normalized* view. Raw count is the actual number of utterances that have been predicted and labeled for a set of intents. Normalized value is the ratio, between 0 and 1, of the predicted and labeled utterances for a set of intents.

You can view the entity confusion matrix in *character overlap count* or *normalized character overlap* view. Character overlap count is the actual number of spans that have been predicted and labeled for a set of entities. Normalized character overlap is the ratio, between 0 and 1, of the predicted and labeled spans for a set of entities. Sometimes entities can be predicted or labeled partially, leading to decimal values in the confusion matrix.

  :::image type="content" source="../../media/confusion.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion.png":::

* All values: Will show the confusion matrix for all intents or entities.

* Only errors: Will show the confusion matrix for intents or entities with errors only.

* Only matches: Will show the confusion matrix for intents or entities with correct predictions only.

---
