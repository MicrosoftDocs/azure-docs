---
title: Azure AD federation compatibility list
description: This page has non-Microsoft identity providers that can be used to implement single sign-on.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: curtand
ms.assetid: 22c8693e-8915-446d-b383-27e9587988ec
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/25/2018
ms.author: billmath

---
# Azure AD federation compatibility list
Azure Active Directory provides single-sign on and enhanced application access security for Office 365 and other Microsoft Online services for hybrid and cloud-only implementations without requiring any third party solution. Office 365, like most of Microsoft’s Online services, is integrated with Azure Active Directory for directory services, authentication, and authorization. Azure Active Directory also provides single sign-on to thousands of SaaS applications and on-premises web applications. See the Azure Active Directory [application gallery](https://azuremarketplace.microsoft.com/marketplace/apps) for supported SaaS applications. 

## Idp Validation
If your organization uses a third-party federation solution, you can configure single sign-on for your on-premises Active Directory users with Microsoft Online services provided that the third-party federation solution is compatible with Azure Active Directory. The following is a list of [compatible providers](https://www.microsoft.com/download/details.aspx?id=41185) that were validated by Oxford Computer Group on behalf of Microsoft, as of November 2017. 

>[!NOTE]
>Microsoft no longer provides validation testing to independent identity providers for compatibility with Azure Active Directory. Microsoft encourages identity providers to use the self-service [documents](https://www.microsoft.com/download/details.aspx?id=41185) to validate compatibility with Azure Active Directory. 

## Next Steps

- [Integrate your on-premises directories with Azure Active Directory](active-directory-aadconnect.md)
- [Azure AD Connect and federation](active-directory-aadconnectfed-whatis.md)
