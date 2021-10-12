---
title: Bicep config file
description: Describes how to customize configuration values for your Bicep deployments
ms.topic: conceptual
ms.date: 10/12/2021
---

# Bicep config file

The **bicepconfig.json** file contains configuration values for your Bicep deployments. You can add multiple bicepconfig.json files. The closest configuration file in the directory hierarchy is used.

## Aliases for module registry

To simplify the path for linking to modules in a registry, you can create aliases in the config file.

The config file has a property for `moduleAliases`.

```json
{
  "moduleAliases": {
  }
}
```

To create a Bicep registry alias, add a `br` property under the `moduleAliases` property. Specify a name for the alias and configure its properties:

- **registry** (required): registry login server name
- **modulePath** (optional): registry repository where the modules are stored

The following json is a sample config file that defines two module aliases.

```json
{
  "moduleAliases": {
    "br": {
      "baseModules": {
        "registry": "exampleregistry.azurecr.io"
      },
      "storageModule": {
        "registry": "exampleregistry.azurecr.io",
        "modulePath": "bicep/modules/storage"
      }
    }
  }
}
```

**Without the aliases**, you would link to the module with the following syntax:

```bicep
module stgModule 'br/exampleregistry.azurecr.io/bicep/modules/storage:v1' = {
```

**With the aliases**, you can simplify the path by using the alias for the registry

```bicep
module stgModule 'br/baseModules/bicep/modules/storage:v1' = {
```

Or, simplify the path by using the alias for the registry and module.

```bicep
module stgModule  'br/storageModule:v1' = {
```
