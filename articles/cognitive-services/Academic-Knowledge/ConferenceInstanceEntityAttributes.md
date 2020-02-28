---
title: Conference Instance entity attributes - Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn the attributes you can use with the Conference Instance entity in the Academic Knowledge API.
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

# Conference Instance Entity

> [!NOTE]
> Following attributes are specific to conference instance entity. (Ty = '4')

Name | Description | Type | Operations
--- | --- | --- | ---
CC		|Conference instance total citation count			|Int32		|None  
CD.D	|Date of a conference instance event 	|Date		|Equals, IsBetween
CD.T	|Title of a conference instance event 	|Date		|Equals, IsBetween
CIARD	|Abstract registration due date of the conference instance 	|Date		|Equals, IsBetween
CIED	|End date of the conference instance 	|Date		|Equals, IsBetween
CIFVD	|Final version due date of the conference instance 	|Date		|Equals, IsBetween
CIL		|Location of the conference instance 	|String		|Equals, StartsWith
CIN		|Conference instance normalized name |String		|Equals
CINDD	|Notification date of the conference instance 	|Date		|Equals, IsBetween
CISD	|Start date of the conference instance 	|Date		|Equals, IsBetween
CISDD	|Submission due date of the conference instance 	|Date		|Equals, IsBetween
DCN		|Conference instance display name  |String		|None
E | Extended metadata</br></br>**IMPORTANT**: This attribute has been deprecated and is only supported for legacy applications. Requesting this attribute individually (i.e. attributes=Id,Ti,E) will result in all extended metadata attributes being returned in a *serialized JSON string*</br></br>All attributes contained in the extended metadata are now available as a top-level attribute and can be requested as such (i.e. attributes=Id,Ti,DOI,IA) | [Extended](#extended) | None
ECC		|Conference instance total estimated citation count	|Int32		|None
FN | Conference instance full name | String | None
Id		|Entity ID								|Int64		|Equals
PC | Conference instance total publication count | Int32 | None
PCS.CN	|Parent conference series name of the instance |String 	|Equals
PCS.CId	|Parent conference series ID of the instance |Int64 	|Equals

## Extended

> [!IMPORTANT]
> This attribute has been deprecated and is only supported for legacy applications. Requesting this attribute individually (i.e. attributes=Id,Ti,E) will result in all extended metadata attributes being returned in a *serialized JSON string*</br></br>All attributes contained in the extended metadata are now available as a top-level attribute and can be requested as such (i.e. attributes=Id,Ti,DOI,IA)

> [!IMPORTANT]
> Support for requesting individual extended attributes by using the "E." scope, i.e. "E.DN" is being deprecated. While this is still technically supported, requesting individual extended attributes using the "E." scope will result in the attribute value being returned in two places in the JSON response, as part of the "E" object and as a top level attribute.

Name | Description | Type | Operations
--- | --- | --- | ---
FN | Conference instance full name | String | None
PC | Conference instance total publication count | Int32 | None
