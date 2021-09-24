---
title: Linter rule - no unused variables
description: Linter rule - no unused variables
ms.topic: conceptual
ms.date: 09/14/2021
---

# Linter rule - no unused variables

The linter makes it easier to enforce coding standards by providing guidance during development. The current set of linter rules is minimal and taken from [arm-ttk test cases](../templates/template-test-cases.md):

- [no-hardcoded-env-urls](./linter-rule-no-hardcoded-environment-urls.md)
- [no-unused-params](./linter-rule-no-unused-parameters.md)
- [no-unused-vars](./linter-rule-no-unused-variables.md)
- [prefer-interpolation](./linter-rule-prefer-interpolation.md)
- [secure-parameter-default](./linter-rule-secure-parameter-default.md)
- [simplify-interpolation](./linter-rule-simplify-interpolation.md)

For more information, see [Use Bicep linter](./linter.md).

## Code

`no-unused-vars`

## Description

To reduce confusion in your template, delete any variables that are defined but not used. This test finds any variables that aren't used anywhere in the template.

## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
