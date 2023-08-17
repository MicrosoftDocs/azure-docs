---
title: 'Azure ExpressRoute: Configure Global Reach'
description: This article helps you link ExpressRoute circuits together to make a private network between your on-premises networks and enable Global Reach.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 06/30/2023
ms.author: duau 
ms.custom: devx-track-azurepowershell
---

# Configure ExpressRoute Global Reach

This article helps you configure ExpressRoute Global Reach using PowerShell. For more information, see [ExpressRouteRoute Global Reach](expressroute-global-reach.md).

 ## Before you begin

Before you start configuration, confirm the following information:

* You understand ExpressRoute circuit provisioning [workflows](expressroute-workflows.md).
* Your ExpressRoute circuits are in a provisioned state.
* Azure private peering is configured on your ExpressRoute circuits.
* If you want to run PowerShell locally, verify that the latest version of Azure PowerShell is installed on your computer.

### Working with Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [expressroute-cloudshell](../../includes/expressroute-cloudshell-powershell-about.md)]

## Identify circuits

1. To start the configuration, sign in to your Azure account and select the subscription that you want to use.

   [!INCLUDE [sign in](../../includes/expressroute-cloud-shell-connect.md)]
2. Identify the ExpressRoute circuits that you want use. You can enable ExpressRoute Global Reach between the private peering of any two ExpressRoute circuits, as long as they're located in the supported countries/regions and were created at different peering locations. 

   * If your subscription owns both circuits, you can choose either circuit to run the configuration in the following sections.
   * If the two circuits are in different Azure subscriptions, you need authorization from one Azure subscription. Then you pass in the authorization key when you run the configuration command in the other Azure subscription.

> [!NOTE]
> ExpressRoute Global Reach configurations can only be seen from the configured circuit.

## Enable connectivity

Enable connectivity between your on-premises networks. There are separate sets of instructions for circuits that are in the same Azure subscription, and circuits that are different subscriptions.

### ExpressRoute circuits in the same Azure subscription

1. Use the following commands to get circuit 1 and circuit 2. The two circuits are in the same subscription.

   ```azurepowershell-interactive
   $ckt_1 = Get-AzExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
   $ckt_2 = Get-AzExpressRouteCircuit -Name "Your_circuit_2_name" -ResourceGroupName "Your_resource_group"
   ```
2. Run the following command against circuit 1, and pass in the private peering ID of circuit 2.

   * The private peering ID looks similar to the following example: 

     ```
     /subscriptions/{your_subscription_id}/resourceGroups/{your_resource_group}/providers/Microsoft.Network/expressRouteCircuits/{your_circuit_name}/peerings/AzurePrivatePeering
     ```
   * *-AddressPrefix* must be a /29 IPv4 subnet, for example, `10.0.0.0/29`. We use IP addresses in this subnet to establish connectivity between the two ExpressRoute circuits. You shouldn’t use the addresses in this subnet in your Azure virtual networks, or in your on-premises network.

     ```azurepowershell-interactive
     Add-AzExpressRouteCircuitConnectionConfig -Name 'Your_connection_name' -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering $ckt_2.Peerings[0].Id -AddressPrefix '__.__.__.__/29'
     ```
     
     > [!NOTE]
     > If you wish to enable IPv6 support for ExpressRoute Global Reach, you must specify a /125 IPv6 subnet for *-AddressPrefix* and an *-AddressPrefixType* of *IPv6*.
     
     ```azurepowershell-interactive
     Add-AzExpressRouteCircuitConnectionConfig -Name 'Your_connection_name' -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering $ckt_2.Peerings[0].Id -AddressPrefix '__.__.__.__/125' -AddressPrefixType IPv6
     ```

3. Save the configuration on circuit 1 as follows:

   ```azurepowershell-interactive
   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_1
   ```

When the previous operation completes, you have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

### ExpressRoute circuits in different Azure subscriptions

If the two circuits aren't in the same Azure subscription, you need authorization. In the following configuration, authorization is generated in the circuit 2 subscription, and the authorization key is passed to circuit 1.

1. Generate an authorization key.

   ```azurepowershell-interactive
   $ckt_2 = Get-AzExpressRouteCircuit -Name "Your_circuit_2_name" -ResourceGroupName "Your_resource_group"
   Add-AzExpressRouteCircuitAuthorization -ExpressRouteCircuit $ckt_2 -Name "Name_for_auth_key"
   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_2
   ```

   Make a note of the private peering ID of circuit 2, and the authorization key.
2. Run the following command against circuit 1. Pass in the private peering ID of circuit 2 and the authorization key.

   ```azurepowershell-interactive
   Add-AzExpressRouteCircuitConnectionConfig -Name 'Your_connection_name' -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering "circuit_2_private_peering_id" -AddressPrefix '__.__.__.__/29' -AuthorizationKey '########-####-####-####-############'
   ```
   
     > [!NOTE]
     > If you wish to enable IPv6 support for ExpressRoute Global Reach, you must specify a /125 IPv6 subnet for *-AddressPrefix* and an *-AddressPrefixType* of *IPv6*.

   ```azurepowershell-interactive
   Add-AzExpressRouteCircuitConnectionConfig -Name 'Your_connection_name' -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering $ckt_2.Peerings[0].Id -AddressPrefix '__.__.__.__/125' -AddressPrefixType IPv6 -AuthorizationKey '########-####-####-####-############'
   ```
     
3. Save the configuration on circuit 1.

   ```azurepowershell-interactive
   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_1
   ```

When the previous operation completes, you have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

## Verify the configuration

Use the following command to verify the configuration on the circuit where the configuration was made (for example, circuit 1 in the previous example).
```azurepowershell-interactive
$ckt_1 = Get-AzExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
```

If you simply run *$ckt_1* in PowerShell, you see *CircuitConnectionStatus* in the output. It tells you whether the connectivity is established, **Connected** or **Disconnected**. 

## Disable connectivity

To disable connectivity between your on-premises networks, run the commands against the circuit where the configuration was made (for example, circuit 1 in the previous example).

```azurepowershell-interactive
$ckt_1 = Get-AzExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
Remove-AzExpressRouteCircuitConnectionConfig -Name "Your_connection_name" -ExpressRouteCircuit $ckt_1
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

> [!NOTE]
> To delete an IPv6 Global Reach connection, you must specify an *-AddressPrefixType* of *IPv6* like in the following command.

```azurepowershell-interactive
$ckt_1 = Get-AzExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
Remove-AzExpressRouteCircuitConnectionConfig -Name "Your_connection_name" -ExpressRouteCircuit $ckt_1 -AddressPrefixType IPv6
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

You can run the Get operation to verify the status.

After the previous operation is complete, you no longer have connectivity between your on-premises network through your ExpressRoute circuits.

## Update connectivity configuration

To update the Global Reach connectivity configuration, run the following command against one of the ExpressRoute circuits.

```azurepowershell-interactive
$ckt_1 = Get-AzExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
$ckt_2 = Get-AzExpressRouteCircuit -Name "Your_circuit_2_name" -ResourceGroupName "Your_resource_group"
$addressSpace = 'aa:bb::0/125'
$addressPrefixType = 'IPv6'
Set-AzExpressRouteCircuitConnectionConfig -Name "Your_connection_name" -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering $ckt_2.Peerings[0].Id -AddressPrefix $addressSpace -AddressPrefixType $addressPrefixType
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

## Next steps
1. [Learn more about ExpressRoute Global Reach](expressroute-global-reach.md)
2. [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
3. [Link an ExpressRoute circuit to an Azure virtual network](expressroute-howto-linkvnet-arm.md)
