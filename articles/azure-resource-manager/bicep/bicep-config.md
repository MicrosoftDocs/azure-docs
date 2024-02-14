---
title: Bicep config file
description: Describes the configuration file for your Bicep deployments
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 02/02/2024
---

# Configure your Bicep environment

Bicep supports an optional configuration file named `bicepconfig.json`. Within this file, you can add values that customize your Bicep development experience. This file is merged with the [default configuration file](https://github.com/Azure/bicep/blob/main/src/Bicep.Core/Configuration/bicepconfig.json). For more information, see [Understand the merge process](#understand-the-merge-process). To customize configuration, create a configuration file in the same directory or a parent directory of your Bicep files. If there are multiple parent directories containing `bicepconfig.json` files, Bicep uses the configuration from the nearest one. For more information, see [Understand the file resolution process](#understand-the-file-resolution-process).

To configure Bicep extension settings, see [VS Code and Bicep extension](./install.md#visual-studio-code-and-bicep-extension).

## Create the config file in Visual Studio Code

You can use any text editor to create the config file.

To create a `bicepconfig.json` file in Visual Studio Code, open the Command Palette (**[CTRL/CMD]**+**[SHIFT]**+**P**), and then select **Bicep: Create Bicep Configuration File**. For more information, see [Create Bicep configuration file](./visual-studio-code.md#create-bicep-configuration-file).

:::image type="content" source="./media/bicep-config/vscode-create-bicep-configuration-file.png" alt-text="Screenshot of how to create Bicep configuration file in VS Code.":::

The Bicep extension for Visual Studio Code supports intellisense for your `bicepconfig.json` file. Use the intellisense to discover available properties and values.

:::image type="content" source="./media/bicep-config/bicep-linter-configure-intellisense.png" alt-text="Screenshot of the intellisense support in configuring bicepconfig.json.":::

## Understand the merge process

The `bicepconfig.json` file undergoes a recursive bottom-up merging process with the default configuration file. During the merging process, Bicep examines each path in both configurations. If a path isn't present in the default configuration, the path and its associated value are added in the final result. Conversely, if a path exists in the default configuration with a different value, the value from `bicepconfig.json` takes precedence in the merged result.

Consider a scenario where the default configuration is defined as follows:

```json
{
  "cloud": {
    ...
    "credentialPrecedence": [
      "AzureCLI",
      "AzurePowerShell"
    ]
  },
  "moduleAliases": {
    "ts": {},
    "br": {
      "public": {
        "registry": "mcr.microsoft.com",
        "modulePath": "bicep"
      }
    }
  },
  ...
}
```

And the `bicepconfig.json` is defined as follows:

```json
{
  "cloud": {
    "credentialPrecedence": [
      "AzurePowerShell",
      "AzureCLI"
    ]
  },
  "moduleAliases": {
    "br": {
      "ContosoRegistry": {
        "registry": "contosoregistry.azurecr.io"
      },
      "CoreModules": {
        "registry": "contosoregistry.azurecr.io",
        "modulePath": "bicep/modules/core"
      }
    }
  }
}
```

The resulting merged configuration would be:

```json
{
  "cloud": {
    ...
    "credentialPrecedence": [
      "AzurePowerShell",
      "AzureCLI"
    ]
  },
  "moduleAliases": {
    "ts": {},
    "br": {
      "public": {
        "registry": "mcr.microsoft.com",
        "modulePath": "bicep"
      },
      "ContosoRegistry": {
        "registry": "contosoregistry.azurecr.io"
      },
      "CoreModules": {
        "registry": "contosoregistry.azurecr.io",
        "modulePath": "bicep/modules/core"
      }
    }
  },
  ...
}
```

In the preceding example, the value of `cloud.credentialPrecedence` is replaced, while the value of `cloud.moduleAliases.ContosoRegistry` and `cloud.moduleAliases.CoreModules` are appended in the merged configuration.

## Understand the file resolution process

The `bicepconfig.json` file can be placed in the same directory or a parent directory of your Bicep files. If there are multiple parent directories containing `bicepconfig.json` files, Bicep uses the configuration file from the nearest one. For instance, in the given folder structure where each folder has a `bicepconfig.json` file:

:::image type="content" source="./media/bicep-config/bicep-config-file-resolve.png" alt-text="A diagram showing resolving `bicepconfig.json` found in multiple parent folders.":::

If you compile `main.bicep` in the `child` folder, the `bicepconfig.json` file in the `child` folder is used. The configuration files in the `parent` folder and the `root` folder are ignored. If the `child` folder doesn't contain a configuration file, Bicep searches for a configuration in the `parent` folder and then the `root` folder. If no configuration file is found in any of the folders, Bicep defaults to using the [default values](https://github.com/Azure/bicep/blob/main/src/Bicep.Core/Configuration/bicepconfig.json).

In the context of a Bicep file invoking multiple modules, each module undergoes compilation using the nearest `bicepconfig.json`. Then, the main Bicep file is compiled with its corresponding `bicepconfig.json`. In the following scenario, `modA.bicep` is compiled using the `bicepconfig.json` located in the `A` folder, `modB.bicep` is compiled with the `bicepconfig.json` in the `B` folder, and finally, `main.bicep` is compiled using the `bicepconfig.json` in the `root` folder.

:::image type="content" source="./media/bicep-config/bicep-config-file-resolve-module.png" alt-text="A diagram showing resolving `bicepconfig.json` found in multiple parent folders with the module scenario.":::

In the absence of a `bicepconfig.json` file in the `A` and `B` folders, all three Bicep files are compiled using the `bicepconfig.json` found in the `root` folder. If `bicepconfig.json` isn't present in any of the folders, the compilation process defaults to using the [default values](https://github.com/Azure/bicep/blob/main/src/Bicep.Core/Configuration/bicepconfig.json).

## Configure Bicep modules

When working with [modules](modules.md), you can add aliases for module paths. These aliases simplify your Bicep file because you don't have to repeat complicated paths. You can also configure cloud profile and  credential precedence for authenticating to Azure from Bicep CLI and Visual Studio Code. The credentials are used to publish modules to registries and to restore external modules to the local cache when using the insert resource function. For more information, see [Add module settings to Bicep config](bicep-config-modules.md).

## Configure Linter rules

The [Bicep linter](linter.md) checks Bicep files for syntax errors and best practice violations. You can override the default settings for the Bicep file validation by modifying `bicepconfig.json`. For more information, see [Add linter settings to Bicep config](bicep-config-linter.md).

## Enable experimental features

You can enable experimental features by adding the following section to your `bicepconfig.json` file.

Here's an example of enabling features 'compileTimeImports' and 'userDefinedFunctions`. 

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
