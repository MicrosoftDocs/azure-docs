---
title: Create private registry for Bicep module
description: Learn how to set up an Azure container registry for private Bicep modules
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 04/18/2023
---

# Create private registry for Bicep modules

To share [modules](modules.md) within your organization, you can create a private module registry. You publish modules to that registry and give read access to users who need to deploy the modules. After the modules are shared in the registries, you can reference them from your Bicep files. To contribute to the public module registry, see the [contribution guide](https://github.com/Azure/bicep-registry-modules/blob/main/CONTRIBUTING.md).

To work with module registries, you must have [Bicep CLI](./install.md) version **0.4.1008 or later**. To use with Azure CLI, you must also have version **2.31.0 or later**; to use with Azure PowerShell, you must also have version **7.0.0** or later.

### Training resources

If you would rather learn about parameters through step-by-step guidance, see [Share Bicep modules by using private registries](/training/modules/share-bicep-modules-using-private-registries).

## Configure private registry

A Bicep registry is hosted on [Azure Container Registry (ACR)](../../container-registry/container-registry-intro.md). Use the following steps to configure your registry for modules.

1. If you already have a container registry, you can use it. If you need to create a container registry, see [Quickstart: Create a container registry by using a Bicep file](../../container-registry/container-registry-get-started-bicep.md).

   You can use any of the available registry SKUs for the module registry. Registry [geo-replication](../../container-registry/container-registry-geo-replication.md) provides users with a local presence or as a hot-backup.

1. Get the login server name. You need this name when linking to the registry from your Bicep files. The format of the login server name is: `<registry-name>.azurecr.io`.

    # [PowerShell](#tab/azure-powershell)

    To get the login server name, use [Get-AzContainerRegistry](/powershell/module/az.containerregistry/get-azcontainerregistry).

    ```azurepowershell
    Get-AzContainerRegistry -ResourceGroupName "<resource-group-name>" -Name "<registry-name>"  | Select-Object LoginServer
    ```

    # [Azure CLI](#tab/azure-cli)

    To get the login server name, use [az acr show](/cli/azure/acr#az-acr-show).

    ```azurecli
    az acr show --resource-group <resource-group-name> --name <registry-name> --query loginServer
    ```

    ---

1. To publish modules to a registry, you must have permission to **push** an image. To deploy a module from a registry, you must have permission to **pull** the image. For more information about the roles that grant adequate access, see [Azure Container Registry roles and permissions](../../container-registry/container-registry-roles.md).

1. Depending on the type of account you use to deploy the module, you may need to customize which credentials are used. These credentials are needed to get the modules from the registry. By default, credentials are obtained from Azure CLI or Azure PowerShell. You can customize the precedence for getting the credentials in the **bicepconfig.json** file. For more information, see [Credentials for restoring modules](bicep-config-modules.md#configure-profiles-and-credentials).

> [!IMPORTANT]
> The private container registry is only available to users with the required access. However, it's accessed through the public internet. For more security, you can require access through a private endpoint. See [Connect privately to an Azure container registry using Azure Private Link](../../container-registry/container-registry-private-link.md).
> 
> The private container registry must have the policy `azureADAuthenticationAsArmPolicy` set to `enabled`. If `azureADAuthenticationAsArmPolicy` is set to `disabled`, you'll get a 401 (Unauthorized) error message when publishing modules. See [Azure Container Registry introduces the Conditional Access policy](../../container-registry/container-registry-enable-conditional-access-policy.md).

## Publish files to registry

After setting up the container registry, you can publish files to it. Use the [publish](bicep-cli.md#publish) command and provide any Bicep files you intend to use as modules. Specify the target location for the module in your registry.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Publish-AzBicepModule -FilePath ./storage.bicep -Target br:exampleregistry.azurecr.io/bicep/modules/storage:v1 -DocumentationUri https://www.contoso.com/exampleregistry.html
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az bicep publish --file storage.bicep --target br:exampleregistry.azurecr.io/bicep/modules/storage:v1 --documentationUri https://www.contoso.com/exampleregistry.html
```

---

## View files in registry

To see the published module in the portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **container registries**.
1. Select your registry.
1. Select **Repositories** from the left menu.
1. Select the module path (repository).  In the preceding example, the module path name is **bicep/modules/storage**.
1. Select the tag. In the preceding example, the tag is **v1**.
1. The **Artifact reference** matches the reference you'll use in the Bicep file.

   ![Bicep module registry artifact reference](./media/private-module-registry/bicep-module-registry-artifact-reference.png)

You're now ready to reference the file in the registry from a Bicep file. For examples of the syntax to use for referencing an external module, see [Bicep modules](modules.md).

---
## Working with Bicep Registry Files

When leveraging bicep files that are hosted in a remote registry it is important to understand how your local machine will interact with the regsitry. When you first declare the reference to the registry your local editor will attempt to communicate with the Azure Containter Registry and download a copy of the registry to your local cache.

The local cache is found in:

- On Windows

    ```path
    %USERPROFILE%\.bicep\br\<registry-name>.azurecr.io\<module-path\<tag>
    ```

- On Linux

    ```path
    /home/<username>/.bicep
    ```

- On Mac

    ```path
    ~/.bicep
    ```

Any changes made to the remote registry will not be recognized by your local machine until a `restore` has been ran with the specified file that includes the registry reference.

```azurecli
az bicep restore --file <bicep-file> [--force]
```

For more information refer to the [`restore` command.](bicep-cli.md#restore)


## Next steps

* To learn about modules, see [Bicep modules](modules.md).
* To configure aliases for a module registry, see [Add module settings in the Bicep config file](bicep-config-modules.md).
* For more information about publishing and restoring modules, see [Bicep CLI commands](bicep-cli.md).
