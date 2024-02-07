---
title: Linter rule - no deployments resources
description: Linter rule - no deployments resources
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/12/2023
---

# Linter rule - no deployments resources

This linter rule issues a warning when a template contains a `Microsoft.Resources/deployments` resource on the root level.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-deployments-resources`

## Solution

The following example fails this test because the template contains a `Microsoft.Resources/deployments` resource on the root level.

```bicep
param name string
param specId string
resource foo 'Microsoft.Resources/deployments@2023-07-01' = {
  name: name
  properties: {
    mode: 'Incremental'
    templateLink: {
      uri: specId
    }
    parameters: {}
  }
}
```

It should be declared as a [Bicep module](./modules.md).

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
