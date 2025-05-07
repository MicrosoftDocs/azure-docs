---
title: Linter rule - use protectedSettings for commandToExecute secrets
description: Linter rule - use protectedSettings for commandToExecute secrets
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 02/12/2025
---

# Linter rule - use protectedSettings for commandToExecute secrets

This rule finds possible exposure of secrets in the settings property of a custom script resource.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`protect-commandtoexecute-secrets`

## Solution

For custom script resources, the `commandToExecute` value should be placed under the `protectedSettings` property object instead of the `settings` property object if it includes secret data such as a password. For example, secret data could be found in secure parameters, [`list*`](./bicep-functions-resource.md#list) functions such as listKeys, or in custom scripts arguments.

Don't use secret data in the `settings` object because it uses clear text. For more information, see [Microsoft.Compute virtualMachines/extensions](/azure/templates/microsoft.compute/virtualmachines/extensions), [Custom Script Extension for Windows](/azure/virtual-machines/extensions/custom-script-windows), and [Use the Azure Custom Script Extension Version 2 with Linux virtual machines](/azure/virtual-machines/extensions/custom-script-linux).

The following example fails because `commandToExecute` is specified under `settings` and uses a secure parameter.

```bicep
param vmName string
param location string
param fileUris string
param storageAccountName string

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-04-01' existing = {
  name: storageAccountName
}

resource customScriptExtension 'Microsoft.HybridCompute/machines/extensions@2023-10-03-preview' = {
  name: '${vmName}/CustomScriptExtension'
  location: location
  properties: {
    publisher: 'Microsoft.Compute'
    type: 'CustomScriptExtension'
    autoUpgradeMinorVersion: true
    settings: {
      fileUris: split(fileUris, ' ')
      commandToExecute: 'mycommand ${storageAccount.listKeys().keys[0].value}'
    }
  }
}
```

You can fix it by moving the commandToExecute property to the `protectedSettings` object.

```bicep
param vmName string
param location string
param fileUris string
param storageAccountName string

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-04-01' existing = {
  name: storageAccountName
}

resource customScriptExtension 'Microsoft.HybridCompute/machines/extensions@2023-10-03-preview' = {
  name: '${vmName}/CustomScriptExtension'
  location: location
  properties: {
    publisher: 'Microsoft.Compute'
    type: 'CustomScriptExtension'
    autoUpgradeMinorVersion: true
    settings: {
      fileUris: split(fileUris, ' ')
    }
    protectedSettings: {
      commandToExecute: 'mycommand ${storageAccount.listKeys().keys[0].value}'
    }
  }
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
