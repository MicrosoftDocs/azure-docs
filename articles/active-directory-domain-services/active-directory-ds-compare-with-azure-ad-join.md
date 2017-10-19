---
title: 'Compare Azure AD Join and Azure Active Directory Domain Services | Microsoft Docs'
description: Deciding between Azure AD Join and Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mahesh-unnikrishnan
editor: curtand

ms.assetid: 31a71d36-58c1-4839-b958-80da0c6a77eb
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/19/2017
ms.author: maheshu
---

# Choose between Azure Active Directory join and Azure Active Directory Domain Services
This article describes differences between Azure AD join and Azure AD Domain Services.

## Key differences
| **Aspect** | **Azure AD Join** | **Azure AD Domain Services** |
|:---| --- | --- |
| Trust with directory | Azure AD Join | Active Directory domain join |
| Representation in the directory | Device objects in the Azure AD directory. | Computer objects in AAD-DS managed domain. |
| Authentication | OAuth/OpenID Connect based | Kerberos, NTLM |
| Management | Mobile Device Management (MDM) software like Intune | Group Policy |
| Networking | Works over the internet | Requires machines to be on the same virtual network as the managed domain.|
| Great for ... | Windows 10 devices | Server virtual machines deployed in Azure |


## Next steps
### Learn more about Azure AD Domain Services
* [Overview of Azure AD Domain Services](active-directory-ds-overview.md)
* [Features](active-directory-ds-features.md)
* [Deployment scenarios](active-directory-ds-scenarios.md)
* [Find out if Azure AD Domain Services suits your use-cases](active-directory-ds-comparison.md)
* [Understand how Azure AD Domain Services synchronizes with your Azure AD directory](active-directory-ds-synchronization.md)

### Learn more about Azure AD Join
* [Introduction to device management in Azure Active Directory](../active-directory/device-management-introduction.md)

### Get started with Azure AD Domain Services
* [Enable Azure AD Domain Services using the Azure portal](active-directory-ds-getting-started.md)
