---
title: "Tutorial: Create an Azure custom role with Azure PowerShell - Azure RBAC"
description: Get started creating an Azure custom role using Azure PowerShell and Azure role-based access control (Azure RBAC) in this tutorial.
services: active-directory
author: rolyon
manager: amycolannino

ms.service: role-based-access-control
ms.custom: devx-track-azurepowershell
ms.topic: tutorial
ms.workload: identity
ms.date: 02/20/2019
ms.author: rolyon
#Customer intent: As a dev or devops, I want step-by-step instructions for how to grant custom permissions because the current built-in roles do not meet my permission needs.
---
# Tutorial: Create an Azure custom role using Azure PowerShell

If the [Azure built-in roles](built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles. For this tutorial, you create a custom role named Reader Support Tickets using Azure PowerShell. The custom role allows the user to view everything in the control plane of a subscription and also open support tickets.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a custom role
> * List custom roles
> * Update a custom role
> * Delete a custom role

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [az-powershell-update](../../includes/updated-for-az.md)]

## Prerequisites

To complete this tutorial, you will need:

- Permissions to create custom roles, such as [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator)
- [Azure Cloud Shell](../cloud-shell/overview.md) or [Azure PowerShell](/powershell/azure/install-azure-powershell)

## Sign in to Azure PowerShell

Sign in to [Azure PowerShell](/powershell/azure/authenticate-azureps).

## Create a custom role

The easiest way to create a custom role is to start with a built-in role, edit it, and then create a new role.

1. In PowerShell, use the [Get-AzProviderOperation](/powershell/module/az.resources/get-azprovideroperation) command to get the list of operations for the Microsoft.Support resource provider. It's helpful to know the operations that are available to create your permissions. You can also see a list of all the operations at [Azure resource provider operations](resource-provider-operations.md#microsoftsupport).

    ```azurepowershell
    Get-AzProviderOperation "Microsoft.Support/*" | FT Operation, Description -AutoSize
    ```
    
    ```Output
    Operation                              Description
    ---------                              -----------
    Microsoft.Support/register/action      Registers to Support Resource Provider
    Microsoft.Support/supportTickets/read  Gets Support Ticket details (including status, severity, contact ...
    Microsoft.Support/supportTickets/write Creates or Updates a Support Ticket. You can create a Support Tic...
    ```

1. Use the [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition) command to output the [Reader](built-in-roles.md#reader) role in JSON format.

    ```azurepowershell
    Get-AzRoleDefinition -Name "Reader" | ConvertTo-Json | Out-File C:\CustomRoles\ReaderSupportRole.json
    ```

1. Open the **ReaderSupportRole.json** file in an editor.

    The following shows the JSON output. For information about the different properties, see [Azure custom roles](custom-roles.md).

    ```json
    {
      "Name": "Reader",
      "Id": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
      "IsCustom": false,
      "Description": "Lets you view everything, but not make any changes.",
      "Actions": [
        "*/read"
      ],
      "NotActions": [],
      "DataActions": [],
      "NotDataActions": [],
      "AssignableScopes": [
        "/"
      ]
    }
    ```
    
1. Edit the JSON file to add the `"Microsoft.Support/*"` action to the `Actions` property. Be sure to include a comma after the read action. This action will allow the user to create support tickets.

1. Get the ID of your subscription using the [Get-AzSubscription](/powershell/module/Az.Accounts/Get-AzSubscription) command.

    ```azurepowershell
    Get-AzSubscription
    ```

1. In `AssignableScopes`, add your subscription ID with the following format: `"/subscriptions/00000000-0000-0000-0000-000000000000"`

    You must add explicit subscription IDs, otherwise you won't be allowed to import the role into your subscription.

1. Delete the `Id` property line and change the `IsCustom` property to `true`.

1. Change the `Name` and `Description` properties to "Reader Support Tickets" and "View everything in the subscription and also open support tickets."

    Your JSON file should look like the following:

    ```json
    {
      "Name": "Reader Support Tickets",
      "IsCustom": true,
      "Description": "View everything in the subscription and also open support tickets.",
      "Actions": [
        "*/read",
        "Microsoft.Support/*"
      ],
      "NotActions": [],
      "DataActions": [],
      "NotDataActions": [],
      "AssignableScopes": [
        "/subscriptions/00000000-0000-0000-0000-000000000000"
      ]
    }
    ```
    
1. To create the new custom role, use the [New-AzRoleDefinition](/powershell/module/az.resources/new-azroledefinition) command and specify the JSON role definition file.

    ```azurepowershell
    New-AzRoleDefinition -InputFile "C:\CustomRoles\ReaderSupportRole.json"
    ```

    ```Output
    Name             : Reader Support Tickets
    Id               : 22222222-2222-2222-2222-222222222222
    IsCustom         : True
    Description      : View everything in the subscription and also open support tickets.
    Actions          : {*/read, Microsoft.Support/*}
    NotActions       : {}
    DataActions      : {}
    NotDataActions   : {}
    AssignableScopes : {/subscriptions/00000000-0000-0000-0000-000000000000}
    ```
        
    The new custom role is now available in the Azure portal and can be assigned to users, groups, or service principals just like built-in roles.

## List custom roles

- To list all your custom roles, use the [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition) command.

    ```azurepowershell
    Get-AzRoleDefinition | ? {$_.IsCustom -eq $true} | FT Name, IsCustom
    ```

    ```Output
    Name                   IsCustom
    ----                   --------
    Reader Support Tickets     True
    ```
    
    You can also see the custom role in the Azure portal.

    ![screenshot of custom role imported in the Azure portal](./media/tutorial-custom-role-powershell/custom-role-reader-support-tickets.png)

## Update a custom role

To update the custom role, you can update the JSON file or use the `PSRoleDefinition` object.

1. To update the JSON file, use the [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition) command to output the custom role in JSON format.

    ```azurepowershell
    Get-AzRoleDefinition -Name "Reader Support Tickets" | ConvertTo-Json | Out-File C:\CustomRoles\ReaderSupportRole2.json
    ```

1. Open the file in an editor.

1. In `Actions`, add the action to create and manage resource group deployments `"Microsoft.Resources/deployments/*"`.

    Your updated JSON file should look like the following:

    ```json
    {
      "Name": "Reader Support Tickets",
      "Id": "22222222-2222-2222-2222-222222222222",
      "IsCustom": true,
      "Description": "View everything in the subscription and also open support tickets.",
      "Actions": [
        "*/read",
        "Microsoft.Support/*",
        "Microsoft.Resources/deployments/*"
      ],
      "NotActions": [],
      "DataActions": [],
      "NotDataActions": [],
      "AssignableScopes": [
        "/subscriptions/00000000-0000-0000-0000-000000000000"
      ]
    }
    ```
        
1. To update the custom role, use the [Set-AzRoleDefinition](/powershell/module/az.resources/set-azroledefinition) command and specify the updated JSON file.

    ```azurepowershell
    Set-AzRoleDefinition -InputFile "C:\CustomRoles\ReaderSupportRole2.json"
    ```

    ```Output
    Name             : Reader Support Tickets
    Id               : 22222222-2222-2222-2222-222222222222
    IsCustom         : True
    Description      : View everything in the subscription and also open support tickets.
    Actions          : {*/read, Microsoft.Support/*, Microsoft.Resources/deployments/*}
    NotActions       : {}
    DataActions      : {}
    NotDataActions   : {}
    AssignableScopes : {/subscriptions/00000000-0000-0000-0000-000000000000}
    ```

1. To use the `PSRoleDefintion` object to update your custom role, first use the [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition) command to get the role.

    ```azurepowershell
    $role = Get-AzRoleDefinition "Reader Support Tickets"
    ```
    
1. Call the `Add` method to add the action to read diagnostic settings.

    ```azurepowershell
    $role.Actions.Add("Microsoft.Insights/diagnosticSettings/*/read")
    ```

1. Use the [Set-AzRoleDefinition](/powershell/module/az.resources/set-azroledefinition) to update the role.

    ```azurepowershell
    Set-AzRoleDefinition -Role $role
    ```
    
    ```Output
    Name             : Reader Support Tickets
    Id               : 22222222-2222-2222-2222-222222222222
    IsCustom         : True
    Description      : View everything in the subscription and also open support tickets.
    Actions          : {*/read, Microsoft.Support/*, Microsoft.Resources/deployments/*,
                       Microsoft.Insights/diagnosticSettings/*/read}
    NotActions       : {}
    DataActions      : {}
    NotDataActions   : {}
    AssignableScopes : {/subscriptions/00000000-0000-0000-0000-000000000000}
    ```
    
## Delete a custom role

1. Use the [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition) command to get the ID of the custom role.

    ```azurepowershell
    Get-AzRoleDefinition "Reader Support Tickets"
    ```

1. Use the [Remove-AzRoleDefinition](/powershell/module/az.resources/remove-azroledefinition) command and specify the role ID to delete the custom role.

    ```azurepowershell
    Remove-AzRoleDefinition -Id "22222222-2222-2222-2222-222222222222"
    ```

    ```Output
    Confirm
    Are you sure you want to remove role definition with id '22222222-2222-2222-2222-222222222222'.
    [Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):
    ```

1. When asked to confirm, type **Y**.

## Next steps

> [!div class="nextstepaction"]
> [Create or update Azure custom roles using Azure PowerShell](custom-roles-powershell.md)
