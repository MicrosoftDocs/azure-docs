---
title: Author entity attributes in the Academic Knowledge API | Microsoft Docs
description: Learn the attributes you can use with the Author entity in the Academic Knowledge API in Cognitive Services.
services: cognitive-services
author: alch-msft
manager: kuansanw

ms.service: cognitive-services
ms.technology: academic-knowledge
ms.topic: article
ms.date: 03/23/2017
ms.author: alch
---

# Author Entity
<sub>
*Following attributes are specific to author entity. (Ty = '1')
</sub>

Name	|Description							|Type       | Operations
------- | ------------------------------------- | --------- | ----------------------------
Id		|Entity ID								|Int64		|Equals
AuN		|Author normalized name					|String		|Equals
DAuN	|Author display name					|String		|none
CC		|Author total citation count			|Int32		|none  
ECC		|Author total estimated citation count	|Int32		|none
E		|Extended metadata (see "Extended Meta Attributes" table ) 	|String 	|none  


## Extended Metadata Attributes ##

Name    | Description               
--------|---------------------------	
LKA.Afn		| affiliation's display name associated with the author  
LKA.AfId		| affiliation's entity ID associated with the author