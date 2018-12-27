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

# Windows activation fails in forced tunneling scenario

This article describes how to resolve the KMS activation problem that you might experience when you enabled forced tunneling in site-to-site VPN connection or ExpressRoute scenarios.

## Symptom

You enable [forced tunneling](../../vpn-gateway/vpn-gateway-forced-tunneling-rm.md) on the Azure virtual network subnets to direct all Internet-bound traffic back to your on-premises network. In this scenario, the Azure virtual machines (VM) that run Windows Server 2012 R2 or later versions can successfully activate the Windows. However, the VMs that run earlier version of Windows fail to activate the Windows. 

## Cause

The Azure Windows VMs need connect to the Azure KMS server for Windows activation. The activation requires that the activation request must come from an Azure public IP address. In the forced tunneling scenario, the activation will fail because the activation request is from your on-premises network instead of from an Azure public IP. 

## Solution

To resolve this problem, use the Azure custom route to route activation traffic to the Azure KMS server (23.102.135.246). 

The IP address 23.102.135.246 is the IP address of the KMS server for the Azure Global cloud. Its DNS name is kms.core.windows.net. If you use other Azure platforms such as Azure Germany, you must use the IP address of the correspond KMS server. For more information, see the following table:

|Platform| KMS DNS|KMS IP|
|------|-------|-------|
|Azure Global|kms.core.windows.net|23.102.135.246|
|Azure Germany|kms.core.cloudapi.de|51.4.143.248|
|Azure US Government|kms.core.usgovcloudapi.net|23.97.0.13|
|Azure China 21Vianet|kms.core.chinacloudapi.cn|42.159.7.249|


To add the custom route, follow these steps:

### For Resource Manager VMs

1. Open Azure PowerShell, and then [sign in to your Azure subscription](https://docs.microsoft.com/powershell/azure/authenticate-azureps).
2. Run the following commands:

    ```powershell
    # First, we will get the virtual network hosts the VMs that has activation problems. In this case, I get virtual network ArmVNet-DM in Resource Group ArmVNet-DM

    $vnet = Get-AzureRmVirtualNetwork -ResourceGroupName "ArmVNet-DM" -Name "ArmVNet-DM"

    # Next, we create a route table and specify that traffic bound to the KMS IP (23.102.135.246) will go directly out

    $RouteTable = New-AzureRmRouteTable -Name "ArmVNet-DM-KmsDirectRoute" -ResourceGroupName "ArmVNet-DM" -Location "centralus"

    Add-AzureRmRouteConfig -Name "DirectRouteToKMS" -AddressPrefix 23.102.135.246/32 -NextHopType Internet -RouteTable $RouteTable

    Set-AzureRmRouteTable -RouteTable $RouteTable
    ```
3. Go to the VM that has activation problem, use [PsPing](https://docs.microsoft.com/sysinternals/downloads/psping) to test if it can reach KMS server:

        psping kms.core.windows.net:1688

4. Try to activate Windows and see if the problem is resolved.

### For Classic VMs

1. Open Azure PowerShell, and then [sign in to your Azure subscription](https://docs.microsoft.com/powershell/azure/authenticate-azureps).
2. Run the following commands:

    ```powershell
    # First, we will create a new route table
    New-AzureRouteTable -Name "VNet-DM-KmsRouteGroup" -Label "Route table for KMS" -Location "Central US"

    # Next, get the routetable that was created
    $rt = Get-AzureRouteTable -Name "VNet-DM-KmsRouteTable"

    # Next, create a route
    Set-AzureRoute -RouteTable $rt -RouteName "AzureKMS" -AddressPrefix "23.102.135.246/32" -NextHopType Internet

    # Apply KMS route table to the subnet that host the problem VMs (in this case, I will apply it to the subnet named Subnet-1)
    Set-AzureSubnetRouteTable -VirtualNetworkName "VNet-DM" -SubnetName "Subnet-1" 
    -RouteTableName "VNet-DM-KmsRouteTable"
    ```

3. Go to the VM that has activation problem, use [PsPing](https://docs.microsoft.com/sysinternals/downloads/psping) to test if it can reach KMS server:

        psping kms.core.windows.net:1688

4. Try to activate Windows and see if the problem is resolved.

## Next steps

- [KMS Client Setup Keys](https://docs.microsoft.com/windows-server/get-started/kmsclientkeys
)
- [Review and Select Activation Methods](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/jj134256(v=ws.11)
)