---
title: Prebuilt domain reference
titleSuffix: Azure
description: Reference for the prebuilt domains, which are prebuilt collections of intents and entities from Language Understanding Intelligent Services (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 05/07/2019
ms.author: diberry
#source: https://raw.githubusercontent.com/Microsoft/luis-prebuilt-domains/master/README.md
#acrolinx bug for exception: https://mseng.visualstudio.com/TechnicalContent/_workitems/edit/1518317
---

# Prebuilt domain reference for your LUIS app
This reference provides information about the [prebuilt domains](luis-how-to-use-prebuilt-domains.md), which are prebuilt collections of intents and entities that LUIS offers.

[Custom domains](luis-how-to-start-new-app.md), by contrast, start with no intents and models. You can add any prebuilt domain intents and entities to a custom model.

# Supported domains across cultures

The only supported culture is english. 

<!--

The table below summarizes the currently supported domains. Support for English is usually more complete than others.


| Entity Type       | EN-US      | ZH-CN   | DE    | FR     | ES    | IT      | PT-BR |  JP  |      KO |        NL |    TR |
|:-----------------:|:-------:|:-------:|:-----:|:------:|:-----:|:-------:| :-------:| :-------:| :-------:| :-------:|  :-------:| 
| Calendar    | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | -      | -    | -    | -     | -  |
| Communication   | ✓    | -       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| Email           | ✓    | ✓       | ✓   | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| HomeAutomation           | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| Notes      | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| Places    | ✓    | -       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| RestaurantReservation   | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| ToDo     | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| ToDo_IPA        | ✓    | ✓       | ✓    | ✓      | ✓     | ✓       | -  | -      | -    | -    | -     | -  |
| Utilities          | ✓    | ✓        | ✓    | ✓      | ✓     | ✓       | -  | -      | -    | -    | -     | -  |
| Weather        | ✓    | ✓        | ✓    | ✓      | ✓     | ✓       | -  | -      | -    | -    | -     | -  |
| Web    | ✓    | -        | ✓    | ✓      | ✓     | ✓       | -  | -      | -    | -    | -     | -  |
||||||||||||| 

-->

<br><br>

|Entity type|description|
|--|--|
|Calendar|Calendar is anything about personal meetings and appointments, _not_ public events (such as world cup schedules, Seattle event calendars) or generic calendars (such as what day is it today, what does fall begin, when is Labor Day).|
|Communication|Requests to make calls, send texts or instant messages, find and add contacts and various other communication-related requests (generally outgoing). Contact name only queries do not belong to Communication domain.|
|Email|Email is a subdomain of the Communication domain. It mainly contains requests to send and receive messages through emails.|
|HomeAutomation|The HomeAutomation domain provides intents and entities related to controlling smart home devices. It mainly supports the control command related to lights and air conditioner but it has some generalization abilities for other electric appliances.|
|Notes|Note domain provides intents and entities for creating notes and writing down items for users.|
|Places|Places include businesses, institutions, restaurants, public spaces and addresses. The domain supports place finding and asking about the information of a public place such as location, operating hours and distance.|
|RestaurantReservation|Restaurant reservation domain supports intents for handling reservations for restaurants.|
|ToDo|ToDo domain provides types of task lists for users to add, mark and delete their todo items.|
|Utilities|Utilities domain is a general domain among all LUIS prebuilt models which contains common intents and utterances in difference scenarios.|
|Weather|Weather domain focuses on checking weather condition and advisories with location and time or checking time by weather conditions.|
|Web|The Web domain provides the intent and entities for searching for a website.|
