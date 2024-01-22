---
title: Enable debug logging
description: Describes how to enable debug logging to troubleshoot Azure resources deployed with Bicep files or Azure Resource Manager templates (ARM templates).
tags: top-support-issue
ms.custom: devx-track-arm-template, devx-track-bicep, devx-track-azurecli
ms.topic: troubleshooting
ms.date: 04/05/2023
---

# Enable debug logging

To troubleshoot a deployment error, you can enable debug logging to get more information. Debug logging works for deployments with Bicep files or Azure Resource Manager templates (ARM templates). You can get data about a deployment's request and response to learn the cause of a problem.

> [!WARNING]
> Debug logging can expose secrets like passwords or `listKeys` operations. Only enable debug logging when you need to troubleshoot a deployment error. When you're finished debugging, you should [remove the debug deployment history](#remove-debug-deployment-history).

## Set up debug logging

Use Azure PowerShell to enable debug logging that populates the `request` and `response` properties with deployment information for troubleshooting. Debug logging can't be enabled using Azure CLI.

Debug logging is only enabled for the main ARM template or Bicep file. If you're using nested ARM templates or Bicep modules, see [Debug nested template](#debug-nested-template).

# [PowerShell](#tab/azure-powershell)

For a resource group deployment, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) and set the `DeploymentDebugLogLevel` parameter to `All`, `ResponseContent`, or `RequestContent`.

When debug logging is enabled, a warning is displayed that secrets like passwords or `listKeys` operations can be logged and displayed when you use commands like `Get-AzResourceGroupDeploymentOperation` to get information about deployment operations.

```azurepowershell
New-AzResourceGroupDeployment `
  -Name exampledeployment `
  -ResourceGroupName examplegroup `
  -TemplateFile main.bicep `
  -DeploymentDebugLogLevel All
```

The deployment's output shows the debug logging level.

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

After debug logging is enabled, you can get more information about the deployment operations. The Azure PowerShell cmdlets for deployment operations don't output the `request` and `response` properties. You need to use Azure CLI to get the information from those properties.

If you don't enable debug logging from the deployment command, you can still get deployment operations information. Use Azure PowerShell or Azure CLI to get the status code, status message, and provisioning state.

# [PowerShell](#tab/azure-powershell)

For a resource group deployment, use [Get-AzResourceGroupDeploymentOperation](/powershell/module/az.resources/get-azresourcegroupdeploymentoperation) to get deployment operations.

```azurepowershell
Get-AzResourceGroupDeploymentOperation `
  -DeploymentName exampledeployment `
  -ResourceGroupName examplegroup
```

You can specify a property, like `StatusCode`, `StatusMessage`,  or `ProvisioningState` to filter the output.

```azurepowershell
(Get-AzResourceGroupDeploymentOperation `
  -DeploymentName exampledeployment `
  -ResourceGroupName examplegroup).StatusCode
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

You can use a query to get the properties `statusCode`, `statusMessage`, or `provisioningState` for a deployment.

```azurecli
az deployment operation group list \
  --name exampledeployment \
  --resource-group examplegroup \
  --query [].properties.statusCode
```

For more information, see the documentation for deployment operation scopes: subscription, management group, and tenant.

- [az deployment operation sub list](/cli/azure/deployment/operation/sub#az-deployment-operation-sub-list)
- [az deployment operation mg list](/cli/azure/deployment/operation/mg#az-deployment-operation-mg-list)
- [az deployment operation tenant list](/cli/azure/deployment/operation/tenant#az-deployment-operation-tenant-list)

---

## Debug nested template

The main ARM template and nested templates have their own deployment name and deployment history. The main Bicep file and module also use a separate deployment name and deployment history.

### ARM template

To log debug information for a [nested](../templates/linked-templates.md#nested-template) ARM template, use the [Microsoft.Resources/deployments](/azure/templates/microsoft.resources/deployments) with the `debugSetting` property.

The following sample shows a nested template with the `debugSetting` to log the deployment's request and response.

```json
"resources": [
  {
    "type": "Microsoft.Resources/deployments",
    "apiVersion": "2021-04-01",
    "name": "nestedTemplateDebug",
    "properties": {
      "mode": "Incremental",
      "template": {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "resources": [
          {
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2022-05-01",
            "name": "[variables('storageAccountName')]",
            "location": "[parameters('location')]",
            "sku": {
              "name": "[parameters('storageAccountType')]"
            },
            "kind": "StorageV2"
          }
        ]
      },
      "debugSetting": {
        "detailLevel": "requestContent, responseContent"
      }
    }
  }
],
```

The main ARM template and nested templates have their own deployment name and deployment history. If you want the `request` and `response` properties to contain troubleshooting information, be aware of the following deployment scenarios:

- The `request` and `response` properties contain `null` values for the main template and nested template when `DeploymentDebugLogLevel` isn't enabled with deployment command.
- When the deployment command enables `DeploymentDebugLogLevel` the `request` and `response` properties contain information only for the main template. The nested template's properties contain `null` values.
- When a nested template uses the `debugSetting` and the deployment command doesn't include `DeploymentDebugLogLevel` only the nested template deployment has values for the `request` and `response` properties. The main template's properties contain `null` values.
- To get the `request` and `response` for the main template and nested template, specify `DeploymentDebugLogLevel` in the deployment command and use `debugSetting` in the nested template.

### Bicep file

The recommendation for Bicep files is to use [modules](../bicep/modules.md) rather than nested templates with `Microsoft.Resources/deployments`. The status message, status code, and provisioning state will include information for the main Bicep file and module that you can use to troubleshoot the deployment.

If you enable `DeploymentDebugLogLevel` from the deployment command, the `request` and `response` properties will contain information only for the main Bicep file's deployment.

## Remove debug deployment history

When you're finished debugging, you should remove the deployment history to prevent anyone who has access from seeing sensitive information that might have been logged. For each deployment name that you used while debugging, run the command to remove the deployment history.

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

The command returns to the command prompt when it's completed.

For more information, see the documentation for deployment scopes: subscription, management group, and tenant.

- [az deployment sub delete](/cli/azure/deployment/sub#az-deployment-sub-delete)
- [az deployment mg delete](/cli/azure/deployment/mg#az-deployment-mg-delete)
- [az deployment tenant delete](/cli/azure/deployment/tenant#az-deployment-tenant-delete)

---

## Next steps

- [Common deployment errors](common-deployment-errors.md)
- [Find error codes](find-error-code.md)
- [Create troubleshooting template](create-troubleshooting-template.md)
