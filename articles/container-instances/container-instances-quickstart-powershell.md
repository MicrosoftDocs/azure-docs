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
ms.date: 09/19/2017
ms.author: marsma
ms.custom:
---

# Create your first container in Azure Container Instances

Azure Container Instances makes it easy to create and manage Docker containers in Azure, without having to provision virtual machines or adopt a higher-level service. In this quick start, you create a container in Azure and expose it to the internet with a public IP address. This operation is completed in a single command. Within just a few moments, you'll see this in your browser:

![App deployed using Azure Container Instances viewed in browser][qs-powershell-01]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This quick start requires the Azure PowerShell module version 4.4 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

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

## Create a container

You can create a container by providing a name, a Docker image, and an Azure resource group. You can optionally expose the container to the internet with a public IP address. In this case, we'll use a Windows Nano Server container running Internet Information Services (IIS).

```powershell
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/iis:nanoserver -OsType Windows -IpAddressType Public
```

Within a few seconds you'll get a response to your request. Initially, the container will be in a **Creating** state, but it should start within a minute or two. You can check the status using the `Get-AzureRmContainerGroup` cmdlet:

```powershell
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

When you are done with the container, you can remove it using the `Remove-AzureRmContainerGroup` cmdlet:

```azurecli-interactive
Remove-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer
```

## Next steps

In this Quickstart, you started a pre-built Windows container in Azure Container Instances. If you'd like to try building a container yourself and deploying it to Azure Container Instances using the Azure Container Registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorials](./container-instances-tutorial-prepare-app.md)

<!-- IMAGES -->
[qs-powershell-01]: ./media/container-instances-quickstart-powershell/qs-powershell-01.png