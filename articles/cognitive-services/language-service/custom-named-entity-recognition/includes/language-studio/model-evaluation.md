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

### [Overview](#tab/overview)

* In this tab you can view the model's details such as: F1 score, Percesion, Recall, date and time for the training job, total training time and number of training and testing docuemnts included in this training job.  

    :::image type="content" source="../../media/confusion-matrix.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion-matrix.png":::

* You will also see guidance on how to improve the model. When clicking on *view details* a side panel will open to give more guidance on how to improve the model. In this example, *BorrowerAddress* entity is confused with *$none* entity. By clicking on the confused entities, you will be taken to the [data labeling]() page to label more data with the correct entitiy.

    :::image type="content" source="../../media/confusion-matrix.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion-matrix.png":::
    
    Learn more about model guidance in [evaluation metrics] concepts.
---
### [Entity type performance](#tab/entity-performance)
*Entity type performace*

* This is a snapshot of how your model performed during testing. The metrics here are static and tied to your model, so they won’t update until you train again.

* You can see for each entity, percision, recall, F1 score, training and testing labels.


    :::image type="content" source="../../media/confusion-matrix.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion-matrix.png":::
---
### [Test set details](#tab/test-set)

*Test set details*

* Here you will see the documents included in the test set and the result type for each document. You can use the *Show mismatches only* toggle to show only documents with mismathces, or unselect the toggle to view all document in the test set.

* You can view for each document: labeled text, its respective entity type and what was it predicted with. Also, you will see whether it is a [true positive](), [false positive]() or [false negative](). 

    :::image type="content" source="../../media/confusion-matrix.png" alt-text="A screenshot of a confusion matrix in Language Studio." lightbox="../../media/confusion-matrix.png":::
    
---
    
    

> [!NOTE]
> Entities that are neither labeled nor predicted in the test set will not be part of the displayed results.
