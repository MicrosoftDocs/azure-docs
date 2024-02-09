---
title: How to prepare data and define a custom sentiment analysis schema
titleSuffix: Azure AI services
description: Learn about data selection and preparation for custom sentient analysis projects.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 07/19/2023
ms.author: aahi
ms.custom: language-service-custom-classification
---

# How to prepare data for custom sentiment analysis

In order to create a Custom sentiment analysis model, you will need quality data to train it. This article covers how you should select and prepare your data, along with defining a schema. Defining the schema is the first step in the project development lifecycle, and it defines the classes that you need your model to classify your text into at runtime.

## Data selection

The quality of data you train your model with affects model performance greatly.

* Use real-life data that reflects your domain's problem space to effectively train your model. You can use synthetic data to accelerate the initial model training process, but it will likely differ from your real-life data and make your model less effective when used.

* Balance your data distribution as much as possible without deviating far from the distribution in real-life.

* Use diverse data whenever possible to avoid overfitting your model. Less diversity in training data may lead to your model learning spurious correlations that may not exist in real-life data. 
 
* Avoid duplicate documents in your data. Duplicate data has a negative effect on the training process, model metrics, and model performance. 

* Consider where your data comes from. If you are collecting data from one person, department, or part of your scenario, you are likely missing diversity that may be important for your model to learn about. 

> [!NOTE]
> If your documents are in multiple languages, select the **multiple languages** option during project creation and set the **language** option to the language of the majority of your documents.

## Data preparation

As a prerequisite for creating a Custom sentiment analysis project, your training data needs to be uploaded to a blob container in your storage account. You can create and upload training documents from Azure directly, or through using the Azure Storage Explorer tool. Using the Azure Storage Explorer tool allows you to upload more data quickly.  

* [Create and upload documents from Azure](../../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)
* [Create and upload documents using Azure Storage Explorer](../../../../../vs-azure-tools-storage-explorer-blobs.md)

You can only use `.txt`. documents for custom text. If your data is in other format, you can use [CLUtils parse command](https://github.com/microsoft/CognitiveServicesLanguageUtilities/blob/main/CustomTextAnalytics.CLUtils/Solution/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to change your file format.

## Test set

When defining the testing set, make sure to include example documents that are not present in the training set. Defining the testing set is an important step to calculate the model performance<!--[model performance](view-model-evaluation.md#model-details)-->. Also, make sure that the testing set include documents that represent all classes used in your project.

## Next steps

If you haven't already, create a Custom sentiment analysis project. If it's your first time using Custom sentiment analysis, consider following the [quickstart](../quickstart.md) to create an example project. You can also see the [project requirements](../how-to/create-project.md) for more details on what you need to create a project.
