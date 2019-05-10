---
title: Best practices
titleSuffix: Language Understanding - Azure Cognitive Services
description: Learn the LUIS best practices to get the best results from your LUIS app's model.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 02/26/2019
ms.author: diberry
---
# Best practices for building a language understanding app with Cognitive Services
Use the app authoring process to build your LUIS app. 

* Build language model
* Add a few training example utterances (10-15 per intent)
* Publish 
* Test from endpoint 
* Add features

Once your app is [published](luis-how-to-publish-app.md), use the authoring cycle of add features, publish, and test from endpoint. Do not begin the next authoring cycle by adding more example utterances. That does not let LUIS learn your model with real-world user utterances. 

In order for LUIS to be efficient at its job of learning, do not expand the utterances until the current set of both example and endpoint utterances are returning confident, high prediction scores. Improve scores using [active learning](luis-concept-review-endpoint-utterances.md), [patterns](luis-concept-patterns.md), and [phrase lists](luis-concept-feature.md). 

## Do and Don't
The following list includes best practices for LUIS apps:

|Do|Don't|
|--|--|
|[Define distinct intents](#do-define-distinct-intents) |[Add many example utterances to intents](#dont-add-many-example-utterances-to-intents) |
|[Find a sweet spot between too generic and too specific for each intent](#do-find-sweet-spot-for-intents)|[Use LUIS as a training platform](#dont-use-luis-as-a-training-platform)|
|[Build your app iteratively](#do-build-the-app-iteratively)|[Add many example utterances of the same format, ignoring other formats](#dont-add-many-example-utterances-of-the-same-format-ignoring-other-formats)|
|[Add phrase lists and patterns in later iterations](#do-add-phrase-lists-and-patterns-in-later-iterations)|[Mix the definition of intents and entities](#dont-mix-the-definition-of-intents-and-entities)|
|[Balance your utterances across all intents](#balance-your-utterances-across-all-intents) except the None intent.<br>[Add example utterances to None intent](#do-add-example-utterances-to-none-intent)|[Create phrase lists with all possible values](#dont-create-phrase-lists-with-all-the-possible-values)|
|[Leverage the suggest feature for active learning](#do-leverage-the-suggest-feature-for-active-learning)|[Add too many patterns](#dont-add-many-patterns)|
|[Monitor the performance of your app](#do-monitor-the-performance-of-your-app)|[Train and publish with every single example utterance added](#dont-train-and-publish-with-every-single-example-utterance)|
|[Use versions for each app iteration](#do-use-versions-for-each-app-iteration)||

## Do define distinct intents
Make sure the vocabulary for each intent is just for that intent and not overlapping with a different intent. For example, if you want to have an app that handles travel arrangements such as airline flights and hotels, you can choose to have these subject areas as separate intents or the same intent with entities for specific data inside the utterance.

If the vocabulary between two intents is the same, combine the intent, and use entities. 

Consider the following example utterances:

|Example utterances|
|--|
|Book a flight|
|Book a hotel|

"Book a flight" and "Book a hotel" use the same vocabulary of "book a ". This format is the same so it should be the same intent with the different words of flight and hotel as extracted entities. 

For more information:
* Concept: [Concepts about intents in your LUIS app](luis-concept-intent.md)
* Tutorial: [Build LUIS app to determine user intentions](luis-quickstart-intents-only.md)
* How to: [Add intents to determine user intention of utterances](luis-how-to-add-intents.md)


## Do find sweet spot for intents
Use prediction data from LUIS to determine if your intents are overlapping. Overlapping intents confuse LUIS. The result is that the top scoring intent is too close to another intent. Because LUIS does not use the exact same path through the data for training each time, an overlapping intent has a chance of being first or second in training. You want the utterance's score for each intention to be farther apart so this flip/flop doesn't happen. Good distinction for intents should result in the expected top intent every time. 
 
## Do build the app iteratively
Keep a separate set of utterances that isn't used as [example utterances](luis-concept-utterance.md) or endpoint utterances. Keep improving the app for your test set. Adapt the test set to reflect real user utterances. Use this test set to evaluate each iteration or version of the app. 

Developers should have three sets of data. The first is the example utterances for building the model. The second is for testing the model at the endpoint. The third is the blind test data used in [batch testing](luis-how-to-batch-test.md). This last set isn't used in training the application nor sent on the endpoint.  

For more information:
* Concept: [Authoring cycle for your LUIS app](luis-concept-app-iteration.md)

## Do add phrase lists and patterns in later iterations

A best practice is to not apply these practices before your app has been tested. You should understand how the app behaves before adding phrase lists and patterns because these features are weighted more heavily than example utterances and will skew confidence. 

Once you understand how your app behaves without these, add each of these features as they apply to your app. You do not need to add these features with each [iteration](luis-concept-app-iteration.md) or change the features with each version. 

There is no harm adding them in the beginning of your model design but it is easier to see how each feature changes results after the model is tested with utterances. 

A best practice is to test via the [endpoint](luis-get-started-create-app.md#query-the-endpoint-with-a-different-utterance) so that you get the added benefit of [active learning](luis-concept-review-endpoint-utterances.md). The [interactive testing pane](luis-interactive-test.md) is also a valid test methodology. 
 

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

## Balance your utterances across all intents

In order for LUIS predictions to be accurate, the quantity of example utterances in each intent (except for the None intent), must be relatively equal. 

If you have an intent with 100 example utterances and an intent with 20 example utterances, the 100-utterance intent will have a higher rate of prediction.  

## Do add example utterances to None intent

This intent is the fallback intent, indicated everything outside your application. Add one example utterance to the None intent for every 10 example utterances in the rest of your LUIS app.

For more information:
* Concept: [Understand what good utterances are for your LUIS app](luis-concept-utterance.md)

## Do leverage the suggest feature for active learning

Use [active learning](luis-how-to-review-endpoint-utterances.md)'s **Review endpoint utterances** on a regular basis, instead of adding more example utterances to intents. Because the app is constantly receiving endpoint utterances, this list is growing and changing.

For more information:
* Concept: [Concepts for enabling active learning by reviewing endpoint utterances](luis-concept-review-endpoint-utterances.md)
* Tutorial: [Tutorial: Fix unsure predictions by reviewing endpoint utterances](luis-tutorial-review-endpoint-utterances.md)
* How-to: [How to review endpoint utterances in LUIS portal](luis-how-to-review-endpoint-utterances.md)

## Do monitor the performance of your app

Monitor the prediction accuracy using a [batch test](luis-concept-batch-test.md) set. 

## Don't add many example utterances to intents

After the app is published, only add utterances from active learning in the iterative process. If utterances are too similar, add a pattern. 

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

For a chatbot that will book airline flights, create a **BookFlight** intent. Do not create an intent for every airline or every destination. Use those pieces of data as [entities](luis-concept-entity-types.md) and mark them in the example utterances. 

## Don't create phrase lists with all the possible values

Provide a few examples in the [phrase lists](luis-concept-feature.md) but not every word. LUIS generalizes and takes context into account. 

## Don't add many patterns

Don't add too many [patterns](luis-concept-patterns.md). LUIS is meant to learn quickly with fewer examples. Don't overload the system unnecessarily.

## Don't train and publish with every single example utterance

Add 10 or 15 utterances before training and publishing. That allows you to see the impact on prediction accuracy. Adding a single utterance may not have a visible impact on the score. 

## Do use versions for each app iteration

Each authoring cycle should be within a new [version](luis-concept-version.md), cloned from an existing version. LUIS has no limit for versions. A version name is used as part of the API route so it is important to pick characters allowed in a URL as well as keeping within the 10 character count for a version. Develop a version name strategy to keep your versions organized. 

For more information:
* Concept: [Understand how and when to use a LUIS version](luis-concept-version.md)
* How-to: [Use versions to edit and test without impacting staging or production apps](luis-how-to-manage-versions.md)


## Next steps

* Learn how to [plan your app](luis-how-plan-your-app.md) in your LUIS app.
