---
title: Affiliation entity attributes in the Academic Knowledge API
titlesuffix: Azure Cognitive Services
description: Learn the attributes you can use with the Affiliation entity in the Academic Knowledge API.
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

# Affiliation Entity

> [!NOTE]
> Following attributes are specific to affiliation entity. (Ty = '5')

Name | Description | Type | Operations
--- | --- | --- | ---
AfN | Affiliation normalized name |String |Equals
CC | Affiliation total citation count |Int32		|none  
DAfN | Affiliation display name |String |none
E | Extended metadata</br></br>**IMPORTANT**: This attribute has been deprecated and is only supported for legacy applications. Requesting this attribute individually (i.e. attributes=Id,Ti,E) will result in all extended metadata attributes being returned in a *serialized JSON string*</br></br>All attributes contained in the extended metadata are now available as a top-level attribute and can be requested as such (i.e. attributes=Id,Ti,DOI,IA) | [Extended](#extended) | None
ECC | Affiliation total estimated citation count |Int32 |none
Id | Entity ID |Int64 |Equals
PC | Total number of publications written in affiliation with this entity | Int32 | None

## Extended

> [!IMPORTANT]
> This attribute has been deprecated and is only supported for legacy applications. Requesting this attribute individually (i.e. attributes=Id,Ti,E) will result in all extended metadata attributes being returned in a *serialized JSON string*</br></br>All attributes contained in the extended metadata are now available as a top-level attribute and can be requested as such (i.e. attributes=Id,Ti,DOI,IA)

> [!IMPORTANT]
> Support for requesting individual extended attributes by using the "E." scope, i.e. "E.DN" is being deprecated. While this is still technically supported, requesting individual extended attributes using the "E." scope will result in the attribute value being returned in two places in the JSON response, as part of the "E" object and as a top level attribute.

Name | Description | Type | Operations
--- | --- | --- | ---
PC | Total number of publications written in affiliation with this entity | Int32 | None
