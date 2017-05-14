---
title: Create an Azure virtual machine scale set | Microsoft Docs
description: Create and deploy a Linux or Windows Azure virtual machine scale set with Azure CLI, PowerShell, a template, or Visual Studio.
services: virtual-machine-scale-sets
documentationcenter: ''
author: Thraka
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: ''
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: article
ms.date: 03/30/2017
ms.author: adegeo
---

# Create and deploy a virtual machine scale set
Virtual machine scale sets make it easy for you to deploy and manage identical virtual machines as a set. Scale sets provide a highly scalable and customizable compute layer for hyperscale applications, and they support Windows platform images, Linux platform images, custom images, and extensions. For more information about scale sets, see [Virtual machine scale sets](virtual-machine-scale-sets-overview.md).

This tutorial shows you how to create a virtual machine scale set **without** using the Azure portal. For information about how to use the Azure portal, see [How to create a virtual machine scale set with the Azure portal](virtual-machine-scale-sets-portal-create.md).

>[!NOTE]
>For more information about Azure Resource Manager resources, see [Azure Resource Manager vs. classic deployment](../azure-resource-manager/resource-manager-deployment-model.md).

## Sign in to Azure

If you're using Azure CLI 2.0 or Azure PowerShell to create a scale set, you first need to sign in to your subscription.

For more information about how to install, set up, and sign in to Azure with Azure CLI or PowerShell, see [Getting Started with Azure CLI 2.0](/cli/azure/get-started-with-azure-cli.md) or [Get started with Azure PowerShell cmdlets](/powershell/azure/overview).

```azurecli
az login
```

```powershell
Login-AzureRmAccount
```

## Create a resource group

You first need to create a resource group that the virtual machine scale set is associated with.

```azurecli
az group create --location westus2 --name vmss-test-1
```

```powershell
New-AzureRmResourceGroup -Location westus2 -Name vmss-test-1
```

## Create from Azure CLI

With Azure CLI, you can create a virtual machine scale set with minimal effort. If you omit default values, they are provided for you. For example, if you don't specify any virtual network information, a virtual network is created for you. If you omit the following parts, they are created for you: 
- A load balancer
- A virtual network
- A public IP address

When choosing the virtual machine image that you want to use on the virtual machine scale set, you have a few choices:

- URN  
The identifier of a resource:  
**Win2012R2Datacenter**

- URN alias  
The friendly name of a URN:  
**MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest**

- Custom resource id  
The path to an Azure resource:  
**/subscriptions/subscription-guid/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyImage**

- Web resource  
The path to an HTTP URI:  
**http://contoso.blob.core.windows.net/vhds/osdiskimage.vhd**

>[!TIP]
>You can get a list of available images with `az vm image list`.

To create a virtual machine scale set, you must specify the following:

- Resource group 
- Name
- Operating system image
- Authentication information 
 
The following example creates a basic virtual machine scale set (this step might take a few minutes).

```azurecli
az vmss create --resource-group vmss-test-1 --name MyScaleSet --image UbuntuLTS --authentication-type password --admin-username azureuser --admin-password P@ssw0rd!
```

Once the command finishes you will now have your virtual machine scale set created. You may need to get the IP address of the virtual machine so that you can connect to it. You can get a lot of different information about the virtual machine (including the IP address) with the following command. 

```azurecli
az vmss list-instance-connection-info --resource-group vmss-test-1 --name MyScaleSet
```

## Create from PowerShell

PowerShell is more complicated to use than Azure CLI. While Azure CLI provides defaults for networking-related resources (such as load balancers, IP addresses, and virtual networks), PowerShell does not. Referencing an image with PowerShell is a slightly more complicated too. You can get images with the following cmdlets:

1. Get-AzureRMVMImagePublisher
2. Get-AzureRMVMImageOffer
3. Get-AzureRmVMImageSku

The cmdlets work can be piped in sequence. Here is an example of how to get all images for the **West US 2** region with a publisher that has the name **microsoft** in it.

```powershell
Get-AzureRMVMImagePublisher -Location WestUS2 | Where-Object PublisherName -Like *microsoft* | Get-AzureRMVMImageOffer | Get-AzureRmVMImageSku | Select-Object PublisherName, Offer, Skus
```

```
PublisherName              Offer                    Skus
-------------              -----                    ----
microsoft-ads              linux-data-science-vm    linuxdsvm
microsoft-ads              standard-data-science-vm standard-data-science-vm
MicrosoftAzureSiteRecovery Process-Server           Windows-2012-R2-Datacenter
MicrosoftBizTalkServer     BizTalk-Server           2013-R2-Enterprise
MicrosoftBizTalkServer     BizTalk-Server           2013-R2-Standard
MicrosoftBizTalkServer     BizTalk-Server           2016-Developer
MicrosoftBizTalkServer     BizTalk-Server           2016-Enterprise
...
```

The workflow for creating a virtual machine scale set is as follows:

1. Create a config object that holds information about the scale set.
2. Reference the base OS image.
3. Configure the operating system settings: authentication, VM name prefix, and user/pass.
4. Configure networking.
5. Create the scale set.

This example creates a basic two-instance scale set for a computer that has Windows Server 2016 installed.

```powershell
# Create a config object
$vmssConfig = New-AzureRmVmssConfig -Location WestUS2 -SkuCapacity 2 -SkuName Standard_A0  -UpgradePolicyMode Automatic

# Reference a virtual machine image from the gallery
Set-AzureRmVmssStorageProfile $vmssConfig -ImageReferencePublisher MicrosoftWindowsServer -ImageReferenceOffer WindowsServer -ImageReferenceSku 2016-Datacenter -ImageReferenceVersion latest

# Set up information for authenticating with the virtual machine
Set-AzureRmVmssOsProfile $vmssConfig -AdminUsername azureuser -AdminPassword P@ssw0rd! -ComputerNamePrefix myvmssvm

# Create the virtual network resources
$subnet = New-AzureRmVirtualNetworkSubnetConfig -Name "my-subnet" -AddressPrefix 10.0.0.0/24
$vnet = New-AzureRmVirtualNetwork -Name "my-network" -ResourceGroupName "vmss-test-1" -Location "westus2" -AddressPrefix 10.0.0.0/16 -Subnet $subnet
$ipConfig = New-AzureRmVmssIpConfig -Name "my-ip-address" -LoadBalancerBackendAddressPoolsId $null -SubnetId $vnet.Subnets[0].Id

# Attach the virtual network to the config object
Add-AzureRmVmssNetworkInterfaceConfiguration -VirtualMachineScaleSet $vmssConfig -Name "network-config" -Primary $true -IPConfiguration $ipConfig

# Create the scale set with the config object (this step might take a few minutes)
New-AzureRmVmss -ResourceGroupName vmss-test-1 -Name my-scale-set -VirtualMachineScaleSet $vmssConfig
```

## Create from a template

You can deploy a virtual machine scale set by using an Azure Resource Manager template. You can create your own template or use one from the [template repository](https://azure.microsoft.com/resources/templates/?term=vmss). These templates can be deployed directly to your Azure subscription.

>[!NOTE]
>To create your own template, you create a JSON text file. For general information about how to create and customize a template, see [Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).

A sample template is available [on GitHub](https://github.com/gatneil/mvss/tree/minimum-viable-scale-set). For more information about how to create and use that sample, see [Minimum viable scale set](.\virtual-machine-scale-sets-mvss-start.md).

## Create from Visual Studio

With Visual Studio, you can create an Azure resource group project and add a virtual machine scale set template to it. You can choose whether you want to import it from GitHub or the Azure Web Application Gallery. A deployment PowerShell script is also generated for you. For more information, see [How to create a virtual machine scale set with Visual Studio](virtual-machine-scale-sets-vs-create.md).

## Create from the Azure portal

The Azure portal provides a convenient way to quickly create a scale set. For more information, see [How to create a virtual machine scale set with the Azure portal](virtual-machine-scale-sets-portal-create.md).

## Next steps

Learn more about [data disks](virtual-machine-scale-sets-attached-disks.md).

Learn how to [manage your apps](virtual-machine-scale-sets-deploy-app.md).
