---
title: Module setting for Bicep config
description: Describes how to customize configuration values for modules in Bicep deployments.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 01/18/2023
---

# Add module settings in the Bicep config file

In a **bicepconfig.json** file, you can create aliases for module paths and configure profile and credential precedence for publishing and restoring modules.

This article describes the settings that are available for working with [Bicep modules](modules.md).

## Aliases for modules

To simplify the path for linking to modules, create aliases in the config file. An alias refers to either a module registry or a resource group that contains template specs.

The config file has a property for `moduleAliases`. This property contains all of the aliases you define. Under this property, the aliases are divided based on whether they refer to a registry or a template spec.

To create an alias for a **Bicep registry**, add a `br` property. To add an alias for a **template spec**, use the `ts` property.

```json
{
  "moduleAliases": {
    "br": {
      <add-registry-aliases>
    },
    "ts": {
      <add-template-specs-aliases>
    }
  }
}
```

Within the `br` property, add as many aliases as you need. For each alias, give it a name and the following properties:

- **registry** (required): registry login server name
- **modulePath** (optional): registry repository where the modules are stored

Within the `ts` property, add as many aliases as you need. For each alias, give it a name and the following properties:

- **subscription** (required): the subscription ID that hosts the template specs
- **resourceGroup** (required): the name of the resource group that contains the template specs

The following example shows a config file that defines two aliases for a module registry, and one alias for a resource group that contains template specs.

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
    },
    "ts": {
      "CoreSpecs": {
        "subscription": "00000000-0000-0000-0000-000000000000",
        "resourceGroup": "CoreSpecsRG"
      }
    }
  }
}
```

When using an alias in the module reference, you must use the formats:

```bicep
br/<alias>:<file>:<tag>
ts/<alias>:<file>:<tag>
```

Define your aliases to the folder or resource group that contains modules, not the file itself. The file name must be included in the reference to the module.

**Without the aliases**, you would link to a module in a registry with the full path.

```bicep
module stgModule 'br:contosoregistry.azurecr.io/bicep/modules/core/storage:v1' = {
```

**With the aliases**, you can simplify the link by using the alias for the registry.

```bicep
module stgModule 'br/ContosoRegistry:bicep/modules/core/storage:v1' = {
```

Or, you can simplify the link by using the alias that specifies the registry and module path.

```bicep
module stgModule  'br/CoreModules:storage:v1' = {
```

For a template spec, use:

```bicep
module stgModule  'ts/CoreSpecs:storage:v1' = {
```

An alias has been predefined for the [public module registry](./modules.md#path-to-module). To reference a public module, you can use the format:

```bicep
br/public:<file>:<tag>
```

You can override the public module registry alias definition in the bicepconfig.json file:

```json
{
  "moduleAliases": {
    "br": {
      "public": {
        "registry": "<your_module_registry>",
        "modulePath": "<optional_module_path>"
      }
    }
  }
}
```

## Configure profiles and credentials

To [publish](bicep-cli.md#publish) modules to a private module registry or to [restore](bicep-cli.md#restore) external modules to the local cache, the account must have the correct permissions to access the registry. You can configure the profile and the credential precedence for authenticating to the registry. By default, Bicep uses the `AzureCloud` profile and the credentials from the user authenticated in Azure CLI or Azure PowerShell. You can customize `currentProfile` and `credentialPrecedence` in the config file.

```json
{
  "cloud": {
    "currentProfile": "AzureCloud",
    "profiles": {
      "AzureCloud": {
        "resourceManagerEndpoint": "https://management.azure.com",
        "activeDirectoryAuthority": "https://login.microsoftonline.com"
      },
      "AzureChinaCloud": {
        "resourceManagerEndpoint": "https://management.chinacloudapi.cn",
        "activeDirectoryAuthority": "https://login.chinacloudapi.cn"
      },
      "AzureUSGovernment": {
        "resourceManagerEndpoint": "https://management.usgovcloudapi.net",
        "activeDirectoryAuthority": "https://login.microsoftonline.us"
      }
    },
    "credentialPrecedence": [
      "AzureCLI",
      "AzurePowerShell"
    ]
  }
}
```

The available profiles are:

- AzureCloud
- AzureChinaCloud
- AzureUSGovernment

You can customize these profiles, or add new profiles for your on-premises environments.

The available credential types are:

- AzureCLI
- AzurePowerShell
- Environment
- ManagedIdentity
- VisualStudio
- VisualStudioCode

[!INCLUDE [vscode authentication](../../../includes/resource-manager-vscode-authentication.md)]

## Next steps

- [Configure your Bicep environment](bicep-config.md)
- [Add linter settings to Bicep config](bicep-config-linter.md)
- Learn about [modules](modules.md)
