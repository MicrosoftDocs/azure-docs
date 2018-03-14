---
title: Identity architecture for Azure Stack | Microsoft Docs
description: Learn about the Identity architecture you can use with Azure Stack.
services: azure-stack
documentationcenter: ''
author: brenduns
manager: femila
editor: ''

ms.assetid:  
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 2/28/2018
ms.author: brenduns
ms.reviewer:
---


# Identity architecture for Azure Stack
Before you choose an identity provider to use with Azure Stack, understand important differences between the options of Azure Active Directory (Azure AD) and Active Directory Federated Services (AD FS). 

## Capabilities and limitations 
The identity provider you choose can limit your options, including support for multi-tenancy. 

  

|Capability or scenario        |Azure AD  |AD FS  |
|------------------------------|----------|-------|
|Connected to the internet     |Yes       |Optional|
|Support for multi-tenancy     |Yes       |No      |
|Marketplace syndication       |Yes       |Yes - Requires use of the [offline Marketplace Syndication](azure-stack-download-azure-marketplace-item.md#download-marketplace-items-in-a-disconnected-or-a-partially-connected-scenario-with-limited-internet-connectivity) tool.|
|Support for Active Directory Authentication Library (ADAL) |Yes |Yes|
|Support for tools like Azure command-line interface (CLI), Visual Studio (VS), and PowerShell  |Yes |Yes|
|Create service principals through the portal     |Yes |No|
|Create service principals with certificates      |Yes |Yes|
|Create service principals with Secrets (Keys)    |Yes |No|
|Applications can use the Graph service           |Yes |No|
|Applications can use identity provider for sign-in |Yes |Yes -  Requires applications to federate with your on-premises AD FS. |

## Topologies
The following sections provide information about identity topologies you can use.

### Azure AD – single-tenant 
By default, when you install Azure Stack and use Azure AD, Azure Stack uses a single-tenant topology. 

A single-tenant topology is useful when:
- All users are part of the same tenant.
- A service provider hosts an Azure Stack instance for an organization.  

![Azure Stack topology using a single tenant topology with Azure AD](media/azure-stack-identity-architecture/single-tenant.png)

With this topology:
- Azure Stack registers all applications and services to the same Azure AD tenant directory. 
- Azure Stack authenticates only the users and applications from that directory, including Tokens. 
- Identities for administrators (cloud operators) and tenant users are in the same directory tenant. 
- To enable a user from another directory to access this Azure Stack environment, you must [invite the user as a guest](azure-stack-identity-overview.md#guest-users) to the tenant directory.  

### Azure AD – multi-tenant
Cloud operators can configure Azure Stack to allow access to applications by tenants from one or more organizations. Users access applications through the user portal. In this configuration, the Admin portal (used by the cloud operator) is limited to users from a single directory. 

A multi-tenant topology is useful when:
- A service provider wants to allow users from multiple organizations to access Azure Stack.

![Azure Stack topology using a multi-tenant topology with Azure AD](media/azure-stack-identity-architecture/multi-tenant.png)

With this topology:
- Access to resources should be on a per-organization basis. 
- Users from one organization should not be able to grant access to resources to users who are outside their organization.  
- Identities for administrators (cloud operators) can be in a separate directory tenant than the identities for users. This separation provides account isolation at the identity provider level. 
 
### AD FS  
The AD FS topology is required when either of the following conditions is true:
- Azure Stack does not connect to the Internet.
- Azure Stack can connect to the Internet, but you choose to use AD FS for your identity provider.
  
![Azure Stack topology using AD FS](media/azure-stack-identity-architecture/adfs.png)

With this topology:
- To support use in production, you must integrate the built-in Azure Stack AD FS instance with an existing AD FS instance backed by Active Directory (AD), through a federation trust. 
- You can integrate the Graph service in Azure Stack with your existing AD.  You can also use the OData based Graph API service that supports APIs that are consistent with the Azure AD Graph API.  

  To interact with your AD, the Graph API requires user credentials from your AD that have read-only permission your AD. 
  - The built-in AD FS is based on Server 2016. 
  - Your AD FS and AD must be based on Server 2012 or later.  
  
  Between your AD and the built-in AD FS, interactions aren't restricted to OpenID Connect, and can use any mutually supported protocol.  
  - User accounts are created and managed in your on-premises AD.
  - Service principals and registrations for applications are managed in the built-in AD.



## Next steps
- [Identity overview](azure-stack-identity-overview.md)   
- [Datacenter integration - Identity](azure-stack-integrate-identity.md)