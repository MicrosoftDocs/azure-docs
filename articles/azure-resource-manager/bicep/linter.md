---
title: Use Bicep linter
description: Learn how to use Bicep linter.
ms.topic: conceptual
ms.date: 09/10/2021
---

# Use Bicep linter

The Bicep linter can be used to analyze Bicep files. It enables you to find syntax errors and best practice violations before you build or deploy your Bicep file. You can customize the set of authoring best practices to use for checking the file. The linter makes it easier to enforce coding standards by providing guidance during development.

## Linter requirements

The linter is integrated into the Bicep CLI and VS Code extension. To use it, you must have version 0.4 or later.

## Customize linter

Using bicepconfig.json, you can enable or disable linter, supply rule-specific values, and set the level of rules as well. The following example shows the default bicepconfig.json:

```json
{
  "analyzers": {
    "core": {
      "verbose": false,
      "enabled": true,
      "rules": {
        "no-hardcoded-env-urls": {
          "level": "warning",
          "disallowedhosts": [
            "management.core.windows.net",
            "gallery.azure.com",
            "management.core.windows.net",
            "management.azure.com",
            "database.windows.net",
            "core.windows.net",
            "login.microsoftonline.com",
            "graph.windows.net",
            "trafficmanager.net",
            "vault.azure.net",
            "datalake.azure.net",
            "azuredatalakestore.net",
            "azuredatalakeanalytics.net",
            "vault.azure.net",
            "api.loganalytics.io",
            "api.loganalytics.iov1",
            "asazure.windows.net",
            "region.asazure.windows.net",
            "api.loganalytics.iov1",
            "api.loganalytics.io",
            "asazure.windows.net",
            "region.asazure.windows.net",
            "batch.core.windows.net"
          ],
          "excludedhosts": [
            "schema.management.azure.com"
          ]
        }
      }
    }
  }
}
```

Customized bicepconfig.json can be placed alongside your templates in the same directory. The closest configuration file found up the folder tree is used.

The following json is a sample bicepconfig.json:

```json
{
  "analyzers": {
    "core": {
      "enabled": true,
      "verbose": true,
      "rules": {
        "no-hardcoded-env-urls": {
          "level": "warning"
        },
        "no-unused-params": {
          "level": "error"
        },
        "no-unused-vars": {
          "level": "error"
        },
        "prefer-interpolation": {
          "level": "warning"
        },
        "secure-parameter-default": {
          "level": "error"
        },
        "simplify-interpolation": {
          "level": "warning"
        }
      }
    }
  }
}
```

- **enabled**: enter **true** for enabling linter, enter **false** for disabling linter.
- **verbose**: enter **true** to show the bicepconfig.json file used by Visual Studio Code.
- **rules**: enter rule-specific values. Each rule has at least one property, and level. This property commands the behavior of Bicep if the case if found in the Bicep file.

You can use several values for rule level:

| **level**  | **Build-time behavior** | **Editor behavior** |
|--|--|--|
| `Error` | Violations appear as Errors in command-line build output, and cause builds to fail. | Offending code is underlined with a red squiggle and appears in Problems tab. |
| `Warning` | Violations appear as Warnings in command-line build output, but they don't cause builds to fail. | Offending code is underlined with a yellow squiggle and appears in Problems tab. |
| `Info` | Violations don't appear in the command-line build output. | Offending code is underlined with a blue squiggle and appears in Problems tab. |
| `Off` | Suppressed completely. | Suppressed completely. |

The current set of linter rules is minimal and taken from [arm-ttk test cases](../templates/template-test-cases.md). Both Visual Studio Code extension and Bicep CLI check for all available rules by default and all rules are set at warning level. Based on the level of a rule, you see errors or warnings or informational messages within the editor.

- [no-hardcoded-env-urls](./linter-rule-no-hardcoded-environment-urls.md)
- [no-unused-params](./linter-rule-no-unused-parameters.md)
- [no-unused-vars](./linter-rule-no-unused-variables.md)
- [prefer-interpolation](./linter-rule-prefer-interpolation.md)
- [secure-parameter-default](./linter-rule-secure-parameter-default.md)
- [simplify-interpolation](./linter-rule-simplify-interpolation.md)

The Bicep extension of Visual Studio Code provides intellisense for editing Bicep configuration files:

:::image type="content" source="./media/linter/bicep-linter-configure-intellisense.png" alt-text="The intellisense support in configuring bicepconfig.json.":::

## Use in Visual Studio Code

Install the Bicep extension 0.4 or later to use linter.  The following screenshot shows linter in action:

:::image type="content" source="./media/linter/bicep-linter-show-errors.png" alt-text="Bicep linter usage in Visual Studio Code.":::

In the **PROBLEMS** pane, there are four errors, one warning, and one info message shown in the screenshot.  The info message shows the bicep configuration file that is used. It only shows this piece of information when you set **verbose** to **true** in the configuration file.

Hover your mouse cursor to one of the problem areas. Linter gives the details about the error or warning. Select the area, it also shows a blue light bulb:

:::image type="content" source="./media/linter/bicep-linter-show-quickfix.png" alt-text="Bicep linter usage in Visual Studio Code - show quickfix.":::

Select either the light bulb or the **Quick fix** link to see the solution:

:::image type="content" source="./media/linter/bicep-linter-show-quickfix-solution.png" alt-text="Bicep linter usage in Visual Studio Code - show quickfix solution.":::

Select the solution to fix the issue automatically.

## Use in Bicep CLI

Install the Bicep CLI 0.4 or later to use linter.  The following screenshot shows linter in action. The Bicep file is the same as used in [Use in Visual Studio Code](#use-in-visual-studio-code).

:::image type="content" source="./media/linter/bicep-linter-command-line.png" alt-text="Bicep linter usage in command line.":::

You can integrate these checks as a part of your CI/CD pipelines. You can use a GitHub action to attempt a bicep build. Errors will fail the pipelines.

## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
