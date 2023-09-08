---
title: 'Create an ExpressRoute association to Azure Virtual WAN - PowerShell'
description: Learn how to create an ExpressRoute association from your branch site to Azure Virtual WAN using PowerShell.
author: cherylmc
ms.service: virtual-wan
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 08/05/2022
ms.author: cherylmc
---

# Create an ExpressRoute association to Virtual WAN - PowerShell

This article helps you use Virtual WAN to connect to your resources in Azure over an ExpressRoute circuit. For more conceptual information about ExpressRoute in Virtual WAN, see [About ExpressRoute in Virtual WAN](virtual-wan-expressroute-about.md).

## Prerequisites

Verify that you've met the following criteria before beginning your configuration.

* You have a virtual network that you want to connect to. Verify that none of the subnets of your on-premises networks overlap with the virtual networks that you want to connect to. To create a virtual network using PowerShell, see the [Quickstart](../virtual-network/quick-create-powershell.md).

* Your virtual network doesn't have any virtual network gateways. If your virtual network has a gateway (either VPN or ExpressRoute), you must remove all gateways. This configuration requires that virtual networks are connected instead, to the Virtual WAN hub gateway.

* Obtain an IP address range for your virtual hub region. A virtual hub is a virtual network that is created and used by Virtual WAN. The address range that you specify for the virtual hub can't overlap with any of your existing virtual networks that you connect to. It also can't overlap with your address ranges that you connect to on-premises. If you're unfamiliar with the IP address ranges located in your on-premises network configuration, coordinate with someone who can provide those details for you.

* The following ExpressRoute circuit SKUs can be connected to the hub gateway: Local, Standard, and Premium.

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

## <a name="signin"></a>Sign in

[!INCLUDE [sign in](../../includes/vpn-gateway-cloud-shell-ps-login.md)]

## Create a virtual WAN

Before you can create a virtual wan, you have to create a resource group to host the virtual wan or use an existing resource group. Use one of the following examples.

**New resource group** - This example creates a new resource group named testRG in the West US location.

1. Create a resource group.

   ```azurepowershell-interactive
   New-AzResourceGroup -Location "West US" -Name "testRG" 
   ```

1. Create the virtual wan.

   ```azurepowershell-interactive
   $virtualWan = New-AzVirtualWan -ResourceGroupName testRG -Name myVirtualWAN -Location "West US"
   ```

**Existing resource group** - Use the following steps if you want to create the virtual wan in an already existing resource group.

1. Set the variables for the existing resource group.

   ```azurepowershell-interactive
   $resourceGroup = Get-AzResourceGroup -ResourceGroupName "testRG" 
   ```

1. Create the virtual wan.

   ```azurepowershell-interactive
   $virtualWan = New-AzVirtualWan -ResourceGroupName testRG -Name myVirtualWAN -Location "West US"
   ```

## Create a virtual hub and a gateway

Use one of the following examples to create an ExpressRoute gateway in a new or existing virtual hub.

**New virtual hub** - This example creates a default virtual hub named westushub with the specified address prefix and a location for the virtual hub.

1. Create a virtual hub.

   ```azurepowershell-interactive
   $virtualHub = New-AzVirtualHub -VirtualWan $virtualWan -ResourceGroupName "testRG" -Name "westushub" -AddressPrefix "10.0.0.1/24"
   ```

1. Create an ExpressRoute gateway. ExpressRoute gateways are provisioned in units of 2 Gbps. 1 scale unit = 2 Gbps with support up to 10 scale units = 20 Gbps. It takes about 30 minutes for a virtual hub and gateway to fully create.

   ```azurepowershell-interactive
   $expressroutegatewayinhub = New-AzExpressRouteGateway -ResourceGroupName "testRG" -Name "testergw" -VirtualHubId $virtualHub.Id -MinScaleUnits 2
   ```

**Existing virtual hub** - This example creates an ExpressRoute gateway in an existing virtual hub.

```azurepowershell-interactive
$expressroutegatewayinhub = New-AzExpressRouteGateway -MaxScaleUnits <UInt32> -MinScaleUnits 2 -Name 'testExpressRoutegw' -ResourceGroupName 'testRG' -Tag @{"tag1"="value1"; "tag2"="value2"} -VirtualHubName "[hub Name]"
```

## Create an Express Route circuit

The next step is to get the private peering ID of the ExpressRoute circuit. You can either create a new circuit, or get the ID from an existing circuit. Use one of the following examples.

**New circuit** - This example creates a new ExpressRoute circuit and gets its private peering ID.

   ```azurepowershell-interactive
   $ExpressRouteCircuit = New-AzExpressRouteCircuit -ResourceGroupName "testRG" -Name "testExpressRouteCircuit" -Location "West Central US" -SkuTier Premium -SkuFamily MeteredData -ServiceProviderName "Equinix" -PeeringLocation "Silicon Valley" -BandwidthInMbps 200

   Add-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ExpressRouteCircuit -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "123.0.0.0/30" -SecondaryPeerAddressPrefix "123.0.0.4/30" -VlanId 300

   $ExpressRouteCircuit = Set-AzExpressRouteCircuit -ExpressRouteCircuit $ExpressRouteCircuit

   $ExpressRouteCircuitPeeringId = $ExpressRouteCircuit.Peerings[0].Id
   ```

**Existing circuit** - This example gets the details and Private Peering ID from an existing ExpressRoute circuit.

   ```azurepowershell-interactive

   $ExpressRouteCircuit = Get-AzExpressRouteCircuit -ResourceGroupName ["resource group name"] -Name ["expressroute circuit name"]

   $ExpressRouteCircuitPeeringId = $ExpressRouteCircuit.Peerings[0].Id
   ```

## Connect your circuit to the gateway

In this section, you connect an ExpressRoute (ER) circuit to your virtual hub's ExpressRoute gateway.

Use one of the following examples to connect your circuit. Both examples include optional authorization key steps.

**Connect - example ER gateway** - This example connects the ExpressRoute circuit that you created earlier to the virtual hub's ExpressRoute gateway ($expressroutegatewayinhub).

1. Run the following example command:

   ```azurepowershell-interactive
   $ExpressrouteConnection = New-AzExpressRouteConnection -ResourceGroupName $expressroutegatewayinhub.ResourceGroupName -ExpressRouteGatewayName $expressroutegatewayinhub.Name -Name "testConnection" -ExpressRouteCircuitPeeringId $ExpressRouteCircuitPeeringId -RoutingWeight 20
   ```

Optional - Connect by using ExpressRoute circuit's authorization key

1. Create authorization key for the ExpressRoute circuit. For steps, see [How To Create Authorization](../expressroute/expressroute-howto-linkvnet-arm.md).

1. Once authorization is created, get the authorization of the ER circuit.

   ```azurepowershell-interactive
   $authorizations = Get-AzExpressRouteCircuitAuthorization -ExpressRouteCircuit $ExpressRouteCircuit
   ```

1. Get the authorization key for the first key; use the index for other keys (i.e [1]).

   ```azurepowershell-interactive
   $authorizationskey = $authorizationskey[0].AuthorizationKey
   ```

1. Connect the ExpressRoute circuit to the virtual hub using the authorization key.

   ```azurepowershell-interactive
   $ExpressrouteConnection = New-AzExpressRouteConnection -ResourceGroupName $expressroutegatewayinhub.ResourceGroupName -ExpressRouteGatewayName $expressroutegatewayinhub.Name -Name "testConnectionpowershellauthkey" -ExpressRouteCircuitPeeringId $ExpressRouteCircuitPeeringId -RoutingWeight 2 -AuthorizationKey $authprizationskey
   ```

**Connect - existing ER gateway** - The steps in this example help you connect to an existing ExpressRoute gateway.

1. Get the existing virtual hub ExpressRoute gateway details.

   ```azurepowershell-interactive
   $expressroutegatewayinhub = Get-AzExpressRouteGateway -ResourceId "[ERgatewayinhubID]"
   ```

1. Connect the ExpressRoute circuit to the virtual hub ExpressRoute gateway.

      ```azurepowershell-interactive
      $ExpressrouteConnection = New-AzExpressRouteConnection -ResourceGroupName $expressroutegatewayinhub.ResourceGroupName -ExpressRouteGatewayName $expressroutegatewayinhub.Name -Name "testConnection" -ExpressRouteCircuitPeeringId $ExpressRouteCircuitPeeringId -RoutingWeight 20
      ```

Optional - Connect by using ExpressRoute circuit's authorization key.

1. Create authorization key for the ExpressRoute circuit. For steps, see [How To Create Authorization](../expressroute/expressroute-howto-linkvnet-arm.md).

1. Once authorization is created, get the authorization of the ER circuit.

   ```azurepowershell-interactive
   $authorizations = Get-AzExpressRouteCircuitAuthorization -ExpressRouteCircuit $ExpressRouteCircuit
   ```

1. Get the authorization key for the first key; use the index for other keys (i.e [1]).

   ```azurepowershell-interactive
   $authorizationskey = $authorizationskey[0].AuthorizationKey
   ```

1. Connect the ExpressRoute circuit to the virtual hub ExpressRoute gateway.

   ```azurepowershell-interactive
   $ExpressrouteConnection = New-AzExpressRouteConnection -ResourceGroupName $expressroutegatewayinhub.ResourceGroupName -ExpressRouteGatewayName $expressroutegatewayinhub.Name -Name "testConnectionpowershellauthkey" -ExpressRouteCircuitPeeringId $ExpressRouteCircuitPeeringId -RoutingWeight 2 -AuthorizationKey $authprizationskey
   ```

### Test connectivity

After the circuit connection is established, the virtual hub connection status will indicate 'this hub', implying the connection is established to the virtual hub ExpressRoute gateway. Wait approximately 5 minutes before you test connectivity from a client behind your ExpressRoute circuit, for example, a VM in the VNet that you created earlier.


### To change gateway size

In the following example, an ExpressRoute gateway is modified to a different scale unit (3 scale units).

```azurepowershell-interactive
Set-AzExpressRouteGateway -ResourceGroupName "testRG" -Name "testergw" -MinScaleUnits 3
```

## Next Steps

Next, to learn more about ExpressRoute in Virtual WAN, see:

> [!div class="nextstepaction"]
> * [About ExpressRoute in Virtual WAN](virtual-wan-expressroute-about.md)
