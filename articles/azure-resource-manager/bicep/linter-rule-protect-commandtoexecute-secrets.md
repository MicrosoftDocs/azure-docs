---
title: Linter rule - use protectedSettings for commandToExecute secrets
description: Linter rule - use protectedSettings for commandToExecute secrets
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - use protectedSettings for commandToExecute secrets

This rule finds possible exposure of secrets in the settings property of a custom script resource.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`protect-commandtoexecute-secrets`

## Solution

For custom script resources, the `commandToExecute` value should be placed under the `protectedSettings` property object instead of the `settings` property object if it includes secret data such as a password. For example, secret data could be found in secure parameters, [`list*`](./bicep-functions-resource.md#list) functions such as listKeys, or in custom scripts arguments.

Don't use secret data in the `settings` object because it uses clear text. For more information, see [Microsoft.Compute virtualMachines/extensions](/azure/templates/microsoft.compute/virtualmachines/extensions), [Custom Script Extension for Windows](../../virtual-machines/extensions/custom-script-windows.md), and [Use the Azure Custom Script Extension Version 2 with Linux virtual machines](../../virtual-machines/extensions/custom-script-linux.md).

The following example fails because `commandToExecute` is specified under `settings` and uses a secure parameter.

```bicep
param vmName string
param location string
param fileUris string
param storageAccountName string

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: storageAccountName
}

resource customScriptExtension 'Microsoft.HybridCompute/machines/extensions@2023-03-15-preview' = {
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

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: storageAccountName
}

resource customScriptExtension 'Microsoft.HybridCompute/machines/extensions@2023-03-15-preview' = {
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
