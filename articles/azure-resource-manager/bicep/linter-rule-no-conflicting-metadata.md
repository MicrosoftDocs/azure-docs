---
title: Linter rule - no conflicting metadata
description: Linter rule - no conflicting metadata
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/05/2023
---

# Linter rule - no conflicting metadata

This linter rule issues a warning when a template author provides a `@metadata()` decorator with a property that conflicts with another decorator.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-conflicting-metadata`

## Solution

The following example fails this test because the `description` property of the `@metadata()` decorator conflicts with the `@description()` decorator.

```bicep
@metadata({
  description: 'I conflict with the @description() decorator and will be overwritten.' // <-- will trigger a no-conflicting-metadata diagnostic
})
@description('I am more specific than the @metadata() decorator and will overwrite any 'description' property specified within it.')
param foo string
```

The `@description()` decorator always takes precedence over anything in the `@metadata()` decorator. So, the linter rule notifies that the `description` property within the @metadata() value is redundant and will be replaced.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
