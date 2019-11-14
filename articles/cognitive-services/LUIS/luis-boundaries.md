---
title: Limits - LUIS
titleSuffix: Azure Cognitive Services
description: This article contains the known limits of Azure Cognitive Services Language Understanding (LUIS). LUIS has several boundary areas. Model boundary controls intents, entities, and features in LUIS. Quota limits based on key type. Keyboard combination controls the LUIS website. 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: diberry
ms.custom: seodec18 
---
# Boundaries for your LUIS model and keys
LUIS has several boundary areas. The first is the [model boundary](#model-boundaries), which controls intents, entities, and features in LUIS. The second area is [quota limits](#key-limits) based on key type. A third area of boundaries is the [keyboard combination](#keyboard-controls) for controlling the LUIS website. A fourth area is the [world region mapping](luis-reference-regions.md) between the LUIS authoring website and the LUIS [endpoint](luis-glossary.md#endpoint) APIs. 


## Model boundaries

If your app exceeds the LUIS model limits and boundaries, consider using a [LUIS dispatch](luis-concept-enterprise.md#dispatch-tool-and-model) app or using a [LUIS container](luis-container-howto.md). 

|Area|Limit|
|--|:--|
| [App name][luis-get-started-create-app] | *Default character max |
| Applications| 500 applications per Azure authoring resource |
| [Batch testing][batch-testing]| 10 datasets, 1000 utterances per dataset|
| Explicit list | 50 per application|
| External entities | no limits |
| [Intents][intents]|500 per application: 499 custom intents, and the required _None_ intent.<br>[Dispatch-based](https://aka.ms/dispatch-tool) application has corresponding 500 dispatch sources.|
| [List entities](./luis-concept-entity-types.md) | Parent: 50, child: 20,000 items. Canonical name is *default character max. Synonym values have no length restriction. |
| [Machine-learned entities + roles](./luis-concept-entity-types.md):<br> composite,<br>simple,<br>entity role|A limit of either 100 parent entities or 330 entities, whichever limit the user hits first. A role counts as an entity for the purpose of this boundary. An example is a composite with a simple entity, which has 2 roles is: 1 composite + 1 simple + 2 roles = 4 of the 330 entities.|
|Model as a feature| Maximum number of models that can be used as a descriptor (feature) to a specific model to be 10 models. The maximum number of phrase lists used as a descriptor (feature) for a specific model to be 10 phrase lists.|
| [Preview - Dynamic list entities](https://aka.ms/luis-api-v3-doc#dynamic-lists-passed-in-at-prediction-time)|2 lists of ~1k per query prediction endpoint request|
| [Patterns](luis-concept-patterns.md)|500 patterns per application.<br>Maximum length of pattern is 400 characters.<br>3 Pattern.any entities per pattern<br>Maximum of 2 nested optional texts in pattern|
| [Pattern.any](./luis-concept-entity-types.md)|100 per application, 3 pattern.any entities per pattern |
| [Phrase list][phrase-list]|500 phrase lists. Non-interchangeable phraselist has max of 5,000 phrases. Interchangeable Phraselist has max of 50,000 phrases. Maximum number of total phrases per application  of 500,000 phrases.|
| [Prebuilt entities](./luis-prebuilt-entities.md) | no limit|
| [Regular expression entities](./luis-concept-entity-types.md)|20 entities<br>500 character max. per regular expression entity pattern|
| [Roles](luis-concept-roles.md)|300 roles per application. 10 roles per entity|
| [Utterance][utterances] | 500 characters|
| [Utterances][utterances] | 15,000 per application - there is no limit on the number of utterances per intent|
| [Versions](luis-concept-version.md)| 100 versions per application |
| [Version name][luis-how-to-manage-versions] | 10 characters restricted to alphanumeric and period (.) |

*Default character max is 50 characters. 

<a name="intent-and-entity-naming"></a>

## Name uniqueness

Use the following naming uniqueness rules.

The following must be unique within a LUIS app:

* version name
* intent
* entity
* roles

The following must be unique within the scope applied:

* phrase list 

## Object naming

Do not use the following characters in the following names.

|Object|Exclude characters|
|--|--|
|Intent, entity, and role names|`:`<br>`$`|
|Version name|`\`<br> `/`<br> `:`<br> `?`<br> `&`<br> `=`<br> `*`<br> `+`<br> `(`<br> `)`<br> `%`<br> `@`<br> `$`<br> `~`<br> `!`<br> `#`|

## Key usage

Language Understand has separate keys, one type for authoring, and one type for querying the prediction endpoint. To learn more about the differences between key types, see [Authoring and query prediction endpoint keys in LUIS](luis-concept-keys.md).

<a name="key-limits"></a>

## Resource key limits

The resource keys have different limits for authoring and endpoint. The LUIS prediction query endpoint key is only valid for endpoint queries. 

* 500 applications per Azure authoring resource 

|Key|Authoring|Endpoint|Purpose|
|--|--|--|--|
|Starter|1 million/month, 5/second|1 thousand/month, 5/second|Authoring your LUIS app|
|F0 - Free tier |1 million/month, 5/second|10 thousand/month, 5/second|Querying your LUIS endpoint|
|S0 - Basic tier|-|50/second|Querying your LUIS endpoint|
|S0 - Standard tier|-|50/second|Querying your LUIS endpoint|
|[Sentiment analysis integration](luis-how-to-publish-app.md#enable-sentiment-analysis)|-|-|Adding sentiment information including key phrase data extraction is provided without requiring another Azure resource. |
|[Speech integration](../speech-service/how-to-recognize-intents-from-speech-csharp.md)|-|1 thousand endpoint requests per unit cost|Convert spoken utterance to text utterance and return LUIS results|

[Learn more about pricing.][pricing]

## Keyboard controls

|Keyboard input | Description | 
|--|--|
|Control+E|switches between tokens and entities on utterances list|

## Website sign-in time period

Your sign-in access is for **60 minutes**. After this time period, you will get this error. You need to sign in again.

[luis-get-started-create-app]: https://docs.microsoft.com/azure/cognitive-services/luis/luis-get-started-create-app
[batch-testing]: https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-test#batch-testing
[intents]: https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-intent
[phrase-list]: https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-feature
[utterances]: https://docs.microsoft.com/azure/cognitive-services/luis/luis-concept-utterance
[luis-how-to-manage-versions]: https://docs.microsoft.com/azure/cognitive-services/luis/luis-how-to-manage-versions
[pricing]: https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/
<!-- TBD: fix this link -->
[speech-to-intent-pricing]: https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/
