---
title: Where Azure AD stores identity data for European customers | Microsoft Docs
description: Learn about where Azure Active Directory stores identity-related data for its European customers.
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
ms.date: 04/23/2018
ms.custom: it-pro
---

# Where does Microsoft Azure Active Directory (Azure AD) store identity data for European customers
Most European identity-related data stays in Europe and isn't replicated outside of Europe. The only exceptions are a few attributes that can identify customers, and some metadata that's required for some identity services to function properly. This article provides details about the stored identity-related data, including what customers need to know while they plan for their own data storage requirements.

## Data storage and datacenter locations
Most identity data for European-based companies stays within the European datacenters, managed by Microsoft. Data that's not stored in the European datacenters, includes:

- **Identity-related attributes.** A small set of identity-related info is replicated to the United States (US). However, Microsoft is actively working to remove this requirement for the future.

    -   SourceAnchor
    -   PasswordHash
    -   GivenName
    -   Surname
    -   customerPrincipalName
    -   AccountEnabled
    -   PasswordPolicies
    -   StrongAuthenticationRequirement
    -   ApplicationPassword
    -   PUID
    -   Domain

- **Microsoft Azure multi-factor authentication (MFA) and Azure AD self-service password reset (SSPR).** Multi-factor authentication stores all at-rest customer data in European datacenters. However, second-factor authentication and its related personal data can be completed in the US while using MFA or SSPR (all authentication types). Some MFA and SSPR logs may also be stored in the US for 30 days, regardless of the authentication type.

- **Microsoft Azure role-based access control (RBAC).** Azure RBAC data is globally synced and its entities include role assignments and role definitions. Role assignments can include the objectId for a customer, group, and the serviceprincipal (the principalId property for the role assignment). Personal data for the corresponding directory object is stored in the European datacenters and can't be replicated globally. To see an example of what's sent with the role assignment, see the [Role Assignments - Get](https://docs.microsoft.com/en-us/rest/api/authorization/roleassignments/get) article.

- **Microsoft Azure Active Directory B2C (Azure AD B2C).** Azure AD B2C stores all at-rest customer data in European datacenters. However, operational logs (with all personal data removed) stay at the location from where the person is accessing the services. All policy configuration data is currently stored only in the US. For more info about policy configurations, see the [Azure Active Directory B2C: Built-in policies](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-policies) article.

- **Microsoft Azure Active Directory B2B (Azure AD B2B).** Azure AD B2B stores a set of metadata in tables within the US datacenters. This table includes fields like invitationId, redeemUrl, invitationTicket, resource tenant ID, and so on. It doesn't include any personal data.

- **Microsoft Azure Active Directory Domain Services (Azure AD DS).** Azure AD DS stores customer data in the same location as the customer-selected Azure Virtual Network. So, if the network is outside of Europe, the data is replicated and stored outside of Europe.

- **Apps that integrate with Azure AD.** Any apps that integrate with Azure AD have access to identity data. Customers must evaluate each app to determine how the apps treat identity data and whether they meet the company's data storage requirements.

- **Microsoft Office 365 apps.** For details about where specific Microsoft Office 365 apps store at-rest data, see the [Where is your data located?](https://products.office.com/en-US/where-is-your-data-located?ms.officeurl=datamaps&geo=All) article.
