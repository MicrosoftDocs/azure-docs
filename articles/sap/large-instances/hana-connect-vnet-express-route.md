---
title: Connect a virtual network to SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Learn how to connect a virtual network to SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: lauradolan
manager: bburns
editor:
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 6/1/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017, devx-track-azurepowershell

---

# Connect a virtual network to HANA Large Instances

You've [created an Azure virtual network](hana-connect-azure-vm-large-instances.md). You can now connect that network to SAP HANA Large Instances (otherwise known as BareMetal Infrastructure instances). In this article, we'll look at the steps you'll need to take.

## Create an Azure ExpressRoute gateway on the virtual network

First, create an Azure ExpressRoute gateway on your virtual network. This gateway allows you to link the virtual network to the ExpressRoute circuit that connects to your tenant on the HANA Large Instance stamp.

> [!NOTE] 
> This step can take up to 30 minutes to complete. You create the new gateway in the designated Azure subscription and then connect it to the specified Azure virtual network.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

- If a gateway already exists, check whether it's an ExpressRoute gateway. If it isn't an ExpressRoute gateway, delete the gateway and recreate it as an ExpressRoute gateway. If an ExpressRoute gateway is already established, skip to the following section of this article, [Link virtual networks](#link-virtual-networks). 

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
    $myGWSku = "UltraPerformance" # Supported values for HANA large instances are: UltraPerformance
    
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

The only supported gateway SKU for SAP HANA on Azure (Large Instances) is **UltraPerformance**.

## Link virtual networks

The Azure virtual network now has an ExpressRoute gateway. Use the authorization information provided by Microsoft to connect the ExpressRoute gateway to the SAP HANA Large Instances ExpressRoute circuit. You can connect by using the Azure portal or PowerShell. The PowerShell instructions are as follows. 

Run the following commands for each ExpressRoute gateway by using a different AuthGUID for each connection. The first two entries shown in the following script come from the information provided by Microsoft. Also, the AuthGUID is specific for every virtual network and its gateway. If you want to add another Azure virtual network, you need to get another AuthID for your ExpressRoute circuit that connects HANA Large Instances into Azure from Microsoft. 

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
> The last parameter in the command New-AzVirtualNetworkGatewayConnection, **ExpressRouteGatewayBypass**, is a new parameter that enables ExpressRoute FastPath. This functionality was added in May 2019 and reduces network latency between your HANA Large Instance units and Azure VMs. For more information, see [SAP HANA (Large Instances) network architecture](./hana-network-architecture.md). Make sure you're running the latest version of PowerShell cmdlets before running the commands.

You may need to connect the gateway to more than one ExpressRoute circuit associated with your subscription. In that case, you'll need to run this step more than once. For example, you're likely to connect the same virtual network gateway to the ExpressRoute circuit that connects the virtual network to your on-premises network.

## Applying ExpressRoute FastPath to existing HANA Large Instance ExpressRoute circuits
You've seen how to connect a new ExpressRoute circuit created with a HANA Large Instance deployment to an Azure ExpressRoute gateway on one of your Azure virtual networks. But what if you already have your ExpressRoute circuits set up, and your virtual networks are already connected to HANA Large Instances? 

The new ExpressRoute FastPath reduces network latency. We recommend you apply the change to take advantage of this reduced latency. The commands to connect a new ExpressRoute circuit are the same as to change an existing ExpressRoute circuit. So you'll need to run this sequence of PowerShell commands to change an existing circuit. 

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

It's important that you add the last parameter as displayed above to enable the ExpressRoute FastPath functionality.


## ExpressRoute Global Reach

Enable Global Reach for either of the following scenarios:

 - HANA system replication without any added proxies or firewalls.
 - Copying backups between HANA Large Instance units in two different regions to make system copies or for system refreshes.

To enable Global Reach:

- Provide an address space range of a /29 address space. That address range may not overlap with any of the other address space ranges you used so far connecting HANA Large Instances to Azure. The address range should also not overlap with any of the IP address ranges you used elsewhere in Azure or on-premises.
- There's a limitation on the autonomous system numbers (ASNs) that can be used to advertise your on-premises routes to HANA Large Instances. Your on-premises mustn't advertise any routes with private ASNs in the range of 65000 – 65020 or 65515. 
- When connecting on-premises direct access to HANA Large instances, you need to calculate a fee for the circuit that connects you to Azure. For more information, check the pricing for [Global Reach Add-On](https://azure.microsoft.com/pricing/details/expressroute/).

To have one or both of the scenarios applied to your deployment, open a support message with Azure as described in [Open a support request for HANA large Instances](./hana-li-portal.md#open-a-support-request-for-hana-large-instances)

The data and keywords you'll need to use for Microsoft to route and execute your request are as follows:

- Service: SAP HANA Large Instance
- Problem type: Configuration and Setup
- Problem subtype: My problem isn't listed above.
- Subject "Modify my Network - add Global Reach"
- Details: "Add Global Reach to HANA Large Instance to HANA Large Instance tenant." or "Add Global Reach to on-premises to HANA Large Instance tenant."
- Additional details for the HANA Large Instance to HANA Large Instance tenant case: You need to define the **two Azure regions** where the two tenants to connect are located, **AND** you need to submit the **/29 IP address range**.
- Additional details for the on-premises to HANA Large Instance tenant case: 
    - Define the **Azure Region** where the HANA Large Instance tenant is deployed that you want to directly connect to. 
    - Provide the **Auth GUID** and **Circuit Peer ID** you received when you established your ExpressRoute circuit between on-premises and Azure. 
    - Name your **ASN**. 
    - Provide a **/29 IP address range** for ExpressRoute Global Reach.

> [!NOTE]
> If you want to have both cases handled, you need to supply two different /29 IP address ranges that don't overlap with any other IP address range used so far. 

## Next steps

Learn about other network requirements you may have to deploy SAP HANA Large Instances on Azure.

> [!div class="nextstepaction"]
> [Additional network requirements for Large Instances](hana-additional-network-requirements.md)
