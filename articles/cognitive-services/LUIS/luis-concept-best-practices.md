---
title: Best practices - LUIS
titleSuffix: Azure Cognitive Services
description: Learn the LUIS best practices to get the best results from your LUIS app's model.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 10/25/2019
ms.author: diberry
---
# Best practices for building a language understanding app with Cognitive Services
Use the app authoring process to build your LUIS app: 

* Build language models (intents and entities)
* Add a few training example utterances (15-30 per intent)
* Publish to endpoint
* Test from endpoint 

Once your app is [published](luis-how-to-publish-app.md), use the development lifecycle to add features, publish, and test from endpoint. Do not begin the next authoring cycle by adding more example utterances because that does not let LUIS learn your model with real-world user utterances. 

Do not expand the utterances until the current set of both example and endpoint utterances are returning confident, high prediction scores. Improve scores using [active learning](luis-concept-review-endpoint-utterances.md). 




## Do and Don't
The following list includes best practices for LUIS apps:

|Do|Don't|
|--|--|
|[Define distinct intents](#do-define-distinct-intents)<br>[Add descriptors to intents](#do-add-descriptors-to-intents) |[Add many example utterances to intents](#dont-add-many-example-utterances-to-intents)<br>[Use few or simple entities](#dont-use-few-or-simple-entities) |
|[Find a sweet spot between too generic and too specific for each intent](#do-find-sweet-spot-for-intents)|[Use LUIS as a training platform](#dont-use-luis-as-a-training-platform)|
|[Build your app iteratively with versions](#do-build-your-app-iteratively-with-versions)<br>[Build entities for model decomposition](#do-build-for-model-decomposition)|[Add many example utterances of the same format, ignoring other formats](#dont-add-many-example-utterances-of-the-same-format-ignoring-other-formats)|
|[Add patterns in later iterations](#do-add-patterns-in-later-iterations)|[Mix the definition of intents and entities](#dont-mix-the-definition-of-intents-and-entities)|
|[Balance your utterances across all intents](#balance-your-utterances-across-all-intents) except the None intent.<br>[Add example utterances to None intent](#do-add-example-utterances-to-none-intent)|[Create descriptors with all possible values](#dont-create-descriptors-with-all-the-possible-values)|
|[Leverage the suggest feature for active learning](#do-leverage-the-suggest-feature-for-active-learning)|[Add too many patterns](#dont-add-many-patterns)|
|[Monitor the performance of your app with batch testing](#do-monitor-the-performance-of-your-app)|[Train and publish with every single example utterance added](#dont-train-and-publish-with-every-single-example-utterance)|

## Do define distinct intents
Make sure the vocabulary for each intent is just for that intent and not overlapping with a different intent. For example, if you want to have an app that handles travel arrangements such as airline flights and hotels, you can choose to have these subject areas as separate intents or the same intent with entities for specific data inside the utterance.

If the vocabulary between two intents is the same, combine the intent, and use entities. 

Consider the following example utterances:

|Example utterances|
|--|
|Book a flight|
|Book a hotel|

`Book a flight` and `Book a hotel` use the same vocabulary of `book a `. This format is the same so it should be the same intent with the different words of `flight` and `hotel` as extracted entities. 

## Do add descriptors to intents

Descriptors help describe features for an intent. A descriptor can be a phrase list of words that are significant to that intent or an entity that is significant to that intent. 

## Do find sweet spot for intents
Use prediction data from LUIS to determine if your intents are overlapping. Overlapping intents confuse LUIS. The result is that the top scoring intent is too close to another intent. Because LUIS does not use the exact same path through the data for training each time, an overlapping intent has a chance of being first or second in training. You want the utterance's score for each intention to be farther apart so this flip/flop doesn't happen. Good distinction for intents should result in the expected top intent every time. 
 
<a name="#do-build-the-app-iteratively"></a>

## Do build your app iteratively with versions

Each authoring cycle should be within a new [version](luis-concept-version.md), cloned from an existing version. 

## Do build for model decomposition

Model decomposition has a typical process of:

* create **Intent** based on client-app's user intentions
* add 15-30 example utterances based on real-world user input
* label top-level data concept in example utterance
* break data concept into subcomponents
* add descriptors (features) to subcomponents
* add descriptors (features) to intent 

Once you have create the intent and added example utterances, the following example describes entity decomposition. 

Start by identifying complete data concepts you want to extract in an utterance. This is your machine-learned entity. Then decompose the phrase into its parts. This includes identifying subcomponents (as entities), along with descriptors and constraints. 

For example if you want to extract an address, the top machine-learned entity could be called `Address`. While creating the address, identify some of its subcomponents such as street address, city, state, and postal code. 

Continue decomposing those elements by **constraining** the postal code to a regular expression. Decompose the street address into parts of a street number (using a prebuilt number), a street name, and a street type. The street type can be described with a **descriptor** list such as avenue, circle, road, and lane.

The V3 authoring API allows for model decomposition. 

## Do add patterns in later iterations

You should understand how the app behaves before adding [patterns](luis-concept-patterns.md) because patterns are weighted more heavily than example utterances and will skew confidence. 

Once you understand how your app behaves, add patterns as they apply to your app. You do not need to add them with each [iteration](luis-concept-app-iteration.md). 

There is no harm adding them in the beginning of your model design but it is easier to see how each pattern changes the model after the model is tested with utterances. 
 
<!--

### Phrase lists

[Phrase lists](luis-concept-feature.md) allow you to define dictionaries of words related to your app domain. Seed your phrase list with a few words then use the suggest feature so LUIS knows about more words in the vocabulary specific to your app. A Phrase List improves intent detection and entity classification by boosting the signal associated with words or phrases that are significant to your app. 

Don't add every word to the vocabulary since the phrase list isn't an exact match. 

For more information:
* Concept: [Phrase list features in your LUIS app](luis-concept-feature.md)
* How-to: [Use phrase lists to boost signal of word list](luis-how-to-add-features.md)



### Patterns

Real user utterances from the endpoint, very similar to each other, may reveal patterns of word choice and placement. The [pattern](luis-concept-patterns.md) feature takes this word choice and placement along with regular expressions to improve your prediction accuracy. A regular expression in the pattern allows for words and punctuation you intend to ignore while still matching the pattern. 

Use pattern's [optional syntax](luis-concept-patterns.md) for punctuation so punctuation can be ignored. Use the [explicit list](luis-concept-patterns.md#explicit-lists) to compensate for pattern.any syntax issues. 

For more information:
* Concept: [Patterns improve prediction accuracy](luis-concept-patterns.md)
* How-to: [How to add Patterns to improve prediction accuracy](luis-how-to-model-intent-pattern.md)
-->

<a name="balance-your-utterances-across-all-intents"></a>

## Do balance your utterances across all intents

In order for LUIS predictions to be accurate, the quantity of example utterances in each intent (except for the None intent), must be relatively equal. 

If you have an intent with 100 example utterances and an intent with 20 example utterances, the 100-utterance intent will have a higher rate of prediction.  

## Do add example utterances to None intent

This intent is the fallback intent, indicating everything outside your application. Add one example utterance to the None intent for every 10 example utterances in the rest of your LUIS app.

## Do leverage the suggest feature for active learning

Use [active learning](luis-how-to-review-endpoint-utterances.md)'s **Review endpoint utterances** on a regular basis, instead of adding more example utterances to intents. Because the app is constantly receiving endpoint utterances, this list is growing and changing.

## Do monitor the performance of your app

Monitor the prediction accuracy using a [batch test](luis-concept-batch-test.md) set. 

Keep a separate set of utterances that aren't used as [example utterances](luis-concept-utterance.md) or endpoint utterances. Keep improving the app for your test set. Adapt the test set to reflect real user utterances. Use this test set to evaluate each iteration or version of the app. 

## Don't add many example utterances to intents

After the app is published, only add utterances from active learning in the development lifecycle process. If utterances are too similar, add a pattern. 

## Don't use few or simple entities

Entities are built for data extraction and prediction. It is important that each intent have machine-learned entities that describe the data in the intent. This helps LUIS predict the intent, even if your client application doesn't need to use the extracted entity. 

## Don't use LUIS as a training platform

LUIS is specific to a language model's domain. It isn't meant to work as a general natural language training platform. 

## Don't add many example utterances of the same format, ignoring other formats

LUIS expects variations in an intent's utterances. The utterances can vary while having the same overall meaning. Variations can include utterance length, word choice, and word placement. 

|Don't use same format|Do use varying format|
|--|--|
|Buy a ticket to Seattle<br>Buy a ticket to Paris<br>Buy a ticket to Orlando|Buy 1 ticket to Seattle<br>Reserve two seats on the red eye to Paris next Monday<br>I would like to book 3 tickets to Orlando for spring break|

The second column uses different verbs (buy, reserve, book), different quantities (1, two, 3), and different arrangements of words but all have the same intention of purchasing airline tickets for travel. 

## Don't mix the definition of intents and entities

Create an intent for any action your bot will take. Use entities as parameters that make that action possible. 

For a bot that will book airline flights, create a **BookFlight** intent. Do not create an intent for every airline or every destination. Use those pieces of data as [entities](luis-concept-entity-types.md) and mark them in the example utterances. 

## Don't create descriptors with all the possible values

Provide a few examples in the descriptor [phrase lists](luis-concept-feature.md) but not every word. LUIS generalizes and takes context into account. 

## Don't add many patterns

Don't add too many [patterns](luis-concept-patterns.md). LUIS is meant to learn quickly with fewer examples. Don't overload the system unnecessarily.

## Don't train and publish with every single example utterance

Add 10 or 15 utterances before training and publishing. That allows you to see the impact on prediction accuracy. Adding a single utterance may not have a visible impact on the score. 

## Next steps

* Learn how to [plan your app](luis-how-plan-your-app.md) in your LUIS app.
