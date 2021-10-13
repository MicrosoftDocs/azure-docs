---
title: Linter rule - simplify interpolation
description: Linter rule - simplify interpolation
ms.topic: conceptual
ms.date: 09/14/2021
---

# Linter rule - simplify interpolation

The linter makes it easier to enforce coding standards by providing guidance during development. The current set of linter rules is minimal and taken from [arm-ttk test cases](../templates/template-test-cases.md):

- [no-hardcoded-env-urls](./linter-rule-no-hardcoded-environment-urls.md)
- [no-unused-params](./linter-rule-no-unused-parameters.md)
- [no-unused-vars](./linter-rule-no-unused-variables.md)
- [prefer-interpolation](./linter-rule-prefer-interpolation.md)
- [secure-parameter-default](./linter-rule-secure-parameter-default.md)
- [simplify-interpolation](./linter-rule-simplify-interpolation.md)

For more information, see [Use Bicep linter](./linter.md).

## Code

`simplify-interpolation`

## Description

It isn't necessary to use interpolation to reference a parameter or variable.

## Examples

The following example fails this test.

```bicep
param AutomationAccountName string

resource AutomationAccount 'Microsoft.Automation/automationAccounts@2020-01-13-preview' = {
  name: '${AutomationAccountName}'
  ...
}
```

The following example passes this test.

```bicep
param AutomationAccountName string

resource AutomationAccount 'Microsoft.Automation/automationAccounts@2020-01-13-preview' = {
  name: AutomationAccountName
  ...
}
```

## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
