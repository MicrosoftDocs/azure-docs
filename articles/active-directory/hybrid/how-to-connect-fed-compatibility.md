---
title: Azure AD federation compatibility list
description: This page has non-Microsoft identity providers that can be used to implement single sign-on.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: curtand
ms.assetid: 22c8693e-8915-446d-b383-27e9587988ec
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/23/2018
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Azure AD federation compatibility list
Azure Active Directory provides single-sign on and enhanced application access security for Office 365 and other Microsoft Online services for hybrid and cloud-only implementations without requiring any third party solution. Office 365, like most of Microsoft’s Online services, is integrated with Azure Active Directory for directory services, authentication, and authorization. Azure Active Directory also provides single sign-on to thousands of SaaS applications and on-premises web applications. See the Azure Active Directory [application gallery](https://azuremarketplace.microsoft.com/marketplace/apps/category/azure-active-directory-apps) for supported SaaS applications. 

## IDP Validation
If your organization uses a third-party federation solution, you can configure single sign-on for your on-premises Active Directory users with Microsoft Online services, such as Office 365, provided the third-party federation solution is compatible with Azure Active Directory.  For questions regarding compatibility, please contact your identity provider.  If you would like to see a list of identity providers who have previously been tested for compatibility with Azure AD, by Microsoft, click [here](https://www.microsoft.com/download/details.aspx?id=56843). 

>[!NOTE]
>Microsoft no longer provides validation testing to independent identity providers for compatibility with Azure Active Directory. If you would like to test your product for interoperability please refer to these [guidelines](https://www.microsoft.com/download/details.aspx?id=56843). 

## Next Steps

- [Integrate your on-premises directories with Azure Active Directory](whatis-hybrid-identity.md)
- [Azure AD Connect and federation](how-to-connect-fed-whatis.md)
