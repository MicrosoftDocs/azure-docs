---
title: ASN asset filters
titleSuffix: Defender ASN domain asset filters 
description: This article outlines the filter functionality available in Microsoft Defender External Attack Surface Management for ASN assets specifically, including operators and applicable field values.
author: danielledennis
ms.author: dandennis
ms.service: defender-easm
ms.date: 12/14/2022
ms.topic: how-to
---

# ASN asset filters 

These filters specifically apply to ASN assets. Use these filters when searching for a specific ASN or group of ASNs.  


## Free form filters  

The following filters require that the user manually enters the value with which they want to search.  This list is organized according to the number of applicable operators for each filter, then alphabetically.

|       Filter name                  |     Description                                                                                                                                                                                          |     Value format   |     Applicable operators                                                                                                                                                                                                                              |
|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     ASN                            |   Autonomous System Number is a network identification for transporting data on the Internet between Internet routers. An ASN associates any public IP blocks tied to it where hosts are located.  |   12345            |    `Equals` `Not Equals` `In` `Not In` `Empty` `Not Empty`                                                                                                                                                                                                    |
|     Whois Admin Email              |   The email address of the listed administrator of a Whois record.                                                                                                                                       |   name@domain.com  |   `Equals` `Not Equals` `Starts with` `Does not start with` `Matches` `Does Not Match` `In` `Not in` `Starts with in` `Does not start with in` `Matches in` `Does not match in` `Contains` `Does Not Contain` `Contains In` `Does Not Contain In` `Empty` `Not Empty`    |
|     Whois Admin Name               |   The name of the listed administrator.                                                                                                                                                                  |   John Smith       |                                                                                                                                                                                                                                                       |
|     Whois Admin Organization       |   The organization associated with the administrator.                                                                                                                                                    |   Contoso Ltd.     |                                                                                                                                                                                                                                                       |
|     Whois Email                    |   The primary contact email in a Whois record.                                                                                                                                                           |   name@domain.com  |                                                                                                                                                                                                                                                       |
|     Whois Registrant Email         |   The email address of the listed registrant.                                                                                                                                                            |   name@domain.com  |                                                                                                                                                                                                                                                       |
|     Whois Registrant Name          |   The name of the listed registrant.                                                                                                                                                                     |   John Smith       |                                                                                                                                                                                                                                                       |
|     Whois Registrant Organization  |   An organization associated with the listed registrant.                                                                                                                                                 |   Contoso Ltd.     |                                                                                                                                                                                                                                                       |
|     Whois Technical Email          |   The email address of the listed technical contact.                                                                                                                                                     |   name@domain.com  |                                                                                                                                                                                                                                                       |
|     Whois Technical Name           |   The name of the listed technical contact.                                                                                                                                                              |   John Smith       |                                                                                                                                                                                                                                                       |
|     Whois Technical Organization   |   The organization associated to the listed technical contact.                                                                                                                                           |   Contoso Ltd.     |                                                                                                                                                                                                                                                       |



## Next steps 
[Understanding asset details](understanding-asset-details.md)

[Inventory filters](inventory-filters.md) 
