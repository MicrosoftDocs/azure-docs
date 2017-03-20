---
title: Create an Azure Virtual Machine Scale Set | Microsoft Docs
description: Create and deploy a Linux or Windows Azure Virtual Machine Scale Set with the Azure CLI, PowerShell, a template, or Visual Studio.
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
ms.devlang: na
ms.topic: article
ms.date: 03/13/2017
ms.author: adegeo
---

# Create and deploy a Virtual Machine Scale Set
Virtual machine scale sets make it easy for you to deploy and manage identical virtual machines as a set. Scale sets provide a highly scalable and customizable compute layer for hyperscale applications, and they support Windows platform images, Linux platform images, custom images, and extensions. For more information about scale sets, see [Virtual Machine Scale Sets](virtual-machine-scale-sets-overview.md).

This tutorial shows you how to create a virtual machine scale set.

>[!NOTE]
>For more information about Azure Resource Manager resources, see [Azure Resource Manager vs. classic deployment](../azure-resource-manager/resource-manager-deployment-model.md).

## Log in to azure

If you're using the Azure CLI 2.0 or PowerShell to create a scale set, you first need to log in to your subscription.

For more information on how to install, set up, and log in to Azure with Azure CLI 2.0 or PowerShell, see [Getting Started with Azure CLI 2.0](/cli/azure/get-started-with-azure-cli.md) or [Get started with Azure PowerShell cmdlets](/powershell/resourcemanager/).

```azurecli
az login
```

```powershell
Login-AzureRmAccount
```

## Prep: Create a resource group

You first need to create a resource group that the virtual machine scale set is associated with.

```azurecli
az group create --location westus2 --name vmss-test-1
```

```powershell
New-AzureRmResourceGroup -Location westus2 -Name vmss-test-1
```

## Create from Azure CLI

With Azure CLI, you can create a virtual machine scale set with minimal effort. Default values are provided for you if you omit them. For example, if you don't specify any virtual network information, one is created for you. If omitted, the following parts are created for you: a load balancer, a VNET, and a public IP address.

When choosing the virtual machine image you want to use on the virtual machine scale set, you have a few choices:

1. URN  
The identifier of a resource:  
**Win2012R2Datacenter**.

2. URN alias  
The friendly name of a URN:  
**MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest**.

3. Custom resource id  
The path to an azure resource:  
**/subscriptions/subscription-guid/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyImage**.

4. Web resource  
The path to an HTTP URI:  
**http://contoso.blob.core.windows.net/vhds/osdiskimage.vhd**.

>[!TIP]
>You can get a list of available images with `az vm image list`.

To create a virtual machine scale set you must specify the _resource group_, _name_, _operating system image_, and _authentication information_. The following example creates a basic virtual machine scale set (this step may take a few minutes).

```azurecli
az vmss create --resource-group vmss-test-1 --name MyScaleSet --image UbuntuLTS --authentication-type password --admin-username azureuser --admin-password P@ssw0rd!
```

## Create from PowerShell

PowerShell is more complicated to use than the Azure CLI. While the Azure CLI provides defaults for networking related resources (load balancer, ip address, a virtual network), PowerShell does not. Referencing an image is a slightly more complicated too. You can get images with the following cmdlets:

1. Get-AzureRMVMImagePublisher
2. Get-AzureRMVMImageOffer
3. Get-AzureRmVMImageSku

The cmdlets work can be piped in sequence. Here is an example of how to get all images for the **West US 2** region whose publisher has the name **microsoft** in it.

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

The workflow for creating a virtual machine scale set is:

1. Create a config object that holds information about the scale set.
2. Reference base OS image.
3. Configure operating system settings: Authentication, VM name prefix, user/pass.
4. Configure networking.
5. Create the scale set.

This example creates a basic 2-instance scale set with Windows Server 2016 installed.

```powershell
# Create a config object
$vmssConfig = New-AzureRmVmssConfig -Location WestUS2 -SkuCapacity 2 -SkuName Standard_A0  -UpgradePolicyMode Automatic

# Reference a virtual machine image from the gallery
Set-AzureRmVmssStorageProfile $vmssConfig -ImageReferencePublisher MicrosoftWindowsServer -ImageReferenceOffer WindowsServer -ImageReferenceSku 2016-Datacenter -ImageReferenceVersion latest

# Setup information about how to authenticate with the virtual machine
Set-AzureRmVmssOsProfile $vmssConfig -AdminUsername azureuser -AdminPassword P@ssw0rd! -ComputerNamePrefix myvmssvm

# Create the virtual network resources
$subnet = New-AzureRmVirtualNetworkSubnetConfig -Name "my-subnet" -AddressPrefix 10.0.0.0/24
$vnet = New-AzureRmVirtualNetwork -Name "my-network" -ResourceGroupName "vmss-test-1" -Location "westus2" -AddressPrefix 10.0.0.0/16 -Subnet $subnet
$ipConfig = New-AzureRmVmssIpConfig -Name "my-ip-address" -LoadBalancerBackendAddressPoolsId $null -SubnetId $vnet.Subnets[0].Id

# Attach the virtual network to the config object
Add-AzureRmVmssNetworkInterfaceConfiguration -VirtualMachineScaleSet $vmssConfig -Name "network-config" -Primary $true -IPConfiguration $ipConfig

# Create the scale set with the config object (this step may take a few minutes)
New-AzureRmVmss -ResourceGroupName vmss-test-1 -Name my-scale-set -VirtualMachineScaleSet $vmssConfig
```

## Create from a template

You can deploy a virtual machine scale set by using an Azure Resource Manager Template. You can create your own template or use one from the template repository at [blah]. These templates can be deployed directly to your azure subscription.

>[!NOTE]
>To create your own template you create a _.json_ text file. For general information about how to create and customize a template, see [Azure Resource Manager Templates](../azure-resource-manager/resource-group-authoring-templates.md).

A sample template is available [on GitHub](https://github.com/gatneil/mvss/tree/minimum-viable-scale-set). For more information on how to create and use that sample, see [Minimum Viable Scale Set](.\virtual-machine-scale-sets-mvss-start.md).

## Create from Visual Studio

With Visual Studio, you can create an Azure Resource Group project and add a Virtual Machine Scale Set template to it. You can choose which template you want to import, like from GitHub or the Azure Gallery. A deployment PowerShell script is also generated for you. For more information, see [How to create a Virtual Machine Scale Set with Visual Studio](virtual-machine-scale-sets-vs-create.md).

## Create from the Azure Portal

The Azure Portal provides a convenient way to quickly create a scale set. For more information, see [How to create a Virtual Machine Scale Set with the Azure portal](virtual-machine-scale-sets-portal-create.md).
