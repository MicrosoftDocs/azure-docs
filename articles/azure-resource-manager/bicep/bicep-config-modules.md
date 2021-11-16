---
title: Module setting for Bicep config
description: Describes how to customize configuration values for modules in Bicep deployments.
ms.topic: conceptual
ms.date: 11/16/2021
---

# Add module settings in the Bicep config file

In a **bicepconfig.json** file, you can create aliases for module paths. You can also configure credential precedence for restoring a module.

This article describes the settings that are available for working with modules.

## Aliases for modules

To simplify the path for linking to modules, you can create aliases in the config file. An alias can refer to a module registry or a resource group that contains template specs. The config file has a property for `moduleAliases`. To create an alias for a Bicep registry, add a `br` property under the `moduleAliases` property. To add an alias for a template spec, use the `ts` property.

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

## Next steps

* [Add custom settings in Bicep config](bicep-config.md)
* [Add linter settings to Bicep config](bicep-config-linter.md)
* Learn about the [Bicep linter](linter.md)
