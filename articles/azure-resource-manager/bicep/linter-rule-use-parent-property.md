---
title: Linter rule - use parent property
description: Linter rule - use parent property
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - use parent property

When defined outside of the parent resource, you use slashes to include the parent name in the name of the child resource. Setting the full resource name with parent resource name is not recommended. The `parent` property can be used to simplify the syntax. See [Full resource name outside parent](./child-resource-name-type.md#full-resource-name-outside-parent).

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-parent-property`

## Solution

The following example fails this test because of the name values for `service` and `share`:

```bicep
param location string = resourceGroup().location

resource storage 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: 'examplestorage'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource service 'Microsoft.Storage/storageAccounts/fileServices@2021-02-01' = {
  name: 'examplestorage/default'
  dependsOn: [
    storage
  ]
}

resource share 'Microsoft.Storage/storageAccounts/fileServices/shares@2021-02-01' = {
  name: 'examplestorage/default/exampleshare'
  dependsOn: [
    service
  ]
}
```

You can fix the problem by using the `parent` property:

```bicep
param location string = resourceGroup().location

resource storage 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: 'examplestorage'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource service 'Microsoft.Storage/storageAccounts/fileServices@2021-02-01' = {
  parent: storage
  name: 'default'
}

resource share 'Microsoft.Storage/storageAccounts/fileServices/shares@2021-02-01' = {
  parent: service
  name: 'exampleshare'
}
```

You can fix the issue automatically by selecting **Quick Fix** as shown on the following screenshot:

:::image type="content" source="./media/linter-rule-use-parent-property/bicep-linter-rule-use-parent-property-quick-fix.png" alt-text="Screenshot of use parent property quick fix.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
