---
title: Quickstart - Deploy Docker container to container instance - PowerShell
description: In this quickstart, you use Azure PowerShell to quickly deploy a containerized web app that runs in an isolated Azure container instance
ms.topic: quickstart
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 04/26/2024
ms.custom: devx-track-azurepowershell, mvc, mode-api
---

# Quickstart: Deploy a container instance in Azure using Azure PowerShell

Use Azure Container Instances to run serverless Docker containers in Azure with simplicity and speed. Deploy an application to a container instance on-demand when you don't need a full container orchestration platform like Azure Kubernetes Service.

In this quickstart, you use Azure PowerShell to deploy an isolated Windows container and make its application available with a fully qualified domain name (FQDN) and port. A few seconds after you execute a single deployment command, you can browse to the application running in the container:

![App deployed to Azure Container Instances viewed in browser][./media/container-instances-quickstart/view-an-application-running-in-an-azure-container-instance.png]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

Azure container instances, like all Azure resources, must be deployed into a resource group. Resource groups allow you to organize and manage related Azure resources.

First, create a resource group named *myResourceGroup* in the *eastus* location with the following [New-AzResourceGroup][New-AzResourceGroup] command:

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a port for your container instance

You can expose your containers to the internet by specifying one or more ports to open, a DNS name label, or both. In this quickstart, you deploy a container with a DNS name label so it's publicly reachable. In this guide, we'll do both, but first, you need to create a port object in PowerShell for your container instance to use.

```azurepowershell-interactive
$port = New-AzContainerInstancePortObject -Port 80 -Protocol TCP
```

## Create a container group

Now that you have a resource group and port, you can run a container that's exposed to the internet in Azure. To create a container instance with Azure PowerShell, you'll first need to create a `ContainerInstanceObject` by providing a name, image, and port for the container. In this quickstart, you use the public `mcr.microsoft.com/azuredocs/aci-helloworld` image.

```azurepowershell-interactive
New-AzContainerInstanceObject -Name myContainer -Image mcr.microsoft.com/azuredocs/aci-helloworld -Port @($port)
```

Next, use the [New-AzContainerGroup][New-AzContainerGroup] cmdlet. You need to provide a name for the container group, your resource group's name, a location for the container group, the container instance you just created, the operating system type, and a unique IP address DNS name label.

Execute a command similar to the following to start a container instance. Set a `-IPAddressDnsNameLabel` value that's unique within the Azure region where you create the instance. If you receive a "DNS name label not available" error message, try a different DNS name label.

```azurepowershell-interactive
$containerGroup = New-AzContainerInstanceObject -ResourceGroupName myResourceGroup -Name myContainerGroup -Location EastUS -Container myContainer -OsType Windows -IPAddressDnsNameLabel aci-quickstart-win -IpAddressType Public -IPAddressPort @($port)
```

Within a few seconds, you should receive a response from Azure. The container's `ProvisioningState` is initially **Creating**, but should move to **Succeeded** within a minute or two. Check the deployment state with the [Get-AzContainerGroup][Get-AzContainerGroup] cmdlet:

```azurepowershell-interactive
Get-AzContainerGroup -ResourceGroupName myResourceGroup -Name myContainerGroup
```

You can also print out the $containerGroup object and filter the table for the container's provisioning state, fully qualified domain name (FQDN), and IP address.

```azurepowershell-interactive
$containerGroup | Format-Table InstanceViewState, IPAddressFqdn, IPAddressIP
```

The container's provisioning state, FQDN, and IP address appear in the cmdlet's output:

```console
PS Azure:\> Get-AzContainerGroup -ResourceGroupName myResourceGroup -Name myContainerGroup

ResourceGroupName        : myResourceGroup
Id                       : /subscriptions/<Subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.ContainerInstance/containerGroups/myContainerGroup
Name                     : myContainerGroup
Type                     : Microsoft.ContainerInstance/containerGroups
Location                 : eastus
Tags                     :
ProvisioningState        : Creating
Containers               : {myContainer}
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

If the container's `ProvisioningState` is **Succeeded**, go to its FQDN in your browser. If you see a web page similar to the following, congratulations! You've successfully deployed an application running in a Docker container to Azure.

![View an app deployed to Azure Container Instances in browser][./media/container-instances-quickstart/view-an-application-running-in-an-azure-container-instance.png]

## Clean up resources

When you're done with the container, remove it with the [Remove-AzContainerGroup][Remove-AzContainerGroup] cmdlet:

```azurepowershell-interactive
Remove-AzContainerGroup -ResourceGroupName myResourceGroup -Name myContainerGroup
```

## Next steps

In this quickstart, you created an Azure container instance from an image in the public Docker Hub registry. If you'd like to build a container image and deploy it from a private Azure container registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial](./container-instances-tutorial-prepare-app.md)

<!-- LINKS -->
[New-AzResourceGroup]: /powershell/module/az.resources/new-Azresourcegroup
[New-AzContainerGroup]: /powershell/module/az.containerinstance/new-Azcontainergroup
[Get-AzContainerGroup]: /powershell/module/az.containerinstance/get-Azcontainergroup
[Remove-AzContainerGroup]: /powershell/module/az.containerinstance/remove-Azcontainergroup
