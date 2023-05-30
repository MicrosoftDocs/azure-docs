---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 08/08/2022
ms.author: aahi
---

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. Select **Model performance** from the menu on the left side of the screen.

3. In this page you can only view the successfully trained models, F1 score for each model and [model expiration date](../../../concepts/model-lifecycle.md). You can select on the model name for more details about its performance.

### [Overview](#tab/overview)

* In this tab you can view the model's details such as: F1 score, precision, recall, date and time for the training job, total training time and number of training and testing documents included in this training job.  

    <!--:::image type="content" source="../../media/overview.png" alt-text="A screenshot that shows the overview page for model evaluation." lightbox="../../media/overview.png":::-->

* You'll also see [guidance](../../custom/concepts/evaluation-metrics.md#guidance) on how to improve the model. When clicking on *view details* a side panel will open to give more guidance on how to improve the model. In this example, there are not enough data in training set for these sentiments. Also, there is unclear distinction between class types in training set, where two sentiments are confused with each other. Selecting the confused sentiments will open the [data labeling](../../custom/how-to/label-data.md) page to label more data with the correct sentiment.

    <!--:::image type="content" source="../../media/overview-guidance.png" alt-text="A screenshot that shows the guidance page for model evaluation." lightbox="../../media/overview-guidance.png":::-->
    
    Learn more about model guidance and confusion matrix in [model performance](../../custom/concepts/evaluation-metrics.md) concepts.

### [Test set details](#tab/test-set)

* In this tab you can view the documents included in the **test set** and the result for each document. You can use the *Show mismatches only* toggle to show only documents with mismatches, or unselect the toggle to view all document in the test set.

* For each document, you can view: labeled text, its respective labeled class and what class it was predicted with. You can also see whether it is a [true positive](../../custom/concepts/evaluation-metrics.md), false positive or false negative. 

    <!--:::image type="content" source="../../media/test-set.png" alt-text="A screenshot of test set details." lightbox="../../media/test-set.png":::-->
    
### [Dataset distribution](#tab/dataset-distribution) 

This snapshot shows how entities are distributed across your training and testing sets. This data is static and tied to your model, so it won’t update until you train again.

* You can view the dataset distribution in *graph* or *table* view.

**Graph view**

*Documents with at least one label*: This view will show the number of occurrences for this class across the training and testing sets for each sentiment.

  <!--:::image type="content" source="../../media/graph-view.png" alt-text="A screenshot showing distribution in graph view." lightbox="../../media/graph-view.png":::-->

**Table view**

For each *sentiment*, you can view: tagged documents in training set, tagged documents in testing set and total tagged documents.

  <!--:::image type="content" source="../../media/table-view.png" alt-text="A screenshot showing distribution in table view." lightbox="../../media/table-view.png":::-->

### [Confusion matrix](#tab/confusion-matrix) 

A [confusion matrix](../../custom/concepts/evaluation-metrics.md#confusion-matrix) is an N x N matrix used for evaluating the performance of a model, where N is the number of target sentiments. The matrix compares the actual target values with those predicted by the machine learning model to show how well the extraction model is performing and what kinds of errors it's making.

You can view the confusion matrix in *normalized* or *raw count* view.

  <!--:::image type="content" source="../../media/confusion.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion.png":::-->

* All values: Shows the confusion matrix for all sentiments.

* Only errors: Shows the confusion matrix for sentiments with errors only.

* Only matches: Shows the confusion matrix for sentiments with correct predictions only.

---
