---
title: Language Understanding (LUIS) boundaries | Microsoft Docs
titleSuffix: Azure
description: This article contains known limits of LUIS.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal
ms.service: cognitive-services
ms.component: language-understanding
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
| **[Composite](./luis-concept-entity-types.md)|100 with up to 10 children |
| Explicit list | 50 per application|
| **[Hierarchical](./luis-concept-entity-types.md) |100 with up to 10 children |
| [Intents][intents]|500 per application|
| [List entities](./luis-concept-entity-types.md) | Parent: 50, child: 20,000 items || [Patterns](luis-concept-patterns.md)|500 patterns per application.<br>Maximum length of pattern is 400 characters.<br>3 Pattern.any entities per pattern<br>Maximum of 2 nested optional texts in pattern|
| [Pattern.any](./luis-concept-entity-types.md)|100 per application, 3 pattern.any entities per pattern |
| [Phrase list][phrase-list]|10 phrase lists, 5,000 items per list|
| [Prebuilt entities](./Pre-builtEntities.md) | no limit|
| [Regular expression entities](./luis-concept-entity-types.md)|20 entities<br>500 character max. per regular expression entity pattern|
| [Roles](luis-concept-roles.md)|300 roles per application. 10 roles per entity|
| **[Simple](./luis-concept-entity-types.md)| 100 entities|
| [Utterance][utterances] | 500 characters|
| [Utterances][utterances] | 15,000 per application|
| [Version name][luis-how-to-manage-versions] | 10 characters restricted to alphanum and period (.) |

**The total count of simple, hierarchical, and composite entities can't exceed 100. The total count of hierarchical entities, composite entities, simple entities, and hierarchical children entities can't exceed 330. 

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
|[Sentiment analysis integration](publishapp.md#enable-sentiment-analysis)|invalid|no charge|Adding sentiment information including key phrase data extraction |
|Speech integration|invalid|$5.50 USD/1 thousand endpoint requests|Convert spoken utterance to text utterance and return LUIS results|

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
<!-- TBD: fix this link -->
[speech-to-intent-pricing]:https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/
