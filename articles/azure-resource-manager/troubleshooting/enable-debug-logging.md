---
title: Enable debug logging
description: Describes how to enable debug logging to troubleshoot Azure resources deployed with Bicep files or Azure Resource Manager templates (ARM templates).
tags: top-support-issue
ms.topic: troubleshooting
ms.date: 09/14/2022
ms.custom: devx-track-azurepowershell
---

# Enable debug logging

To troubleshoot a deployment error, enable debug logging to get more information. Debug logging works for deployments using Bicep files or Azure Resource Manager templates (ARM templates). You can get data about a deployment's request and response to learn the cause of a problem.

> [!WARNING]
> Debug logging can expose secrets like passwords or `listKeys`. Only enable debug logging when you need to troubleshoot a deployment error.

## Set up debug logging

Use Azure PowerShell to enable debug logging and view the results with Azure PowerShell or Azure CLI.

# [PowerShell](#tab/azure-powershell)

For a resource group deployment, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) to set the `DeploymentDebugLogLevel` parameter to `All`, `ResponseContent`, or `RequestContent`.

When debug logging is enabled, a warning is displayed that secrets like passwords or `listKeys` can be logged and displayed when you get deployment operations with commands like `Get-AzResourceGroupDeploymentOperation`.


```azurepowershell
New-AzResourceGroupDeployment `
  -Name exampledeployment `
  -ResourceGroupName examplegroup `
  -TemplateFile main.bicep `
  -DeploymentDebugLogLevel All
```

The output shows the debug logging level.

```Output
DeploymentDebugLogLevel : RequestContent, ResponseContent
```

The `DeploymentDebugLogLevel` parameter is available for other deployment scopes: subscription, management group, and tenant.

- [New-AzDeployment](/powershell/module/az.resources/new-azdeployment)
- [New-AzManagementGroupDeployment](/powershell/module/az.resources/new-azmanagementgroupdeployment)
- [New-AzTenantDeployment](/powershell/module/az.resources/new-aztenantdeployment)

# [Azure CLI](#tab/azure-cli)

You can't enable debug logging with Azure CLI but you can get the debug log's data using the `request` and `response` properties.


---


## Get debug information

After debug logging is enabled, you can get more information from the deployment operations.

# [PowerShell](#tab/azure-powershell)

For a resource group deployment, use [Get-AzResourceGroupDeploymentOperation](/powershell/module/az.resources/get-azresourcegroupdeploymentoperation) to get deployment operations.

```azurepowershell
Get-AzResourceGroupDeploymentOperation `
  -DeploymentName exampledeployment `
  -ResourceGroupName examplegroup
```

You can specify a property, like `StatusMessage` or `StatusCode` to filter the output.

```azurepowershell
(Get-AzResourceGroupDeploymentOperation `
  -DeploymentName exampledeployment `
  -ResourceGroupName examplegroup).StatusMessage
```

For more information, see the documentation for deployment operation scopes: subscription, management group, and tenant.

- [Get-AzDeploymentOperation](/powershell/module/az.resources/get-azdeploymentoperation)
- [Get-AzManagementGroupDeploymentOperation](/powershell/module/az.resources/get-azmanagementgroupdeploymentoperation)
- [Get-AzTenantDeploymentOperation](/powershell/module/az.resources/get-aztenantdeploymentoperation)

# [Azure CLI](#tab/azure-cli)

For a resource group deployment, use [az deployment operation group list](/cli/azure/deployment/operation/group#az-deployment-operation-group-list) to get deployment operations.


```azurecli
az deployment operation group list \
  --resource-group examplegroup \
  --name exampledeployment
```

Use a query to get the `request` property's content.

```azurecli
az deployment operation group list \
  --name exampledeployment \
  --resource-group examplegroup \
  --query [].properties.request
```

Use a query to get the `response` property's content.

```azurecli
az deployment operation group list \
  --name exampledeployment \
  --resource-group examplegroup \
  --query [].properties.response
```

For more information, see the documentation for deployment operation scopes: subscription, management group, and tenant.

- [az deployment operation sub list](/cli/azure/deployment/operation/sub#az-deployment-operation-sub-list)
- [az deployment operation mg list](/cli/azure/deployment/operation/mg#az-deployment-operation-mg-list)
- [az deployment operation tenant list](/cli/azure/deployment/operation/tenant#az-deployment-operation-tenant-list)


---

## Remove debug deployment history

When you're finished debugging, you can remove deployment history to prevent anyone who has access from seeing sensitive information that might have been logged. If you used multiple deployment names during debugging, run the command for each deployment name.

# [PowerShell](#tab/azure-powershell)

To remove deployment history for a resource group deployment, use [Remove-AzResourceGroupDeployment](/powershell/module/az.resources/remove-azresourcegroupdeployment).

```azurepowershell
Remove-AzResourceGroupDeployment -ResourceGroupName examplegroup -Name exampledeployment
```

The command returns `True` when it's successful.

For more information about deployment history, see the documentation for the deployment scopes: subscription, management group, and tenant.

- [Remove-AzDeployment](/powershell/module/az.resources/remove-azdeployment)
- [Remove-AzManagementGroupDeployment](/powershell/module/az.resources/remove-azmanagementgroupdeployment)
- [Remove-AzTenantDeployment](/powershell/module/az.resources/remove-aztenantdeployment)


# [Azure CLI](#tab/azure-cli)

To remove deployment history for a resource group deployment, use [az deployment group delete](/cli/azure/deployment/group#az-deployment-group-delete).

```azurecli
az deployment group delete --resource-group examplegroup --name exampledeployment
```

For more information, see the documentation for deployment scopes: subscription, management group, and tenant.

- [az deployment sub delete](/cli/azure/deployment/sub#az-deployment-sub-delete)
- [az deployment mg delete](/cli/azure/deployment/mg#az-deployment-mg-delete)
- [az deployment tenant delete](/cli/azure/deployment/tenant#az-deployment-tenant-delete)


---

## Nested template

To log debug information for a [nested](../templates/linked-templates.md#nested-template) ARM template, use the [Microsoft.Resources/deployments](/azure/templates/microsoft.resources/deployments) `debugSetting` property.

```json
{
  "type": "Microsoft.Resources/deployments",
  "apiVersion": "2020-10-01",
  "name": "nestedTemplate",
  "properties": {
    "mode": "Incremental",
    "templateLink": {
      "uri": "{template-uri}",
      "contentVersion": "1.0.0.0"
    },
    "debugSetting": {
       "detailLevel": "requestContent, responseContent"
    }
  }
}
```

Bicep uses [modules](../bicep/modules.md) rather than nested templates.

## Next steps

- [Common deployment errors](common-deployment-errors.md)
- [Find error codes](find-error-code.md)
- [Create troubleshooting template](create-troubleshooting-template.md)
