---
title: Recommended practices for Custom Named Entity Recognition (NER)
titleSuffix: Azure Cognitive Services
description: Learn about recommended practices when using Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
---

# Recommended practices for Custom Named Entity Recognition (NER)

Follow the recommended development life cycle for best results:

## Data selection

The quality of data you train your model with affects model performance greatly.
 
* Use real-life data that reflects your domain's problem space to effectively train your model. You can use synthetic data to accelerate the initial model training process, but it will likely differ from your real-life data and make your model less effective when used.

* Balance your data distribution as much as possible without deviating far from the distribution in real-life.

* Use diverse data whenever possible to avoid overfitting your model. Less diversity in training data may lead to your model learning spurious correlations that may not exist in real-life data. 
 
* Avoid duplicate files in your data. Duplicate data has a negative effect on the training process, model metrics, and model performance. 

* Consider where your data comes from. If you are collecting data from one person, department, or part of your scenario, you are likely missing diversity that may be important for your model to learn about. 

* If your dataset contains multiple languages or if you expect text of different languages during production, enable the multilingual option when creating your project.

## Data preparation

As a prerequisite for creating a custom NER project, your training data needs to be uploaded to a blob container in your storage account. You can create and upload training files from Azure directly, or through using the Azure Storage Explorer tool. Using the Azure Storage Explorer tool allows you to upload more data quickly.

* [Create and upload files from Azure](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container)
* [Create and upload files using Azure Storage Explorer](/azure/vs-azure-tools-storage-explorer-blobs)

You can only use `.txt`. files for custom text. If your data is in other format, you can use [CLUtils parse command](https://github.com/microsoft/CogSLanguageUtilities/blob/main/CLUtils/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to change your file format.

You can upload an annotated dataset, or you can upload an unannotated dataset and [tag your data](../how-to/tag-data.md) in Language studio.

## Schema design

The schema defines the entity types that you need your model to extract from text at runtime.

* **Review and identify**: Review files in your dataset to be familiar with their structure and content, then identify the entities you want to extract from the data. 
For example, if you are extracting entities from support emails, you might need to extract *customer name*, *product name*, *customer problem*, *request date*, and *contact information*.

* **Avoid ambiguity in entity types**: Ambiguity arises when the types you specify share similar meaning to one another. 
The more ambiguous your schema is, the more tagged data you may need to train your model. 
For example, if you are extracting data from a legal contract, to extract *name of first party* and *name of second party*, you may need to tag more examples to help your model distinguish between the two entity types because they are defined similarly. Avoiding ambiguity saves time and yields better results.

* **Avoid complex and long entities**: Complex and long entities can be difficult to extract from text. Consider breaking them down into multiple entities. 
For example, the model may have a hard time extracting *address* if it was not broken down into smaller entities. This is because there are many variations of how addresses appear, and it would take many tagged entities to train the model properly. In this case consider breaking down *address* into simpler entity types like *street name*, *city*, *state*, and *zip*.

## Data tagging

* **Tag precisely**: Always tag each entity with its right type. Only include what you want to extract and nothing more. Imprecise tags can lead to an under-performing model.

* **Tag consistently**: The same entity should be tagged with the same entity type across all files in the dataset.

* **Tag completely**: Tag all entities in all the files in your dataset. Do not leave any text untagged. If you have files with no tagged entities, make sure it's due to the absence of entities, not because of negligence.

* In general, more tagged data leads to better results, provided the data is tagged precisely, consistently, and completely.

* Although we recommended the number of tags per entity type to be 200, there is no fixed number that can guarantee your model to perform the best, because model performance also depends on the possible ambiguity existing in your schema and the quality of your tagged data. 

> [!IMPORTANT]
> The precision, consistency and completeness of your tagged data are key factors to determining model performance.

* [View the model evaluation details](../how-to/view-model-evaluation.md): After model training, model evaluation is done against the test set, which was not introduced to the model during training. By viewing the evaluation, you can get a sense of how the model performs in real-life scenarios.

* [Examine data distribution](../how-to/improve-model.md#examine-data-distribution): Make sure that all classes are well represented and that you have a balanced data distribution to make sure that all your classes are adequately represented. If a certain class is tagged significantly less frequently than the others, this means this class is under-represented and most probably won't be recognized properly by the model at runtime. In this case, consider adding more files that belong to this class to your dataset.

* Perform error analysis: You can view the incorrect predictions your model made against the test set and revise your tagged data accordingly. As revisions are made to the labeled training set based on the observations made on the test set, the test set may become less effective in indicating the model’s accuracy in real-life scenarios.

* [Improve performance](../how-to/improve-model.md): Other than revising tagged data based on error analysis, you may want to increase the number of tags for the under-performing entity types or improve the diversity of your tagged data to ensure the model can learn to give correct predictions over the linguistic phenomena where it failed to.
<!-- 
* Define your own test set: If you are using a random split option and the resulting test set was not comprehensive enough, consider defining your own test to include a variety of data layouts and balanced tagged entities. -->

## Next steps

* [Text extraction overview](../overview.md)
