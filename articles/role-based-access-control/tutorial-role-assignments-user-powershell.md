---
title: "Tutorial: Grant a user access to Azure resources using Azure PowerShell - Azure RBAC"
description: Learn how to grant a user access to Azure resources using Azure PowerShell and Azure role-based access control (Azure RBAC) in this tutorial.
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.custom: devx-track-azurepowershell, has-azure-ad-ps-ref,  azure-ad-ref-level-one-done
ms.topic: tutorial
ms.date: 02/02/2019
ms.author: rolyon
#Customer intent: As a dev or devops, I want step-by-step instructions for how to grant permissions for users to resources so that they can perform their job.
---

# Tutorial: Grant a user access to Azure resources using Azure PowerShell

[Azure role-based access control (Azure RBAC)](overview.md) is the way that you manage access to Azure resources. In this tutorial, you grant a user access to view everything in a subscription and manage everything in a resource group using Azure PowerShell.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Grant access for a user at different scopes
> * List access
> * Remove access

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [az-powershell-update](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Prerequisites

To complete this tutorial, you will need:

- Permissions to create users in Microsoft Entra ID (or have an existing user)
- [Azure Cloud Shell](../cloud-shell/quickstart-powershell.md)
- [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/installation)

## Role assignments

In Azure RBAC, to grant access, you create a role assignment. A role assignment consists of three elements: security principal, role definition, and scope. Here are the two role assignments you will perform in this tutorial:

| Security principal | Role definition | Scope |
| --- | --- | --- |
| User<br>(RBAC Tutorial User) | [Reader](built-in-roles.md#reader) | Subscription |
| User<br>(RBAC Tutorial User)| [Contributor](built-in-roles.md#contributor) | Resource group<br>(rbac-tutorial-resource-group) |

   ![Role assignments for a user](./media/tutorial-role-assignments-user-powershell/rbac-role-assignments-user.png)

## Create a user

To assign a role, you need a user, group, or service principal. If you don't already have a user, you can create one.

1. In Azure Cloud Shell, create a password that complies with your password complexity requirements.

    ```azurepowershell
    $PasswordProfile = @{ Password = "<Password>" }
    ```

1. Create a new user for your domain using the [New-MgUser](/powershell/module/microsoft.graph.users/new-mguser) command.

    ```azurepowershell
    New-MgUser -DisplayName "RBAC Tutorial User" -PasswordProfile $PasswordProfile `
       -UserPrincipalName "rbacuser@example.com" -AccountEnabled:$true -MailNickName "rbacuser"
    ```

    ```output
    DisplayName        Id                                   Mail UserPrincipalName
    -----------        --                                   ---- -----------------
    RBAC Tutorial User aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb      rbacuser@example.com
    ```

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
   ResourceId        : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/rbac-tutorial-resource-group
   ```

## Grant access

To grant access for the user, you use the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command to assign a role. You must specify the security principal, role definition, and scope.

1. Get the ID of your subscription using the [Get-AzSubscription](/powershell/module/Az.Accounts/Get-AzSubscription) command.

    ```azurepowershell
    Get-AzSubscription
    ```

    ```Example
    Name     : Pay-As-You-Go
    Id       : 00000000-0000-0000-0000-000000000000
    TenantId : aaaabbbb-0000-cccc-1111-dddd2222eeee
    State    : Enabled
    ```

1. Save the subscription scope in a variable.

    ```azurepowershell
    $subScope = "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"
    ```

1. Assign the [Reader](built-in-roles.md#reader) role to the user at the subscription scope.

    ```azurepowershell
    New-AzRoleAssignment -SignInName rbacuser@example.com `
      -RoleDefinitionName "Reader" `
      -Scope $subScope
    ```

    ```Example
    RoleAssignmentId   : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/providers/Microsoft.Authorization/roleAssignments/00000000-0000-0000-0000-000000000000
    Scope              : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e
    DisplayName        : RBAC Tutorial User
    SignInName         : rbacuser@example.com
    RoleDefinitionName : Reader
    RoleDefinitionId   : acdd72a7-3385-48ef-bd42-f606fba81ae7
    ObjectId           : aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb
    ObjectType         : User
    CanDelegate        : False
    ```

1. Assign the [Contributor](built-in-roles.md#contributor) role to the user at the resource group scope.

    ```azurepowershell
    New-AzRoleAssignment -SignInName rbacuser@example.com `
      -RoleDefinitionName "Contributor" `
      -ResourceGroupName "rbac-tutorial-resource-group"
    ```

    ```Example
    RoleAssignmentId   : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/rbac-tutorial-resource-group/providers/Microsoft.Authorization/roleAssignments/00000000-0000-0000-0000-000000000000
    Scope              : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/rbac-tutorial-resource-group
    DisplayName        : RBAC Tutorial User
    SignInName         : rbacuser@example.com
    RoleDefinitionName : Contributor
    RoleDefinitionId   : b24988ac-6180-42a0-ab88-20f7382dd24c
    ObjectId           : aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb
    ObjectType         : User
    CanDelegate        : False
    ```

## List access

1. To verify the access for the subscription, use the [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment) command to list the role assignments.

    ```azurepowershell
    Get-AzRoleAssignment -SignInName rbacuser@example.com -Scope $subScope
    ```

    ```Example
    RoleAssignmentId   : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/providers/Microsoft.Authorization/roleAssignments/ffffffff-eeee-dddd-cccc-bbbbbbbbbbb0
    Scope              : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e
    DisplayName        : RBAC Tutorial User
    SignInName         : rbacuser@example.com
    RoleDefinitionName : Reader
    RoleDefinitionId   : acdd72a7-3385-48ef-bd42-f606fba81ae7
    ObjectId           : aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb
    ObjectType         : User
    CanDelegate        : False
    ```

    In the output, you can see that the Reader role has been assigned to the RBAC Tutorial User at the subscription scope.

1. To verify the access for the resource group, use the [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment) command to list the role assignments.

    ```azurepowershell
    Get-AzRoleAssignment -SignInName rbacuser@example.com -ResourceGroupName "rbac-tutorial-resource-group"
    ```

    ```Example
    RoleAssignmentId   : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/rbac-tutorial-resource-group/providers/Microsoft.Authorization/roleAssignments/00000000-0000-0000-0000-000000000000
    Scope              : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/rbac-tutorial-resource-group
    DisplayName        : RBAC Tutorial User
    SignInName         : rbacuser@example.com
    RoleDefinitionName : Contributor
    RoleDefinitionId   : b24988ac-6180-42a0-ab88-20f7382dd24c
    ObjectId           : aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb
    ObjectType         : User
    CanDelegate        : False
    
    RoleAssignmentId   : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/providers/Microsoft.Authorization/roleAssignments/ffffffff-eeee-dddd-cccc-bbbbbbbbbbb0
    Scope              : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e
    DisplayName        : RBAC Tutorial User
    SignInName         : rbacuser@example.com
    RoleDefinitionName : Reader
    RoleDefinitionId   : acdd72a7-3385-48ef-bd42-f606fba81ae7
    ObjectId           : aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb
    ObjectType         : User
    CanDelegate        : False
    ```

    In the output, you can see that both the Contributor and Reader roles have been assigned to the RBAC Tutorial User. The Contributor role is at the rbac-tutorial-resource-group scope and the Reader role is inherited at the subscription scope.

## (Optional) List access using the Azure Portal

1. To see how the role assignments look in the Azure portal, view the **Access control (IAM)** blade for the subscription.

    ![Role assignments for a user at subscription scope](./media/tutorial-role-assignments-user-powershell/role-assignments-subscription-user.png)

1. View the **Access control (IAM)** blade for the resource group.

    ![Role assignments for a user at resource group scope](./media/tutorial-role-assignments-user-powershell/role-assignments-resource-group-user.png)

## Remove access

To remove access for users, groups, and applications, use [Remove-AzRoleAssignment](/powershell/module/az.resources/remove-azroleassignment) to remove a role assignment.

1. Use the following command to remove the Contributor role assignment for the user at the resource group scope.

    ```azurepowershell
    Remove-AzRoleAssignment -SignInName rbacuser@example.com `
      -RoleDefinitionName "Contributor" `
      -ResourceGroupName "rbac-tutorial-resource-group"
    ```

1. Use the following command to remove the Reader role assignment for the user at the subscription scope.

    ```azurepowershell
    Remove-AzRoleAssignment -SignInName rbacuser@example.com `
      -RoleDefinitionName "Reader" `
      -Scope $subScope
    ```

## Clean up resources

To clean up the resources created by this tutorial, delete the resource group and the user.

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

1. Delete the user using the [Remove-MgUser](/powershell/module/microsoft.graph.users/remove-mguser) command.

    ```azurepowershell
    $User = Get-MgUser -Filter "DisplayName eq 'RBAC Tutorial User'"
    Remove-MgUser -UserId $User.Id
    ```

## Next steps

> [!div class="nextstepaction"]
> [Assign Azure roles using Azure PowerShell](role-assignments-powershell.md)
