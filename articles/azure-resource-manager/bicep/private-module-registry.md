---
title: Create private registry for Bicep module
description: Learn how to set up an Azure container registry for private Bicep modules
ms.topic: conceptual
ms.date: 10/12/2021
---

# Use private registry for Bicep modules (Preview)

To share [modules](modules.md) within your organization, you can create a private module registry. Publish modules to that registry and give read access to users who need to deploy the modules. After the modules are shared in the registries, you can reference them from your Bicep files.

## Install

The Bicep Registry can be found in the [nightly builds](https://github.com/Azure/bicep/blob/main/docs/installing-nightly.md). Install both Bicep CLI and Visual Studio Code extension.

## Set up private registry

A Bicep registry is hosted on [Azure Container Registry (ACR)](../../container-registry/container-registry-intro.md). To create a container registry, see [Quickstart: Create a container registry by using a Bicep file](../../container-registry/container-registry-get-started-bicep.md). Any of the available registry SKUs can be used for Bicep module registry. Registry [geo-replication](../../container-registry/container-registry-geo-replication.md) provides users with a local presence or as a hot-backup.

Login server name is used to access the registry.  To get the login server name:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzContainerRegistry -ResourceGroupName "<resource-group-name>" -Name "<registry-name>"
```

# [CLI](#tab/azure-cli)

```azurecli
az acr list --resource-group <resource-group-name>
```

---

The format of the login server name is: `<registry-name>.azurecr.io`.

### Configure container registry permissions

To publish modules to a registry, you must have permission to push an image. To deploy a module from a registry, you have permission to pull the image. For more information about the roles that grant adequate access, see [Azure Container Registry roles and permissions](../../container-registry/container-registry-roles.md).



*** defaultAzureCredential class

*** Auth configure in the bicep configuration file (not ready yet)

To use a private endpoint to restrict access, see [Connect privately to an Azure container registry using Azure Private Link](../../container-registry/container-registry-private-link.md).


## From Bicep CLI

To see the published module by using the portal:

1. sign in to the [Azure portal](https://portal.azure.com).
1. Search on **container registries**.
1. Select your registry.
1. Select **Repositories** from the left menu.
1. Select the module path (repository).  In the preceding example, the module path name is **bicep/modules/storage**.
1. Select the tag. In the preceding example, the tag is **v1**.
1. The **Artifact reference** shall match the module reference.

![Bicep module registry artifact reference](./media/module-registry/bicep-module-registry-artifact-reference.png)

The publish process creates the repository and the tag.

> [!WARNING]
> Publish to the same registry with the same module reference overwrites the old module. It is recommended to create a new module version each time you publish a new module instead of overwriting an existing module in the registry.




## From Visual Studio Code

When you reference an external component from a Bicep file in Visual Studio code, the Bicep extension automatically calls [bicep restore](bicep-cli.md#restore) to restore the external module from the module registry to the local module cache, so you can take advantage of autocompletion and type checking.

To define a resource referencing an external module in a Bicep file, use the `resource` keyword followed by a symbolic name and the external reference.

```bicep
resource stg '<external-module-reference>' = {
  ...
}
```

See [Bciep modules](modules.md) for the syntax of adding external modules.

After the single quote for the module reference, add = and a space. You're presented with options for adding properties to the resource. Select **required-properties**. If you don't see the **required-properties** option in the list, it is because the external module has not been restored to the local module cache. It takes a few moments to restore the external module.

![Bicep module registry vscode required properties](./media/module-registry/bicep-module-registry-vscode-required-properties.png)

The **required-properties** option adds all of the properties for external module that are required for deployment.

## Next steps

To learn about all of the Bicep CLI commands, see [Bicep CLI commands](bicep-cli.md).
