---
title: Create an Internet-facing load balancer - Azure PowerShell classic
titlesuffix: Azure Load Balancer
description: Learn how to create an Internet facing load balancer in classic mode using PowerShell
services: load-balancer
documentationcenter: na
author: genlin
manager: cshepard
tags: azure-service-management

ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/23/2017
ms.author: genli
---

# Get started creating an Internet facing load balancer (classic) in PowerShell

> [!div class="op_single_selector"]
> * [PowerShell](../load-balancer/load-balancer-get-started-internet-classic-ps.md)
> * [Azure CLI](../load-balancer/load-balancer-get-started-internet-classic-cli.md)
> * [Azure Cloud Services](../load-balancer/load-balancer-get-started-internet-classic-cloud.md)

[!INCLUDE [load-balancer-get-started-internet-intro-include.md](../../includes/load-balancer-get-started-internet-intro-include.md)]

> [!IMPORTANT]
> Before you work with Azure resources, it's important to understand that Azure currently has two deployment models: Azure Resource Manager and classic. Make sure you understand [deployment models and tools](../azure-classic-rm.md) before you work with any Azure resource. You can view the documentation for different tools by clicking the tabs at the top of this article. This article covers the classic deployment model. You can also [Learn how to create an Internet facing load balancer using Azure Resource Manager](load-balancer-get-started-internet-arm-ps.md).

[!INCLUDE [load-balancer-get-started-internet-scenario-include.md](../../includes/load-balancer-get-started-internet-scenario-include.md)]

## Set up load balancer using PowerShell

To set up a load balancer using powershell, complete following steps:

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](/powershell/azure/overview) and follow the instructions all the way to the end to sign into Azure and select your subscription.
2. After creating a virtual machine, you can use PowerShell cmdlets to add a load balancer to a virtual machine within the same cloud service.

In the following example, you add a load balancer set called "webfarm" to cloud service "mytestcloud" (or myctestcloud.cloudapp.net), adding the endpoints for the load balancer to virtual machines named "web1" and "web2." The load balancer receives network traffic on port 80 and load balances between the virtual machines defined by the local endpoint (in this case port 80) using TCP.

### Step 1

Create a load balanced endpoint for the first VM "web1"

```powershell
Get-AzureVM -ServiceName "mytestcloud" -Name "web1" | Add-AzureEndpoint -Name "HttpIn" -Protocol "tcp" -PublicPort 80 -LocalPort 80 -LBSetName "WebFarm" -ProbePort 80 -ProbeProtocol "http" -ProbePath '/' | Update-AzureVM
```

### Step 2

Create another endpoint for the second VM  "web2" using the same load balancer set name

```powershell
Get-AzureVM -ServiceName "mytestcloud" -Name "web2" | Add-AzureEndpoint -Name "HttpIn" -Protocol "tcp" -PublicPort 80 -LocalPort 80 -LBSetName "WebFarm" -ProbePort 80 -ProbeProtocol "http" -ProbePath '/' | Update-AzureVM
```

## Remove a virtual machine from a load balancer

You can use Remove-AzureEndpoint to remove a virtual machine endpoint from the load balancer

```powershell
Get-azureVM -ServiceName mytestcloud  -Name web1 |Remove-AzureEndpoint -Name httpin | Update-AzureVM
```

## Next steps

You can also [get started creating an internal load balancer](load-balancer-get-started-ilb-classic-ps.md) and configure what type of [distribution mode](load-balancer-distribution-mode.md) for a specific load balancer network traffic behavior.

If your application needs to keep connections alive for servers behind a load balancer, you can understand more about [idle TCP timeout settings for a load balancer](load-balancer-tcp-idle-timeout.md). It helps to learn about idle connection behavior when you are using Azure Load Balancer.
