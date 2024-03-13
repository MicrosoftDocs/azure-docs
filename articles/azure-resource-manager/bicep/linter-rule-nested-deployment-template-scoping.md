---
title: Linter rule - nested deployment template scoping
description: Linter rule - nested deployment template scoping
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/12/2023
---

# Linter rule - nested deployment template scoping

This linter rule triggers a diagnostic when a `Microsoft.Resources/deployments` resource using inner-scoped expression evaluation and contains any references to symbols defined in the parent template.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`nested-deployment-template-scoping`

## Solution

The following example fails this test because `fizz` is defined in the parent template's namespace.

```bicep
var fizz = 'buzz'

resource nested 'Microsoft.Resources/deployments@2020-10-01' = {
  name: 'name'
  properties: {
    mode: 'Incremental'
    expressionEvaluationOptions: {
      scope: 'inner'
    }
    template: {
      '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#'
      contentVersion: '1.0.0.0'
      resources: [
        {
          apiVersion: '2022-09-01'
          type: 'Microsoft.Resources/tags'
          name: 'default'
          properties: {
            tags: {
              tag1: fizz // <-- Error! `fizz` is defined in the parent template's namespace
            }
          }
        }
      ]
    }
  }
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
