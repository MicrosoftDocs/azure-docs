---
title: Manage resource groups - Azure PowerShell
description: Use Azure PowerShell to manage your resource groups through Azure Resource Manager. Shows how to create, list, and delete resource groups.
author: mumian
ms.topic: conceptual
ms.date: 03/31/2023
ms.custom: devx-track-azurepowershell, devx-track-arm-template
---
# Manage Azure Resource Groups by using Azure PowerShell

Learn how to use Azure PowerShell with [Azure Resource Manager](overview.md) to manage your Azure resource groups. For managing Azure resources, see [Manage Azure resources by using Azure PowerShell](manage-resources-powershell.md).

## Prerequisites

* Azure PowerShell. For more information, see [Install the Azure Az PowerShell module](/powershell/azure/install-azure-powershell).

* After installing, sign in for the first time. For more information, see [Sign in](/powershell/azure/install-az-ps#sign-in).

## What is a resource group

A resource group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group. You decide how you want to add resources to resource groups based on what makes the most sense for your organization. Generally, add resources that share the same lifecycle to the same resource group so you can easily deploy, update, and delete them as a group.

The resource group stores metadata about the resources. When you specify a location for the resource group, you're specifying where that metadata is stored. For compliance reasons, you may need to ensure that your data is stored in a particular region.

## Create resource groups

To create a resource group, use [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).

```azurepowershell-interactive
New-AzResourceGroup -Name exampleGroup -Location westus
```

## List resource groups

To list the resource groups in your subscription, use [Get-AzResourceGroup](/powershell/module/az.resources/get-azresourcegroup).

```azurepowershell-interactive
Get-AzResourceGroup
```

To get one resource group, provide the name of the resource group.

```azurepowershell-interactive
Get-AzResourceGroup -Name exampleGroup
```

## Delete resource groups

To delete a resource group, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup).

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleGroup
```

For more information about how Azure Resource Manager orders the deletion of resources, see [Azure Resource Manager resource group deletion](delete-resource-group.md).

## Deploy resources

You can deploy Azure resources by using Azure PowerShell, or by deploying an Azure Resource Manager (ARM) template or Bicep file.

### Deploy resources by using storage operations

The following example creates a storage account. The name you provide for the storage account must be unique across Azure.

```azurepowershell-interactive
New-AzStorageAccount -ResourceGroupName exampleGroup -Name examplestore -Location westus -SkuName "Standard_LRS"
```

### Deploy resources by using an ARM template or Bicep file

To deploy an ARM template or Bicep file, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment).

```azurepowershell-interactive
New-AzResourceGroupDeployment -ResourceGroupName exampleGroup -TemplateFile storage.bicep
```

The following example shows the Bicep file named `storage.bicep` that you're deploying:

```bicep
@minLength(3)
@maxLength(11)
param storagePrefix string

var uniqueStorageName = concat(storagePrefix, uniqueString(resourceGroup().id))

resource uniqueStorage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: uniqueStorageName
  location: 'eastus'
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}
```

For more information about deploying an ARM template, see [Deploy resources with ARM templates and Azure PowerShell](../templates/deploy-powershell.md).

For more information about deploying a Bicep file, see [Deploy resources with Bicep and Azure PowerShell](../bicep/deploy-powershell.md).

## Lock resource groups

Locking prevents other users in your organization from accidentally deleting or modifying critical resources. 

To prevent a resource group and its resources from being deleted, use [New-AzResourceLock](/powershell/module/az.resources/new-azresourcelock).

```azurepowershell-interactive
New-AzResourceLock -LockName LockGroup -LockLevel CanNotDelete -ResourceGroupName exampleGroup
```

To get the locks for a resource group, use [Get-AzResourceLock](/powershell/module/az.resources/get-azresourcelock).

```azurepowershell-interactive
Get-AzResourceLock -ResourceGroupName exampleGroup
```

To delete a lock, use [Remove-AzResourceLock](/powershell/module/az.resources/remove-azresourcelock).

```azurepowershell-interactive
$lockId = (Get-AzResourceLock -ResourceGroupName exampleGroup).LockId
Remove-AzResourceLock -LockId $lockId
```

For more information, see [Lock resources with Azure Resource Manager](lock-resources.md).

## Tag resource groups

You can apply tags to resource groups and resources to logically organize your assets. For information, see [Using tags to organize your Azure resources](tag-resources-powershell.md).

## Export resource groups to templates

To assist with creating ARM templates, you can export a template from existing resources. For more information, see [Use Azure PowerShell to export a template](../templates/export-template-powershell.md). 

## Manage access to resource groups

[Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) is the way that you manage access to resources in Azure. For more information, see [Add or remove Azure role assignments using Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md).

## Next steps

- To learn Azure Resource Manager, see [Azure Resource Manager overview](overview.md).
- To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](../templates/syntax.md).
