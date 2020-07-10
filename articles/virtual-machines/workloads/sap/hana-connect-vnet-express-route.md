---
title: Connectivity set up from virtual network to SAP HANA on Azure (large instances) | Microsoft Docs
description: Connectivity set up from virtual network to use SAP HANA on Azure (large instances).
services: virtual-machines-linux
documentationcenter: 
author: msjuergent
manager: bburns
editor:

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/25/2019
ms.author: juergent
ms.custom: H1Hack27Feb2017

---

# Connect a virtual network to HANA large instances

After you've created an Azure virtual network, you can connect that network to SAP HANA on Azure large instances. Create an Azure ExpressRoute gateway on the virtual network. This gateway enables you to link the virtual network to the ExpressRoute circuit that connects to the customer tenant on the HANA Large Instance stamp.

> [!NOTE] 
> This step can take up to 30 minutes to complete. The new gateway is created in the designated Azure subscription, and then connected to the specified Azure virtual network.

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

If a gateway already exists, check whether it's an ExpressRoute gateway or not. If it is not an ExpressRoute gateway, delete the gateway, and re-create it as an ExpressRoute gateway. If an ExpressRoute gateway is already established, see the following section of this article, "Link virtual networks." 

- Use either the [Azure portal](https://portal.azure.com/) or PowerShell to create an ExpressRoute VPN gateway connected to your virtual network.
  - If you use the Azure portal, add a new **Virtual Network Gateway**, and then select **ExpressRoute** as the gateway type.
  - If you use PowerShell, first download and use the latest [Azure PowerShell SDK](https://azure.microsoft.com/downloads/). 
 
The following commands create an ExpressRoute gateway. The texts preceded by a _$_ are user-defined variables that should be updated with your specific information.

```powershell
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
$vnet = Get-AzVirtualNetwork -Name $myVNetName -ResourceGroupName $myGroupName
$subnet = Get-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
New-AzPublicIpAddress -Name $myGWPIPName -ResourceGroupName $myGroupName `
-Location $myAzureRegion -AllocationMethod Dynamic
$gwpip = Get-AzPublicIpAddress -Name $myGWPIPName -ResourceGroupName $myGroupName
$gwipconfig = New-AzVirtualNetworkGatewayIpConfig -Name $myGWConfig -SubnetId $subnet.Id `
-PublicIpAddressId $gwpip.Id

New-AzVirtualNetworkGateway -Name $myGWName -ResourceGroupName $myGroupName -Location $myAzureRegion `
-IpConfigurations $gwipconfig -GatewayType ExpressRoute `
-GatewaySku $myGWSku -VpnType PolicyBased -EnableBgp $true
```

In this example, the HighPerformance gateway SKU was used. Your options are HighPerformance or UltraPerformance as the only gateway SKUs that are supported for SAP HANA on Azure (large instances).

> [!IMPORTANT]
> For HANA large instances of the Type II class SKU, you must use the UltraPerformance Gateway SKU.

## Link virtual networks

The Azure virtual network now has an ExpressRoute gateway. Use the authorization information provided by Microsoft to connect the ExpressRoute gateway to the SAP HANA Large Instances ExpressRoute circuit. You can connect by using the Azure portal or PowerShell. The PowerShell instructions are as follows. 

Run the following commands for each ExpressRoute gateway by using a different AuthGUID for each connection. The first two entries shown in the following script come from the information provided by Microsoft. Also, the AuthGUID is specific for every virtual network and its gateway. If you want to add another Azure virtual network, you need to get another AuthID for your ExpressRoute circuit that connects HANA large instances into Azure from Microsoft. 

```powershell
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
$gw = Get-AzVirtualNetworkGateway -Name $myGWName -ResourceGroupName $myGroupName
    
New-AzVirtualNetworkGatewayConnection -Name $myConnectionName `
-ResourceGroupName $myGroupName -Location $myGWLocation -VirtualNetworkGateway1 $gw `
-PeerId $PeerID -ConnectionType ExpressRoute -AuthorizationKey $AuthGUID -ExpressRouteGatewayBypass
```

> [!NOTE]
> The last parameter in the command New-AzVirtualNetworkGatewayConnection, **ExpressRouteGatewayBypass** is a new parameter that enables ExpressRoute Fast Path. A functionality that reduces network latency between your HANA Large Instance units and Azure VMs. The functionality got added in May 2019. For more details, check the article [SAP HANA (Large Instances) network architecture](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-network-architecture). Make sure that you are running the latest version of PowerShell cmdlets before running the commands.

To connect the gateway to more than one ExpressRoute circuit associated with your subscription, you might need to run this step more than once. For example, you're likely going to connect the same virtual network gateway to the ExpressRoute circuit that connects the virtual network to your on-premises network.

## Applying ExpressRoute Fast Path to existing HANA Large Instance ExpressRoute circuits
The documentation so far explained how to connect a new ExpressRoute circuit that got created with a HANA Large Instance deployment to an Azure ExpressRoute gateway of one of your Azure virtual networks. But many customers already have their ExpressRoute circuits setup already and have their virtual networks connected to HANA Large Instances already. As the new ExpressRoute Fast Path is reducing network latency, it is recommended that you apply the change to use this functionality. The commands to connect a new ExpreesRoute circuit and to change an existing ExpressRoute Circuit are the same. As a result you need to run this sequence of PowerShell commands to change an existing circuit to use 

```powershell
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
$gw = Get-AzVirtualNetworkGateway -Name $myGWName -ResourceGroupName $myGroupName
    
New-AzVirtualNetworkGatewayConnection -Name $myConnectionName `
-ResourceGroupName $myGroupName -Location $myGWLocation -VirtualNetworkGateway1 $gw `
-PeerId $PeerID -ConnectionType ExpressRoute -AuthorizationKey $AuthGUID -ExpressRouteGatewayBypass
```

It is important that you add the last parameter as displayed above to enable the ExpressRoute Fast Path functionality


## ExpressRoute Global Reach
As you want to enable Global Reach for one or both of the two scenarios:

 - HANA System Replication without any additional proxies or firewalls
 - Copying backups between HANA Large Instance units in two different regions to perform system copies or system refreshes

you need consider that:

- You need to provide an address space range of a /29 address space. That address range may not overlap with any of the other address space ranges that you used so far connecting HANA Large Instances to Azure and may not overlap with any of your IP address ranges you used somewhere else in Azure or on-premises.
- There is a limitation on the ASNs (Autonomous System Number) that can be used to advertise your on-premises routes to HANA Large Instances. Your on-premises must not advertise any routes with private ASNs in the range of 65000 – 65020 or 65515. 
- For the scenario of connecting on-premises direct access to HANA Large instances, you need to calculate a fee for the circuit that connects you to Azure. For prices, check the prices for [Global Reach Add-On](https://azure.microsoft.com/pricing/details/expressroute/).

To get one or both of the scenarios applied to your deployment, open a support message with Azure as described in [Open a support request for HANA large Instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-li-portal#open-a-support-request-for-hana-large-instances)

Data that is needed and keywords that you need to use for Microsoft to be able to route and execute on your request, looks like:

- Service: SAP HANA Large Instance
- Problem type: Configuration and Setup
- Problem subtype: My problem is not listed above
- Subject 'Modify my Network - add Global Reach'
- Details: 'Add Global Reach to HANA Large Instance to HANA Large Instance tenant or 'Add Global Reach to on-premises to HANA Large Instance tenant.
- Additional details for the HANA Large Instance to HANA Large Instance tenant case: You need to define the **two Azure regions** where the two tenants to connect are located **AND** you need to submit the **/29 IP address range**
- Additional details for the on-premises to HANA Large Instance tenant case: You need to define the **Azure Region** where the HANA Large Instance tenant is deployed you want to connect to directly. Additionally you need to provide the **Auth GUID** and **Circuit Peer ID** that you received when you established your ExpressRoute circuit between on-premises and Azure. Additionally, you need to name your **ASN**. The last deliverable is a **/29 IP address range** for ExpressRoute Global Reach.

> [!NOTE]
> If you want to have both cases handled, you need to supply two different /29 IP address ranges that do not overlap with any other IP address range used so far. 




## Next steps

- [Additional network requirements for HLI](hana-additional-network-requirements.md)
