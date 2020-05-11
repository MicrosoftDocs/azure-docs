---
title: Intents and entities - LUIS
titleSuffix: Azure Cognitive Services
description: A single intent represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's utterance. Define a set of intents that corresponds to actions users want to take in your application.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 10/10/2019
ms.author: diberry
---
# Intents in your LUIS app

An intent represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's [utterance](luis-concept-utterance.md).

Define a set of intents that corresponds to actions users want to take in your application. For example, a travel app defines several intents:

Travel app intents   |   Example utterances   |
------|------|
 BookFlight     |   "Book me a flight to Rio next week" <br/> "Fly me to Rio on the 24th" <br/> "I need a plane ticket next Sunday to Rio de Janeiro"    |
 Greeting     |   "Hi" <br/>"Hello" <br/>"Good morning"  |
 CheckWeather | "What's the weather like in Boston?" <br/> "Show me the forecast for this weekend" |
 None         | "Get me a cookie recipe"<br>"Did the Lakers win?" |

All applications come with the predefined intent, "[None](#none-intent)", which is the fallback intent.

## Prebuilt domains provide intents
In addition to intents that you define, you can use prebuilt intents from one of the [prebuilt domains](luis-how-to-use-prebuilt-domains.md).

## Return all intents' scores
You assign an utterance to a single intent. When LUIS receives an utterance on the endpoint, by default, it returns the top intent for that utterance.

If you want the scores for all intents for the utterance, you can provide a flag on the query string of the prediction API.

|Prediction API version|Flag|
|--|--|
|V2|`verbose=true`|
|V3|`show-all-intents=true`|

## Intent compared to entity
The intent represents action the application should take for the user and is based on the entire utterance. An utterance can have only one top scoring intent but it can have many entities.

<a name="how-do-intents-relate-to-entities"></a>

Create an intent when the user's _intention_ would trigger an action in your client application, like a call to the checkweather() function. Then create entities to represent parameters required to execute the action.

|Intent   | Entity | Example utterance   |
|------------------|------------------------------|------------------------------|
| CheckWeather | { "type": "location", "entity": "seattle" }<br>{ "type": "builtin.datetimeV2.date","entity": "tomorrow","resolution":"2018-05-23" } | What's the weather like in `Seattle` `tomorrow`? |
| CheckWeather | { "type": "date_range", "entity": "this weekend" } | Show me the forecast for `this weekend` |
||||

## Prebuilt domain intents

[Prebuilt domains](luis-how-to-use-prebuilt-domains.md) provide intents with utterances.

## None intent

The **None** intent is created but left empty on purpose. The **None** intent is a required intent and can't be deleted or renamed. Fill it with utterances that are outside of your domain.

The **None** intent is the fallback intent, important in every app, and should have 10% of the total utterances. It is used to teach LUIS utterances that are not important in the app domain (subject area). If you do not add any utterances for the **None** intent, LUIS forces an utterance that is outside the domain into one of the domain intents. This will skew the prediction scores by teaching LUIS the wrong intent for the utterance.

When an utterance is predicted as the None intent, the client application can ask more questions or provide a menu to direct the user to valid choices.

## Negative intentions
If you want to determine negative and positive intentions, such as "I **want** a car" and "I **don't** want a car", you can create two intents (one positive, and one negative) and add appropriate utterances for each. Or you can create a single intent and mark the two different positive and negative terms as an entity.

## Intents and patterns

If you have example utterances, which can be defined in part or whole as a regular expression, consider using the [regular expression entity](luis-concept-entity-types.md#regular-expression-entity) paired with a [pattern](luis-concept-patterns.md).

Using a regular expression entity guarantees the data extraction so that the pattern is matched. The pattern matching guarantees an exact intent is returned.

## Intent balance
The app domain intents should have a balance of utterances across each intent. Do not have one intent with 10 utterances and another intent with 500 utterances. This is not balanced. If you have this situation, review the intent with 500 utterances to see if many of the intents can be reorganized into a [pattern](luis-concept-patterns.md).

The **None** intent is not included in the balance. That intent should contain 10% of the total utterances in the app.

## Intent limits
Review [limits](luis-limits.md#model-boundaries) to understand how many intents you can add to a model.

### If you need more than the maximum number of intents
First, consider whether your system is using too many intents.

### Can multiple intents be combined into single intent with entities
Intents that are too similar can make it more difficult for LUIS to distinguish between them. Intents should be varied enough to capture the main tasks that the user is asking for, but they don't need to capture every path your code takes. For example, BookFlight and FlightCustomerService might be separate intents in a travel app, but BookInternationalFlight and BookDomesticFlight are too similar. If your system needs to distinguish them, use entities or other logic rather than intents.

### Dispatcher model
Learn more about combining LUIS and QnA maker apps with the [dispatch model](luis-concept-enterprise.md#when-you-need-to-combine-several-luis-and-qna-maker-apps).

### Request help for apps with significant number of intents
If reducing the number of intents or dividing your intents into multiple apps doesn't work for you, contact support. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/support/options/).

## Next steps

* Learn more about [entities](luis-concept-entity-types.md), which are important words relevant to intents
* Learn how to [add and manage intents](luis-how-to-add-intents.md) in your LUIS app.
* Review intent [best practices](luis-concept-best-practices.md)
