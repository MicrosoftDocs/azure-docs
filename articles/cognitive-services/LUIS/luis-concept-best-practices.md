---
title: Understand LUIS best practices - Azure | Microsoft Docs
description: Learn the LUIS best practices to get the best results.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 05/21/2018
ms.author: v-geberr;
---
# Best practices
Use the app authoring process to build your LUIS app. 

* Build language model
* Add a few training example utterances (10-15 per intent)
* Publish 
* Test from endpoint 
* Add features

Once your app is published, use the authoring cycle of add features, publish, and test from endpoint. Do not begin the next authoring cycle by adding more example utterances. That does not let LUIS learn your model with real-world user utterances. 

In order for LUIS to be efficient at its job of learning, do not expand the utterances until the current set of both example and endpoint utterances are returning confident, high prediction scores. Improve scores using active learning, patterns, and phrase lists. 

# Do and Don't
The following list includes best practices for LUIS apps:

|Do|Don't|
|--|--|
|[Define distinct intents](#do-define-distinct-intents) |[Add many example utterances to intents](#dont-add-many-example-utterances-to-intents) |
|[Find a sweet spot between too generic and too specific for each intent](#do-find-sweet-spot-for-intents)|[Use LUIS as a training platform](#dont-use-luis-as-a-training-platform)|
|[Build your app iteratively](#do-build-the-app-iteratively)|[Add many example utterances of the same format, ignoring other formats](#dont-add-many-example-utterances-of-the-same-format-ignoring-other-formats)|
|[Add phrase lists and patterns in later iterations](#do-add-phrase-lists-and-patterns-in-later-iterations)|[Mix the definition of intents and entities](#dont-mix-the-definition-of-intents-and-entities)|
|[Add example utterances to None intent](#do-add-example-utterances-to-none-intent)|[Create phrase lists with all possible values](#dont-create-phrase-lists-with-all-the-possible-values)|
|[Leverage the suggest feature for active learning](#leverage-the-suggest-feature-for-active-learning)|[Add so many patterns](#dont-add-many-patterns)|
|[Monitor the performance of your app](#do-monitor-the-performance-of-your-app)|[Train and publish with every single example utterance added](#dont-train-and-publish-with-every-single-example)|

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
Keep improving the app for your test set. Adapt the test set to reflect real user utterances. 

## Do add phrase lists and patterns in later iterations
Phrase lists allow you to define dictionaries of words related to your app domain. Seed your phrase list with a few words then use the suggest feature so LUIS knows about more words in the vocabulary. Don't add every word to the vocabulary since the phrase list isn't an exact match. 

Real user utterances from the endpoint may reveal patterns of word choice and placement. The pattern feature takes this word choice and placement along with regular expressions to improve your prediction accuracy. A regular expression in the pattern allows for words and punctuation you intend to ignore while still matching the pattern. 

## Do add example utterances to None intent
This is the fallback intent, indicated everything outside your application. Add one example utterance to the None intent for every 10 example utterances in the rest of your LUIS app.

## Do leverage the suggest feature for active learning
Use active learning instead of adding more example utterances to intents. 

## Do monitor the performance of your app
Monitor the prediction accuracy using a test set. 

## Don't add many example utterances to intents
Only add utterances from active learning in the iterative process. 

## Don't use LUIS as a training platform
LUIS is specific to a language model's domain. It will not meant to work as a general training platform. 

## Don't add many example utterances of the same format, ignoring other formats
LUIS expects variations in an intent's utterances. The utterances can vary while having the same overall meaning. Variations can include utterance length, word choice, and word placement. 

|Don't use same format|Do use varying format|
|--|--|
|Buy a ticket to Seattle<br>Buy a ticket to Paris<br>Buy a ticket to Orlando|Buy 1 ticket to Seattle<br>Reserve two seats on the red eye to Paris next Monday<br>I would like to book 3 tickets to Orlando for spring break|

The second column uses different verbs (buy, reserve, book), different quantities (1, two, 3), and different arrangements of words but all have the same intention of purchasing airline tickets for travel. 

## Don't mix the definition of intents and entities
Create an intent for any action your bot will take. Use entities as parameters that make that action possible. 

For a chat bot that will book airline flights, create a BookFlight intent. Do not create an intent for every airline or every destination. Use those pieces of data as entities and mark them in the example utterances. 

## Don't create phrase lists with all the possible values
Provide a few examples in the phrase lists but not every word. LUIS generalizes and takes context into account. 

## Don't add many patterns
Don't add too many patterns. LUIS is meant to learn quickly with fewer examples. Don't overload the system unnecessarily.

## Don't train and publish with every single example
Add 10 or 15 utterances before training and publishing. That allows you to see the impact on prediction accuracy. A single utterance may not have a visible impact on the score. 

### If you need more than the maximum number of intents
First, consider whether your system is using too many intents. Intents that are too similar can make it more difficult for LUIS to distinguish between them. Intents should be varied enough to capture the main tasks that the user is asking for, but they don't need to capture every path your code takes. For example, BookFlight and BookHotel might be separate intents in a travel app, but BookInternationalFlight and BookDomesticFlight are too similar. If your system needs to distinguish them, use entities or other logic rather than intents.

If you cannot use fewer intents, divide your intents into multiple LUIS apps, and group related intents. This approach is a best practice if you're using multiple apps for your system. For example, let's say you're developing an office assistant that has over 500 intents. If 100 intents relate to scheduling meetings, 100 are about reminders, 100 are about getting information about colleagues, and 100 are for sending email, you can group intents so that each group is in a single app, then create a top-level group with each intent. Base the utterance to LUIS twice, first to the top-level app, then based on the results, to the group-level app. 

Another method is to do some preprocessing on the utterance, such as matching on regular expressions, to determine which LUIS app or set of apps receives the utterance.

To improve responsiveness, ordinarily a system is designed to reduce the number of REST API calls. Instead, consider sending the utterance to multiple LUIS apps simultaneously and asynchronously, then pick the intent with the highest score. 

If reducing the number of intents or dividing your intents into multiple apps doesn't work for you, contact support. To do so, gather detailed information about your system, go to the [LUIS][LUIS] website, and then select **Support**. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/en-us/support/options/).

## Entities
Create an [entity](luis-concept-entity-types.md) when the calling application or bot needs some parameters or data from the utterance required to execute an action. An entity is a word or phrase in the utterance that you need extracted -- perhaps as a parameter for a function.

In order to select the correct type of entity to add to your application, you need to know how that data is entered by users. Each entity type is found using a different mechanism such as machine-learning, closed list or regular expression. If you are unsure, begin with a simple entity and label the word or phrase that represents that data in all utterances, across all intents including the None intent. 

Review endpoint utterances on a regular basis to find common usage where an entity can be identified as a regular expression or found with an exact text match. 

As part of the review, consider adding a phrase list to add a signal to LUIS for words or phrases that are significant to your domain but are not exact matches, and for which LUIS doesn't have a high confidence. 

### If you need more than the maximum number of entities
You might need to use hierarchical and composite entities. Hierarchical entities reflect the relationship between entities that share characteristics or are members of a category. The child entities are all members of their parent's category. For example, a hierarchical entity named PlaneTicketClass might have the child entities EconomyClass and FirstClass. The hierarchy spans only one level of depth. 

Composite entities represent parts of a whole. For example, a composite entity named PlaneTicketOrder might have child entities Airline, Destination, DepartureCity, DepartureDate, and PlaneTicketClass. You build a composite entity from pre-existing simple entities, children of hierarchical entities, or prebuilt entities. 

LUIS also provides the list entity type that is not machine-learned but allows your LUIS app to specify a fixed list of values. See [LUIS Boundaries](luis-boundaries.md) reference to review limits of the List entity type.

If you've considered hierarchical, composite, and list entities and still need more than the limit, contact support. To do so, gather detailed information about your system, go to the [LUIS][LUIS] website, and then select **Support**. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/en-us/support/options/).

## Utterances
Begin with 10-15 [utterances](luis-concept-utterance.md) per intent, but not more. Each utterance should be contextually different enough from the other utterances in the intent that each utterance is equally informative. The **None** intent should have between 10 and 20 percent of the total utterances in the application. Do not leave it empty.

In each iteration of the model, do not add a large quantity of utterances. Add utterances in quantities of tens. [Train](luis-how-to-train.md), [publish](publishapp.md), and [test](train-test.md) again. 

LUIS builds effective models with utterances that are selected carefully. Too many utterances are not valuable because it can introduce confusion. 

It is better to start with a few utterances, then [review endpoint utterances](label-suggested-utterances.md) for correct intent prediction and entity extraction. 

## Testing utterances
Developers should start testing their LUIS application with real traffic by sending utterances to the endpoint. These utterances are used to improve the performance of the intents and entities with [Review utterances](label-suggested-utterances.md). Tests submitted with the LUIS website testing pane are not sent through the endpoint, and so do not contribute to active learning.

## Training data
Developers should have three sets of test data. The first is for building the model, the second is for testing the model at the endpoint. The third is used in [batch testing](luis-how-to-batch-test.md). The first set is not used in training the application nor sent on the endpoint. 

## Improving prediction accuracy
When your app endpoint is receiving endpoint requests, you can use prediction improvement practices: [reviewing endpoint utterances](##review-endpoint-utterances), adding [phrase lists](#phrase-lists), and adding [patterns](#patterns). Do not apply these practices before your app has received endpoint requests because that skews the confidence. 

### Review endpoint utterances
Use the improvement practice of [reviewing endpoint utterances](label-suggested-utterances.md) on a regular basis. LUIS is not confident about the current score of these utterances. Because the app is constantly receiving endpoint utterances, this list is growing and changing. It is important to review these utterances to continue to increase prediction confidence scores.

### Phrase lists
Use the [phrase list](luis-concept-feature.md) when you want to emphasis domain vocabulary. Use a phrase list for words, proper names (such as multi-word cities), or phrases: 

* That are overly common in general but significant in your domain 
* That are obscure in general but significant in your domain. 

### Patterns
Do not create a pattern when you first create the app. Give LUIS the opportunity to learn from the provided utterances before adding patterns. 

If you have users from a common culture or work-place organization, utterances may take on a pattern in word order and word choice. When you find these patterns, instead of adding each unique utterance to the intent, create a [pattern](luis-concept-patterns.md). This use of patterns allows you to maintain a few patterns instead of many utterances. It also helps LUIS understand the importance of word choice and word order. The result is better prediction of intent and better data extraction of entities. 

## Data extraction
[Data extraction](luis-concept-data-extraction.md) is based on intent and entity detection. The code that consumes the LUIS response should be flexible enough to make choices based on the response. The topScoring intent may not be different enough from the next intent's score or the None intent score. Your consuming code should be able to use this information in combination with knowledge of the entities extracted from the utterance to present choices to the user on how the conversation should continue. These can be clarifying questions or a menu of choices. 

## Security
See [Securing the endpoint](luis-concept-security.md#securing-the-endpoint).

## Set an alert to monitor endpoint quota usage
A LUIS app operates successfully until the endpoint quota runs out. If you are concerned that your requests per month may exceed your endpoint key pricing level quota, should set up a [Total transactions threshold alert](azureibizasubscription.md#total-transactions-threshold-alert). 

## Actions to plan into a cyclical maintenance schedule

* [Review endpoint utterances](label-suggested-utterances.md) to improve LUIS predictions.
* Verify that the number of utterances in the **None** intent is about 10% of all the other utterances in the app.
* Review [endpoint quota usage](azureibizasubscription.md#viewing-summary-usage).
* Back up application by [cloning](luis-how-to-manage-versions.md#clone-a-version) the app.
* Review [collaborators](luis-how-to-collaborate.md) in case someone has left the company or no longer needs access to modeling the app. 

## Next steps

* Learn how to [plan your app](plan-your-app.md) in your LUIS app.
[LUIS]: luis-reference-regions.md#luis-website
