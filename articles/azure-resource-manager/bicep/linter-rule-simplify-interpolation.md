---
title: Linter rule - no hardcoded environment URL
description: Linter rule - no hardcoded environment URL
ms.topic: conceptual
ms.date: 09/14/2021
---

# Linter rule - no hardcoded environment URL

The Bicep linter can be used to analyze Bicep files. It enables you to find syntax errors and best practice violations before you build or deploy your Bicep file. You can customize the set of authoring best practices to use for checking the file. The linter makes it easier to enforce coding standards by providing guidance during development.

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
