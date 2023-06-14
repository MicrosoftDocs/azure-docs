---
title: Quickstart - Create registry - PowerShell
description: Quickly learn to create a private Docker registry in Azure Container Registry with PowerShell
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
ms.topic: quickstart
ms.custom: devx-track-azurepowershell, mvc, mode-api
---

# Quickstart: Create a private container registry using Azure PowerShell

Azure Container Registry is a private registry service for building, storing, and managing container images and related artifacts. In this quickstart, you create an Azure container registry instance with Azure  PowerShell. Then, use Docker commands to push a container image into the registry, and finally pull and run the image from your registry.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

This quickstart requires Azure PowerShell module. Run `Get-Module -ListAvailable Az` to determine your installed version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

You must also have Docker installed locally. Docker provides packages for [macOS][docker-mac], [Windows][docker-windows], and [Linux][docker-linux] systems.

Because the Azure Cloud Shell doesn't include all required Docker components (the `dockerd` daemon), you can't use the Cloud Shell for this quickstart.

## Sign in to Azure

Sign in to your Azure subscription with the [Connect-AzAccount][Connect-AzAccount] command, and follow the on-screen directions.

```powershell
Connect-AzAccount
```

## Create resource group

Once you're authenticated with Azure, create a resource group with [New-AzResourceGroup][New-AzResourceGroup]. A resource group is a logical container in which you deploy and manage your Azure resources.

```powershell
New-AzResourceGroup -Name myResourceGroup -Location EastUS
```

## Create container registry

Next, create a container registry in your new resource group with the [New-AzContainerRegistry][New-AzContainerRegistry] command.

The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. The following example creates a registry named "mycontainerregistry." Replace *mycontainerregistry* in the following command, then run it to create the registry:

```powershell
$registry = New-AzContainerRegistry -ResourceGroupName "myResourceGroup" -Name "mycontainerregistry" -EnableAdminUser -Sku Basic
```

[!INCLUDE [container-registry-quickstart-sku](../../includes/container-registry-quickstart-sku.md)]

## Log in to registry

Before pushing and pulling container images, you must log in to your registry with the [Connect-AzContainerRegistry][connect-azcontainerregistry] cmdlet. The following example uses the same credentials you logged in with when authenticating to Azure with the `Connect-AzAccount` cmdlet.

> [!NOTE]
> In the following example, the value of `$registry.Name` is the resource name, not the fully qualified registry name.

```powershell
Connect-AzContainerRegistry -Name $registry.Name
```

The command returns `Login Succeeded` once completed.

[!INCLUDE [container-registry-quickstart-docker-push](../../includes/container-registry-quickstart-docker-push.md)]

[!INCLUDE [container-registry-quickstart-docker-pull](../../includes/container-registry-quickstart-docker-pull.md)]

## Clean up resources

Once you're done working with the resources you created in this quickstart, use the [Remove-AzResourceGroup][Remove-AzResourceGroup] command to remove the resource group, the container registry, and the container images stored there:

```powershell
Remove-AzResourceGroup -Name myResourceGroup
```

## Next steps

In this quickstart, you created an Azure Container Registry with Azure PowerShell, pushed a container image, and pulled and ran the image from the registry. Continue to the Azure Container Registry tutorials for a deeper look at ACR.

> [!div class="nextstepaction"]
> [Azure Container Registry tutorials][container-registry-tutorial-prepare-registry]

> [!div class="nextstepaction"]
> [Azure Container Registry Tasks tutorials][container-registry-tutorial-quick-task]

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- Links - internal -->
[Connect-AzAccount]: /powershell/module/az.accounts/connect-azaccount
[Get-Module]: /powershell/module/microsoft.powershell.core/get-module
[New-AzContainerRegistry]: /powershell/module/az.containerregistry/New-AzContainerRegistry
[New-AzResourceGroup]: /powershell/module/az.resources/new-azresourcegroup
[Remove-AzResourceGroup]: /powershell/module/az.resources/remove-azresourcegroup
[container-registry-tutorial-quick-task]: container-registry-tutorial-quick-task.md
[container-registry-skus]: container-registry-skus.md
[container-registry-tutorial-prepare-registry]: container-registry-tutorial-prepare-registry.md
[connect-azcontainerregistry]: /powershell/module/az.containerregistry/connect-azcontainerregistry
