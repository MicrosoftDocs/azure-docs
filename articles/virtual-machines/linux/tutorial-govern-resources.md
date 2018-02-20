---
title: Govern virtual machines with Azure CLI | Microsoft Docs
description: Tutorial - Manage virtual machines by applying RBAC, polices, locks and tags with Azure CLI
services: virtual-machines-linux
documentationcenter: virtual-machines
author: tfitzmac
manager: timlt
editor: tysonn

ms.service: virtual-machines-linux
ms.workload: infrastructure
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 02/19/2018
ms.author: tomfitz

---
# Virtual machine governance with Azure CLI

[!include[Resource Manager governance introduction](../../../includes/resource-manager-governance-intro.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

To install and use the CLI locally, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

## Understand scope

[!include[Resource Manager governance scope](../../../includes/resource-manager-governance-scope.md)]

In this article, you apply all management settings to a resource group so you can easily remove those settings when done.

Let's create the resource group.

```azurecli-interactive
az account set -s "<subscription-name>"
az group create --name myResourceGroup --location "East US"
```

Currently, the resource group is empty.

## Role-based access control

You want to make sure users in your organization have the right level of access to these resources. You don't want to grant unlimited access to users, but you also need to make sure they can do their work. [Role-based access control](../../active-directory/role-based-access-control-what-is.md) enables you to manage which users have permission to complete specific actions at a scope.

To create and remove role assignments, users must have `Microsoft.Authorization/roleAssignments/*` access. This access is granted through the Owner or User Access Administrator roles.

For managing virtual machine solutions, there are three resource-specific roles that provide commonly needed access:

* [Virtual Machine Contributor](../../active-directory/role-based-access-built-in-roles.md#virtual-machine-contributor)
* [Network Contributor](../../active-directory/role-based-access-built-in-roles.md#network-contributor)
* [Storage Account Contributor](../../active-directory/role-based-access-built-in-roles.md#storage-account-contributor)

Instead of assigning roles to individual users, it's often easier to [create an Azure Active Directory group](../../active-directory/active-directory-groups-create-azure-portal.md) for users who need to take similar actions. Then, assign that group to the appropriate role. To simplify this article, you create an Azure Active Directory group without members. You can still assign this group to a role for a scope. 

The following example creates a group.

```azurecli-interactive
adgroupId=$(az ad group create --display-name VMDemoContributors --mail-nickname vmDemoGroup --query objectId --output tsv)
```

Assign the new Azure Active Directory group to the Virtual Machine Contributor role for the resource group. It takes a moment for the group to propagate throughout Azure Active Directory. If you run the following command before it has propagated, you receive an error stating **Principal <guid> does not exist in the directory**. Try running the command again.

```azurecli-interactive
az role assignment create --assignee-object-id $adgroupId --role "Virtual Machine Contributor" --resource-group myResourceGroup
```

Typically, you repeat the process for **Network Contributor** and **Storage Account Contributor** to make sure users are assigned to manage the deployed resources. In this article, you can skip those steps.

## Azure policies

[!include[Resource Manager governance policy](../../../includes/resource-manager-governance-policy.md)]

### Apply policies

Your subscription already has several policy definitions. To see the available policy definitions, use:

```azurecli-interactive
az policy definition list --query "[].[displayName, policyType, name]" --output table
```

You see the existing policy definitions. The policy type is either **BuiltIn** or **Custom**. Look through the definitions for ones that describe a condition you want assign. In this article, you assign policies that:

* limit the locations for all resources
* limit the SKUs for virtual machines
* audit virtual machines that do not use managed disks

```azurecli-interactive
$skus = "Standard_DS1_v2", "Standard_E2s_v2"

locationDefinition=$(az policy definition list --query "[?displayName=='Allowed locations'].name | [0]" --output tsv)
auditDefinition=$(az policy definition list --query "[?displayName=='Audit VMs that do not use managed disks'].name | [0]" --output tsv)


$skuDefinition = Get-AzureRmPolicyDefinition | where-object {$_.properties.displayname -eq "Allowed virtual machine SKUs"}

az policy assignment create --name "Set permitted locations" \
  --resource-group myResourceGroup \
  --policy $locationDefinition \
  --params '{ 
      "allowedLocations": {
        "value": [
          "East US", 
          "East US2"
        ]
      }
    }'

az policy assignment create --name "Audit unmanaged disks" \
  --resource-group myResourceGroup \
  --policy $auditDefinition

New-AzureRMPolicyAssignment -Name "Set permitted VM SKUs" `
  -Scope $rg.ResourceId `
  -PolicyDefinition $skuDefinition `
  -listOfAllowedSKUs $skus
```


## Deploy the virtual machine

You have assigned roles and policies, so you're ready to deploy your solution. The default size is Standard_DS1_v2, which is one of your allowed SKUs. When running this step, you are prompted for credentials. The values that you enter are configured as the user name and password for the virtual machine.

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

[Resource locks](../../azure-resource-manager/resource-group-lock-resources.md) prevent users in your organization from accidentally deleting or modifying critical resources. Unlike role-based access control, resource locks apply a restriction across all users and roles. You can set the lock level to CanNotDelete or ReadOnly.

To create or delete management locks, you must have access to `Microsoft.Authorization/locks/*` actions. Of the built-in roles, only **Owner** and **User Access Administrator** are granted those actions.

To lock the virtual machine and network security group, use:

```azurepowershell-interactive
New-AzureRmResourceLock -LockLevel CanNotDelete `
  -LockName LockVM `
  -ResourceName myVM `
  -ResourceType Microsoft.Compute/virtualMachines `
  -ResourceGroupName myResourceGroup
New-AzureRmResourceLock -LockLevel CanNotDelete `
  -LockName LockNSG `
  -ResourceName myNetworkSecurityGroup `
  -ResourceType Microsoft.Network/networkSecurityGroups `
  -ResourceGroupName myResourceGroup
```

The virtual machine can only be deleted if you specifically remove the lock. That step is shown in [Clean up resources](#clean-up-resources).

## Tag resources

You apply [tags](../../azure-resource-manager/resource-group-using-tags.md) to your Azure resources to logically organize them by categories. Each tag consists of a name and a value. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

[!include[Resource Manager governance tags Powershell](../../../includes/resource-manager-governance-tags-powershell.md)]

To apply tags to a virtual machine, use:

```azurepowershell-interactive
$r = Get-AzureRmResource -ResourceName myVM `
  -ResourceGroupName myResourceGroup `
  -ResourceType Microsoft.Compute/virtualMachines
Set-AzureRmResource -Tag @{ Dept="IT"; Environment="Test"; Project="Documentation" } -ResourceId $r.ResourceId -Force
```

### Find resources by tag

To find resources with a tag name and value, use:

```azurepowershell-interactive
(Find-AzureRmResource -TagName Environment -TagValue Test).Name
```

You can use the returned values for management tasks like stopping all virtual machines with a tag value.

```azurepowershell-interactive
Find-AzureRmResource -TagName Environment -TagValue Test | Where-Object {$_.ResourceType -eq "Microsoft.Compute/virtualMachines"} | Stop-AzureRmVM
```

### View costs by tag values

[!include[Resource Manager governance tags billing](../../../includes/resource-manager-governance-tags-billing.md)]

## Clean up resources

The locked network security group can't be deleted until the lock is removed. To remove the lock, use:

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

```powershell
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

