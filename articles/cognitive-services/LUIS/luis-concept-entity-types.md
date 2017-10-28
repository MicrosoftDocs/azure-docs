---
title: Understanding entity types in LUIS apps in Azure | Microsoft Docs
description: Add entities (key data in your application's domain) in Language Understanding Intelligent Service (LUIS) apps.
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---
# Entities in LUIS

<!--
Entities are key data in your application’s domain. An entity represents a class including a collection of similar objects (places, things, people, events or concepts). Entities describe information relevant to the intent, and sometimes they are essential for your app to perform its task. For example, a News Search app may include entities such as “topic”, “source”, “keyword” and “publishing date”, which are key data to search for news. In a travel booking app, the “location”, “date”, "airline", "travel class" and "tickets" are key information for flight booking (relevant to the "Bookflight" intent). 
--> 
Entities are important words in utterances that describe information relevant to the intent, and sometimes they are essential to it. Entities belong to classes of similar objects. 

In the utterance "Book me a ticket to Paris", "Paris" is an entity of type location. By recognizing the entities that are mentioned in the user’s input, LUIS helps you choose the specific actions to take to fulfill an intent.

You do not need to create entities for every concept in your app, but only for those required for the app to take action. You can add up to **30** entities in a single LUIS app. 

You can add, edit or delete entities in your app through the **Entities list** on the **Entities** page in the LUIS app web portal. LUIS offers many types of entities; prebuilt entities, custom machine learned entities and list entities.


## Types of entities

LUIS offers the following types of entities:


| Type          | Description           |
| ------------- |-----------------------|
| Prebuilt      | Built-in types that represent common concepts like dates, times, and geography. <br/> These don't count towards the maximum number of entities you may use in your LUIS app. See [Prebuilt entities](./Pre-builtEntities.md) for more information.|
| List      | List entities represent a fixed set of synonyms or related words in your system. Each list entity may have one or more synonyms. They aren't machine learned, and are best used for a known set of variations on ways to represent the same concept. List entities don't have to be labeled in utterances or trained by the system.  <br/> A list entity is an explicitly specified list of values.  Unlike other entity types, LUIS does not discover additional values for list entities during training. Therefore, each list entity forms a closed set.  <br/><br/> Your app may use up to 50 list entities, and they don't count toward the maximum 30 you may use. Each list can contain up to 20000 items.| 
| Simple | A simple entity is a generic entity that describes a single concept.  <br/><br/> These count towards the maximum number of entities you may use.  |  
| Hierarchical | A hierarchical entity defines a category and its members. It is made up of child entities that form the members of the category. You can use hierarchical entities to define hierarchical or inheritance relationships between entities, in which children are subtypes of the parent entity. <br/><br/>For example, in a travel agent app, you could add hierarchical entities like these:<ul><li> $Location, including $FromLocation and $ToLocation as child entities that represent origin and destination locations.</li> <li> $TravelClass, including $First, $Business, and $Economy as child entities that represent the travel class.</li></ul> A hierarchical entity can consist of up to **20** child entities. <br/>  These count towards the maximum number of entities you may use.    | 
| Composite | A composite entity is made up of other entities that form parts of a whole. A composite entity can consist of up to **20** child entities. <br/>  These count towards the maximum number of entities you may use.   |  


## Next steps

See [Add entities](Add-entities.md) to learn more about how to add entities to your LUIS app.