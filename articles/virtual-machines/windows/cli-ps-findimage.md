---
title: Select Windows VM images in Azure | Microsoft Docs
description: Learn how to use Azure PowerSHell to determine the publisher, offer, SKU, and version for Marketplace VM images.
services: virtual-machines-windows
documentationcenter: ''
author: dlepow
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 188b8974-fabd-4cd3-b7dc-559cbb86b98a
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 02/12/2018
ms.author: danlep

---
# How to find Windows VM images in the Azure Marketplace with Azure PowerShell

This topic describes how to use Azure PowerShell to find VM images in the Azure Marketplace. Use this information to specify a Marketplace image when you create a Windows VM.

Make sure that you installed and configured the latest [Azure PowerShell module](/powershell/azure/install-azurerm-ps).

[!INCLUDE [virtual-machines-common-image-terms](../../../includes/virtual-machines-common-image-terms.md)]

## Table of commonly used Windows images
| PublisherName | Offer | Sku |
|:--- |:--- |:--- |:--- |
| MicrosoftWindowsServer |WindowsServer |2016-Datacenter |
| MicrosoftWindowsServer |WindowsServer |2016-Datacenter-Server-Core |
| MicrosoftWindowsServer |WindowsServer |2016-Datacenter-with-Containers |
| MicrosoftWindowsServer |WindowsServer |2016-Nano-Server |
| MicrosoftWindowsServer |WindowsServer |2012-R2-Datacenter |
| MicrosoftWindowsServer |WindowsServer |2008-R2-SP1 |
| MicrosoftDynamicsNAV |DynamicsNAV |2017 |
| MicrosoftSharePoint |MicrosoftSharePointServer |2016 |
| MicrosoftSQLServer |SQL2016-WS2016 |Enterprise |
| MicrosoftSQLServer |SQL2014SP2-WS2012R2 |Enterprise |
| MicrosoftWindowsServerHPCPack |WindowsServerHPCPack |2012R2 |
| MicrosoftWindowsServerEssentials |WindowsServerEssentials |WindowsServerEssentials |

## Navigate the images


Another way to find an image in a location is to run the [Get-AzureRMVMImagePublisher](/powershell/module/azurerm.compute/get-azurermvmimagepublisher), [Get-AzureRMVMImageOffer](/powershell/module/azurerm.compute/get-azurermvmimageoffer), and [Get-AzureRMVMImageSku](/powershell/module/azurerm.compute/get-azurermvmimagesku) cmdlets in sequence. With these commands, you determine these values:

1. List the image publishers.
2. For a given publisher, list their offers.
3. For a given offer, list their SKUs.

Then, for a selected SKU, you can choose a version to deploy.

First, list the publishers with the following commands:

```azurepowershell-interactive
$locName="<Azure location, such as West US>"
Get-AzureRMVMImagePublisher -Location $locName | Select PublisherName
```

Fill in your chosen publisher name and run the following commands:

```azurepowershell-interactive
$pubName="<publisher>"
Get-AzureRMVMImageOffer -Location $locName -Publisher $pubName | Select Offer
```

Fill in your chosen offer name and run the following commands:

```azurepowershell-interactive
$offerName="<offer>"
Get-AzureRMVMImageSku -Location $locName -Publisher $pubName -Offer $offerName | Select Skus
```

From the output of the `Get-AzureRMVMImageSku` command, you have all the information you need to specify the image for a new virtual machine.

The following shows a full example:

```azurepowershell-interactive
$locName="West US"
Get-AzureRMVMImagePublisher -Location $locName | Select PublisherName

```

Output:

```
PublisherName
-------------
a10networks
aiscaler-cache-control-ddos-and-url-rewriting-
alertlogic
AlertLogic.Extension
Barracuda.Azure.ConnectivityAgent
barracudanetworks
basho
boxless
bssw
Canonical
...
```

For the *MicrosoftWindowsServer* publisher:

```azurepowershell-interactive
$pubName="MicrosoftWindowsServer"
Get-AzureRMVMImageOffer -Location $locName -Publisher $pubName | Select Offer
```

Output:

```
Offer
-----
Windows-HUB
WindowsServer
WindowsServerSemiAnnual
```

For the *WindowsServer* offer:

```azurepowershell-interactive
$offerName="WindowsServer"
Get-AzureRMVMImageSku -Location $locName -Publisher $pubName -Offer $offerName | Select Skus
```

Output:

```
Skus
----
2008-R2-SP1
2008-R2-SP1-smalldisk
2012-Datacenter
2012-Datacenter-smalldisk
2012-R2-Datacenter
2012-R2-Datacenter-smalldisk
2016-Datacenter
2016-Datacenter-Server-Core
2016-Datacenter-Server-Core-smalldisk
2016-Datacenter-smalldisk
2016-Datacenter-with-Containers
2016-Nano-Server
```

Then, for a given SKU, find a specific version with the 
[Get-AzureRMVMImage](/powershell/module/azurerm.compute/get-azurermvmimage) cmdlet. For the *2016-Datacenter* SKU:

```powershell-interactive
$skuName="skuName"
Get-AzureRMVMImage -Location $locName -Publisher $pubName -Offer $offerName -Sku $skuName | Select Versions
```


For example, use these values with the [Set-AzureRMVMSourceImage](/powershell/module/azurerm.compute/set-azurermvmsourceimage) PowerShell cmdlet, or with a Resource Manager template in which you must specify the type of VM to be created.

[!INCLUDE [virtual-machines-common-marketplace-plan](../../../includes/virtual-machines-common-marketplace-plan.md)]


## Deploy a licensed image
To test whether a particular image is licensed, run a command similar to the following:

```powershell
$isLicensed=(Get-AzureRMVMImage -Location $locName -Publisher $pubName -Offer $offerName -Skus $skuName -Version $version).PurchasePlan -ne ""
```

The [Get-AzureRmMarketplaceterms](/powershell/module/azurerm.compute/get-azurermmarketplaceterms) cmdlet provides a link to the agreement terms for the licensed Marketplace image and shows whether you previously accepted the terms. Use the [Set-AzureRmMarketp(/powershell/module/azurerm.compute/set-azurermmarketplaceterms] cmdlet to accept or reject the terms.

For example, to accept the terms and enable programmatic deployment of the licensed image:

```powershell-interactive
If ($isLicensed) {Get-AzureRmMarketplaceterms -Publisher $pubName -Product $offerName -Name $skuName | Set-AzureRmMarketplaceterms -Accept}
```

Then, to create a VM object using the licensed image, use commands similar to the following:

```powershell-interactive


$VirtualMachine = Set-AzureRmVMPlan -VM $VirtualMachine -Publisher $pubName -Product $offerName -Name $skuName

$VirtualMachine = Set-AzureRmVMOperatingSystem -VM $VirtualMachine -linux -ComputerName $ComputerName -Credential $Credential1

$VirtualMachine = Set-AzureRmVMSourceImage -VM $VirtualMachine -PublisherName $pubName -Offer $offerName -Skus $skuName -Version $version
```

## Next steps
Now you can choose precisely the image you want to use. To create a virtual machine quickly by using the image information, which you just found, see [Create a Windows virtual machine with PowerShell](quick-create-powershell.md).
