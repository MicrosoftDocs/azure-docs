---
title: Conference Series entity attributes in the Academic Knowledge API | Microsoft Docs
description: Learn about the attributes you can use with the Conference Series entity in Cognitive Services.
services: cognitive-services
author: alch-msft
manager: kuansanw

ms.service: cognitive-services
ms.technology: academic-knowledge
ms.topic: article
ms.date: 03/23/2017
ms.author: alch
---

# Conference Series Entity

<sub>
*Following attributes are specific to conference series entity. (Ty = '3')
</sub>

Name	|Description							|Type       | Operations
------- | ------------------------------------- | --------- | ----------------------------
Id		|Entity ID								|Int64		|Equals
CN		|Conference series normalized name		|String		|Equals
DCN		|Conference series display name 		|String		|none
CC		|Conference series total citation count			|Int32		|none  
ECC		|Conference series total estimated citation count	|Int32		|none
F.FId	|Field of study entity ID associated with the conference series |Int64 	| Equals
F.FN	|Field of study name associated with the conference series 	| Equals,<br/>StartsWith