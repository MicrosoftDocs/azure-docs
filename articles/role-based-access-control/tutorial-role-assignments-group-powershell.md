---
title: "Tutorial: Grant a group access to Azure resources using Azure PowerShell - Azure RBAC"
description: Learn how to grant a group access to Azure resources using Azure PowerShell and Azure role-based access control (Azure RBAC) in this tutorial.
services: active-directory
author: rolyon
manager: amycolannino

ms.service: role-based-access-control
ms.custom: devx-track-azurepowershell, has-azure-ad-ps-ref
ms.topic: tutorial
ms.workload: identity
ms.date: 02/02/2019
ms.author: rolyon
#Customer intent: As a dev or devops, I want step-by-step instructions for how to grant permissions for groups to resources so that they can perform their job.
---

# Tutorial: Grant a group access to Azure resources using Azure PowerShell

[Azure role-based access control (Azure RBAC)](overview.md) is the way that you manage access to Azure resources. In this tutorial, you grant a group access to view everything in a subscription and manage everything in a resource group using Azure PowerShell.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Grant access for a group at different scopes
> * List access
> * Remove access

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [az-powershell-update](../../includes/updated-for-az.md)]

## Prerequisites

To complete this tutorial, you will need:

- Permissions to create groups in Microsoft Entra ID (or have an existing group)
- [Azure Cloud Shell](../cloud-shell/quickstart-powershell.md)

## Role assignments

In Azure RBAC, to grant access, you create a role assignment. A role assignment consists of three elements: security principal, role definition, and scope. Here are the two role assignments you will perform in this tutorial:

| Security principal | Role definition | Scope |
| --- | --- | --- |
| Group<br>(RBAC Tutorial Group) | [Reader](built-in-roles.md#reader) | Subscription |
| Group<br>(RBAC Tutorial Group)| [Contributor](built-in-roles.md#contributor) | Resource group<br>(rbac-tutorial-resource-group) |

   ![Role assignments for a group](./media/tutorial-role-assignments-group-powershell/rbac-role-assignments.png)

## Create a group

To assign a role, you need a user, group, or service principal. If you don't already have a group, you can create one.

- In Azure Cloud Shell, create a new group using the [New-AzureADGroup](/powershell/module/azuread/new-azureadgroup) command.

   ```azurepowershell
   New-AzureADGroup -DisplayName "RBAC Tutorial Group" `
     -MailEnabled $false -SecurityEnabled $true -MailNickName "NotSet"
   ```

   ```Example
   ObjectId                             DisplayName         Description
   --------                             -----------         -----------
   11111111-1111-1111-1111-111111111111 RBAC Tutorial Group
   ```

If you don't have permissions to create groups, you can try the [Tutorial: Grant a user access to Azure resources using Azure PowerShell](tutorial-role-assignments-user-powershell.md) instead.

## Create a resource group

You use a resource group to show how to assign a role at a resource group scope.

1. Get a list of region locations using the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command.

   ```azurepowershell
   Get-AzLocation | select Location
   ```

1. Select a location near you and assign it to a variable.

   ```azurepowershell
   $location = "westus"
   ```

1. Create a new resource group using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command.

   ```azurepowershell
   New-AzResourceGroup -Name "rbac-tutorial-resource-group" -Location $location
   ```

   ```Example
   ResourceGroupName : rbac-tutorial-resource-group
   Location          : westus
   ProvisioningState : Succeeded
   Tags              :
   ResourceId        : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rbac-tutorial-resource-group
   ```

## Grant access

To grant access for the group, you use the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command to assign a role. You must specify the security principal, role definition, and scope.

1. Get the object ID of the group using the [Get-AzureADGroup](/powershell/module/azuread/new-azureadgroup) command.

    ```azurepowershell
    Get-AzureADGroup -SearchString "RBAC Tutorial Group"
    ```

    ```Example
    ObjectId                             DisplayName         Description
    --------                             -----------         -----------
    11111111-1111-1111-1111-111111111111 RBAC Tutorial Group
    ```

1. Save the group object ID in a variable.

    ```azurepowershell
    $groupId = "11111111-1111-1111-1111-111111111111"
    ```

1. Get the ID of your subscription using the [Get-AzSubscription](/powershell/module/Az.Accounts/Get-AzSubscription) command.

    ```azurepowershell
    Get-AzSubscription
    ```

    ```Example
    Name     : Pay-As-You-Go
    Id       : 00000000-0000-0000-0000-000000000000
    TenantId : 22222222-2222-2222-2222-222222222222
    State    : Enabled
    ```

1. Save the subscription scope in a variable.

    ```azurepowershell
    $subScope = "/subscriptions/00000000-0000-0000-0000-000000000000"
    ```

1. Assign the [Reader](built-in-roles.md#reader) role to the group at the subscription scope.

    ```azurepowershell
    New-AzRoleAssignment -ObjectId $groupId `
      -RoleDefinitionName "Reader" `
      -Scope $subScope
    ```

    ```Example
    RoleAssignmentId   : /subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/roleAssignments/44444444-4444-4444-4444-444444444444
    Scope              : /subscriptions/00000000-0000-0000-0000-000000000000
    DisplayName        : RBAC Tutorial Group
    SignInName         :
    RoleDefinitionName : Reader
    RoleDefinitionId   : acdd72a7-3385-48ef-bd42-f606fba81ae7
    ObjectId           : 11111111-1111-1111-1111-111111111111
    ObjectType         : Group
    CanDelegate        : False
    ```

1. Assign the [Contributor](built-in-roles.md#contributor) role to the group at the resource group scope.

    ```azurepowershell
    New-AzRoleAssignment -ObjectId $groupId `
      -RoleDefinitionName "Contributor" `
      -ResourceGroupName "rbac-tutorial-resource-group"
    ```

    ```Example
    RoleAssignmentId   : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rbac-tutorial-resource-group/providers/Microsoft.Authorization/roleAssignments/33333333-3333-3333-3333-333333333333
    Scope              : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rbac-tutorial-resource-group
    DisplayName        : RBAC Tutorial Group
    SignInName         :
    RoleDefinitionName : Contributor
    RoleDefinitionId   : b24988ac-6180-42a0-ab88-20f7382dd24c
    ObjectId           : 11111111-1111-1111-1111-111111111111
    ObjectType         : Group
    CanDelegate        : False
    ```

## List access

1. To verify the access for the subscription, use the [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment) command to list the role assignments.

    ```azurepowershell
    Get-AzRoleAssignment -ObjectId $groupId -Scope $subScope
    ```

    ```Example
    RoleAssignmentId   : /subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/roleAssignments/22222222-2222-2222-2222-222222222222
    Scope              : /subscriptions/00000000-0000-0000-0000-000000000000
    DisplayName        : RBAC Tutorial Group
    SignInName         :
    RoleDefinitionName : Reader
    RoleDefinitionId   : acdd72a7-3385-48ef-bd42-f606fba81ae7
    ObjectId           : 11111111-1111-1111-1111-111111111111
    ObjectType         : Group
    CanDelegate        : False
    ```

    In the output, you can see that the Reader role has been assigned to the RBAC Tutorial Group at the subscription scope.

1. To verify the access for the resource group, use the [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment) command to list the role assignments.

    ```azurepowershell
    Get-AzRoleAssignment -ObjectId $groupId -ResourceGroupName "rbac-tutorial-resource-group"
    ```

    ```Example
    RoleAssignmentId   : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rbac-tutorial-resource-group/providers/Microsoft.Authorization/roleAssignments/33333333-3333-3333-3333-333333333333
    Scope              : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rbac-tutorial-resource-group
    DisplayName        : RBAC Tutorial Group
    SignInName         :
    RoleDefinitionName : Contributor
    RoleDefinitionId   : b24988ac-6180-42a0-ab88-20f7382dd24c
    ObjectId           : 11111111-1111-1111-1111-111111111111
    ObjectType         : Group
    CanDelegate        : False
    
    RoleAssignmentId   : /subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/roleAssignments/22222222-2222-2222-2222-222222222222
    Scope              : /subscriptions/00000000-0000-0000-0000-000000000000
    DisplayName        : RBAC Tutorial Group
    SignInName         :
    RoleDefinitionName : Reader
    RoleDefinitionId   : acdd72a7-3385-48ef-bd42-f606fba81ae7
    ObjectId           : 11111111-1111-1111-1111-111111111111
    ObjectType         : Group
    CanDelegate        : False
    ```

    In the output, you can see that both the Contributor and Reader roles have been assigned to the RBAC Tutorial Group. The Contributor role is at the rbac-tutorial-resource-group scope and the Reader role is inherited at the subscription scope.

## (Optional) List access using the Azure Portal

1. To see how the role assignments look in the Azure portal, view the **Access control (IAM)** blade for the subscription.

    ![Role assignments for a group at subscription scope](./media/tutorial-role-assignments-group-powershell/role-assignments-subscription.png)

1. View the **Access control (IAM)** blade for the resource group.

    ![Role assignments for a group at resource group scope](./media/tutorial-role-assignments-group-powershell/role-assignments-resource-group.png)

## Remove access

To remove access for users, groups, and applications, use [Remove-AzRoleAssignment](/powershell/module/az.resources/remove-azroleassignment) to remove a role assignment.

1. Use the following command to remove the Contributor role assignment for the group at the resource group scope.

    ```azurepowershell
    Remove-AzRoleAssignment -ObjectId $groupId `
      -RoleDefinitionName "Contributor" `
      -ResourceGroupName "rbac-tutorial-resource-group"
    ```

1. Use the following command to remove the Reader role assignment for the group at the subscription scope.

    ```azurepowershell
    Remove-AzRoleAssignment -ObjectId $groupId `
      -RoleDefinitionName "Reader" `
      -Scope $subScope
    ```

## Clean up resources

To clean up the resources created by this tutorial, delete the resource group and the group.

1. Delete the resource group using the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command.

    ```azurepowershell
    Remove-AzResourceGroup -Name "rbac-tutorial-resource-group"
    ```

    ```Example
    Confirm
    Are you sure you want to remove resource group 'rbac-tutorial-resource-group'
    [Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):
    ```
    
1. When asked to confirm, type **Y**. It will take a few seconds to delete.

1. Delete the group using the [Remove-AzureADGroup](/powershell/module/azuread/remove-azureadgroup) command.

    ```azurepowershell
    Remove-AzureADGroup -ObjectId $groupId
    ```
    
    If you receive an error when you try to delete the group, you can also delete the group in the portal.

## Next steps

> [!div class="nextstepaction"]
> [Assign Azure roles using Azure PowerShell](role-assignments-powershell.md)
