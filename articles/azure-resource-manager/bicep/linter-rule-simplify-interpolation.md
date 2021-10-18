---
title: Linter rule - simplify interpolation
description: Linter rule - simplify interpolation
ms.topic: conceptual
ms.date: 10/14/2021
---

# Linter rule - simplify interpolation

This rule finds syntax that uses string interpolation when it isn't needed.

## Returned code

`simplify-interpolation`

## Solution

Remove any uses of string interpolation that isn't part of an expression to combine values.

The following example fails this test because it just references a parameter.

```bicep
param AutomationAccountName string

resource AutomationAccount 'Microsoft.Automation/automationAccounts@2020-01-13-preview' = {
  name: '${AutomationAccountName}'
  ...
}
```

You can fix it by removing the string interpolation syntax.

```bicep
param AutomationAccountName string

resource AutomationAccount 'Microsoft.Automation/automationAccounts@2020-01-13-preview' = {
  name: AutomationAccountName
  ...
}
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
