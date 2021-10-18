---
title: Linter rule - secure parameter default
description: Linter rule - secure parameter default
ms.topic: conceptual
ms.date: 10/14/2021
---

# Linter rule - secure parameter default

This rule finds hard-coded default values for secure parameters.

## Returned code

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

* For more information about the linter, see [Use Bicep linter](./linter.md).
* The current linter rules are:

  * [no-hardcoded-env-urls](./linter-rule-no-hardcoded-environment-urls.md)
  * [no-unused-params](./linter-rule-no-unused-parameters.md)
  * [no-unused-vars](./linter-rule-no-unused-variables.md)
  * [prefer-interpolation](./linter-rule-prefer-interpolation.md)
  * [secure-parameter-default](./linter-rule-secure-parameter-default.md)
  * [simplify-interpolation](./linter-rule-simplify-interpolation.md)
