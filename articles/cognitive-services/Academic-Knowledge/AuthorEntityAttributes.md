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

# Author Entity
<sub>
*Below attributes are specific to author entity. (Ty = '1')
</sub>

Name	|Description							|Type       | Operations
------- | ------------------------------------- | --------- | ----------------------------
Id		|Entity ID								|Int64		|Equals
AuN		|Author normalized name					|String		|Equals
DAuN	|Author display name					|String		|none
CC		|Author total citation count			|Int32		|none  
ECC		|Author total estimated citation count	|Int32		|none
E		|Extended metadata (see table below) 	|String 	|none  
SSD		|Satori data 							|String		|none

## Extended Metadata Attributes ##

Name    | Description               
--------|---------------------------	
LKA.Afn		| affiliation's display name associated with the author  
LKA.AfId		| affiliation's entity ID associated with the author