---
title: Export template in Azure PowerShell
description: Use Azure PowerShell to export an Azure Resource Manager template from resources in your subscription.
ms.topic: conceptual
ms.custom: devx-track-azurepowershell, devx-track-arm-template
ms.date: 05/22/2023
---
# Use Azure PowerShell to export a template

[!INCLUDE [Export template intro](../../../includes/resource-manager-export-template-intro.md)]

This article shows how to export templates through **Azure PowerShell**. For other options, see:

* [Export template with Azure CLI](export-template-cli.md)
* [Export template with Azure portal](export-template-portal.md)
* [REST API export from resource group](/rest/api/resources/resourcegroups/exporttemplate) and [REST API export from deployment history](/rest/api/resources/deployments/export-template).

[!INCLUDE [Export template choose option](../../../includes/resource-manager-export-template-choose-option.md)]

[!INCLUDE [Export template limitations](../../../includes/resource-manager-export-template-limitations.md)]

## Export template from a resource group

After setting up your resource group, you can export an Azure Resource Manager template for the resource group.

To export all resources in a resource group, use the [Export-AzResourceGroup](/powershell/module/az.resources/Export-AzResourceGroup) cmdlet and provide the resource group name.

```azurepowershell-interactive
Export-AzResourceGroup -ResourceGroupName demoGroup
```

It saves the template as a local file.

Instead of exporting all resources in the resource group, you can select which resources to export.

To export one resource, pass that resource ID.

```azurepowershell-interactive
$resource = Get-AzResource `
  -ResourceGroupName <resource-group-name> `
  -ResourceName <resource-name> `
  -ResourceType <resource-type>
Export-AzResourceGroup `
  -ResourceGroupName <resource-group-name> `
  -Resource $resource.ResourceId
```

To export more than one resource, pass the resource IDs in an array.

```azurepowershell-interactive
Export-AzResourceGroup `
  -ResourceGroupName <resource-group-name> `
  -Resource @($resource1.ResourceId, $resource2.ResourceId)
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

If you use the `-SkipResourceNameParameterization` parameter when exporting the template, parameters for resource names aren't included in the template. Instead, the resource name is set directly on the resource to its current value. You can't customize the name during deployment.

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

If you use the `-IncludeParameterDefaultValue` parameter when exporting the template, the template parameter includes a default value that is set to the current value. You can either use that default value or overwrite the default value by passing in a different value.

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

To get a template from a resource group deployment, use the [Save-AzResourceGroupDeploymentTemplate](/powershell/module/az.resources/save-azresourcegroupdeploymenttemplate) cmdlet. You specify the name of the deployment to retrieve. For help with getting the name of a deployment, see [View deployment history with Azure Resource Manager](deployment-history.md).

```azurepowershell-interactive
Save-AzResourceGroupDeploymentTemplate -ResourceGroupName demoGroup -DeploymentName demoDeployment
```

The template is saved as a local file with the name of the deployment.

To get templates deployed at other levels, use:

* [Save-AzDeploymentTemplate](/powershell/module/az.resources/save-azdeploymenttemplate) for deployments to subscriptions
* [Save-AzManagementGroupDeploymentTemplate](/powershell/module/az.resources/save-azmanagementgroupdeploymenttemplate) for deployments to management groups
* [Save-AzTenantDeploymentTemplate](/powershell/module/az.resources/save-aztenantdeploymenttemplate) for deployments to tenants

## Next steps

- Learn how to export templates with [Azure CLI](export-template-cli.md), [Azure portal](export-template-portal.md), or [REST API](/rest/api/resources/resourcegroups/exporttemplate).
- To learn the Resource Manager template syntax, see [Understand the structure and syntax of Azure Resource Manager templates](./syntax.md).
- To learn how to develop templates, see the [step-by-step tutorials](../index.yml).
