---
title: Conversational Language Understanding backwards compatibility
titleSuffix: Azure Cognitive Services
description: Learn about backwards compatibility between LUIS and Conversational Language Understanding
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Backwards compatibility with LUIS applications

You can reuse some of the content of your existing LUIS applications in Conversational Language Understanding. When working with Conversational Language Understanding projects, you can:
* Create CLU conversation projects from LUIS application JSON files.
* Create LUIS applications that can be connected to orchestration workflow projects.  
  
> [!NOTE]
> This guide assumes you have created a Language resource. If you're getting started with the service, see the [quickstart article](../quickstart.md). 

## Import a LUIS application JSON file into Conversational Language Understanding

To import a LUIS application JSON file, click on the icon next to **Create a new project** and select **Import**. Then select the LUIS file. When you import a new project into Conversational Language Understanding, you can select an exported LUIS application JSON file, and the service will automatically create a project with the currently available features.

:::image type="content" source="../media/import.png" alt-text="A screenshot showing the import button for conversation projects." lightbox="../media/import.png":::

### Supported features
When importing the LUIS JSON application into CLU, it will create a **Conversations** project with the following features will be selected:

|**Feature**|**Notes**|
| :- | :- |
|Intents|All of your intents will be transferred as CLU intents with the same names.|
|ML entities|All of your ML entities will be transferred as CLU entities with the same names. The ML labels will be persisted and used to train the Learned component of the entity. Structured ML entities will only be transferred as the top-level entity. The individual sub-entities will be ignored.|
|Utterances|All of your LUIS utterances will be transferred as CLU utterances with their intent and entity labels. Structured ML entity labels will only consider the top-level entity labels, and the individual sub-entity labels will be ignored.|
|Culture|The primary language of the Conversation project will be the LUIS app culture. If the culture is not supported, the importing will fail. |

### Unsupported features

When importing the LUIS JSON application into CLU, certain features will be ignored, but they will not block you from importing the application. The following features will be ignored:

|**Feature**|**Notes**|
| :- | :- |
|Application Settings|The settings such as Normalize Punctuation, Normalize Diacritics, and Use All Training Data were meant to improve predictions for intents and entities. The new models in CLU are not sensitive to small changes such as punctuation and are therefore not available as settings.|
|Features|Phrase list features and features to intents will all be ignored. Features were meant to introduce semantic understanding for LUIS that CLU can provide out of the box with its new models.|
|Patterns|Patterns were used to cover for lack of quality in intent classification. The new models in CLU are expected to perform better without needing patterns.|
|Pattern.Any Entities|Pattern.Any entities were used to cover for lack of quality in ML entity extraction. The new models in CLU are expected to perform better without needing pattern.any entities.|
|Regex Entities| Not currently supported |
|Structured ML Entities| Not currently supported |
|List entities | Not currently supported |
|Prebuilt entities | Not currently supported |
|Required entity features in ML entities | Not currently supported |
|Non-required entity features in ML entities | Not currently supported |
|Roles | Not currently supported |

## Use a published LUIS application in Conversational Language Understanding orchestration projects

You can only connect to published LUIS applications that are owned by the same Language resource that you use for Conversational Language Understanding. You can change the authoring resource to a Language **S** resource in **West Europe** applications. See the [LUIS documentation](../../../luis/luis-how-to-azure-subscription.md#assign-luis-resources) for steps on assigning a different resource to your LUIS application. You can also export then import the LUIS applications into your Language resource. You must train and publish LUIS applications for them to appear in Conversational Language Understanding when you want to connect them to orchestration projects.


## Next steps

[Conversational Language Understanding overview](../overview.md)
