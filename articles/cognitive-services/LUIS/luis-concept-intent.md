---
title: Understanding intents in LUIS apps in Azure | Microsoft Docs
description: Describes what intents are in Language Understanding Intelligent Service (LUIS) apps.
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/05/2018
ms.author: v-geberr;
---
# Intents in LUIS

An intent represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article. 

In your LUIS app, you define a set of named intents that correspond to actions users want to take in your application. A travel app may define an intent named `BookFlight`, that LUIS extracts from the utterance "Book me a ticket to Paris."

Example intent   |   Example utterances   | 
------|------|
 BookFlight     |   Book me a flight to Rio next week <br/> Fly me to Rio on the 24th <br/> I need a plane ticket next Sunday to Rio de Janeiro    |
 Greeting     |   Hi <br/>Hello <br/>Good morning  |
 CheckWeather | What's the weather like in Boston? <br/> Show me the forecast for this weekend |
 None         | Get me a cookie recipe |

All applications come with the predefined intent, **"None"**. The none intent teaches LUIS to recognize user statements that are irrelevant to the app.

A LUIS app must have at least one intent. 

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

## None intent

The **None** intent is how you teach LUIS utterances that are not in the app domain. If you do not add any utterances for the **None** intent, LUIS forces an utterance that is outside the domain into one of the domain intents. The **None** intent is created but left empty on purpose because a new app can be any domain. 

## Best practice - only required, specific intents
It is a best practice to use only as many intents as you need to perform the functions of your app. The general rule is to create an intent when this intent would trigger an action in calling application or bot. 

The intents should be specific while being generic enough not to be overlapping. If multiple intents are semantically close, consider merging them.

If you define too many intents, it becomes harder for LUIS to classify utterances correctly. If you define too few, they may be so general as to be overlapping. <!-- You add and manage your intents from the **Intents** page that is accessed by clicking **Intents** in your application's left panel.-->

## Next steps

* Learn more about [entities](luis-concept-entity-types.md), which are important words relevant to intents
* Learn how to [add and manage intents](Add-intents.md) in your LUIS app.
