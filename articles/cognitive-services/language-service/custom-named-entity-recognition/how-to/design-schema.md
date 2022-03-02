---
title: Preparing data and designing a schema for custom NER
titleSuffix: Azure Cognitive Services
description: Learn about how to select and prepare data, to be successful in creating custom NER projects.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021
---

# How to prepare data and define a schema for custom NER

In order to create a custom NER model, you will need quality data to train it. This article covers how you should approach selecting and preparing your data, along with defining a schema. The schema defines the entity types/categories that you need your model to extract from text at runtime, and is the first step of [developing an entity extraction model](../overview.md#application-development-lifecycle).

## Schema design

The schema defines the entity types/categories that you need your model to extract from text at runtime.

* Review files in your dataset to be familiar with their format and structure.

* Identify the [entities](../glossary.md#entity) you want to extract from the data.

    For example, if you are extracting entities from support emails, you might need to extract "Customer name", "Product name", "Customer's problem", "Request date", and "Contact information".

* Avoid entity types ambiguity.

    **Ambiguity** happens when the types you select are similar to each other. The more ambiguous your schema the more tagged data you will train your model.

    For example, if you are extracting data from a legal contract, to extract "Name of first party" and "Name of second party" you will need to add more examples to overcome ambiguity since the names of both parties look similar. Avoiding ambiguity saves time, effort, and yields better results.

* Avoid complex entities. Complex entities can be difficult to pick out precisely from text, consider breaking it down into multiple entities.

    For example, the model would have a hard time extracting "Address" if it was not broken down into smaller entities. There are so many variations of how addresses appear, it would take large number of tagged entities to teach the model to extract an address, as a whole, without breaking it down. However, if you replace "Address" with "Street Name", "PO Box", "City", "State" and "Zip", the model  will require fewer tags per entity.

## Data selection

The quality of data you train your model with affects model performance greatly.

* Use real-life data that reflects your domain's problem space to effectively train your model. You can use synthetic data to accelerate the initial model training process, but it will likely differ from your real-life data and make your model less effective when used.

* Balance your data distribution as much as possible without deviating far from the distribution in real-life. For example, if you are training your model to extract entities from legal documents that may come in many different formats and languages, you should provide examples that exemplify the diversity as you would expect to see in real life.

* Use diverse data whenever possible to avoid overfitting your model. Less diversity in training data may lead to your model learning spurious correlations that may not exist in real-life data. 
 
* Avoid duplicate files in your data. Duplicate data has a negative effect on the training process, model metrics, and model performance. 

* Consider where your data comes from. If you are collecting data from one person, department, or part of your scenario, you are likely missing diversity that may be important for your model to learn about. 

> [!NOTE]
> If your files are in multiple languages, select the **multiple languages** option during [project creation](../quickstart.md) and set the **language** option to the language of the majority of your files.

## Data preparation

As a prerequisite for creating a project, your training data needs to be uploaded to a blob container in your storage account. You can create and upload training files from Azure directly, or through using the Azure Storage Explorer tool. Using the Azure Storage Explorer tool allows you to upload more data quickly.  

* [Create and upload files from Azure](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)
* [Create and upload files using Azure Storage Explorer](../../../../vs-azure-tools-storage-explorer-blobs.md)

You can only use `.txt` files. If your data is in other format, you can use [CLUtils parse command](https://github.com/microsoft/CognitiveServicesLanguageUtilities/blob/main/CustomTextAnalytics.CLUtils/Solution/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to change your file format.

 You can upload an annotated dataset, or you can upload an unannotated one and [tag your data](../how-to/tag-data.md) in Language studio. 
 
## Next steps

If you haven't already, create a custom NER project. If it's your first time using custom NER, consider following the [quickstart](../quickstart.md) to create an example project. You can also see the [how-to article](../how-to/create-project.md) for more details on what you need to create a project.