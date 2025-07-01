---
title: Use Bicep linter
description: Learn how to use Bicep linter.
ms.topic: how-to
ms.custom: devx-track-bicep
ms.date: 06/19/2025
---

# Use Bicep linter

The Bicep linter checks Bicep files for syntax errors and best practice violations. The linter helps enforce coding standards by providing guidance during development. You can customize the best practices to use for checking the file.

## Linter requirements

The linter is integrated into the Bicep CLI and the Bicep extension for Visual Studio Code. To use it, you must have [Bicep CLI version 0.4 or later](https://github.com/Azure/bicep/releases/tag/v0.4.1).

## Default rules

The default set of linter rules is minimal and taken from [arm-ttk test cases](../templates/template-test-cases.md). The extension and Bicep CLI check the following rules, which are set to the warning level.

| Linter rule | Default level |
| --- | --- |
| <a id='adminusername-should-not-be-literal' />[adminusername-should-not-be-literal](./linter-rule-admin-username-should-not-be-literal.md) | warning |
| <a id='artifacts-parameters' />[artifacts-parameters](./linter-rule-artifacts-parameters.md) | warning |
| <a id='decompiler-cleanup' />[decompiler-cleanup](./linter-rule-decompiler-cleanup.md) | warning |
| <a id='explicit-values-for-loc-params' />[explicit-values-for-loc-params](./linter-rule-explicit-values-for-loc-params.md) | off |
| <a id='max-asserts' />[max-asserts](./linter-rule-max-asserts.md) | error |
| <a id='max-outputs' />[max-outputs](./linter-rule-max-outputs.md) | error |
| <a id='max-params' />[max-params](./linter-rule-max-parameters.md) | error |
| <a id='max-resources' />[max-resources](./linter-rule-max-resources.md) | error |
| <a id='max-variables' />[max-variables](./linter-rule-max-variables.md) | error |
| <a id='nested-deployment-template-scoping' />[nested-deployment-template-scoping](./linter-rule-nested-deployment-template-scoping.md) | error |
| <a id='no-conflicting-metadata' />[no-conflicting-metadata](./linter-rule-no-conflicting-metadata.md) | warning |
| <a id='no-deployments-resources' />[no-deployments-resources](./linter-rule-no-deployments-resources.md) | warning |
| <a id='no-hardcoded-env-urls' />[no-hardcoded-env-urls](./linter-rule-no-hardcoded-environment-urls.md) | warning |
| <a id='no-hardcoded-location' />[no-hardcoded-location](./linter-rule-no-hardcoded-location.md) | off |
| <a id='no-loc-expr-outside-params' />[no-loc-expr-outside-params](./linter-rule-no-loc-expr-outside-params.md) | off |
| <a id='no-unnecessary-dependson' />[no-unnecessary-dependson](./linter-rule-no-unnecessary-dependson.md) | warning |
| <a id='no-unused-existing-resources' />[no-unused-existing-resources](./linter-rule-no-unused-existing-resources.md) | warning |
| <a id='no-unused-imports' />[no-unused-imports](./linter-rule-no-unused-imports.md) | warning |
| <a id='no-unused-params' />[no-unused-params](./linter-rule-no-unused-parameters.md) | warning |
| <a id='no-unused-vars' />[no-unused-vars](./linter-rule-no-unused-variables.md) | warning |
| <a id='outputs-should-not-contain-secrets' />[outputs-should-not-contain-secrets](./linter-rule-outputs-should-not-contain-secrets.md) | warning |
| <a id='prefer-interpolation' />[prefer-interpolation](./linter-rule-prefer-interpolation.md) | warning |
| <a id='prefer-unquoted-property-names' />[prefer-unquoted-property-names](./linter-rule-prefer-unquoted-property-names.md) | warning |
| <a id='protect-commandtoexecute-secrets' />[protect-commandtoexecute-secrets](./linter-rule-use-protectedsettings-for-commandtoexecute-secrets.md) | warning |
| <a id='secure-parameter-default' />[secure-parameter-default](./linter-rule-secure-parameter-default.md) | warning |
| <a id='secure-params-in-nested-deploy' />[secure-params-in-nested-deploy](./linter-rule-secure-params-in-nested-deploy.md) | warning |
| <a id='secure-secrets-in-params' />[secure-secrets-in-params](./linter-rule-secure-secrets-in-parameters.md) | warning |
| <a id='simplify-interpolation' />[simplify-interpolation](./linter-rule-simplify-interpolation.md) | warning |
| <a id='simplify-json-null' />[simplify-json-null](./linter-rule-simplify-json-null.md) | warning |
| <a id='use-parent-property' />[use-parent-property](./linter-rule-use-parent-property.md) | warning |
| <a id='use-recent-api-versions' />[use-recent-api-versions](./linter-rule-use-recent-api-versions.md) | off |
| <a id='use-recent-module-versions' />[use-recent-module-versions](./linter-rule-use-recent-module-versions.md) | off |
| <a id='use-resource-id-functions' />[use-resource-id-functions](./linter-rule-use-resource-id-functions.md) | off |
| <a id='use-resource-symbol-reference' />[use-resource-symbol-reference](./linter-rule-use-resource-symbol-reference.md) | warning |
| <a id='use-safe-access' />[use-safe-access](./linter-rule-use-safe-access.md) | warning |
| <a id='use-secure-value-for-secure-inputs' />[use-secure-value-for-secure-inputs](./linter-rule-use-secure-value-for-secure-inputs.md) | warning |
| <a id='use-stable-resource-identifiers' />[use-stable-resource-identifiers](./linter-rule-use-stable-resource-identifier.md) | warning |
| <a id='use-stable-vm-image' />[use-stable-vm-image](./linter-rule-use-stable-vm-image.md) | warning |
| <a id='what-if-short-circuiting' />[what-if-short-circuiting](./linter-rule-what-if-short-circuiting.md) | off |

You can enable or disable all linter rules and control how they are applied using a configuration file. To override the default behavior, create a **bicepconfig.json** file with your custom settings. For more information about applying those settings, see [Add custom settings in the Bicep config file](bicep-config-linter.md).

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

The following screenshot shows the linter in the command line. The output from the [lint command](./bicep-cli.md#lint) and the [build command](./bicep-cli.md#build) shows any rule violations.

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

If you want to suppress a linter rule, you can change the level of the rule to `Off` in [bicepconfig.json](./bicep-config-linter.md). For example, in the following example, the `no-deployments-resources` rule is suppressed:

```json
{
  "analyzers": {
    "core": {
      "rules": {
        "no-deployments-resources": {
          "level": "off"
        }
      }
    }
  }
}
```

## Next steps

- For more information about customizing the linter rules, see [Add custom settings in the Bicep config file](bicep-config-linter.md).
- For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
