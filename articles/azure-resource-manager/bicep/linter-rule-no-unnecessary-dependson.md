---
title: Linter rule - no unnecessary dependsOn entries
description: Linter rule - no unnecessary dependsOn entries
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - no unnecessary dependsOn entries

This rule finds when an unnecessary dependsOn entry has been added to a resource or module declaration.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-unnecessary-dependson`

## Solution

To reduce confusion in your template, delete any dependsOn entries that aren't necessary.  Bicep automatically infers most resource dependencies as long as template expressions reference other resources via symbolic names rather than strings with hard-coded IDs or names.

The following example fails this test because the dependsOn entry `appServicePlan` is automatically inferred by Bicep implied by the expression `appServicePlan.id` (which references resource symbolic name `appServicePlan`) in the `serverFarmId` property's value.

```bicep
param location string = resourceGroup().location

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: 'name'
  location: location
  sku: {
    name: 'F1'
    capacity: 1
  }
}

resource webApplication 'Microsoft.Web/sites@2022-03-01' = {
  name: 'name'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
  }
  dependsOn: [
    appServicePlan
  ]
}
```

You can fix it by removing the unnecessary dependsOn entry.

```bicep
param location string = resourceGroup().location

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: 'name'
  location: location
  sku: {
    name: 'F1'
    capacity: 1
  }
}

resource webApplication 'Microsoft.Web/sites@2022-03-01' = {
  name: 'name'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
  }
}
```

Use **Quick Fix** to remove the unnecessary dependsOn entry.

:::image type="content" source="./media/linter-rule-no-unnecessary-dependson/linter-rule-no-unnecessary-dependson-quick-fix.png" alt-text="The screenshot of No unnecessary dependson linter rule with quick fix.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
