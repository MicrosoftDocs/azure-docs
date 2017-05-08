---
title: Understanding intents in LUIS apps in Azure | Microsoft Docs
description: Describes what intents are in Language Understanding Intelligent Service (LUIS) apps.
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
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

All applications come with the predefined intent, **"None"**. You should teach it to recognize user statements that are irrelevant to the app.

You can add up to **80** intents in a single LUIS app. However, it is a best practice to use only as many intents as you need to perform the functions of your app. If you define too many intents, it becomes harder for LUIS to classify utterances correctly. If you define too few, they may be so general as to be overlapping. <!-- You add and manage your intents from the **Intents** page that is accessed by clicking **Intents** in your application's left panel.-->

> [!TIP]
> In addition to intents that you define, you can use prebuilt intents from one of the prebuilt domains. See [Use prebuilt domains in LUIS apps](luis-how-to-use-prebuilt-domains.md) to learn about how to customize intents from a prebuilt domain for use in your app.

## How do intents relate to entities?
Create an intent when this intent would trigger an action in your client application, like a call to the checkweather() function, and create an entity to represent parameters required to execute the action. 

|Example intent   | Entity | Entity in example utterances   | 
|------------------|------------------------------|------------------------------|
| CheckWeather | { "type": "location", "entity": "seattle" } | What's the weather like in `Seattle`? |
| CheckWeather | { "type": "date_range", "entity": "this weekend" } | Show me the forecast for `this weekend` | 



## Next steps

* Learn more about [entities](luis-concept-entity-types.md), which are important words relevant to intents
* Learn how to [add and manage intents](Add-intents.md) in your LUIS app.
