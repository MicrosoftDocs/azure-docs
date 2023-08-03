---
title: Linter rule - secure params in nested deploy
description: Linter rule - secure params in nested deploy
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 09/22/2022
---

# Linter rule - secure params in nested deploy

Outer-scoped nested deployment resources shouldn't use for secure parameters or list* functions. You could expose the secure values in the deployment history.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`secure-params-in-nested-deploy`

## Solution

Either set the [deployment's properties.expressionEvaluationOptions.scope](/azure/templates/microsoft.resources/deployments?pivots=deployment-language-bicep) to `inner` or use a Bicep module instead.

The following example fails this test because a secure parameter is referenced in an outer-scoped nested deployment resource.

```bicep
@secure()
param secureValue string

resource nested 'Microsoft.Resources/deployments@2021-04-01' = {
  name: 'nested'
  properties: {
    mode: 'Incremental'
    template: {
      '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#'
      contentVersion: '1.0.0.0'
      variables: {}
      resources: [
        {
          name: 'outerImplicit'
          type: 'Microsoft.Network/networkSecurityGroups'
          apiVersion: '2019-11-01'
          location: '[resourceGroup().location]'
          properties: {
            securityRules: [
              {
                name: 'outerImplicit'
                properties: {
                  description: format('{0}', secureValue)
                  protocol: 'Tcp'
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

You can fix it by setting the deployment's properties.expressionEvaluationOptions.scope to 'inner':

```bicep
@secure()
param secureValue string

resource nested 'Microsoft.Resources/deployments@2021-04-01' = {
  name: 'nested'
  properties: {
    mode: 'Incremental'
    expressionEvaluationOptions: {
      scope: 'Inner'      // Set to inner scope
    }
    template: {
      '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#'
      contentVersion: '1.0.0.0'
      variables: {}
      resources: [
        {
          name: 'outerImplicit'
          type: 'Microsoft.Network/networkSecurityGroups'
          apiVersion: '2019-11-01'
          location: '[resourceGroup().location]'
          properties: {
            securityRules: [
              {
                name: 'outerImplicit'
                properties: {
                  description: format('{0}', secureValue)
                  protocol: 'Tcp'
                }
              }
            ]
          }
        }
      ]
    }
  }
}

```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
