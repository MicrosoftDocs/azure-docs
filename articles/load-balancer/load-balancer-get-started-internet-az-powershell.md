---
title: Create a public Load Balancer Standard with zone-redundant Public IP address frontend using PowerShell | Microsoft Docs
description: Learn how to create public Load Balancer Standard with a zone-redundant Public IP address frontend using PowerShell 
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

#  Create a public Load Balancer Standard with zone-redundant Public IP address frontend using PowerShell

This article steps through creating a public [Load Balancer Standard](https://aka.ms/azureloadbalancerstandard) with a zone-redundant frontend using a Public IP Standard address.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Register for Availability Zones, Load Balancer Standard, and Public IP Standard Preview

This article requires that you have version 4.4.0 or higher of the AzureRM module installed. To find the version, run `Get-Module -ListAvailable AzureRM`. If you need to install or upgrade, install the latest version of the AzureRM module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureRM).

>[!NOTE]
[Load Balancer Standard SKU](https://aka.ms/azureloadbalancerstandard) is currently in Preview. During preview, the feature may not have the same level of availability and reliability as features that are in general availability release. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Use the Generally Available [Load Balancer Basic SKU](load-balancer-overview.md) for your production services. 

> [!NOTE]
> Availability zones are in preview and are ready for your development and test scenarios. Support is available for select Azure resources and regions, and VM size families. For more information on how to get started, and which Azure resources, regions, and VM size families you can try availability zones with, see [Overview of Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview). For support, you can reach out on [StackOverflow](https://stackoverflow.com/questions/tagged/azure-availability-zones) or [open an Azure support ticket](../azure-supportability/how-to-create-azure-support-request.md?toc=%2fazure%2fvirtual-network%2ftoc.json).  

Before selecting a zone or zone-redundant option for the frontend Public IP Address for the Load Balancer, you must first complete the steps in [register for the availability zones preview](https://docs.microsoft.com/azure/availability-zones/az-overview).

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

## Create a public IP Standard 
Create a Public IP Standard using the following command:

```powershell
$publicIp = New-AzureRmPublicIpAddress -ResourceGroupName myResourceGroup -Name 'myPublicIP' `
  -Location westeurope -AllocationMethod Static -Sku Standard 
```

## Create a front-end IP configuration for the website

Create a frontend IP configuration using the following command:

```powershell
$feip = New-AzureRmLoadBalancerFrontendIpConfig -Name 'myFrontEndPool' -PublicIpAddress $publicIp
```

## Create the back-end address pool

Create a backend address pool using the following command:

```powershell
$bepool = New-AzureRmLoadBalancerBackendAddressPoolConfig -Name 'myBackEndPool'
```

## Create a load balancer probe on port 80

Create a health probe on port 80 for the load balancer using the following command:

```powershell
$probe = New-AzureRmLoadBalancerProbeConfig -Name 'myHealthProbe' -Protocol Http -Port 80 `
  -RequestPath / -IntervalInSeconds 360 -ProbeCount 5
```

## Create a load balancer
Create a Load Balancer Standard using the following command:

```powershell
$lb = New-AzureRmLoadBalancer -ResourceGroupName myResourceGroup -Name 'MyLoadBalancer' -Location westeurope `
  -FrontendIpConfiguration $feip -BackendAddressPool $bepool `
  -Probe $probe -LoadBalancingRule $rule -Sku Standard
```

## Next steps
- Learn how [create a Public IP in an availability zone](../virtual-network/create-public-ip-availability-zone-portal.md)



