---
title: 'What is inter-directory provisioning with Microsoft Entra ID?'
description: Describes overview of identity inter-directory provisioning.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 01/19/2023
ms.subservice: compliance
ms.author: billmath
ms.collection: M365-identity-device-management
---

# What is inter-directory provisioning?

A directory is a shared information infrastructure, that is used for locating, managing, administering, and organizing items and network resources.  Examples of applications that use directory services are Microsoft Active Directory and Microsoft Entra ID.  Identities help directory systems make determinations such as who has access to what, and who is allowed to use specific resources.

Inter-directory provisioning is provisioning an identity between two different directory services systems.   The most common scenario for inter-directory provisioning is when a user already in Active Directory is provisioned into Microsoft Entra ID. This provisioning can be accomplished by agents such as Microsoft Entra Connect Sync or Microsoft Entra Connect cloud provisioning.

Inter-directory provisioning allows us to create [hybrid identity](whatis-hybrid-identity.md) environments.

<a name='what-types-of-inter-directory-provisioning-does-azure-ad-support'></a>

## What types of inter-directory provisioning does Microsoft Entra ID support

Microsoft Entra ID currently supports three methods for accomplishing inter-directory provisioning. These methods are:

- [Microsoft Entra Connect cloud sync](./cloud-sync/what-is-cloud-sync.md) -a new Microsoft agent designed to meet and accomplish your hybrid identity goals.  It is provides a light-weight inter -directory provisioning experience between Active Directory and Microsoft Entra ID and is configured via the portal.

- [Microsoft Entra Connect](./connect/whatis-azure-ad-connect.md) - the Microsoft tool designed to meet and accomplish your hybrid identity, including inter-directory provisioning from Active Directory to Microsoft Entra ID.

- [Microsoft Identity Manager](/microsoft-identity-manager/microsoft-identity-manager-2016) - Microsoft's on-premises identity and access management solution that helps you manage the users, credentials, policies, and access within your organization. Additionally, MIM provides advanced inter-directory provisioning to achieve hybrid identity environments for Active Directory, Microsoft Entra ID, and other directories.

### Key benefits

This capability of inter-directory provisioning offers the following significant business benefits:

- [Password hash synchronization](./connect/whatis-phs.md) - A sign-in method that synchronizes a hash of a users on-premises AD password with Microsoft Entra ID.
- [Pass-through authentication](./connect/how-to-connect-pta.md) - A sign-in method that allows users to use the same password on-premises and in the cloud, but doesn't require the additional infrastructure of a federated environment.
- [Federation integration](./connect/how-to-connect-fed-whatis.md) - can be used to configure a hybrid environment using an on-premises AD FS infrastructure. It also provides AD FS management capabilities such as certificate renewal and additional AD FS server deployments.
- [Synchronization](./connect/how-to-connect-sync-whatis.md) - Responsible for creating users, groups, and other objects.  As well as, making sure identity information for your on-premises users and groups is matching the cloud.  This synchronization also includes password hashes.
- [Health Monitoring](./connect/whatis-azure-ad-connect.md) - can provide robust monitoring and provide a central location in the [Microsoft Entra admin center](https://entra.microsoft.com) to view this activity. 

## Next steps 
- [What is identity lifecycle management](../governance/what-is-identity-lifecycle-management.md)
- [What is provisioning?](what-is-provisioning.md)
- [What is HR driven provisioning?](../app-provisioning/what-is-hr-driven-provisioning.md)
- [What is app provisioning?](../app-provisioning/user-provisioning.md)
