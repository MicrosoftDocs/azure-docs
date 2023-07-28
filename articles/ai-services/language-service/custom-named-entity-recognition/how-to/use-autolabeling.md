---
title: How to use autolabeling in custom named entity recognition
titleSuffix: Azure AI services
description: Learn how to use autolabeling in custom named entity recognition.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 03/20/2023
ms.author: aahi
---

# How to use autolabeling for Custom Named Entity Recognition

[Labeling process](tag-data.md) is an important part of preparing your dataset. Since this process requires both time and effort, you can use the autolabeling feature to automatically label your entities. You can start autolabeling jobs based on a model you've previously trained or using GPT models. With autolabeling based on a model you've previously trained, you can start labeling a few of your documents, train a model, then create an autolabeling job to produce entity labels for other documents based on that model. With autolabeling with GPT, you may immediately trigger an autolabeling job without any prior model training. This feature can save you the time and effort of manually labeling your entities. 

## Prerequisites

### [Autolabel based on a model you've trained](#tab/autolabel-model)

Before you can use autolabeling based on a model you've trained, you need:
* A successfully [created project](create-project.md) with a configured Azure blob storage account.
* Text data that [has been uploaded](design-schema.md#data-preparation) to your storage account.
* [Labeled data](tag-data.md)
* A [successfully trained model](train-model.md)


### [Autolabel with GPT](#tab/autolabel-gpt)
Before you can use autolabeling with GPT, you need:
* A successfully [created project](create-project.md) with a configured Azure blob storage account.
* Text data that [has been uploaded](design-schema.md#data-preparation) to your storage account.
* Entity names that are meaningful. The GPT models label entities in your documents based on the name of the entity you've provided.
* [Labeled data](tag-data.md) isn't required.
* An Azure OpenAI [resource and deployment](../../../openai/how-to/create-resource.md). 

---

## Trigger an autolabeling job

### [Autolabel based on a model you've trained](#tab/autolabel-model)

When you trigger an autolabeling job based on a model you've trained, there's a monthly limit of 5,000 text records per month, per resource. This means the same limit applies on all projects within the same resource.

> [!TIP]
> A text record is calculated as the ceiling of (Number of characters in a document / 1,000). For example, if a document has 8921 characters, the number of text records is: 
>
> `ceil(8921/1000) = ceil(8.921)`, which is 9 text records.

1.  From the left navigation menu, select **Data labeling**.
2.  Select the **Autolabel** button under the Activity pane to the right of the page.


    :::image type="content" source="../media/trigger-autotag.png" alt-text="A screenshot showing how to trigger an autotag job." lightbox="../media/trigger-autotag.png":::
    
3. Choose Autolabel based on a model you've trained and select Next.

    :::image type="content" source="../media/choose-models.png" alt-text="A screenshot showing model choice for auto labeling." lightbox="../media/choose-models.png":::
    
4.	Choose a trained model. It's recommended to check the model performance before using it for autolabeling.

    :::image type="content" source="../media/choose-model-trained.png" alt-text="A screenshot showing how to choose trained model for autotagging." lightbox="../media/choose-model-trained.png":::

5.	Choose the entities you want to be included in the autolabeling job. By default, all entities are selected. You can see the total labels, precision and recall of each entity. It's recommended to include entities that perform well to ensure the quality of the automatically labeled entities. 

    :::image type="content" source="../media/choose-entities.png" alt-text="A screenshot showing which entities to be included in autotag job." lightbox="../media/choose-entities.png":::

6.	Choose the documents you want to be automatically labeled. The number of text records of each document is displayed. When you select one or more documents, you should see the number of texts records selected. It's recommended to choose the unlabeled documents from the filter. 

    > [!NOTE]
    > * If an entity was automatically labeled, but has a user defined label, only the user defined label is used and visible.  
    > * You can view the documents by clicking on the document name.
    
    :::image type="content" source="../media/choose-files.png" alt-text="A screenshot showing which documents to be included in the autotag job." lightbox="../media/choose-files.png":::

7.	Select **Autolabel** to trigger the autolabeling job. 
You should see the model used, number of documents included in the autolabeling job, number of text records and entities to be automatically labeled. Autolabeling jobs can take anywhere from a few seconds to a few minutes, depending on the number of documents you included. 

    :::image type="content" source="../media/review-autotag.png" alt-text="A screenshot showing the review screen for an autotag job." lightbox="../media/review-autotag.png":::

### [Autolabel with GPT](#tab/autolabel-gpt)

When you trigger an autolabeling job with GPT, you're charged to your Azure OpenAI resource as per your consumption. You're charged an estimate of the number of tokens in each document being autolabeled. Refer to the [Azure OpenAI pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) for a detailed breakdown of pricing per token of different models.

1.  From the left navigation menu, select **Data labeling**.
2.  Select the **Autolabel** button under the Activity pane to the right of the page.

    :::image type="content" source="../media/trigger-autotag.png" alt-text="A screenshot showing how to trigger an autotag job from the activity pane." lightbox="../media/trigger-autotag.png":::

4. Choose Autolabel with GPT and select Next.

    :::image type="content" source="../media/choose-models.png" alt-text="A screenshot showing model choice for auto labeling." lightbox="../media/choose-models.png":::

5. Choose your Azure OpenAI resource and deployment. You must [create an Azure OpenAI resource and deploy a model](../../../openai/how-to/create-resource.md) in order to proceed.

    :::image type="content" source="../media/autotag-choose-open-ai.png" alt-text="A screenshot showing how to choose OpenAI resource and deployments" lightbox="../media/autotag-choose-open-ai.png":::
    
6. Choose the entities you want to be included in the autolabeling job. By default, all entities are selected. Having descriptive names for labels, and including examples for each label is recommended to achieve good quality labeling with GPT.

    :::image type="content" source="../media/choose-entities.png" alt-text="A screenshot showing which entities to be included in autotag job." lightbox="../media/choose-entities.png":::
    
7. Choose the documents you want to be automatically labeled. It's recommended to choose the unlabeled documents from the filter. 

    > [!NOTE]
    > * If an entity was automatically labeled, but has a user defined label, only the user defined label is used and visible.  
    > * You can view the documents by clicking on the document name.
    
    :::image type="content" source="../media/choose-files.png" alt-text="A screenshot showing which documents to be included in the autotag job." lightbox="../media/choose-files.png":::

8.	Select **Start job** to trigger the autolabeling job. 
You should be directed to the autolabeling page displaying the autolabeling jobs initiated. Autolabeling jobs can take anywhere from a few seconds to a few minutes, depending on the number of documents you included. 

    :::image type="content" source="../media/review-autotag.png" alt-text="A screenshot showing the review screen for an autotag job." lightbox="../media/review-autotag.png":::


---

## Review the auto labeled documents

When the autolabeling job is complete, you can see the output documents in the **Data labeling** page of Language Studio. Select **Review documents with autolabels** to view the documents with the **Auto labeled** filter applied.

:::image type="content" source="../media/open-autotag-files.png" alt-text="A screenshot showing the autolabeled documents" lightbox="../media/open-autotag-files.png":::

Entities that have been automatically labeled appear with a dotted line. These entities have two selectors (a checkmark and an "X") that allow you to accept or reject the automatic label.

Once an entity is accepted, the dotted line changes to a solid one, and the label is included in any further model training becoming a user defined label.

Alternatively, you can accept or reject all automatically labeled entities within the document, using **Accept all** or **Reject all** in the top right corner of the screen. 

After you accept or reject the labeled entities, select **Save labels** to apply the changes.

> [!NOTE]
> * We recommend validating automatically labeled entities before accepting them. 
> * All labels that were not accepted are be deleted when you train your model.

:::image type="content" source="../media/accept-reject-entities.png" alt-text="A screenshot showing how to accept and reject autolabeled entities." lightbox="../media/accept-reject-entities.png":::

## Next steps

* Learn more about [labeling your data](tag-data.md).
