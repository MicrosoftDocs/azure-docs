---
title: Supported features in customer tenants
description: Learn about supported features in customer tenants.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 05/09/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about features supported in a CIAM tenant. 
---
# Supported features in Azure Active Directory for customers

Azure Active Directory (Azure AD) for customers is designed for businesses that want to make applications available to their customers, using the Microsoft Entra platform for identity and access. With the introduction of this feature, Microsoft Entra now offers two different types of tenants that you can create and manage:

- A **workforce tenant** contains your employees and the apps and resources that are internal to your organization. If you've worked with Azure AD, this is the type of tenant you're already familiar with. You might already have an existing workforce tenant for your organization.

- A **customer tenant** represents your customer-facing app, resources, and directory of customer accounts. A customer tenant is distinct and separate from your workforce tenant.

## Compare workforce and customer tenant capabilities

Although workforce tenants and customer tenants are built on the same underlying Microsoft Entra platform, there are some feature differences. The following table compares the features available in each type of tenant.

|Feature  |Workforce tenant  | Customer tenant |
|---------|---------|---------|
| **External Identities** | Invite partners and other external users to your workforce tenant for collaboration. External users become guests in your workforce directory. | Enable self-service sign-up for customers and authorize access to apps. Users are added to your directory as customer accounts.  |
| **Available identity providers** | - Azure AD accounts </br>- Microsoft accounts </br>- One-time passcode </br>- Google </br>- Facebook </br>- SAML/WS-Fed federation | - Local accounts </br>- Azure AD accounts </br>- Microsoft accounts </br>- One-time passcode </br>- Google </br>- Facebook |
| **Groups** | [Groups](../../fundamentals/active-directory-groups-create-azure-portal.md) can be used to manage administrative and user accounts.| Groups can be used to manage administrative accounts. Support for Azure AD groups and [application roles](how-to-use-app-roles-customers.md) is being phased into customer tenants. For the latest updates, see [Groups and application roles support](reference-group-app-roles-support.md). |
| **Roles and administrators**| [Roles and administrators](../../fundamentals/active-directory-users-assign-role-azure-portal.md) are fully supported for administrative and user accounts. | Roles aren't supported with customer accounts. Customer accounts don't have access to tenant resources.|
| **Custom domain names** |  You can use [custom domains] for administrative accounts only. | Not currently supported. However, the URLs visible to customers in sign-up and sign-in pages are neutral, unbranded URLs. [Learn more](concept-branding-customers.md)|
| **Conditional Access** | [Conditional Access](../../conditional-access/overview.md) is fully supported for administrative and user accounts. | Multifactor authentication (MFA) is supported with local accounts in customer tenants. [Learn more](concept-security-customers.md).|

## Next steps

- [Planning for CIAM](concept-planning-your-solution.md)
