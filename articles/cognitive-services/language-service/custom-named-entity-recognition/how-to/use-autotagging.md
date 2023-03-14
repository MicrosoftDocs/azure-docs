---
title: How to use autotagging in custom named entity recognition
titleSuffix: Azure Cognitive Services
description: Learn how to use autotagging in custom named entity recognition.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 05/09/2022
ms.author: aahi
---

# How to use auto-labeling

[Labeling process](tag-data.md) is an important part of preparing your dataset. Since this process requires a lot of time and effort, you can use the auto-labeling feature to automatically label your entities. You can start auto-labeling jobs based on a model you've previously trained in the Language Studio or using GPT models. With auto-labeling based on a model you've previously trained, you would start labeling a few of your documents, train a model, then create an auto-labeling job to produce labeling entities on your behalf based on that model. With auto-labeling with GPT, you may immediately trigger an auto-labeling job without any prior model training. This feature can save you the time and effort of manually labeling your entities. 

## Prerequisites

### [Auto-label based on a model you've trained](#tab/auto-label-model)

Before you can use auto-labeling based on a model you've trained, you need:
* A successfully [created project](create-project.md) with a configured Azure blob storage account.
* Text data that [has been uploaded](design-schema.md#data-preparation) to your storage account.
* [Labeled data](tag-data.md)
* A [successfully trained model](train-model.md)


### [Auto-label with GPT](#tab/auto-label-gpt)
Before you can use auto-labeling with GPT, you need:
* A successfully [created project](create-project.md) with a configured Azure blob storage account.
* Text data that [has been uploaded](design-schema.md#data-preparation) to your storage account.
* [Labeled data](tag-data.md) is not required but if you've labeled some documents, those labels will be used to more accurately suggest labels.
* An Azure OpenAI [resource and deployment](../../../openai/how-to/create-resource.md). 

---

## Trigger an auto-labeling job

### [Auto-label based on a model you've trained](#tab/auto-label-model)

When you trigger an auto-labeling job based on a model you've trained, there's a monthly limit of 5,000 text records per month, per resource. This means the same limit will apply on all projects within the same resource.

> [!TIP]
> A text record is calculated as the ceiling of (Number of characters in a document / 1,000). For example, if a document has 8921 characters, the number of text records is: 
>
> `ceil(8921/1000) = ceil(8.921)`, which is 9 text records.

1. From the left navigation menu, select **Data auto-labeling**.
2. Select **Trigger Auto-label** to start an auto-labeling job


    :::image type="content" source="../media/trigger-autotag.png" alt-text="A screenshot showing how to trigger an autotag job." lightbox="../media/trigger-autotag.png":::

3.	Choose a trained model. It's recommended to check the model performance before using it for auto-labeling.

    :::image type="content" source="../media/choose-model.png" alt-text="A screenshot showing how to choose trained model for autotagging." lightbox="../media/choose-model.png":::


4.	Choose the entities you want to be included in the auto-labeling job. By default, all entities are selected. You can see the total labels, precision and recall of each entity. It's recommended to include entities that perform well to ensure the quality of the automatically labeled entities. 

    :::image type="content" source="../media/choose-entities.png" alt-text="A screenshot showing which entities to be included in autotag job." lightbox="../media/choose-entities.png":::

5.	Choose the documents you want to be automatically labeled. You'll see the number of text records of each document. When you select one or more documents, you should see the number of texts records selected. It's recommended to choose the unlabeled documents from the filter. 

    > [!NOTE]
    > * If an entity was automatically labeled, but has a user defined label, only the user defined label will be used and be visible.  
    > * You can view the documents by clicking on the document name.
    
    :::image type="content" source="../media/choose-files.png" alt-text="A screenshot showing which documents to be included in the autotag job." lightbox="../media/choose-files.png":::

6.	Select **Autolabel** to trigger the auto-labeling job. 
You should see the model used, number of documents included in the auto-labeling job, number of text records and entities to be automatically labeled. Auto-labeling jobs can take anywhere from a few seconds to a few minutes, depending on the number of documents you included. 


    :::image type="content" source="../media/review-autotag.png" alt-text="A screenshot showing the review screen for an autotag job." lightbox="../media/review-autotag.png":::

### [Auto-label with GPT](#tab/auto-label-gpt)

When you trigger an auto-labeling job with GPT, you will be billed through the Azure OpenAI resource as per your consumption. You will be charged an estimate of the number of tokens in your document. Refer to the [Azure OpenAI pricing page](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/) for a detailed overview on how you will be billed.

1.  From the left navigation menu, select **Data labeling**.
2.  Select the **Auto-label** button under the Activity pane to the right of the page.

    :::image type="content" source="../media/trigger-autotag.png" alt-text="A screenshot showing how to trigger an autotag job." lightbox="../media/trigger-autotag.png":::

4. Choose Auto-label with GPT and click on Next.

    :::image type="content" source="../media/trigger-autotag.png" alt-text="A screenshot showing how to trigger an autotag job." lightbox="../media/trigger-autotag.png":::

5. Choose your Azure OpenAI resource and deployment. You must [create an Azure OpenAI resource and deploy a model](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal) in order to proceed.

    :::image type="content" source="../media/trigger-autotag.png" alt-text="A screenshot showing how to trigger an autotag job." lightbox="../media/trigger-autotag.png":::
    
6. Choose the entities you want to be included in the auto-labeling job. By default, all entities are selected. Having descriptive names for labels, as well as including examples for each label is recommended to achieve good quality labeling with GPT.

    :::image type="content" source="../media/trigger-autotag.png" alt-text="A screenshot showing how to trigger an autotag job." lightbox="../media/trigger-autotag.png":::
    
7. Choose the documents you want to be automatically labeled. It's recommended to choose the unlabeled documents from the filter. 

    > [!NOTE]
    > * If an entity was automatically labeled, but has a user defined label, only the user defined label will be used and be visible.  
    > * You can view the documents by clicking on the document name.
    
    :::image type="content" source="../media/choose-files.png" alt-text="A screenshot showing which documents to be included in the autotag job." lightbox="../media/choose-files.png":::

8.	Select **Start job** to trigger the auto-labeling job. 
You should be directed to the auto-labeling page displaying the auto-labeling jobs initiated. Auto-labeling jobs can take anywhere from a few seconds to a few minutes, depending on the number of documents you included. 

    :::image type="content" source="../media/review-autotag.png" alt-text="A screenshot showing the review screen for an autotag job." lightbox="../media/review-autotag.png":::


---

## Review the auto labeled documents

When the auto-labeling job is complete, you can see the output documents in the **Data labeling** page of Language Studio. Select **Review documents with autolabels** to view the documents with the **Auto labeled** filter applied.

:::image type="content" source="../media/open-autotag-files.png" alt-text="A screenshot showing the auto-labeled documents" lightbox="../media/open-autotag-files.png":::

Entities that have been automatically labeled will appear with a dotted line. These entities will have two selectors (a checkmark and an "X") that will let you accept or reject the automatic label.

Once an entity is accepted, the dotted line will change to solid line, and this label will be included in any further model training and be a user defined label.

Alternatively, you can accept or reject all automatically labeled entities within the document, using **Accept all** or **Reject all** in the top right corner of the screen. 

After you accept or reject the labeled entities, select **Save labels** to apply the changes.

> [!NOTE]
> * We recommend validating automatically labeled entities before accepting them. 
> * All labels that were not accepted will be deleted when you train your model.

:::image type="content" source="../media/accept-reject-entities.png" alt-text="A screenshot showing how to accept and reject auto-labeled entities." lightbox="../media/accept-reject-entities.png":::

## Next steps

* Learn more about [labeling your data](tag-data.md).
