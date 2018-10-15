---
title: Connectivity setup from virtual network to SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Connectivity setup from virtual network to use SAP HANA on Azure (Large Instances).
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

# Connecting a VNet to HANA Large Instance ExpressRoute

As you defined all the IP address ranges and now got the data back from Microsoft, you can start connecting the VNet you created before to HANA Large Instances. Once the Azure VNet is created, an ExpressRoute gateway must be created on the VNet to link the VNet to the ExpressRoute circuit that connects to the customer tenant on the Large Instance stamp.

> [!NOTE] 
> This step can take up to 30 minutes to complete, as the new gateway is created in the designated Azure subscription and then connected to the specified Azure VNet.

If a gateway already exists, check whether it is an ExpressRoute gateway or not. If not, the gateway must be deleted and recreated as an ExpressRoute gateway. If an ExpressRoute gateway is already established, since the Azure VNet is already connected to the ExpressRoute circuit for on-premises connectivity, proceed to the Linking VNets section below.

- Use either the (new) [Azure portal](https://portal.azure.com/), or PowerShell to create an ExpressRoute VPN gateway connected to your VNet.
  - If you use the Azure portal, add a new **Virtual Network Gateway** and then select **ExpressRoute** as the gateway type.
  - If you chose PowerShell instead, first download and use the latest [Azure PowerShell SDK](https://azure.microsoft.com/downloads/) to ensure an optimal experience. The following commands create an ExpressRoute gateway. The texts preceded by a _$_ are user defined variables that need to be updated with your specific information.

```PowerShell
# These Values should already exist, update to match your environment
$myAzureRegion = "eastus"
$myGroupName = "SAP-East-Coast"
$myVNetName = "VNet01"

# These values are used to create the gateway, update for how you wish the GW components to be named
$myGWName = "VNet01GW"
$myGWConfig = "VNet01GWConfig"
$myGWPIPName = "VNet01GWPIP"
$myGWSku = "HighPerformance" # Supported values for HANA Large Instances are: HighPerformance or UltraPerformance

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

In this example, the HighPerformance gateway SKU was used. Your options are HighPerformance or UltraPerformance as the only gateway SKUs that are supported for SAP HANA on Azure (Large Instances).

> [!IMPORTANT]
> For HANA Large Instances of the Type II classs SKU, the usage of the UltraPerformance Gateway SKU is mandatory.

**Linking VNets**

Now that the Azure VNet has an ExpressRoute gateway, you use the authorization information provided by Microsoft to connect the ExpressRoute gateway to the SAP HANA on Azure (Large Instances) ExpressRoute circuit created for this connectivity. This step can be performed using the Azure portal or PowerShell. The portal is recommended, however PowerShell instructions are as follows. 

- You execute the following commands for each VNet gateway using a different AuthGUID for each connection. The first two entries shown in the script following come from the information provided by Microsoft. Also, the AuthGUID is specific for every VNet and its gateway. Means, if you want to add another Azure VNet, you need to get another AuthID for your ExpressRoute circuit that connects HANA Large Instances into Azure. 

```PowerShell
# Populate with information provided by Microsoft Onboarding team
$PeerID = "/subscriptions/9cb43037-9195-4420-a798-f87681a0e380/resourceGroups/Customer-USE-Circuits/providers/Microsoft.Network/expressRouteCircuits/Customer-USE01"
$AuthGUID = "76d40466-c458-4d14-adcf-3d1b56d1cd61"

# Your ExpressRoute Gateway Information
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

If you want to connect the gateway to multiple ExpressRoute circuits that are associated with your subscription, you may need to execute this step more than once. For example, you are likely going to connect the same VNet Gateway to the ExpressRoute circuit that connects the VNet to your on-premises network.

**Next steps**

- Refer [Additional network requirements for HLI](hana-additional-network-requirements.md).