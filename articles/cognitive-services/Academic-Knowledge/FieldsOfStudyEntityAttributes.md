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

# Field Of Study Entity

<sub>
*Below attributes are specific to field of study entity. (Ty = '6')
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
SSD		|Satori data 							|String		|none