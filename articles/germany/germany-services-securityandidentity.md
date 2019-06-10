---
title: Azure Germany security and identity services | Microsoft Docs
description: Provides a comparison of security and identity services for Azure Germany
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

# Azure Germany security and identity services
## Key Vault
For details on the Azure Key Vault service and how to use it, see the [Key Vault global documentation](../key-vault/index.yml).

Key Vault is generally available in Azure Germany. As in global Azure, there is no extension, so Key Vault is available through PowerShell and CLI only.

## Azure Active Directory
Azure Active Directory offers identity and access capabilities for information systems running in Microsoft Azure. By using directory services, security groups, and group policy, you can help control the access and security policies of the machines that use Azure Active Directory. You can use accounts and security groups, along with role-based access control (RBAC), to help manage access to the information systems. 

Azure Active Directory is generally available in Azure Germany.

### Variations

* Azure Active Directory in Azure Germany is completely separated from Azure Active Directory in global Azure. 
* Customers cannot use a Microsoft account to sign in to Azure Germany.
* The login suffix for Azure Germany is *onmicrosoft.de* (not *onmicrosoft.com* like in global Azure).
* Customers need a separate subscription to work in Azure Germany.
* Customers in Azure Germany cannot access resources that require a subscription or identity in global Azure.
* Customers in global Azure cannot access resources that require a subscription or identity in Azure Germany.
* Additional domains can be added/verified only in one of the cloud environments.
 
> [!NOTE]
> Assigning rights to users from other tenants with *both tenants inside Azure Germany* is not yet available.


## Next steps
For supplemental information and updates, subscribe to the 
[Azure Germany blog](https://blogs.msdn.microsoft.com/azuregermany/).




