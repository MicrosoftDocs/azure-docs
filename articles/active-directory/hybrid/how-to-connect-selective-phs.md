---
title: 'Selective Password Hash Synchronization for Azure AD Connect'
description: This article describes how to setup and configure selective password hash synchronization to use with Azure AD Connect.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/02/2021
ms.subservice: hybrid
ms.author: billmath
ms.reviewer: 
ms.collection: M365-identity-device-management
---

# Selective Password Hash Synchronization Configuration for Azure AD Connect

[Password hash synchronization](whatis-phs.md) is one of the sign-in methods used to accomplish hybrid identity. Azure AD Connect synchronizes a hash, of the hash, of a user's password from an on-premises Active Directory instance to a cloud-based Azure AD instance.  By default, once it has been setup, password hash synchronization will occur on all of the users you are synchronizing.

If you’d like to have a subset of users excluded from synchronizing their password hash to Azure AD, you can configure selective password hash synchronization using the guided steps provided in this article.

>[!Important]
 Microsoft doesn't support modifying or operating Azure AD Connect sync outside of the configurations or actions that are formally documented. Any of these configurations or actions might result in an inconsistent or unsupported state of Azure AD Connect sync. As a result, Microsoft cannot guarantee that we will be able to provide efficient technical support for such deployments. 


## Consider your implementation  
To reduce the configuration administrative effort, you should first consider the number of user objects you wish to exclude from password hash synchronization. Verify which of the scenarios below, which are mutually exclusive, aligns with your requirements to select the right configuration option for you.
If the number of users to exclude is smaller than the number of users to include, follow the steps in this section .
If the number of users to exclude is greater than the number of users to include, follow the steps in this section.
Important!
With either configuration option chosen, a required initial sync (Full Sync) to apply the changes, will be performed automatically over the next sync cycle.


## Next Steps
- [What is password hash syncronization?](whatis-phs.md)
- [How password hash sync works](how-to-connect-password-hash-synchronization.md)
