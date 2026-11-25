---
title: Linter rule - secure params in parameters file
description: Linter rule - secure params in parameters file
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 07/23/2026
---

# Linter rule - secure params in parameters file

This rule finds parameter assignments in `.bicepparam` files where a non-secure parameter receives a value that references a `@secure()` parameter. Assigning a secure value to an insecure parameter exposes the secret in deployment history.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`secure-params-in-parameters-file`

## Solution

Don't assign the value of a `@secure()` parameter to a parameter that lacks the `@secure()` decorator. Doing so stores the secret value in deployment history in plain text.

To fix the violation, either:

- Mark the target parameter with `@secure()` in the referenced Bicep template.
- Avoid passing secure values to insecure parameters entirely.

The rule applies only to `.bicepparam` files and checks direct references, string-interpolation references, and transitive references through variables.

## Example

### Non-compliant

The following example fails this test. The insecure parameter `connectionString` is assigned the value of the secure parameter `dbPassword`, which could expose it in deployment history.

`main.bicep`

```bicep
@secure()
param dbPassword string

param connectionString string
```

`main.bicepparam`

```bicep
using 'main.bicep'

param dbPassword = 'MyP@ssw0rd'
param connectionString = dbPassword
```

### Compliant

You can resolve this issue by adding the `@secure()` decorator to the target parameter in your Bicep template:

`main.bicep`

```bicep
@secure()
param dbPassword string

@secure()
param connectionString string
```

`main.bicepparam`

```bicep
using 'main.bicep'

param dbPassword = 'MyP@ssw0rd'
param connectionString = dbPassword
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
