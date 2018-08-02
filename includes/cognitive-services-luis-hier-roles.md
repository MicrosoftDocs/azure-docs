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

**Question**: Should you use an hierarchical entity or a pattern including simple entity with roles? 

**Answer**: That depends. Roles work with patterns and hierarchical entities work in intents. Roles with patterns accomplish the same method but with fewer examples but must in the format of a pattern. If the utterances don’t have a clear pattern, you need to use hierarchical entities. 

|Hierarchical entities|Simple entity with roles|
|--|--|
|must have example utterances with child entities labeled in intents|must have example utterances, **roles can't be labeled in intents**|
|can use in patterns|**must** use in patterns|
|may need **more** example utterances in intent|may need **less** example utterances in intent|