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

# Conference Series Entity

<sub>
*Below attributes are specific to conference series entity. (Ty = '3')
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
SSD		|Satori data 							|String		|none