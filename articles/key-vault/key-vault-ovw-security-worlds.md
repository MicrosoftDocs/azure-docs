---
ms.assetid: 
title: Azure Key Vault security worlds | Microsoft Docs
ms.service: key-vault
author: BrucePerlerMS
ms.author: bruceper
manager: mbaldwin
ms.date: 05/10/2017
---
# Azure Key Vault security worlds and geographic boundaries

Azure Key Vault is a multi-tenant service and uses a pool of Hardware Security Modules (HSMs) in each Azure location. 

All HSMs at Azure locations in the same geographic region share the same cryptographic boundary (Thales Security World). For example, East US and West US share the same security world because they belong to the US geo location. Similarly, all Azure locations in Japan share the same security world and all Azure locations in Australia, India, and so on. 

A backup taken of a key from a key vault in one Azure location can be restored to a key vault in another Azure location, as long as both of these conditions are true:

- Both of the Azure locations belong to the same geographical location
- Both of the key vaults belong to the same Azure subscription

For example, a backup taken by a given subscription of a key in a key vault in West India, can only be restored to another key vault in the same subscription and geo location; West India, Central India or South India. 


