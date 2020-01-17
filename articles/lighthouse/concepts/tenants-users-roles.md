---
title: Tenants, roles, and users in Azure Lighthouse scenarios
description: Understand the concepts of Azure Active Directory tenants, users, and roles, as well as how they can be used in Azure Lighthouse scenarios.
ms.date: 01/16/2020
ms.topic: conceptual
---

# Tenants, roles, and users in Azure Lighthouse scenarios

Before onboarding customers for [Azure delegated resource management](azure-delegated-resource-management.md), it's important to understand how Azure Active Directory (Azure AD) tenants, users, and roles work, as well as how they can be used in Azure Lighthouse scenarios.

A *tenant* is a dedicated and trusted instance of Azure AD. Typically, each tenant represents a single organization. Azure delegated resource management enables logical projection of resources from one tenant to another tenant. This allows users in the managing tenant (such as one belonging to a service provider) to access delegated resources in a customer's tenant, or lets [enterprises with multiple tenants centralize their management operations](enterprise.md).

In order to achieve this logical projection, a subscription (or one or more resource groups within a subscription) in the customer tenant must be *onboarded* for Azure delegated resource management. This onboarding process can be done either [through Azure Resource Manager templates](../how-to/onboard-customer.md) or by [publishing a public or private offer to Azure Marketplace](../how-to/publish-managed-services-offers.md).

Whichever onboarding method you choose, you will need to define *authorizations*. Each authorization specifies a user account in the managing tenant which will have access to the delegated resources, and a built-in role that sets the permissions that each of these users will have for these resources.

## Role support for Azure delegated resource management

When defining an authorization, each user account must be assigned one of the [role-based access control (RBAC) built-in roles](../../role-based-access-control/built-in-roles.md). Custom roles and [classic subscription administrator roles](../../role-based-access-control/classic-administrators.md) are not supported.

All [built-in roles](../../role-based-access-control/built-in-roles.md) are currently supported with Azure delegated resource management, with the following exceptions:

- The [Owner](../../role-based-access-control/built-in-roles.md#owner) role is not supported.
- Any built-in roles with [DataActions](../../role-based-access-control/role-definitions.md#dataactions) permission are not supported.
- The [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) built-in role is supported, but only for the limited purpose of [assigning roles to a managed identity in the customer tenant](../how-to/deploy-policy-remediation.md#create-a-user-who-can-assign-roles-to-a-managed-identity-in-the-customer-tenant). No other permissions typically granted by this role will apply. If you define a user with this role, you must also specify the built-in role(s) that this user can assign to managed identities.

> [!NOTE]
> Once an applicable new built-in role is added to Azure, it can be assigned when [onboarding a customer using Azure Resource Manager templates](../how-to/onboard-customer.md). There may be a delay before the newly-added role becomes available in Cloud Partner Portal when [publishing a managed service offer](../how-to/publish-managed-services-offers.md).

## Best practices for defining users and roles

When creating your authorizations, we recommend the following best practices:

- In most cases, you'll want to assign permissions to an Azure AD user group or service principal, rather than to a series of individual user accounts. This lets you add or remove access for individual users without having to update and republish the plan when your access requirements change.
- Be sure to follow the principle of least privilege so that users only have the permissions needed to complete their job, helping to reduce the chance of inadvertent errors. For more info, see [Recommended security practices](../concepts/recommended-security-practices.md).
- Include a user with the [Managed Services Registration Assignment Delete Role](../../role-based-access-control/built-in-roles.md#managed-services-registration-assignment-delete-role) so that you can [remove access to the delegation](../how-to/onboard-customer.md#remove-access-to-a-delegation) later if needed. If this role is not assigned, delegated resources can only be removed by a user in the customer's tenant.
- Be sure that any user who needs to [view the My customers page in the Azure portal](../how-to/view-manage-customers.md) has the [Reader](../../role-based-access-control/built-in-roles.md#reader) role (or another built-in role which includes Reader access).

## Next steps

- Learn about [recommended security practices for Azure delegated resource management](recommended-security-practices.md).
- Onboard your customers to Azure delegated resource management, either by [using Azure Resource Manager templates](../how-to/onboard-customer.md) or by [publishing a private or public managed services offer to Azure Marketplace](../how-to/publish-managed-services-offers.md).
