---
title: Intents 
titleSuffix: Language Understanding - Azure Cognitive Services
description: An single intent represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's utterance. Define a set of intents that corresponds to actions users want to take in your application.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 01/02/2019
ms.author: diberry
---
# Concepts about intents in your LUIS app

An intent represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's [utterance](luis-concept-utterance.md).

Define a set of intents that corresponds to actions users want to take in your application. For example, a travel app defines several intents:

Travel app intents   |   Example utterances   | 
------|------|
 BookFlight     |   "Book me a flight to Rio next week" <br/> "Fly me to Rio on the 24th" <br/> "I need a plane ticket next Sunday to Rio de Janeiro"    |
 Greeting     |   "Hi" <br/>"Hello" <br/>"Good morning"  |
 CheckWeather | "What's the weather like in Boston?" <br/> "Show me the forecast for this weekend" |
 None         | "Get me a cookie recipe"<br>"Did the Lakers win?" |

All applications come with the predefined intent, "[None](#none-intent-is-fallback-for-app)", which is the fallback intent. 

## Prebuilt domains provide intents
In addition to intents that you define, you can use prebuilt intents from one of the prebuilt domains. For more information, see [Use prebuilt domains in LUIS apps](luis-how-to-use-prebuilt-domains.md) to learn about how to customize intents from a prebuilt domain for use in your app.

## Return all intents' scores
You assign an utterance to a single intent. When LUIS receives an utterance on the endpoint, it returns the one top intent for that utterance. If you want scores for all intents for the utterance, you can provide `verbose=true` flag on the query string of the API [endpoint call](https://aka.ms/v1-endpoint-api-docs). 

## Intent compared to entity
The intent represents action the chatbot should take for the user and is based on the entire utterance. The entity represents words or phrases contained inside the utterance. An utterance can have only one top scoring intent but it can have many entities. 

<a name="how-do-intents-relate-to-entities"></a>
Create an intent when the user's _intention_ would trigger an action in your client application, like a call to the checkweather() function. Then create an entity to represent parameters required to execute the action. 

|Example intent   | Entity | Entity in example utterances   | 
|------------------|------------------------------|------------------------------|
| CheckWeather | { "type": "location", "entity": "seattle" }<br>{ "type": "builtin.datetimeV2.date","entity": "tomorrow","resolution":"2018-05-23" } | What's the weather like in `Seattle` `tomorrow`? |
| CheckWeather | { "type": "date_range", "entity": "this weekend" } | Show me the forecast for `this weekend` | 

## Custom intents

Similarly intentioned [utterances](luis-concept-utterance.md) correspond to a single intent. Utterances in your intent can use any [entity](luis-concept-entity-types.md) in the app since entities are not intent-specific. 

## Prebuilt domain intents

[Prebuilt domains](luis-how-to-use-prebuilt-domains.md) have intents with utterances.  

## None intent

The **None** intent is important to every app and shouldn't have zero utterances.

### None intent is fallback for app
The **None** intent is a catch-all or fallback intent. It is used to teach LUIS utterances that are not important in the app domain (subject area). The **None** intent should have between 10 and 20 percent of the total utterances in the application. Do not leave the None empty. 

### None intent helps conversation direction
When an utterance is predicted as the None intent and returned to the chatbot with that prediction, the bot can ask more questions or provide a menu to direct the user to valid choices in the chatbot. 

### No utterances in None intent skews predictions
If you do not add any utterances for the **None** intent, LUIS forces an utterance that is outside the domain into one of the domain intents. This will skew the prediction scores by teaching LUIS the wrong intent for the utterance. 

### Add utterances to the None intent
The **None** intent is created but left empty on purpose. Fill it with utterances that are outside of your domain. A good utterance for **None** is something completely outside the app as well as the industry the app serves. For example, a travel app should not use any utterances for **None** that can relate to travel such as reservations, billing, food, hospitality, cargo, inflight entertainment. 

What type of utterances are left for the None intent? Start with something specific that your bot shouldn't answer such "What kind of dinosaur has blue teeth?" This is a very specific question far outside of a travel app. 

### None is a required intent
The **None** intent is a required intent and can't be deleted or renamed.

## Negative intentions 
If you want to determine negative and positive intentions, such as "I **want** a car" and "I **don't** want a car", you can create two intents (one positive, and one negative) and add appropriate utterances for each. Or you can create a single intent and mark the two different positive and negative terms as an entity.  

## Intents and patterns

If you have example utterances, which can be defined in part or whole as a regular expression, consider using the [regular expression entity](luis-concept-entity-types.md#regular-expression-entity) paired with a [pattern](luis-concept-patterns.md). 

Using a regular expression entity guarantees the data extraction so that the pattern is matched. The pattern matching guarantees an exact intent is returned. 

## Intent balance
The app domain intents should have a balance of utterances across each intent. Do not have one intent with 10 utterances and another intent with 500 utterances. This is not balanced. If you have this situation, review the intent with 500 utterances to see if many of the intents can be reorganized into a [pattern](luis-concept-patterns.md). 

The **None** intent is not included in the balance. That intent should contain 10% of the total utterances in the app.

## Intent limits
Review [limits](luis-boundaries.md#model-boundaries) to understand how many intents you can add to a model. 

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
