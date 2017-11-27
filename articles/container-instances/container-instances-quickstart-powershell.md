---
title: Quickstart - Create your first Azure Container Instances container with PowerShell
description: Get started with Azure Container Instances by creating a Windows container instance with PowerShell.
services: container-instances
documentationcenter: ''
author: mmacy
manager: timlt
editor: ''
tags:
keywords: ''

ms.assetid:
ms.service: container-instances
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/15/2017
ms.author: marsma
ms.custom: mvc
---

# Create your first container in Azure Container Instances

Azure Container Instances makes it easy to create and manage Docker containers in Azure, without having to provision virtual machines or adopt a higher-level service.

In this quickstart, you create a Windows container in Azure and expose it to the internet with a public IP address. This operation is completed in a single command. Within just a few moments, you can see the running application your browser:

![App deployed using Azure Container Instances viewed in browser][qs-powershell-01]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure.

## Create resource group

Create an Azure resource group with [New-AzureRmResourceGroup][New-AzureRmResourceGroup]. A resource group is a logical container into which Azure resources are deployed and managed.

 ```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a container

You can create a container by providing a name, a Docker image, and an Azure resource group to the [New-AzureRmContainerGroup][New-AzureRmContainerGroup] cmdlet. You can optionally expose the container to the internet with a public IP address. In this case, we'll use a Windows Nano Server container running Internet Information Services (IIS).

 ```azurepowershell-interactive
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/iis:nanoserver -OsType Windows -IpAddressType Public
```

Within a few seconds, you'll get a response to your request. Initially, the container is in the **Creating** state, but it should start within a minute or two. You can check the status using the [Get-AzureRmContainerGroup][Get-AzureRmContainerGroup] cmdlet:

 ```azurepowershell-interactive
Get-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer
```

The container's provisioning state and IP address appear in the cmdlet's output:

```
ResourceGroupName        : myResourceGroup
Id                       : /subscriptions/12345678-1234-1234-1234-12345678abcd/resourceGroups/myResourceGroup/providers/Microsoft.ContainerInstance/containerGroups/mycontainer
Name                     : mycontainer
Type                     : Microsoft.ContainerInstance/containerGroups
Location                 : eastus
Tags                     :
ProvisioningState        : Creating
Containers               : {mycontainer}
ImageRegistryCredentials :
RestartPolicy            :
IpAddress                : 40.71.248.73
Ports                    : {80}
OsType                   : Windows
Volumes                  :
```

Once the container **ProvisioningState** moves to `Succeeded`, you can reach it in your browser using the IP address provided.

![IIS deployed using Azure Container Instances viewed in browser][qs-powershell-01]

## Delete the container

When you are done with the container, you can remove it using the [Remove-AzureRmContainerGroup][Remove-AzureRmContainerGroup] cmdlet:

 ```azurepowershell-interactive
Remove-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer
```

## Next steps

In this quickstart, you started a pre-built Windows container in Azure Container Instances. If you'd like to try building a container yourself and deploying it to Azure Container Instances using the Azure Container Registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial](./container-instances-tutorial-prepare-app.md)

<!-- LINKS -->
[New-AzureRmResourceGroup]: /powershell/module/azurerm.resources/new-azurermresourcegroup
[New-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/new-azurermcontainergroup
[Get-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/get-azurermcontainergroup
[Remove-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/remove-azurermcontainergroup

<!-- IMAGES -->
[qs-powershell-01]: ./media/container-instances-quickstart-powershell/qs-powershell-01.png