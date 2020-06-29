---
title: Create or update Azure custom roles using Azure PowerShell - Azure RBAC
description: Learn how to list, create, update, or delete custom roles using Azure PowerShell and Azure role-based access control (Azure RBAC).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 9e225dba-9044-4b13-b573-2f30d77925a9
ms.service: role-based-access-control
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/18/2020
ms.author: rolyon
ms.reviewer: bagovind
---
# Create or update Azure custom roles using Azure PowerShell

> [!IMPORTANT]
> Adding a management group to `AssignableScopes` is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

If the [Azure built-in roles](built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles. This article describes how to list, create, update, or delete custom roles using Azure PowerShell.

For a step-by-step tutorial on how to create a custom role, see [Tutorial: Create an Azure custom role using Azure PowerShell](tutorial-custom-role-powershell.md).

[!INCLUDE [az-powershell-update](../../includes/updated-for-az.md)]

## Prerequisites

To create custom roles, you need:

- Permissions to create custom roles, such as [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator)
- [Azure Cloud Shell](../cloud-shell/overview.md) or [Azure PowerShell](/powershell/azure/install-az-ps)

## List custom roles

To list the roles that are available for assignment at a scope, use the [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition) command. The following example lists all roles that are available for assignment in the selected subscription.

```azurepowershell
Get-AzRoleDefinition | FT Name, IsCustom
```

```Example
Name                                              IsCustom
----                                              --------
Virtual Machine Operator                              True
AcrImageSigner                                       False
AcrQuarantineReader                                  False
AcrQuarantineWriter                                  False
API Management Service Contributor                   False
...
```

The following example lists just the custom roles that are available for assignment in the selected subscription.

```azurepowershell
Get-AzRoleDefinition | ? {$_.IsCustom -eq $true} | FT Name, IsCustom
```

```Example
Name                     IsCustom
----                     --------
Virtual Machine Operator     True
```

If the selected subscription isn't in the `AssignableScopes` of the role, the custom role won't be listed.

## List a custom role definition

To list a custom role definition, use [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition). This is the same command as you use for a built-in role.

```azurepowershell
Get-AzRoleDefinition <role_name> | ConvertTo-Json
```

```Example
PS C:\> Get-AzRoleDefinition "Virtual Machine Operator" | ConvertTo-Json

{
  "Name": "Virtual Machine Operator",
  "Id": "00000000-0000-0000-0000-000000000000",
  "IsCustom": true,
  "Description": "Can monitor and restart virtual machines.",
  "Actions": [
    "Microsoft.Storage/*/read",
    "Microsoft.Network/*/read",
    "Microsoft.Compute/*/read",
    "Microsoft.Compute/virtualMachines/start/action",
    "Microsoft.Compute/virtualMachines/restart/action",
    "Microsoft.Authorization/*/read",
    "Microsoft.ResourceHealth/availabilityStatuses/read",
    "Microsoft.Resources/subscriptions/resourceGroups/read",
    "Microsoft.Insights/alertRules/*",
    "Microsoft.Support/*"
  ],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/11111111-1111-1111-1111-111111111111"
  ]
}
```

The following example lists just the actions of the role:

```azurepowershell
(Get-AzRoleDefinition <role_name>).Actions
```

```Example
PS C:\> (Get-AzRoleDefinition "Virtual Machine Operator").Actions

"Microsoft.Storage/*/read",
"Microsoft.Network/*/read",
"Microsoft.Compute/*/read",
"Microsoft.Compute/virtualMachines/start/action",
"Microsoft.Compute/virtualMachines/restart/action",
"Microsoft.Authorization/*/read",
"Microsoft.ResourceHealth/availabilityStatuses/read",
"Microsoft.Resources/subscriptions/resourceGroups/read",
"Microsoft.Insights/alertRules/*",
"Microsoft.Insights/diagnosticSettings/*",
"Microsoft.Support/*"
```

## Create a custom role

To create a custom role, use the [New-AzRoleDefinition](/powershell/module/az.resources/new-azroledefinition) command. There are two methods of structuring the role, using `PSRoleDefinition` object or a JSON template. 

### Get operations for a resource provider

When you create custom roles, it is important to know all the possible operations from the resource providers.
You can view the list of [resource provider operations](resource-provider-operations.md) or you can use the [Get-AzProviderOperation](/powershell/module/az.resources/get-azprovideroperation) command to get this information.
For example, if you want to check all the available operations for virtual machines, use this command:

```azurepowershell
Get-AzProviderOperation <operation> | FT OperationName, Operation, Description -AutoSize
```

```Example
PS C:\> Get-AzProviderOperation "Microsoft.Compute/virtualMachines/*" | FT OperationName, Operation, Description -AutoSize

OperationName                                  Operation                                                      Description
-------------                                  ---------                                                      -----------
Get Virtual Machine                            Microsoft.Compute/virtualMachines/read                         Get the propertie...
Create or Update Virtual Machine               Microsoft.Compute/virtualMachines/write                        Creates a new vir...
Delete Virtual Machine                         Microsoft.Compute/virtualMachines/delete                       Deletes the virtu...
Start Virtual Machine                          Microsoft.Compute/virtualMachines/start/action                 Starts the virtua...
...
```

### Create a custom role with the PSRoleDefinition object

When you use PowerShell to create a custom role, you can use one of the [built-in roles](built-in-roles.md) as a starting point or you can start from scratch. The first example in this section starts with a built-in role and then customizes it with more permissions. Edit the attributes to add the `Actions`, `NotActions`, or `AssignableScopes` that you want, and then save the changes as a new role.

The following example starts with the [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor) built-in role to create a custom role named *Virtual Machine Operator*. The new role grants access to all read operations of *Microsoft.Compute*, *Microsoft.Storage*, and *Microsoft.Network* resource providers and grants access to start, restart, and monitor virtual machines. The custom role can be used in two subscriptions.

```azurepowershell
$role = Get-AzRoleDefinition "Virtual Machine Contributor"
$role.Id = $null
$role.Name = "Virtual Machine Operator"
$role.Description = "Can monitor and restart virtual machines."
$role.Actions.Clear()
$role.Actions.Add("Microsoft.Storage/*/read")
$role.Actions.Add("Microsoft.Network/*/read")
$role.Actions.Add("Microsoft.Compute/*/read")
$role.Actions.Add("Microsoft.Compute/virtualMachines/start/action")
$role.Actions.Add("Microsoft.Compute/virtualMachines/restart/action")
$role.Actions.Add("Microsoft.Authorization/*/read")
$role.Actions.Add("Microsoft.ResourceHealth/availabilityStatuses/read")
$role.Actions.Add("Microsoft.Resources/subscriptions/resourceGroups/read")
$role.Actions.Add("Microsoft.Insights/alertRules/*")
$role.Actions.Add("Microsoft.Support/*")
$role.AssignableScopes.Clear()
$role.AssignableScopes.Add("/subscriptions/00000000-0000-0000-0000-000000000000")
$role.AssignableScopes.Add("/subscriptions/11111111-1111-1111-1111-111111111111")
New-AzRoleDefinition -Role $role
```

The following example shows another way to create the *Virtual Machine Operator* custom role. It starts by creating a new `PSRoleDefinition` object. The action operations are specified in the `perms` variable and set to the `Actions` property. The `NotActions` property is set by reading the `NotActions` from the [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor) built-in role. Since [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor) does not have any `NotActions`, this line is not required, but it shows how information can be retrieved from another role.

```azurepowershell
$role = [Microsoft.Azure.Commands.Resources.Models.Authorization.PSRoleDefinition]::new()
$role.Name = 'Virtual Machine Operator 2'
$role.Description = 'Can monitor and restart virtual machines.'
$role.IsCustom = $true
$perms = 'Microsoft.Storage/*/read','Microsoft.Network/*/read','Microsoft.Compute/*/read'
$perms += 'Microsoft.Compute/virtualMachines/start/action','Microsoft.Compute/virtualMachines/restart/action'
$perms += 'Microsoft.Authorization/*/read'
$perms += 'Microsoft.ResourceHealth/availabilityStatuses/read'
$perms += 'Microsoft.Resources/subscriptions/resourceGroups/read'
$perms += 'Microsoft.Insights/alertRules/*','Microsoft.Support/*'
$role.Actions = $perms
$role.NotActions = (Get-AzRoleDefinition -Name 'Virtual Machine Contributor').NotActions
$subs = '/subscriptions/00000000-0000-0000-0000-000000000000','/subscriptions/11111111-1111-1111-1111-111111111111'
$role.AssignableScopes = $subs
New-AzRoleDefinition -Role $role
```

### Create a custom role with JSON template

A JSON template can be used as the source definition for the custom role. The following example creates a custom role that allows read access to storage and compute resources, access to support, and adds that role to two subscriptions. Create a new file `C:\CustomRoles\customrole1.json` with the following example. The Id should be set to `null` on initial role creation as a new ID is generated automatically. 

```json
{
  "Name": "Custom Role 1",
  "Id": null,
  "IsCustom": true,
  "Description": "Allows for read access to Azure storage and compute resources and access to support",
  "Actions": [
    "Microsoft.Compute/*/read",
    "Microsoft.Storage/*/read",
    "Microsoft.Support/*"
  ],
  "NotActions": [],
  "AssignableScopes": [
    "/subscriptions/00000000-0000-0000-0000-000000000000",
    "/subscriptions/11111111-1111-1111-1111-111111111111"
  ]
}
```

To add the role to the subscriptions, run the following PowerShell command:

```azurepowershell
New-AzRoleDefinition -InputFile "C:\CustomRoles\customrole1.json"
```

## Update a custom role

Similar to creating a custom role, you can modify an existing custom role using either the `PSRoleDefinition` object or a JSON template.

### Update a custom role with the PSRoleDefinition object

To modify a custom role, first, use the [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition) command to retrieve the role definition. Second, make the desired changes to the role definition. Finally, use the [Set-AzRoleDefinition](/powershell/module/az.resources/set-azroledefinition) command to save the modified role definition.

The following example adds the `Microsoft.Insights/diagnosticSettings/*` operation to the *Virtual Machine Operator* custom role.

```azurepowershell
$role = Get-AzRoleDefinition "Virtual Machine Operator"
$role.Actions.Add("Microsoft.Insights/diagnosticSettings/*")
Set-AzRoleDefinition -Role $role
```

```Example
PS C:\> $role = Get-AzRoleDefinition "Virtual Machine Operator"
PS C:\> $role.Actions.Add("Microsoft.Insights/diagnosticSettings/*")
PS C:\> Set-AzRoleDefinition -Role $role

Name             : Virtual Machine Operator
Id               : 88888888-8888-8888-8888-888888888888
IsCustom         : True
Description      : Can monitor and restart virtual machines.
Actions          : {Microsoft.Storage/*/read, Microsoft.Network/*/read, Microsoft.Compute/*/read,
                   Microsoft.Compute/virtualMachines/start/action...}
NotActions       : {}
AssignableScopes : {/subscriptions/00000000-0000-0000-0000-000000000000,
                   /subscriptions/11111111-1111-1111-1111-111111111111}
```

The following example adds an Azure subscription to the assignable scopes of the *Virtual Machine Operator* custom role.

```azurepowershell
Get-AzSubscription -SubscriptionName Production3

$role = Get-AzRoleDefinition "Virtual Machine Operator"
$role.AssignableScopes.Add("/subscriptions/22222222-2222-2222-2222-222222222222")
Set-AzRoleDefinition -Role $role
```

```Example
PS C:\> Get-AzSubscription -SubscriptionName Production3

Name     : Production3
Id       : 22222222-2222-2222-2222-222222222222
TenantId : 99999999-9999-9999-9999-999999999999
State    : Enabled

PS C:\> $role = Get-AzRoleDefinition "Virtual Machine Operator"
PS C:\> $role.AssignableScopes.Add("/subscriptions/22222222-2222-2222-2222-222222222222")
PS C:\> Set-AzRoleDefinition -Role $role

Name             : Virtual Machine Operator
Id               : 88888888-8888-8888-8888-888888888888
IsCustom         : True
Description      : Can monitor and restart virtual machines.
Actions          : {Microsoft.Storage/*/read, Microsoft.Network/*/read, Microsoft.Compute/*/read,
                   Microsoft.Compute/virtualMachines/start/action...}
NotActions       : {}
AssignableScopes : {/subscriptions/00000000-0000-0000-0000-000000000000,
                   /subscriptions/11111111-1111-1111-1111-111111111111,
                   /subscriptions/22222222-2222-2222-2222-222222222222}
```

The following example adds a management group to `AssignableScopes` of the *Virtual Machine Operator* custom role. Adding a management group to `AssignableScopes` is currently in preview.

```azurepowershell
Get-AzManagementGroup

$role = Get-AzRoleDefinition "Virtual Machine Operator"
$role.AssignableScopes.Add("/providers/Microsoft.Management/managementGroups/{groupId1}")
Set-AzRoleDefinition -Role $role
```

```Example
PS C:\> Get-AzManagementGroup

Id          : /providers/Microsoft.Management/managementGroups/marketing-group
Type        : /providers/Microsoft.Management/managementGroups
Name        : marketing-group
TenantId    : 99999999-9999-9999-9999-999999999999
DisplayName : Marketing group

PS C:\> $role = Get-AzRoleDefinition "Virtual Machine Operator"
PS C:\> $role.AssignableScopes.Add("/providers/Microsoft.Management/managementGroups/marketing-group")
PS C:\> Set-AzRoleDefinition -Role $role

Name             : Virtual Machine Operator
Id               : 88888888-8888-8888-8888-888888888888
IsCustom         : True
Description      : Can monitor and restart virtual machines.
Actions          : {Microsoft.Storage/*/read, Microsoft.Network/*/read, Microsoft.Compute/*/read,
                   Microsoft.Compute/virtualMachines/start/action...}
NotActions       : {}
AssignableScopes : {/subscriptions/00000000-0000-0000-0000-000000000000,
                   /subscriptions/11111111-1111-1111-1111-111111111111,
                   /subscriptions/22222222-2222-2222-2222-222222222222,
                   /providers/Microsoft.Management/managementGroups/marketing-group}
```

### Update a custom role with a JSON template

Using the previous JSON template, you can easily modify an existing custom role to add or remove Actions. Update the JSON template and add the read action for networking as shown in the following example. The definitions listed in the template are not cumulatively applied to an existing definition, meaning that the role appears exactly as you specify in the template. You also need to update the Id field with the ID of the role. If you aren't sure what this value is, you can use the [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition) cmdlet to get this information.

```json
{
  "Name": "Custom Role 1",
  "Id": "acce7ded-2559-449d-bcd5-e9604e50bad1",
  "IsCustom": true,
  "Description": "Allows for read access to Azure storage and compute resources and access to support",
  "Actions": [
    "Microsoft.Compute/*/read",
    "Microsoft.Storage/*/read",
    "Microsoft.Network/*/read",
    "Microsoft.Support/*"
  ],
  "NotActions": [],
  "AssignableScopes": [
    "/subscriptions/00000000-0000-0000-0000-000000000000",
    "/subscriptions/11111111-1111-1111-1111-111111111111"
  ]
}
```

To update the existing role, run the following PowerShell command:

```azurepowershell
Set-AzRoleDefinition -InputFile "C:\CustomRoles\customrole1.json"
```

## Delete a custom role

To delete a custom role, use the [Remove-AzRoleDefinition](/powershell/module/az.resources/remove-azroledefinition) command.

The following example removes the *Virtual Machine Operator* custom role.

```azurepowershell
Get-AzRoleDefinition "Virtual Machine Operator"
Get-AzRoleDefinition "Virtual Machine Operator" | Remove-AzRoleDefinition
```

```Example
PS C:\> Get-AzRoleDefinition "Virtual Machine Operator"

Name             : Virtual Machine Operator
Id               : 88888888-8888-8888-8888-888888888888
IsCustom         : True
Description      : Can monitor and restart virtual machines.
Actions          : {Microsoft.Storage/*/read, Microsoft.Network/*/read, Microsoft.Compute/*/read,
                   Microsoft.Compute/virtualMachines/start/action...}
NotActions       : {}
AssignableScopes : {/subscriptions/00000000-0000-0000-0000-000000000000,
                   /subscriptions/11111111-1111-1111-1111-111111111111}

PS C:\> Get-AzRoleDefinition "Virtual Machine Operator" | Remove-AzRoleDefinition

Confirm
Are you sure you want to remove role definition with name 'Virtual Machine Operator'.
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y
```

## Next steps

- [Tutorial: Create an Azure custom role using Azure PowerShell](tutorial-custom-role-powershell.md)
- [Azure custom roles](custom-roles.md)
- [Azure Resource Manager resource provider operations](resource-provider-operations.md)
