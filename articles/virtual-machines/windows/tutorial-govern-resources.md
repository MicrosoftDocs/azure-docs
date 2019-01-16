---
title: Tutorial - Govern Azure virtual machines with Azure PowerShell | Microsoft Docs
description: In this tutorial, you learn how to use Azure PowerShell to manage Azure virtual machines by applying RBAC, polices, locks and tags
services: virtual-machines-windows
documentationcenter: virtual-machines
author: tfitzmac
manager: jeconnoc
editor: tysonn

ms.service: virtual-machines-windows
ms.workload: infrastructure
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: tutorial
ms.date: 10/12/2018
ms.author: tomfitz
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn how to control and manage VM resources so that I can secure and audit resource access, and group resources for billing or management.
---

# Tutorial: Learn about Windows virtual machine governance with Azure PowerShell

[!INCLUDE [Resource Manager governance introduction](../../../includes/resource-manager-governance-intro.md)]

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

The examples in this article require version 6.0 or later of Azure PowerShell. If you're running PowerShell locally and you don't have version 6.0 or later, [update your version](/powershell/azure/install-azurerm-ps). You also need to run `Connect-AzureRmAccount` to create a connection with Azure. For local installations, you must also [download the Azure AD PowerShell module](https://www.powershellgallery.com/packages/AzureAD/) to create a new Azure Active Directory group.

## Understand scope

[!INCLUDE [Resource Manager governance scope](../../../includes/resource-manager-governance-scope.md)]

In this tutorial, you apply all management settings to a resource group so you can easily remove those settings when done.

Let's create that resource group.

```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

Currently, the resource group is empty.

## Role-based access control

You want to make sure users in your organization have the right level of access to these resources. You don't want to grant unlimited access to users, but you also need to make sure they can do their work. [Role-based access control](../../role-based-access-control/overview.md) enables you to manage which users have permission to complete specific actions at a scope.

To create and remove role assignments, users must have `Microsoft.Authorization/roleAssignments/*` access. This access is granted through the Owner or User Access Administrator roles.

For managing virtual machine solutions, there are three resource-specific roles that provide commonly needed access:

* [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)
* [Network Contributor](../../role-based-access-control/built-in-roles.md#network-contributor)
* [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor)

Instead of assigning roles to individual users, it's often easier to use an Azure Active Directory group that has users who need to take similar actions. Then, assign that group to the appropriate role. For this article, either use an existing group for managing the virtual machine, or use the portal to [create an Azure Active Directory group](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

After creating a new group or finding an existing one, use the [New-AzureRmRoleAssignment](/powershell/module/azurerm.resources/new-azurermroleassignment) command to assign the Azure Active Directory group to the Virtual Machine Contributor role for the resource group.  

```azurepowershell-interactive
$adgroup = Get-AzureRmADGroup -DisplayName <your-group-name>

New-AzureRmRoleAssignment -ObjectId $adgroup.id `
  -ResourceGroupName myResourceGroup `
  -RoleDefinitionName "Virtual Machine Contributor"
```

If you receive an error stating **Principal <guid> does not exist in the directory**, the new group hasn't propagated throughout Azure Active Directory. Try running the command again.

Typically, you repeat the process for *Network Contributor* and *Storage Account Contributor* to make sure users are assigned to manage the deployed resources. In this article, you can skip those steps.

## Azure Policy

[Azure Policy](../../azure-policy/azure-policy-introduction.md) helps you make sure all resources in subscription meet corporate standards. Your subscription already has several policy definitions. To see the available policy definitions, use the [Get-AzureRmPolicyDefinition](/powershell/module/AzureRM.Resources/Get-AzureRmPolicyDefinition) command:

```azurepowershell-interactive
(Get-AzureRmPolicyDefinition).Properties | Format-Table displayName, policyType
```

You see the existing policy definitions. The policy type is either **BuiltIn** or **Custom**. Look through the definitions for ones that describe a condition you want assign. In this article, you assign policies that:

* Limit the locations for all resources.
* Limit the SKUs for virtual machines.
* Audit virtual machines that don't use managed disks.

In the following example, you retrieve three policy definitions based on the display name. You use the [New-AzureRMPolicyAssignment](/powershell/module/azurerm.resources/new-azurermpolicyassignment) command to assign those definitions to the resource group. For some policies, you provide parameter values to specify the allowed values.

```azurepowershell-interactive
# Values to use for parameters
$locations ="eastus", "eastus2"
$skus = "Standard_DS1_v2", "Standard_E2s_v2"

# Get the resource group
$rg = Get-AzureRmResourceGroup -Name myResourceGroup

# Get policy definitions for allowed locations, allowed SKUs, and auditing VMs that don't use managed disks
$locationDefinition = Get-AzureRmPolicyDefinition | where-object {$_.properties.displayname -eq "Allowed locations"}
$skuDefinition = Get-AzureRmPolicyDefinition | where-object {$_.properties.displayname -eq "Allowed virtual machine SKUs"}
$auditDefinition = Get-AzureRmPolicyDefinition | where-object {$_.properties.displayname -eq "Audit VMs that do not use managed disks"}

# Assign policy for allowed locations
New-AzureRMPolicyAssignment -Name "Set permitted locations" `
  -Scope $rg.ResourceId `
  -PolicyDefinition $locationDefinition `
  -listOfAllowedLocations $locations

# Assign policy for allowed SKUs
New-AzureRMPolicyAssignment -Name "Set permitted VM SKUs" `
  -Scope $rg.ResourceId `
  -PolicyDefinition $skuDefinition `
  -listOfAllowedSKUs $skus

# Assign policy for auditing unmanaged disks
New-AzureRMPolicyAssignment -Name "Audit unmanaged disks" `
  -Scope $rg.ResourceId `
  -PolicyDefinition $auditDefinition
```

## Deploy the virtual machine

You have assigned roles and policies, so you're ready to deploy your solution. The default size is Standard_DS1_v2, which is one of your allowed SKUs. When running this step, you're prompted for credentials. The values that you enter are configured as the user name and password for the virtual machine.

```azurepowershell-interactive
New-AzureRmVm -ResourceGroupName "myResourceGroup" `
     -Name "myVM" `
     -Location "East US" `
     -VirtualNetworkName "myVnet" `
     -SubnetName "mySubnet" `
     -SecurityGroupName "myNetworkSecurityGroup" `
     -PublicIpAddressName "myPublicIpAddress" `
     -OpenPorts 80,3389
```

After your deployment finishes, you can apply more management settings to the solution.

## Lock resources

[Resource locks](../../azure-resource-manager/resource-group-lock-resources.md) prevent users in your organization from accidentally deleting or modifying critical resources. Unlike role-based access control, resource locks apply a restriction across all users and roles. You can set the lock level to *CanNotDelete* or *ReadOnly*.

To lock the virtual machine and network security group, use the [New-AzureRmResourceLock](/powershell/module/azurerm.resources/new-azurermresourcelock) command:

```azurepowershell-interactive
# Add CanNotDelete lock to the VM
New-AzureRmResourceLock -LockLevel CanNotDelete `
  -LockName LockVM `
  -ResourceName myVM `
  -ResourceType Microsoft.Compute/virtualMachines `
  -ResourceGroupName myResourceGroup

# Add CanNotDelete lock to the network security group
New-AzureRmResourceLock -LockLevel CanNotDelete `
  -LockName LockNSG `
  -ResourceName myNetworkSecurityGroup `
  -ResourceType Microsoft.Network/networkSecurityGroups `
  -ResourceGroupName myResourceGroup
```

To test the locks, try running the following command:

```azurepowershell-interactive 
Remove-AzureRmResourceGroup -Name myResourceGroup
```

You see an error stating that the delete operation can't be completed because of a lock. The resource group can only be deleted if you specifically remove the locks. That step is shown in [Clean up resources](#clean-up-resources).

## Tag resources

You apply [tags](../../azure-resource-manager/resource-group-using-tags.md) to your Azure resources to logically organize them by categories. Each tag consists of a name and a value. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

[!INCLUDE [Resource Manager governance tags Powershell](../../../includes/resource-manager-governance-tags-powershell.md)]

To apply tags to a virtual machine, use the [Set-AzureRmResource](/powershell/module/azurerm.resources/set-azurermresource) command:

```azurepowershell-interactive
# Get the virtual machine
$r = Get-AzureRmResource -ResourceName myVM `
  -ResourceGroupName myResourceGroup `
  -ResourceType Microsoft.Compute/virtualMachines

# Apply tags to the virtual machine
Set-AzureRmResource -Tag @{ Dept="IT"; Environment="Test"; Project="Documentation" } -ResourceId $r.ResourceId -Force
```

### Find resources by tag

To find resources with a tag name and value, use the [Get-AzureRmResource](/powershell/module/azurerm.resources/get-azurermresource) command:

```azurepowershell-interactive
(Get-AzureRmResource -Tag @{ Environment="Test"}).Name
```

You can use the returned values for management tasks like stopping all virtual machines with a tag value.

```azurepowershell-interactive
Get-AzureRmResource -Tag @{ Environment="Test"} | Where-Object {$_.ResourceType -eq "Microsoft.Compute/virtualMachines"} | Stop-AzureRmVM
```

### View costs by tag values

[!INCLUDE [Resource Manager governance tags billing](../../../includes/resource-manager-governance-tags-billing.md)]

## Clean up resources

The locked network security group can't be deleted until the lock is removed. To remove the lock, use the [Remove-AzureRmResourceLock](/powershell/module/azurerm.resources/remove-azurermresourcelock) command:

```azurepowershell-interactive
Remove-AzureRmResourceLock -LockName LockVM `
  -ResourceName myVM `
  -ResourceType Microsoft.Compute/virtualMachines `
  -ResourceGroupName myResourceGroup
Remove-AzureRmResourceLock -LockName LockNSG `
  -ResourceName myNetworkSecurityGroup `
  -ResourceType Microsoft.Network/networkSecurityGroups `
  -ResourceGroupName myResourceGroup
```

When no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to remove the resource group, VM, and all related resources.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

In this tutorial, you created a custom VM image. You learned how to:

> [!div class="checklist"]
> * Assign users to a role
> * Apply policies that enforce standards
> * Protect critical resources with locks
> * Tag resources for billing and management

Advance to the next tutorial to learn about how highly available virtual machines.

> [!div class="nextstepaction"]
> [Monitor virtual machines](tutorial-monitoring.md)

