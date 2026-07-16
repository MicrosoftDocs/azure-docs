---
title: Using and using none statements
description: Learn how to use the `using` and `using none` statements in Bicep.
ms.topic: article
ms.date: 12/22/2025
ms.custom: devx-track-bicep
---

# Using and using none statements

All Bicep parameter files must include a `using` or a `using none` declaration.

A Bicep parameter file typically uses a `using` statement to link the file to a [Bicep file](./file.md), a [JSON Azure Resource Manager template (ARM template)](../templates/syntax.md), a [Bicep module](./modules.md), or a [template spec](./template-specs.md). This linkage enables the Bicep language server and compiler to validate the parameter file by checking for correct names, types, and required values based on the template's inputs.

In contrast, the `using none` statement explicitly indicates that the parameter file isn't linked to any particular template at compile time. This statement means the parameters aren't validated against a specific template and are instead intended for more general use, such as being consumed by external tools or serving as shared, reusable parameter sets.

> [!NOTE]
> Bicep parameters files are supported only in [Bicep CLI version 0.18.4](https://github.com/Azure/bicep/releases/tag/v0.18.4) or later, [Azure CLI](/cli/azure/install-azure-cli) version 2.47.0 or later, and [Azure PowerShell](/powershell/azure/install-azure-powershell) version 9.7.1 or later. The `using none` feature is supported in [Bicep CLI version 0.31.0](https://github.com/Azure/bicep/releases/tag/v0.31.92) or later.
>
> To use the statement with JSON ARM templates, Bicep modules, and template specs, you need to have [Bicep CLI version 0.22.6](https://github.com/Azure/bicep/releases/tag/v0.22.6) or later and [Azure CLI](/cli/azure/install-azure-cli) version 2.53.0 or later.

## The using statement

The syntax of the `using` statement:

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

## The using none statement

The `using none` statement in a Bicep parameters file (.bicepparam) indicates that the file isn't tied to a specific Bicep template during authoring or compilation. This statement decouples the parameter file from a particular template, enabling greater flexibility in how you define and use parameters across deployments.

The syntax of the `using none` statement:

```bicep
using none
```

Place this statement at the beginning of a Bicep parameters file to signal that no specific template is referenced.

The primary benefit of `using none` in Bicep lies in scenarios where parameter files are generalized, shared, or dynamically integrated with templates. Common use cases include:

- **Centralized Parameter Repositories**

  Organizations often maintain standard parameter values - such as default regions, naming conventions, or global tags - used across multiple Bicep deployments. A Bicep parameters file with `using none` can act as a central store for these shared values, improving consistency and minimizing duplication. You can programmatically merge these parameters with template-specific values at deployment time.
  
  For example, a shared Bicep parameters file might define:

  ```bicepparam
  using none
  
  param location = 'westus2'
  param environmentTag = 'production'
  param projectName = 'myApp'
  ```

  Additionally, you can extend this parameters file. For more information, see [Extend parameters file](./bicep-extend.md).

- **Dynamic Generation and Runtime Integration**

  In CI/CD pipelines or automation scripts, you might create parameter files on-the-fly or associate them with templates at runtime. By omitting a fixed template reference, `using none` allows these files to remain flexible and adaptable to different deployment contexts.
  
When you specify `using none` in a Bicep parameter file, the compiler doesn't validate the parameters against a specific Bicep template. This means the compiler doesn't raise any compile-time warnings or errors for mismatched names or types due to the absence of a linked template. However, this decoupling applies only during authoring and compilation. At deployment time, Azure Resource Manager (ARM) still requires both a Bicep template and a parameter file. The ARM engine performs validation during deployment by resolving the parameters in the file against those defined in the target template.

## Next steps

- Learn about Bicep parameters files in [Create parameters files for Bicep deployment](./parameter-files.md).
- Learn about configuring aliases in _bicepconfig.json_ files in [Configure your Bicep environment](./bicep-config.md).
