---
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. Select **Model performance** from the menu on the left side of the screen.

3. In this page you can only view the successfully trained models, F1 score for each model and [model expiration date](../../../concepts/model-lifecycle.md). You can select the model name for more details about its performance.

> [!NOTE]
> Classes that are neither labeled nor predicted in the test set will not be part of the displayed results.

### [Overview](#tab/overview)

* In this tab you can view the model's details such as: F1 score, precision, recall, date and time for the training job, total training time and number of training and testing documents included in this training job.  

    :::image type="content" source="../../media/overview.png" alt-text="A that shows the overview page for model evaluation." lightbox="../../media/overview.png":::

* You will also see [guidance](../../concepts/evaluation-metrics.md#guidance) on how to improve the model. When clicking on *view details* a side panel will open to give more guidance on how to improve the model. In this example, there are not enough data in training set for these classes. Also, there is unclear distinction between class types in training set, where two classes are confused with each other. By clicking on the confused classes, you will be taken to the [data labeling](../../how-to/tag-data.md) page to label more data with the correct class.

    :::image type="content" source="../../media/overview-guidance.png" alt-text="A screenshot that shows the guidance page for model evaluation." lightbox="../../media/overview-guidance.png":::
    
    Learn more about model guidance and confusion matrix in [model performance](../../concepts/evaluation-metrics.md) concepts.

### [Class type performance](#tab/class-performance)

* This is a snapshot of how your model performed during testing. The metrics here are static and tied to your model, so they won’t update until you train again.

* You can see the precision, recall, F1 score, and number of training and testing labels for each class.

    :::image type="content" source="../../media/class-performance.png" alt-text="A screenshot of entity performance." lightbox="../../media/class-performance.png":::

### [Test set details](#tab/test-set)

* Here you will see the documents included in the **test set** and the result class for each document. You can use the *Show mismatches only* toggle to show only documents with mismatches, or unselect the toggle to view all document in the test set.

* For each document, you can view: labeled text, its respective labeled class and what class it was predicted with. Also, you will see whether it is a [true positive](../../concepts/evaluation-metrics.md), [false positive](../../concepts/evaluation-metrics.md) or [false negative](../../concepts/evaluation-metrics.md). 

    :::image type="content" source="../../media/test-set.png" alt-text="A screenshot of test set details." lightbox="../../media/test-set.png":::
    
### [Dataset distribution](#tab/dataset-distribution) 

This snapshot shows how entities are distributed across your training and testing sets. This data is static and tied to your model, so it won’t update until you train again.

* You can view the dataset distribution in *graph* or *table* view.

**Graph view**

*Documents with at least one label*: This view will show for each class, the number of occurrences for this class across the training and testing sets.

  :::image type="content" source="../../media/graph-view.png" alt-text="A screenshot showing distribution in graph view." lightbox="../../media/graph-view.png":::

**Table view**

For each *class*, you can view: tagged documents in training set, tagged documents in testing set and total tagged documents.

  :::image type="content" source="../../media/table-view.png" alt-text="A screenshot showing distribution in table view." lightbox="../../media/table-view.png":::

### [Confusion matrix](#tab/confusion-matrix) 

> [!NOTE]
> Confusion matrix is not available for multi classification projects.

A [confusion matrix](../../concepts/evaluation-metrics.md#confusion-matrix) is an N x N matrix used for evaluating the performance of a classification model, where N is the number of target classes. The matrix compares the actual target values with those predicted by the machine learning model to show how well the extraction model is performing and what kinds of errors it is making.

You can view the confusion matrix in *normalized* or *raw count* view.

  :::image type="content" source="../../media/confusion.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion.png":::

* All values: Will show the confusion matrix for all classes.

* Only errors: Will show the confusion matrix for classes with errors only.

* Only matches: Will show the confusion matrix for classes with correct predictions only.

---
