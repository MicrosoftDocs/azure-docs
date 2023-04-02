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
ms.date: 04/02/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about features supported in a CIAM tenant. 
---
# Supported features in Microsoft Entra External Identities for Customers

Microsoft Entra External Identities for Customers is designed for businesses that want to make applications available to their customers, using the Microsoft Entra platform for identity and access. With the introduction of this feature, Microsoft Entra now offers two different types of tenants that you can create and manage:

- A **workforce tenant** contains your employees and the apps and resources that are internal to your organization. If you've worked with Azure Active Directory, this is the type of tenant you're already familiar with. You might already have an existing workforce tenant for your organization. 

- A **customer tenant** represents your customer-facing app, resources, and directory of customer accounts. A customer tenant is distinct and separate from your workforce tenant.

While a workforce tenant and a customer tenant are built on the same underlying Microsoft Entra platform, there are some feature differences. The following table compares the features that are available in each type of tenant.

|Feature  |Workforce tenant  | Customer tenant |
|---------|---------|---------|
| **External Identities** | Microsoft Entra External Identities for Partners: Invite partners and other external users to your workforce tenant for collaboration. External users become guests in your workforce directory. <br></br> **Available identity providers**: Azure AD accounts, Microsoft accounts, one-time passcode, Google, Facebook, SAML/WS-Fed federation | Microsoft Entra External Identities for Customers: Enable self-service sign-up for customers and authorize access to apps. Users are added to your directory as customer accounts. <br></br> **Available identity providers**: Local accounts, Azure AD accounts, Microsoft accounts, one-time passcode, Google, Facebook |
| **Groups** | [Groups](../active-directory/fundamentals/active-directory-groups-create-azure-portal.md) can be used to manage administrative and user accounts.| Groups can be used to manage administrative accounts. Customer accounts can't be member of any group, so you can't perform [group-based assignment of enterprise applications](../active-directory/manage-apps/assign-user-or-group-access-portal.md).|
| **Roles and administrators**| [Roles and administrators](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md) are fully supported for administrative and user accounts. | Roles aren't supported with customer accounts. Customer accounts don't have access to any Microsoft Entra resources.|
| **Custom domain names** |  You can use [custom domains] for administrative accounts only. | Not currently supported. However, the URLs visible to customers in sign-up and sign-in pages are neutral, unbranded URLs.|
| **Conditional Access** | [Conditional Access](../active-directory/conditional-access/overview.md) is fully supported for administrative and user accounts. | Multifactor authentication is supported with customer accounts. Learn how to configure [multifactor authentication with Conditional Access] in a customer tenant.(conditional-access-user-flow.md).|
| **Premium P1** | [Premium P1](https://azure.microsoft.com/pricing/details/active-directory) is fully supported for Azure AD premium P1 features. For example, [Password Protection](../active-directory/authentication/concept-password-ban-bad.md), [Hybrid Identities](../active-directory/hybrid/whatis-hybrid-identity.md),  [Conditional Access](../active-directory/roles/permissions-reference.md#), [Dynamic groups](../active-directory/enterprise-users/groups-create-rule.md), and more. | A subset of Conditional Access features is supported with customer accounts.|
| **Premium P2** | [Premium P2](https://azure.microsoft.com/pricing/details/active-directory/) is fully supported for Azure AD premium P2 features. For example, [Identity Protection](../active-directory/identity-protection/overview-identity-protection.md), and [Identity Governance](../active-directory/governance/identity-governance-overview.md).  | A subset of Identity Protection features is supported with customer accounts. Learn how to [Investigate risk with Identity Protection](identity-protection-investigate-risk.md) and configure Azure AD B2C [Conditional Access](conditional-access-user-flow.md). |
| **Data retention policy** |[Data retention period](../active-directory/reports-monitoring/reference-reports-data-retention.md#how-long-does-azure-ad-store-the-data) for both audit and sign in logs depend on your subscription. Learn more about [How long Azure AD stores reporting data](../active-directory/reports-monitoring/reference-reports-data-retention.md#how-long-does-azure-ad-store-the-data).| |

## Next steps

- [Planning for CIAM](concept-planning-your-solution.md)
