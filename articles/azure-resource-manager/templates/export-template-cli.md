---
title: Export template in Azure CLI
description: Use Azure CLI to export an Azure Resource Manager template from resources in your subscription.
ms.topic: conceptual
ms.custom: devx-track-azurecli, devx-track-arm-template
ms.date: 05/22/2023
---

# Use Azure CLI to export a template

[!INCLUDE [Export template intro](../../../includes/resource-manager-export-template-intro.md)]

This article shows how to export templates through **Azure CLI**. For other options, see:

* [Export template with Azure portal](export-template-portal.md)
* [Export template with Azure PowerShell](export-template-powershell.md)
* [REST API export from resource group](/rest/api/resources/resourcegroups/exporttemplate) and [REST API export from deployment history](/rest/api/resources/deployments/export-template).

[!INCLUDE [Export template choose option](../../../includes/resource-manager-export-template-choose-option.md)]

[!INCLUDE [Export template limitations](../../../includes/resource-manager-export-template-limitations.md)]

## Export template from a resource group

After setting up your resource group successfully, you can export an Azure Resource Manager template for the resource group.

To export all resources in a resource group, use [az group export](/cli/azure/group#az-group-export) and provide the resource group name.

```azurecli-interactive
az group export --name demoGroup
```

The script displays the template on the console. To save to a file, use:

```azurecli-interactive
az group export --name demoGroup > exportedtemplate.json
```

Instead of exporting all resources in the resource group, you can select which resources to export.

To export one resource, pass that resource ID.

```azurecli-interactive
storageAccountID=$(az resource show --resource-group demoGroup --name demostg --resource-type Microsoft.Storage/storageAccounts --query id --output tsv)
az group export --resource-group demoGroup --resource-ids $storageAccountID
```

To export more than one resource, pass the space-separated resource IDs. To export all resources, don't specify this argument or supply "*".

```azurecli-interactive
az group export --resource-group <resource-group-name> --resource-ids $storageAccountID1 $storageAccountID2
```

When exporting the template, you can specify whether parameters are used in the template. By default, parameters for resource names are included but they don't have a default value.

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

If you use the `--skip-resource-name-params` parameter when exporting the template, parameters for resource names aren't included in the template. Instead, the resource name is set directly on the resource to its current value. You can't customize the name during deployment.

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2022-09-01",
    "name": "demoHostPlan",
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

## Save template from deployment history

You can save a template from a deployment in the deployment history. The template you get is exactly the one that was used for deployment.

To get a template from a resource group deployment, use the [az deployment group export](/cli/azure/deployment/group#az-deployment-group-export) command. You specify the name of the deployment to retrieve. For help with getting the name of a deployment, see [View deployment history with Azure Resource Manager](deployment-history.md).

```azurecli-interactive
az deployment group export --resource-group demoGroup --name demoDeployment
```

The template is displayed in the console. To save the file, use:

```azurecli-interactive
az deployment group export --resource-group demoGroup --name demoDeployment > demoDeployment.json
```

To get templates deployed at other levels, use:

* [az deployment sub export](/cli/azure/deployment/sub#az-deployment-sub-export) for deployments to subscriptions
* [az deployment mg export](/cli/azure/deployment/mg#az-deployment-mg-export) for deployments to management groups
* [az deployment tenant export](/cli/azure/deployment/tenant#az-deployment-tenant-export) for deployments to tenants


## Next steps

- Learn how to export templates with [Azure portal](export-template-portal.md), [Azure PowerShell](export-template-powershell.md), or [REST API](/rest/api/resources/resourcegroups/exporttemplate).
- To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](./syntax.md).
- To learn how to develop templates, see the [step-by-step tutorials](../index.yml).
