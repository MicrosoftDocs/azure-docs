---
title: 'What is federation with Microsoft Entra ID?'
description: Describes federation with Microsoft Entra ID.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: overview
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# What is federation with Microsoft Entra ID?

Federation is a collection of domains that have established trust. The level of trust may vary, but typically includes authentication and almost always includes authorization. A typical federation might include a number of organizations that have established trust for shared access to a set of resources.

You can federate your on-premises environment with Microsoft Entra ID and use this federation for authentication and authorization.  This sign-in method ensures that all user authentication occurs on-premises.  This method allows administrators to implement more rigorous levels of access control. Federation with AD FS and PingFederate is available.

![Federated identity](../media/whatis-hybrid-identity/federated-identity.png)


> [!TIP]
> If you decide to use Federation with Active Directory Federation Services (AD FS), you can optionally set up password hash synchronization as a backup in case your AD FS infrastructure fails.


## Next Steps

- [What is hybrid identity?](./../whatis-hybrid-identity.md)
- [What is Microsoft Entra Connect and Connect Health?](whatis-azure-ad-connect.md)
- [What is password hash synchronization?](whatis-phs.md)
- [What is federation?](whatis-fed.md)
- [What is single-sign on?](how-to-connect-sso.md)
- [How federation works](how-to-connect-fed-whatis.md)
- [Federation with PingFederate](how-to-connect-install-custom.md#configuring-federation-with-pingfederate)
