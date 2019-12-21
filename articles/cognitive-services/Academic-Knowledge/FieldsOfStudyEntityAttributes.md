---
title: Field of Study entity attributes - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn the attributes you can use with the Field of Study entity in the Academic Knowledge API.
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

# Field Of Study Entity

> [!NOTE]
> Following attributes are specific to field of study entity. (Ty = '6')

Name | Description | Type | Operations
--- | --- | --- | ---
CC		|Field of study total citation count	|Int32		|None  
DFN 	|Field of study display name			|String		|None
ECC		|Field of total estimated citation count|Int32		|None
FL		|Level in fields of study hierarchy 	|Int32		|Equals, IsBetween
FN		|Field of study normalized name			|String		|Equals
FC.FId 	|Child field of study ID 				|Int64 		|Equals
FC.FN	|Child field of study name 		    	|String		|Equals
FP.FId 	|Parent field of study ID 				|Int64 		|Equals
FP.FN	|Parent field of study name 			|String		|Equals
Id		|Entity ID								|Int64		|Equals
PC    | Field of study total publication count | Int32 | None
