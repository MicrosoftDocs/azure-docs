---
title: Remove access to a delegation
description: Learn how to onboard a customer to Azure delegated resource management, allowing their resources to be accessed and managed through your own tenant.
ms.date: 04/23/2020
ms.topic: conceptual
---

# Remove access to a delegation

This article explains how to remove access to a subscription or resource group that was previously delegated to Azure delegated resource management.

## Customers

By default, users in the customer's tenant who have the appropriate permissions can remove service provider access to delegated resources. To do so, a customer can go to the [Service providers page](view-manage-service-providers.md#add-or-remove-service-provider-offers) of the Azure portal, find the offer on the **Provider offers** screen, and select the trash can icon in the row for that offer. After confirming the deletion, no users in the service provider's tenant will be able to access the resources that had been previously delegated.

## Service providers

Users in a management tenant can remove access to delegated resources only if they were granted the [Managed Services Registration Assignment Delete Role](../../role-based-access-control/built-in-roles.md#managed-services-registration-assignment-delete-role) when the customer's resources were onboarded for Azure delegated resource management. If this role was not assigned, the delegation can only be removed by a user in the customer's tenant.

The example below shows an assignment granting the **Managed Services Registration Assignment Delete Role** that can be included in a parameter file:

```json
    "authorizations": [ 
        { 
            "principalId": "cfa7496e-a619-4a14-a740-85c5ad2063bb", 
            "principalIdDisplayName": "MSP Operators", 
            "roleDefinitionId": "91c1777a-f3dc-4fae-b103-61d183457e46" 
        } 
    ] 
```

This role can also be selected for an **Authorization** when [creating a Managed Service offer](../../marketplace/partner-center-portal/create-new-managed-service-offer.md#authorization) to publish to Azure Marketplace.

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

Remove-AzManagedServicesAssignment -ResourceId "/subscriptions/{delegatedSubscriptionId}/providers/Microsoft.ManagedServices/registrationAssignments/{assignmentGuid}"
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

- Learn about [Azure delegated resource management](../concepts/azure-delegated-resource-management.md).
- [View and manage customers](view-manage-customers.md) by going to **My customers** in the Azure portal.
