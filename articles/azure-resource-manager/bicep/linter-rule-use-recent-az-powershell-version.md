---
title: Linter rule - use recent AZ PowerShell version for deployment scripts
description: Linter rule - use recent AZ PowerShell version for deployment scripts
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 08/05/2025
---

# Linter rule - use recent AZ PowerShell version for deployment scripts

This rule checks for AZ PowerShell versions below 11.0. It is recommended to use AZ PowerShell version 14.0.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-recent-az-powershell-version`

## Solution

The following example doesn't pass this test because the `azPowerShellVersion` value is `10.4`:

```bicep
param location string = resourceGroup().location
 
resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'inlinePS'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '10.4'
    scriptContent: '''
      $output = 'Hello world!'
      $DeploymentScriptOutputs = @{}
      $DeploymentScriptOutputs['text'] = $output
    '''
    retentionInterval: 'PT1H'
  }
}
 
output result string = deploymentScript.properties.outputs.text
```

Fix the problem by using version 11.0 or later:

```bicep
param location string = resourceGroup().location
 
resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'inlinePS'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '14.0'
    scriptContent: '''
      $output = 'Hello world!'
      $DeploymentScriptOutputs = @{}
      $DeploymentScriptOutputs['text'] = $output
    '''
    retentionInterval: 'PT1H'
  }
}
 
output result string = deploymentScript.properties.outputs.text
```

## Next steps

Learn more in [Use Bicep linter](./linter.md).
