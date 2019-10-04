---
title: Manage Azure Resource Manager groups by using Azure CLI | Microsoft Docs
description: Use Azure CLI to manage your Azure Resource Manager groups.
services: azure-resource-manager
documentationcenter: ''
author: mumian

ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 02/11/2019
ms.author: jgao
---

# Manage Azure Resource Manager resource groups by using Azure CLI

Learn how to use Azure CLI with [Azure Resource Manager](resource-group-overview.md) to manage your Azure resource groups. For managing Azure resources, see [Manage Azure resources by using Azure CLI](./manage-resources-cli.md).

Other articles about managing resource groups:

- [Manage Azure resource groups by using the Azure portal](./manage-resources-portal.md)
- [Manage Azure resource groups by using Azure PowerShell](./manage-resources-powershell.md)

## What is a resource group

A resource group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group. You decide how you want to allocate resources to resource groups based on what makes the most sense for your organization. Generally, add resources that share the same lifecycle to the same resource group so you can easily deploy, update, and delete them as a group.

The resource group stores metadata about the resources. Therefore, when you specify a location for the resource group, you are specifying where that metadata is stored. For compliance reasons, you may need to ensure that your data is stored in a particular region.

The resource group stores metadata about the resources. When you specify a location for the resource group, you're specifying where that metadata is stored.

## Create resource groups

The following CLI script creates a resource group, and then shows the resource group.

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
echo "Enter the location (i.e. centralus):" &&
read location &&
az group create --name $resourceGroupName --location $location
```

## List resource groups

The following CLI script lists the resource groups under your subscription.

```azurecli-interactive
az group list
```

To get one resource group:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group show --name $resourceGroupName
```

## Delete resource groups

The following CLI script deletes a resource group:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName
```

For more information about how Azure Resource Manager orders the deletion of resources, see [Azure Resource Manager resource group deletion](./resource-group-delete.md).

## Deploy resources to an existing resource group

See [Deploy resources to an existing resource group](./manage-resources-cli.md#deploy-resources-to-an-existing-resource-group).

## Deploy a resource group and resources

You can create a resource group and deploy resources to the group by using a Resource Manager template. For more information, see [Create resource group and deploy resources](./deploy-to-subscription.md#create-resource-group-and-deploy-resources).

## Redeploy when deployment fails

This feature is also known as *Rollback on error*. For more information, see [Redeploy when deployment fails](./resource-group-template-deploy-cli.md#redeploy-when-deployment-fails).

## Move to another resource group or subscription

You can move the resources in the group to another resource group. For more information, see [Move resources](./manage-resources-cli.md#move-resources).

## Lock resource groups

Locking prevents other users in your organization from accidentally deleting or modifying critical resources, such as Azure subscription, resource group, or resource. 

The following script locks a resource group so the resource group can't be deleted.

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az lock create --name LockGroup --lock-type CanNotDelete --resource-group $resourceGroupName  
```

The following script gets all locks for a resource group:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az lock list --resource-group $resourceGroupName  
```

The following script deletes a lock:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
echo "Enter the lock name:" &&
read lockName &&
az lock delete --name $lockName --resource-group $resourceGroupName
```

For more information, see [Lock resources with Azure Resource Manager](resource-group-lock-resources.md).

## Tag resource groups

You can apply tags to resource groups and resources to logically organize your assets. For information, see [Using tags to organize your Azure resources](./resource-group-using-tags.md#azure-cli).

## Export resource groups to templates

After setting up your resource group successfully, you may want to view the Resource Manager template for the resource group. Exporting the template offers two benefits:

- Automate future deployments of the solution because the template contains all the complete infrastructure.
- Learn template syntax by looking at the JavaScript Object Notation (JSON) that represents your solution.

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group export --name $resourceGroupName  
```

The script displays the template on the console.  Copy the JSON, and save as a file.

For more information, see [Single and multi-resource export to template in Azure portal](./export-template-portal.md).

## Manage access to resource groups

[Role-based access control (RBAC)](../role-based-access-control/overview.md) is the way that you manage access to resources in Azure. For more information, see [Manage access using RBAC and Azure CLI](../role-based-access-control/role-assignments-cli.md).

## Next steps

- To learn Azure Resource Manager, see [Azure Resource Manager overview](./resource-group-overview.md).
- To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](./resource-group-authoring-templates.md).
- To learn how to develop templates, see the [step-by-step tutorials](/azure/azure-resource-manager/).
- To view the Azure Resource Manager template schemas, see [template reference](/azure/templates/).