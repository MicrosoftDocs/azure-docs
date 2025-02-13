---
title: Linter rule - use parent property
description: Linter rule - use parent property
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 02/12/2025
---

# Linter rule - use parent property

When defined outside of the parent resource, you use slashes to include the parent name in the name of the child resource. Defining the full resource name with the parent resource name isn't recommended. The `parent` property can be used to simplify the syntax. See [Full resource name outside parent](./child-resource-name-type.md#full-resource-name-outside-parent).

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`use-parent-property`

## Solution

The following example fails this test because of the name values for `service` and `share`:

```bicep
param location string = resourceGroup().location

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'examplestorage'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource service 'Microsoft.Storage/storageAccounts/fileServices@2023-05-01' = {
  name: 'examplestorage/default'
  dependsOn: [
    storage
  ]
}

resource share 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-05-01' = {
  name: 'examplestorage/default/exampleshare'
  dependsOn: [
    service
  ]
}
```

You can fix the problem by using the `parent` property:

```bicep
param location string = resourceGroup().location

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'examplestorage'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource service 'Microsoft.Storage/storageAccounts/fileServices@2023-05-01' = {
  parent: storage
  name: 'default'
}

resource share 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-05-01' = {
  parent: service
  name: 'exampleshare'
}
```

Use **Quick Fix** to simplify the syntax:

:::image type="content" source="./media/linter-rule-use-parent-property/bicep-linter-rule-use-parent-property-quick-fix.png" alt-text="A screenshot of using Quick Fix for the use-parent-property linter rule.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
