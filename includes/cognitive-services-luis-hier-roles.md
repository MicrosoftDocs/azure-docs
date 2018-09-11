---
title: include file
description: include file 
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: luis
ms.topic: include
ms.custom: include file
ms.date: 08/02/2018
ms.author: diberry
--- 

**Question**: Should you use a hierarchical entity or a pattern with a simple entity with roles? 

**Answer**: That depends. Patterns and example utterances are comparable in that they represent a user's utterance, and are specific to an intent.  

If the utterances don’t have a clear pattern, use hierarchical entities. 

|Hierarchical entities|Simple entity with roles|
|--|--|
|must have example utterances with child entities labeled in intents|must have example utterances, **roles can't be labeled in intents**|
|can use in patterns|**must** use in patterns|
|may need **more** example utterances in intent|may need **fewer example utterances in intent|