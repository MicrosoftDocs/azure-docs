---
title: Language Understanding (LUIS) boundaries | Microsoft Docs
titleSuffix: Azure
description:  This article contains known limits of LUIS.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/26/2018
ms.author: v-geberr
---
# LUIS boundaries
LUIS has several boundary areas. The first is the [model boundary](#model-boundaries), which controls intents, entities, and features in LUIS. The second area is [quota limits](#key-limits) based on key type. A third area of boundaries is the [keyboard combination](#keyboard-controls) for controlling the LUIS website. A fourth area is the [world region mapping](luis-reference-regions.md) between the LUIS authoring website and the LUIS [endpoint](luis-glossary.md#endpoint) APIs. 


## Model boundaries

|Area|Limit|
|--|:--|--|
| [App name][luis-get-started-create-app] | 50 characters |
| [Batch testing][batch-testing]| 10 datasets, 1000 utterances per dataset|
| [Composite entities](./luis-concept-entity-types.md) | Parent: 30, child: 10|
| [Hierarchical](./luis-concept-entity-types.md)|Parent: 30, child: 10|
| [Intents][intents]|500|
| [List entities](./luis-concept-entity-types.md) | Parent: 50, child: 20,000 items | 
| Total machine-learned entities:<br> simple, composite parent(s) and hierarchical parent(s) | 100, or 30 parent entities with 10   children each|
| [Phrase list][phrase-list]|10 phrase lists, 5,000 items per list|
| [Prebuilt entities](./Pre-builtEntities.md) | no limit|
| [Regular expression entities](./luis-concept-entity-types.md)|20 entities<br>500 character max. per regular expression entity pattern|
| [Pattern.any](./luis-concept-entity-types.md)|3 pattern.any entities per pattern |
| [Simple](./luis-concept-entity-types.md)| 30|
| [Utterance][utterances] | 500 characters|
| [Utterances][utterances] | 15,000|
| [Version name][luis-how-to-manage-versions] | 10 characters restricted to alphanum and period (.) |

## Intent and entity naming
Do not use the following characters in intent and entity names:

|Character|Name|
|--|--|
|`{`|Left curly bracket|
|`}`|Right curly bracket|
|`[`|Left bracket|
|`]`|Right bracket|
|`\`|Backslash|

## Key limits
The authoring key has different limits for authoring and endpoint. The LUIS service subscription key is only valid for endpoint queries.

|Key|Authoring|Endpoint|Purpose|
|--|--|--|--|
|Authoring/Starter|1 million/month, 5/second|1 thousand/month, 5/second|Authoring your LUIS app|
|[Subscription][pricing] - F0 - Free tier |invalid|10 thousand/month, 5/second|Querying your LUIS endpoint|
|[Subscription][pricing] - S0 - Basic tier|invalid|50/second|Querying your LUIS endpoint|

## Keyboard controls

|Keyboard input | Description | 
|--|--|
|Control+E|switches between tokens and entities on utterances list|

## Website sign in time period

Your sign in access is for **60 minutes**. After this time period, you will get this error. You need to login again.

[luis-get-started-create-app]:luis-get-started-create-app.md
[batch-testing]:luis-concept-test.md#batch-testing
[intents]:luis-concept-intent.md
[phrase-list]:luis-concept-feature.md
[utterances]:luis-concept-utterance.md
[luis-how-to-manage-versions]:luis-how-to-manage-versions.md
[pricing]:https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/
