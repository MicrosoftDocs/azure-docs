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
ms.date: 11/02/2021
ms.author: aahi
---

# Recommended practices for custom text classification

Use this article to learn more about recommended practices when using custom text classification.

## Data selection

The quality of data you train your model with affects model performance greatly.

* Use real-life data that reflects your domain's problem space to effectively train your model. You can use synthetic data to accelerate the initial model training process, but it will likely differ from your real-life data and make your model less effective when used.

* Balance your data distribution as much as possible without deviating far from the distribution in real-life.

* Use diverse data whenever possible to avoid overfitting your model. Less diversity in training data may lead to your model learning spurious correlations that may not exist in real-life data. 
 
* Avoid duplicate files in your data. Duplicate data has a negative effect on the training process, model metrics, and model performance. 

* Consider where your data comes from. If you are collecting data from one person, department, or part of your scenario, you are likely missing diversity that may be important for your model to learn about. 

> [!NOTE]
> If your files are in multiple languages, select the **multiple languages** option during [project creation](../quickstart.md) and set the **language** option to the language of the majority of your files.

## Data preparation

As a prerequisite for creating a custom text classification project, your training data needs to be uploaded to a blob container in your storage account. You can create and upload training files from Azure directly, or through using the Azure Storage Explorer tool. Using the Azure Storage Explorer tool allows you to upload more data quickly.  

* [Create and upload files from Azure](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container)
* [Create and upload files using Azure Storage Explorer](/azure/vs-azure-tools-storage-explorer-blobs)

You can only use `.txt`. files for custom text. If your data is in other format, you can use [CLUtils parse command](https://github.com/microsoft/CogSLanguageUtilities/blob/main/CLUtils/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to change your file format.

 You can upload an annotated dataset, or you can upload an unannotated one and [tag your data](../how-to/tag-data.md) in Language studio. 
 
## Schema design

The schema defines the classes that you need your model to classify your text into at runtime.

* **Review and identify**: Review files in your dataset to be familiar with their structure and content, then identify how you want to classify your data. 

    For example, if you are classifying support tickets, you might need the following classes: *login issue*, *hardware issue*, *connectivity issue*, and *new equipment request*.

* **Avoid ambiguity in classes**: Ambiguity arises when the classes you specify share similar meaning to one another. The more ambiguous your schema is, the more tagged data you may need to train your model.  

    For example, if you are classifying food recipes, they may be similar to an extent. To differentiate between *dessert recipe* and *main dish recipe*, you may need to tag more examples to help your model distinguish between the two classes. Avoiding ambiguity saves time and yields better results. 

* **Out of scope data**: When using your model in production, consider adding an *out of scope* class to your schema if you expect files that don't belong to any of your classes. Then add a few files to your dataset to be tagged as *out of scope*. The model can learn to recognize irrelevant files, and predict their tags accordingly.

## Data tagging

* In general, more tagged data leads to better results, provided the data is tagged accurately.

* Although we recommended to have around 50 tagged files per class, there is no fixed number that can guarantee your model to perform the best, because model performance also depends on possible ambiguity in your schema, and the quality of your tagged data.

* [View model evaluation details](../how-to/view-model-evaluation.md) After model training, model evaluation is done against the [test set](../how-to/train-model.md#data-splits), which was not introduced to the model during training. By viewing the evaluation, you can get a sense of how the model performs in real-life scenarios.

* [Examine data distribution](../how-to/improve-model.md#examine-data-distribution-from-language-studio) Make sure that all classes are well represented and that you have a balanced data distribution to make sure that all your classes are adequately represented. If a certain class is tagged significantly less frequent than the others, this means this class is under-represented and most probably won't be recognized properly by the model at runtime. In this case, consider adding more files that belong to this class to your dataset.

* [Improve performance](../how-to/improve-model.md) Other than revising tagged data based on error analysis, you may want to increase the number of tags for under-performing entity types, or improve the diversity of your tagged data. This will help your model learn to give correct predictions, over potential linguistic phenomena that cause failure.

<!-- * Define your own test set: If you are using a random split option and the resulting test set was not comprehensive enough, consider defining your own test to include a variety of data layouts and balanced tagged classes.
 -->
## Next steps

* [Create a project](../quickstart.md)
* [Tag data](../how-to/tag-data.md)
