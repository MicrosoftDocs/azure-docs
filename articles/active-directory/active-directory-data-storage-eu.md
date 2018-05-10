---
title: Where Azure AD stores identity data for European customers | Microsoft Docs
description: Learn about where Microsoft Azure Active Directory stores identity-related data for its European customers.
services: active-directory
documentationcenter: ''
author: eross-msft
manager: mtillman
ms.author: lizross

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/01/2018
ms.custom: it-pro
---

# Where does Microsoft Azure Active Directory (Azure AD) store identity data for European customers
Most Azure AD data stays in Europe and isn't replicated outside Europe. The only exceptions are a few attributes that can identify customers, and some metadata that's required for certain identity services to function properly. This article provides details about the stored Azure AD data, including what customers need to know while they plan for their own data residency and storage requirements.

## Data storage and residency
Most Azure AD data for European-based customers stays within the European datacenters, managed by Microsoft. Azure AD data that's not stored in the European datacenters, includes:

- **Identity-related attributes**

    A small set of identity-related info is replicated to the United States (U.S.):

    -   SourceAnchor
    -   PasswordHash
    -   GivenName
    -   Surname
    -   userPrincipalName
    -   AccountEnabled
    -   PasswordPolicies
    -   StrongAuthenticationRequirement
    -   ApplicationPassword
    -   PUID
    -   Domain

- **Microsoft Azure multi-factor authentication (MFA) and Azure AD self-service password reset (SSPR)**

    Multi-factor authentication stores all user data at-rest in European datacenters. However, in some cases data might be stored in the U.S., as follows:
    
    - Two-factor authentication and its related personal data might be stored in the U.S. if you're using MFA or SSPR.
        - All two-factor authentication using phone calls or SMS might be completed by U.S. carriers.
        - Push notifications using the Microsoft Authenticator app require notifications from the manufacturer's notification service (Apple or Google), which might be outside Europe.
        - OATH codes are always validated in the U.S. 
    - Some MFA and SSPR logs are stored in the U.S. for 30 days, regardless of authentication type.

- **Microsoft Azure Active Directory B2C (Azure AD B2C)**

    Azure AD B2C stores all user data at-rest in European datacenters. However, operational logs (with personal data removed) stay at the location from where the person is accessing the services. For example, if a B2C user accesses the service in the U.S., the operational logs stay in the U.S. Additionally, all policy configuration data not containing personal data is stored only in the U.S. For more info about policy configurations, see the [Azure Active Directory B2C: Built-in policies](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-policies) article.

- **Microsoft Azure Active Directory B2B (Azure AD B2B)** 
    
    Azure AD B2B stores all user data at-rest in European datacenters. However, B2B stores its non-personal metadata in tables within U.S. datacenters. This table includes fields like invitationId, redeemUrl, invitationTicket, resource tenant ID, and so on.

- **Microsoft Azure Active Directory Domain Services (Azure AD DS)**

    Azure AD DS stores user data in the same location as the customer-selected Azure Virtual Network. So, if the network is outside Europe, the data is replicated and stored outside Europe.

- **Services and apps integrated with Azure AD**

    Any services and apps that integrate with Azure AD have access to identity data. Customers must evaluate each service and app to determine how identity data is processed by that specific service and app, and whether they meet the company's data storage requirements.

    For more information about Microsoft services' data residency, see the [Where is your data located?](https://www.microsoft.com/en-us/trustcenter/privacy/where-your-data-is-located) section of the Microsoft Trust Center.

## Next steps
For more information about any of the features and functionality described above, see these articles.
- [Get started with Azure Active Directory](get-started-azure-ad.md)
- [What is Multi-Factor Authentication](https://docs.microsoft.com/en-us/azure/active-directory/authentication/multi-factor-authentication)
- [Azure AD self-service password reset](https://docs.microsoft.com/en-us/azure/active-directory/authentication/active-directory-passwords-overview)
- [What is Azure Active Directory B2C](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-overview)
- [What is Azure AD B2B collaboration?](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b)
- [Azure Active Directory (AD) Domain Services](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-overview)
