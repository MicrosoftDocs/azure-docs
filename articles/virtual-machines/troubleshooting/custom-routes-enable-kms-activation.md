---
title: Use Azure custom routes to enable KMS activation with forced tunneling | Microsoft Docs
description: Shows how to use Azure custom routes to enable KMS activation when using forced tunneling in Azure.
services: virtual-machines-windows, azure-resource-manager
documentationcenter: ''
author: genlin
manager: dcscontentpm
editor: ''
tags: top-support-issue, azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: na
ms.tgt_pltfrm: vm-windows

ms.topic: troubleshooting
ms.date: 12/20/2018
ms.author: genli
---

# Windows activation fails in forced tunneling scenario

This article describes how to resolve the KMS activation problem that you might experience when you enable forced tunneling in site-to-site VPN connection or ExpressRoute scenarios.

## Symptom

You enable [forced tunneling](../../vpn-gateway/vpn-gateway-forced-tunneling-rm.md) on Azure virtual network subnets to direct all Internet-bound traffic back to your on-premises network. In this scenario, the Azure virtual machines (VMs) that run Windows fail to activate Windows.

## Cause

The Azure Windows VMs need to connect to the Azure KMS server for Windows activation. The activation requires that the activation request come from an Azure public IP address. In the forced tunneling scenario, the activation fails because the activation request comes from your on-premises network instead of from an Azure public IP address.

## Solution

To resolve this problem, use the Azure custom route to route activation traffic to the Azure KMS server.

The IP address of the KMS server for the Azure Global cloud is 23.102.135.246. Its DNS name is kms.core.windows.net. If you use other Azure platforms such as Azure Germany, you must use the IP address of the corresponding KMS server. For more information, see the following table:

|Platform| KMS DNS|KMS IP|
|------|-------|-------|
|Azure Global|kms.core.windows.net|23.102.135.246|
|Azure Germany|kms.core.cloudapi.de|51.4.143.248|
|Azure US Government|kms.core.usgovcloudapi.net|23.97.0.13|
|Azure China 21Vianet|kms.core.chinacloudapi.cn|42.159.7.249|


To add the custom route, follow these steps:

### For Resource Manager VMs

 

> [!NOTE] 
> Activation uses public IP addresses and will be affected by a Standard SKU Load Balancer configuration. Carefully review [Outbound connections in Azure](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections) to learn about the requirements.

1. Open Azure PowerShell, and then [sign in to your Azure subscription](https://docs.microsoft.com/powershell/azure/authenticate-azureps).
2. Run the following commands:

    ```powershell
    # First, get the virtual network that hosts the VMs that have activation problems. In this case, we get virtual network ArmVNet-DM in Resource Group ArmVNet-DM:

    $vnet = Get-AzVirtualNetwork -ResourceGroupName "ArmVNet-DM" -Name "ArmVNet-DM"

    # Next, create a route table and specify that traffic bound to the KMS IP (23.102.135.246) will go directly out:

    $RouteTable = New-AzRouteTable -Name "ArmVNet-DM-KmsDirectRoute" -ResourceGroupName "ArmVNet-DM" -Location "centralus"

    Add-AzRouteConfig -Name "DirectRouteToKMS" -AddressPrefix 23.102.135.246/32 -NextHopType Internet -RouteTable $RouteTable

    Set-AzRouteTable -RouteTable $RouteTable

    # Next, attach the route table to the subnet that hosts the VMs

    Set-AzVirtualNetworkSubnetConfig -Name "Subnet01" -VirtualNetwork $vnet -AddressPrefix "10.0.0.0/24" -RouteTable $RouteTable

    Set-AzVirtualNetwork -VirtualNetwork $vnet
    ```
3. Go to the VM that has activation problems. Use [PsPing](https://docs.microsoft.com/sysinternals/downloads/psping) to test if it can reach the KMS server:

        psping kms.core.windows.net:1688

4. Try to activate Windows, and see if the problem is resolved.

### For Classic VMs

[!INCLUDE [classic-vm-deprecation](../../../includes/classic-vm-deprecation.md)]

1. Open Azure PowerShell, and then [sign in to your Azure subscription](https://docs.microsoft.com/powershell/azure/authenticate-azureps).
2. Run the following commands:

    ```powershell
    # First, create a new route table:
    New-AzureRouteTable -Name "VNet-DM-KmsRouteGroup" -Label "Route table for KMS" -Location "Central US"

    # Next, get the route table that was created:
    $rt = Get-AzureRouteTable -Name "VNet-DM-KmsRouteTable"

    # Next, create a route:
    Set-AzureRoute -RouteTable $rt -RouteName "AzureKMS" -AddressPrefix "23.102.135.246/32" -NextHopType Internet

    # Apply the KMS route table to the subnet that hosts the problem VMs (in this case, we apply it to the subnet that's named Subnet-1):
    Set-AzureSubnetRouteTable -VirtualNetworkName "VNet-DM" -SubnetName "Subnet-1" 
    -RouteTableName "VNet-DM-KmsRouteTable"
    ```

3. Go to the VM that has activation problems. Use [PsPing](https://docs.microsoft.com/sysinternals/downloads/psping) to test if it can reach the KMS server:

        psping kms.core.windows.net:1688

4. Try to activate Windows, and see if the problem is resolved.

## Next steps

- [KMS Client Setup Keys](https://docs.microsoft.com/windows-server/get-started/kmsclientkeys
)
- [Review and Select Activation Methods](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/jj134256(v=ws.11)
)
