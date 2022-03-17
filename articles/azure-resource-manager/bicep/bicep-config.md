---
title: Bicep config file
description: Describes the configuration file for your Bicep deployments
ms.topic: conceptual
ms.date: 11/16/2021
---

# Configure your Bicep environment

Bicep supports a configuration file named **bicepconfig.json**. Within this file, you can add values that customize your Bicep development experience. If you don't add this file, Bicep uses default values.

To customize values, create this file in the directory where you store Bicep files. You can add bicepconfig.json files in multiple directories. The closest configuration file in the directory hierarchy is used.

## Available settings

When working with [modules](modules.md), you can add aliases for module paths. These aliases simplify your Bicep file because you don't have to repeat complicated paths. You can also configure the credential precedence for authenticating to the registry. The credential is used to restore external modules to the local cache. For more information, see [Add module settings to Bicep config](bicep-config-modules.md).

When working with the [Bicep linter](linter.md), you can override the default settings for the Bicep file validation. For more information, see [Add linter settings to Bicep config](bicep-config-linter.md).

## Intellisense

The Bicep extension for Visual Studio Code supports intellisense for your **bicepconfig.json** file. Use the intellisense to discover available properties and values.

:::image type="content" source="./media/bicep-config/bicep-linter-configure-intellisense.png" alt-text="The intellisense support in configuring bicepconfig.json.":::

## Next steps

* [Add module settings in Bicep config](bicep-config-modules.md)
* [Add linter settings to Bicep config](bicep-config-linter.md)
* Learn about the [Bicep linter](linter.md)
