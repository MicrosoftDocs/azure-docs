---
title: Contact asset filters
titleSuffix: Defender EASM contact asset filters 
description: This article outlines the filter functionality available in Microsoft Defender External Attack Surface Management for contact assets specifically, including operators and applicable field values.
author: danielledennis
ms.author: dandennis
ms.service: defender-easm
ms.date: 12/14/2022
ms.topic: how-to
---

# Contact asset filters 

These filters specifically apply to contact assets. Use these filters when searching for a specific contact. 


## Free form filters  

The following filters require that the user manually enters the value with which they want to search.  This list is organized by the number of applicable operators for each filter, then alphabetically. Many of these values are case-sensitive.

|       Filter name  |     Description                                 |     Value format    |     Applicable operators                                                                                                                                                                                                                              |
|--------------------|-------------------------------------------------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     Whois Email    |   The primary contact email in a Whois record.  |   name@domain.com   |   `Equals` `Not Equals` `Starts with` `Does not start with` `Matches` `Does Not Match` `In` `Not in` `Starts with in` `Does not start with in` `Matches in` `Does not match in` `Contains` `Does Not Contain` `Contains In` `Does Not Contain In` `Empty` `Not Empty`    |



## Next steps 
[Understanding asset details](understanding-asset-details.md)

[Inventory filters](inventory-filters.md) 
