---
title: Identity data storage for European customers - Azure Active Directory | Microsoft Docs
description: Learn about where Azure Active Directory stores identity-related data for its European customers.
services: active-directory
author: eross-msft
manager: daveba
ms.author: lizross

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 03/04/2019
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Identity data storage for European customers in Azure Active Directory
Azure Active Directory (Azure AD) helps you to manage user identities and to create intelligence-driven access policies that help secure your organization's resources. Identity data is stored in a location that's based on the address your organization provided when you subscribed to the service. For example, when you subscribed to Office 365 or Azure. For specific info about where your identity data is stored, you can use the [Where is your data located?](https://www.microsoft.com/trustcenter/privacy/where-your-data-is-located) section of the Microsoft Trust Center.

While most Azure AD-related European identity data stays in European datacenters, there are some operational, service-specific data that's required for normal Azure AD operation, which are stored in the U.S. and doesn't include any personal data.

## Data stored outside of European datacenters for European customers

Most Azure AD-related European identity data, for organizations with European-based addresses, stays in European datacenters. Azure AD data that's stored in European datacenters, and also replicated to United States datacenters, includes:

- **Microsoft Azure multi-factor authentication (MFA) and Azure AD self-service password reset (SSPR)**
    
    MFA stores all user data at-rest in European datacenters. However, some MFA service-specific data is stored in the U.S., including:
    
    - Two-factor authentication and its related personal data might be stored in the U.S. if you're using MFA or SSPR.

        - All two-factor authentication using phone calls or SMS might be completed by U.S. carriers.
    
        - Push notifications using the Microsoft Authenticator app require notifications from the manufacturer's notification service (Apple or Google), which might be outside Europe.
    
        - OATH codes are always validated in the U.S. 
    
    - Some MFA and SSPR logs are stored in the U.S. for 30 days, regardless of authentication type.

- **Microsoft Azure Active Directory B2C (Azure AD B2C)**

    Azure AD B2C stores all user data at-rest in European datacenters. However, operational logs (with personal data removed) stay at the location from where the person is accessing the services. For example, if a B2C user accesses the service in the U.S., the operational logs stay in the U.S. Additionally, all policy configuration data not containing personal data is stored only in the U.S. For more info about policy configurations, see the [Azure Active Directory B2C: Built-in policies](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-reference-policies) article.

- **Microsoft Azure Active Directory B2B (Azure AD B2B)** 
    
    Azure AD B2B stores all user data at-rest in European datacenters. However, B2B stores its non-personal metadata in tables within U.S. datacenters. This table includes fields like redeemUrl, invitationTicket, resource tenant Id, InviteRedirectUrl, and InviterAppId.

- **Microsoft Azure Active Directory Domain Services (Azure AD DS)**

    Azure AD DS stores user data in the same location as the customer-selected Azure Virtual Network. So, if the network is outside Europe, the data is replicated and stored outside Europe.

- **Services and apps integrated with Azure AD**

    Any services and apps that integrate with Azure AD have access to identity data. Evaluate each service and app to determine how identity data is processed by that specific service and app, and whether they meet your company's data storage requirements.

    For more information about Microsoft services' data residency, see the [Where is your data located?](https://www.microsoft.com/trustcenter/privacy/where-your-data-is-located) section of the Microsoft Trust Center.

## Next steps
For more information about any of the features and functionality described above, see these articles:
- [What is Multi-Factor Authentication?](https://docs.microsoft.com/azure/active-directory/authentication/multi-factor-authentication)

- [Azure AD self-service password reset](https://docs.microsoft.com/azure/active-directory/authentication/active-directory-passwords-overview)

- [What is Azure Active Directory B2C?](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-overview)

- [What is Azure AD B2B collaboration?](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b)

- [Azure Active Directory (AD) Domain Services](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-overview)
