---
title: 'Azure ExpressRoute: Configure Global Reach using the Azure portal'
description: This article helps you link ExpressRoute circuits together to make a private network between your on-premises networks and enable Global Reach using the Azure portal.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: how-to
ms.date: 10/15/2020
ms.author: duau

---

# Configure ExpressRoute Global Reach

This article helps you configure ExpressRoute Global Reach using PowerShell. For more information, see [ExpressRouteRoute Global Reach](expressroute-global-reach.md).

 ## Before you begin

Before you start configuration, confirm the following:

* You understand ExpressRoute circuit provisioning [workflows](expressroute-workflows.md).
* Your ExpressRoute circuits are in a provisioned state.
* Azure private peering is configured on your ExpressRoute circuits.
* If you want to run PowerShell locally, verify that the latest version of Azure PowerShell is installed on your computer.

## Identify circuits

1. From a browser, navigate to the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

2. Identify the ExpressRoute circuits that you want use. You can enable ExpressRoute Global Reach between the private peering of any two ExpressRoute circuits, as long as they're located in the supported countries/regions and were created at different peering locations. 

   * If your subscription owns both circuits, you can choose either circuit to run the configuration in the following sections.
   * If the two circuits are in different Azure subscriptions, you need authorization from one Azure subscription. Then you pass in the authorization key when you run the configuration command in the other Azure subscription.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/expressroute-circuit-global-reach-list.png" alt-text="List of ExpressRoute circuits":::

## Enable connectivity

Enable connectivity between your on-premises networks. There are separate sets of instructions for circuits that are in the same Azure subscription, and circuits that are different subscriptions.

### ExpressRoute circuits in the same Azure subscription

1. Select the **Azure private** peering configuration. 

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/expressroute-circuit-private-peering.png" alt-text="ExpressRoute peering overview":::

1. Select the **Enable Global Reach** checkbox and then click **Add Global Reach** to open the *Add Global Reach* configuration page.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/private-peering-enable-global-reach.png" alt-text="Enable global reach from private peering":::

1. On the *Add Global Reach* configuration page, give a name to this configuration. Select the *ExpressRoute circuit* you want to connect this circuit to and enter in a **/29 IPv4** or a **/125 IPv6** subnet for the *Global Reach subnet*. We use IP addresses in this subnet to establish connectivity between the two ExpressRoute circuits. You shouldn’t use the addresses in this subnet in your Azure virtual networks, or in your on-premises network. Click **Add** to add the circuit to the private peering configuration.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/add-global-reach-configuration.png" alt-text="Global Reach configuration page":::

1. Click **Save** to complete the Global Reach configuration. When the previous operation completes, you will have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

    :::image type="content" source="./media/expressroute-howto-set-global-reach-portal/save-private-peering-configuration.png" alt-text="Saving private peering configuration":::

### ExpressRoute circuits in different Azure subscriptions

If the two circuits are not in the same Azure subscription, you need authorization. In the following configuration, authorization is generated in the circuit 2 subscription, and the authorization key is passed to circuit 1.

1. Generate an authorization key.

   ```azurepowershell-interactive
   $ckt_2 = Get-AzExpressRouteCircuit -Name "Your_circuit_2_name" -ResourceGroupName "Your_resource_group"
   Add-AzExpressRouteCircuitAuthorization -ExpressRouteCircuit $ckt_2 -Name "Name_for_auth_key"
   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_2
   ```

   Make a note of the private peering ID of circuit 2, as well as the authorization key.
2. Run the following command against circuit 1. Pass in the private peering ID of circuit 2 and the authorization key.

   ```azurepowershell-interactive
   Add-AzExpressRouteCircuitConnectionConfig -Name 'Your_connection_name' -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering "circuit_2_private_peering_id" -AddressPrefix '__.__.__.__/29' -AuthorizationKey '########-####-####-####-############'
   ```
3. Save the configuration on circuit 1.

   ```azurepowershell-interactive
   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_1
   ```

When the previous operation completes, you will have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

## Verify the configuration

Use the following command to verify the configuration on the circuit where the configuration was made (for example, circuit 1 in the previous example).
```azurepowershell-interactive
$ckt1 = Get-AzExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
```

If you simply run *$ckt1* in PowerShell, you see *CircuitConnectionStatus* in the output. It tells you whether the connectivity is established, "Connected", or "Disconnected". 

## Disable connectivity

To disable connectivity between your on-premises networks, run the commands against the circuit where the configuration was made (for example, circuit 1 in the previous example).

```azurepowershell-interactive
$ckt1 = Get-AzExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
Remove-AzExpressRouteCircuitConnectionConfig -Name "Your_connection_name" -ExpressRouteCircuit $ckt_1
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt_1
```

You can run the Get operation to verify the status.

After the previous operation is complete, you no longer have connectivity between your on-premises network through your ExpressRoute circuits.

## Next steps
1. [Learn more about ExpressRoute Global Reach](expressroute-global-reach.md)
2. [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
3. [Link an ExpressRoute circuit to an Azure virtual network](expressroute-howto-linkvnet-arm.md)
