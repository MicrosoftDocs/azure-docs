---
title: Quickstart - Create a private Docker registry in Azure with PowerShell
description: Quickly learn to create a private Docker container registry with PowerShell.
services: container-registry
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: tysonn


ms.service: container-registry
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/07/2017
ms.author: nepeters
---

# Create an Azure Container Registry using PowerShell

Azure Container Registry is a managed Docker container registry service used for storing private Docker container images. This guide details creating an Azure Container Registry instance using PowerShell.

This quickstart requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

You must also have Docker installed locally. Docker provides packages that easily configure Docker on any [Mac](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), or [Linux](https://docs.docker.com/engine/installation/#supported-platforms) system.

## Log in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Create resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```powershell
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a container registry

Create an ACR instance using the [New-AzureRMContainerRegistry](/powershell/module/containerregistry/New-AzureRMContainerRegistry) command.

The name of the registry **must be unique**. In the following example *myContainerRegistry007* is used. Update this to a unique value.

```PowerShell
$Registry = New-AzureRMContainerRegistry -ResourceGroupName "MyResourceGroup" -Name "myContainerRegistry007" -EnableAdminUser -Sku Basic
```

## Log in to ACR

Before pushing and pulling container images, you must log in to the ACR instance. First, use the [Get-AzureRmContainerRegistryCredential](/powershell/module/containerregistry/get-azurermcontainerregistrycredential) command to get the admin credentials for the ACR instance.

```powershell
$creds = Get-AzureRmContainerRegistryCredential -Registry $Registry
```

Next, use the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command to log in to the ACR instance.

```bash
docker login $Registry.LoginServer -u $creds.Username -p $creds.Password
```

The command returns a 'Login Succeeded' message once completed.

## Push image to ACR

To push an image to an Azure Container registry, you must first have an image. If needed, run the following command to pull a pre-created image from Docker Hub.

```bash
docker pull microsoft/aci-helloworld
```

The image must be tagged with the ACR login server name. Run the [Get-AzureRmContainerRegistry](/powershell/module/containerregistry/Get-AzureRmContainerRegistry) command to return the login server name of the ACR instance.

```powershell`
Get-AzureRmContainerRegistry | Select Loginserver
```

Tag the image using the [docker tag](https://docs.docker.com/engine/reference/commandline/tag/) command. Replace *acrLoginServer* with the login server name of your ACR instance.

```bash
docker tag microsoft/aci-helloworld <acrLoginServer>/aci-helloworld:v1
```

Finally, use [docker push](https://docs.docker.com/engine/reference/commandline/push/) to push the images to the ACR instance. Replace *acrLoginServer* with the login server name of your ACR instance.

```bash
docker push <acrLoginServer>/aci-helloworld:v1
```

## Clean up resources

When no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to remove the resource group, ACR instance, and all container images.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

In this quickstart, you created an Azure Container Registry with the Azure CLI. If you would like to use Azure Container Registry with Azure Container Instances, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial](../container-instances/container-instances-tutorial-prepare-app.md)