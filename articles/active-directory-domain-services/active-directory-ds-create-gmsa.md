---
title: 'Azure Active Directory Domain Services: Create a group managed service account | Microsoft Docs'
description: Administer Azure Active Directory Domain Services managed domains
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mtillman
editor: curtand

ms.assetid: e6faeddd-ef9e-4e23-84d6-c9b3f7d16567
ms.service: active-directory
ms.component: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/26/2018
ms.author: maheshu

---
# Create a group managed service account (gMSA) on an Azure AD Domain Services managed domain
This article shows you how to create managed service accounts on an Azure AD Domain Services managed domain.

## Managed Service Accounts
A standalone Managed Service Account (sMSA) is a managed domain account that provides automatic password management, simplified service principal name (SPN) management and the ability to delegate the management to other administrators. This type of managed service account (MSA) was introduced in Windows Server 2008 R2 and Windows 7.

The group Managed Service Account (gMSA) provides the same functionality within the domain but also extends that functionality over multiple servers. When connecting to a service hosted on a server farm, such as Network Load Balanced solution, the authentication protocols supporting mutual authentication require that all instances of the services use the same principal. When a gMSA is used as service principal, the Windows operating system manages the password for the account instead of relying on the administrator to manage the password.

**More information:**
- [Group Managed Service Accounts Overview](https://docs.microsoft.com/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview)
- [Getting started with Group Managed Service Accounts](https://docs.microsoft.com/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts)


## Using service accounts in Azure AD Domain services
Azure AD Domain Services managed domains are locked down and managed by Microsoft. There are a couple of key considerations when using service accounts with Azure AD Domain Services.

### Create service accounts within custom organizational units (OU) on the managed domain
You cannot create a service account in the built-in 'AADDC Users' or 'AADDC Computers' organizational units. [Create a custom OU](active-directory-ds-admin-guide-create-ou.md) on your managed domain and then create service accounts within that custom OU.

### The Key Distribution Services (KDS) root key is already pre-created
The Key Distribution Services (KDS) root key is pre-created on an Azure AD Domain Services managed domain. You do not need to create a KDS root key and do not have privileges to do so either. You cannot view the KDS root key on the managed domain either.


## Next steps
- [Create a custom OU on a managed domain](active-directory-ds-admin-guide-create-ou.md)
- [Group Managed Service Accounts Overview](https://docs.microsoft.com/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview)
- [Getting started with Group Managed Service Accounts](https://docs.microsoft.com/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts)
