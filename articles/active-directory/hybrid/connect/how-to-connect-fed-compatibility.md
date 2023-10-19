---
title: Microsoft Entra federation compatibility list
description: This page has non-Microsoft identity providers that can be used to implement single sign-on.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
ms.assetid: 22c8693e-8915-446d-b383-27e9587988ec
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra federation compatibility list
Microsoft Entra ID provides single-sign on and enhanced application access security for Microsoft 365 and other Microsoft Online services for hybrid and cloud-only implementations without requiring any third-party solution. Microsoft 365, like most of Microsoft’s Online services, is integrated with Microsoft Entra ID for directory services, authentication, and authorization. Microsoft Entra ID also provides single sign-on to thousands of SaaS applications and on-premises web applications. See the Microsoft Entra ID [application gallery](https://azuremarketplace.microsoft.com/marketplace/apps/category/azure-active-directory-apps) for supported SaaS applications. 

## IDP Validation
If your organization uses a third-party federation solution, you can configure single sign-on for your on-premises Active Directory users with Microsoft Online services, such as Microsoft 365, provided the third-party federation solution is compatible with Microsoft Entra ID.  For questions regarding compatibility, please contact your identity provider.  If you would like to see a list of identity providers who have previously been tested for compatibility with Microsoft Entra ID, by Microsoft, see [Microsoft Entra identity provider compatibility docs](https://www.microsoft.com/download/details.aspx?id=56843). 

>[!NOTE]
>Microsoft no longer provides validation testing to independent identity providers for compatibility with Microsoft Entra ID. If you would like to test your product for interoperability please refer to these [guidelines](https://www.microsoft.com/download/details.aspx?id=56843). 

## Next Steps

- [Integrate your on-premises directories with Microsoft Entra ID](../whatis-hybrid-identity.md)
- [Microsoft Entra Connect and federation](how-to-connect-fed-whatis.md)
