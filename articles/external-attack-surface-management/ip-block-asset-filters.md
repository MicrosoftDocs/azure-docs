---
title: IP block asset filters
titleSuffix: Defender EASM IP block asset filters 
description: This article outlines the filter functionality available in Microsoft Defender External Attack Surface Management for IP block assets specifically, including operators and applicable field values.
author: danielledennis
ms.author: dandennis
ms.service: defender-easm
ms.date: 12/14/2022
ms.topic: how-to
---

# IP block asset filters 

These filters specifically apply to IP block assets. Use these filters when searching for a specific subset of IP blocks.  


## Defined value filters

The following filters provide a drop-down list of options to select. The available values are predefined. 

|       Filter name  |     Description                                                                                                         |     Value format  |     Applicable operators  |
|--------------------|-------------------------------------------------------------------------------------------------------------------------|-------------------|---------------------------|
|     IPv4           |   Indicates that the host resolves to a 32-bit number notated in four octets (example: 192.168.92.73).                      |   true / false    |   `Equals` `Not Equals`      |
|     IPv6           |   Indicates that the host resolves to an IP comprised of 128-bit hexadecimal digits noted in 4-digit groups.   |   true / false    |                           |


 

## Free form filters  

The following filters require that the user manually enters the value with which they want to search.  This list is organized according to the number of applicable operators for each filter, then alphabetically.  

|       Filter name                  |     Description                                                                                                                                                                                          |     Value format      |     Applicable operators                                                                                                                                                                    |
|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     ASN                            |   Autonomous System Number is a network identification for transporting data on the Internet between Internet routers. An ASN is associated to any public IP blocks tied to it where hosts are located.  |   12345               |   `Equals` `Not Equals` `In` `Not In` `Empty` `Not Empty`                                                                                                                                          |
|     BGP Prefix                     |   Any text values in the BGP prefix.                                                                                                                                                                     |   123 4567 89 192.168.92.73/16            |   `Equals` `Not Equals` `Starts with` `Does not start with` `In` `Not in` `Starts with in` `Does not start with in` `Contains` `Does Not Contain` `Contains In` `Does Not Contain In` `Empty` `Not Empty`  |
|     IP Block                       |   The IP block that is associated with the asset.                                                                                                                                                        |   192.168.92.73/16    |                                                                                                                                                                                             |
|     Whois Admin Email              |   The email address of the listed administrator of a Whois record.                                                                                                                                       |   name@domain.com     |                                                                                                                                                                                             |
|     Whois Admin Name               |   The name of the listed administrator.                                                                                                                                                                  |   John Smith          |                                                                                                                                                                                             |
|     Whois Admin Organization       |   The organization associated with the administrator.                                                                                                                                                    |   Contoso Ltd.        |                                                                                                                                                                                             |
|     Whois Email                    |   The primary contact email in a Whois record.                                                                                                                                                           |   name@domain.com     |                                                                                                                                                                                             |
|     Whois Registrant Email         |   The email address of the listed registrant.                                                                                                                                                            |   name@domain.com     |                                                                                                                                                                                             |
|     Whois Registrant Name          |   The name of the listed registrant.                                                                                                                                                                     |   John Smith          |                                                                                                                                                                                             |
|     Whois Registrant Organization  |   An organization associated with the listed registrant.                                                                                                                                                 |   Contoso Ltd.        |                                                                                                                                                                                             |
|     Whois Technical Email          |   The email address of the listed technical contact.                                                                                                                                                     |   name@domain.com     |                                                                                                                                                                                             |
|     Whois Technical Name           |   The name of the listed technical contact.                                                                                                                                                              |   John Smith          |                                                                                                                                                                                             |
|     Whois Technical Organization   |   The organization associated to the listed technical contact.                                                                                                                                           |   Contoso Ltd.        |                                                                                                                                                                                             |



## Next steps 
[Understanding asset details](understanding-asset-details.md)

[Inventory filters](inventory-filters.md) 
