---
title: How to use autolabeling in custom text classification
titleSuffix: Azure AI services
description: Learn how to use autolabeling in custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 3/15/2023
ms.author: aahi
---

# How to use autolabeling for Custom Text Classification

[Labeling process](tag-data.md) is an important part of preparing your dataset. Since this process requires much time and effort, you can use the autolabeling feature to automatically label your documents with the classes you want to categorize them into. You can currently start autolabeling jobs based on a model using GPT models where you may immediately trigger an autolabeling job without any prior model training. This feature can save you the time and effort of manually labeling your documents. 

## Prerequisites

Before you can use autolabeling with GPT, you need:
* A successfully [created project](create-project.md) with a configured Azure blob storage account.
* Text data that [has been uploaded](design-schema.md#data-preparation) to your storage account.
* Class names that are meaningful. The GPT models label documents based on the names of the classes you've provided.
* [Labeled data](tag-data.md) isn't required.
* An Azure OpenAI [resource and deployment](../../../openai/how-to/create-resource.md). 

---

## Trigger an autolabeling job

When you trigger an autolabeling job with GPT, you're charged to your Azure OpenAI resource as per your consumption. You're charged an estimate of the number of tokens in each document being autolabeled. Refer to the [Azure OpenAI pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) for a detailed breakdown of pricing per token of different models.

1.  From the left navigation menu, select **Data labeling**.
2.  Select the **Autolabel** button under the Activity pane to the right of the page.

    :::image type="content" source="../media/trigger-autotag.png" alt-text="A screenshot showing how to trigger an autotag job from the activity pane." lightbox="../media/trigger-autotag.png":::

4. Choose Autolabel with GPT and select Next.

    :::image type="content" source="../media/choose-models.png" alt-text="A screenshot showing model choice for auto labeling." lightbox="../media/choose-models.png":::

5. Choose your Azure OpenAI resource and deployment. You must [create an Azure OpenAI resource and deploy a model](../../../openai/how-to/create-resource.md) in order to proceed.

    :::image type="content" source="../media/autotag-choose-open-ai.png" alt-text="A screenshot showing how to choose OpenAI resource and deployments" lightbox="../media/autotag-choose-open-ai.png":::
    
6. Select the classes you want to be included in the autolabeling job. By default, all classes are selected. Having descriptive names for classes, and including examples for each class is recommended to achieve good quality labeling with GPT.

    :::image type="content" source="../media/choose-classes.png" alt-text="A screenshot showing which labels to be included in autotag job." lightbox="../media/choose-classes.png":::
    
7. Choose the documents you want to be automatically labeled. It's recommended to choose the unlabeled documents from the filter. 

    > [!NOTE]
    > * If a document was automatically labeled, but this label was already user defined, only the user defined label is used.  
    > * You can view the documents by clicking on the document name.
    
    :::image type="content" source="../media/choose-files.png" alt-text="A screenshot showing which documents to be included in the autotag job." lightbox="../media/choose-files.png":::

8.	Select **Start job** to trigger the autolabeling job. 
You should be directed to the autolabeling page displaying the autolabeling jobs initiated. Autolabeling jobs can take anywhere from a few seconds to a few minutes, depending on the number of documents you included. 

    :::image type="content" source="../media/review-autotag.png" alt-text="A screenshot showing the review screen for an autotag job." lightbox="../media/review-autotag.png":::


---

## Review the auto labeled documents

When the autolabeling job is complete, you can see the output documents in the **Data labeling** page of Language Studio. Select **Review documents with autolabels** to view the documents with the **Auto labeled** filter applied.

:::image type="content" source="../media/open-autotag-files.png" alt-text="A screenshot showing the autolabeled documents" lightbox="../media/open-autotag-files.png":::

Documents that have been automatically classified have suggested labels in the activity pane highlighted in purple. Each suggested label has two selectors (a checkmark and a cancel icon) that allow you to accept or reject the automatic label.

Once a label is accepted, the purple color changes to the default blue one, and the label is included in any further model training becoming a user defined label.

After you accept or reject the labels for the autolabeled documents, select **Save labels** to apply the changes.

> [!NOTE]
> * We recommend validating automatically labeled documents before accepting them. 
> * All labels that were not accepted are deleted when you train your model.

:::image type="content" source="../media/accept-reject-labels.png" alt-text="A screenshot showing how to accept and reject autolabeled documents." lightbox="../media/accept-reject-labels.png":::

## Next steps

* Learn more about [labeling your data](tag-data.md).
