---
title: Glossary 
titleSuffix: Language Understanding - Azure Cognitive Services
description: The glossary explains terms that you might encounter as you work with the LUIS API Service.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 01/23/2019
ms.author: diberry
---

# Language understanding glossary of common vocabulary and concepts
The Language Understanding (LUIS) glossary explains terms that you might encounter as you work with the LUIS API Service.

## <a name="active-version"></a>Active version

The active LUIS version is the version that receives any changes to the model. In the [LUIS](luis-reference-regions.md) website, if you want to make changes to a version that is not the active version, you need to first set that version as active.

## <a name="authoring"></a>Authoring

Authoring is the ability to create, manage and deploy a [LUIS app](#luis-app), either using the [LUIS](luis-reference-regions.md) website or the [authoring APIs](https://go.microsoft.com/fwlink/?linkid=2092087).

## <a name="authoring-key"></a>Authoring Key

Previously named "Programmatic" key. Used to author the app. Not used for production-level endpoint queries. For more information, see [Key limits](luis-boundaries.md#key-limits).   

## <a name="batch-test-json-file"></a>Batch text JSON file

The batch file is a JSON array. Each element in the array has three properties: `text`, `intent`, and `entities`. The `entities` property is an array. The array can be empty. If the `entities` array is not empty, it needs to accurately identify the entities.

```JSON
[
    {
        "text": "drive me home",
        "intent": "None",
        "entities": []
    },
    {
        "text": "book a flight to orlando on the 25th",
        "intent": "BookFlight",
        "entities": [
            {
                "entity": "orlando",
                "type": "Location",
                "startIndex": 18,
                "endIndex": 25
            }
        ]
    }
]

```


## <a name="collaborator"></a>Collaborator

A collaborator is not the [owner](#owner) of the app, but has the same permissions to add, edit, and delete the intents, entities, utterances.

## <a name="currently-editing"></a>Currently editing

Same as [active version](#active-version)

## <a name="domain"></a>Domain

In the LUIS context, a **domain** is an area of knowledge. Your domain is specific to your app area of knowledge. This can be a general area such as the travel agent app. A travel agent app can also be specific to just the areas of information for your company such as specific geographical locations, languages, and services.

## <a name="endpoint"></a>Endpoint

The [LUIS endpoint](https://go.microsoft.com/fwlink/?linkid=2092356) URL is where you submit LUIS queries after the [LUIS app](#luis-app) is authored and published. The endpoint URL contains the region of the published app as well as the app ID. You can find the endpoint on the **[Keys and endpoints](luis-how-to-azure-subscription.md)** page of your app, or you can get the endpoint URL from the [Get App Info](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c37) API.

An example endpoint looks like:

`https://<region>.api.cognitive.microsoft.com/luis/v2.0/apps/<appID>?subscription-key=<subscriptionID>&verbose=true&timezoneOffset=0&q=<utterance>`

|Querystring parameter|description|
|--|--|
|region| [published region](luis-reference-regions.md#publishing-regions) |
|appID | LUIS app ID |
|subscriptionID | LUIS endpoint (subscription) key created in Azure portal |
|q | utterance |
|timezoneOffset| minutes|

## <a name="entity"></a>Entity

[Entities](luis-concept-entity-types.md) are important words in [utterances](luis-concept-utterance.md) that describe information relevant to the [intent](luis-concept-intent.md), and sometimes they are essential to it. An entity is essentially a datatype in LUIS.

## <a name="f-measure"></a>F-measure

In [batch testing](luis-interactive-test.md#batch-testing), a measure of the test's accuracy.

## <a name="false-negative"></a>False negative (TN)

In [batch testing](luis-interactive-test.md#batch-testing), the data points represent utterances in which your app incorrectly predicted the absence of the target intent/entity.

## <a name="false-positive"></a>False positive (TP)

In [batch testing](luis-interactive-test.md#batch-testing), the data points represent utterances in which your app incorrectly predicted the existence of the target intent/entity.

## <a name="features"></a>Features

In machine learning, a [feature](luis-concept-feature.md) is a distinguishing trait or attribute of data that your system observes.

## <a name="intent"></a>Intent

An [intent](luis-concept-intent.md) represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article. In LUIS, the intent prediction is based on the entire utterance. Entities, by comparison, are pieces of an utterance.

## <a name="labeling"></a>Labeling

Labeling is the process of associating a word or phrase in an intent's [utterance](#utterance) with an [entity](#entity) (datatype).

## <a name="luis-app"></a>LUIS app

A LUIS app is a trained data model for natural language processing including [intents](#intent), [entities](#entity), and labeled [utterances](#utterance).

## <a name="owner"></a>Owner

Each app has one owner who is the person that created the app. The owner can add [collaborators](#collaborator).

## <a name="pattern"></a>Patterns
The previous Pattern feature is replaced with [Patterns](luis-concept-patterns.md). Use patterns to improve prediction accuracy by providing fewer training examples.

## <a name="phrase-list"></a>Phrase list

A [phrase list](luis-concept-feature.md#what-is-a-phrase-list-feature) includes a group of values (words or phrases) that belong to the same class and must be treated similarly (for example, names of cities or products). An interchangeable list is treated as synonyms.

## <a name="prebuilt-domains"></a>Prebuilt domain

A [prebuilt domain](luis-how-to-use-prebuilt-domains.md) is a LUIS app configured for a specific domain such as home automation (HomeAutomation) or restaurant reservations (RestaurantReservation). The intents, utterances, and entities are configured for this domain.

## <a name="prebuilt-entity"></a>Prebuilt entity

A [prebuilt entity](luis-prebuilt-entities.md) is an entity LUIS provides for common types of information such as number, URL, and email. You choose to add a prebuilt entity to your application.

## <a name="precision"></a>Precision
In [batch testing](luis-interactive-test.md#batch-testing), precision (also called positive predictive value) is the fraction of relevant utterances among the retrieved utterances.

## <a name="programmatic-key"></a>Programmatic key

Renamed to [authoring key](#authoring-key).

## <a name="publish"></a>Publish

Publishing means making a LUIS [active version](#active-version) available on either the staging or production [endpoint](#endpoint).  

## <a name="quota"></a>Quota

LUIS quota is the limitation of the [Azure subscription tier](https://aka.ms/luis-price-tier). The LUIS quota can be limited by both requests per second (HTTP Status 429) and total requests in a month (HTTP Status 403).

## <a name="recall"></a>Recall
In [batch testing](luis-interactive-test.md#batch-testing), recall (also known as sensitivity), is the ability for LUIS to generalize.

## <a name="semantic-dictionary"></a>Semantic dictionary
A semantic dictionary is provided on the List entity page as well as the Phrase list page. The semantic dictionary provides suggestions of words based on the current scope.

## <a name="sentiment-analysis"></a>Sentiment Analysis
Sentiment analysis provides positive or negative values of the utterances provided by [Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/).

## <a name="speech-priming"></a>Speech priming

Speech priming allows your speech service to be primed with your LUIS model.

## <a name="spelling-correction"></a>Spelling correction

Enable Bing spell checker to correct misspelled words in the utterances before prediction.

## <a name="starter-key"></a>Starter key

Same as [programmatic key](#programmatic-key), renamed to Authoring key.

## <a name="subscription-key"></a>Subscription key

The subscription key is the **endpoint** key associated with the LUIS service [you created in Azure](luis-how-to-azure-subscription.md). This key is not the [authoring key](#programmatic-key). If you have an endpoint key, it should be used for any endpoint requests instead of the authoring key. You can see your current endpoint key inside the endpoint URL at the bottom of [**Keys and endpoints** page](luis-how-to-azure-subscription.md) in [LUIS](luis-reference-regions.md) website. It is the value of **subscription-key** name/value pair.

## <a name="test"></a>Test

[Testing](luis-interactive-test.md#test-your-app) a LUIS app means passing an utterance to LUIS and viewing the JSON results.

## <a name="timezoneoffset"></a>Timezone offset

The endpoint includes timezoneOffset. This is the number in minutes you want to add or remove from the datetimeV2 prebuilt entity. For example, if the utterance is "what time is it now?", the datetimeV2 returned is the current time for the client request. If your client request is coming from a bot or other application that is not the same as your bot's user, you should pass in the offset between the bot and the user.

See [Change time zone of prebuilt datetimeV2 entity](luis-concept-data-alteration.md?#change-time-zone-of-prebuilt-datetimev2-entity).

## <a name="token"></a>Token
A token is the smallest unit that can be labeled in an entity. Tokenization is based on the application's [culture](luis-language-support.md#tokenization).

## <a name="train"></a>Train

Training is the process of teaching LUIS about any changes to the [active version](#active-version) since the last training.

## <a name="true-negative"></a>True negative (TN)

In [batch testing](luis-interactive-test.md#batch-testing), the data points represent utterances in which your app correctly predicted the absence of the target intent/entity.

## <a name="true-positive"></a>True positive (TP)

In [batch testing](luis-interactive-test.md#batch-testing), the data points represent utterances in which your app correctly predicted the existence of the target intent/entity.

## <a name="utterance"></a>Utterance

An utterance is a natural language phrase such as "book 2 tickets to Seattle next Tuesday". Example utterances are added to the intent.

## <a name="version"></a>Version

A LUIS [version](luis-how-to-manage-versions.md) is a specific data model associated with a LUIS app ID and the published endpoint. Every LUIS app has at least one version.
