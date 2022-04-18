---
title: Enable debug logging
description: Describes how to enable debug logging to troubleshoot Azure resources deployed with  Azure Resource Manager templates (ARM templates) or Bicep files.
tags: top-support-issue
ms.topic: troubleshooting
ms.date: 11/05/2021
ms.custom: devx-track-azurepowershell
---

# Enable debug logging

To troubleshoot a deployment error, it helps to gather more information. Use Azure PowerShell to enable debug logging. You can get data about a deployment's request and response to learn the cause of the problem. Debug logging works with Azure Resource Manager templates (ARM templates) and Bicep files.

## Get debug information

# [PowerShell](#tab/azure-powershell)

Use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) to set the `DeploymentDebugLogLevel` parameter to `All`, `ResponseContent`, or `RequestContent`. When debug logging is enabled, a warning is displayed that secrets like passwords or `listKeys` can be logged by commands like [Get-AzResourceGroupDeploymentOperation](/powershell/module/az.resources/get-azresourcegroupdeploymentoperation).

```azurepowershell
New-AzResourceGroupDeployment `
  -Name exampledeployment `
  -ResourceGroupName examplegroup `
  -TemplateFile azuredeploy.json `
  -DeploymentDebugLogLevel All
```

The output shows the debug logging:

```Output
DeploymentDebugLogLevel : RequestContent, ResponseContent
```

To view all the properties for deployment operations:

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

# [Azure CLI](#tab/azure-cli)

You can't enable debug logging with Azure CLI but you can retrieve debug logging data.

Get the deployment operations with the [az deployment operation group list](/cli/azure/deployment/operation/group#az-deployment-operation-group-list) command:

```azurecli
az deployment operation group list \
  --resource-group examplegroup \
  --name exampledeployment
```

Get the request content with the following command:

```azurecli
az deployment operation group list \
  --name exampledeployment \
  --resource-group examplegroup \
  --query [].properties.request
```

Get the response content with the following command:

```azurecli
az deployment operation group list \
  --name exampledeployment \
  --resource-group examplegroup \
  --query [].properties.response
```

---

## Nested template

To log debug information for a [nested](../templates/linked-templates.md#nested-template) ARM template, use the [Microsoft.Resources/deployments](/azure/templates/microsoft.resources/deployments) `debugSetting` element.

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

Bicep uses [modules](../bicep/modules.md) rather than `Microsoft.Resources/deployments`. With modules, you can reuse your code to deploy a Bicep file from another Bicep file.

## Next steps

- [Common deployment errors](common-deployment-errors.md)
- [Find error codes](find-error-code.md)
- [Create troubleshooting template](create-troubleshooting-template.md)
