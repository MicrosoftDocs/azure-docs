---
title: Definitions used in custom Text Analytics for health
titleSuffix: Azure AI services
description: Learn about definitions used in custom Text Analytics for health
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: overview
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-custom-TA4H
---

# Terms and definitions used in custom Text Analytics for health

Use this article to learn about some of the definitions and terms you may encounter when using Custom Text Analytics for health

## Entity
Entities are words in input data that describe information relating to a specific category or concept. If your entity is complex and you would like your model to identify specific parts, you can break your entity into subentities. For example, you might want your model to predict an address, but also the subentities of street, city, state, and zipcode. 

## F1 score
The F1 score is a function of Precision and Recall. It's needed when you seek a balance between [precision](#precision) and [recall](#recall).

## Prebuilt entity component

Prebuilt entity components represent pretrained entity components that belong to the [Text Analytics for health entity map](../../text-analytics-for-health/concepts/health-entity-categories.md). These entities are automatically loaded into your project as entities with prebuilt components. You can define list components for entities with prebuilt components but you cannot add learned components. Similarly, you can create new entities with learned and list components, but you cannot populate them with additional prebuilt components.


## Learned entity component

The learned entity component uses the entity tags you label your text with to train a machine learned model. The model learns to predict where the entity is, based on the context within the text. Your labels provide examples of where the entity is expected to be present in text, based on the meaning of the words around it and as the words that were labeled. This component is only defined if you add labels by labeling your data for the entity. If you do not label any data with the entity, it will not have a learned component. Learned components cannot be added to entities with prebuilt components.

## List entity component
A list entity component represents a fixed, closed set of related words along with their synonyms. List entities are exact matches, unlike machined learned entities.

The entity will be predicted if a word in the list entity is included in the list. For example, if you have a list entity called "clinics" and you have the words "clinic a, clinic b, clinic c" in the list, then the size entity will be predicted for all instances of the input data where "clinic a, clinic b, clinic c" are used regardless of the context. List components can be added to all entities regardless of whether they are prebuilt or newly defined.

## Model
A model is an object that's trained to do a certain task, in this case custom Text Analytics for health models perform all the features of Text Analytics for health in addition to custom entity extraction for the user's defined entities. Models are trained by providing labeled data to learn from so they can later be used to understand context from the input text.

* **Model evaluation** is the process that happens right after training to know how well does your model perform.
* **Deployment** is the process of assigning your model to a deployment to make it available for use via the [prediction API](https://aka.ms/ct-runtime-swagger).

## Overfitting

Overfitting happens when the model is fixated on the specific examples and is not able to generalize well.

## Precision
Measures how precise/accurate your model is. It's the ratio between the correctly identified positives (true positives) and all identified positives. The precision metric reveals how many of the predicted entities are correctly labeled.

## Project
A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Azure resource being used.

## Recall
Measures the model's ability to predict actual positive entities. It's the ratio between the predicted true positives and what was actually labeled. The recall metric reveals how many of the predicted entities are correct.


## Schema
Schema is defined as the combination of entities within your project. Schema design is a crucial part of your project's success. When creating a schema, you want think about what are the new entities should you add to your project to extend the existing [Text Analytics for health entity map](../../text-analytics-for-health/concepts/health-entity-categories.md) and which new vocabulary should you add to the prebuilt entities using list components to enhance their recall. For example, adding a new entity for patient name or extending the prebuilt entity "Medication Name" with a new research drug (Ex: research drug A).

## Training data
Training data is the set of information that is needed to train a model.


## Next steps

* [Data and service limits](service-limits.md).

