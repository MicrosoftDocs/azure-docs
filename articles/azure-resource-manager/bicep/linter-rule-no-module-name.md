---
title: Linter rule - no module name
description: Linter rule - no module name
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 06/02/2026
---

# Linter rule - no module name

Bicep introduced a feature that you can omit the `name` property in your module definition. When you omit the `name` property, the Bicep compiler automatically generates a deterministic, unique deployment name for the module based on the symbolic name and other context. The `no-module-name` linter rule enforces this cleaner coding practice by flagging any module that still contains an explicit name property. For more information about module name, see [Define module](./modules.md#define-modules).

> [!NOTE]
> This rule is off by default. Change the level in [bicepconfig.json](./bicep-config-linter.md) to enable it.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-module-name`

## Solution

The following example fails this test because the resource's `name` property is explicitly defined.

```bicep
module storage 'storage.bicep' = {
  name: 'storageDeployment'   // Explicit name is unnecessary
  params: {
    location: resourceGroup().location
  }
}
```

You can fix it by removing the `name` property:

```bicep
module storage 'storage.bicep' = {
  params: {
    location: resourceGroup().location
  }
}
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
