---
title: Using statement
description: Describes how to use the using statement in Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 09/21/2023
---

# Using statement

The `using` statement in [Bicep parameter files](./parameter-files.md) ties the Bicep parameters file to a Bicep file, an ARM JSON template, or a Bicep module, or a template spec. A `using` declaration must be present in any Bicep parameters file.

The syntax:

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

  To use aliases defined in [bicepconfig.json](./bicep-config.md):

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

  ```bicep
  using 'ts:00000000-0000-0000-0000-000000000000/myResourceGroup/storageSpec:1.0'
  ```

  To use aliases defined in [bicepconfig.json](./bicep-config.md):

  ```bicep
  using 'ts/<alias>:<template-spec-name>:<tag>'
  ```

  For example:

  ```bicep
  using 'ts/myStorage:storageSpec:1.0'
  ```

## Next steps

- To learn about the Bicep data types, see [Data types](./data-types.md).
- To learn about the Bicep functions, see [Bicep functions](./bicep-functions.md).
- To learn about how to use the Kubernetes provider, see [Bicep extensibility Kubernetes provider](./bicep-extensibility-kubernetes-provider.md).
- To go through a Kubernetes provider tutorial, see [Quickstart - Deploy Azure applications to Azure Kubernetes Services by using Bicep Kubernetes provider.](../../aks/learn/quick-kubernetes-deploy-bicep-extensibility-kubernetes-provider.md).
