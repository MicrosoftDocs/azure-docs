---
title: Azure Key Vault security worlds | Microsoft Docs
description: Azure Key Vault is a multi-tenant service. It uses a pool of HSMs in each Azure region. All regions in a geographic region share a cryptographic boundary.
ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
author: msmbaldwin
ms.author: mbaldwin
ms.date: 07/03/2017
---
# Azure Key Vault security worlds and geographic boundaries

Azure products are available in a number of [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/), with each Azure geography containing one or more regions. For example, the Europe geography contains two regions -- North Europe and West Europe -- while the sole region in the Brazil geography is Brazil South.

Azure Key Vault is a multi-tenant service that uses a pool of Hardware Security Modules (HSMs). All HSMs in a geography share the same cryptographic boundary, referred to as a "security world". Every geography corresponds to a single security world, and vice versa.

East US and West US share the same security world because they belong to the geography (United States). Similarly, all Azure regions in Japan share the same security world, as do all Azure regions in Australia, and so forth.

>[!NOTE]
> An exception is that US DOD EAST and US DOD CENTRAL have their own security worlds.

## Backup and restore behavior

A backup taken of a key from a key vault in one Azure region can be restored to a key vault in another Azure region, as long as both of these conditions are true:

- Both of the Azure regions belong to the same geography.
- Both of the key vaults belong to the same Azure subscription.

For example, a backup taken of a key in a West India key vault can be restored to another key vault in the same subscription in the India geography (the West India, Central India, and South India regions).

## Next steps

- See [Microsoft products by region](https://azure.microsoft.com/regions/services/)
