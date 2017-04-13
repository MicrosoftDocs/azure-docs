---
title: Azure Germany Security + Identity | Microsoft Docs
description: This provides a comparision of security and identity services for Azure Germany
services: germany
cloud: na
documentationcenter: na
author: gitralf
manager: rainerst

ms.assetid: na
ms.service: germany
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/13/2017
ms.author: ralfwi
---

# Azure Germany Security + Identity
## Key Vault
For details on this service and how to use it, see the [Azure Key Vault public documentation](../key-vault/index.md).

Key Vault is generally available in Azure Germany. As in public, there is no extension, so Key Vault is available through PowerShell and CLI only.

## Azure Active Directory
Azure Active Directory is generally available in Azure Germany.

### Variations

* Azure Active Directory in Azure Germany is completely separated from Azure Active Directory in global cloud. 
* Customers cannot use a Microsoft account (LiveID) to login to Azure Germany
* Login suffix for Azure Germany is *onmicrosoft.de* (and not *onmicrosoft.com* like in global Azure)
* Customers need a separate subscription to work in Azure Germany
* Customers in Azure Germany cannot access resources that require a subscription or identity in global Azure
* Customers in global Azure cannot access resources that require a subscription or identity in Azure Germany.
* Additional domains can only be added/verified in one of the cloud environments
 


## Next Steps
For supplemental information and updates, subscribe to the 
[Azure Germany Blog](https://blogs.msdn.microsoft.com/azuregermany/)




