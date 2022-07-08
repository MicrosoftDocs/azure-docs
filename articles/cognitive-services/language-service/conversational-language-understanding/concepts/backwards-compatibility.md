---
title: Conversational Language Understanding backwards compatibility
titleSuffix: Azure Cognitive Services
description: Learn about backwards compatibility between LUIS and Conversational Language Understanding
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 05/13/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Backwards compatibility with LUIS applications

You can reuse some of the content of your existing [LUIS](../../../LUIS/what-is-luis.md) applications in [conversational language understanding](../overview.md). When working with conversational language understanding projects, you can:
* Create conversational language understanding conversation projects from LUIS application JSON files.
* Create LUIS applications that can be connected to [orchestration workflow](../../orchestration-workflow/overview.md) projects.  
  
> [!NOTE]
> This guide assumes you have created a Language resource. If you're getting started with the service, see the [quickstart article](../quickstart.md). 

## Import a LUIS application JSON file into Conversational Language Understanding

### [Language Studio](#tab/studio)

To import a LUIS application JSON file, click on the icon next to **Create a new project** and select **Import**. Then select the LUIS file. When you import a new project into Conversational Language Understanding, you can select an exported LUIS application JSON file, and the service will automatically create a project with the currently available features.

:::image type="content" source="../media/import.png" alt-text="A screenshot showing the import button for conversation projects." lightbox="../media/import.png":::

### [REST API](#tab/rest-api)

[!INCLUDE [Import LUIS application](../includes/rest-api/import-LUIS-project.md)]

---

## Supported features
When you import the LUIS JSON application into conversational language understanding, it will create a **Conversations** project with the following features will be selected:

|**Feature**|**Notes**|
|: - |: - |
|Intents|All of your intents will be transferred as conversational language understanding intents with the same names.|
|ML entities|All of your ML entities will be transferred as conversational language understanding entities with the same names. The labels will be persisted and used to train the Learned component of the entity. Structured ML entities will transfer over the lowest level subentities of the structure as different entities and apply their labels accordingly.|
|Utterances|All of your LUIS utterances will be transferred as conversational language understanding utterances with their intent and entity labels. Structured ML entity labels will only consider the lowest level subentity labels, and all the top level entity labels will be ignored.|
|Culture|The primary language of the Conversation project will be the LUIS app culture. If the culture is not supported, the importing will fail. |
|List entities|All of your list entities will be transferred as conversational language understanding entities with the same names. The normalized values and synonyms of each list will be transferred as keys and synonyms in the list component for the conversational language understanding entity.|
|Prebuilt entities|All of your prebuilt entities will be transferred as conversational language understanding entities with the same names. The conversational language understanding entity will have the relevant [prebuilt entities](entity-components.md#prebuilt-component) enabled if they are supported. |
|Required entity features in ML entities|If you had a prebuilt entity or a list entity as a required feature to another ML entity, then the ML entity will be transferred as a conversational language understanding entity with the same name and its labels will apply. The conversational language understanding entity will include the required feature entity as a component. The [overlap method](entity-components.md#entity-options) will be set as “Exact Overlap” for the conversational language understanding entity.|
|Non-required entity features in ML entities|If you had a prebuilt entity or a list entity as a non-required feature to another ML entity, then the ML entity will be transferred as a conversational language understanding entity with the same name and its ML labels will apply. If an ML entity was used as a feature to another ML entity, it will not be transferred over.|
|Roles|All of your roles will be transferred as conversational language understanding entities with the same names. Each role will be its own conversational language understanding entity. The role’s entity type will determine which component is populated for the role. Roles on prebuilt entities will transfer as conversational language understanding entities with the prebuilt entity component enabled and the role labels transferred over to train the Learned component. Roles on list entities will transfer as conversational language understanding entities with the list entity component populated and the role labels transferred over to train the Learned component. Roles on ML entities will be transferred as conversational language understanding entities with their labels applied to train the Learned component of the entity.  |

## Unsupported features

When you import the LUIS JSON application into conversational language understanding, certain features will be ignored, but they will not block you from importing the application. The following features will be ignored:

|**Feature**|**Notes**|
|: - |: - |
|Application Settings|The settings such as Normalize Punctuation, Normalize Diacritics, and Use All Training Data were meant to improve predictions for intents and entities. The new models in conversational language understanding are not sensitive to small changes such as punctuation and are therefore not available as settings.|
|Features|Phrase list features and features to intents will all be ignored. Features were meant to introduce semantic understanding for LUIS that conversational language understanding can provide out of the box with its new models.|
|Patterns|Patterns were used to cover for lack of quality in intent classification. The new models in conversational language understanding are expected to perform better without needing patterns.|
|`Pattern.Any` Entities|`Pattern.Any` entities were used to cover for lack of quality in ML entity extraction. The new models in conversational language understanding are expected to perform better without needing `Pattern.Any` entities.|
|Regex Entities| Not currently supported |
|Structured ML Entities| Not currently supported |

## Use a published LUIS application in orchestration workflow projects

You can only connect to published LUIS applications that are owned by the same Language resource that you use for Conversational Language Understanding. You can change the authoring resource to a Language **S** resource in **West Europe** applications. See the [LUIS documentation](../../../luis/luis-how-to-azure-subscription.md#assign-luis-resources) for steps on assigning a different resource to your LUIS application. You can also export then import the LUIS applications into your Language resource. You must train and publish LUIS applications for them to appear in Conversational Language Understanding when you want to connect them to orchestration projects.


## Next steps

[Conversational Language Understanding overview](../overview.md)
