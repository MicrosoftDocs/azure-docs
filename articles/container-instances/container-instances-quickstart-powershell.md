---
title: Quickstart - Create your first Azure Container Instances container with PowerShell
description: In this quickstart, you use Azure PowerShell to deploy a Windows container in Azure Container Instances
services: container-instances
author: mmacy
manager: jeconnoc

ms.service: container-instances
ms.topic: quickstart
ms.date: 05/11/2018
ms.author: marsma
ms.custom: mvc
---

# Quickstart: Create your first container in Azure Container Instances

Azure Container Instances makes it easy to create and manage Docker containers in Azure, without having to provision virtual machines or adopt a higher-level service. In this quickstart, you create a Windows container in Azure and expose it to the internet with a fully qualified domain name (FQDN). This operation is completed in a single command. Within just a few moments, you can see the running application in your browser:

![App deployed using Azure Container Instances viewed in browser][qs-powershell-01]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.5 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

## Create a resource group

Create an Azure resource group with [New-AzureRmResourceGroup][New-AzureRmResourceGroup]. A resource group is a logical container into which Azure resources are deployed and managed.

 ```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a container

You can create a container by providing a name, a Docker image, and an Azure resource group to the [New-AzureRmContainerGroup][New-AzureRmContainerGroup] cmdlet. You can optionally expose the container to the internet with a DNS name label.

Execute the following command to launch a Nano Server container running Internet Information Services (IIS). The `-DnsNameLabel` value must be unique within the Azure region you create the instance, so you might need to modify this value to ensure uniqueness.

 ```azurepowershell-interactive
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/iis:nanoserver -OsType Windows -DnsNameLabel aci-demo-win
```

Within a few seconds, you should receive a response to your request. The container is initially in the **Creating** state, but it should start within a minute or two. You can check the deployment status by using the [Get-AzureRmContainerGroup][Get-AzureRmContainerGroup] cmdlet:

 ```azurepowershell-interactive
Get-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer
```

The container's provisioning state, fully qualified domain name (FQDN), and IP address appear in the cmdlet's output:

```console
PS Azure:\> Get-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer


ResourceGroupName        : myResourceGroup
Id                       : /subscriptions/<Subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.ContainerInstance/containerGroups/mycontainer
Name                     : mycontainer
Type                     : Microsoft.ContainerInstance/containerGroups
Location                 : eastus
Tags                     :
ProvisioningState        : Creating
Containers               : {mycontainer}
ImageRegistryCredentials :
RestartPolicy            : Always
IpAddress                : 52.226.19.87
DnsNameLabel             : aci-demo-win
Fqdn                     : aci-demo-win.eastus.azurecontainer.io
Ports                    : {80}
OsType                   : Windows
Volumes                  :
State                    : Pending
Events                   : {}
```

Once the container **ProvisioningState** moves to `Succeeded`, navigate to its `Fqdn` in your browser:

![IIS deployed using Azure Container Instances viewed in browser][qs-powershell-01]

## Clean up resources

When you're done with the container, remove it with the [Remove-AzureRmContainerGroup][Remove-AzureRmContainerGroup] cmdlet:

 ```azurepowershell-interactive
Remove-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer
```

## Next steps

In this quickstart, you created an Azure container instance from an image in the public Docker Hub registry. If you'd like to build a container image yourself and deploy it to Azure Container Instances from a private Azure container registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial](./container-instances-tutorial-prepare-app.md)

<!-- IMAGES -->
[qs-powershell-01]: ./media/container-instances-quickstart-powershell/qs-powershell-01.png

<!-- LINKS -->
[New-AzureRmResourceGroup]: /powershell/module/azurerm.resources/new-azurermresourcegroup
[New-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/new-azurermcontainergroup
[Get-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/get-azurermcontainergroup
[Remove-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/remove-azurermcontainergroup
