---
title: 'Azure ExpressRoute: Configure Global Reach'
description: This article helps you link ExpressRoute circuits together to make a private network between your on-premises networks and enable Global Reach.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 01/31/2025
ms.author: duau 
ms.custom: devx-track-azurepowershell
---

# Configure ExpressRoute Global Reach
This article helps you configure ExpressRoute Global Reach using PowerShell. For more information, see [ExpressRoute Global Reach](expressroute-global-reach.md).

## Before you begin

Before you start the configuration, ensure the following prerequisites:

* You understand the ExpressRoute circuit provisioning [workflows](expressroute-workflows.md).
* Your ExpressRoute circuits are in a provisioned state.
* Azure private peering is configured on your ExpressRoute circuits.
* If you want to run PowerShell locally, verify that the latest version of Azure PowerShell is installed on your computer.

### Working with Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [expressroute-cloudshell](../../includes/expressroute-cloudshell-powershell-about.md)]

## Identify circuits

1. Sign in to your Azure account and select the subscription you want to use.

   [!INCLUDE [sign in](../../includes/expressroute-cloud-shell-connect.md)]
2. Identify the ExpressRoute circuits you want to use. You can enable ExpressRoute Global Reach between the private peering of any two ExpressRoute circuits, as long as they're located in supported countries/regions and were created at different peering locations.

   * If your subscription owns both circuits, you can choose either circuit to run the configuration in the following sections.
   * If the two circuits are in different Azure subscriptions, you need authorization from one Azure subscription. Then you pass in the authorization key when you run the configuration command in the other Azure subscription.

> [!NOTE]
> ExpressRoute Global Reach configurations can only be seen from the configured circuit.

## Enable connectivity

Enable connectivity between your on-premises networks. There are separate instructions for circuits in the same Azure subscription and circuits in different subscriptions.

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

If the two circuits are in different Azure subscriptions, you need authorization. To configure the connection, follow these steps:

1. **Generate an authorization key in the subscription of circuit 2:**

   ```azurepowershell-interactive
   $ckt_2 = Get-AzExpressRouteCircuit -Name "Your_circuit_2_name" -ResourceGroupName "Your_resource_group"
   Add-AzExpressRouteCircuitAuthorization -ExpressRouteCircuit $ckt_2 -Name "Name_for_auth_key"
   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_2
   ```

   Note the private peering ID of circuit 2 and the authorization key.

2. **Configure the connection in the subscription of circuit 1:**

   Run the following command against circuit 1, passing in the private peering ID of circuit 2 and the authorization key.

   ```azurepowershell-interactive
   Add-AzExpressRouteCircuitConnectionConfig -Name 'Your_connection_name' -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering "circuit_2_private_peering_id" -AddressPrefix '__.__.__.__/29' -AuthorizationKey '########-####-####-####-############'
   ```

   > [!NOTE]
   > To enable IPv6 support for ExpressRoute Global Reach, specify a /125 IPv6 subnet for *-AddressPrefix* and an *-AddressPrefixType* of *IPv6*.

   ```azurepowershell-interactive
   Add-AzExpressRouteCircuitConnectionConfig -Name 'Your_connection_name' -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering $ckt_2.Peerings[0].Id -AddressPrefix '__.__.__.__/125' -AddressPrefixType IPv6 -AuthorizationKey '########-####-####-####-############'
   ```

3. **Save the configuration on circuit 1:**

   ```azurepowershell-interactive
   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_1
   ```

After completing these steps, you'll have connectivity between your on-premises networks through the two ExpressRoute circuits.

## Verify the configuration

Use the following command to verify the configuration on the circuit where the configuration was made (for example, circuit 1 in the previous example).

```azurepowershell-interactive
$ckt_1 = Get-AzExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
```

To check the *CircuitConnectionStatus* run `$ckt_1` in PowerShell. It indicates whether the connectivity is **Connected** or **Disconnected**.

## Disable connectivity

To disable connectivity between your on-premises networks, run the following commands against the circuit where the configuration was made (for example, circuit 1 in the previous example).

```azurepowershell-interactive
$ckt_1 = Get-AzExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
Remove-AzExpressRouteCircuitConnectionConfig -Name "Your_connection_name" -ExpressRouteCircuit $ckt_1
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

> [!NOTE]
> To delete an IPv6 Global Reach connection, specify an *-AddressPrefixType* of *IPv6* as follows.

```azurepowershell-interactive
$ckt_1 = Get-AzExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
Remove-AzExpressRouteCircuitConnectionConfig -Name "Your_connection_name" -ExpressRouteCircuit $ckt_1 -AddressPrefixType IPv6
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

You can run the `GET` operation to verify the status.

After completing these steps, you'll no longer have connectivity between your on-premises networks through your ExpressRoute circuits.

## Update connectivity configuration

To update the Global Reach connectivity configuration, follow these steps:

1. Retrieve the ExpressRoute circuits:

   ```azurepowershell-interactive
   $ckt_1 = Get-AzExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
   $ckt_2 = Get-AzExpressRouteCircuit -Name "Your_circuit_2_name" -ResourceGroupName "Your_resource_group"
   ```

2. Define the new address space and address prefix type:

   ```azurepowershell-interactive
   $addressSpace = 'aa:bb::0/125'
   $addressPrefixType = 'IPv6'
   ```

3. Update the connectivity configuration:

   ```azurepowershell-interactive
   Set-AzExpressRouteCircuitConnectionConfig -Name "Your_connection_name" -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering $ckt_2.Peerings[0].Id -AddressPrefix $addressSpace -AddressPrefixType $addressPrefixType
   ```

4. Save the updated configuration:

   ```azurepowershell-interactive
   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_1
   ```

## Next steps
1. [Learn more about ExpressRoute Global Reach](expressroute-global-reach.md)
2. [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
3. [Link an ExpressRoute circuit to an Azure virtual network](expressroute-howto-linkvnet-arm.md)
