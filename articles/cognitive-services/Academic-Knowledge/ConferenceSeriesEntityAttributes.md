---
title: Conference Series entity attributes - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn about the attributes you can use with the Conference Series entity.
services: cognitive-services
author: darrine
manager: kuansanw

ms.service: cognitive-services
ms.subservice: academic-knowledge
ms.topic: conceptual
ms.date: 11/14/2019
ms.author: darrine
ROBOTS: NOINDEX
---

# Conference Series Entity

> [!NOTE]
> Following attributes are specific to conference series entity. (Ty = '3')

Name | Description | Type | Operations
--- | --- | --- | ---
CC		|Conference series total citation count			|Int32		|None  
CN		|Conference series normalized name		|String		|Equals
DCN		|Conference series display name 		|String		|None
ECC		|Conference series total estimated citation count	|Int32		|None
F.FId	|Field of study entity ID associated with the conference series |Int64 	| Equals
F.FN	|Field of study name associated with the conference series 	| Equals,<br/>StartsWith
Id		|Entity ID								|Int64		|Equals
PC    |Conference series total publication count |Int32 | None
