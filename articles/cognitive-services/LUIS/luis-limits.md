---
title: Limits - LUIS
description: This article contains the known limits of Azure Cognitive Services Language Understanding (LUIS). LUIS has several limits areas. Model limit controls intents, entities, and features in LUIS. Quota limits based on key type. Keyboard combination controls the LUIS website.
ms.topic: reference
ms.date: 06/04/2020
---
# Limits for your LUIS model and keys
LUIS has several limit areas. The first is the [model limit](#model-limits), which controls intents, entities, and features in LUIS. The second area is [quota limits](#key-limits) based on key type. A third area of limits is the [keyboard combination](#keyboard-controls) for controlling the LUIS website. A fourth area is the [world region mapping](luis-reference-regions.md) between the LUIS authoring website and the LUIS [endpoint](luis-glossary.md#endpoint) APIs.

<a name="model-boundaries"></a>

## Model limits

If your app exceeds the LUIS model limits, consider using a [LUIS dispatch](luis-concept-enterprise.md#dispatch-tool-and-model) app or using a [LUIS container](luis-container-howto.md).

|Area|Limit|
|--|:--|
| [App name][luis-get-started-create-app] | *Default character max |
| Applications| 500 applications per Azure authoring resource |
| [Batch testing][batch-testing]| 10 datasets, 1000 utterances per dataset|
| Explicit list | 50 per application|
| External entities | no limits |
| [Intents][intents]|500 per application: 499 custom intents, and the required _None_ intent.<br>[Dispatch-based](https://aka.ms/dispatch-tool) application has corresponding 500 dispatch sources.|
| [List entities](./luis-concept-entity-types.md) | Parent: 50, child: 20,000 items. Canonical name is *default character max. Synonym values have no length restriction. |
| [machine-learning entities + roles](./luis-concept-entity-types.md):<br> composite,<br>simple,<br>entity role|A limit of either 100 parent entities or 330 entities, whichever limit the user hits first. A role counts as an entity for the purpose of this limit. An example is a composite with a simple entity, which has 2 roles is: 1 composite + 1 simple + 2 roles = 4 of the 330 entities.<br>Subentities can be nested up to 5 levels.|
|Model as a feature| Maximum number of models that can be used as a feature to a specific model to be 10 models. The maximum number of phrase lists used as a feature for a specific model to be 10 phrase lists.|
| [Preview - Dynamic list entities](https://aka.ms/luis-api-v3-doc#dynamic-lists-passed-in-at-prediction-time)|2 lists of ~1k per query prediction endpoint request|
| [Patterns](luis-concept-patterns.md)|500 patterns per application.<br>Maximum length of pattern is 400 characters.<br>3 Pattern.any entities per pattern<br>Maximum of 2 nested optional texts in pattern|
| [Pattern.any](./luis-concept-entity-types.md)|100 per application, 3 pattern.any entities per pattern |
| [Phrase list][phrase-list]|500 phrase lists. 10 global phrase lists due to the model as a feature limit. Non-interchangeable phrase list has max of 5,000 phrases. Interchangeable phrase list has max of 50,000 phrases. Maximum number of total phrases per application  of 500,000 phrases.|
| [Prebuilt entities](./luis-prebuilt-entities.md) | no limit|
| [Regular expression entities](./luis-concept-entity-types.md)|20 entities<br>500 character max. per regular expression entity pattern|
| [Roles](luis-concept-roles.md)|300 roles per application. 10 roles per entity|
| [Utterance][utterances] | 500 characters<br><br>If you have text longer than this character limit, you need to segment the utterance prior to input to LUIS and merge the responses accordingly. There are obvious breaks you can work with, such as punctuation marks and long pauses in speech.|
| [Utterance examples][utterances] | 15,000 per application - there is no limit on the number of utterances per intent<br><br>If you need to train the application with more examples, use a [dispatch](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Dispatch) model approach. You train individual LUIS apps (known as child apps to the parent dispatch app) with one or more intents and then train a dispatch app that samples from each child LUIS app's utterances to direct the prediction request to the correct child app. |
| [Versions](luis-concept-version.md)| 100 versions per application |
| [Version name][luis-how-to-manage-versions] | 128 characters |

*Default character max is 50 characters.

<a name="intent-and-entity-naming"></a>

## Name uniqueness

Object names must be unique when compared to other objects of the same level.

|Objects|Restrictions|
|--|--|
|Intent, entity|All intent and entity names must be unique in a version of an app.|
|ML entity components|All machine-learning entity components (child entities) must be unique, within that entity for components at the same level.|
|Features | All named features, such as phrase lists, must be unique within a version of an app.|
|Entity roles|All roles on an entity or entity component must be unique when they are at the same entity level (parent, child, grandchild, etc.).|

## Object naming

Do not use the following characters in the following names.

|Object|Exclude characters|
|--|--|
|Intent, entity, and role names|`:`<br>`$` <br> `&`|
|Version name|`\`<br> `/`<br> `:`<br> `?`<br> `&`<br> `=`<br> `*`<br> `+`<br> `(`<br> `)`<br> `%`<br> `@`<br> `$`<br> `~`<br> `!`<br> `#`|

## Resource usage and limits

Language Understand has separate resources, one type for authoring, and one type for querying the prediction endpoint. To learn more about the differences between key types, see [Authoring and query prediction endpoint keys in LUIS](luis-concept-keys.md).

<a name="key-limits"></a>

### Authoring resource limits

Use the _kind_, `LUIS.Authoring`, when filtering resources in the Azure portal. LUIS limits 500 applications per Azure authoring resource.

|Authoring resource|Authoring TPS|
|--|--|
|Starter|1 million/month, 5/second|
|F0 - Free tier |1 million/month, 5/second|

* TPS = Transactions per second

[Learn more about pricing.][pricing]

### Query prediction resource limits

Use the _kind_, `LUIS`, when filtering resources in the Azure portal.The LUIS query prediction endpoint resource, used on the runtime, is only valid for endpoint queries.

|Query Prediction resource|Query TPS|
|--|--|
|F0 - Free tier |10 thousand/month, 5/second|
|S0 - Standard tier|50/second|

### Sentiment analysis

[Sentiment analysis integration](luis-how-to-publish-app.md#enable-sentiment-analysis), which provides sentiment information, is provided without requiring another Azure resource.

### Speech integration

[Speech integration](../speech-service/how-to-recognize-intents-from-speech-csharp.md) provides 1 thousand endpoint requests per unit cost.

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
