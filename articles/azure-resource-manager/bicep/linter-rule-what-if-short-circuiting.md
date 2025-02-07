---
title: Linter rule - what-if short circuiting
description: Linter rule - what-if short circuiting
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 09/19/2024
---

# Linter rule - what-if short circuiting

This rule detects when runtime values are passed as parameters to modules, which in turn use them to determine resource IDs (such as when the parameter is used to determine the name, subscriptionId, resourceGroup, condition, scope, or apiVersion of one or more resources within the module) , and flags potential what-if short-circuiting.

> [!NOTE]
> This rule is off by default, change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`what-if-short-circuiting`

## Solution

This rule checks for runtime values used to determine resource IDs within modules. It alerts you if your Bicep code could cause what-if short-circuiting. In the example below, **appServiceOutputs** and **appServiceTests** would be flagged for what-if short-circuiting because they pass runtime values as parameters to the module, which uses them when naming the resource:

**main.bicep**

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'storageAccountName'
  location: 'eastus'
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

module appServiceModule 'modules/appService.bicep' = {
  name: 'appService2'
  params: {
    appServiceName: 'test'
  }
}

module appServiceOutputs 'modules/appService.bicep' = {
  name: 'appService3'
  params: {
    appServiceName: appServiceModule.outputs.outputName
  }
}

module appServiceTest 'modules/appService.bicep' = {
  name:'test3'
  params: {
    appServiceName: storageAccount.properties.accessTier
  }
}
```

**modules/appService.bicep**

```bicep
param appServiceName string

resource appServiceApp 'Microsoft.Web/sites@2023-12-01' = {
  name: appServiceName
  location: 'eastus'
  properties: {
    httpsOnly: true
  }
}

output outputName string = 'outputName'
```

To avoid this issue, use deployment-time constants for values that are used in determining resource IDs.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
