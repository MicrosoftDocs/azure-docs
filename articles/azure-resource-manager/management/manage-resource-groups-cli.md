---
title: Manage resource groups - Azure CLI
description: Use Azure CLI to manage your resource groups through Azure Resource Manager. Shows how to create, list, and delete resource groups.
author: mumian
ms.topic: conceptual
ms.date: 01/05/2021
ms.author: jgao
ms.custom: devx-track-azurecli
---

# Manage Azure Resource Manager resource groups by using Azure CLI

Learn how to use Azure CLI with [Azure Resource Manager](overview.md) to manage your Azure resource groups. For managing Azure resources, see [Manage Azure resources by using Azure CLI](manage-resources-cli.md).

Other articles about managing resource groups:

- [Manage Azure resource groups by using the Azure portal](manage-resources-portal.md)
- [Manage Azure resource groups by using Azure PowerShell](manage-resources-powershell.md)

## What is a resource group

A resource group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group. You decide how you want to allocate resources to resource groups based on what makes the most sense for your organization. Generally, add resources that share the same lifecycle to the same resource group so you can easily deploy, update, and delete them as a group.

The resource group stores metadata about the resources. Therefore, when you specify a location for the resource group, you are specifying where that metadata is stored. For compliance reasons, you may need to ensure that your data is stored in a particular region.

The resource group stores metadata about the resources. When you specify a location for the resource group, you're specifying where that metadata is stored.

## Create resource groups

The following CLI command creates a resource group.

```azurecli-interactive
az group create --name demoResourceGroup --location westus
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

For more information about how Azure Resource Manager orders the deletion of resources, see [Azure Resource Manager resource group deletion](delete-resource-group.md).

## Deploy resources to an existing resource group

See [Deploy resources to an existing resource group](manage-resources-cli.md#deploy-resources-to-an-existing-resource-group).

## Deploy a resource group and resources

You can create a resource group and deploy resources to the group by using a Resource Manager template. For more information, see [Create resource group and deploy resources](../templates/deploy-to-subscription.md#resource-groups).

## Redeploy when deployment fails

This feature is also known as *Rollback on error*. For more information, see [Redeploy when deployment fails](../templates/rollback-on-error.md).

## Move to another resource group or subscription

You can move the resources in the group to another resource group. For more information, see [Move resources](manage-resources-cli.md#move-resources).

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

For more information, see [Lock resources with Azure Resource Manager](lock-resources.md).

## Tag resource groups

You can apply tags to resource groups and resources to logically organize your assets. For information, see [Using tags to organize your Azure resources](tag-resources.md#azure-cli).

## Export resource groups to templates

After setting up your resource group successfully, you may want to view the Resource Manager template for the resource group. Exporting the template offers two benefits:

- Automate future deployments of the solution because the template contains all the complete infrastructure.
- Learn template syntax by looking at the JavaScript Object Notation (JSON) that represents your solution.

To export all resources in a resource group, use [az group export](/cli/azure/group#az_group_export) and provide the resource group name.

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group export --name $resourceGroupName
```

The script displays the template on the console. Copy the JSON, and save as a file.

Instead of exporting all resources in the resource group, you can select which resources to export.

To export one resource, pass that resource ID.

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
echo "Enter the storage account name:" &&
read storageAccountName &&
storageAccount=$(az resource show --resource-group $resourceGroupName --name $storageAccountName --resource-type Microsoft.Storage/storageAccounts --query id --output tsv) &&
az group export --resource-group $resourceGroupName --resource-ids $storageAccount
```

To export more than one resource, pass the space-separated resource IDs. To export all resources, do not specify this argument or supply "*".

```azurecli-interactive
az group export --resource-group <resource-group-name> --resource-ids $storageAccount1 $storageAccount2
```

When exporting the template, you can specify whether parameters are used in the template. By default, parameters for resource names are included but they don't have a default value. You must pass that parameter value during deployment.

```json
"parameters": {
  "serverfarms_demoHostPlan_name": {
    "type": "String"
  },
  "sites_webSite3bwt23ktvdo36_name": {
    "type": "String"
  }
}
```

In the resource, the parameter is used for the name.

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2016-09-01",
    "name": "[parameters('serverfarms_demoHostPlan_name')]",
    ...
  }
]
```

If you use the `--include-parameter-default-value` parameter when exporting the template, the template parameter includes a default value that is set to the current value. You can either use that default value or overwrite the default value by passing in a different value.

```json
"parameters": {
  "serverfarms_demoHostPlan_name": {
    "defaultValue": "demoHostPlan",
    "type": "String"
  },
  "sites_webSite3bwt23ktvdo36_name": {
    "defaultValue": "webSite3bwt23ktvdo36",
    "type": "String"
  }
}
```

If you use the `--skip-resource-name-params` parameter when exporting the template, parameters for resource names aren't included in the template. Instead, the resource name is set directly on the resource to its current value. You can't customize the name during deployment.

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2016-09-01",
    "name": "demoHostPlan",
    ...
  }
]
```

The export template feature doesn't support exporting Azure Data Factory resources. To learn about how you can export Data Factory resources, see [Copy or clone a data factory in Azure Data Factory](../../data-factory/copy-clone-data-factory.md).

To export resources created through classic deployment model, you must [migrate them to the Resource Manager deployment model](../../virtual-machines/migration-classic-resource-manager-overview.md).

For more information, see [Single and multi-resource export to template in Azure portal](../templates/export-template-portal.md).

## Manage access to resource groups

[Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) is the way that you manage access to resources in Azure. For more information, see [Add or remove Azure role assignments using Azure CLI](../../role-based-access-control/role-assignments-cli.md).

## Next steps

- To learn Azure Resource Manager, see [Azure Resource Manager overview](overview.md).
- To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](../templates/template-syntax.md).
- To learn how to develop templates, see the [step-by-step tutorials](../index.yml).
- To view the Azure Resource Manager template schemas, see [template reference](/azure/templates/).