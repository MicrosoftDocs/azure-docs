---
title: Field of Study entity attributes - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn the attributes you can use with the Field of Study entity in the Academic Knowledge API.
services: cognitive-services
author: alch-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: academic-knowledge
ms.topic: conceptual
ms.date: 03/31/2017
ms.author: alch
---

# Field Of Study Entity

<sub>
*Following attributes are specific to field of study entity. (Ty = '6')
</sub>

Name	|Description							|Type       | Operations
------- | ------------------------------------- | --------- | ----------------------------
Id		|Entity ID								|Int64		|Equals
FN		|Field of study normalized name			|String		|Equals
DFN 	|Field of study display name			|String		|none
CC		|Field of study total citation count	|Int32		|none  
ECC		|Field of total estimated citation count|Int32		|none
FL		|Level in fields of study hierarchy 	|Int32		|Equals, <br/>IsBetween
FP.FN	|Parent field of study name 			|String		|Equals
FP.FId 	|Parent field of study ID 				|Int64 		|Equals
FC.FN	|Child field of study name 		    	|String		|Equals
FC.FId 	|Child field of study ID 				|Int64 		|Equals
