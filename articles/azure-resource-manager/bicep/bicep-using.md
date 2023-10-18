---
title: Using statement
description: Describes how to use the using statement in Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/11/2023
---

# Using statement

The `using` statement in [Bicep parameter files](./parameter-files.md) ties the [Bicep parameters file](./parameter-files.md) to a [Bicep file](./file.md), an [ARM JSON template](../templates/syntax.md), or a [Bicep module](./modules.md), or a [template spec](./template-specs.md). A `using` declaration must be present in any Bicep parameters file.

> [!NOTE]
> The Bicep parameters file is only supported in [Bicep CLI](./install.md) version 0.18.4 or later, and [Azure CLI](/azure/developer/azure-developer-cli/install-azd?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows) version 2.47.0 or later.
>
> To use the statement with ARM JSON templates, Bicep modules, and template specs, you need to have [Bicep CLI](./install.md) version 0.22.6 or later, and [Azure CLI](/azure/developer/azure-developer-cli/install-azd?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows) version 2.53.0 or later.

## Syntax

- To use Bicep file:

  ```bicep
  using '<path>/<file-name>.bicep'
  ```

- To use ARM JSON template:

  ```bicep
  using '<path>/<file-name>.json'
  ```

- To use public module:

  ```bicep
  using 'br/public:<file-path>:<tag>'
  ```

  For example:

  ```bicep
  using 'br/public:storage/storage-account:3.0.1'

  param name = 'mystorage'
  ```

- To use private module:

  ```bicep
  using 'br:<acr-name>.azurecr.io/bicep/<file-path>:<tag>'
  ```

  For example:

  ```bicep
  using 'br:myacr.azurecr.io/bicep/modules/storage:v1'
  ```

  To use a private module with an alias defined in [bicepconfig.json](./bicep-config.md):

  ```bicep
  using 'br/<alias>:<file>:<tag>'
  ```

  For example:

  ```bicep
  using 'br/storageModule:storage:v1'
  ```

- To use template spec:

  ```bicep
  using 'ts:<subscription-id>/<resource-group-name>/<template-spec-name>:<tag>
  ```

  For example:

  ```bicep
  using 'ts:00000000-0000-0000-0000-000000000000/myResourceGroup/storageSpec:1.0'
  ```

  To use a template spec with an alias defined in [bicepconfig.json](./bicep-config.md):

  ```bicep
  using 'ts/<alias>:<template-spec-name>:<tag>'
  ```

  For example:

  ```bicep
  using 'ts/myStorage:storageSpec:1.0'
  ```

## Next steps

- To learn about the Bicep parameters files, see [Parameters file](./parameter-files.md).
- To learn about configuring aliases in bicepconfig.json, see [Bicep config file](./bicep-config.md).
