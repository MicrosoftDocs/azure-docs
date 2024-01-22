---
title: Linter rule - secure secrets in parameters
description: Linter rule - secure secrets in parameters
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 02/10/2023
---

# Linter rule - secure secrets in parameters

This rule finds parameters whose names look like secrets but without the [secure decorator](./parameters.md#decorators), for example: a parameter name contains the following keywords:

- password
- pwd
- secret
- accountkey
- acctkey

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`secure-secrets-in-params`

## Solution

Use the [secure decorator](./parameters.md#decorators) for the parameters that contain secrets. The secure decorator marks the parameter as secure. The value for a secure parameter isn't saved to the deployment history and isn't logged.

The following example fails this test because the parameter name may contain secrets.

```bicep
param mypassword string
```

You can fix it by adding the secure decorator:

```bicep
@secure()
param mypassword string
```

Optionally, you can use **Quick Fix** to add the secure decorator:

:::image type="content" source="./media/linter-rule-secure-secrets-in-parameters/linter-rule-secure-secrets-in-parameters-quick-fix.png" alt-text="The screenshot of Secured default value linter rule quick fix.":::

## Silencing false positives

Sometimes this rule alerts on parameters that don't actually contain secrets. In these cases, you can disable the warning for this line by adding `#disable-next-line secure-secrets-in-params` before the line with the warning. For example:

```bicep
#disable-next-line secure-secrets-in-params   // Doesn't contain a secret
param mypassword string
```

It's good practice to add a comment explaining why the rule doesn't apply to this line.

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
