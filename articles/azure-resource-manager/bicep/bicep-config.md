---
title: Bicep config file
description: Describes how to customize configuration values for your Bicep deployments
ms.topic: conceptual
ms.date: 10/13/2021
---

# Add custom settings in the Bicep config file

To customize configuration values for your Bicep deployments, add a file named **bicepconfig.json** to the directory where you store Bicep files. Within this file, specify the configuration values to use.

You can add multiple bicepconfig.json files. The closest configuration file in the directory hierarchy is used.

This article describes the properties that are available in the configuration file. However, you can also discover those properties through intellisense provided by the Bicep extension for Visual Studio Code.

:::image type="content" source="./media/bicep-config/bicep-linter-configure-intellisense.png" alt-text="The intellisense support in configuring bicepconfig.json.":::

## Aliases for module registry

To simplify the path for linking to modules in a registry, you can create aliases in the config file. The config file has a property for `moduleAliases`. To create a Bicep registry alias, add a `br` property under the `moduleAliases` property.

```json
{
  "moduleAliases": {
    "br": {
      <add-aliases>
    }
  }
}
```

Within the `br` property, add as many aliases as you need. For each alias, give it a name and the following properties:

- **registry** (required): registry login server name
- **modulePath** (optional): registry repository where the modules are stored

The following example shows a sample config file that defines two module aliases.

```json
{
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

**Without the aliases**, you would link to the module with the full path.

```bicep
module stgModule 'br/contosoregistry.azurecr.io/bicep/modules/core/storage:v1' = {
```

**With the aliases**, you can simplify the link by using the alias for the registry.

```bicep
module stgModule 'br/ContosoRegistry:bicep/modules/core/storage:v1' = {
```

Or, you can simplify the link by using the alias that specifies the registry and module path.

```bicep
module stgModule  'br/CoreModules:storage:v1' = {
```

When using an alias in the module reference, you must use the format:

```bicep
br/<alias>:<file>:<tag>
```

Define your aliases to the folder that contains modules, not the file itself. The file name must be included in the reference to the module.

## Credentials for restoring modules

To [restore](bicep-cli.md#restore) external modules to the local cache, the account must have the correct permissions to access the registry. You can configure the credential precedence for authenticating to the registry. By default, Bicep uses the credentials from the user authenticated in Azure CLI or Azure PowerShell. To customize the credential precedence, add `cloud` and `credentialPrecedence` elements to the config file.

```json
{
    "cloud": {
      "credentialPrecedence": [
        "AzureCLI",
        "AzurePowerShell"
      ]
    }
}
```

The available credentials are:

* AzureCLI
* AzurePowerShell
* Environment
* ManagedIdentity
* VisualStudio
* VisualStudioCode

## Customize linter

In the configuration file, you customize the settings for the [Bicep linter](linter.md). You can enable or disable the linter, supply rule-specific values, and set the level of rules.

The following example shows the rules that are available for configuration.

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

The properties are:

- **enabled**: specify **true** for enabling linter, **false** for disabling linter.
- **verbose**: specify **true** to show the bicepconfig.json file used by Visual Studio Code.
- **rules**: specify rule-specific values. Each rule has a level that determines how the linter responds when a violation is found.

The available values for **level** are:

| **level**  | **Build-time behavior** | **Editor behavior** |
|--|--|--|
| `Error` | Violations appear as Errors in command-line build output, and causes the build to fail. | Offending code is underlined with a red squiggle and appears in Problems tab. |
| `Warning` | Violations appear as Warnings in command-line build output, but they don't cause the build to fail. | Offending code is underlined with a yellow squiggle and appears in Problems tab. |
| `Info` | Violations don't appear in the command-line build output. | Offending code is underlined with a blue squiggle and appears in Problems tab. |
| `Off` | Suppressed completely. | Suppressed completely. |

For the rule about hardcoded environment URLs, you can customize which URLs are checked. By default, the following settings are applied:

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


