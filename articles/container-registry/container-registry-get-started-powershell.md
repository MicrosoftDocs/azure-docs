---
title: Quickstart - Create a private Docker registry in Azure - PowerShell
description: Quickly learn to create a private Docker container registry in Azure with PowerShell.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: quickstart
ms.date: 01/22/2019
ms.author: danlep
ms.custom: "seodec18, mvc"
---

# Quickstart: Create a private container registry using Azure PowerShell

Azure Container Registry is a managed, private Docker container registry service for building, storing, and serving Docker container images. In this quickstart, you learn how to create an Azure container registry using PowerShell. Then, use Docker commands to push a container image into the registry, and finally pull and run the image from your registry.

## Prerequisites

This quickstart requires Azure PowerShell module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to determine your installed version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/azurerm/install-azurerm-ps).

You must also have Docker installed locally. Docker provides packages for [macOS][docker-mac], [Windows][docker-windows], and [Linux][docker-linux] systems.

Because the Azure Cloud Shell doesn't include all required Docker components (the `dockerd` daemon), you can't use the Cloud Shell for this quickstart.

## Sign in to Azure

Sign in to your Azure subscription with the [Connect-AzureRmAccount][Connect-AzureRmAccount] command, and follow the on-screen directions.

```powershell
Connect-AzureRmAccount
```

## Create resource group

Once you're authenticated with Azure, create a resource group with [New-AzureRmResourceGroup][New-AzureRmResourceGroup]. A resource group is a logical container in which you deploy and manage your Azure resources.

```powershell
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

## Create container registry

Next, create a container registry in your new resource group with the [New-AzureRMContainerRegistry][New-AzureRMContainerRegistry] command.

The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. The following example creates a registry named "myContainerRegistry007." Replace *myContainerRegistry007* in the following command, then run it to create the registry:

```powershell
$registry = New-AzureRMContainerRegistry -ResourceGroupName "myResourceGroup" -Name "myContainerRegistry007" -EnableAdminUser -Sku Basic
```

In this quickstart you create a *Basic* registry, which is a cost-optimized option for developers learning about Azure Container Registry. For details on available service tiers, see [Container registry SKUs][container-registry-skus].

## Log in to registry

Before pushing and pulling container images, you must log in to your registry. In production scenarios you should use an individual identity or service principal for container registry access, but to keep this quickstart brief, enable the admin user on your registry with the [Get-AzureRmContainerRegistryCredential][Get-AzureRmContainerRegistryCredential] command:

```powershell
$creds = Get-AzureRmContainerRegistryCredential -Registry $registry
```

Next, run [docker login][docker-login] to log in:

```powershell
$creds.Password | docker login $registry.LoginServer -u $creds.Username --password-stdin
```

The command returns `Login Succeeded` once completed.

[!INCLUDE [container-registry-quickstart-docker-push](../../includes/container-registry-quickstart-docker-push.md)]

[!INCLUDE [container-registry-quickstart-docker-pull](../../includes/container-registry-quickstart-docker-pull.md)]

## Clean up resources

Once you're done working with the resources you created in this quickstart, use the [Remove-AzureRmResourceGroup][Remove-AzureRmResourceGroup] command to remove the resource group, the container registry, and the container images stored there:

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

In this quickstart, you created an Azure Container Registry with Azure PowerShell, pushed a container image, and pulled and ran the image from the registry. Continue to the Azure Container Registry tutorials for a deeper look at ACR.

> [!div class="nextstepaction"]
> [Azure Container Registry tutorials][container-registry-tutorial-quick-task]

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- Links - internal -->
[Connect-AzureRmAccount]: /powershell/module/azurerm.profile/connect-azurermaccount
[Get-AzureRmContainerRegistryCredential]: /powershell/module/azurerm.containerregistry/get-azurermcontainerregistrycredential
[Get-Module]: /powershell/module/microsoft.powershell.core/get-module
[New-AzureRMContainerRegistry]: /powershell/module/azurerm.containerregistry/New-AzureRMContainerRegistry
[New-AzureRmResourceGroup]: /powershell/module/azurerm.resources/new-azurermresourcegroup
[Remove-AzureRmResourceGroup]: /powershell/module/azurerm.resources/remove-azurermresourcegroup
[container-registry-tutorial-quick-task]: container-registry-tutorial-quick-task.md
[container-registry-skus]: container-registry-skus.md