---
title: 'Linter rule: Secure secrets in parameters'
description: This article describes the linter rule, secure secrets in parameters.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 03/20/2024
---

# Linter rule: Secure secrets in parameters

This rule finds parameters whose names look like secrets but without the [secure decorator](./parameters.md#use-decorators). For example, a parameter name contains the following keywords:

- `password`
- `pwd`
- `secret`
- `accountkey`
- `acctkey`

## Linter rule code

To customize rule settings, use the following value in the [Bicep configuration file](bicep-config-linter.md):

`secure-secrets-in-params`

## Solution

Use the [secure decorator](./parameters.md#use-decorators) for the parameters that contain secrets. The secure decorator marks the parameter as secure. The value for a secure parameter isn't saved to the deployment history and isn't logged.

The following example fails this test because the parameter name might contain secrets.

```bicep
param mypassword string
```

You can fix it by adding the secure decorator:

```bicep
@secure()
param mypassword string
```

Optionally, you can use **Quick Fix** to add the secure decorator.

:::image type="content" source="./media/linter-rule-secure-secrets-in-parameters/linter-rule-secure-secrets-in-parameters-quick-fix.png" alt-text="Screenshot that shows the secured default value for the linter rule Quick Fix.":::

## Silence false positives

Sometimes this rule alerts on parameters that don't contain secrets. In these cases, disable the warning for this line by adding `#disable-next-line secure-secrets-in-params` before the line with the warning. For example:

```bicep
#disable-next-line secure-secrets-in-params   // Doesn't contain a secret
param mypassword string
```

It's good practice to add a comment that explains why the rule doesn't apply to this line.

## Related content

For more information about the linter, see [Use Bicep linter](./linter.md).
