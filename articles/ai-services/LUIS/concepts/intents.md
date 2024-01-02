---
title: What are intents in LUIS
titleSuffix: Azure AI services
description: Learn about intents and how they're used in LUIS
#services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: conceptual
ms.date: 07/19/2022

---
# Intents 

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]


An intent represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's [utterance](utterances.md).

Define a set of intents that corresponds to actions users want to take in your application. For example, a travel app would have several intents:

Travel app intents   |   Example utterances   |
------|------|
 BookFlight     |   "Book me a flight to Rio next week" <br/> "Fly me to Rio on the 24th" <br/> "I need a plane ticket next Sunday to Rio de Janeiro"    |
 Greeting     |   "Hi" <br/>"Hello" <br/>"Good morning"  |
 CheckWeather | "What's the weather like in Boston?" <br/> "Show me the forecast for this weekend" |
 None         | "Get me a cookie recipe"<br>"Did the Lakers win?" |

All applications come with the predefined intent, "[None](#none-intent)", which is the fallback intent.

## Prebuilt intents

LUIS provides prebuilt intents and their utterances for each of its prebuilt domains. Intents can be added without adding the whole domain. Adding an intent is the process of adding an intent and its utterances to your app. Both the intent name and the utterance list can be modified.

## Return all intents' scores

You assign an utterance to a single intent. When LUIS receives an utterance, by default it returns the top intent for that utterance.

If you want the scores for all intents for the utterance, you can provide a flag in the query string of the prediction API.

|Prediction API version|Flag|
|--|--|
|V2|`verbose=true`|
|V3|`show-all-intents=true`|

## Intent compared to entity

The intent represents the action the application should take for the user, based on the entire utterance. An utterance can have only one top-scoring intent, but it can have many entities.

Create an intent when the user's intention would trigger an action in your client application, like a call to the checkweather() function from the table above. Then create entities to represent parameters required to execute the action.

|Intent   | Entity | Example utterance   |
|------------------|------------------------------|------------------------------|
| CheckWeather | { "type": "location", "entity": "Seattle" }<br>{ "type": "builtin.datetimeV2.date","entity": "tomorrow","resolution":"2018-05-23" } | What's the weather like in `Seattle` `tomorrow`? |
| CheckWeather | { "type": "date_range", "entity": "this weekend" } | Show me the forecast for `this weekend` |
||||


## None intent

The  **None**  intent is created but left empty on purpose. The  **None**  intent is a required intent and can't be deleted or renamed. Fill it with utterances that are outside of your domain.

The **None** intent is the fallback intent,  and should have 10% of the total utterances. It is important in every app, because it’s used to teach LUIS utterances that are not important in the app domain (subject area). If you do not add any utterances for the **None** intent, LUIS forces an utterance that is outside the domain into one of the domain intents. This will skew the prediction scores by teaching LUIS the wrong intent for the utterance.

When an utterance is predicted as the None intent, the client application can ask more questions or provide a menu to direct the user to valid choices.

## Negative intentions

If you want to determine negative and positive intentions, such as "I  **want**  a car" and "I  **don't**  want a car", you can create two intents (one positive, and one negative) and add appropriate utterances for each. Or you can create a single intent and mark the two different positive and negative terms as an entity.

## Intents and patterns

If you have example utterances, which can be defined in part or whole as a regular expression, consider using the [regular expression entity](../concepts/entities.md#regex-entity) paired with a [pattern](../concepts/patterns-features.md).

Using a regular expression entity guarantees the data extraction so that the pattern is matched. The pattern matching guarantees an exact intent is returned.

## Intent balance

The app domain intents should have a balance of utterances across each intent. For example, do not have most of your intents with 10 utterances and another intent with 500 utterances. This is not balanced. In this situation, you would want to review the intent with 500 utterances to see if many of the intents can be reorganized into a [pattern](../concepts/patterns-features.md).

The  **None**  intent is not included in the balance. That intent should contain 10% of the total utterances in the app.

### Intent limits

Review the  [limits](../luis-limits.md) to understand how many intents you can add to a model.

> [!Tip]
> If you need more than the maximum number of intents, consider whether your system is using too many intents and determine if multiple intents be combined into single intent with entities.
> Intents that are too similar can make it more difficult for LUIS to distinguish between them. Intents should be varied enough to capture the main tasks that the user is asking for, but they don't need to capture every path your code takes. For example, two intents: BookFlight() and FlightCustomerService() might be separate intents in a travel app, but BookInternationalFlight() and BookDomesticFlight() are too similar. If your system needs to distinguish them, use entities or other logic rather than intents.


### Request help for apps with significant number of intents

If reducing the number of intents or dividing your intents into multiple apps doesn't work for you, contact support. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/support/options/).


## Best Practices for Intents:

### Define distinct intents

Make sure the vocabulary for each intent is just for that intent and not overlapping with a different intent. For example, if you want to have an app that handles travel arrangements such as airline flights and hotels, you can choose to have these subject areas as separate intents or the same intent with entities for specific data inside the utterance.

If the vocabulary between two intents is the same, combine the intent, and use entities.

Consider the following example utterances:

1. Book a flight
2. Book a hotel

"Book a flight" and "book a hotel" use the same vocabulary of "book a *\<noun\>*". This format is the same so it should be the same intent with the different words of flight and hotel as extracted entities.

### Do add features to intents

Features describe concepts for an intent. A feature can be a phrase list of words that are significant to that intent or an entity that is significant to that intent.

### Do find sweet spot for intents

Use prediction data from LUIS to determine if your intents are overlapping. Overlapping intents confuse LUIS. The result is that the top scoring intent is too close to another intent. Because LUIS does not use the exact same path through the data for training each time, an overlapping intent has a chance of being first or second in training. You want the utterance's score for each intention to be farther apart, so this variance doesn't happen. Good distinction for intents should result in the expected top intent every time.

### Balance utterances across intents

For LUIS predictions to be accurate, the quantity of example utterances in each intent (except for the None intent), must be relatively equal.

If you have an intent with 500 example utterances and all your other intents with 10 example utterances, the 500-utterance intent will have a higher rate of prediction.

### Add example utterances to none intent

This intent is the fallback intent, indicating everything outside your application. Add one example utterance to the None intent for every 10 example utterances in the rest of your LUIS app.

### Don't add many example utterances to intents

After the app is published, only add utterances from active learning in the development lifecycle process. If utterances are too similar, add a pattern.

### Don't mix the definition of intents and entities

Create an intent for any action your bot will take. Use entities as parameters that make that action possible.

For example, for a bot that will book airline flights, create a  **BookFlight**  intent. Do not create an intent for every airline or every destination. Use those pieces of data as [entities](../concepts/entities.md) and mark them in the example utterances.

## Next steps

[How to use intents](../how-to/intents.md)
