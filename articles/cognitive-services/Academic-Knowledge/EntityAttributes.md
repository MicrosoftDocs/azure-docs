---
title: Academic Graph entity attributes - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn about the entity attributes you can use with the Academic Graph in the Academic Knowledge API.
services: cognitive-services
author: alch-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: academic-knowledge
ms.topic: conceptual
ms.date: 03/27/2017
ms.author: alch
---

# Entity Attributes

The academic graph is composed of 7 types of entity. All entities will have a Entity ID and a Entity type.

## Common Entity Attributes
Name	|Description	            |Type       | Operations
------- | ------------------------- | --------- | ----------------------------
Id		|Entity ID					|Int64		|Equals
Ty 		|Entity type 				|enum	|Equals

## Entity type enum
Name 															|value
----------------------------------------------------------------|-----
[Paper](PaperEntityAttributes.md)								|0
[Author](AuthorEntityAttributes.md)								|1
[Journal](JournalEntityAttributes.md)	 						|2
[Conference Series](JournalEntityAttributes.md)					|3
[Conference Instance](ConferenceInstanceEntityAttributes.md)	|4
[Affiliation](AffiliationEntityAttributes.md)					|5
[Field Of Study](FieldsOfStudyEntityAttributes.md)						|6

