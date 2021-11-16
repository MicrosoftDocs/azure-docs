---
title: Bicep config file
description: Describes the configuration file for your Bicep deployments
ms.topic: conceptual
ms.date: 11/16/2021
---

# Add custom settings in the Bicep config file

To customize configuration values for your Bicep deployments, add a file named **bicepconfig.json** to the directory where you store Bicep files. Within this file, specify the configuration values to use.

You can add multiple bicepconfig.json files. The closest configuration file in the directory hierarchy is used.

## Available settings

The following settings are available for customization in the Bicep config file:

* To simplify the path for linking to modules, create aliases in the config file. For more information, see [Add module settings to Bicep config](bicep-config-modules.md).
* To restore external modules to the local cache, the account must have the correct permissions to access the registry. You can configure the credential precedence for authenticating to the registry. For more information, see [Add module settings to Bicep config](bicep-config-modules.md).
* To override the default settings for the [Bicep linter](linter.md), set rule-specific values in the config file. For more information, see [Add linter settings to Bicep config](bice-config-linter.md).

## Intellisense

The Bicep extension for Visual Studio Code provides intellisense for your **bicepconfig.json** file. Use the intellisense to discover available properties and values.

:::image type="content" source="./media/bicep-config/bicep-linter-configure-intellisense.png" alt-text="The intellisense support in configuring bicepconfig.json.":::

## Next steps

* [Add module settings in Bicep config](bicep-config-modules.md)
* [Add linter settings to Bicep config](bice-config-linter.md)
* Learn about the [Bicep linter](linter.md)
