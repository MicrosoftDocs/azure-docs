---
title: Manage Azure Resource Manager groups by using Azure PowerShell | Microsoft Docs
description: Use Azure PowerShell to manage your Azure Resource Manager groups.
services: azure-resource-manager
documentationcenter: ''
author: mumian

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/08/2019
ms.author: jgao

---
# Manage Azure Resource Manager resource groups by using Azure Powershell

Learn how to use Azure PowerShell with [Azure Resource Manager](resource-group-overview.md) to manage your Azure resource groups.

[!INCLUDE [Handle personal data](../../includes/gdpr-intro-sentence.md)]

For managing Azure resources, see [Manage Azure resources by using Azure PowerShell](./manage-resources-powershell.md).

## What is a resource group

A resource group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group. You decide how you want to allocate resources to resource groups based on what makes the most sense for your organization. Generally, add resources that share the same lifecycle to the same resource group so you can easily deploy, update, and delete them as a group.

The resource group stores metadata about the resources. Therefore, when you specify a location for the resource group, you are specifying where that metadata is stored. For compliance reasons, you may need to ensure that your data is stored in a particular region.

## Create resource groups

The following PowerShell script creates a resource group, and then shows the resource group.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location $location

Get-AzResourceGroup -Name $resourceGroupName
```

## Set resource groups

See [Tag resource groups](#tag-resource-groups).

## List resource groups

The following PowerShell script lists the resource groups under your subscription.

```azurepowershell-interactive
Get-AzResourceGroup
```

To get one resource group:

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"

Get-AzResourceGroup -Name $resourceGroupName
```

## Delete resource groups

The following PowerShell script deletes a resource group:

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"

Remove-AzResourceGroup -Name $resourceGroupName
```

## Deploy resources to an existing resource group

See [Deploy resources to an existing resource group](./manage-resources-powershell.md#deploy-resources-to-an-existing-resource-group).

## Deploy a resource group and resources

You can create a resource group and deploy resources to the group. For more information, see [Create resource group and deploy resources](./deploy-to-subscription.md#create-resource-group-and-deploy-resources).

## Move to another resource group

You can move the resources in the group to another resource group. For more information, see [Move resources to new resource group or subscription](./resource-group-move-resources.md#move-resources).

## Move to another subscription

You can move the resources in the resource group to another subscription. For more information, see [Move resources to new resource group or subscription](resource-group-move-resources.md).

## Lock resource groups

Locking prevents other users in your organization from accidentally deleting or modifying critical resources, such as Azure subscription, resource group, or resource. 

The following script locks a resource group so the resource group can't be deleted.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"

New-AzResourceLock -LockName LockGroup -LockLevel CanNotDelete -ResourceGroupName $resourceGroupName 
```

The following script gets all locks for a resource group:

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"

Get-AzResourceLock -ResourceGroupName $resourceGroupName 
```

For more information, see [Lock resources with Azure Resource Manager](resource-group-lock-resources.md).

## Tag resource groups

You can apply tags to resource groups and resources to logically organize your assets. For information, see [Using tags to organize your Azure resources](./resource-group-using-tags.md#powershell).

## Export resource groups to templates

After setting up your resource group, you may want to view the Resource Manager template for the resource group. Exporting the template offers two benefits:

1. You can easily automate future deployments of the solution because the template contains all the complete infrastructure.
2. You can become familiar with template syntax by looking at the JavaScript Object Notation (JSON) that represents your solution.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"

Export-AzResourceGroup -ResourceGroupName $resourceGroupName
```

## Next steps

* To view activity logs, see [Audit operations with Resource Manager](resource-group-audit.md).
* To view details about a deployment, see [View deployment operations](resource-manager-deployment-operations.md).
* To deploy resources through the portal, see [Deploy resources with Resource Manager templates and Azure portal](resource-group-template-deploy-portal.md).
* To manage access to resources, see [Use role assignments to manage access to your Azure subscription resources](../role-based-access-control/role-assignments-portal.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](/azure/architecture/cloud-adoption-guide/subscription-governance).