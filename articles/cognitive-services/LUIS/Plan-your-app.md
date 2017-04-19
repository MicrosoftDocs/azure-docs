---
title: Plan your LUIS applications | Microsoft Docs
description: Outline relevant app intents and entities, and then create your application plans in Language Understanding Intelligent Services (LUIS).
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---

# Plan Your Application
All LUIS applications are centered around a domain-specific topic, for example booking of tickets, flights, hotels, rental cars etc. or content related to exercising, tracking fitness efforts and setting goals. It is advisable to plan your application before you start creating it in LUIS. Prepare an outline (schema) of the possible intents and entities that are relevant to the domain-specific topic of your application.  

Let's take the example of a virtual travel booking agency application. You should think about the intents and entities that are important to your application’s task. In a travel booking application, users would like to book a flight and get an idea of the weather at their travel destination. Thus, the relevant intents would be "BookFlight" and "GetWeather". For flight booking, some relevant information is needed such as the location, date, airline, tickets' category and travel class. Thus, they can be added as entities. 

With a planned outline of intents and entities, you can start creating your application in LUIS and define these intents and entities.

[Click here](create-new-app.md) to know how to create a new app.
