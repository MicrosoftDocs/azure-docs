---
title: Conference Instance entity attributes - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn the attributes you can use with the Conference Instance entity in the Academic Knowledge API.
services: cognitive-services
author: alch-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: academic-knowledge
ms.topic: conceptual
ms.date: 03/23/2017
ms.author: alch
---

# Conference Instance Entity

<sub>
*Following attributes are specific to conference instance entity. (Ty = '4')
</sub>

Name	|Description							|Type       | Operations
------- | ------------------------------------- | --------- | ----------------------------
Id		|Entity ID								|Int64		|Equals
CIN		|Conference instance normalized name ({ConferenceSeriesNormalizedName} {ConferenceInstanceYear})		|String		|Equals
DCN		|Conference instance display name ({ConferenceSeriesName} : {ConferenceInstanceYear})		|String		|none
CIL		|Location of the conference instance 	|String		|Equals,<br/>StartsWith
CISD	|Start date of the conference instance 	|Date		|Equals,<br/>IsBetween
CIED	|End date of the conference instance 	|Date		|Equals,<br/>IsBetween
CIARD	|Abstract registration due date of the conference instance 	|Date		|Equals,<br/>IsBetween
CISDD	|Submission due date of the conference instance 	|Date		|Equals,<br/>IsBetween
CIFVD	|Final version due date of the conference instance 	|Date		|Equals,<br/>IsBetween
CINDD	|Notification date of the conference instance 	|Date		|Equals,<br/>IsBetween
CD.T	|Title of a conference instance event 	|Date		|Equals,<br/>IsBetween
CD.D	|Date of a conference instance event 	|Date		|Equals,<br/>IsBetween
PCS.CN	|Conference series name of the instance |String 	|Equals
PCS.CId	|Conference series ID of the instance |Int64 	|Equals
CC		|Conference instance total citation count			|Int32		|none  
ECC		|Conference instance total estimated citation count	|Int32		|none


## Extended Metadata Attributes ##

Name    | Description               
--------|---------------------------	
FN		| Conference instance full name
