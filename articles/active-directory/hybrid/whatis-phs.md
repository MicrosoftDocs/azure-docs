---
title: 'What is password hash synchronization with Azure AD? | Microsoft Docs'
description: Describes password hash synchronization.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 12/05/2018
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# What is password hash synchronization with Azure AD?
Password hash synchronization is one of the sign-in methods used to accomplish hybrid identity. Azure AD Connect synchronizes a hash, of the hash, of a users password from an on-premises Active Directory instance to a cloud-based Azure AD instance.

Password hash synchronization is an extension to the directory synchronization feature implemented by Azure AD Connect sync. You can use this feature to sign in to Azure AD services like Office 365. You sign in to the service by using the same password you use to sign in to your on-premises Active Directory instance.

![What is Azure AD Connect](./media/how-to-connect-password-hash-synchronization/arch1.png)

Password hash synchronization helps by reducing the number of passwords, your users need to maintain to just one. Password hash synchronization can:

* Improve the productivity of your users.
* Reduce your helpdesk costs.  

Optionally, you can set up password hash synchronization as a backup if you decide to use [Federation with Active Directory Federation Services (AD FS)](https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Configuring-AD-FS-for-user-sign-in-with-Azure-AD-Connect) as your sign-in method.

To use password hash synchronization in your environment, you need to:

* Install Azure AD Connect.  
* Configure directory synchronization between your on-premises Active Directory instance and your Azure Active Directory instance.
* Enable password hash synchronization.



For more information, see [What is hybrid identity?](whatis-hybrid-identity.md).




## Next Steps

- [What is hybrid identity?](whatis-hybrid-identity.md)
- [What is Azure AD Connect and Connect Health?](whatis-azure-ad-connect.md)
- [What is pass-through authentication (PTA)?](how-to-connect-pta.md)
- [What is federation?](whatis-fed.md)
- [What is single-sign on?](how-to-connect-sso.md)
- [How Password hash synchronization works](how-to-connect-password-hash-synchronization.md)
