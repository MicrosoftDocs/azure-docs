---
title: What are protected actions in Azure AD? (preview)
description: Learn about protected actions in Azure Active Directory.
services: active-directory
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.service: active-directory
ms.subservice: roles
ms.workload: identity
ms.topic: conceptual
ms.date: 03/31/2023
---

# What are protected actions in Azure AD? (preview)

> [!IMPORTANT]
> Protected actions are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Protected actions in Azure Active Directory (Azure AD) are permissions that have been assigned [Conditional Access policies](../conditional-access/overview.md). When a user attempts to perform a protected action, they must first satisfy the Conditional Access policies assigned to the required permissions. For example, to allow administrators to update Conditional Access policies, you can require that they first satisfy the [Phishing-resistant MFA](../authentication/concept-authentication-strengths.md#built-in-authentication-strengths) policy.

This article provides an overview of protected action and how to get started using them.

## Why use protected actions?

You use protected actions when you want to add an additional layer of protection. Protected actions can be applied to permissions that require strong Conditional Access policy protection, independent of the role being used or how the user was given the permission. Because the policy enforcement occurs at the time the user attempts to perform the protected action and not during user sign-in or rule activation, users are prompted only when needed.

## What policies are typically used with protected actions?

We recommend signing with any privileged account, like administrator accounts, require multi-factor authentication. Here are some common stronger Conditional Access policies.

- Stronger MFA authentication strengths, such as [Passwordless MFA](../authentication/concept-authentication-strengths.md#built-in-authentication-strengths) or [Phishing-resistant MFA](../authentication/concept-authentication-strengths.md#built-in-authentication-strengths),  
- Privileged access workstations, by using Conditional Access policy [device filters](../conditional-access/concept-condition-filters-for-devices.md).
- Shorter session timeouts, by using Conditional Access [sign-in frequency session controls](../conditional-access/howto-conditional-access-session-lifetime.md#user-sign-in-frequency). 

## What permissions can be used with protected actions?

For this preview, Conditional Access policies can be applied to limited set of permissions. You can use protected actions in the following areas:

- Conditional Access policy management
- Custom rules that define network locations
- Protected action management

Here is the initial set of permissions:

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | --- | --- |
> | microsoft.directory/conditionalAccessPolicies/create | Create conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/basic/update | Update basic properties for conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/delete | Delete conditional access policies |
> | microsoft.directory/namedLocations/create | Create custom rules that define network locations |
> | microsoft.directory/namedLocations/basic/update | Update basic properties of custom rules that define network locations |
> | microsoft.directory/namedLocations/delete | Delete custom rules that define network locations |
> | microsoft.directory/resourceNamespaces/resourceActions/authenticationContext/update | Update Conditional Access authentication context of Microsoft 365 role-based access control (RBAC) resource actions |

## How do protected actions compare with Privileged Identity Management role activation?

[Privileged Identity Management role activation](../privileged-identity-management/pim-how-to-change-default-settings.md) can also be assigned Conditional Access policies. This allows for policy enforcement only when a user activates a role, providing the most comprehensive protection. Protected actions are enforced only when a user takes an action that requires permissions with Conditional Access policy assigned to it. This allows for high impact permissions to be protected, independent of a user role. Privileged Identity Management role activation and protected actions can be used together, for the strongest coverage.

## Steps to use protected actions

1. **Check permissions**

    Check that you're assigned the [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) or [Security Administrator](permissions-reference.md#security-administrator) roles. If not, check with your administrator to assign the appropriate role.

1. **Configure Conditional Access policy**

    Configure a Conditional Access authentication context and an associated Conditional Access policy. Protected actions use an authentication context, which allows policy enforcement for fine-grain resources in a service, like Azure AD permissions. A good policy to start with is to require passwordless MFA and exclude an emergency account. [Learn more](../conditional-access/concept-conditional-access-cloud-apps.md#authentication-context)

1. **Add protected actions**

    Add protected actions by assigning Conditional Access authentication context values to selected permissions. Learn more

1. **Use protected action**

    Sign in as a user and test the user experience by performing the protected action. You should be prompted to satisfy the Conditional Access policy requirements. For example, if the policy requires multi-factor authentication, you should be redirected to the sign-in page and prompted for strong authentication. Learn more

## What happens with protected actions and applications?

If an application or service attempts to perform a protection action, it may need to be able to make a step-up authentication request, so the user is able to satisfy the required Conditional Access policy. For example, they may be required to complete multi-factor authentication. In this preview, the following applications support step-up authentication for protected actions:

- Azure Active Directory administrator experiences for the actions in the [Entra admin center](https://entra.microsoft.com) or [Azure portal](https://portal.azure.com)
- [Microsoft Graph PowerShell](/powershell/microsoftgraph/overview?branch=main)
- [Microsoft Graph Explorer](/graph/graph-explorer/graph-explorer-overview?branch=main)

There are some known and expected limitations. The following applications will fail if they attempt to perform a protected action. In the case that step-up authentication is required to perform the protected action, the following clients will fail to authenticate.
 
- [Azure PowerShell](/powershell/azure/what-is-azure-powershell?branch=main) 
- [Azure AD PowerShell](/powershell/azure/active-directory/overview?branch=main)
- Creating a new [terms of use](../conditional-access/terms-of-use.md) page in the Entra admin center or Azure portal. New pages are registered with Conditional Access so are subject to Conditional Access create and update protected actions.

If your organization has developed an application that calls the Microsoft Graph API to perform a protected action, you should review the code sample for how to handle a claims challenge using step-up authentication. For more information, see [Developer guide to Conditional Access authentication context](../develop/developer-guide-conditional-access-authentication-context.md).

## Best practices

Here are some best practices for using protected actions.

- **Have an emergency account**

    When configuring Conditional Access policies for protected actions, be sure to have an emergency account that is excluded from the policy. This provides a mitigation against accidental lockout.

- **Move user and sign-in risk policies to Conditional Access**

    Conditional Access permissions aren't used when managing Azure AD Identity Protection risk policies. We recommend moving user and sign-in risk policies to Conditional Access.

- **Use named network locations**

    Named network location permissions aren't used when managing multi-factor authentication trusted IPs. We recommend using [named network locations](../conditional-access/location-condition.md#named-locations).

- **Don't use protected actions to block access based on identity or group membership**

    Protected actions are used to apply an access requirement to perform a protected action. They aren't intended to block use of a permission just based on user identity or group membership. Who has access to specific permissions is an authorization decision and should be controlled by role assignment.

## License requirements

[!INCLUDE [Azure AD Premium P1 license](../../../includes/active-directory-p1-license.md)]

## Next steps

- [Add, remove, or use protected actions in Azure AD](./protected-actions-add.md)
