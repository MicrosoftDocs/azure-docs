---
title: Permissions to view and manage Azure savings plans
titleSuffix: Microsoft Cost Management
description: Learn how savings plan permissions work and how to view and manage your savings plan in the Azure portal.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 04/15/2024
ms.author: banders
---

# Permissions to view and manage Azure savings plans
This article explains how savings plan permissions work and how users can view and manage Azure savings plans in the Azure portal.

## Who can manage a savings plan by default
Two different authorization methods control a user's ability to view, manage, and delegate permissions to savings plans. They're billing admin roles and savings plan role-based access control (RBAC) roles.

## Billing admin roles
You can view, manage, and delegate permissions to savings plans by using built-in billing admin roles. To learn more about Microsoft Customer Agreement and Enterprise Agreement billing roles, see [Understand Microsoft Customer Agreement administrative roles in Azure](../manage/understand-mca-roles.md) and [Managing Azure Enterprise Agreement roles](../manage/understand-ea-roles.md), respectively.

### Billing admin roles required for savings plan actions

- View savings plans:
    - **Microsoft Customer Agreement**: Users with billing profile reader or above
    - **Enterprise Agreement**: Users with enterprise administrator (read only) or above
    - **Microsoft Partner Agreement**: Not supported
- Manage savings plans (achieved by delegating permissions for the full billing profile/enrollment):
    - **Microsoft Customer Agreement**: Users with billing profile contributor or above
    - **Enterprise Agreement**: Users with Enterprise Agreement administrator or above
    - **Microsoft Partner Agreement**: Not supported
- Delegate savings plan permissions:
    - **Microsoft Customer Agreement**: Users with billing profile contributor or above
    - **Enterprise Agreement**: Users with Enterprise Agreement purchaser or above
    - **Microsoft Partner Agreement**: Not supported

### View and manage savings plans as a billing admin
If you're a billing role user, follow these steps to view and manage all savings plans and savings plan transactions in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Cost Management + Billing**.
    - If you're under an Enterprise Agreement account, on the left menu, select **Billing scopes**. Then in the list of billing scopes, select one.
    - If you're under a Microsoft Customer Agreement account, on the left menu, select **Billing profiles**. In the list of billing profiles, select one.
1. On the left menu, select **Products + services** > **Savings plans**.
    The complete list of savings plans for your Enterprise Agreement enrollment or Microsoft Customer Agreement billing profile appears.
1. Billing role users can take ownership of a savings plan with the [Savings Plan Order - Elevate REST API](/rest/api/billingbenefits/savings-plan-order/elevate) to give themselves Azure RBAC roles.

### Add billing administrators
Add a user as a billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement in the Azure portal.

- **Enterprise Agreement**: Add users with the Enterprise administrator role to view and manage all savings plan orders that apply to the Enterprise Agreement. Enterprise administrators can view and manage savings plans in **Cost Management + Billing**.
  - Users with the Enterprise administrator (read-only) role can only view the savings plan from **Cost Management + Billing**.
  - Department admins and account owners can't view savings plans unless they're explicitly added to them by using **Access control (IAM)**. For more information, see [Manage Azure Enterprise roles](../manage/understand-ea-roles.md).
- **Microsoft Customer Agreement**: Users with the billing profile owner role or the billing profile contributor role can manage all savings plan purchases made by using the billing profile.
    - Billing profile readers and invoice managers can view all savings plans that are paid for with the billing profile. However, they can't make changes to savings plans. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## Savings plan RBAC roles
The savings plan lifecycle is independent of an Azure subscription. Savings plans don't inherit permissions from subscriptions after the purchase. Savings plans are a tenant-level resource with their own Azure RBAC permissions.

### Overview
There are four savings plan-specific RBAC roles:

- **Savings plan administrator**: Allows [management](manage-savings-plan.md) of one or more savings plans in a tenant and [delegation of RBAC roles](../../role-based-access-control/role-assignments-portal.yml) to other users.
- **Savings plan purchaser**: Allows purchase of savings plans with a specified subscription.
    - Allows savings plans purchase or [reservation trade-in](reservation-trade-in.md) by nonbilling admins and nonsubscription owners.
    - Savings plan purchasing by nonbilling admins must be enabled. For more information, see [Permissions to buy an Azure savings plan](permission-buy-savings-plan.md).
- **Savings plan contributor**: Allows management of one or more savings plans in a tenant but not delegation of RBAC roles to other users.
- **Savings plan reader**: Allows read-only access to one or more savings plans in a tenant.

These roles can be scoped to either a specific resource entity (for example, subscription or savings plan) or the Microsoft Entra tenant (directory). To learn more about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md).

### Savings plan RBAC roles required for savings plan actions

- View savings plans:
    - **Tenant scope**: Users with savings plan reader or above.
    - **Savings plan scope**: Built-in reader or above.
- Manage savings plans:
    - **Tenant scope**: Users with savings plan contributor or above.
    - **Savings plan scope**: Built-in contributor or owner roles, or savings plan contributor or above.
- Delegate savings plan permissions:
    - **Tenant scope**: [User Access administrator](../../role-based-access-control/built-in-roles.md#general) rights are required to grant RBAC roles to all savings plans in the tenant. To gain these rights, follow [Elevate access](../../role-based-access-control/elevate-access-global-admin.md) steps.
    - **Savings plan scope**: Savings plan administrator or user access administrator.

In addition, users who held the subscription owner role when the subscription was used to purchase a savings plan can also view, manage, and delegate permissions for the purchased savings plan.

### View savings plans with RBAC access

If you have savings plan-specific RBAC roles (savings plan administrator, purchaser, contributor, or reader), purchased savings plans, or were added as an owner to savings plans, follow these steps to view and manage savings plans in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Home** > **Savings plans** to list savings plans to which you have access.

### Add RBAC roles to users and groups
To learn about delegating savings plan RBAC roles, see [Delegate savings plan RBAC roles](manage-savings-plan.md#delegate-savings-plan-rbac-roles).

_Enterprise administrators can take ownership of a savings plan order. They can add other users to a savings plan by using_ **Access control (IAM)**.

## Grant access with PowerShell

Users who have owner access for savings plan orders, users with elevated access, and [user access administrators](../../role-based-access-control/built-in-roles.md#user-access-administrator) can delegate access management for all savings plan orders to which they have access.

Access granted by using PowerShell isn't shown in the Azure portal. Instead, you use the `get-AzRoleAssignment` command in the following section to view assigned roles.

### Assign the owner role for all savings plans
To give a user Azure RBAC access to all savings plan orders in their Microsoft Entra tenant (directory), use the following Azure PowerShell script:

```azurepowershell
Import-Module Az.Accounts
Import-Module Az.Resources

Connect-AzAccount -Tenant <TenantId>
$response = Invoke-AzRestMethod -Path /providers/Microsoft.BillingBenefits/savingsPlans?api-version=2022-11-01 -Method GET
$responseJSON = $response.Content | ConvertFrom-JSON
$savingsPlanObjects = $responseJSON.value

foreach ($savingsPlan in $savingsPlanObjects)
{
  $savingsPlanOrderId = $savingsPlan.id.substring(0, 84)
  Write-Host "Assigning Owner role assignment to "$savingsPlanOrderId
  New-AzRoleAssignment -Scope $savingsPlanOrderId -ObjectId <ObjectId> -RoleDefinitionName Owner
}
```

When you use the PowerShell script to assign the ownership role and it runs successfully, a success message isn't returned.

#### Parameters

- **ObjectId**: Microsoft Entra object ID of the user, group, or service principal
   - **Type**: String
   - **Aliases**: Id, PrincipalId
   - **Position**: Named
   - **Default value**: None
   - **Accept pipeline input**: True
   - **Accept wildcard characters**: False

- **TenantId**: Tenant unique identifier
   - **Type**: String
   - **Position**: 5
   - **Default value**: None
   - **Accept pipeline input**: False
   - **Accept wildcard characters**: False

### Add a savings plan administrator role at the tenant level by using Azure PowerShell script
To add a savings plan administrator role at the tenant level with PowerShell, use the following Azure PowerShell script:

```azurepowershell
Import-Module Az.Accounts
Import-Module Az.Resources
Connect-AzAccount -Tenant <TenantId>
New-AzRoleAssignment -Scope "/providers/Microsoft.BillingBenefits" -PrincipalId <ObjectId> -RoleDefinitionName "Savings plan Administrator"
```

#### Parameters

- **ObjectId**: Microsoft Entra object ID of the user, group, or service principal
   - **Type**: String
   - **Aliases**: Id, PrincipalId
   - **Position**: Named
   - **Default value**: None
   - **Accept pipeline input**: True
   - **Accept wildcard characters**: False

- **TenantId**: Tenant unique identifier
   - **Type**: String
   - **Position**: 5
   - **Default value**: None
   - **Accept pipeline input**: False
   - **Accept wildcard characters**: False

### Assign a savings plan contributor role at the tenant level by using Azure PowerShell script
To assign the savings plan contributor role at the tenant level with PowerShell, use the following Azure PowerShell script:

```azurepowershell
Import-Module Az.Accounts
Import-Module Az.Resources
Connect-AzAccount -Tenant <TenantId>
New-AzRoleAssignment -Scope "/providers/Microsoft.BillingBenefits" -PrincipalId <ObjectId> -RoleDefinitionName "Savings plan Contributor"
```

#### Parameters

- **ObjectId**: Microsoft Entra object ID of the user, group, or service principal
   - **Type**: String
   - **Aliases**: Id, PrincipalId
   - **Position**: Named
   - **Default value**: None
   - **Accept pipeline input**: True
   - **Accept wildcard characters**: False

- **TenantId**: Tenant unique identifier
   - **Type**: String
   - **Position**: 5
   - **Default value**: None
   - **Accept pipeline input**: False
   - **Accept wildcard characters**: False

### Assign a savings plan reader role at the tenant level by using Azure PowerShell script
To assign the savings plan reader role at the tenant level with PowerShell, use the following Azure PowerShell script:

```azurepowershell
Import-Module Az.Accounts
Import-Module Az.Resources
Connect-AzAccount -Tenant <TenantId>
New-AzRoleAssignment -Scope "/providers/Microsoft.BillingBenefits" -PrincipalId <ObjectId> -RoleDefinitionName "Savings plan Reader"
```

#### Parameters

- **ObjectId**: Microsoft Entra object ID of the user, group, or service principal
   - **Type**: String
   - **Aliases**: Id, PrincipalId
   - **Position**: Named
   - **Default value**: None
   - **Accept pipeline input**: True
   - **Accept wildcard characters**: False

- **TenantId**: Tenant unique identifier
   - **Type**: String
   - **Position**: 5
   - **Default value**: None
   - **Accept pipeline input**: False
   - **Accept wildcard characters**: False

## Next steps

- [Manage Azure savings plans](manage-savings-plan.md)
