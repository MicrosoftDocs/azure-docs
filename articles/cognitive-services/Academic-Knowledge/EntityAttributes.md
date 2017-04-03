---
title: <page title displayed in search results. Include the brand Azure. Up to 60 characters> | Microsoft Docs
description: <article description that is displayed in search results. 115 - 145 characters.>
services: cognitive-services
author: <author's GitHub user alias, with correct capitalization>
manager: <MSFT alias of the author's manager>

ms.service: cognitive-services
ms.technology: <use folder name, all lower-case>
ms.topic: article
ms.date: mm/dd/yyyy
ms.author: <author's microsoft alias, one value only, alias only>
---

#Entity Attributes

The academic graph is composed of 7 types of entity. All entities will have a Entity ID and a Entity type.

### Common Entity Attributes
Name	|Description	            |Type       | Operations
------- | ------------------------- | --------- | ----------------------------
Id		|Entity ID					|Int64		|Equals
Ty 		|Entity type 				|enum	|Equals

### Entity type enum
Name 															|value
----------------------------------------------------------------|-----
[Paper](PaperEntityAttributes.md)								|0
[Author](AuthorEntityAttributes.md)								|1
[Journal](JournalEntityAttributes.md)	 						|2
[Conference Series](JournalEntityAttributes.md)					|3
[Conference Instance](ConferenceInstanceEntityAttributes.md)	|4
[Affiliation](AffiliationEntityAttributes.md)					|5
[Field Of Study](FieldsOfStudyEntity.md)						|6

