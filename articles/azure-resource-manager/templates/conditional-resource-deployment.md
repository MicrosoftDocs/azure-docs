---
title: Conditional deployment with templates
description: Describes how to conditionally deploy a resource in an Azure Resource Manager template (ARM template).
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 06/22/2023
---

# Conditional deployment in ARM templates

Sometimes you need to optionally deploy a resource in an Azure Resource Manager template (ARM template). Use the `condition` element to specify whether the resource is deployed. The value for the condition resolves to true or false. When the value is true, the resource is created. When the value is false, the resource isn't created. The value can only be applied to the whole resource.

> [!NOTE]
> Conditional deployment doesn't cascade to [child resources](child-resource-name-type.md). If you want to conditionally deploy a resource and its child resources, you must apply the same condition to each resource type.

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [conditional deployments](../bicep/conditional-resource-deployment.md).

## Deploy condition

You can pass in a parameter value that indicates whether a resource is deployed. The following example conditionally deploys a DNS zone.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "deployZone": {
      "type": "bool"
    }
  },
  "functions": [],
  "resources": [
    {
      "condition": "[parameters('deployZone')]",
      "type": "Microsoft.Network/dnsZones",
      "apiVersion": "2018-05-01",
      "name": "myZone",
      "location": "global"
    }
  ]
}
```

For a more complex example, see [Azure SQL logical server](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.sql/sql-logical-server).

## New or existing resource

You can use conditional deployment to create a new resource or use an existing one. The following example shows how to either deploy a new storage account or use an existing storage account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "newOrExisting": {
      "type": "string",
      "defaultValue": "new",
      "allowedValues": [
        "new",
        "existing"
      ]
    }
  },
  "resources": [
    {
      "condition": "[equals(parameters('newOrExisting'), 'new')]",
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-09-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2"
    },
    {
      "condition": "[equals(parameters('newOrExisting'), 'existing')]",
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-09-01",
      "name": "[parameters('storageAccountName')]"
    }
  ],
  "outputs": {
    "storageAccountId": {
      "type": "string",
      "value": "[if(equals(parameters('newOrExisting'), 'new'), resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')), resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')))]"
    }
  }
}
```

When the parameter `newOrExisting` is set to **new**, the condition evaluates to true. The storage account is deployed. Otherwise the existing storage account is used.

For a complete example template that uses the `condition` element, see [VM with a new or existing Virtual Network, Storage, and Public IP](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-new-or-existing-conditions).

## Runtime functions

If you use a [reference](template-functions-resource.md#reference) or [list](template-functions-resource.md#list) function with a resource that is conditionally deployed, the function is evaluated even if the resource isn't deployed. You get an error if the function refers to a resource that doesn't exist.

Use the [if](template-functions-logical.md#if) function to make sure the function is only evaluated for conditions when the resource is deployed. See the [if function](template-functions-logical.md#if) for a sample template that uses `if` and `reference` with a conditionally deployed resource.

You set a [resource as dependent](./resource-dependency.md) on a conditional resource exactly as you would any other resource. When a conditional resource isn't deployed, Azure Resource Manager automatically removes it from the required dependencies.

## Complete mode

If you deploy a template with [complete mode](deployment-modes.md) and a resource isn't deployed because `condition` evaluates to false, the result depends on which REST API version you use to deploy the template. If you use a version earlier than 2019-05-10, the resource **isn't deleted**. With 2019-05-10 or later, the resource **is deleted**. The latest versions of Azure PowerShell and Azure CLI delete the resource when condition is false.

## Next steps

* For a Learn module that covers conditional deployment, see [Manage complex cloud deployments by using advanced ARM template features](/training/modules/manage-deployments-advanced-arm-template-features/).
* For recommendations about creating templates, see [ARM template best practices](./best-practices.md).
* To create multiple instances of a resource, see [Resource iteration in ARM templates](copy-resources.md).
