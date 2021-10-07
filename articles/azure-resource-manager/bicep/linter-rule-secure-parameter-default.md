---
title: Linter rule - secure parameter default
description: Linter rule - secure parameter default
ms.topic: conceptual
ms.date: 09/14/2021
---

# Linter rule - secure parameter default

The linter makes it easier to enforce coding standards by providing guidance during development. The current set of linter rules is minimal and taken from [arm-ttk test cases](../templates/template-test-cases.md):

- [no-hardcoded-env-urls](./linter-rule-no-hardcoded-environment-urls.md)
- [no-unused-params](./linter-rule-no-unused-parameters.md)
- [no-unused-vars](./linter-rule-no-unused-variables.md)
- [prefer-interpolation](./linter-rule-prefer-interpolation.md)
- [secure-parameter-default](./linter-rule-secure-parameter-default.md)
- [simplify-interpolation](./linter-rule-simplify-interpolation.md)

For more information, see [Use Bicep linter](./linter.md).

## Code

`secure-parameter-default`

## Description

Don't provide a hard-coded default value for a [secure parameter](./parameters.md#secure-parameters) in your template, unless it is empty or an expression containing a call to [newGuid()](./bicep-functions-string.md#newguid).

You use the @secure() decorator on parameters that contain sensitive values, like passwords. When a parameter uses a secure decorator, the value of the parameter isn't logged or stored in the deployment history. This action prevents a malicious user from discovering the sensitive value.

However, when you provide a default value for a secured parameter, that value is discoverable by anyone who can access the template or the deployment history.

## Examples

The following example fails this test:

```bicep
@secure()
param adminPassword string = 'HardcodedPassword'
```

The following examples pass this test:

```bicep
@secure()
param adminPassword string
```

```bicep
@secure()
param adminPassword string = ''
```

```bicep
@secure()
param adminPassword string = newGuid()
```

## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
