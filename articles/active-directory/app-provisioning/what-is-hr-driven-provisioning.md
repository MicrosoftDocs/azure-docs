---
title: 'What is HR driven provisioning with Microsoft Entra ID?'
description: Describes overview of HR driven provisioning.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 10/20/2022
ms.subservice: compliance
ms.author: billmath
ms.collection: M365-identity-device-management
---

# What is HR driven provisioning?

![HR provisioning](./media/what-is-hr-driven-provisioning/cloud2a.png)

HR driven provisioning is the process of creating digital identities based on a human resources system.  The HR systems, become the start-of-authority for these newly created digital identities and is often the starting point for numerous provisioning processes.  For example, if a new employee joins your company, they are created in the human resource system.  The creation, triggers the provisioning of a user account into Active Directory and then Microsoft Entra Connect provisions this account to Microsoft Entra ID, etc.

HR driven provisioning can be either on-premises based or cloud based.

## On-premises based HR provisioning
On-premises based HR provisioning is accomplished by using a local HR system and a means of provisioning new digital identities.

HR systems come in a variety of packages, software bundles and may use SQL servers, LDAP directories, etc.

Currently, Microsoft on-premises HR provisioning solutions use Microsoft Identity Manager to trigger provisioning when a new identity is created in these HR systems.

Using MIM, you can provision users from your on-premises HR systems to Active Directory or Microsoft Entra ID.

For information on Microsoft Identity Manager and the systems it supports see the [Microsoft Identity Manager](/microsoft-identity-manager/microsoft-identity-manager-2016) documentation.

[!INCLUDE [active-directory-hr-provisioning.md](../../../includes/active-directory-hr-provisioning.md)]


## Next steps 
- [What is identity lifecycle management](../governance/what-is-identity-lifecycle-management.md)
- [What is provisioning?](../governance/what-is-provisioning.md)
- [What is app provisioning?](../app-provisioning/user-provisioning.md)
- [What is inter-directory provisioning?](../hybrid/what-is-inter-directory-provisioning.md)
