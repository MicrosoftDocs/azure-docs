---
title: Quickstart - Create a private Docker registry in Azure with PowerShell
description: Quickly learn to create a private Docker container registry with PowerShell.
services: container-registry
author: neilpeterson
manager: timlt

ms.service: container-registry
ms.topic: quickstart
ms.date: 03/03/2018
ms.author: nepeters
ms.custom: mvc
---

# Create an Azure Container Registry using PowerShell

Azure Container Registry is a managed Docker container registry service used for storing private Docker container images. This guide details creating an Azure Container Registry instance using PowerShell, pushing a container image into the registry and finally deploying the container from your registry into Azure Container Instances (ACI).

This quickstart requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

You must also have Docker installed locally. Docker provides packages that easily configure Docker on any [Mac][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

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

The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. In the following example, *myContainerRegistry007* is used. Update this to a unique value.

```powershell
$registry = New-AzureRMContainerRegistry -ResourceGroupName "myResourceGroup" -Name "myContainerRegistry007" -EnableAdminUser -Sku Basic
```

## Log in to ACR

Before pushing and pulling container images, you must log in to the ACR instance. First, use the [Get-AzureRmContainerRegistryCredential](/powershell/module/containerregistry/get-azurermcontainerregistrycredential) command to get the admin credentials for the ACR instance.

```powershell
$creds = Get-AzureRmContainerRegistryCredential -Registry $registry
```

Next, use the [docker login][docker-login] command to log in to the ACR instance.

```powershell
docker login $registry.LoginServer -u $creds.Username -p $creds.Password
```

The command returns `Login Succeeded` once completed. You might also see a security warning recommending the use of the `--password-stdin` parameter. While its use is outside the scope of this article, we recommend following this best practice. See the [docker login][docker-login] command reference for more information.

## Push image to ACR

To push an image to an Azure Container registry, you must first have an image. If needed, run the following command to pull a pre-created image from Docker Hub.

```powershell
docker pull microsoft/aci-helloworld
```

The image must be tagged with the ACR login server name. Use the [docker tag][docker-tag] command to do this. 

```powershell
$image = $registry.LoginServer + "/aci-helloworld:v1"
docker tag microsoft/aci-helloworld $image
```

Finally, use [docker push][docker-push] to push the image to ACR.

```powershell
docker push $image
```

## Deploy image to ACI
To deploy the image as a container instance in Azure Container Instances (ACI) first convert the registry credential to a PSCredential.

```powershell
$secpasswd = ConvertTo-SecureString $creds.Password -AsPlainText -Force
$pscred = New-Object System.Management.Automation.PSCredential($creds.Username, $secpasswd)
```

To deploy your container image from the container registry with 1 CPU core and 1 GB of memory, run the following command:

```powershell
New-AzureRmContainerGroup -ResourceGroup myResourceGroup -Name mycontainer -Image $image -Cpu 1 -MemoryInGB 1 -IpAddressType public -Port 80 -RegistryCredential $pscred
```

You should get an initial response back from Azure Resource Manager with details on your container. To monitor the status of your container and check to see when it is running repeat the [Get-AzureRmContainerGroup][Get-AzureRmContainerGroup] command. It should take less than a minute.

```powershell
(Get-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer).ProvisioningState
```

Example output: `Succeeded`

## View the application
Once the deployment to ACI is successful, retrieve the container's public IP address with the [Get-AzureRmContainerGroup][Get-AzureRmContainerGroup] command:

```powershell
(Get-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer).IpAddress
```

Example output: `"13.72.74.222"`

To see the running application, navigate to the public IP address in your favorite browser. It should look something like this:

![Hello world app in the browser][qs-portal-15]

## Clean up resources

When no longer needed, you can use the [Remove-AzureRmResourceGroup][Remove-AzureRmResourceGroup] command to remove the resource group, Azure Container Registry, and all Azure Container Instances.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

In this quickstart, you created an Azure Container Registry with the Azure CLI, and launched an instance of it in Azure Container Instances. Continue to the Azure Container Instances tutorial for a deeper look at ACI.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial](../container-instances/container-instances-tutorial-prepare-app.md)

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- Links - internal -->
[Get-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/get-azurermcontainergroup
[Remove-AzureRmResourceGroup]: /powershell/module/azurerm.resources/remove-azurermresourcegroup

<!-- IMAGES> -->
[qs-portal-15]: ./media/container-registry-get-started-portal/qs-portal-15.png
