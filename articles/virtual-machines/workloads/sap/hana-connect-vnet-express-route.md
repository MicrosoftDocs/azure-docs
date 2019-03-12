---
title: Connectivity setup from virtual network to SAP HANA on Azure (large instances) | Microsoft Docs
description: Connectivity setup from virtual network to use SAP HANA on Azure (large instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: jeconnoc
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/10/2018
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---

# Connect a virtual network to HANA large instances

After you've created an Azure virtual network, you can connect that network to SAP HANA on Azure large instances. Create an Azure ExpressRoute gateway on the virtual network. This gateway enables you to link the virtual network to the ExpressRoute circuit that connects to the customer tenant on the large instance stamp.

> [!NOTE] 
> This step can take up to 30 minutes to complete. The new gateway is created in the designated Azure subscription, and then connected to the specified Azure virtual network.

If a gateway already exists, check whether it's an ExpressRoute gateway or not. If not, delete the gateway, and re-create it as an ExpressRoute gateway. If an ExpressRoute gateway is already established, see the following section of this article, "Link virtual networks." 

- Use either the [Azure portal](https://portal.azure.com/) or PowerShell to create an ExpressRoute VPN gateway connected to your virtual network.
  - If you use the Azure portal, add a new **Virtual Network Gateway**, and then select **ExpressRoute** as the gateway type.
  - If you use PowerShell, first download and use the latest [Azure PowerShell SDK](https://azure.microsoft.com/downloads/). The following commands create an ExpressRoute gateway. The texts preceded by a _$_ are user defined variables that should be updated with your specific information.

```PowerShell
# These Values should already exist, update to match your environment
$myAzureRegion = "eastus"
$myGroupName = "SAP-East-Coast"
$myVNetName = "VNet01"

# These values are used to create the gateway, update for how you wish the GW components to be named
$myGWName = "VNet01GW"
$myGWConfig = "VNet01GWConfig"
$myGWPIPName = "VNet01GWPIP"
$myGWSku = "HighPerformance" # Supported values for HANA large instances are: HighPerformance or UltraPerformance

# These Commands create the Public IP and ExpressRoute Gateway
$vnet = Get-AzureRmVirtualNetwork -Name $myVNetName -ResourceGroupName $myGroupName
$subnet = Get-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
New-AzureRmPublicIpAddress -Name $myGWPIPName -ResourceGroupName $myGroupName `
-Location $myAzureRegion -AllocationMethod Dynamic
$gwpip = Get-AzureRmPublicIpAddress -Name $myGWPIPName -ResourceGroupName $myGroupName
$gwipconfig = New-AzureRmVirtualNetworkGatewayIpConfig -Name $myGWConfig -SubnetId $subnet.Id `
-PublicIpAddressId $gwpip.Id

New-AzureRmVirtualNetworkGateway -Name $myGWName -ResourceGroupName $myGroupName -Location $myAzureRegion `
-IpConfigurations $gwipconfig -GatewayType ExpressRoute `
-GatewaySku $myGWSku -VpnType PolicyBased -EnableBgp $true
```

In this example, the HighPerformance gateway SKU was used. Your options are HighPerformance or UltraPerformance as the only gateway SKUs that are supported for SAP HANA on Azure (large instances).

> [!IMPORTANT]
> For HANA large instances of the Type II class SKU, you must use the UltraPerformance Gateway SKU.

## Link virtual networks

The Azure virtual network now has an ExpressRoute gateway. Use the authorization information provided by Microsoft to connect the ExpressRoute gateway to the SAP HANA on Azure (large instances) ExpressRoute circuit. You can connect by using the Azure portal or PowerShell. The portal is recommended, but if you want to use PowerShell, the instructions are as follows. 

Run the following commands for each virtual network gateway by using a different AuthGUID for each connection. The first two entries shown in the following script come from the information provided by Microsoft. Also, the AuthGUID is specific for every virtual network and its gateway. If you want to add another Azure virtual network, you need to get another AuthID for your ExpressRoute circuit that connects HANA large instances into Azure. 

```PowerShell
# Populate with information provided by Microsoft Onboarding team
$PeerID = "/subscriptions/9cb43037-9195-4420-a798-f87681a0e380/resourceGroups/Customer-USE-Circuits/providers/Microsoft.Network/expressRouteCircuits/Customer-USE01"
$AuthGUID = "76d40466-c458-4d14-adcf-3d1b56d1cd61"

# Your ExpressRoute Gateway information
$myGroupName = "SAP-East-Coast"
$myGWName = "VNet01GW"
$myGWLocation = "East US"

# Define the name for your connection
$myConnectionName = "VNet01GWConnection"

# Create a new connection between the ER Circuit and your Gateway using the Authorization
$gw = Get-AzureRmVirtualNetworkGateway -Name $myGWName -ResourceGroupName $myGroupName
    
New-AzureRmVirtualNetworkGatewayConnection -Name $myConnectionName `
-ResourceGroupName $myGroupName -Location $myGWLocation -VirtualNetworkGateway1 $gw `
-PeerId $PeerID -ConnectionType ExpressRoute -AuthorizationKey $AuthGUID
```

To connect the gateway to more than one ExpressRoute circuit associated with your subscription, you might need to run this step more than once. For example, you're likely going to connect the same virtual network gateway to the ExpressRoute circuit that connects the virtual network to your on-premises network.

## Next steps

- [Additional network requirements for HLI](hana-additional-network-requirements.md)