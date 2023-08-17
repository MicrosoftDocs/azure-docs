---
title: Preparing data and designing a schema for custom Text Analytics for health
titleSuffix: Azure AI services
description: Learn about how to select and prepare data, to be successful in creating custom TA4H projects.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 04/14/2023
ms.author: aahi
ms.custom: language-service-custom-ta4h
---

# How to prepare data and define a schema for custom Text Analytics for health

In order to create a custom TA4H model, you will need quality data to train it. This article covers how you should select and prepare your data, along with defining a schema. Defining the schema is the first step in [project development lifecycle](../overview.md#project-development-lifecycle), and it entailing defining the entity types or categories that you need your model to extract from the text at runtime.

## Schema design

Custom Text Analytics for health allows you to extend and customize the Text Analytics for health entity map. The first step of the process is building your schema, which allows you to define the new entity types or categories that you need your model to extract from text in addition to the Text Analytics for health existing entities at runtime.  

* Review documents in your dataset to be familiar with their format and structure.

* Identify the entities you want to extract from the data.

    For example, if you are extracting entities from support emails, you might need to extract "Customer name", "Product name", "Request date", and "Contact information".

* Avoid entity types ambiguity.

    **Ambiguity** happens when entity types you select are similar to each other. The more ambiguous your schema the more labeled data you will need to differentiate between different entity types.

    For example, if you are extracting data from a legal contract, to extract "Name of first party" and "Name of second party" you will need to add more examples to overcome ambiguity since the names of both parties look similar. Avoid ambiguity as it saves time, effort, and yields better results.

* Avoid complex entities. Complex entities can be difficult to pick out precisely from text, consider breaking it down into multiple entities.

    For example, extracting "Address" would be challenging if it's not broken down to smaller entities. There are so many variations of how addresses appear, it would take large number of labeled entities to teach the model to extract an address, as a whole, without breaking it down. However, if you replace "Address" with "Street Name", "PO Box", "City", "State" and "Zip", the model will require fewer labels per entity.


## Add entities

To add entities to your project:

1. Move to **Entities** pivot from the top of the page.

2. [Text Analytics for health entities](../../text-analytics-for-health/concepts/health-entity-categories.md) are automatically loaded into your project. To add additional entity categories, select **Add** from the top menu. You will be prompted to type in a name before completing creating the entity.

3. After creating an entity, you'll be routed to the entity details page where you can define the composition settings for this entity.

4. Entities are defined by [entity components](../concepts/entity-components.md): learned, list or prebuilt. Text Analytics for health entities are by default populated with the prebuilt component and cannot have learned components. Your newly defined entities can be populated with the learned component once you add labels for them in your data but cannot be populated with the prebuilt component. 

5. You can add a [list](../concepts/entity-components.md#list-component)  component to any of your entities. 

   
### Add list component

To add a **list** component, select **Add new list**. You can add multiple lists to each entity.

1. To create a new list, in the *Enter value* text box enter this is the normalized value that will be returned when any of the synonyms values is extracted.

2. For multilingual projects, from the *language* drop-down menu, select the language of the synonyms list and start typing in your synonyms and hit enter after each one. It is recommended to have synonyms lists in multiple languages.

   <!--:::image type="content" source="../media/add-list-component.png" alt-text="A screenshot showing a list component in Language Studio." lightbox="../media/add-list-component.png":::-->
   
### Define entity options

Change to the **Entity options** pivot in the entity details page. When multiple components are defined for an entity, their predictions may overlap. When an overlap occurs, each entity's final prediction is determined based on the [entity option](../concepts/entity-components.md#entity-options) you select in this step. Select the one that you want to apply to this entity and select the **Save** button at the top.

   <!--:::image type="content" source="../media/entity-options.png" alt-text="A screenshot showing an entity option in Language Studio." lightbox="../media/entity-options.png":::-->


After you create your entities, you can come back and edit them. You can **Edit entity components** or **delete** them by selecting this option from the top menu.


## Data selection

The quality of data you train your model with affects model performance greatly.

* Use real-life data that reflects your domain's problem space to effectively train your model. You can use synthetic data to accelerate the initial model training process, but it will likely differ from your real-life data and make your model less effective when used.

* Balance your data distribution as much as possible without deviating far from the distribution in real-life. For example, if you are training your model to extract entities from legal documents that may come in many different formats and languages, you should provide examples that exemplify the diversity as you would expect to see in real life.

* Use diverse data whenever possible to avoid overfitting your model. Less diversity in training data may lead to your model learning spurious correlations that may not exist in real-life data. 
 
* Avoid duplicate documents in your data. Duplicate data has a negative effect on the training process, model metrics, and model performance. 

* Consider where your data comes from. If you are collecting data from one person, department, or part of your scenario, you are likely missing diversity that may be important for your model to learn about. 

> [!NOTE]
> If your documents are in multiple languages, select the **enable multi-lingual** option during [project creation](../quickstart.md) and set the **language** option to the language of the majority of your documents.

## Data preparation

As a prerequisite for creating a project, your training data needs to be uploaded to a blob container in your storage account. You can create and upload training documents from Azure directly, or through using the Azure Storage Explorer tool. Using the Azure Storage Explorer tool allows you to upload more data quickly.  

* [Create and upload documents from Azure](../../../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)
* [Create and upload documents using Azure Storage Explorer](../../../../vs-azure-tools-storage-explorer-blobs.md)

You can only use `.txt` documents. If your data is in other format, you can use [CLUtils parse command](https://github.com/microsoft/CognitiveServicesLanguageUtilities/blob/main/CustomTextAnalytics.CLUtils/Solution/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to change your document format.

You can upload an annotated dataset, or you can upload an unannotated one and [label your data](../how-to/label-data.md) in Language studio. 
 
## Test set

When defining the testing set, make sure to include example documents that are not present in the training set. Defining the testing set is an important step to calculate the [model performance](view-model-evaluation.md#model-details). Also, make sure that the testing set includes documents that represent all entities used in your project.

## Next steps

If you haven't already, create a custom Text Analytics for health project. If it's your first time using custom Text Analytics for health, consider following the [quickstart](../quickstart.md) to create an example project. You can also see the [how-to article](../how-to/create-project.md) for more details on what you need to create a project.
