---
title: Affiliation entity attributes in the Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn the attributes you can use with the Affiliation entity in the Academic Knowledge API.
services: cognitive-services
author: alch-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: academic-knowledge
ms.topic: conceptual
ms.date: 03/23/2017
ms.author: alch
---

# Affiliation Entity

<sub>
*Following attributes are specific to affiliation entity. (Ty = '5')
</sub>

Name	|Description							|Type       | Operations
------- | ------------------------------------- | --------- | ----------------------------
Id		|Entity ID								|Int64		|Equals
AfN		|Affiliation normalized name		|String		|Equals
DAfN	|Affiliation display name		|String		|none
CC		|Affiliation total citation count			|Int32		|none  
ECC		|Affiliation total estimated citation count	|Int32		|none

## Extended Metadata Attributes ##

Name    | Description               
--------|---------------------------	
PC		|Affiliation's paper count
