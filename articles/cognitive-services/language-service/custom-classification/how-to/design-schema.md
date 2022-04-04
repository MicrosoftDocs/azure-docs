---
title: How to prepare data and define a schema
titleSuffix: Azure Cognitive Services
description: Learn about data selection, preparation, and creating a schema for custom text classification projects.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# How to prepare data and define a schema

In order to create a custom text classification model, you will need quality data to train it. This article covers how you should approach selecting and preparing your data, along with defining a schema. A schema defines the classes that you need your model to classify your text into at runtime, and is the first step of [developing a custom classification application](../overview.md#project-development-lifecycle).


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

* [Create and upload files from Azure](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)
* [Create and upload files using Azure Storage Explorer](../../../../vs-azure-tools-storage-explorer-blobs.md)

You can only use `.txt`. files for custom text. If your data is in other format, you can use [CLUtils parse command](https://github.com/microsoft/CognitiveServicesLanguageUtilities/blob/main/CustomTextAnalytics.CLUtils/Solution/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to change your file format.

 You can upload an annotated dataset, or you can upload an unannotated one and [tag your data](../how-to/tag-data.md) in Language studio. 
 
## Schema design

The schema defines the classes that you need your model to classify your text into at runtime.

* **Review and identify**: Review files in your dataset to be familiar with their structure and content, then identify how you want to classify your data. 

    For example, if you are classifying support tickets, you might need the following classes: *login issue*, *hardware issue*, *connectivity issue*, and *new equipment request*.

* **Avoid ambiguity in classes**: Ambiguity arises when the classes you specify share similar meaning to one another. The more ambiguous your schema is, the more tagged data you may need to train your model.  

    For example, if you are classifying food recipes, they may be similar to an extent. To differentiate between *dessert recipe* and *main dish recipe*, you may need to tag more examples to help your model distinguish between the two classes. Avoiding ambiguity saves time and yields better results. 

* **Out of scope data**: When using your model in production, consider adding an *out of scope* class to your schema if you expect files that don't belong to any of your classes. Then add a few files to your dataset to be tagged as *out of scope*. The model can learn to recognize irrelevant files, and predict their tags accordingly.

## Next steps

If you haven't already, create a custom text classification project. If it's your first time using custom text classification, consider following the [quickstart](../quickstart.md) to create an example project. You can also see the [project requirements](../how-to/create-project.md) for more details on what you need to create a project.
