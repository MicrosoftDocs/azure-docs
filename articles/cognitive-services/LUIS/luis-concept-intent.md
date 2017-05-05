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

<!-- So, you must add intents to help your app understand user requests and react to them properly.  -->

All applications come with the predefined intent, **"None"**. You should teach it to recognize user statements that are irrelevant to the app, for example if a user says "Get me a great cookie recipe" in a TravelAgent app.

You can add up to 300 intents in a single LUIS app. You add and manage your intents from the **Intents** page that is accessed by clicking **Intents** in your application's left panel.


To learn how to add and manage intents in your LUIS app, see [Add intents](Add-intents.md).