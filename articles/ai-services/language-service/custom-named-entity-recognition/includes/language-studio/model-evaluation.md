---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 08/08/2022
ms.author: aahi
---

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. Select **Model performance** from the menu on the left side of the screen.

3. In this page you can only view the successfully trained models, F1 score for each model and [model expiration date](../../../concepts/model-lifecycle.md). You can select the model name for more details about its performance.

> [!NOTE]
> Entities that are neither labeled nor predicted in the test set will not be part of the displayed results.

### [Overview](#tab/overview)

* In this tab you can view the model's details such as: F1 score, precision, recall, date and time for the training job, total training time and number of training and testing documents included in this training job.  

    :::image type="content" source="../../media/overview.png" alt-text="A screenshot that shows the overview page for model evaluation." lightbox="../../media/overview.png":::

* You will also see [guidance](../../concepts/evaluation-metrics.md#guidance) on how to improve the model. When clicking on *view details* a side panel will open to give more guidance on how to improve the model. In this example, *BorrowerAddress* and *BorrowerName* entities are confused with *$none* entity. By clicking on the confused entities, you will be taken to the [data labeling](../../how-to/tag-data.md) page to label more data with the correct entity.

    :::image type="content" source="../../media/overview-guidance.png" alt-text="A screenshot that shows the guidance page for model evaluation." lightbox="../../media/overview-guidance.png":::
    
    Learn more about model guidance and confusion matrix in [model performance](../../concepts/evaluation-metrics.md) concepts.

### [Entity type performance](#tab/entity-performance)

* This is a snapshot of how your model performed during testing. The metrics here are static and tied to your model, so they won’t update until you train again.

* You can see for each entity, precision, recall, F1 score, number of training and testing labels.


    :::image type="content" source="../../media/entity-type-performace.png" alt-text="A screenshot of entity performance." lightbox="../../media/entity-type-performace.png":::

### [Test set details](#tab/test-set)

* Here you will see the documents included in the **test set** and the result entity type for each document. You can use the *Show mismatches only* toggle to show only documents with mismatches, or unselect the toggle to view all document in the test set.

* For each document, you can view: labeled text, its respective labeled entity type and what entity it was predicted with. Also, you will see whether it is a [true positive](../../concepts/evaluation-metrics.md), [false positive](../../concepts/evaluation-metrics.md) or [false negative](../../concepts/evaluation-metrics.md). 

    :::image type="content" source="../../media/test-set.png" alt-text="A screenshot of test set details." lightbox="../../media/test-set.png":::
    

### [Dataset distribution](#tab/dataset-distribution) 

This snapshot shows how entities are distributed across your training and testing sets. This data is static and tied to your model, so it won’t update until you train again.

* You can view the dataset distribution in *graph* or *table* view.

**Graph view**

* *Documents with at least one label*: This view will show for each entity, the number of occurrences for this entity across the training and testing sets.

* *Total instances throughout documents*: This view will show for each entity, the labeled occurrences across training and testing sets.

  :::image type="content" source="../../media/dataset-graph.png" alt-text="A screenshot showing distribution in graph view." lightbox="../../media/dataset-graph.png":::

**Table view**

For each *entity*, you can view: tags per entity in training set, tagged documents in training set, tags per entity in testing set, tagged documents in testing set, tags per entity total and tagged documents total.

  :::image type="content" source="../../media/dataset-table.png" alt-text="A screenshot showing distribution in table view." lightbox="../../media/dataset-table.png":::

### [Confusion matrix](#tab/confusion-matrix) 

A [confusion matrix](../../concepts/evaluation-metrics.md#confusion-matrix) is an N x N matrix used for evaluating the performance of a classification model, where N is the number of target entities. The matrix compares the actual target values with those predicted by the machine learning model to show how well the extraction model is performing and what kinds of errors it is making.

You can view the confusion matrix in *normalized* or *raw count* view.

  :::image type="content" source="../../media/confusion.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion.png":::

* All values: Will show the confusion matrix for all entities.

* Only errors: Will show the confusion matrix for entities with errors only.

* Only matches: Will show the confusion matrix for entities with correct predictions only.

---

