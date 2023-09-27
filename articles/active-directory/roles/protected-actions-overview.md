---
title: What are protected actions in Microsoft Entra ID?
description: Learn about protected actions in Microsoft Entra ID.
services: active-directory
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.service: active-directory
ms.subservice: roles
ms.workload: identity
ms.custom: has-azure-ad-ps-ref
ms.topic: conceptual
ms.date: 04/10/2023
---

# What are protected actions in Microsoft Entra ID?

Protected actions in Microsoft Entra ID are permissions that have been assigned [Conditional Access policies](../conditional-access/overview.md). When a user attempts to perform a protected action, they must first satisfy the Conditional Access policies assigned to the required permissions. For example, to allow administrators to update Conditional Access policies, you can require that they first satisfy the [Phishing-resistant MFA](../authentication/concept-authentication-strengths.md#built-in-authentication-strengths) policy.

This article provides an overview of protected action and how to get started using them.

## Why use protected actions?

You use protected actions when you want to add an additional layer of protection. Protected actions can be applied to permissions that require strong Conditional Access policy protection, independent of the role being used or how the user was given the permission. Because the policy enforcement occurs at the time the user attempts to perform the protected action and not during user sign-in or rule activation, users are prompted only when needed.

## What policies are typically used with protected actions?

We recommend using multi-factor authentication on all accounts, especially accounts with privileged roles. Protected actions can be used to require additional security. Here are some common stronger Conditional Access policies.

- Stronger MFA authentication strengths, such as [Passwordless MFA](../authentication/concept-authentication-strengths.md#built-in-authentication-strengths) or [Phishing-resistant MFA](../authentication/concept-authentication-strengths.md#built-in-authentication-strengths),  
- Privileged access workstations, by using Conditional Access policy [device filters](../conditional-access/concept-condition-filters-for-devices.md).
- Shorter session timeouts, by using Conditional Access [sign-in frequency session controls](../conditional-access/howto-conditional-access-session-lifetime.md#user-sign-in-frequency). 

## What permissions can be used with protected actions?

Conditional Access policies can be applied to limited set of permissions. You can use protected actions in the following areas:

- Conditional Access policy management
- Cross-tenant access settings management
- Custom rules that define network locations
- Protected action management

Here's the initial set of permissions:

> [!div class="mx-tableFixed"]
> | Permission | Description |
> | --- | --- |
> | microsoft.directory/conditionalAccessPolicies/basic/update | Update basic properties for Conditional Access policies |
> | microsoft.directory/conditionalAccessPolicies/create | Create Conditional Access policies |
> | microsoft.directory/conditionalAccessPolicies/delete | Delete Conditional Access policies |
> | microsoft.directory/conditionalAccessPolicies/basic/update | Update basic properties for conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/create | Create conditional access policies |
> | microsoft.directory/conditionalAccessPolicies/delete | Delete conditional access policies |
> | microsoft.directory/crossTenantAccessPolicy/allowedCloudEndpoints/update | Update allowed cloud endpoints of the cross-tenant access policy|
> | microsoft.directory/crossTenantAccessPolicy/default/b2bCollaboration/update | Update Microsoft Entra B2B collaboration settings of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/b2bDirectConnect/update | Update Microsoft Entra B2B direct connect settings of the default cross-tenant access policy |
> | microsoft.directory/crossTenantAccessPolicy/default/crossCloudMeetings/update | Update cross-cloud Teams meeting settings of the default cross-tenant access policy.
> | microsoft.directory/crossTenantAccessPolicy/default/tenantRestrictions/update | Update tenant restrictions of the default cross-tenant access policy.
> | microsoft.directory/crossTenantAccessPolicy/partners/b2bCollaboration/update | Update Microsoft Entra B2B collaboration settings of cross-tenant access policy for partners. |
> | microsoft.directory/crossTenantAccessPolicy/partners/b2bDirectConnect/update | Update Microsoft Entra B2B direct connect settings of cross-tenant access policy for partners. |
> | microsoft.directory/crossTenantAccessPolicy/partners/create | Create cross-tenant access policy for partners. |
> | microsoft.directory/crossTenantAccessPolicy/partners/crossCloudMeetings/update | Update cross-cloud Teams meeting settings  of cross-tenant access policy for partners. |
> | microsoft.directory/crossTenantAccessPolicy/partners/delete | Delete cross-tenant access policy for partners. |
> | microsoft.directory/crossTenantAccessPolicy/partners/tenantRestrictions/update | Update tenant restrictions of cross-tenant access policy for partners. |
> | microsoft.directory/namedLocations/basic/update | Update basic properties of custom rules that define network locations |
> | microsoft.directory/namedLocations/create | Create custom rules that define network locations |
> | microsoft.directory/namedLocations/delete | Delete custom rules that define network locations |
> | microsoft.directory/resourceNamespaces/resourceActions/authenticationContext/update | Update Conditional Access authentication context of Microsoft 365 role-based access control (RBAC) resource actions |

## How do protected actions compare with Privileged Identity Management role activation?

[Privileged Identity Management role activation](../privileged-identity-management/pim-how-to-change-default-settings.md) can also be assigned Conditional Access policies. This capability allows for policy enforcement only when a user activates a role, providing the most comprehensive protection. Protected actions are enforced only when a user takes an action that requires permissions with Conditional Access policy assigned to it. Protected actions allow for high impact permissions to be protected, independent of a user role. Privileged Identity Management role activation and protected actions can be used together for stronger coverage.

## Steps to use protected actions

> [!NOTE]
> You should perform these steps in the following sequence to ensure that protected actions are properly configured and enforced. If you don't follow this order, you may get unexpected behavior, such as [getting repeated requests to reauthenticate](./protected-actions-add.md#symptom---policy-is-never-satisfied).

1. **Check permissions**

    Check that you're assigned the [Conditional Access Administrator](permissions-reference.md#conditional-access-administrator) or [Security Administrator](permissions-reference.md#security-administrator) roles. If not, check with your administrator to assign the appropriate role.

1. **Configure Conditional Access policy**

    Configure a Conditional Access authentication context and an associated Conditional Access policy. Protected actions use an authentication context, which allows policy enforcement for fine-grain resources in a service, like Microsoft Entra permissions. A good policy to start with is to require passwordless MFA and exclude an emergency account. [Learn more](./protected-actions-add.md#step-1-configure-conditional-access-policy)

1. **Add protected actions**

    Add protected actions by assigning Conditional Access authentication context values to selected permissions. [Learn more](./protected-actions-add.md#step-2-add-protected-actions)

1. **Test protected actions**

    Sign in as a user and test the user experience by performing the protected action. You should be prompted to satisfy the Conditional Access policy requirements. For example, if the policy requires multi-factor authentication, you should be redirected to the sign-in page and prompted for strong authentication. [Learn more](./protected-actions-add.md#step-3-test-protected-actions)

## What happens with protected actions and applications?

If an application or service attempts to perform a protection action, it must be able to handle the required Conditional Access policy. In some cases, a user might need to intervene and satisfy the policy. For example, they may be required to complete multi-factor authentication. The following applications support step-up authentication for protected actions:

- Microsoft Entra administrator experiences for the actions in the [Microsoft Entra admin center](https://entra.microsoft.com)
- [Microsoft Graph PowerShell](/powershell/microsoftgraph/overview?branch=main)
- [Microsoft Graph Explorer](/graph/graph-explorer/graph-explorer-overview?branch=main)

There are some known and expected limitations. The following applications will fail if they attempt to perform a protected action.
 
- [Azure PowerShell](/powershell/azure/what-is-azure-powershell?branch=main) 
- [Azure AD PowerShell](/powershell/azure/active-directory/overview?branch=main)
- Creating a new [terms of use](../conditional-access/terms-of-use.md) page or [custom control](../conditional-access/controls.md) in the Microsoft Entra admin center. New terms of use pages or custom controls are registered with Conditional Access so are subject to Conditional Access create, update, and delete protected actions. Temporarily removing the policy requirement from the Conditional Access create, update, and delete actions will allow the creation of a new terms of use page or custom control.

If your organization has developed an application that calls the Microsoft Graph API to perform a protected action, you should review the code sample for how to handle a claims challenge using step-up authentication. For more information, see [Developer guide to Conditional Access authentication context](../develop/developer-guide-conditional-access-authentication-context.md).

## Best practices

Here are some best practices for using protected actions.

- **Have an emergency account**

    When configuring Conditional Access policies for protected actions, be sure to have an emergency account that is excluded from the policy. This provides a mitigation against accidental lockout.

- **Move user and sign-in risk policies to Conditional Access**

    Conditional Access permissions aren't used when managing Microsoft Entra ID Protection risk policies. We recommend moving user and sign-in risk policies to Conditional Access.

- **Use named network locations**

    Named network location permissions aren't used when managing multi-factor authentication trusted IPs. We recommend using [named network locations](../conditional-access/location-condition.md#named-locations).

- **Don't use protected actions to block access based on identity or group membership**

    Protected actions are used to apply an access requirement to perform a protected action. They aren't intended to block use of a permission just based on user identity or group membership. Who has access to specific permissions is an authorization decision and should be controlled by role assignment.

## License requirements

[!INCLUDE [Azure AD Premium P1 license](../../../includes/active-directory-p1-license.md)]

## Next steps

- [Add, test, or remove protected actions in Microsoft Entra ID](./protected-actions-add.md)
