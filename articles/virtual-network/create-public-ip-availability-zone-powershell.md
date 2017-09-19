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
ms.topic: 
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 09/17/2017
ms.author: jdial
ms.custom: 
---

# Create a public IP address in an availability zone with PowerShell

You can deploy a public IP address in an Azure availability zone (preview). An [availability zone](../availability-zones/az-overview.md) is a physically separate zone in an Azure region. You learn how to:

> * Create a public IP address in an availability zone
> * Identify related resources created in the availability zone
  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This article requires a version greater than 4.3.1 for the AzureRM module. To find the version, run `Get-Module -ListAvailable AzureRM`. If you need to install or upgrade, install the latest version of the AzureRM module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureRM).

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

## Get zone information about a public IP address

Get the zone information of a public IP address using the following command:

```powershell
Get-AzureRmPublicIpAddress ` 
    -ResourceGroup myResourceGroup `
    -Name myPublicIp
```

## Next steps
- Learn more about [Availability zones](../availability-zones/az-overview.md)
- Learn more about [public IP addresses](virtual-network-public-ip-address.md) 