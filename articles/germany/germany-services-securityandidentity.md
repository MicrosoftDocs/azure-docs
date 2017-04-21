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
For details on this service and how to use it, see the [Azure Key Vault global documentation](../key-vault/index.md).

Key Vault is generally available in Azure Germany. As in global Azure, there is no extension, so Key Vault is available through PowerShell and CLI only.

## Azure Active Directory
Azure Active Directory offers identity and access capabilities for information systems running in Microsoft Azure. Through the use of directory services, security groups, and group policy, customers can help control the access and security policies of the machines that make use of Azure Active Directory. Accounts and security groups can be used to help manage access to the information system. 

Azure Active Directory security groups and directory services can help implement role-based access control (RBAC) access control schemes, and control access to the information system.

Azure Active Directory is generally available in Azure Germany.

### Variations

* Azure Active Directory in Azure Germany is completely separated from Azure Active Directory in global Azure. 
* Customers cannot use a Microsoft account (LiveID) to login to Azure Germany.
* Login suffix for Azure Germany is *onmicrosoft.de* (and not *onmicrosoft.com* like in global Azure).
* Customers need a separate subscription to work in Azure Germany.
* Customers in Azure Germany cannot access resources that require a subscription or identity in global Azure.
* Customers in global Azure cannot access resources that require a subscription or identity in Azure Germany.
* Additional domains can only be added/verified in one of the cloud environments.
 
> [!NOTE]
> Assigning rights to users from other tenants with **both tenants inside Azure Germany** is not yet available.


## Next steps
For supplemental information and updates, subscribe to the 
[Azure Germany Blog](https://blogs.msdn.microsoft.com/azuregermany/).




