---
title: Domain asset filters
titleSuffix: Defender EASM domain asset filters 
description: This article outlines the filter functionality available in Microsoft Defender External Attack Surface Management for domain assets specifically, including operators and applicable field values.
author: danielledennis
ms.author: dandennis
ms.service: defender-easm
ms.date: 12/14/2022
ms.topic: how-to
---

# Domain asset filters 

These filters specifically apply to domain assets. Use these filters when searching for a specific subset of domain assets.  

## Defined value filters  

The following filters provide a drop-down list of options to select. The available values are predefined. 

|       Filter name      |     Description                                                                                                |     Value format example                                                                     |     Applicable operators          |
|------------------------|----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|-----------------------------------|
|     Parked Domain      |   Indicates whether a website is registered but not connected to an online service (website, email hosting).   |   true / false                                                                               |   `Equals` `Not Equals`              |
|     Domain Expiration  |   The registration expiry date range for the domain.                                                           |   Expired, Expires in 30 days, Expires in 60 days, Expires in 90 days, Expires in > 90 days  |   `Equals` `Not Equals` `In` `Not In`  |



## Free form filters  

The following filters require that the user manually enters the value with which they want to search. This list is organized according to the number of applicable operators for each filter, then alphabetically. Note that many values are case-sensitive. 

|       Filter name                  |     Description                                                                              |     Value format example                                                                           |     Applicable operators                                                                                                                                                                                                                            |
|------------------------------------|----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     Domain Status                  |   Any detected domain configurations.                                                        |   clientDeleteProhibited, clientRenewProhibited, clientTransferProhibited, clientUpdateProhibited  |   `Equals` `Not Equals` `Starts with` `Does not start with` `In` `Not In` `Starts with in` `Does not start with in` `Contains` `Does Not Contain` `Contains In` `Does Not Contain In` `Empty` `Not Empty`                                 |                                                                                                                                                                                                                                               |
|     Domain                         |   The domain name of the desired asset(s).                                                   |   Must align with the standard format of domains in inventory:  “domain.tld”                       |   `Equals` `Not Equals` `Starts with` `Does not start with` `Matches` `Does not match` `In` `Not In` `Starts with in` `Does not start with in` `Matches in` `Does not match in` `Contains` `Does Not Contain` `Contains In` `Does Not Contain In` `Empty` `Not Empty`  |
|     Name Server                    |   Any name servers connected to the domain.                                                  |   dns.domain.com                                                                                   |                                                                                                                                                                                                                                                     |
|     Registrar                      |   The name of the registrar within the WhoIs record.                                         |   GODADDY.COM, INC.                                                                                |                                                                                                                                                                                                                                                     |
|     Whois Admin Email              |   The email address of the listed administrator of a Whois record.                           |   name@domain.com                                                                                  |                                                                                                                                                                                                                                                     |
|     Whois Admin Name               |   The name of the listed administrator.                                                      |   John Smith                                                                                       |                                                                                                                                                                                                                                                     |
|     Whois Admin Organization       |   The organization associated with the administrator.                                        |   Contoso Ltd.                                                                                     |                                                                                                                                                                                                                                                     |
|     Whois Email                    |   The primary contact email in a Whois record.                                               |   name@domain.com                                                                                  |                                                                                                                                                                                                                                                     |
|     Whois Registrant email         |   The email address of the listed registrant.                                                |   name@domain.com                                                                                  |                                                                                                                                                                                                                                                     |
|     Whois Registrant Name          |   The name of the listed registrant.                                                         |   John Smith                                                                                       |                                                                                                                                                                                                                                                     |
|     Whois Registrant Organization  |   An organization associated with the listed registrant.                                     |   Contoso Ltd.                                                                                     |                                                                                                                                                                                                                                                     |
|     Whois Technical Email          |   The email address of the listed technical contact.                                         |   name@domain.com                                                                                  |                                                                                                                                                                                                                                                     |
|     Whois Technical Name           |   The name of the listed technical contact.                                                  |   John Smith                                                                                       |                                                                                                                                                                                                                                                     |
|     Whois Technical Organization   |   The organization associated to the listed technical contact.                               |   Contoso Ltd.                                                                                     |     
|     IANA ID                        |   The allocated unique ID for a domain, IP or AS seen within WhoIs, IANA and ICANN records.  |   1005                                                                                             |    `Equals` `Not Equals` `In` `Not In` `Empty` `Not Empty`    |


## Next steps 
[Understanding asset details](understanding-asset-details.md)

[Inventory filters](inventory-filters.md) 
