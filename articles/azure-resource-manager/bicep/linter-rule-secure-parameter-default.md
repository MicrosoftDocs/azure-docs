---
title: Linter rule - secure parameter default
description: Linter rule - secure parameter default
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule - secure parameter default

This rule finds hard-coded default values for secure parameters.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`secure-parameter-default`

## Solution

Don't provide a hard-coded default value for a [secure parameter](./parameters.md#secure-parameters) in your Bicep file, unless it's an empty string or an expression calling the [newGuid()](./bicep-functions-string.md#newguid) function.

You use the `@secure()` decorator on parameters that contain sensitive values, like passwords. When a parameter uses a secure decorator, the value of the parameter isn't logged or stored in the deployment history. This action prevents a malicious user from discovering the sensitive value.

However, when you provide a default value for a secured parameter, that value is discoverable by anyone who can access the template or the deployment history.

The following example fails this test because the parameter has a default value that is hard-coded.

```bicep
@secure()
param adminPassword string = 'HardcodedPassword'
```

You can fix it by removing the default value.

```bicep
@secure()
param adminPassword string
```

Optionally, you can use **Quick Fix** to remove the insecured default value:

:::image type="content" source="./media/linter-rule-secure-parameter-default/linter-rule-secure-parameter-default-quick-fix.png" alt-text="The screenshot of Secured default value linter rule quick fix.":::

Or, by providing an empty string for the default value.

```bicep
@secure()
param adminPassword string = ''
```

Or, by using `newGuid()` to generate the default value.

```bicep
@secure()
param adminPassword string = newGuid()
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
