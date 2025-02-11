---
title: Configure your Bicep environment
description: Learn how to configure your environment for Bicep file deployments.
ms.topic: conceptual
ms.date: 01/10/2025
ms.custom: devx-track-bicep
---

# Configure your Bicep environment

Bicep supports an optional configuration file named _bicepconfig.json_. Within this file, you can add values that customize your Bicep development experience. This file is merged with the [default configuration file](https://github.com/Azure/bicep/blob/main/src/Bicep.Core/Configuration/bicepconfig.json). For more information, see [Understand the merge process](#understand-the-merge-process). To customize a configuration, create a configuration file in the same directory or a parent directory of your Bicep files. If there are multiple parent directories containing _bicepconfig.json_ files, Bicep uses the configuration from the nearest one. For more information, see [Understand the file resolution process](#understand-the-file-resolution-process).

To configure Bicep extension settings, see [Visual Studio Code and Bicep extension](./install.md#visual-studio-code-and-bicep-extension).

## Create the configuration file in Visual Studio Code

You can use any text editor to create the config file.

To create a _bicepconfig.json_ file in Visual Studio Code, open the Command Palette (**[CTRL/CMD]**+**[SHIFT]**+**P**), and then select **Bicep: Create Bicep Configuration File**. For more information, see [Create Bicep configuration file](./visual-studio-code.md#create-bicep-configuration-file-command).

:::image type="content" source="./media/bicep-config/vscode-create-bicep-configuration-file.png" alt-text="Screenshot of how to create Bicep configuration file in Visual Studio Code.":::

The Bicep extension for Visual Studio Code supports IntelliSense for _bicepconfig.json_ files. Use the IntelliSense to discover available properties and values.

:::image type="content" source="./media/bicep-config/bicep-linter-configure-intellisense.png" alt-text="Screenshot of IntelliSense supporting a _bicepconfig.json_ file configuration.":::

## Understand the merge process

The _bicepconfig.json_ file undergoes a recursive bottom-up merging process with the default configuration file. During the merging process, Bicep examines each path in both configurations. If a path isn't present in the default configuration, the path and its associated value are added in the final result. Conversely, if a path exists in the default configuration with a different value, the value from _bicepconfig.json_ takes precedence in the merged result.

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

And the _bicepconfig.json_ is defined as follows:

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

In the preceding example, the value of `cloud.credentialPrecedence` is replaced, while the values of `cloud.moduleAliases.ContosoRegistry` and `cloud.moduleAliases.CoreModules` are appended in the merged configuration.

## Understand the file resolution process

The _bicepconfig.json_ file can be placed in the same directory or a parent directory of your Bicep files. If there are multiple parent directories containing _bicepconfig.json_ files, Bicep uses the configuration file from the nearest one. For instance, in the given folder structure where each folder has a _bicepconfig.json_ file:

:::image type="content" source="./media/bicep-config/bicep-config-file-resolve.png" alt-text="A diagram showing resolving a _bicepconfig.json_ file found in multiple parent folders.":::

If you compile _main.bicep_ in the `child` folder, the _bicepconfig.json_ file in the `child` folder is used. The configuration files in the `parent` folder and the `root` folder are ignored. If the `child` folder doesn't contain a configuration file, Bicep searches for a configuration in the `parent` folder and then the `root` folder. If a configuration file isn't found in any of the folders, Bicep defaults to using the [default values](https://github.com/Azure/bicep/blob/main/src/Bicep.Core/Configuration/bicepconfig.json).

In the context of a Bicep file invoking multiple modules, each module undergoes compilation using the nearest _bicepconfig.json_. Then, the main Bicep file is compiled with its corresponding _bicepconfig.json_. In the following scenario, `modA.bicep` is compiled using the _bicepconfig.json_ located in the `A` folder, `modB.bicep` is compiled with the _bicepconfig.json_ in the `B` folder, and finally, _main.bicep_ is compiled using the _bicepconfig.json_ in the `root` folder.

:::image type="content" source="./media/bicep-config/bicep-config-file-resolve-module.png" alt-text="A diagram showing the _bicepconfig.json_ file found in multiple parent folders with the module scenario.":::

In the absence of a _bicepconfig.json_ file in the `A` and `B` folders, all three Bicep files are compiled using the _bicepconfig.json_ found in the `root` folder. If _bicepconfig.json_ isn't present in any of the folders, the compilation defaults to using the [default values](https://github.com/Azure/bicep/blob/main/src/Bicep.Core/Configuration/bicepconfig.json).

## Configure Bicep modules

When working with [modules](modules.md), you can add aliases for module paths. These aliases simplify your Bicep file because you don't have to repeat complicated paths. You can also configure cloud profile and  credential precedence for authenticating to Azure from Bicep CLI and Visual Studio Code. The credentials are used to publish modules to registries and to restore external modules to the local cache when using the insert resource function. For more information, see [Add module settings to Bicep config](bicep-config-modules.md).

## Configure Linter rules

The [Bicep linter](linter.md) checks Bicep files for syntax errors and best practice violations. You can modify a _bicepconfig.json_ file to override the default settings for how a Bicep file is validated. For more information, see [Add linter settings to Bicep config](bicep-config-linter.md).

## Enable experimental features

You can enable experimental features by adding the following section to your _bicepconfig.json_ file. Using experimental features automatically enables [language version 2.0](../templates/syntax.md#languageversion-20) code generation.

Here's an example of enabling features 'assertions' and 'testFramework`. 

```json
{
  "experimentalFeaturesEnabled": {
    "assertions": true,
    "testFramework": true
  }
}
```

See [Experimental Features](https://aka.ms/bicep/experimental-features) for more information about Bicep experimental features.

## Next steps

- Learn how to add [module settings](bicep-config-modules.md) and [linter settings](bicep-config-linter.md) in the Bicep config file.
- Learn about the [Bicep linter](linter.md).
