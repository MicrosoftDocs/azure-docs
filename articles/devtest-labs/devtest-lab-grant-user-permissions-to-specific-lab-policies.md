---
title: Grant user permissions to specific lab policies
description: Learn how to grant user permissions to specific lab policies in DevTest Labs based on each user's needs
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/26/2020 
ms.custom: devx-track-azurepowershell, UpdateFrequency2
---

# Grant user permissions to specific lab policies
## Overview
This article illustrates how to use PowerShell to grant users permissions to a particular lab policy. That way, permissions can be applied based on each user's needs. For example, you might want to grant a particular user the ability to change the VM policy settings, but not the cost policies.

## Policies as resources
As discussed in the [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md) article, Azure RBAC enables fine-grained access management of resources for Azure. Using Azure RBAC, you can segregate duties within your DevOps team and grant only the amount of access to users that they need to perform their jobs.

In DevTest Labs, a policy is a resource type that enables the Azure RBAC action **Microsoft.DevTestLab/labs/policySets/policies/**. Each lab policy is a resource in the Policy resource type, and can be assigned as a scope to an Azure role.

For example, in order to grant users read/write permission to the **Allowed VM Sizes** policy, you would create a custom role that works with the **Microsoft.DevTestLab/labs/policySets/policies/** action, and then assign the appropriate users to this custom role in the scope of **Microsoft.DevTestLab/labs/policySets/policies/AllowedVmSizesInLab**.

To learn more about custom roles in Azure RBAC, see the [Azure custom roles](../role-based-access-control/custom-roles.md).

## Creating a lab custom role using PowerShell
In order to get started, you’ll need to [install Azure PowerShell](/powershell/azure/install-azure-powershell). 

Once you’ve set up the Azure PowerShell cmdlets, you can perform the following tasks:

* List all the operations/actions for a resource provider
* List actions in a particular role:
* Create a custom role

The following PowerShell script illustrates examples of how to perform these tasks:

```azurepowershell
# List all the operations/actions for a resource provider.
Get-AzProviderOperation -OperationSearchString "Microsoft.DevTestLab/*"

# List actions in a particular role.
(Get-AzRoleDefinition "DevTest Labs User").Actions

# Create custom role.
$policyRoleDef = (Get-AzRoleDefinition "DevTest Labs User")
$policyRoleDef.Id = $null
$policyRoleDef.Name = "Policy Contributor"
$policyRoleDef.IsCustom = $true
$policyRoleDef.AssignableScopes.Clear()
$policyRoleDef.AssignableScopes.Add("/subscriptions/<SubscriptionID> ")
$policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/policySets/policies/*")
$policyRoleDef = (New-AzRoleDefinition -Role $policyRoleDef)
```

## Assigning permissions to a user for a specific policy using custom roles
Once you’ve defined your custom roles, you can assign them to users. In order to assign a custom role to a user, you must first obtain the **ObjectId** representing that user. To do that, use the **Get-AzADUser** cmdlet.

In the following example, the **ObjectId** of the *SomeUser* user is 05DEFF7B-0AC3-4ABF-B74D-6A72CD5BF3F3.

```azurepowershell
PS C:\>Get-AzADUser -SearchString "SomeUser"

DisplayName                    Type                           ObjectId
-----------                    ----                           --------
someuser@hotmail.com                                          05DEFF7B-0AC3-4ABF-B74D-6A72CD5BF3F3
```

Once you have the **ObjectId** for the user and a custom role name, you can assign that role to the user with the **New-AzRoleAssignment** cmdlet:

```azurepowershell
PS C:\>New-AzRoleAssignment -ObjectId 05DEFF7B-0AC3-4ABF-B74D-6A72CD5BF3F3 -RoleDefinitionName "Policy Contributor" -Scope /subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.DevTestLab/labs/<LabName>/policySets/default/policies/AllowedVmSizesInLab
```

In the previous example, the **AllowedVmSizesInLab** policy is used. You can use any of the following policies:

* MaxVmsAllowedPerUser
* MaxVmsAllowedPerLab
* AllowedVmSizesInLab
* LabVmsShutdown

## Create a role to allow users to do a specific task

This example script that creates the role **DevTest Labs Advanced User**, which has permission to start and stop all VMs in the lab:

```powershell
    $policyRoleDef = Get-AzRoleDefinition "DevTest Labs User"
    $policyRoleDef.Actions.Remove('Microsoft.DevTestLab/Environments/*')
    $policyRoleDef.Id = $null
    $policyRoleDef.Name = "DevTest Labs Advanced User"
    $policyRoleDef.IsCustom = $true
    $policyRoleDef.AssignableScopes.Clear()
    $policyRoleDef.AssignableScopes.Add("/subscriptions/<subscription Id>")
    $policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/virtualMachines/Start/action")
    $policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/virtualMachines/Stop/action")
    $policyRoleDef = New-AzRoleDefinition -Role $policyRoleDef 
``` 

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Next steps
Once you've granted user permissions to specific lab policies, here are some next steps to consider:

* [Secure access to a lab](devtest-lab-add-devtest-user.md)
* [Set lab policies](devtest-lab-set-lab-policy.md)
* [Create a lab template](devtest-lab-create-template.md)
* [Create custom artifacts for your VMs](devtest-lab-artifact-author.md)
* [Add a VM to a lab](devtest-lab-add-vm.md)
