---
title: Permissions to view and manage Azure savings plans
titleSuffix: Microsoft Cost Management
description: Learn how to view and manage your savings plan in the Azure portal.
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
By default, the following users can view and manage savings plans:
- The person who buys a savings plan and the account administrator of the billing subscription used to buy the savings plan are added to the savings plan order.
- Enterprise Agreement and Microsoft Customer Agreement billing administrators.
- Users with elevated access to manage all Azure subscriptions and management groups.
- A Savings plan administrator for savings plans in their Microsoft Entra tenant (directory)
- A Savings plan reader has read-only access to savings plans in their Microsoft Entra tenant (directory)

The savings plan lifecycle is independent of an Azure subscription, so the savings plan isn't a resource under the Azure subscription. Instead, it's a tenant-level resource with its own Azure role-based access control (RBAC_ permission separate from subscriptions. Savings plans don't inherit permissions from subscriptions after the purchase.

## View and manage savings plans as a billing administrator

If you're a billing administrator, use following steps to view and manage all savings plans and savings plan transactions in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to **Cost Management + Billing**.
    - If you're an EA admin, in the left menu, select **Billing scopes** and then in the list of billing scopes, select one.
    - If you're a Microsoft Customer Agreement billing profile owner, in the left menu, select **Billing profiles**. In the list of billing profiles, select one.
1. In the left menu, select **Products + services** > **Savings plans**.
    The complete list of savings plans for your EA enrollment or billing profile is shown.
1. Billing administrators can take ownership of a savings plan with the [Savings Plan Order - Elevate REST API](/rest/api/billingbenefits/savings-plan-order/elevate) to give themselves Azure RBAC roles.

### Adding billing administrators

Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement in the Azure portal.

- For an Enterprise Agreement, add users with the Enterprise Administrator role to view and manage all savings plan orders that apply to the Enterprise Agreement. Enterprise administrators can view and manage savings plan in **Cost Management + Billing**.
  - Users with the _Enterprise Administrator (read only)_ role can only view the savings plan from **Cost Management + Billing**.
  - Department admins and account owners can't view savings plans unless they're explicitly added to them using Access control (IAM). For more information, see [Manage Azure Enterprise roles](../manage/understand-ea-roles.md).
- For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all savings plan purchases made using the billing profile. 
    - Billing profile readers and invoice managers can view all savings plans that are paid for with the billing profile. However, they can't make changes to savings plans. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

## View savings plans with Azure RBAC access

If you purchased the savings plan or you're added to a savings plan, use the following steps to view and manage savings plans in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All Services** > **Savings plans** to list savings plans that you have access to.

## Manage subscriptions and management groups with elevated access

You can [elevate a user's access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md).

After you have elevated access:

1. Navigate to **All Services** > **Savings plans** to see all savings plans that are in the tenant.
2. To make modifications to the savings plan, add yourself as an owner of the savings plan order using Access control (IAM).

## Grant access to individual savings plans

Users who have owner access on the savings plan and billing administrators can delegate access management for an individual savings plan order in the Azure portal.

To allow other people to manage savings plans, you have two options:

- Delegate access management for an individual savings plan order by assigning the Owner role to a user at the resource scope of the savings plan order. If you want to give limited access, select a different role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml).
- Add a user as billing administrator to an Enterprise Agreement or a Microsoft Customer Agreement:
  - For an Enterprise Agreement, add users with the Enterprise Administrator role to view and manage all savings plan orders that apply to the Enterprise Agreement. Users with the Enterprise Administrator (read only) role can only view the savings plan. Department admins and account owners can't view savings plans unless they're explicitly added to them using Access control (IAM). For more information, see [Manage Azure Enterprise roles](../manage/understand-ea-roles.md).
  - For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all savings plan purchases made using the billing profile. Billing profile readers and invoice managers can view all savings plans that are paid for with the billing profile. However, they can't make changes to savings plans. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

      _Enterprise Administrators can take ownership of a savings plan order and they can add other users to a savings plan using Access control (IAM)._

  - For a Microsoft Customer Agreement, users with the billing profile owner role or the billing profile contributor role can manage all savings plan purchases made using the billing profile. Billing profile readers and invoice managers can view all savings plans that are paid for with the billing profile. However, they can't make changes to savings plans. For more information, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).



## Grant access with PowerShell

Users that have owner access for savings plan orders, users with elevated access, and [User Access Administrators](../../role-based-access-control/built-in-roles.md#user-access-administrator) can delegate access management for all savings plan orders they have access to.

Access granted using PowerShell isn't shown in the Azure portal. Instead, you use the `get-AzRoleAssignment` command in the following section to view assigned roles.

## Assign the owner role for all savings plan

Use the following Azure PowerShell script to give a user Azure RBAC access to all savings plan orders in their Microsoft Entra tenant (directory).

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

When you use the PowerShell script to assign the ownership role and it runs successfully, a success message isn’t returned.

### Parameters

**-ObjectId**  Microsoft Entra ObjectId of the user, group, or service principal.
- Type: String
- Aliases: Id, PrincipalId
- Position:	Named
- Default value: None
- Accept pipeline input: True
- Accept wildcard characters:	False

**-TenantId** Tenant unique identifier.
- Type:	String
- Position:	5
- Default value: None
- Accept pipeline input: False
- Accept wildcard characters: False

## Tenant-level access

[User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) rights are required before you can grant users or groups the Savings plan Administrator and Savings plan Reader roles at the tenant level. In order to get User Access Administrator rights at the tenant level, follow [Elevate access](../../role-based-access-control/elevate-access-global-admin.md) steps.

### Add a Savings plan Administrator role or Savings plan Reader role at the tenant level
You can assign these roles from the [Azure portal](https://portal.azure.com).

1. Sign in to the Azure portal and navigate to **Savings plan**.
1. Select a savings plan that you have access to.
1. At the top of the page, select **Role Assignment**.
1. Select the **Roles** tab.
1. To make modifications, add a user as a Savings plan Administrator or Savings plan Reader using Access control.

### Add a Savings plan Administrator role at the tenant level using Azure PowerShell script

Use the following Azure PowerShell script to add a Savings plan Administrator role at the tenant level with PowerShell.

```azurepowershell
Import-Module Az.Accounts
Import-Module Az.Resources
Connect-AzAccount -Tenant <TenantId>
New-AzRoleAssignment -Scope "/providers/Microsoft.BillingBenefits" -PrincipalId <ObjectId> -RoleDefinitionName "Savings plan Administrator"
```

#### Parameters

**-ObjectId** Microsoft Entra ObjectId of the user, group, or service principal.
- Type:	String
- Aliases: Id, PrincipalId
- Position:	Named
- Default value: None
- Accept pipeline input: True
- Accept wildcard characters: False

**-TenantId** Tenant unique identifier.
- Type:	String
- Position:	5
- Default value: None
- Accept pipeline input: False
- Accept wildcard characters: False

### Assign a Savings plan Reader role at the tenant level using Azure PowerShell script

Use the following Azure PowerShell script to assign the Savings plan Reader role at the tenant level with PowerShell.

```azurepowershell

Import-Module Az.Accounts
Import-Module Az.Resources

Connect-AzAccount -Tenant <TenantId>

New-AzRoleAssignment -Scope "/providers/Microsoft.BillingBenefits" -PrincipalId <ObjectId> -RoleDefinitionName "Savings plan Reader"
```

#### Parameters

**-ObjectId** Microsoft Entra ObjectId of the user, group, or service principal.
- Type:	String
- Aliases: Id, PrincipalId
- Position:	Named
- Default value: None
- Accept pipeline input: True
- Accept wildcard characters: False

**-TenantId** Tenant unique identifier.
- Type:	String
- Position:	5
- Default value: None
- Accept pipeline input: False
- Accept wildcard characters: False


## Next steps

- [Manage Azure savings plans](manage-savings-plan.md).
