---
title: Use Azure custom routes to enable KMS activation with forced tunneling | Microsoft Docs
description: Shows how to use Azure custom routes to enable KMS activation with forced tunneling in Azure.
services: virtual-machines-windows, azure-resource-manager
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''
tags: top-support-issue, azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: na
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: troubleshooting
ms.date: 12/20/2018
ms.author: genli
---

# Use custom routes to enable KMS activation with forced tunneling in Azure

This article describes how to resolve the KMS activation problem that you might experience when you are using a site-to-site VPN and forced tunneling.

## Symptom

You enable [forced tunneling](../../vpn-gateway/vpn-gateway-forced-tunneling-rm.md) on Azure virtual network subnets to direct  all Internet-bound traffic back to your on-premises location. In this scenario, the Azure virtual machines that run Windows Server 2012 R2 or later versions can successfully activate the Windows. But the VM that runs earlier versions of Windows fail to activate the Windows. 

## Cause

The VM cannot connect to Azure KMS server from on-premises network.

## Solution

To resolve this problem, use Azure custom route to route activation traffic to the Azure KMS server (23.102.135.246). 

The IP address 23.102.135.246 is the IP address of the KMS server for Azure global cloud. Its DNS name is kms.core.windows.net. If you use other Microsoft Azure platform such as Azure Germany, you must use the IP address of the correspond KMS server. For more information, see the following table:

|Platform| KMS DNS|KMS IP|
|------|-------|-------|
|Azure Global|kms.core.windows.net|23.102.135.246|
|Azure Germany|kms.core.cloudapi.de|51.4.143.248|
|Azure US Government|kms.core.usgovcloudapi.net|23.97.0.13|
|Azure China 21Vianet|kms.core.chinacloudapi.cn|42.159.7.249|

To add the custom route, follow these steps:

1. Open Azure PowerShell, and then [sign in to your Azure subscription](https://docs.microsoft.com/powershell/azure/authenticate-azureps).
2. Run the following commands:

        $myRouteTable = Get-AzureRouteTable -Name "ForcedTunnelRouteTable"
        
        Set-AzureRoute -RouteName "To KMS" -AddressPrefix 23.102.135.246/32 -NextHopType Internet -RouteTable $myRouteTable

    The following is a sample of the output after your run the commands:

         Name                 Address Prefix    Next hop type        Next hop IP address
          ----                 --------------    -------------        -------------------
          defaultroute         0.0.0.0/0          VPNGateway
          to kms               23.102.135.246/32  Internet

3. Go to the VM that has activation problem, use [PsPing](https://docs.microsoft.com/sysinternals/downloads/psping) to test if it can reach KMS server:

        psping kms.core.windows.net:1688

4. Check if the problem is resolved.


   
