---
title: Create a Load Balancer Standard in an Availability Zone with the PowerShell | Microsoft Docs
description: Learn how to create Load Balancer Standard in an Availability Zone with the PowerShell 
services: load-balancer
documentationcenter: na
author: KumudD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/20/2017
ms.author: kumud
---

#  Create a Load Balancer Standard in an Availability Zone with the PowerShell

You can deploy a Load Balancer Standard in an Azure availability zone (preview). An availability zone is a physically separate zone in an Azure region.   

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

Create a Resource Group using the following command:

```powershell
New-AzureRmResourceGroup -Name myResourceGroup -Location westeurope
```

## Create a zonal Standard public IP address 
Create a Standard Public IP using the following command:

```powershell
$publicIp = New-AzureRmPublicIpAddress -ResourceGroupName $rgName -Name 'myPublicIP' `
  -Location $location -AllocationMethod Static -Zone 1 -Sku Standard 
```

## Create a load balancer
Create a Load Balancer Standard using the following command:

```powershell
$lb = New-AzureRmLoadBalancer -ResourceGroupName $rgName -Name 'MyLoadBalancer' -Location $location `
  -FrontendIpConfiguration $feip -BackendAddressPool $bepool `
  -Probe $probe -LoadBalancingRule $rule -InboundNatRule $natrule1,$natrule2,$natrule3 -Sku Standard
```

## Next steps
- Learn how [create a Public IP in an availability zone](../virtual-network/create-public-ip-availability-zone-portal.md)



