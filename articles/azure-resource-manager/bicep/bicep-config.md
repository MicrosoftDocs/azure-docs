---
title: Bicep config file
description: Describes the configuration file for your Bicep deployments
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 09/27/2023
---

# Configure your Bicep environment

Bicep supports an optional configuration file named `bicepconfig.json`. Within this file, you can add values that customize your Bicep development experience.

To customize configuration, create this file in the same directory, or a parent directory of your Bicep files. If multiple parent directories contain `bicepconfig.json` files, Bicep uses configuration from the nearest one. If a configuration file is not found, Bicep uses default values.

To configure Bicep extension settings, see [VS Code and Bicep extension](./install.md#visual-studio-code-and-bicep-extension).

## Create the config file in Visual Studio Code

You can use any text editor to create the config file.

To create a `bicepconfig.json` file in Visual Studio Code, open the Command Palette (**[CTRL/CMD]**+**[SHIFT]**+**P**), and then select **Bicep: Create Bicep Configuration File**. For more information, see [Create Bicep configuration file](./visual-studio-code.md#create-bicep-configuration-file).

:::image type="content" source="./media/bicep-config/vscode-create-bicep-configuration-file.png" alt-text="Screenshot of how to create Bicep configuration file in VS Code.":::

The Bicep extension for Visual Studio Code supports intellisense for your `bicepconfig.json` file. Use the intellisense to discover available properties and values.

:::image type="content" source="./media/bicep-config/bicep-linter-configure-intellisense.png" alt-text="Screenshot of the intellisense support in configuring bicepconfig.json.":::

## Configure Bicep modules

When working with [modules](modules.md), you can add aliases for module paths. These aliases simplify your Bicep file because you don't have to repeat complicated paths. You can also configure cloud profile and  credential precedence for authenticating to Azure from Bicep CLI and Visual Studio Code. The credentials are used to publish modules to registries and to restore external modules to the local cache when using the insert resource function. For more information, see [Add module settings to Bicep config](bicep-config-modules.md).

## Configure Linter rules

The [Bicep linter](linter.md) checks Bicep files for syntax errors and best practice violations. You can override the default settings for the Bicep file validation by modifying `bicepconfig.json`. For more information, see [Add linter settings to Bicep config](bicep-config-linter.md).

## Enable experimental features

You can enable experimental features by adding the following section to your `bicepconfig.json` file.

Here is an example of enabling features 'compileTimeImports' and 'userDefinedFunctions`. 

```json
{
  "experimentalFeaturesEnabled": {
    "compileTimeImports": true,
    "userDefinedFunctions": true
  }
}
```

For information on the current set of experimental features, see [Experimental Features](https://aka.ms/bicep/experimental-features).

## Next steps

- [Add module settings in Bicep config](bicep-config-modules.md)
- [Add linter settings to Bicep config](bicep-config-linter.md)
- Learn about the [Bicep linter](linter.md)
