---
title: Create a zoned Public IP address with PowerShell | Microsoft Docs
description: Create a public IP in an availability zone with PowerShell.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: jeconnoc
editor: 
tags: 

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 09/25/2017
ms.author: jdial
ms.custom: 
---

# Create a public IP address in an availability zone with PowerShell

You can deploy a public IP address in an Azure availability zone (preview). An availability zone is a physically separate zone in an Azure region. Learn how to:

> * Create a public IP address in an availability zone
> * Identify related resources created in the availability zone
  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This article requires that you have version 4.4.0 or higher of the AzureRM module installed. To find the version, run `Get-Module -ListAvailable AzureRM`. If you need to install or upgrade, install the latest version of the AzureRM module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureRM).

> [!NOTE]
> Availability zones are in preview and are ready for your development and test scenarios. Support is available for select Azure resources and regions, and VM size families. For more information on how to get started, and which Azure resources, regions, and VM size families you can try availability zones with, see [Overview of Availability Zones](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview). For support, you can reach out on [StackOverflow](https://stackoverflow.com/questions/tagged/azure-availability-zones) or [open an Azure support ticket](../azure-supportability/how-to-create-azure-support-request.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Log in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```
## Create resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. In this example, a resource group named *myResourceGroup* is created in the *westeurope* region. *westeurope* is one of the Azure regions that supports availability zones in preview.

```powershell
New-AzureRmResourceGroup -Name AzTest -Location westeurope
```

## Create a zonal public IP address

Create a public IP address in an availability zone using the following command:

```powershell
    New-AzureRmPublicIpAddress `
        -ResourceGroupName myResourceGroup `
        -Name myPublicIp `
        -Location westeurope `
        -AllocationMethod Static `
        -Zone 2
```

> [!NOTE]
> When you assign a standard SKU public IP address to a virtual machine’s network interface, you must explicitly allow the intended traffic with a [network security group](security-overview.md#network-security-groups). Communication with the resource fails until you create and associate a network security group and explicitly allow the desired traffic.

## Get zone information about a public IP address

Get the zone information of a public IP address using the following command:

```powershell
Get-AzureRmPublicIpAddress ` 
    -ResourceGroup myResourceGroup `
    -Name myPublicIp
```

## Next steps

- Learn more about [availability zones](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview)
- Learn more about [public IP addresses](virtual-network-public-ip-address.md?toc=%2fazure%2fvirtual-network%2ftoc.json) 