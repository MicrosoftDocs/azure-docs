---
title: include file
description: include file 
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.subservice: luis
ms.topic: include
ms.custom: include file
ms.date: 10/23/2018
ms.author: diberry
---

## Roles versus hierarchical entities

Should you use a hierarchical entity or a pattern with a simple entity with roles? 

That depends. Patterns and example utterances are comparable in that they represent a user's utterance, and are specific to an intent.  

If the utterances don’t have a clear pattern, use hierarchical entities. 

|Hierarchical entities|Simple entity with roles|
|--|--|
|Available in intent's example utterances and patterns|Only available in patterns|
|Must have example utterances in intent with child entities labeled|Roles can't be labeled in example utterances in intent|
|May need **more** example utterances in intent to extract entity|Should need **fewer** example utterances in intent|
