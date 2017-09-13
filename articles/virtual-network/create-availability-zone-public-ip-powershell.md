---
title: Create a zoned Public IP with PowerShell | Microsoft Docs
description: Create a public IP in an availability zone with the PowerShell
services: virtual-network
documentationcenter: virtual-network
author: KumudD
manager: timlt
editor: 
tags: 

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: 
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 09/13/2017
ms.author: kumud
ms.custom: 
---

# Create a Public IP in an availability zone with PowerShell

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts. This article details using PowerShell to create a Public IP in an Azure availability zone (preview). An [availability zone](../availability-zones/az-overview.md) is a physically separate zone in an Azure region. You learn how to:

> * Create a Public IP in an availability zone
> * Identify Availability Zone of a Public IP
  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This article requires the Azure PowerShell module version 3.6 [*TBD*] or later. To find the version, run `Get-Module -ListAvailable AzureRM`. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

## Log in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Create a zonal Public IP

Create a Public IP in an Availability Zone using the following command:

```powershell
    New-AzureRmPublicIpAddress `
        -ResourceGroupName AzTest `
        -Name pstestMyPublicIP `
        -Location westeurope `
        -AllocationMethod Static `
        -Zone 2
```

## Get zone information about a Public IP

Get the zone information of a Public IP using the following command:

```powershell
Get-AzureRmPublicIpAddress ` 
    -ResourceGroup AzTest `
    -Name pstestMyPublicIP
```

## Next step
- Learn to [create a zoned VM with PowerShell] (../../virtual-machines/create-powershell-availability-zone.md)