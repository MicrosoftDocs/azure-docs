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

# Conference Instance Entity

<sub>
*Below attributes are specific to conference instance entity. (Ty = '4')
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
SSD		|Satori data 							|String		|none

## Extended Metadata Attributes ##

Name    | Description               
--------|---------------------------	
FN		| Conference instance full name