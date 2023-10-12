---
title: 'Tools used for synchronization'
description: This article introduces the various tools that can be used to synchronize the cloud with on-premises environments.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/11/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Tools used for synchronization
 The following article briefly describes the Microsoft tools that current exist today for synchronization. 

## List of tools 

- **Cloud sync and the provisioning agent** - Microsoft Entra Cloud Sync is the newest offering from Microsoft designed to meet and accomplish your hybrid identity goals for synchronization of users, groups, and contacts to Microsoft Entra ID.  It uses the light-weight provisioning agent and fully configurable via through the portal.  For more information, see [What is cloud sync?](cloud-sync/what-is-cloud-sync.md) and [What is the provisioning agent?](cloud-sync/what-is-provisioning-agent.md)

- **Connect sync** - Microsoft Entra Connect is an on-premises Microsoft application that's designed to meet and accomplish your hybrid identity goals.  For more information, see [What is Microsoft Entra Connect?](connect/whatis-azure-ad-connect-v2.md).

- **Microsoft Identity Manager with the Graph connector** - Microsoft's on-premises identity and access management solution that provides advanced inter-directory provisioning to achieve hybrid identity environments for Active Directory, Microsoft Entra ID, and other directories.  For more information, see [Microsoft Identity Manager](/microsoft-identity-manager/microsoft-identity-manager-2016).  MIM is slowly being deprecated and should only be used in advanced scenarios.  For more information, see [Deprecated Features and planning for the future](/microsoft-identity-manager/microsoft-identity-manager-2016-deprecated-features)

- **ECMA Host connector** - The ECMA host works with the provisioning agent to provision and synchronize users from the cloud into on-premises applications such as SQL and LDAP. For more information, see [Microsoft Entra on-premises application identity provisioning architecture](../app-provisioning/on-premises-application-provisioning-architecture.md) and [What is the provisioning agent?](cloud-sync/what-is-provisioning-agent.md)

## Selecting the right tool
Each of these tools can accomplish similar results.  So selecting the right tool is essential.  For most scenarios, cloud sync is going to be the recommended tool.  Then connect sync and for advanced/complex scenarios, MIM.  For on-premises applications, the ECMA Host would be the preferred tool.  For more information, [see the supported sync scenarios table](common-scenarios.md#supported-sync-scenarios).   To determine which tool is right for you, you should use the wizard at the [Choosing the right sync tool](https://setup.microsoft.com/azure/add-or-sync-users-to-azure-ad) site.

## Next steps
- [Common scenarios](common-scenarios.md)
- [Choosing the right sync tool](https://setup.microsoft.com/azure/add-or-sync-users-to-azure-ad)
- [Steps to start](get-started.md)
- [Prerequisites](prerequisites.md)
