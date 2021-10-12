---
title: Use Bicep linter
description: Learn how to use Bicep linter.
ms.topic: conceptual
ms.date: 10/12/2021
---

# Use Bicep linter

The Bicep linter checks Bicep files for syntax errors and best practice violations. The linter makes it easier to enforce coding standards by providing guidance during development. You can customize the set of authoring best practices to use for checking the file.

## Linter requirements

The linter is integrated into the Bicep CLI and VS Code extension. To use it, you must have version **0.4 or later**.

## Default rules

The current set of linter rules is minimal and taken from [arm-ttk test cases](../templates/template-test-cases.md). Both Visual Studio Code extension and Bicep CLI check for all available rules by default and all rules are set at warning level. Based on the level of a rule, you see errors or warnings or informational messages within the editor.

- [no-hardcoded-env-urls](./linter-rule-no-hardcoded-environment-urls.md)
- [no-unused-params](./linter-rule-no-unused-parameters.md)
- [no-unused-vars](./linter-rule-no-unused-variables.md)
- [prefer-interpolation](./linter-rule-prefer-interpolation.md)
- [secure-parameter-default](./linter-rule-secure-parameter-default.md)
- [simplify-interpolation](./linter-rule-simplify-interpolation.md)

You can customize how the linter rules are applied. To overwrite the default settings, add a **bicepconfig.json** file and apply custom settings. For more information about applying those settings, see [Bicep configuration file](bicep-config.md).

## Use in Visual Studio Code

The following screenshot shows the linter in Visual Studio Code:

:::image type="content" source="./media/linter/bicep-linter-show-errors.png" alt-text="Bicep linter usage in Visual Studio Code.":::

In the **PROBLEMS** pane, there are four errors, one warning, and one info message shown in the screenshot.  The info message shows the Bicep configuration file that is used. It only shows this piece of information when you set **verbose** to **true** in the configuration file.

Hover your mouse cursor to one of the problem areas. Linter gives the details about the error or warning. Select the area, it also shows a blue light bulb:

:::image type="content" source="./media/linter/bicep-linter-show-quickfix.png" alt-text="Bicep linter usage in Visual Studio Code - show quickfix.":::

Select either the light bulb or the **Quick fix** link to see the solution:

:::image type="content" source="./media/linter/bicep-linter-show-quickfix-solution.png" alt-text="Bicep linter usage in Visual Studio Code - show quickfix solution.":::

Select the solution to fix the issue automatically.

## Use in Bicep CLI

The following screenshot shows the linter in the command line.

:::image type="content" source="./media/linter/bicep-linter-command-line.png" alt-text="Bicep linter usage in command line.":::

You can integrate these checks as a part of your CI/CD pipelines. You can use a GitHub action to attempt a bicep build. Errors will fail the pipelines.

## Next steps

* For more information about customizing the linter rules, see [Bicep config file](bicep-config.md).
* For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
