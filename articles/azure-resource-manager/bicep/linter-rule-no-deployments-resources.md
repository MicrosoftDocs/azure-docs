---
title: Linter rule - no deployments resources
description: Linter rule - no deployments resources
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - no deployments resources

This linter rule issues a warning when a template contains a `Microsoft.Resources/deployments` resource on the root level.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-deployments-resources`

## Solution

In ARM templates, you can reuse or modularize a template through nesting or linking templates using the `Microsoft.Resources/deployments` resource. For more information, see [Using linked and nested templates when deploying Azure resources](../templates/linked-templates.md) The following ARM template is a sample of a nested template:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "defaultValue": "[format('{0}{1}', 'store', uniqueString(resourceGroup().id))]"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2022-09-01",
      "name": "nestedTemplate1",
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "type": "Microsoft.Storage/storageAccounts",
              "apiVersion": "2023-01-01",
              "name": "[parameters('storageAccountName')]",
              "location": "[parameters('location')]",
              "sku": {
                "name": "Standard_LRS"
              },
              "kind": "StorageV2"
            }
          ]
        }
      }
    }
  ]
}
```

In Bicep, you can still use the `Microsoft.Resources/deployments` resource for nesting ARM templates or linking external ARM templates. But, it's not a great idea because it can lead to unsafe and tricky behaviors due to how it's evaluated multiple times. Also, there's hardly any validation and self completion from Visual Studio Code when you author the Bicep file, making it tough to work with. The following Bicep file fails this test because the template contains `Microsoft.Resources/deployments` resource on the root level.

```bicep
param storageAccountName string = 'store${uniqueString(resourceGroup().id)}'
param location string = resourceGroup().location

resource nestedTemplate1 'Microsoft.Resources/deployments@2023-07-01' = {
  name: 'nestedTemplate1'
  properties:{
    mode: 'Incremental'
    template: {
      '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#'
      contentVersion: '1.0.0.0'
      resources: [
        {
          type: 'Microsoft.Storage/storageAccounts'
          apiVersion: '2023-01-01'
          name: storageAccountName
          location: location
          sku: {
            name: 'Standard_LRS'
          }
          kind: 'StorageV2'
        }
      ]
    }    
  }
}
```

To fix the issue, you can use the Bicep CLI [decompile](./bicep-cli.md#decompile) command. For example, the preceding ARM template can be decomplied into the following Bicep files:

_main.bicep_:

```bicep
param storageAccountName string = 'store${uniqueString(resourceGroup().id)}'
param location string = resourceGroup().location

module nestedTemplate1 './nested_nestedTemplate1.bicep' = {
  name: 'nestedTemplate1'
  params: {
    storageAccountName: storageAccountName
    location: location
  }
}
```

_nested_nestedTemplate1.bicep_:

```bicep
param storageAccountName string
param location string

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}
```

Additionally, you can also refence ARM templates using the [module](./modules.md) statement.

_main.bicep_:

```bicep
param storageAccountName string = 'store${uniqueString(resourceGroup().id)}'
param location string = resourceGroup().location

module nestedTemplate1 './createStorage.json' = {
  name: 'nestedTemplate1'
  params: {
    storageAccountName: storageAccountName
    location: location
  }
}
```

_createStorage.json_:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "defaultValue": "[format('{0}{1}', 'store', uniqueString(resourceGroup().id))]"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2023-01-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2"
    }
  ]
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
