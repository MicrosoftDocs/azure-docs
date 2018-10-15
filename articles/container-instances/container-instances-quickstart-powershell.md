---
title: Quickstart - Run an application in Azure Container Instances
description: In this quickstart, you use Azure PowerShell to deploy an application running in a Docker container to Azure Container Instances
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: quickstart
ms.date: 10/02/2018
ms.author: danlep
ms.custom: mvc
---

# Quickstart: Run an application in Azure Container Instances

Use Azure Container Instances to run Docker containers in Azure with simplicity and speed. You don't need to deploy virtual machines or use a full container orchestration platform like Kubernetes. In this quickstart, you use the Azure portal to create a Windows container in Azure and make its application available with a fully qualified domain name (FQDN). A few seconds after you execute a single deployment command, you can browse to the running application:

![App deployed to Azure Container Instances viewed in browser][qs-powershell-01]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.5 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

## Create a resource group

Azure container instances, like all Azure resources, must be deployed into a resource group. Resource groups allow you to organize and manage related Azure resources.

First, create a resource group named *myResourceGroup* in the *eastus* location with the following [New-AzureRmResourceGroup][New-AzureRmResourceGroup] command:

 ```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a container

Now that you have a resource group, you can run a container in Azure. To create a container instance with Azure PowerShell, provide a resource group name, container instance name, and Docker container image to the [New-AzureRmContainerGroup][New-AzureRmContainerGroup] cmdlet. You can expose your containers to the internet by specifying one or more ports to open, a DNS name label, or both. In this quickstart, you deploy a container with a DNS name label that hosts Internet Information Services (IIS) running in Nano Server.

Execute the following command to start a container instance. The `-DnsNameLabel` value must be unique within the Azure region you create the instance. If you receive a "DNS name label not available" error message, try a different DNS name label.

 ```azurepowershell-interactive
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/iis:nanoserver -OsType Windows -DnsNameLabel aci-demo-win
```

Within a few seconds, you should receive a response from Azure. The container's `ProvisioningState` is initially **Creating**, but should move to **Succeeded** within a minute or two. Check the deployment state with the [Get-AzureRmContainerGroup][Get-AzureRmContainerGroup] cmdlet:

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

Once the container's `ProvisioningState` is **Succeeded**, navigate to its `Fqdn` in your browser. If you see a web page similar to the following, congratulations! You've successfully deployed an application running in a Docker container to Azure.

![IIS deployed using Azure Container Instances viewed in browser][qs-powershell-01]

## Clean up resources

When you're done with the container, remove it with the [Remove-AzureRmContainerGroup][Remove-AzureRmContainerGroup] cmdlet:

 ```azurepowershell-interactive
Remove-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer
```

## Next steps

In this quickstart, you created an Azure container instance from an image in the public Docker Hub registry. If you'd like to build a container image and deploy it from a private Azure container registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial](./container-instances-tutorial-prepare-app.md)

<!-- IMAGES -->
[qs-powershell-01]: ./media/container-instances-quickstart-powershell/qs-powershell-01.png

<!-- LINKS -->
[New-AzureRmResourceGroup]: /powershell/module/azurerm.resources/new-azurermresourcegroup
[New-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/new-azurermcontainergroup
[Get-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/get-azurermcontainergroup
[Remove-AzureRmContainerGroup]: /powershell/module/azurerm.containerinstance/remove-azurermcontainergroup
