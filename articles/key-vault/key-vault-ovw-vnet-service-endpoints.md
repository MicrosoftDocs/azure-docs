---
ms.assetid: 
title: VNET Service Endpoints for Azure Key Vault | Microsoft Docs
ms.service: key-vault
author: amitbapat
ms.author: ambapat
manager: mbaldwin
ms.date: 08/09/2018
---
# Virtual Network Service Endopints for Azure Key Vault

The Virtual Network Service Endpoints for Key Vault allow customers to restrict access to key vault to specified Virtual Network and/or a list of IPv4 (Internet Protocol version 4) address ranges. Any caller connecting to that key vault from outside those sources will be denied access to this key vault. If customer has opted-in to allow "Trusted Microsoft services" such as Office 365 Exchange Online, Office 365 SharePoint Online, Azure compute, Azure Resource Manager, Azure Backup etc., connections from those services will be let through the firewall. Of course such callers still need to present a valid AAD token and must have the permissions to perform the requested operation. Read more technical details about [Virtual Network Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview).


## Backup and restore behavior

A backup taken of a key from a key vault in one Azure location can be restored to a key vault in another Azure location, as long as both of these conditions are true:

- Both of the Azure locations belong to the same geographical location
- Both of the key vaults belong to the same Azure subscription

For example, a backup taken by a given subscription of a key in a key vault in West India, can only be restored to another key vault in the same subscription and geo location; West India, Central India or South India.

## Regions and products

- [Azure regions](https://azure.microsoft.com/regions/)
- [Microsoft products by region](https://azure.microsoft.com/regions/services/)

Regions are mapped to security worlds, shown as major headings in the tables:

In the products by region article, for example, the **Americas** tab contains EAST US, CENTRAL US, WEST US all mapping to the Americas region. 

>[!NOTE]
>An exception is that US DOD EAST and US DOD CENTRAL have their own security worlds. 

Similarly, on the **Europe** tab, NORTH EUROPE and WEST EUROPE both map to the Europe region. The same is also true on the **Asia Pacific** tab.



