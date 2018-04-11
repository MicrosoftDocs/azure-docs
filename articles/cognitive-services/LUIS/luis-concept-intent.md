---
title: Understanding intents in LUIS apps in Azure | Microsoft Docs
description: Describes what intents are in Language Understanding Intelligent Service (LUIS) apps.
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/08/2018
ms.author: v-geberr;
---
# Intents in LUIS

An intent represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's [utterance](luis-concept-utterance.md). 

Define a set of intents that correspond to actions users want to take in your application. For example, a travel app defines an intent named `BookFlight`.

Example intent   |   Example utterances   | 
------|------|
 BookFlight     |   "Book me a flight to Rio next week" <br/> "Fly me to Rio on the 24th" <br/> "I need a plane ticket next Sunday to Rio de Janeiro"    |
 Greeting     |   "Hi" <br/>"Hello" <br/>"Good morning"  |
 CheckWeather | "What's the weather like in Boston?" <br/> "Show me the forecast for this weekend" |
 None         | "Get me a cookie recipe" |

All applications come with the predefined intent, **"[None](#none-intent-is-fallback-for-app)"**. 

## Prebuilt domains provide intents
In addition to intents that you define, you can use prebuilt intents from one of the prebuilt domains. See [Use prebuilt domains in LUIS apps](luis-how-to-use-prebuilt-domains.md) to learn about how to customize intents from a prebuilt domain for use in your app.

You assign an utterance to a single intent. When LUIS receives an utterance on the endpoint, it returns the one top intent for that utterance. If you want all intents, you can provide `verbose=true` flag on the query string of the API [endpoint call](https://aka.ms/v1-endpoint-api-docs). 

## How do intents relate to entities?
Create an intent when this intent would trigger an action in your client application, like a call to the checkweather() function, and create an entity to represent parameters required to execute the action. 

|Example intent   | Entity | Entity in example utterances   | 
|------------------|------------------------------|------------------------------|
| CheckWeather | { "type": "location", "entity": "seattle" } | What's the weather like in `Seattle`? |
| CheckWeather | { "type": "date_range", "entity": "this weekend" } | Show me the forecast for `this weekend` | 

## Custom intents

Create an intent when you want to group utterances. [Utterances](luis-concept-utterance.md) correspond to a single intent. Utterances in your intent can use any [entity](luis-concept-entity-types.md) in the app since entities are not intent-specific. 

## Prebuilt domain intents

[Prebuilt domains](luis-how-to-use-prebuilt-domains.md) have intents with utterances.  

## None intent is fallback for app
The **None** intent is a catch-all or fallback intent. It is used to teach LUIS utterances that are not important in the app domain (subject area). 

## None intent helps conversation direction
When an utterance is predicted as the None intent and returned to the bot with that prediction, the bot can ask more questions or provide a menu to direct the user to valid choices in the bot. 

## No utterances in None intent skews predictions
If you do not add any utterances for the **None** intent, LUIS forces an utterance that is outside the domain into one of the domain intents. This will skew the prediction scores by teaching LUIS the wrong intent for the utterance. 

## Add utterances to the None intent
The **None** intent is created but left empty on purpose. You must fill it with utterances that are outside of your domain. A good utterance for **None** is something completely outside the app as well as the industry the app serves. For example, a travel app should not use any utterances for **None** that can relate to travel, reservations, billing, food, hospitality, cargo, inflight entertainment, etc. What type of utterances are left for the None intent? Start with something specific that your bot shouldn't answer such "What kind of dinosaur can fly?" This is a very specific question far outside of a travel app. 

## None is a required intent
The **None** intent is a required intent and can't be deleted or renamed.

## Next steps

* Learn more about [entities](luis-concept-entity-types.md), which are important words relevant to intents
* Learn how to [add and manage intents](Add-intents.md) in your LUIS app.
* Review intent [best practices](luis-concept-best-practices.md#intents)
