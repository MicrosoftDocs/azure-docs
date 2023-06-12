---
title: Create a troubleshooting template
description: Describes how to create a template to troubleshoot Azure resource deployed with Azure Resource Manager templates (ARM templates) or Bicep files.
tags: top-support-issue
ms.custom: devx-track-bicep, devx-track-arm-template
ms.topic: troubleshooting
ms.date: 04/05/2023
---

# Create a troubleshooting template

In some cases, the best way to troubleshoot your template is to isolate and test specific parts of it. You can create a troubleshooting template that focuses on the resource that you believe causes the error.

For example, an error occurs when your deployment template references an existing resource. Rather than evaluate an entire deployment template, create a troubleshooting template that returns data about the resource. The output helps you find whether you're passing in the correct parameters, using template functions correctly, and getting the resource you expect.

## Deploy a troubleshooting template

The following ARM template and Bicep file get information from an existing storage account. You run the deployment with Azure PowerShell [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) or Azure CLI [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create). Specify the storage account's name and resource group. The output is an object with the storage account's property names and values.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageName": {
      "type": "string"
    },
    "storageResourceGroup": {
      "type": "string"
    }
  },
  "variables": {},
  "resources": [],
  "outputs": {
    "exampleOutput": {
      "value": "[reference(resourceId(parameters('storageResourceGroup'), 'Microsoft.Storage/storageAccounts', parameters('storageName')), '2022-05-01')]",
      "type": "object"
    }
  }
}
```

In Bicep, use the `existing` keyword and run the deployment from the resource group where the storage account exists. Use `scope` to access a resource in a different resource group. For more information, see [existing resources](../bicep/existing-resource.md).

```bicep
param storageName string

resource stg 'Microsoft.Storage/storageAccounts@2022-05-01' existing = {
  name: storageName
}

output exampleOutput object = stg.properties
```

## Alternate troubleshooting method

If you believe the deployment errors are caused by incorrect dependencies, you can run tests by breaking the template into simplified templates. First, create a template that deploys only a single resource (like a SQL Server). When you're sure the resource deployment is correct, add a resource that depends on it (like a SQL Database). When those two resources are correctly defined, add other dependent resources (like auditing policies). In between each test deployment, delete the resource group to make sure you're adequately testing the dependencies.

## Next steps

- [Common deployment errors](common-deployment-errors.md)
- [Find error codes](find-error-code.md)
- [Enable debug logging](enable-debug-logging.md)
