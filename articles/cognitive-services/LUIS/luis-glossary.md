---
title: Glossary for the Language Understanding (LUIS) API Service | Microsoft Docs
description: The glossary explains terms that you might encounter as you work with the LUIS API Service.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/05/2018
ms.author: v-geberr
---

# Glossary

## <a name="active-version"></a>Active version

The active LUIS version is the version that receives any changes to the model. In the [LUIS](luis-reference-regions.md) website, if you want to make changes to a version that is not the active version, you need to first set that version as active. 

## <a name="authoring"></a>Authoring

Authoring is the ability to create, manage and deploy a [LUIS app](#luis-app), either using the [LUIS](luis-reference-regions.md) website or the [authoring APIs](https://aka.ms/luis-authoring-api). 

## <a name="authoring-key"></a>Authoring Key

Used to author the app. Not used for production-level endpoint queries. Refer to [Key limits](luis-boundaries.md#key-limits) for more information.  Previously named "Programmatic" key. 

## <a name="batch-test-json-file"></a>Batch text JSON file

The batch file is a JSON array. Each element in the array has 3 properties: `text`, `intent`, and `entities`. The `entities` property is an array. The array can be empty. If the `entities` array is not empty, it needs to accurately identify the entities.

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

In the LUIS context, a **domain** is an area of knowledge. Your domain would be specific to your app area of knowledge. This can be a general area such as the travel agent app. A travel agent app can also be specific to just the areas of information for your company such as specific locations, languages, and services. 

## <a name="endpoint"></a>Endpoint

The [LUIS endpoint](https://aka.ms/luis-endpoint-apis) URL is where you submit LUIS queries after the [LUIS app](#luis-app) is authored and deployed. The endpoint URL contains the region of the published app as well as the app ID. You can find the endpoint on the **[Publish](publishapp.md)** page of your app, in the Resources and Keys table or you can get the endpoint URL from the [Get App Info](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c37) API.

An example endpoint looks like:

`https://<region>.api.cognitive.microsoft.com/luis/v2.0/apps/<appID>?subscription-key=<subscriptionID>&verbose=true&timezoneOffset=0&q=<utterance>`

|Querystring parameter|description|
|--|--|
|region| [published region](luis-reference-regions.md#publishing-regions) |
|appID | LUIS app ID |
|subscriptionID | LUIS subscription key created in Azure portal |
|q | utterance |

## <a name="entity"></a>Entity

[Entities](luis-concept-entity-types.md) are important words in [utterances](luis-concept-utterance.md) that describe information relevant to the [intent](luis-concept-intent.md), and sometimes they are essential to it. An entity is essentially a datatype in LUIS. 

## <a name="f-measure"></a>F-measure

In [batch texting][batch-testing], a measure of the test's accuracy.

## <a name="false-negative"></a>False negative (TN)

In [batch texting][batch-testing], the data points represent utterances in which your app incorrectly predicted the absence of the target intent/entity.

## <a name="false-positive"></a>False positive (TP)

In [batch texting][batch-testing], the data points represent utterances in which your app incorrectly predicted the existence of the target intent/entity..

## <a name="features"></a>Features

In machine learning, a [feature](luis-concept-feature.md) is a distinguishing trait or attribute of data that your system observes.

## <a name="intent"></a>Intent

An [intent](luis-concept-intent.md) represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article.  

## <a name="labeling"></a>Labeling

Labeling is the process of associating a word or phrase in an intent's [utterance](#utterance) with an [entity](#entity) (datatype). 

## <a name="luis-app"></a>LUIS app

A LUIS app is a trained data model for natural language processing including [intents](#intent), [entities](#entity), and labeled [utterances](#utterance).

## <a name="owner"></a>Owner

Each app has one owner who is the person that created the app. The owner can add [collaborators](#collaborator).

## <a name="phrase-list"></a>Phrase list

A [phrase list](luis-concept-feature.md#what-is-a-phrase-list-feature) includes a group of values (words or phrases) that belong to the same class and must be treated similarly (for example, names of cities or products). An interchangeable list is treated as synonyms. 

## <a name="prebuilt-domains"></a>Prebuilt domain

A [prebuilt domain](luis-how-to-use-prebuilt-domains.md) is a LUIS app configured for a specific domain such as home automation (HomeAutomation) or restaurant reservations (RestaurantReservation). The intents, utterances, and entities are configured for this domain. 

## <a name="prebuilt-entity"></a>Prebuilt entity

A [prebuilt entity](pre-builtentities.md) is an entity LUIS provides for common types of information. You can choose to add a prebuilt entity to your application. 

## <a name="precision"></a>Precision
In [batch texting][batch-testing], precision (also called positive predictive value) is the fraction of relevant utterances among the retrieved utterances.

## <a name="programmatic-key"></a>Programmatic key

Renamed to [authoring key](#authoring-key). 

## <a name="publish"></a>Publish

Publishing means making a LUIS [active version](#active-version) available on either the staging or production [endpoint](#endpoint).  

## <a name="quota"></a>Quota

LUIS quota is the limitation of the [Azure subscription tier](https://aka.ms/luis-price-tier). The LUIS quota is limited by both requests per second (HTTP Status 429) and total requests in a month (HTTP Status 403). 

## <a name="recall"></a>Recall
In [batch texting][batch-testing], recall (also known as sensitivity), is the ability for LUIS to generalize. 

## <a name="starter-key"></a>Starter key

Same as [programmatic key](#programmatic-key).

## <a name="subscription-key"></a>Subscription key

The subscription key is the key associated with the LUIS service [you created in Azure](azureibizasubscription.md). This key is not the [authoring key](#programmatic-key). If you have a subscription key, it should be used for any endpoint requests instead of the authoring key. You can see your current subscription key inside the endpoint URL at the bottom of [**Publish App** page](publishapp.md) in [LUIS](luis-reference-regions.md) website. It is the value of **subscription-key** name/value pair. 

## <a name="test"></a>Test

[Testing](train-test.md#test-your-app) a LUIS app means passing an utterance to LUIS and viewing the JSON results.

## <a name="timezoneoffset"></a>Timezone offset

The endpoint includes timezoneOffset. This is the number in minutes you want to add or remove from the datetimeV2 prebuilt entity. For example, if the utterance is "what time is it now?", the datetimeV2 returned will be the current time for the client request. If your client request is coming from a bot or other application that is not the same as your bot's user, you should pass in the offset between the bot and the user. 

|timezoneOffset value| in minutes |
|:--|--|
|-120|subtract 2 hours|
|30|add 30 minutes|

## <a name="train"></a>Train

Training is the process of teaching LUIS about any changes to the [active version](#active-version) since the last training.

## <a name="true-negative"></a>True negative (TN)

In [batch texting][batch-testing], the data points represent utterances in which your app correctly predicted the absence of the target intent/entity.

## <a name="true-positive"></a>True positive (TP)

In [batch texting][batch-testing], the data points represent utterances in which your app correctly predicted the existence of the target intent/entity.

## <a name="utterance"></a>Utterance

An utterance is a natural language phrase such as "book 2 tickets to Seattle next Tuesday".

## <a name="version"></a>Version

A LUIS [version](luis-how-to-manage-versions.md) is a specific data model associated with a LUIS app ID. Every LUIS app has at least one version.

[batch-testing]: train-test.md#batch-testing
