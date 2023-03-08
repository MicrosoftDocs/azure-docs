---
title: Remove access to a delegation
description: Learn how to remove access to resources that were delegated to a service provider for Azure Lighthouse.
ms.date: 03/02/2023
ms.topic: how-to 
---

# Remove access to a delegation

After a customer's subscription or resource group has been delegated to a service provider for [Azure Lighthouse](../overview.md), the delegation can be removed if needed. Once a delegation is removed, the [Azure delegated resource management](../concepts/architecture.md) access that was previously granted to users in the service provider tenant will no longer apply.

Removing a delegation can be done by a user in either the customer tenant or the service provider tenant, as long as the user has the appropriate permissions.

> [!TIP]
> Though we refer to service providers and customers in this topic, [enterprises managing multiple tenants](../concepts/enterprise.md) can use the same processes.

> [!IMPORTANT]
> When a customer subscription has multiple delegations from the same service provider, removing one delegation could cause users to lose access granted via the other delegations. This only occurs when the same `principalId` and `roleDefinitionId` combination is included in multiple delegations and then one of the delegations is removed. To fix this, repeat the [onboarding process](onboard-customer.md) for the delegations that you aren't removing.

## Customers

Users in the customer's tenant who have a role with the `Microsoft.Authorization/roleAssignments/write` permission, such as [Owner](../../role-based-access-control/built-in-roles.md#owner), can remove service provider access to that subscription (or to resource groups in that subscription). To do so, the user can go to the [Service providers page](view-manage-service-providers.md#remove-service-provider-offers) of the Azure portal, find the offer on the **Service provider offers** screen, and select the trash can icon in the row for that offer.

After confirming the deletion, no users in the service provider's tenant will be able to access the resources that had been previously delegated.

## Service providers

Users in a managing tenant can remove access to delegated resources if they were granted the [Managed Services Registration Assignment Delete Role](../../role-based-access-control/built-in-roles.md#managed-services-registration-assignment-delete-role) for the customer's resources. If this role isn't assigned to any service provider users, the delegation can only be removed by a user in the customer's tenant.

This example shows an assignment granting the **Managed Services Registration Assignment Delete Role** that can be included in a parameter file during the [onboarding process](onboard-customer.md):

```json
    "authorizations": [ 
        { 
            "principalId": "cfa7496e-a619-4a14-a740-85c5ad2063bb", 
            "principalIdDisplayName": "MSP Operators", 
            "roleDefinitionId": "91c1777a-f3dc-4fae-b103-61d183457e46" 
        } 
    ] 
```

This role can also be selected in an **Authorization** when [creating a Managed Service offer](../../marketplace/plan-managed-service-offer.md) to publish to Azure Marketplace.

A user with this permission can remove a delegation in one of the following ways.

### Azure portal

1. Navigate to the [My customers page](view-manage-customers.md).
2. Select **Delegations**.
3. Find the delegation you want to remove, then select the trash can icon that appears in its row.

### PowerShell

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

# Sign in as a user from the managing tenant directory 

Login-AzAccount

# Select the subscription that is delegated - or contains the delegated resource group(s)

Select-AzSubscription -SubscriptionName "<subscriptionName>"

# Get the registration assignment

Get-AzManagedServicesAssignment -Scope "/subscriptions/{delegatedSubscriptionId}"

# Delete the registration assignment

Remove-AzManagedServicesAssignment -Name "<Assignmentname>" -Scope "/subscriptions/{delegatedSubscriptionId}"
```

### Azure CLI

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

# Sign in as a user from the managing tenant directory

az login

# Select the subscription that is delegated – or contains the delegated resource group(s)

az account set -s <subscriptionId/name>

# List registration assignments

az managedservices assignment list

# Delete the registration assignment

az managedservices assignment delete --assignment <id or full resourceId>
```

## Next steps

- Learn about [Azure Lighthouse architecture](../concepts/architecture.md).
- [View and manage customers](view-manage-customers.md) by going to **My customers** in the Azure portal.
- Learn how to [update a previous delegation](update-delegation.md).
