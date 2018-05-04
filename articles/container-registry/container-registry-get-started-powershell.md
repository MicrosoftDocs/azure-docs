---
title: Quickstart - Create a private Docker registry in Azure with PowerShell
description: Quickly learn to create a private Docker container registry in Azure with PowerShell.
services: container-registry
author: marsma
manager: jeconnoc

ms.service: container-registry
ms.topic: quickstart
ms.date: 05/08/2018
ms.author: marsma
ms.custom: mvc
---

# Quickstart: Create an Azure Container Registry using PowerShell

Azure Container Registry is a managed, private Docker container registry service for building, storing, and serving Docker container images. In this quickstart, you learn how to create an Azure container registry using PowerShell. After you create the registry, you push a container image to it, then deploy the container from your registry into Azure Container Instances (ACI).

This quickstart requires Azure PowerShell module version 5.7.0 or later. Run [Get-Module -ListAvailable AzureRM][Get-Module] to determine your installed version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

You must also have Docker installed locally. Docker provides packages for [macOS][docker-mac], [Windows][docker-windows], and [Linux][docker-linux] systems.

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

Now, create your registry with the [New-AzureRMContainerRegistry][New-AzureRMContainerRegistry] command.

The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. The following example creates a registry named *myContainerRegistry007*; replace "myContainerRegistry007" with a name of your choosing.

```powershell
$registry = New-AzureRMContainerRegistry -ResourceGroupName "myResourceGroup" -Name "myContainerRegistry007" -EnableAdminUser -Sku Basic
```

## Log in to registry

Before pushing and pulling container images, you must log in to your registry. Use the [Get-AzureRmContainerRegistryCredential][Get-AzureRmContainerRegistryCredential] command to first get the admin credentials for the registry:

```powershell
$creds = Get-AzureRmContainerRegistryCredential -Registry $registry
```

Next, run [docker login][docker-login] to log in to the registry:

```powershell
$creds.Password | docker login $registry.LoginServer -u $creds.Username --password-stdin
```

A successful login operation returns `Login Succeeded`:

```console
PS Azure:\> $creds.Password | docker login $registry.LoginServer -u $creds.Username --password-stdin
Login Succeeded
```

## Push image to registry

Now that you're logged in to the registry, you can push container images to it. To get an image you can push to your registry, pull the public [aci-helloworld][aci-helloworld-image] image from Docker Hub. The [aci-helloworld][aci-helloworld-github] image is a small Node.js application that serves a static HTML page showing the Azure Container Instances logo.

```powershell
docker pull microsoft/aci-helloworld
```

As the image is pulled, output is similar to the following:

```console
PS Azure:\> docker pull microsoft/aci-helloworld
Using default tag: latest
latest: Pulling from microsoft/aci-helloworld
88286f41530e: Pull complete
84f3a4bf8410: Pull complete
d0d9b2214720: Pull complete
3be0618266da: Pull complete
9e232827e52f: Pull complete
b53c152f538f: Pull complete
Digest: sha256:a3b2eb140e6881ca2c4df4d9c97bedda7468a5c17240d7c5d30a32850a2bc573
Status: Downloaded newer image for microsoft/aci-helloworld:latest
```

Before you can push an image to your Azure container registry, you must tag it with the fully qualified domain name (FQDN) of your registry. The FQDN of Azure container registries are in the format *\<registry-name\>.azurecr.io*.

Populate a variable with the full image tag. Include the login server, repository name ("aci-helloworld"), and image version ("v1"):

```powershell
$image = $registry.LoginServer + "/aci-helloworld:v1"
```

Now, tag the image using [docker tag][docker-tag]:

```powershell
docker tag microsoft/aci-helloworld $image
```

And finally, use [docker push][docker-push] to push the image to your registry:

```powershell
docker push $image
```

As the Docker client pushes your image, output appears similar to:

```console
PS Azure:\> docker push $image
The push refers to repository [myContainerRegistry007.azurecr.io/aci-helloworld]
31ba1ebd9cf5: Pushed
cd07853fe8be: Pushed
73f25249687f: Pushed
d8fbd47558a8: Pushed
44ab46125c35: Pushed
5bef08742407: Pushed
v1: digest: sha256:565dba8ce20ca1a311c2d9485089d7ddc935dd50140510050345a1b0ea4ffa6e size: 1576

```

## Deploy image to ACI

Congratulations! You've just pushed your first container image to your registry. Now, deploy it directly from your registry to Azure Container Instances to see the container running on Azure.

First, convert the registry credential to a *PSCredential*. The `New-AzureRmContainerGroup` command, which you use to create the container instance, requires it in this format.

```powershell
$secpasswd = ConvertTo-SecureString $creds.Password -AsPlainText -Force
$pscred = New-Object System.Management.Automation.PSCredential($creds.Username, $secpasswd)
```

Now, deploy the container to ACI with [New-AzureRmContainerGroup][New-AzureRmContainerGroup]. The following command deploys the container from your registry with 1 CPU core, 1 GB of memory, and a DNS name label of "aci-demo":

```powershell
New-AzureRmContainerGroup -ResourceGroup myResourceGroup -Name "mycontainer" -Image $image -RegistryCredential $pscred -Cpu 1 -MemoryInGB 1 -DnsNameLabel "aci-demo"
```

You should get an initial response from Azure with details on your container, and its state is at first "Pending":

```console
PS Azure:\> New-AzureRmContainerGroup -ResourceGroup myResourceGroup -Name "mycontainer" -Image $image -RegistryCredential $pscred -Cpu 1 -MemoryInGB 1 -DnsNameLabel "aci-demo"
ResourceGroupName        : myResourceGroup
Id                       : /subscriptions/<subscriptionID>/resourceGroups/myResourceGroup/providers/Microsoft.ContainerInstance/containerGroups/mycontainer
Name                     : mycontainer
Type                     : Microsoft.ContainerInstance/containerGroups
Location                 : eastus
Tags                     :
ProvisioningState        : Creating
Containers               : {mycontainer}
ImageRegistryCredentials : {myContainerRegistry007}
RestartPolicy            : Always
IpAddress                : 40.117.255.198
DnsNameLabel             : aci-demo
Fqdn                     : aci-demo.eastus.azurecontainer.io
Ports                    : {80}
OsType                   : Linux
Volumes                  :
State                    : Pending
Events                   : {}
```

To monitor its status and determing when it's running, run the [Get-AzureRmContainerGroup][Get-AzureRmContainerGroup] command a few times. It should take less than a minute.

```powershell
(Get-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer).ProvisioningState
```

Here, you can see the container's ProvisioningState is at first *Creating*, and then moves to the *Succeeded* state once it's up and running:

```console
PS Azure:\> (Get-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer).ProvisioningState
Creating
PS Azure:\> (Get-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer).ProvisioningState
Succeeded
```

## View running application

Once the deployment to ACI has succeeded and your container is up and running, navigate to its fully qualified domain name (FQDN) in your browser to see the app running in Azure.

It appears in the output of the previous step, but you can also get the FQDN for your container with [Get-AzureRmContainerGroup][Get-AzureRmContainerGroup]:

```powershell
PS Azure:\> (Get-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer).Fqdn
aci-demo.eastus.azurecontainer.io
```

With the FQDN in-hand, view the app in your browser:

![Hello world app in the browser][qs-psh-01-running-app]

Congratulations! You've got a container running an application in Azure, deployed directly from a container image in your private Azure container registry.

## Clean up resources

Once you're done working with the resources you created in this quicktart, use the [Remove-AzureRmResourceGroup][Remove-AzureRmResourceGroup] command to remove the resource group, the container registry, and the container instance:

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

In this quickstart, you created an Azure Container Registry with the Azure CLI, and launched an instance of it in Azure Container Instances. Continue to the Azure Container Instances tutorial for a deeper look at ACI.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial](../container-instances/container-instances-tutorial-prepare-app.md)

<!-- LINKS - external -->
[aci-helloworld-github]: https://github.com/Azure-Samples/aci-helloworld
[aci-helloworld-image]: https://hub.docker.com/r/microsoft/aci-helloworld/
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- Links - internal -->
[Connect-AzureRmAccount]: /powershell/module/azurerm.profile/connect-azurermaccount
[Get-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/get-azurermcontainergroup
[Get-AzureRmContainerRegistryCredential]: /powershell/module/azurerm.containerregistry/get-azurermcontainerregistrycredential
[Get-Module]: /powershell/module/microsoft.powershell.core/get-module
[New-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/new-azurermcontainergroup
[New-AzureRMContainerRegistry]: /powershell/module/containerregistry/New-AzureRMContainerRegistry
[New-AzureRmResourceGroup]: /powershell/module/azurerm.resources/new-azurermresourcegroup
[Remove-AzureRmResourceGroup]: /powershell/module/azurerm.resources/remove-azurermresourcegroup

<!-- IMAGES> -->
[qs-psh-01-running-app]: ./media/container-registry-get-started-powershell/qs-psh-01-running-app.png
