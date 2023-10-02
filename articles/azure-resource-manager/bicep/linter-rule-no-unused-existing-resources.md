---
title: Linter rule - no unused existing resources
description: Linter rule - no unused existing resources
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 02/10/2023
---

# Linter rule - no unused existing resources

This rule finds [existing resources](./existing-resource.md) that aren't referenced anywhere in the Bicep file.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-unused-existing-resources`

## Solution

To reduce confusion in your template, delete any [existing resources](./existing-resource.md) that are defined but not used. This test finds any existing resource that isn't used anywhere in the template.

The following example fails this test because the existing resource **stg** is declared but never used:

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: 'examplestorage'
}
```

Use **Quick Fix** to remove the unused existing resource.

:::image type="content" source="./media/linter-rule-no-unused-existing-resources/linter-rule-no-unused-existing-resources-quick-fix.png" alt-text="The screenshot of No unused existing resources linter rule quick fix.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
