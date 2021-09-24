---
title: Recommended custom classification practices 
titleSuffix: Azure Cognitive Services
description: Learn about recommended practices when using custom classification, which is a part of Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/15/2021
ms.author: aahi
---

# Recommended practices for Custom text classification

Use this article to learn more about recommended practices when using custom text classification.

## Data selection

The quality of data you train your model with affects model performance greatly.

* Use real life data that reflects your domain problem space to effectively train your model.

    What about synthetic data? Whenever possible, use **real data** to train your model. Synthetic data will never have the variation found in real life data created by humans.
    If you need to start your model with synthetic data, you can do that - but note that you’ll need to add real data later to improve model performance.

* Use diverse data as much as you can to avoid overfitting your model.

    Overfitting happens when you train your model with similar data so that it's unable to make accurate predictions outside of what it was trained on. This makes the model useful only to the initial dataset, and not to any other datasets.

* Balance data distribution to represent expected data at runtime.
Make sure that all the scenarios/classes are adequately represented in your dataset.
Include less frequent classes in your data, if the model was not exposed a certain scenario/class in training it won't be able to recognize it in runtime.

> [!NOTE]
> If your files are in multiple languages, select the **multiple languages** option during [project creation](../quickstart.md) and set the **language** option to the language of the majority of your files.


* Avoid duplicate files in your data. Duplicate data has a negative effect on training process, model metrics, and model performance.

* Consider where your data comes from. If you are collecting data from one person or department, you are likely missing diversity that will be important for your model to learn about all usage scenarios.

## Data preparation

As a prerequisite for creating a Custom text classification project, your training data needs to be uploaded to a blob container in your storage account. You can create and upload training files from Azure directly, or through using the Azure Storage Explorer tool. Using the Azure Storage Explorer tool allows you to upload more data in less time.

* [Create and upload files from Azure](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container)
* [Create and upload files using Azure Storage Explorer](/azure/vs-azure-tools-storage-explorer-blobs)

You can only use `.txt`. files for custom text. If your data is in other format, you can use [CLUtils parse command](https://github.com/microsoft/CogSLanguageUtilities/blob/main/CLUtils/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to change your file format.

You can upload an unlabeled dataset or a labeled  dataset to your container. You will then [tag your data](../how-to/tag-data.md).

## Schema design

The schema defines the classes that you need your model to classify your text into at runtime.

* Review files in your dataset to become familiar with their format and structure.

* Identify the classes/categories you want to extract from the data.

    For example, if you are classifying support tickets, your classes might be: *sign in issues*, *hardware issue*, *software issue*, and *new hardware request*.

* Avoid class ambiguity. Ambiguity happens when your classes are similar to each other. If your schema is ambiguous, you'll need more tagged data to train your model.

    For example, if you are classifying food recipes, they are similar to an extent, so to differentiate between *dessert recipe* and *main dish recipe* you will need to add more examples to overcome ambiguity since both files are similar. Avoiding ambiguity saves time, effort, and yields better results.

* If at runtime you expect files that don't belong to any your classes, consider adding a `None` class to your schema add some files to your dataset to be tagged as `None`. At runtime the model only gives predictions based on the classes it was trained for. By adding the `None` class you train your model to recognize irrelevant files, and predict their tags accordingly.

## Data tagging

* As a general rule, more tagged data leads to better results.

* The number of tags you need depends on your data. Consider starting with 20 tags per class. This is highly dependent on your schema and class ambiguity; with ambiguous classes you need more tags. This also depends on the quality of your tagging.

* [View model evaluation details](../how-to/view-model-evaluation.md) after training is completed. The model is evaluated against the [test set](../how-to/train-model.md#data-splits), which is a set that was not introduced to the model during training. By doing this you get sense of how the model performs in real scenarios.

* [Improve your model](../how-to/improve-model.md). View the incorrect predictions your model made against the [validation set](../how-to/train-model.md#data-splits) to determine how you can tag your data better. Examine the data distribution to make sure each class is well represented in your dataset.

## Next steps

* [Create a project](../quickstart.md)
* [Tag data](../how-to/tag-data.md)
