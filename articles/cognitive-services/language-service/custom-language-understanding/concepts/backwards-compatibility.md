---
title: Custom Language Understanding backwards compatibility 
titleSuffix: Azure Cognitive Services
description: Learn about backwards compatibility between LUIS and Custom Language Understanding 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
---

# Backwards compatibility with LUIS applications

You can reuse some of the content of your existing LUIS applications in Custom Language Understanding. When working with Custom Language Understanding projects, you can:
* Create projects from LUIS application JSON files.
* Create LUIS applications that can be connected by orchestration workflow projects.  
* Migrate LUIS applications to use a Text Analytics resource. 
  
> [!NOTE]
> This guide assumes you have created a Text Analytics resource with an Azure blob storage account. If you're getting started with the service, see the [quickstart article](../quickstart.md). 

## Import a LUIS application JSON file into Custom Language Understanding

To import a LUIS application JSON file, click on the icon next to **Create a new project** and select **Import**. Then select the LUIS file. When you import a new project into Custom Language Understanding, you can select an exported LUIS application JSON file, and the service will automatically create a project with the currently available features.

:::image type="content" source="../media/import.png" alt-text="A screenshot showing the import button for conversation projects." lightbox="../media/import.png":::

## Use a published LUIS application in Custom Language Understanding orchestration projects

You can only to connect to published LUIS applications that are owned by the same resource that you use for Custom Language Understanding. See the [LUIS documentation](../../../luis/luis-how-to-azure-subscription.md#assign-luis-resources) for steps on assigning a different resource to your LUIS application. You must train and publish LUIS applications for them to appear in Custom Language Understanding when you want to connect them to orchestration projects.

## Supported Features

When importing the LUIS application into Custom Language Understanding, it will create a conversation project with the following features:

|Feature|Notes|
|---|---|
|Intents|All of your LUIS intents will be transferred as Custom Language Understanding intents with the same intents. |
|Machine learning (ML) entities|All of your ML entities will be transferred as Custom Language Understanding entities with the same names. Structured ML entities will only be transferred as one top-level entity, and the individual sub-entities will be ignored. |
|Utterances|All of your LUIS utterances will be transferred as Custom Language Understanding utterances with their intent and entity labels. Structured ML entity labels will only keep the top-level entity labels, and the individual sub-entity labels will be ignored.|
|Culture|The primary language of the conversations project will be the LUIS app culture. If the culture is not supported, the import will fail, and you will get an error.|
|List entities| All of your list entities will be transferred as Custom Language Understanding entities with the same names. The normalized values and synonyms of each list will be transferred as keys and synonyms in the list component for the Custom Language Understanding entity. |
|Prebuilt entities|	All of your prebuilt entities will be transferred as Custom Language Understanding entities, with the same names. They will have the appropriate prebuilt entities enabled if they are supported. |
| Required entity features in ML entities | If you had a prebuilt entity or list entity as a required feature to another ML entity (top-level entities only; sub-entities are ignored), then the ML entity will be transferred as a Custom Language Understanding entity with the same name, and its ML labels will apply. The entity will include the required feature entity as a component. The overlap method will be set as **Exact Overlap**.
| Non-required entity features in ML entities | If you had a prebuilt entity or a list entity as a non-required feature to another ML entity (top-level entities only; sub-entities are ignored), then the ML entity will be transferred as a Custom Language Understanding entity with the same name, and its ML labels will apply. If an ML entity was used as a feature to another ML entity, it will not be transferred over. |

### Roles

All of your roles will be transferred as Custom Language Understanding entities with the same names. Each role will be its own entity. The role’s entity type will determine which component is populated for the role. 


|Role |Notes  |
|---------|---------|
|Roles for prebuilt entities    | Roles for prebuilt entities will transfer as Custom Language Understanding entities. The prebuilt entity component will be enabled, and the role labels will be transferred over to train the Learned component.        |
|Roles for list entities     | Roles for list entities will transfer as Custom Language Understanding entities with the list entity component populated, and the role labels will be transferred over to train the Learned component. |
| Roles for ML entities    |   Roles for ML entities will be transferred as Custom Language Understanding entities with their labels applied to train the Learned component of the entity.       |


## Unsupported Features

When importing the LUIS JSON application into Custom Language Understanding, certain features will be ignored, but won't block you from importing the application. The following features will be ignored:

|**Feature**|Notes|
|---|---|
|Regex Entities| |
|Application Settings| Settings such as *Normalize Punctuation*, *Normalize Diacritics*, and *Use All Training Data* were meant to improve predictions for intents and entities in LUIS. The new models in Custom Language Understanding are not sensitive to small changes such as punctuation and not available as settings. |
|Features| Features for phrase lists and intents will all be ignored. Features were meant to introduce semantic understanding for LUIS that Custom Language Understanding already provides. |
|Patterns| Patterns were used to help improve the intent classification in LUIS. The models in Custom Language Understanding do not use patterns. |
|`Pattern.Any` Entities| These entities were used to help with ML entity extraction quality in LUIS. The models in Custom Language Understanding do not use `Pattern.Any` entities. |
|Structured ML Entities| |

## Next steps

[Custom Language Understanding overview](../overview.md)