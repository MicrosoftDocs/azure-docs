---
title: Supported Microsoft Entra ID features
description: Learn about Microsoft Entra ID features, which are still supported in Azure AD B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: overview
ms.date: 11/06/2023
ms.author: kengaderdus
ms.subservice: B2C
---

# Supported Microsoft Entra ID features

An Azure Active Directory B2C (Azure AD B2C) tenant is different than a Microsoft Entra tenant, which you may already have, but it relies on it. The following Microsoft Entra ID features can be used in your Azure AD B2C tenant.

|Feature  |Microsoft Entra ID  | Azure AD B2C |
|---------|---------|---------|
| [Groups](../active-directory/fundamentals/how-to-manage-groups.md) | Groups can be used to manage administrative and user accounts.| Groups can be used to manage administrative accounts. You can't perform [group-based assignment of enterprise applications](../active-directory/manage-apps/assign-user-or-group-access-portal.md).|
| [Inviting External Identities guests](../active-directory//external-identities/add-users-administrator.md)| You can invite guest users and configure External Identities features such as federation and sign-in with Facebook and Google accounts. | You can invite only a Microsoft account or a Microsoft Entra user as a guest to your Microsoft Entra tenant for accessing applications or managing tenants. For [consumer accounts](user-overview.md#consumer-user), you use Azure AD B2C user flows and custom policies to manage users and sign-up or sign-in with external identity providers, such as Google or Facebook. |
| [Roles and administrators](../active-directory/fundamentals/how-subscriptions-associated-directory.md)| Fully supported for administrative and user accounts. | Roles are not supported with [consumer accounts](user-overview.md#consumer-user). Consumer accounts don't have access to any Azure resources.|
| [Custom domain names](../active-directory/fundamentals/add-custom-domain.md) |  You can use Microsoft Entra custom domains for administrative accounts only. | [Consumer accounts](user-overview.md#consumer-user) can sign in with a username, phone number, or any email address. You can use [custom domains](custom-domain.md) in your redirect URLs.|
| [Conditional Access](../active-directory/conditional-access/overview.md) | Fully supported for administrative and user accounts. | A subset of Microsoft Entra Conditional Access features is supported with [consumer accounts](user-overview.md#consumer-user) Learn how to configure Azure AD B2C [conditional access](conditional-access-user-flow.md).|
| [Premium P1](https://azure.microsoft.com/pricing/details/active-directory) | Fully supported for Microsoft Entra ID P1 features. For example, [Password Protection](../active-directory/authentication/concept-password-ban-bad.md), [Hybrid Identities](../active-directory/hybrid/whatis-hybrid-identity.md),  [Conditional Access](../active-directory/roles/permissions-reference.md#), [Dynamic groups](../active-directory/enterprise-users/groups-create-rule.md), and more. | Azure AD B2C uses [Azure AD B2C Premium P1 license](https://azure.microsoft.com/pricing/details/active-directory/external-identities/), which is different from Microsoft Entra ID P1. A subset of Microsoft Entra Conditional Access features is supported with [consumer accounts](user-overview.md#consumer-user). Learn how to configure Azure AD B2C [Conditional Access](conditional-access-user-flow.md).|
| [Premium P2](https://azure.microsoft.com/pricing/details/active-directory/) | Fully supported for Microsoft Entra ID P2 features. For example, [Identity Protection](../active-directory/identity-protection/overview-identity-protection.md), and [Identity Governance](../active-directory/governance/identity-governance-overview.md).  | Azure AD B2C uses [Azure AD B2C Premium P2 license](https://azure.microsoft.com/pricing/details/active-directory/external-identities/), which is different from Microsoft Entra ID P2. A subset of Microsoft Entra ID Protection features is supported with [consumer accounts](user-overview.md#consumer-user). Learn how to [Investigate risk with Identity Protection](identity-protection-investigate-risk.md) and configure Azure AD B2C [Conditional Access](conditional-access-user-flow.md). |
|[Data retention policy](../active-directory/reports-monitoring/reference-reports-data-retention.md#how-long-does-azure-ad-store-the-data)|Data retention period for both audit and sign in logs depend on your subscription. Learn more about [How long Microsoft Entra ID store reporting data](../active-directory/reports-monitoring/reference-reports-data-retention.md#how-long-does-azure-ad-store-the-data).|Sign in and  audit logs are only retained for **seven (7) days**. If you require a longer retention period, use the [Azure monitor](azure-monitor.md).|
| [Go-Local add-on](data-residency.md#go-local-add-on) | Microsoft Entra Go-Local add-on enables you to store data in the country/region you choose when your Microsoft Entra tenant.| Just like Microsoft Entra ID, Azure AD B2C supports [Go-Local add-on](data-residency.md#go-local-add-on). |

> [!NOTE]
> **Other Azure resources in your tenant:** <br>In an Azure AD B2C tenant, you can't provision other Azure resources such as virtual machines, Azure web apps, or Azure functions. You must create these resources in your Microsoft Entra tenant.
