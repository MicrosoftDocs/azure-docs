---
title: Navigate and select Windows VM images | Microsoft Docs
description: Learn how to determine the publisher, offer, and SKU for images when creating a Windows virtual machine with the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: squillace
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 188b8974-fabd-4cd3-b7dc-559cbb86b98a
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 08/23/2016
ms.author: rasquill

---
# Navigate and select Windows virtual machine images in Azure with PowerShell
This topic describes how to find VM image publishers, offers, skus, and versions for each location into which you might deploy. To give an example, some commonly used Windows VM images are:

## Table of commonly used Windows images
| PublisherName | Offer | Sku |
|:--- |:--- |:--- |:--- |
| MicrosoftDynamicsNAV |DynamicsNAV |2015 |
| MicrosoftSharePoint |MicrosoftSharePointServer |2013 |
| MicrosoftSQLServer |SQL2014-WS2012R2 |Enterprise-Optimized-for-DW |
| MicrosoftSQLServer |SQL2014-WS2012R2 |Enterprise-Optimized-for-OLTP |
| MicrosoftWindowsServer |WindowsServer |2012-R2-Datacenter |
| MicrosoftWindowsServer |WindowsServer |2012-Datacenter |
| MicrosoftWindowsServer |WindowsServer |2008-R2-SP1 |
| MicrosoftWindowsServer |WindowsServer |Windows-Server-Technical-Preview |
| MicrosoftWindowsServerEssentials |WindowsServerEssentials |WindowsServerEssentials |
| MicrosoftWindowsServerHPCPack |WindowsServerHPCPack |2012R2 |

## Find Azure images with PowerShell
> [!NOTE]
> Install and configure the [latest Azure PowerShell](/powershell/azure/overview). If you are using Azure PowerShell modules below 1.0, you still use the following commands but you must first `Switch-AzureMode AzureResourceManager`. 
> 
> 

When creating a new virtual machine with Azure Resource Manager, in some cases you need to specify an image with the combination of the following image properties:

* Publisher
* Offer
* SKU

For example, these values are needed for the `Set-AzureRMVMSourceImage` PowerShell cmdlet or with a resource group template file in which you must specify the type of virtual machine to be created.

If you need to determine these values, you can navigate the images to determine these values:

1. List the image publishers.
2. For a given publisher, list their offers.
3. For a given offer, list their SKUs.

First, list the publishers with the following commands:

```powershell
$locName="<Azure location, such as West US>"
Get-AzureRMVMImagePublisher -Location $locName | Select PublisherName
```

Fill in your chosen publisher name and run the following commands:

```powershell
$pubName="<publisher>"
Get-AzureRMVMImageOffer -Location $locName -Publisher $pubName | Select Offer
```

Fill in your chosen offer name and run the following commands:

```powershell
$offerName="<offer>"
Get-AzureRMVMImageSku -Location $locName -Publisher $pubName -Offer $offerName | Select Skus
```

From the display of the `Get-AzureRMVMImageSku` command, you have all the information you need to specify the image for a new virtual machine.

The following shows a full example:

```powershell
PS C:\> $locName="West US"
PS C:\> Get-AzureRMVMImagePublisher -Location $locName | Select PublisherName

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

For the "MicrosoftWindowsServer" publisher:

```powershell
PS C:\> $pubName="MicrosoftWindowsServer"
PS C:\> Get-AzureRMVMImageOffer -Location $locName -Publisher $pubName | Select Offer

Offer
-----
WindowsServer
```

For the "WindowsServer" offer:

```powershell
PS C:\> $offerName="WindowsServer"
PS C:\> Get-AzureRMVMImageSku -Location $locName -Publisher $pubName -Offer $offerName | Select Skus

Skus
----
2008-R2-SP1
2012-Datacenter
2012-R2-Datacenter
2016-Nano-Server-Technical-Previe
2016-Technical-Preview-with-Conta
Windows-Server-Technical-Preview
```

From this list, copy the chosen SKU name, and you have all the information for the `Set-AzureRMVMSourceImage` PowerShell cmdlet or for a resource group template.

## Next steps
Now you can choose precisely the image you want to use. To create a virtual machine quickly by using the image information, which you just found, or to use a template with that image information, see [Create a Windows VM using Resource Manager and PowerShell](../virtual-machines-windows-ps-create.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
