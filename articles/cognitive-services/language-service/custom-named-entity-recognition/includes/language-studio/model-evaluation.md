---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/09/2022
ms.author: aahi
---

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. Select **Model performance** from the menu on the left side of the screen.
    
3. Select the model you want to view it's performance.

> [!NOTE]
> Entities that are neither labeled nor predicted in the test set will not be part of the displayed results.

### [Overview](#tab/overview)

* In this tab you can view the model's details such as: F1 score, Percesion, Recall, date and time for the training job, total training time and number of training and testing docuemnts included in this training job.  

    :::image type="content" source="../../media/confusion-matrix.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion-matrix.png":::

* You will also see [guidance](../../concepts/evaluation-metrics.md) on how to improve the model. When clicking on *view details* a side panel will open to give more guidance on how to improve the model. In this example, *BorrowerAddress* entity is confused with *$none* entity. By clicking on the confused entities, you will be taken to the [data labeling]() page to label more data with the correct entitiy.

    :::image type="content" source="../../media/confusion-matrix.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion-matrix.png":::
    
    Learn more about model guidance and confusion matrix in [model performance](../../concepts/evaluation-metrics.md) concepts.
---
### [Entity type performance](#tab/entity-performance)

* This is a snapshot of how your model performed during testing. The metrics here are static and tied to your model, so they won’t update until you train again.

* You can see for each entity, percision, recall, F1 score, training and testing labels.


    :::image type="content" source="../../media/confusion-matrix.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion-matrix.png":::
---
### [Test set details](#tab/test-set)

* Here you will see the documents included in the **test set** and the result entity type for each document. You can use the *Show mismatches only* toggle to show only documents with mismathces, or unselect the toggle to view all document in the test set.

* For each document, you can view: labeled text, its respective entity type and what was it predicted with. Also, you will see whether it is a [true positive](../../concepts/evaluation-metrics.md), [false positive](../../concepts/evaluation-metrics.md) or [false negative](../../concepts/evaluation-metrics.md). 

    :::image type="content" source="../../media/confusion-matrix.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion-matrix.png":::
    
---
### [Dataset distribution](#tab/dataset-distribution) 

This snapshot shows how entities are distributed across your training and testing sets. This data is static and tied to your model, so it won’t update until you train again.

* You can view the dataset distribution in *graph* or *table* view.

**Graph view**

* *Documents with at least one label*: This view will show for each entity, the number of occurances for this entitiy across the training and testing sets.

* *Total instances throughout documents*: 


**Table view**

For each *entity*, you can view: tags per entity in training set, tagged documents in training set, tags per entity in testing set, tagged documents in testing set, tags per entity total and tagged documents total.



---
### [Confusion matrix](#tab/confusion-matrix) 

A confusion matrix is an N x N matrix used for evaluating the performance of a classification model, where N is the number of target entities. The matrix compares the actual target values with those predicted by the machine learning model to show how well the extraction model is performing and what kinds of errors it is making.

You can view the confusion matrix in *normalized* or *raw count* view.


* All values: Will show the confusion matrix for all entities.

* Only errors: Will show the confusion matrix for entities with errors only.

* Only matches: Will show the confusion matrix for entities with correct predections only.

---

