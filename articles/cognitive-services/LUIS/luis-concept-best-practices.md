---
title: Understand LUIS best practices - Azure | Microsoft Docs
description: Learn the LUIS best practices to get the best results.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 05/07/2018
ms.author: v-geberr;
---
# Best practices
Start with the [Authoring Cycle](luis-concept-app-iteration.md), then read this article.

## Intents
Use only as many [intents](luis-concept-intent.md) as you need to perform the functions of your app. The general rule is to create an intent when this intent would trigger an action in the calling application or bot. 

The intents should be specific. They should not overlapping each other. If multiple intents are semantically close, consider merging them.

If you define too many intents, it becomes harder for LUIS to classify utterances correctly. If you define too few, they may be so general as to be overlapping. 

### If you need more than the maximum number of intents
First, consider whether your system is using too many intents. Intents that are too similar can make it more difficult for LUIS to distinguish between them. Intents should be varied enough to capture the main tasks that the user is asking for, but they don't need to capture every path your code takes. For example, BookFlight and BookHotel might be separate intents in a travel app, but BookInternationalFlight and BookDomesticFlight are too similar. If your system needs to distinguish them, use entities or other logic rather than intents.

If you cannot use fewer intents, divide your intents into multiple LUIS apps, and group related intents. This approach is a best practice if you're using multiple apps for your system. For example, let's say you're developing an office assistant that has over 500 intents. If 100 intents relate to scheduling meetings, 100 are about reminders, 100 are about getting information about colleagues, and 100 are for sending email, you can group intents so that each group is in a single app, then create a top-level group with each intent. Base the utterance to LUIS twice, first to the top-level app, then based on the results, to the group-level app. 

Another method is to do some preprocessing on the utterance, such as matching on [regular expressions](#where-is-the-pattern-feature-that-provides-regular-expression-matching), to determine which LUIS app or set of apps receives the utterance.

To improve responsiveness, ordinarily a system is designed to reduce the number of REST API calls. Instead, consider sending the utterance to multiple LUIS apps simultaneously and asynchronously, then pick the intent with the highest score. 

If reducing the number of intents or dividing your intents into multiple apps doesn't work for you, contact support. To do so, gather detailed information about your system, go to the [LUIS][LUIS] website, and then select **Support**. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/en-us/support/options/).

## None intent best practice
It is important to add utterances to your **None** intent as you add more labels to other intents. A good ratio is 1 or 2 labels added to **None** for every 10 labels added to an intent. This ratio boosts the discriminative power of LUIS.

## Entities
Create an [entity](luis-concept-entity-types.md) when the calling application or bot needs some parameters or data from the utterance required to execute an action. 

### If you need more than the maximum number of entities
You might need to use hierarchical and composite entities. Hierarchical entities reflect the relationship between entities that share characteristics or are members of a category. The child entities are all members of their parent's category. For example, a hierarchical entity named PlaneTicketClass might have the child entities EconomyClass and FirstClass. The hierarchy spans only one level of depth. 

Composite entities represent parts of a whole. For example, a composite entity named PlaneTicketOrder might have child entities Airline, Destination, DepartureCity, DepartureDate, and PlaneTicketClass. You build a composite entity from pre-existing simple entities, children of hierarchical entities, or prebuilt entities. 

LUIS also provides the list entity type that is not machine-learned but allows your LUIS app to specify a fixed list of values. See [LUIS Boundaries](luis-boundaries.md) reference to review limits of the List entity type.

If you've considered hierarchical, composite, and list entities and still need more than the limit, contact support. To do so, gather detailed information about your system, go to the [LUIS][LUIS] website, and then select **Support**. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/en-us/support/options/).

## Utterances
Begin with 10-15 [utterances](luis-concept-utterance.md) per intent, but not more. Each utterance should be contextually different enough from the other utterances in the intent that each utterance is equally informative. The **None** intent should have between 10 and 20 percent of the total utterances in the application. Do not leave it empty.

In each iteration of the model, do not add a large quantity of utterances. Add utterances in quantities of tens. [Train](luis-how-to-train.md), [publish](publishapp.md), and [test](train-test.md) again. 

## Improving prediction accuracy
When your app endpoint is receiving endpoint requests, you can use prediction improvement practices: [reviewing endpoint utterances](##review-endpoint-utterances), adding [phrase lists](#phrase-lists), and adding [patterns](#patterns). Do not apply these practices before your app has received endpoint requests because that skews the confidence. 

### Review endpoint utterances
Use the improvement practice of [reviewing endpoint utterances](label-suggested-utterances.md) on a regular basis. LUIS is not confident about the current score of these utterances. Because the app is constantly receiving endpoint utterances, this list is growing and changing. It is important to review these utterances to continue to increase prediction confidence scores.

### Phrase lists
Use the phrase list when you want to emphasis domain vocabulary. Use a phrase list for words, proper names (such as multi-word cities), or phrases: 

* That are overly common in general but significant in your domain 
* That are obscure in general but significant in your domain. 

<!-- TBD: add pattern concept link in the paragraph after concepts are in -->
### Patterns
If you have users from a common culture or work-place organization, utterances may take on a pattern in word order and word choice. When you find these patterns, instead of adding each unique utterance to the intent, create a pattern. This use of patterns allows you to maintain a few patterns instead of many utterances. It also helps LUIS understand the importance of word choice and word order. The result is better prediction of intent and better data extraction of entities. 

## Data extraction
Data extraction is based on intent and entity detection. The code that consumes the LUIS response should be flexible enough to make choices based on the response. The topScoring intent may not be different enough from the next intent's score or the None intent score. Your consuming code should be able to use this information in combination with knowledge of the entities extracted from the utterance to present choices to the user on how the conversation should continue. These can be clarifying questions or a menu of choices. 

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
