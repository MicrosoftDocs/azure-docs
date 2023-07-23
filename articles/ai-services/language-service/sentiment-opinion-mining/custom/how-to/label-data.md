---
title: How to label your data for Custom sentiment analysis - Azure AI services
titleSuffix: Azure AI services
description: Learn about how to label your data for use with the custom Sentiment analysis.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 07/19/2023
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021, event-tier1-build-2022
---

# Label text data for training your model for Custom sentiment analysis

Before training your model you need to label your documents with the sentiments you want to categorize them into. This data will be used in the next step when training your model so that your model can learn from the labeled data. If you already have labeled data, you can directly [import](create-project.md) it into your project. Be sure that your data follows the [accepted data format](../concepts/data-formats.md).

Before creating a Custom sentiment analysis model, you need to have labeled data first. If your data isn't labeled already, you can label it in the [Language Studio](https://aka.ms/languageStudio). Labeled data informs the model how to interpret text, and is used for training and evaluation.

## Prerequisites

Before you can label data, you need:

* [A successfully created project](create-project.md) with a configured Azure blob storage account.
* Documents containing text data that have [been uploaded](design-schema.md#data-preparation) to your storage account.

See the [project development lifecycle](../../overview.md#project-development-lifecycle) for more information.

## Data labeling guidelines

After [preparing your data](design-schema.md) and [creating your project](create-project.md), you will need to label your data. Labeling your data is important so your model knows which documents will be associated with the sentiments you need. When you label your data in [Language Studio](https://aka.ms/languageStudio) (or import labeled data), these labels will be stored in the JSON file in your storage container that you've connected to this project. 

As you label your data, keep in mind:

* In general, more labeled data leads to better results, provided the data is labeled accurately.

* There is no fixed number of labels that can guarantee your model will perform the best. Model performance on possible ambiguity in your [data](design-schema.md), and the quality of your labeled data.

## Label your data

Use the following steps to label your data:

1. Go to your project page in [Language Studio](https://aka.ms/languageStudio).

2. From the left side menu, select **Data labeling**. You can find a list of all documents in your storage container.

    >[!TIP]
    > You can use the filters in top menu to view the unlabeled files so that you can start labeling them.
    > You can also use the filters to view the documents that are labeled with a specific sentiment.

3. Change to a single file view from the left side in the top menu or select a specific file to start labeling. You can find a list of all `.txt` files available in your projects to the left. You can use the **Back** and **Next** button from the bottom of the page to navigate through your documents.

    > [!NOTE]
    > If you enabled multiple languages for your project, you will find a **Language** dropdown in the top menu, which lets you select the language of each document.


4. In the right side pane, you can add sentiments to your project to start labeling your data with them. <!--You can also use the [auto labeling feature](use-autolabeling.md) to ensure complete labeling.-->

6. In the right side pane under the **Labels** pivot you can find all the sentiments in your project and the count of labeled instances for each.

7. In the bottom section of the right side pane you can add the current file you are viewing to the training set or the testing set. By default all the documents are added to your training set. Learn more about [training and testing sets](train-model.md#data-splitting) and how they are used for model training and evaluation.

    > [!TIP]
    > If you are planning on using **Automatic** data splitting use the default option of assigning all the documents into your training set.

8. Under the **Distribution** pivot you can view the distribution across training and testing sets. You have two options for viewing:
   * *Total instances* where you can view count of all labeled instances of a specific sentiment.
   * *Documents with at least one label* where each document is counted if it contains at least one labeled instance of this sentiment.

9. While you're labeling, your changes will be synced periodically, if they have not been saved yet you will find a warning at the top of your page. If you want to save manually, click on **Save labels** button at the bottom of the page.

## Next steps

After you've labeled your data, you can begin [training a model](train-model.md) that will learn based on your data.
