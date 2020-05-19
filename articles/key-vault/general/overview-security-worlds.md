---
title: Azure Key Vault security worlds | Microsoft Docs
description: Azure Key Vault is a multi-tenant service. It uses a pool of HSMs in each Azure location. All locations in a geographic region share a cryptographic boundary.
ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
author: msmbaldwin
ms.author: mbaldwin
manager: rkarlin
ms.date: 07/03/2017
---
# Azure Key Vault security worlds and geographic boundaries

Azure Key Vault is a multi-tenant service and uses a pool of Hardware Security Modules (HSMs) in each Azure location. 

All HSMs at Azure locations in the same geographic region share the same cryptographic boundary (Thales Security World). For example, East US and West US share the same security world because they belong to the US geo location. Similarly, all Azure locations in Japan share the same security world and all Azure locations in Australia, India, and so on. 

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



