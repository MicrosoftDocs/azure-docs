---
title: Use Bicep linter
description: Learn how to use Bicep linter.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/05/2023
---

# Use Bicep linter

The Bicep linter checks Bicep files for syntax errors and best practice violations. The linter helps enforce coding standards by providing guidance during development. You can customize the best practices to use for checking the file.

## Linter requirements

The linter is integrated into the Bicep CLI and the Bicep extension for Visual Studio Code. To use it, you must have version **0.4 or later**.

## Default rules

The default set of linter rules is minimal and taken from [arm-ttk test cases](../templates/template-test-cases.md). The extension and Bicep CLI check the following rules, which are set to the warning level.

- [adminusername-should-not-be-literal](./linter-rule-admin-username-should-not-be-literal.md)
- [artifacts-parameters](./linter-rule-artifacts-parameters.md)
- [decompiler-cleanup](./linter-rule-decompiler-cleanup.md)
- [max-outputs](./linter-rule-max-outputs.md)
- [max-params](./linter-rule-max-parameters.md)
- [max-resources](./linter-rule-max-resources.md)
- [max-variables](./linter-rule-max-variables.md)
- [no-conflicting-metadata](./linter-rule-no-conflicting-metadata.md)
- [no-deployments-resources](./linter-rule-no-deployments-resources.md)
- [no-hardcoded-env-urls](./linter-rule-no-hardcoded-environment-urls.md)
- [no-hardcoded-location](./linter-rule-no-hardcoded-location.md)
- [no-loc-expr-outside-params](./linter-rule-no-loc-expr-outside-params.md)
- [no-unnecessary-dependson](./linter-rule-no-unnecessary-dependson.md)
- [no-unused-existing-resources](./linter-rule-no-unused-existing-resources.md)
- [no-unused-params](./linter-rule-no-unused-parameters.md)
- [no-unused-vars](./linter-rule-no-unused-variables.md)
- [outputs-should-not-contain-secrets](./linter-rule-outputs-should-not-contain-secrets.md)
- [prefer-interpolation](./linter-rule-prefer-interpolation.md)
- [prefer-unquoted-property-names](./linter-rule-prefer-unquoted-property-names.md)
- [secure-parameter-default](./linter-rule-secure-parameter-default.md)
- [secure-params-in-nested-deploy](./linter-rule-secure-params-in-nested-deploy.md)
- [secure-secrets-in-params](./linter-rule-secure-secrets-in-parameters.md)
- [simplify-interpolation](./linter-rule-simplify-interpolation.md)
- [simplify-json-null](./linter-rule-simplify-json-null.md)
- [use-parent-property](./linter-rule-use-parent-property.md)
- [use-protectedsettings-for-commandtoexecute-secrets](./linter-rule-use-protectedsettings-for-commandtoexecute-secrets.md)
- [use-recent-api-versions](./linter-rule-use-recent-api-versions.md)
- [use-resource-id-functions](./linter-rule-use-resource-id-functions.md)
- [use-resource-symbol-reference](./linter-rule-use-resource-symbol-reference.md)
- [use-stable-resource-identifiers](./linter-rule-use-stable-resource-identifier.md)
- [use-stable-vm-image](./linter-rule-use-stable-vm-image.md)

You can customize how the linter rules are applied. To overwrite the default settings, add a **bicepconfig.json** file and apply custom settings. For more information about applying those settings, see [Add custom settings in the Bicep config file](bicep-config-linter.md).

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

The following screenshot shows the linter in the command line. The output from the build command shows any rule violations.

:::image type="content" source="./media/linter/bicep-linter-command-line.png" alt-text="Bicep linter usage in command line.":::

You can integrate these checks as a part of your CI/CD pipelines. You can use a GitHub action to attempt a bicep build. Errors will fail the pipelines.

## Silencing false positives

Sometimes a rule can have false positives. For example, you might need to include a link to a blob storage directly without using the [environment()](./bicep-functions-deployment.md#environment) function.
In this case you can disable the warning for one line only, not the entire document, by adding `#disable-next-line <rule name>` before the line with the warning.

```bicep
#disable-next-line no-hardcoded-env-urls //Direct download link to my toolset
scriptDownloadUrl: 'https://mytools.blob.core.windows.net/...'
```

It's good practice to add a comment explaining why the rule doesn't apply to this line.

## Next steps

- For more information about customizing the linter rules, see [Add custom settings in the Bicep config file](bicep-config-linter.md).
- For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
