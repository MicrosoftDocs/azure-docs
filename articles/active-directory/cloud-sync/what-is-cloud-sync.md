---
title: 'What is Azure AD Connect cloud sync. | Microsoft Docs'
description: Describes Azure AD Connect cloud sync.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 12/11/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# What is Azure AD Connect cloud sync?
Azure AD Connect cloud sync is new offering from Microsoft designed to meet and accomplish your hybrid identity goals for synchronization of users, groups and contacts to Azure AD.  It accomplishes this by using the Azure AD cloud provisioning agent instead of the Azure AD Connect application.  However, it can be used alongside Azure AD Connect sync and it provides the following benefits:
    
- Support for synchronizing to an Azure AD tenant from a multi-forest disconnected Active Directory forest environment: The common scenarios include merger & acquisition (where the acquired company's AD forests are isolated from the parent company's AD forests), and companies that have historically had multiple AD forests.
- Simplified installation with light-weight provisioning agents: The agents act as a bridge from AD to Azure AD, with all the sync configuration managed in the cloud. 
- Multiple provisioning agents can be used to simplify high availability deployments, particularly critical for organizations relying upon password hash synchronization from AD to Azure AD.
- Support for large groups with up to 50K members. It is recommended to use only the OU scoping filter when synchronizing large groups.


![What is Azure AD Connect](media/what-is-cloud-sync/architecture-1.png)

## How is Azure AD Connect cloud sync different from Azure AD Connect sync?
With Azure AD Connect cloud sync, provisioning from AD to Azure AD is orchestrated in Microsoft Online Services. An organization only needs to deploy, in their on-premises or IaaS-hosted environment, a light-weight agent that acts as a bridge between Azure AD and AD. The provisioning configuration is stored in Azure AD and managed as part of the service.

## Azure AD Connect cloud sync video
The following short video provides an excellent overview of Azure AD Connect cloud sync:

> [!VIDEO https://youtube.com/embed/mOT3ID02_YQ]


## Comparison between Azure AD Connect and cloud sync

The following table provides a comparison between Azure AD Connect and Azure AD Connect cloud sync:

| Feature | Azure Active Directory Connect sync| Azure Active Directory Connect cloud sync |
|:--- |:---:|:---:|
|Connect to single on-premises AD forest|● |● |
| Connect to multiple on-premises AD forests |● |● |
| Connect to multiple disconnected on-premises AD forests | |● |
| Lightweight agent installation model | |● |
| Multiple active agents for high availability | |● |
| Connect to LDAP directories|●| | 
| Support for user objects |● |● |
| Support for group objects |● |● |
| Support for contact objects |● |● |
| Support for device objects |● | |
| Allow basic customization for attribute flows |● |● |
| Synchronize Exchange online attributes |● |● |
| Synchronize extension attributes 1-15 |● |● |
| Synchronize customer defined AD attributes (directory extensions) |● | |
| Support for Password Hash Sync |●|●|
| Support for Pass-Through Authentication |●||
| Support for federation |●|●|
| Seamless Single Sign-on|● |●|
| Supports installation on a Domain Controller |● |● |
| Support for Windows Server 2016|● |● |
| Filter on Domains/OUs/groups |● |● |
| Filter on objects' attribute values |● | |
| Allow minimal set of attributes to be synchronized (MinSync) |● |● |
| Allow removing attributes from flowing from AD to Azure AD |● |● |
| Allow advanced customization for attribute flows |● | |
| Support for writeback (passwords, devices, groups) |● | |
| Azure AD Domain Services support|● | |
| [Exchange hybrid writeback](../hybrid/reference-connect-sync-attributes-synchronized.md#exchange-hybrid-writeback) |● | |
| Unlimited number of objects per AD domain |● | |
| Support for up to 150,000 objects per AD domain |● |● |
| Groups with up to 50,000 members |● |● |
| Large groups with up to 250,000 members |● |  |
| Cross domain references|● | |
| On-demand provisioning|● |● |

## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [Install cloud sync](how-to-install.md)
