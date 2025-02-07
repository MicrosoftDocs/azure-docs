---
title: Using statement
description: Learn how to use the `using` statement in Bicep.
ms.topic: conceptual
ms.date: 01/10/2025
ms.custom: devx-track-bicep
---

# Using statement

The `using` statement in [Bicep parameters files](./parameter-files.md) ties the file to a [Bicep file](./file.md), a [JSON Azure Resource Manager template (ARM template)](../templates/syntax.md), a [Bicep module](./modules.md), or a [template spec](./template-specs.md). A `using` declaration must be present in all Bicep parameters files.

> [!NOTE]
> The Bicep parameters file is only supported in the [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.18.4 or later, [Azure CLI](/cli/azure/install-azure-cli) version 2.47.0 or later, and [Azure PowerShell](/powershell/azure/install-azure-powershell) version 9.7.1 or later.
>
> To use the statement with JSON ARM templates, Bicep modules, and template specs, you need to have [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.22.6 or later and [Azure CLI](/cli/azure/install-azure-cli) version 2.53.0 or later.

## Syntax

- To use Bicep files:

  ```bicep
  using '<path>/<file-name>.bicep'
  ```

- To use JSON ARM templates:

  ```bicep
  using '<path>/<file-name>.json'
  ```

- To use [public modules](./modules.md#path-to-a-module):

  ```bicep
  using 'br/public:<file-path>:<tag>'
  ```

  For example:

  ```bicep
  using 'br/public:avm/res/storage/storage-account:0.9.0' 

  param name = 'mystorage'
  ```

- To use private modules:

  ```bicep
  using 'br:<acr-name>.azurecr.io/bicep/<file-path>:<tag>'
  ```

  For example:

  ```bicep
  using 'br:myacr.azurecr.io/bicep/modules/storage:v1'
  ```

  To use a private module with an alias defined in a [_bicepconfig.json_](./bicep-config.md) file:

  ```bicep
  using 'br/<alias>:<file>:<tag>'
  ```

  For example:

  ```bicep
  using 'br/storageModule:storage:v1'
  ```

- To use template specs:

  ```bicep
  using 'ts:<subscription-id>/<resource-group-name>/<template-spec-name>:<tag>
  ```

  For example:

  ```bicep
  using 'ts:00000000-0000-0000-0000-000000000000/myResourceGroup/storageSpec:1.0'
  ```

  To use a template spec with an alias defined in a [_bicepconfig.json_](./bicep-config.md) file:

  ```bicep
  using 'ts/<alias>:<template-spec-name>:<tag>'
  ```

  For example:

  ```bicep
  using 'ts/myStorage:storageSpec:1.0'
  ```

## Next steps

- Learn about Bicep parameters files in [Create parameters files for Bicep deployment](./parameter-files.md).
- Learn about configuring aliases in _bicepconfig.json_ files in [Configure your Bicep environment](./bicep-config.md).
