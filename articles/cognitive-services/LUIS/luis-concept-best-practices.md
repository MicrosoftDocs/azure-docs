---
title: Best practices for building apps with LUIS - Language Understanding 
titleSuffix: Azure Cognitive Services
description: Learn the LUIS best practices to get the best results.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/10/2018
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

In order for LUIS to be efficient at its job of learning, do not expand the utterances until the current set of both example and endpoint utterances are returning confident, high prediction scores. Improve scores using active learning, [patterns](luis-concept-patterns.md), and [phrase lists](luis-concept-feature.md). 

## Do and Don't
The following list includes best practices for LUIS apps:

|Do|Don't|
|--|--|
|[Define distinct intents](#do-define-distinct-intents) |[Add many example utterances to intents](#dont-add-many-example-utterances-to-intents) |
|[Find a sweet spot between too generic and too specific for each intent](#do-find-sweet-spot-for-intents)|[Use LUIS as a training platform](#dont-use-luis-as-a-training-platform)|
|[Build your app iteratively](#do-build-the-app-iteratively)|[Add many example utterances of the same format, ignoring other formats](#dont-add-many-example-utterances-of-the-same-format-ignoring-other-formats)|
|[Add phrase lists and patterns in later iterations](#do-add-phrase-lists-and-patterns-in-later-iterations)|[Mix the definition of intents and entities](#dont-mix-the-definition-of-intents-and-entities)|
|[Add example utterances to None intent](#do-add-example-utterances-to-none-intent)|[Create phrase lists with all possible values](#dont-create-phrase-lists-with-all-the-possible-values)|
|[Leverage the suggest feature for active learning](#do-leverage-the-suggest-feature-for-active-learning)|[Add so many patterns](#dont-add-many-patterns)|
|[Monitor the performance of your app](#do-monitor-the-performance-of-your-app)|[Train and publish with every single example utterance added](#dont-train-and-publish-with-every-single-example-utterance)|

## Do define distinct intents
Make sure the vocabulary for each intent is just for that intent and not overlapping with a different intent. For example, if you want to have an app that handle travel arrangements such as airline flights and hotels, you can choose to have these as separate intents or the same intent with entities for specific data inside the utterance.

If the vocabulary between two intents is the same, combine the intent, and use entities. 

Consider the following example utterances:

```
Book a flight
Book a hotel
```

"Book a flight" and "Book a hotel" use the same vocabulary of "book a ". This is overlapping so it should be the same intent with the different words of flight and hotel extracted entities. 

## Do find sweet spot for intents
Use prediction data from LUIS to determine if your intents are overlapping. Overlapping intents confuses LUIS. The result is that the top scoring intent is too close to another intent. Because LUIS does not use the exact same path through the data for training each time, an overlapping intent has a chance of being first or second in training. You want the utterance's score for each intention to be farther apart so this doesn't happen. Good distinction for intents should result in the expected top intent every time. 
 
## Do build the app iteratively
Keep a separate *blind* test set that is not used as [example utterances](luis-concept-utterance.md) or endpoint utterances. Keep improving the app for your test set. Adapt the test set to reflect real user utterances. Use this blind test set to evaluate each iteration. 

Developers should have three sets of data. The first is the example utterances for building the model. The second is for testing the model at the endpoint. The third is the blind test data used in [batch testing](luis-how-to-batch-test.md). This last set is not used in training the application nor sent on the endpoint.  

## Do add phrase lists and patterns in later iterations
[Phrase lists](luis-concept-feature.md) allow you to define dictionaries of words related to your app domain. Seed your phrase list with a few words then use the suggest feature so LUIS knows about more words in the vocabulary. Don't add every word to the vocabulary since the phrase list isn't an exact match. 

Real user utterances from the endpoint, very similar to each other, may reveal patterns of word choice and placement. The [pattern](luis-concept-patterns.md) feature takes this word choice and placement along with regular expressions to improve your prediction accuracy. A regular expression in the pattern allows for words and punctuation you intend to ignore while still matching the pattern. 

Use pattern's optional syntax for punctuation so punctuation can be ignored.

Do not apply these practices before your app has received endpoint requests because that skews the confidence.  

## Do add example utterances to None intent
This is the fallback intent, indicated everything outside your application. Add one example utterance to the None intent for every 10 example utterances in the rest of your LUIS app.

## Do leverage the suggest feature for active learning
Use [active learning](luis-how-to-review-endoint-utt.md)'s **Review endpoint utterances** on a regular basis, instead of adding more example utterances to intents. Because the app is constantly receiving endpoint utterances, this list is growing and changing.

## Do monitor the performance of your app
Monitor the prediction accuracy using a test set. 

## Don't add many example utterances to intents
After the app is published, only add utterances from active learning in the iterative process. If utterances are too similar, add a pattern. 

## Don't use LUIS as a training platform
LUIS is specific to a language model's domain. It is not meant to work as a general training platform. 

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

## Next steps

* Learn how to [plan your app](luis-how-plan-your-app.md) in your LUIS app.